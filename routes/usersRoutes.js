import express from "express"
import authenticateUser from '../Middlewares/authenticateUser.js'
import protectRoute from "../Middlewares/protectRoute.js";
import { getUser } from "../controllers/usersController.js";

const router = express.Router();

router.get('/my-publications', protectRoute, (req, res) => {
    res.redirect(`/users/${req.user.username}`);
})

//GET /users/:username
router.get('/:username', authenticateUser, getUser)


export default router