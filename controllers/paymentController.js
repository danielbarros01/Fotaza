import mercadopago from 'mercadopago'
import { Publication, User, UserPayment } from '../models/Index.js'

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
                }]
            }]
        })

        if (!publication || publication.type != 'sale') {
            return res.status(404).json({ success: false, message: 'No se puede adquirir esta publicacion' })
        }

        //Traigo el usuario de la publicacion
        const userPublication = publication.user

        //El usuario dueño de la publicacion no tiene un access_token
        if (!userPublication.userPayment.accessToken) {
            return res.status(404).json({ success: false, message: 'No se puede adquirir esta publicacion' })
        }

        //Obtener el access_token y descifrarlo
        const accessToken = await userPublication.userPayment.verificarAccessToken()

        //Realizar la transacción de la publicacion
        mercadopago.configure({
            access_token: accessToken
        })

        const result = await mercadopago.preferences.create({
            items: [
                {
                    title: publication.title,
                    unit_price: publication.price,
                    currency_id: publication.currency.toUpperCase(),
                    quantity: 1
                }
            ]
        })

        console.log(result)
        return res.status(200).redirect()

    } catch (error) {
        console.error(error)
        return res.status(200).redirect(`/publications/${idPublication}`)
    }

}

export {
    isItConfigured,
    newOrder
}