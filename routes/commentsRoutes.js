import express from 'express'
import authenticateUser from '../Middlewares/authenticateUser.js'
import { getComments, saveComment, deleteComment } from '../controllers/commentsController.js'

const router = express.Router()

router.get('/:idPublication', authenticateUser, getComments)

router.post('/add', authenticateUser, saveComment)

router.delete('/delete', authenticateUser, deleteComment)

export default router