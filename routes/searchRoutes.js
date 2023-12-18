import express from 'express'
import { search, searchPublications } from '../controllers/searchController.js'
import authenticateUser from '../Middlewares/authenticateUser.js'

const router = express.Router()

router.get('/:value', authenticateUser, search)

router.get('/s/:value', authenticateUser, searchPublications)

export default router