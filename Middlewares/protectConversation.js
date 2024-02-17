import { Conversation } from '../models/Index.js'
import { Op } from 'sequelize'

const protectConversation = async (req, res, next) => {
    const { id: conversationId } = req.params

    try {
        const conversation = await Conversation.findOne({
            where: {
                id: conversationId,
                [Op.or]: {
                    userId1: req.user.id,
                    userId2: req.user.id,
                }
            }
        })

        if (!conversation) {
            return res.redirect('/chat')
        }

        next()
    } catch (error) {
        console.error("Error en protectConversation:", error);
        return res.redirect('/chat');
    }


}

export default protectConversation