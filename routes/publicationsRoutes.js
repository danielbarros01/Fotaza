import express from 'express'

import {
    viewPublications, createPublication, savePublication, viewMyPublications,
    viewPublication, downloadImage, editPublication, deletePublication, viewPublicationsOf, bestPublications
} from '../controllers/publicationsController.js'
import { Publication, RightOfUse } from '../models/Index.js'
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

// GET /publications/best
router.get('/best', authenticateUser, bestPublications)

// GET /publications
router.get('/', authenticateUser, viewPublications)

// GET /publications/create
router.get('/create', protectRoute, createPublication)

// POST /publications/create
router.post('/create', protectRoute, upload.fields([{ name: 'image', maxCount: 1 }, { name: 'imageWatermark', maxCount: 1 }]), savePublication)

// GET /publications/my-posts
router.get('/my-posts', protectRoute, viewMyPublications)

// GET /publications/:id
router.get('/:id', authenticateUser, viewPublication)

//GET /publications/@dani?type=sale
router.get('/user/:username', authenticateUser, viewPublicationsOf)

// GET /publications/:id/download 
router.get('/:id/download', protectRoute, downloadImage)

//PATCH /publications/:id
router.patch('/:id', authenticateUser, editPublication)

//DELETE /publications/:id
router.delete('/:id', authenticateUser, deletePublication)

//Devolver imagenes
router.get('/image/:id', authenticateUser, async (req, res) => {
    //Traer usuario
    const { user } = req
    const baseDir = path.resolve(__dirname, '..');

    try {
        //Buscar la publicacion
        const publication = await Publication.findOne({ where: { image: req.params.id }, include: { model: RightOfUse, as: 'license' } })

        //Si no estoy autenticado
        if (!user) {

            //Verificar que la imagen sea solo publica
            if (publication.privacy != 'public') {
                return res.status(403).send({ msg: 'No tienes permiso para visualizar esta imagen' })
            }
            //--

            //Devolver con marca de agua
            res.sendFile(`${baseDir}/images/uploadsWithWatermark/watermark_${req.params.id}`);
        } else {
            //Si es copyright o venta unica mostrar con marca de agua
            if ((publication.license?.name.toLowerCase() == 'copyright')
                || (publication.type == 'sale' /* && publication.typeSale == 'unique' */)) {
                res.sendFile(`${baseDir}/images/uploadsWithWatermark/watermark_${req.params.id}`);
            } else {
                //Mostrar sin marca de agua
                res.sendFile(`${baseDir}/images/uploads/${req.params.id}`);
            }
        }
    } catch (error) {
        console.error(error)
        res.status(500).send({ msg: 'Hubo un error de nuestra parte' })
    }




    //Si estoy autenticado


    //res.sendFile(`${baseDir}/images/uploads/${req.params.id}`);
});


export default router
