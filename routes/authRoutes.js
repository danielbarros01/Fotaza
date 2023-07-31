import express from "express"
import {
     formLogin, formRegister, register, confirmAccount, recoverPassword,
     resetPassword, comprobarToken, newPassword, authenticate
} from '../controllers/authContoller.js'

const router = express.Router();

router.get('/login', formLogin)
router.post('/login', authenticate)

router.get('/signup', formRegister)
router.post('/signup', register)

router.get('/recover-password', recoverPassword)
router.post('/recover-password', resetPassword)

router.get('/recover-password/:token', comprobarToken)
router.post('/recover-password/:token', newPassword)

router.get('/confirm/:token', confirmAccount)



export default router