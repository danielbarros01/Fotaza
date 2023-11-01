import express from 'express'

import {
    viewPublications, createPublication, savePublication, viewMyPublications,
    viewPublication, downloadImage, editPublication, deletePublication
} from '../controllers/publicationsController.js'

import protectRoute from '../Middlewares/protectRoute.js'
import authenticateUser from "../Middlewares/authenticateUser.js"
import upload from "../Middlewares/uploadImage.js"

//----------------------

import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
//----------------------

const router = express.Router()

// GET /publications
router.get('/', viewPublications)

// GET /publications/create
router.get('/create', protectRoute, createPublication)

// POST /publications/create
router.post('/create', protectRoute, upload.single('image'), savePublication)

// GET /publications/my-posts
router.get('/my-posts', protectRoute, viewMyPublications)

// GET /publications/:id
//Si el post es publico lo puede ver cualquiera
//Si el post es mio lo puedo modificar
router.get('/:id', authenticateUser, viewPublication)

// GET /publications/:id/download 
router.get('/:id/download', downloadImage)

//PATCH /publications/:id
router.patch('/:id', authenticateUser, editPublication)

//DELETE /publications/:id
router.delete('/:id', authenticateUser, deletePublication)



//Devolver imagenes
router.get('/image/watermarked/:id', (req, res) => {
    const baseDir = path.resolve(__dirname, '..');
    res.sendFile(`${baseDir}/images/uploads/${req.params.id}`);
});


export default router
