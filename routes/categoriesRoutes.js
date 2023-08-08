import express from 'express'
import { getCategories } from '../controllers/categoriesController.js'
import protectRoute from '../Middlewares/protectRoute.js'

const router = express.Router()

router.get('/', protectRoute, getCategories)

export default router