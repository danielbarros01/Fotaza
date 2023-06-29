import express from "express";
import { formLogin, formRegister, register, confirmAccount, recoverPassword, resetPassword, comprobarToken, newPassword } from '../controllers/usersContoller.js'
const router = express.Router();

router.get('/login', formLogin)

router.get('/signup', formRegister)
router.post('/signup', register)

router.get('/recover-password', recoverPassword)
router.post('/recover-password', resetPassword)

router.get('/recover-password/:token', comprobarToken)
router.post('/recover-password/:token', newPassword)

router.get('/confirm/:token', confirmAccount)

router.get('/1111', (req,res) => {
    res.render('auth/resetPassword', {
        pagina: "Reestablece tu contraseña",
        imageUrl: "/img/backgrounds/fondo4.jpg",
        nameUserPhoto: "Luise and Nic",
        ocultarBtns: true
    })
})

export default router