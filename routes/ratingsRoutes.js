import express from 'express'
import authenticateUser from '../Middlewares/authenticateUser.js'
import {getRating, saveRating } from '../controllers/ratingsController.js'

const router = express.Router()

router.get('/:idPublication', authenticateUser, getRating)

router.post('/save/:idPublication', authenticateUser, saveRating)

export default router