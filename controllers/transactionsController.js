import { Category, Publication, Transaction } from '../models/Index.js'

const getTransactions = async (req, res) => {
    //Traigo al usuario
    const { user } = req

    try {
        return res.render('transactions/transactions', {
            user,
        })

    } catch (error) {
        console.error(error)
        return res.status(500).redirect('/')
    }
}

const getTransactionsApi = async (req, res) => {
    //Traigo al usuario
    const { user } = req
    const { page = 0 } = req.query
    const { per_page = 4 } = req.headers

    try {
        const { count, rows: transactions } = await Transaction.findAndCountAll({
            where: { user_id: user.id },
            order: [['date', 'DESC']],
            include: [
                {
                    model: Publication, as: 'publication',
                    include: [{ model: Category, as: 'category' }]
                }
            ],
            limit: +per_page,
            offset: (+page) * (+per_page)
        })

        return res.status(200).json({ transactions, count })

    } catch (error) {
        console.error(error)
        return res.status(500).redirect('/')
    }
}

const acceptTransaction = async (req, res) => {
    const { user } = req
    const { publicationId } = req.params
    const { requestingUserId } = req.query

    try {
        //Publicacion con el id y que sea mia, debe estar en venta
        const publication = await Publication.findOne({
            where: {
                id: publicationId,
                user_id: user.id,
                type: 'sale'
            }
        })

        if (!publication) {
            return res.status(404).json({ success: false, message: 'La publicacion solicitada no existe' })
        }

        const transaction = await Transaction.findOne({
            where: {
                publication_id: publication.id,
                user_id: requestingUserId
            }
        })

        if(!transaction){
            return res.status(404).json({ success: false, message: 'No hay solicitud de compra' })
        }

        //Cambio a hold, el usuario dueno acepto liberar la publicacion
        transaction.status = 'hold'
        await transaction.save()

        return res.status(200).json({ success: true})
    } catch (error) {
        console.error(error)
        return res.status(500).redirect('/chat')
    }
}

export {
    getTransactions,
    getTransactionsApi,
    acceptTransaction
}