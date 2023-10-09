import express from "express"
import upload from "../Middlewares/uploadImage.js"

import authenticateUser from '../Middlewares/authenticateUser.js'
import protectRoute from "../Middlewares/protectRoute.js";
import { getUser, userAccount, editAccount, password, changePassword } from "../controllers/usersController.js";

const router = express.Router();

router.get('/my-publications', protectRoute, (req, res) => {
    res.redirect(`/users/${req.user.username}`);
})

//GET /users/account
router.get('/account', protectRoute, userAccount)


//POST /users/account
router.post('/account', protectRoute, upload.single('avatar'), editAccount)


//Pongo al ultimo para que encuentre /account
//GET /users/:username
router.get('/:username', authenticateUser, getUser)


//GET /users/account/password
router.get('/account/password', protectRoute, password)

//POST /users/account/password --> Cambiar contraseña
router.post('/account/password', protectRoute, changePassword)

export default router