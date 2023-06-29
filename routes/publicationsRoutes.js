import express from 'express'
import { viewPublications, home } from '../controllers/publicationsController.js'

const router = express.Router()

router.get('/', home)

router.get('/publications', viewPublications)


export default router