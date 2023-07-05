import express from 'express'
import { home } from '../controllers/homeController.js'
import authenticateUser from '../Middlewares/authenticateUser.js'

const router = express.Router()

router.get('/', authenticateUser, home)

export default router