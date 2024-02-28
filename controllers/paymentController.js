import mercadopago from 'mercadopago'
import { Op } from 'sequelize'
import { Category, Publication, Transaction, User, UserPayment } from '../models/Index.js'

const isItConfigured = async (req, res) => {
    //Traigo al usuario
    const { user } = req

    try {
        const userPayment = await UserPayment.findByPk(user.id)

        if (!userPayment) {
            return res.status(404).json({ success: false, message: 'No existe configuracion de pago para este usuario' })
        }

        return res.status(200).json({ success: true, message: 'Existe configuracion de pago para este usuario' })
    } catch (error) {
        console.error(error)
        return res.status(500).json({ success: false, message: error.message })
    }

}

const newOrder = async (req, res) => {
    const { user } = req
    const { idPublication } = req.params

    try {
        //Traigo la publicacion que quiero comprar
        const publication = await Publication.findByPk(idPublication, {
            include: [{
                model: User, as: 'user',
                include: [{
                    model: UserPayment, as: 'userPayment'
                },
                {
                    model: Category, as: 'categories'
                }
                ]
            }]
        })

        if (!publication || publication.type != 'sale') {
            return res.status(404).json({ success: false, message: 'No se puede adquirir esta publicacion' })
        }

        //Traigo el usuario de la publicacion
        const userPublication = publication.user

        //El usuario dueño de la publicacion no tiene un access_token
        if (!userPublication.userPayment || !userPublication.userPayment.accessToken) {
            return res.status(404).json({ success: false, message: 'No se puede adquirir esta publicacion, el propietario no tiene configurado un metodo para recibir el pago' })
        }

        /* Verificar que este aprobado para comprar (status:hold) */
        const transaction = await Transaction.findOne({
            where: {
                user_id: user.id,
                publication_id: publication.id,
                status: 'hold'
            },
        })

        /* Si no existe transaccion, y Si la publicacion es de venta unica y  copyright, entonces no se puede comprar
            contrariamente, si no es ninguna de estas dos, no hace falta que exista un registro en transaction
        */
        if (!transaction) {
            if (publication.typeSale == 'unique' || publication.category.name.toLowerCase() == 'copyright') {
                return res.status(404).json({ success: false, message: 'No puedes adquirir esta publicacion' })
            }
        }
        /* ---- */

        //Obtener el access_token y descifrarlo
        const accessToken = await userPublication.userPayment.verificarAccessToken()

        //Realizar la transacción de la publicacion
        mercadopago.configure({
            access_token: accessToken
        })

        const result = await mercadopago.preferences.create({
            items: [
                {
                    id: publication.id,
                    title: `Foto ${publication.title}`,
                    unit_price: publication.price,
                    currency_id: publication.currency.toUpperCase(),
                    quantity: 1,
                    description: `Estas a punto de comprar una foto de ${publication.user.username} con una resolucion de ${publication.resolution}`,
                    picture_url: `${process.env.BACKEND_URL}:${process.env.PORT}/publications/image/${publication.image}`,
                    category_id: 'Fotos'
                }
            ],
            back_urls: {
                success: "http://localhost:3000/payment/success",
                failure: "http://localhost:3000/payment/failure",
                pending: "http://localhost:3000/payment/pending",
            },
            notification_url: `https://9d36-138-59-172-60.ngrok-free.app/payment/webhook`,
            auto_return: "approved",
            payer: {
                name: user.name,
                surname: user.lastname,
                email: user.email
            },
            metadata: {
                user_id: user.id
            }
        })

        //console.log(result)
        //return res.status(200).redirect(result.body.init_point)
        return res.status(200).json({ success: false, message: 'Redirigir', init_point:result.body.init_point })

    } catch (error) {
        console.error(error)
        return res.status(500).redirect(`/publications/${idPublication}`)
    }

}

const webhook = async (req, res) => {
    const payment = req.query //recibo los datos del webhook

    try {
        if (payment.type === 'payment') {
            const data = await mercadopago.payment.findById(payment['data.id'])

            if (data.body.status_detail) {
                //Guardamos la transaccion en la base de datos
                const item = data.body.additional_info.items[0]
                const idUserPayer = data.body.metadata.user_id
                const { status, currency_id: currency } = data.body

                if (item.id && idUserPayer) {

                    /* Busco la publicacion */
                    const publication = await Publication.findByPk(item.id)
                    /* ---- */

                    /* Creo la transaccion */
                    const transaction = await Transaction.findOrCreate({
                        where: {
                            user_id: idUserPayer,
                            publication_id: item.id
                        },
                        defaults: {
                            id: payment['data.id'],
                            user_id: idUserPayer,
                            publication_id: item.id,
                            date: new Date(),
                            price: Number(item.unit_price),
                            status,
                            currency,
                            typeSale: publication.typeSale
                        }
                    })

                    transaction[0].status = status
                    await transaction[0].save()

                    /* 
                    1.Creamos la transaccion -- LISTO
                    VERIFICAR SI LA PUBLICACION ES DE TIPO UNIQUE
                    */
                    if (publication.typeSale == 'unique') {
                        /* Si la publicacion es unica debo transferirla al nuevo usuario*/
                        publication.user_id = idUserPayer
                        await publication.save()

                        /* . */
                        /*2.Vamos a realizar la consulta, vamos a traer las ultimas 2 transactions, la ultima tiene que ser approved, pero si la anterior es tambien approved y type_sale=unique tengo que cambiarla a sold, para que el usuario no pueda descargarla mas */
                        const transactions = await Transaction.findAll({
                            where: {
                                publication_id: item.id
                            },
                            order: [['date', 'DESC']],
                            limit: 2, // Obtener solo los últimos 2 registros
                        })

                        //Elegimos el 1 porque es el mas viejo, por lo tanto el que hay que modificar
                        if(transactions.length > 1){
                            if (transactions[1].status == 'approved' && transactions[1].typeSale == 'unique') {
                                transactions[1].status = 'sold'
                                await transactions[1].save()
                            }
                        }
                    }

                }
            }
        }

        res.sendStatus(204)
    } catch (error) {
        console.log(error)
    }
}

const success = async (req, res) => {
    return res.status(200).redirect('/transactions')
}

export {
    isItConfigured,
    newOrder,
    webhook,
    success
}