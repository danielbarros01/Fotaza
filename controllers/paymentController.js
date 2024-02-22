import { UserPayment } from '../models/Index.js'

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

export {
    isItConfigured
}