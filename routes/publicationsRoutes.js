import express from 'express'
import { viewPublications, createPublication, savePublication, saveImage } from '../controllers/publicationsController.js'
import protectRoute from '../Middlewares/protectRoute.js'
import upload from "../Middlewares/uploadImage.js"

const router = express.Router()

router.get('/', viewPublications)

router.get('/create', protectRoute, createPublication)
router.post('/create', protectRoute, upload.single('image'), savePublication)

router.get('/my-posts', protectRoute, viewPublications)

export default router
