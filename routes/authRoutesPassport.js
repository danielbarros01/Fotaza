import { Router } from "express";
import passport from 'passport'
import "../Middlewares/google.js"

const loginRouter = Router();


loginRouter.get("/google", passport.authenticate("auth-google", {
    scope: [
        "https://www.googleapis.com/auth/userinfo.profile",
        "https://www.googleapis.com/auth/userinfo.email",
    ],
    session: false,
}), (req, res) => res.send(req.user));

export { loginRouter };