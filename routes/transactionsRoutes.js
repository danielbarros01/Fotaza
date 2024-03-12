import express from 'express'
import protectRoute from '../Middlewares/protectRoute.js'
import { getTransactions, getTransactionsApi, acceptTransaction, getSalesApi } from '../controllers/transactionsController.js'

const router = express.Router()

router.get('/', protectRoute, getTransactions)

router.get('/api', protectRoute, getTransactionsApi)

router.get('/api/sales', protectRoute, getSalesApi)

router.get('/accept/:publicationId', protectRoute, acceptTransaction)

export default router