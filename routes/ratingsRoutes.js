import express from 'express'
import authenticateUser from '../Middlewares/authenticateUser.js'
import {getRating, saveRating, getOverallRating } from '../controllers/ratingsController.js'

const router = express.Router()

router.get('/:idPublication', authenticateUser, getRating)

router.post('/save', authenticateUser, saveRating)

//overall english = general español
router.get('/overall/:idPublication', getOverallRating)

export default router