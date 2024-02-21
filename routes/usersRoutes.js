import express from "express"
import upload from "../Middlewares/uploadImage.js"

import authenticateUser from '../Middlewares/authenticateUser.js'
import protectRoute from "../Middlewares/protectRoute.js";
import { getUser, userAccount, editAccount, password, changePassword, getUserApi,getUserApiForId,
    getConfigurePayment, configurePayment, editPaymentSettings
} from "../controllers/usersController.js";

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

//GET /api/users/:username
router.get('/api/:username', authenticateUser, getUserApi)

//GET /api/users/:username
router.get('/api/id/:id', authenticateUser, getUserApiForId)


//GET /users/account/password
router.get('/account/password', protectRoute, password)

//POST /users/account/password --> Cambiar contraseña
router.post('/account/password', protectRoute, changePassword)

//GET /users/account/configure-payment
router.get('/account/configure-payment', protectRoute, getConfigurePayment)

//POST /users/account/configure-payment
router.post('/account/configure-payment', protectRoute, configurePayment)

//POST /users/account/configure-payment
router.post('/account/configure-payment/edit', protectRoute, editPaymentSettings)

export default router