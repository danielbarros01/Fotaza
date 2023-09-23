import express from 'express'
import { getAll } from '../controllers/rightOfUseController.js'

const router = express.Router()

router.get('/', getAll)

export default router