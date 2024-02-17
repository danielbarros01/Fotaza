import express from 'express'
import protectRoute from '../Middlewares/protectRoute.js'
import protectConversation from '../Middlewares/protectConversation.js'

import { getChat, newMessage, getConversation, getApiConversation, deleteConversation } from '../controllers/chatController.js'


const router = express.Router()

router.get('/api/c/:id', protectRoute, protectConversation, getApiConversation)

router.get('/c/:id', protectRoute, protectConversation, getConversation)

router.get('/', protectRoute, getChat)

router.post('/new-message', protectRoute, newMessage)

router.delete('/delete-chat/:id', protectRoute, protectConversation, deleteConversation)


export default router