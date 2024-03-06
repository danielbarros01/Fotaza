import { Conversation, User, Message, Publication, Transaction } from '../models/Index.js'
import { Op, literal } from 'sequelize'
import { io } from '../index.js'
import moment from 'moment'

const getChat = async (req, res) => {
    try {
        const modifiedConversations = await getConversations(req)

        //Mostrar cantidad de mensajes no leidos por mi
        const countMessages = await Message.count({
            where: {
                [Op.not]: { user_id: req.user.id }, //Que no me pertenezcan a mi, pero que si compartamos con el otro usuario
                read: false
            },
            include: [{
                model: Conversation,
                as: 'conversation',
                where: {
                    [Op.or]: {
                        userId1: req.user.id, userId2: req.user.id
                    }
                }
            }]
        })

        res.render('chat/chat', {
            user: req.user,
            conversations: modifiedConversations,
            csrfToken: req.csrfToken(),
            cantMsgsUnread: countMessages
        })
    } catch (error) {
        console.error(error)
    }
}

//Igual que getChat, trae todas las conversaciones del usuario, nada mas que cambia la ruta
const getConversation = async (req, res) => {
    try {
        const modifiedConversations = await getConversations(req)

        //Mostrar cantidad de mensajes no leidos por mi
        const countMessages = await Message.count({
            where: {
                [Op.not]: { user_id: req.user.id }, //Que no me pertenezcan a mi, pero que si compartamos con el otro usuario
                read: false
            },
            include: [{
                model: Conversation,
                as: 'conversation',
                where: {
                    [Op.or]: {
                        userId1: req.user.id, userId2: req.user.id
                    }
                }
            }]
        })

        res.render('chat/chat', {
            user: req.user,
            conversations: modifiedConversations,
            csrfToken: req.csrfToken(),
            cantMsgsUnread: countMessages
        })
    } catch (error) {
        console.error(error)
    }
}

const getApiConversation = async (req, res) => {
    const { id: userId } = req.user
    //Id de la conversacion
    const { id } = req.params

    try {
        const conversation = await Conversation.findByPk(id, {
            include: [
                {
                    model: Message, as: 'messages',
                    include: [
                        {
                            model: User, as: 'user',
                            attributes: {
                                exclude: ['email', 'password', 'token', 'confirmed', 'google_id']
                            }
                        },
                        {
                            model: Transaction, as: 'transaction',
                            include: [{ model: Publication, as: 'publication' }]
                        }
                    ],
                    order: [['date', 'DESC']]
                }
            ]
        })

        const messages = await Promise.all(conversation.messages.map(async msg => {
            const msgData = { ...msg.get() }

            let myMsg = msgData.user_id == userId

            myMsg ? msgData.mine = true : msgData.mine = false

            /* if (msgData.purchase) {
                const transaction = await Transaction.findOne({
                    where: {
                        publication_id: msgData.publication_id,
                        [Op.or]: [
                            { user_id: conversation.userId1 },
                            { user_id: conversation.userId2 }
                        ],
                        order: [['date', 'DESC']]
                    }
                })


                await transaction ? msgData.transaction = transaction : msgData.transaction = null
            } */

            return msgData
        }))

        const modifiedConversation = (function modifiedConversation() {
            const conversationM = { ...conversation.get() }

            conversationM.messages = messages

            return conversationM
        })()

        return res.status(200).json({ success: true, conversation: modifiedConversation })

    } catch (error) {
        console.error(error)
    }
}


const newMessage = async (req, res) => {
    try {
        const { message, toUser } = req.body
        const { user } = req

        //Si existe el socket significa que hay conexion con el usuario

        const toUserDb = await User.findOne({ where: { username: toUser } })

        const ids = {
            user1: user.id,
            user2: toUserDb.id
        }

        //Persistencia
        //Crear conversacion si no existe
        let conversation = await Conversation.findOne({
            where: {
                userId1: ids.user1,
                userId2: ids.user2,
            }
        })

        //Si no existe la conversacion la creo
        if (!conversation) {
            //conversation = await Conversation.create({ userId1: ids.user1, userId2: ids.user2 });

        }

        //Creo el mensaje
        //const messageDb = await Message.create({ text: message, date: new Date(), userId: ids.user1, conversationId: conversation.id });



        res.status(200).json({ success: true, message: "Mensaje enviado correctamente" })
    } catch (error) {
        console.error(error)
    }
}

const deleteConversation = async (req, res) => {
    const { user } = req
    const { id } = req.params

    try {
        const conversation = await Conversation.findOne({
            where: {
                id,
                [Op.or]: { userId1: user.id, userId2: user.id }
            }
        })

        if (!conversation) {
            return res.status(404).json({ message: 'No existe la conversación' })
        }

        //Verificar que los 2 tengan visibleUser en false para eliminar
        if (conversation.visibleUser1 === false || conversation.visibleUser2 === false) {
            //Se borra en cascada los mensajes
            conversation.destroy()
        } else {
            //Verifico cual es el usuario y pongo en falso que quiere ver los mensajes
            if (conversation.userId1 == req.user.id) {
                conversation.visibleUser1 = false
            } else if (conversation.userId2 == req.user.id) {
                conversation.visibleUser2 = false
            }

            conversation.save()
        }

        return res.status(200).json({ success: true })

    } catch (error) {
        console.error(error)
        return res.status(500).json({ message: 'Hemos tenido un error al procesar tu solicitud' })
    }
}

async function getConversations(req) {
    try {
        const conversations = await Conversation.findAll({
            where: {
                [Op.or]: {
                    userId1: req.user.id,
                    userId2: req.user.id,
                },
            },
            include: [
                {
                    model: User.scope('withoutPassword'),
                    as: 'user1',
                },
                {
                    model: User.scope('withoutPassword'),
                    as: 'user2',
                }
            ],
            order: [
                [literal('(SELECT MAX(`messages`.`date`) FROM `messages` WHERE `messages`.`conversation_id` = `conversations`.`id`)'), 'DESC']
            ]
        })

        //Filtro para devolver solo el otro usuario
        const modifiedConversations = await Promise.all(conversations.map(async conversation => {
            const conversationData = { ...conversation.get() }

            //Si el usuario tiene eliminada la conversacion la excluyo 
            if (
                (conversationData.userId1 == req.user.id && conversationData.visibleUser1 === false)
                ||
                (conversationData.userId2 == req.user.id && conversationData.visibleUser2 === false)
            ) {
                return
            }


            if (conversationData.user1.id === req.user.id) {
                conversationData.user = conversationData.user2
            } else {
                conversationData.user = conversationData.user1
            }

            delete conversationData.user1
            delete conversationData.user2

            //obtener el ultimo mensaje
            const lastMessage = await Message.findOne({
                where: { conversation_id: conversationData.id },
                order: [['date', 'DESC']]
            })

            let lastMessageModified
            if (lastMessage) {
                lastMessageModified = { ...lastMessage.get() }

                lastMessageModified.date = formatDateLastMessage(lastMessageModified.date)
                conversationData.lastMessage = lastMessageModified
            } else {
                //Si no hay ultimo mensaje no hay mensajes, por lo tanto no devuelvo la conversacion
                return;
            }

            //Contar la cantidad de mensajes que estan sin leer de esta conversacion
            const countMsgs = await Message.count({
                where: {
                    [Op.not]: {
                        user_id: req.user.id
                    },
                    read: false
                },
                include: [{
                    model: Conversation,
                    as: 'conversation',
                    where: {
                        id: conversationData.id,
                        [Op.or]: {
                            userId1: req.user.id, userId2: req.user.id
                        }
                    }
                }]
            })

            //Agrego la cantidad de mensajes no leidos por mi a la conversacion que devuelvo
            conversationData.unreadMsgs = (countMsgs > 0) ? countMsgs : null
            return conversationData;
        }))

        return modifiedConversations.filter(conversationData => conversationData !== undefined) //Si no hay mensajes en una conversacion no incluirla en la lista

    } catch (error) {
        console.error(error)
    }
}

function formatDateLastMessage(date) {
    const today = moment()
    const dateMoment = moment(date)

    if (dateMoment.isSame(today, 'day')) {
        return dateMoment.format('LT')
    }

    if (dateMoment.isSame(today.clone().subtract(1, 'days'), 'day')) {
        return 'Ayer'
    }

    if (dateMoment.isSame(today.clone().subtract(2, 'days'), 'day')) {
        return 'Anteayer'
    }

    //dateMoment está en la misma semana que today
    if (dateMoment.isSame(today, 'week')) {
        return dateMoment.format('dddd')
    }

    //Mas de una semana
    return dateMoment.format('DD/MM/YYYY')
}



export {
    getChat,
    newMessage,
    getConversation,
    getApiConversation,
    deleteConversation
}