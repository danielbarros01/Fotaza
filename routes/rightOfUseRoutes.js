import express from 'express'
import { getAll, getLicenses } from '../controllers/rightOfUseController.js'

const router = express.Router()

router.get('/', getAll)

router.get('/:type', getLicenses)

export default router