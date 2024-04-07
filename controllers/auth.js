let passport = require("passport");
let Strategy = require("passport-google-oauth2").Strategy;
let dotenv = require("dotenv").config();
let userModel = require("../models/users");

passport.use(new Strategy({
    clientID: process.env.clientId,
    clientSecret: process.env.clientSecret,
    callbackURL: "http://localhost:3333/auth/google/callback",
    returnURL: "http://localhost:3333/auth/google/callback",
    passReqToCallback: true
}, async (request, accessToken, refreshToken, profile, done) => {
    let userExist = await userModel.findOne({ id: profile.id })
    if (!userExist) {
        let newUser = await userModel.create({
            id: profile.id,
            email: profile.email,
            name: profile.given_name,
            isAdmin: false,
            isPublic: false,
            photo: profile.picture
        })
        console.log("New User From Google >_", JSON.stringify(newUser));
    }
    console.log("userData >_", JSON.stringify(profile));
    done(null, profile);
}))

passport.serializeUser((user, done) => {
    done(null, user)
})

passport.deserializeUser((user, done) => {
    done(null, user)
})

module.exports = passport;