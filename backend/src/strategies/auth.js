import PassportJWT from "passport-jwt";
import User from "../models/User.js";
import dotenv from "dotenv";

dotenv.config();
export const auth = new PassportJWT.Strategy({
    jwtFromRequest: PassportJWT.ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT,
},
    async (payload, done) => {
    const { id } = payload;
    let user = false;
    try {
        user = await User.findById(id);
    } catch (e) {
        return done(null, false);
    }

    return done(null, user)
    });