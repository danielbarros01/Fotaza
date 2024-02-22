import express from 'express'
import protectRoute from '../Middlewares/protectRoute.js'
import { isItConfigured } from '../controllers/paymentController.js'

const router = express.Router()

// GET /payment/configured
router.get('/configured', protectRoute, isItConfigured)


export default router