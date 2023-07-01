import express from 'express'
import {selectCategories, saveInterests } from '../controllers/categoriesController.js'
import protectRoute from '../Middlewares/protectRoute.js'

const router = express.Router()

router.get('/select',protectRoute, selectCategories)
router.post('/select', protectRoute, saveInterests)


export default router