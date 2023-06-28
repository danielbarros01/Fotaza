import express from "express";
import { formLogin, formRegister, register, confirmAccount } from '../controllers/usersContoller.js'
const router = express.Router();

router.get('/login', formLogin)

router.get('/signup', formRegister)
router.post('/signup', register)
router.get('/confirm/:token', confirmAccount)

export default router