import express from 'express'
import {selectInterests, saveInterests } from '../controllers/interestsController.js'
import protectRoute from '../Middlewares/protectRoute.js'

const router = express.Router()

router.get('/select',protectRoute, selectInterests)
router.post('/select', protectRoute, saveInterests)


export default router