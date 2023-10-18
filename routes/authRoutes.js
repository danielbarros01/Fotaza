import express from "express"
import protectRoute from '../Middlewares/protectRoute.js'

import passport from "passport"
import "../Middlewares/google.js"

import {
     formLogin, formRegister, register, confirmAccount, recoverPassword,
     resetPassword, comprobarToken, newPassword, authenticate, signOff,
     authGoogle
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



/* Google */
router.get("/google", passport.authenticate("auth-google", {
     scope: [
          "https://www.googleapis.com/auth/userinfo.profile",
          "https://www.googleapis.com/auth/userinfo.email",
     ],
     prompt: 'select_account', // Agrega esto para forzar la selección de la cuenta
     session: false,
}), authGoogle);

export default router