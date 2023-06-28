import express from "express";
import { formLogin, formRegister, register } from '../controllers/usersContoller.js'
const router = express.Router();

router.get('/login', formLogin)

router.get('/signup', formRegister)
router.post('/signup', register)

export default router