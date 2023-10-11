import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { User } from '../models/Index.js'
import { v4 as uuidv4 } from 'uuid'

passport.use("auth-google", new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/google"
}, async (accessToken, refreshToken, profile, done) => {
    try {
        const user = await User.findOne({
            where: { google_id: profile.id }
        });

        if (user) {
            return done(null, user);
        } else {
            //gmail
            const email = profile.emails[0].value
            //Crear usuario 
            const user = await User.create({
                name: profile.name.givenName,
                lastname: profile.name.familyName,
                email,
                username: `@${email.toLowerCase().split('@')[0] + uuidv4().slice(0, 8)}`,
                google_id: profile.id
            })

            return done(null, user);
        }

    } catch (err) {
        return done(err, false);
    }
}));