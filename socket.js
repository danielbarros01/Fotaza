import { io } from "./index.js";
import getUserSocket from './Middlewares/getUserSocket.js'
import { Op } from "sequelize";
import { v4 as uuidv4 } from 'uuid'
import { Publication, Conversation, Message, RightOfUse, User, Transaction } from './models/Index.js'
import moment from "moment";

function execSocket() {

    io.on('connection', async (socket) => {
        await getUserSocket(socket, (err) => {
            if (err) {
                console.error('Error en el middleware getUserSocket:', err.message);
                socket.disconnect();
            } else {
                console.log('Usuario conectado:', socket.user)
            }
        })

        //Cuando el usuario se conecta unirlo a todas sus conversaciones
        try {
            const conversations = await (async function joinConversations() {
                const conversations = await Conversation.findAll({
                    where: {
                        [Op.or]: {
                            userId1: socket.user.id,
                            userId2: socket.user.id,
                        }
                    }
                })

                return conversations
            })()

            conversations.forEach(c => {
                socket.join(`conversation-${c.id}`)
            })
            //----
        } catch (error) {
            console.error(error)
        }



        socket.on('acquire', async ({ publicationId, message: messageClient }) => {
            console.log('Adquirir la publicacion', publicationId)
            try {
                //Validar que la publicacion exista, si es acquire significa que la publicacion debe ser de transferencia unica
                const publication = await Publication.findOne({
                    where: {
                        id: publicationId,
                        [Op.or]: [
                            { type: 'sale', typeSale: 'unique' },
                            { '$license.name$': 'Copyright' }
                        ]
                    },
                    include: [{ model: RightOfUse, as: 'license' }]
                })

                if (!publication) {
                    //Le decimos al cliente que no se puede
                    return io.emit('acquire-not')
                } else {
                    //Creamos la transaccion
                    const [transaction, flag] = await Transaction.findOrCreate({
                        where: {
                            publication_id: publication.id,
                            user_id: socket.user.id,
                            [Op.or]: [{ status: 'waiting' }, { status: 'hold' }]
                        },
                        include: [{ model: Publication, as: 'publication' }],
                        defaults: {
                            id: uuidv4(),
                            user_id: socket.user.id,
                            publication_id: publication.id,
                            date: new Date(),
                            price: publication.price,
                            status: 'waiting',
                            currency: publication.currency,
                            typeSale: publication.typeSale
                        }
                    })

                    if (messageClient.trim().length < 1) {
                        return io.emit('error', { message: 'Escribe un mensaje' })
                    }

                    //Creamos la conversacion si no existe
                    const conversation = await Conversation.findOrCreate({
                        where: {
                            [Op.or]: [
                                { userId1: socket.user.id, userId2: publication.user_id },
                                { userId1: publication.user_id, userId2: socket.user.id }
                            ]

                        },
                        defaults: {
                            userId1: socket.user.id,
                            userId2: publication.user_id,
                            visibleUser1: true,
                            visibleUser2: true
                        }
                    })

                    //Los usuarios deben poder ver de nuevo la conversacion aunque la hayan borrado
                    if (conversation[0].visibleUser1 === false || conversation[0].visibleUser2 === false) {
                        conversation[0].visibleUser1 = true
                        conversation[0].visibleUser2 = true

                        await conversation[0].save()
                    }

                    //Guardamos el mensaje en la base de datos
                    const msg = await Message.create(
                        {
                            text: messageClient.trim(),
                            date: new Date(),
                            purchase: true,
                            user_id: socket.user.id,
                            conversation_id: conversation[0].id,
                            transaction_id: transaction.id,
                            read: false
                        })

                    //Agrego el usuario, la conversacion y la publicacion
                    const message = { ...msg.get() }
                    message.user = socket.user
                    message.conversation = conversation[0]
                    message.transaction = transaction

                    //Agrego la propiedad ultimo mensaje a la conversacion
                    const conversationData = { ...message.conversation.get() }
                    conversationData.lastMessage = { text: messageClient.trim(), date: moment().format('LT') }
                    message.conversation = conversationData

                    //Le decimos al cliente que si se puede
                    io.emit('acquire-ok', conversation[0].id)

                    //Obtener el socket del usuario para unirlo a la conversacion
                    const socketToUser = await getSocketByUserId(publication.user_id, io.sockets.sockets)

                    if (socketToUser) {
                        console.log(`Usuario ${publication.user_id} encontrado. Socket ID: ${socketToUser.id}`);
                        await socketToUser.join(`conversation-${conversation[0].id}`)
                        //Avisamos al cliente del nuevo mensaje
                        io.to(`conversation-${conversation[0].id}`).emit('new-message-ok',
                            { message, msgUserId: msg.user_id, fromUser: socket.user.id, toUser: publication.user_id, transaction })
                    }
                }
            } catch (error) {
                //Le decimos al cliente que no se puede
                io.emit('acquire-not')
            }
        })

        socket.on('new-message', async ({ message: messageClient, toUser }) => {
            try {
                //Valido que la conversacion exista
                const conversation = await Conversation.findOne({
                    where: {
                        [Op.or]: [
                            { userId1: socket.user.id, userId2: toUser },
                            { userId1: toUser, userId2: socket.user.id }
                        ]
                    }
                })

                //Validaciones
                if (!conversation) {
                    return io.emit('error', { message: 'La conversación no existe' })
                }

                if (messageClient.trim().length < 1) {
                    return io.emit('error', { message: 'Escribe un mensaje' })
                }
                //----

                //Guardamos el mensaje en la base de datos
                const msg = await Message.create({
                    text: messageClient.trim(),
                    date: new Date(),
                    purchase: false,
                    user_id: socket.user.id,
                    conversation_id: conversation.id,
                    read: false
                })

                const message = { ...msg.get() }
                message.user = socket.user

                //Le decimos al cliente que se guardo el mensaje
                io.to(`conversation-${conversation.id}`).emit('new-message-ok',
                    { message, msgUserId: msg.user_id, fromUser: socket.user.id, toUser, })

            } catch (error) {
                io.emit('error', { message: 'Error al querer enviar el mensaje' })
            }
        })

        socket.on('read-messages', async (conversationId) => {
            try {
                const { count, rows: messages } = await Message.findAndCountAll({
                    where: {
                        [Op.not]: { user_id: socket.user.id }, //Que no me pertenezcan a mi, pero que si compartamos con el otro usuario
                        read: false,
                    },
                    include: [{
                        model: Conversation,
                        as: 'conversation',
                        where: {
                            id: conversationId,
                            [Op.or]: {
                                userId1: socket.user.id, userId2: socket.user.id
                            }
                        }
                    }]
                })

                // Cambiamos todos los mensajes a leído
                const updatePromises = messages.map(async (message) => {
                    message.read = true
                    await message.save()
                });

                // Esperamos a que todas las promesas de actualización se resuelvan
                await Promise.all(updatePromises)

                const conversation = await Conversation.findOne({
                    where: {
                        id: conversationId,
                        [Op.or]: { userId1: socket.user.id, userId2: socket.user.id }
                    }
                })

                //Cual de los usuarios es el que lo esta leyendo, busque al otro usuario en el cliente
                let toUserId;
                if (socket.user.id === conversation.userId1) {
                    toUserId = conversation.userId2
                } else {
                    toUserId = conversation.userId1
                }

                io.to(`conversation-${conversation.id}`).emit('read-messages-ok', { message: 'Mensajes leidos', total: count, conversationId, toUserId })
            } catch (error) {
                io.emit('error', { message: 'Error al querer leer los mensajes' })
            }
        })

        socket.on('accept-transaction', async ({ publicationId, requestingUserId }) => {
            const { user } = socket

            //Validaciones
            if (!requestingUserId) {
                return io.emit('error', { message: 'Debe enviar quien solicita la publicacion' })
            }

            //Valido que la conversacion exista
            const conversation = await Conversation.findOne({
                where: {
                    [Op.or]: [
                        { userId1: user.id, userId2: requestingUserId },
                        { userId1: requestingUserId, userId2: user.id }
                    ]
                }
            })

            try {
                //Validaciones
                if (!conversation) {
                    return io.emit('error', { message: 'La conversación no existe' })
                }

                //Publicacion con el id y que sea mia, debe estar en venta
                const publication = await Publication.findOne({
                    where: {
                        id: publicationId,
                        user_id: user.id,
                        type: 'sale'
                    }
                })

                if (!publication) {
                    return io.emit('error', { success: false, message: 'La publicacion solicitada no existe' })
                }

                const [transaction, flag] = await Transaction.findOrCreate({
                    where: {
                        publication_id: publication.id,
                        user_id: requestingUserId,
                        status: 'waiting'
                    },
                    include: [{ model: Publication, as: 'publication' }],
                    defaults: {
                        id: uuidv4(),
                        user_id: requestingUserId,
                        publication_id: publication.id,
                        date: new Date(),
                        price: publication.price,
                        status: 'hold',
                        currency: publication.currency,
                        typeSale: publication.typeSale
                    },
                    order: [['date', 'ASC']], // Ordenar por fecha ascendente
                    limit: 1 // Obtener solo el primer resultado
                })

                if (!transaction) {
                    return io.emit('error', { success: false, message: 'No hay solicitud de compra' })
                }

                //Cambio a hold, el usuario dueno acepto liberar la publicacion
                transaction.status = 'hold'
                await transaction.save()

                io.to(`conversation-${conversation.id}`).emit('accept-transaction-ok', transaction)
            } catch (error) {
                console.log(error)
                io.to(`conversation-${conversation.id}`).emit('error')
            }

        })

        socket.on('decline-transaction', async ({ publicationId, requestingUserId }) => {
            const { user } = socket

            //Validaciones
            if (!requestingUserId) {
                return io.emit('error', { message: 'Debe enviar quien solicita la publicacion' })
            }

            //Valido que la conversacion exista
            const conversation = await Conversation.findOne({
                where: {
                    [Op.or]: [
                        { userId1: user.id, userId2: requestingUserId },
                        { userId1: requestingUserId, userId2: user.id }
                    ]
                }
            })

            try {
                //Validaciones
                if (!conversation) {
                    return io.emit('error', { message: 'La conversación no existe' })
                }

                //Publicacion con el id y que sea mia, debe estar en venta
                const publication = await Publication.findOne({
                    where: {
                        id: publicationId,
                        user_id: user.id,
                        type: 'sale'
                    }
                })

                if (!publication) {
                    return io.emit('error', { success: false, message: 'La publicacion solicitada no existe' })
                }

                const [transaction, flag] = await Transaction.findOrCreate({
                    where: {
                        publication_id: publication.id,
                        user_id: requestingUserId
                    },
                    include: [{ model: Publication, as: 'publication' }],
                    defaults: {
                        id: uuidv4(),
                        user_id: requestingUserId,
                        publication_id: publication.id,
                        date: new Date(),
                        price: publication.price,
                        status: 'rejected',
                        currency: publication.currency,
                        typeSale: publication.typeSale
                    },
                    order: [['date', 'ASC']], // Ordenar por fecha ascendente
                    limit: 1 // Obtener solo el primer resultado
                })

                if (!transaction) {
                    return io.emit('error', { success: false, message: 'No hay solicitud de compra' })
                }

                //Cambio a hold, el usuario dueno acepto liberar la publicacion
                transaction.status = 'rejected'
                await transaction.save()

                io.to(`conversation-${conversation.id}`).emit('decline-transaction-ok', transaction)
            } catch (error) {
                console.log(error)
                io.to(`conversation-${conversation.id}`).emit('error')
            }
        })
    })

}

function getSocketByUserId(userId, sockets) {
    //Verificar si el socket tiene un usuario y si el id coincide
    for (const [socketId, socket] of sockets) {
        if (socket.user && socket.user.id == userId) {
            return socket
        }
    }

    //Si no encuentra a un usuario
    return null
}

export default execSocket

