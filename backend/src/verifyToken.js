import passport from "passport";



export const verifyToken = passport.authenticate('jwt', { session: false});
