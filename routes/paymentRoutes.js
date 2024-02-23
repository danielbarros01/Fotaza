import express from 'express'
import protectRoute from '../Middlewares/protectRoute.js'
import { isItConfigured, newOrder } from '../controllers/paymentController.js'

const router = express.Router()

// GET /payment/configured
router.get('/configured', protectRoute, isItConfigured)

//POST /payment/new-order
router.post('/new-order/:idPublication', newOrder)

//El usuario ya pago
router.get('/success', (req, res) => { res.send('Success') })
router.get('/failure', (req, res) => { res.send('failure') })
router.get('/pending', (req, res) => { res.send('pending') })

//Esperando verificacion del pago de verdad
router.post('/webhook', (req, res) => { res.send('success') })

export default router