import express from "express"
import protectRoute from '../Middlewares/protectRoute.js'
import {
     formLogin, formRegister, register, confirmAccount, recoverPassword,
     resetPassword, comprobarToken, newPassword, authenticate, signOff
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


router.post('/sign-off', protectRoute, signOff)


export default router