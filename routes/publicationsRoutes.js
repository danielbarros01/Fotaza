import express from 'express'

import {
    viewPublications, createPublication, savePublication,
    viewMyPublications, viewPublication, downloadImage, editPublication
} from '../controllers/publicationsController.js'

import protectRoute from '../Middlewares/protectRoute.js'
import authenticateUser from "../Middlewares/authenticateUser.js"
import upload from "../Middlewares/uploadImage.js"

const router = express.Router()

router.get('/', viewPublications)

router.get('/create', protectRoute, createPublication)
router.post('/create', protectRoute, upload.single('image'), savePublication)

router.get('/my-posts', protectRoute, viewMyPublications)

//Si el post es publico lo puede ver cualquiera
//Si el post es mio lo puedo modificar
router.get('/:id', authenticateUser, viewPublication)

router.get('/:id/download', downloadImage)

router.patch('/:id', authenticateUser, editPublication)

export default router
