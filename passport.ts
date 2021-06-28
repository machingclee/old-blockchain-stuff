import * as passport from "passport";
import * as passportJWT from "passport-jwt";
import jwt from "./jwt";
import { UserService } from "./services/UserService";

export const JWTStrategy = passportJWT.Strategy;
export const { ExtractJwt } = passportJWT;

export const initializePassport = (userService: UserService) => {
  console.log(ExtractJwt.fromAuthHeaderAsBearerToken());
  passport.use(
    new JWTStrategy(
      {
        secretOrKey: jwt.jwtSecret,
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
      },
      async (payload, done) => {
        const user = await userService.getUser(payload.username);
        if (user) {
          return done(null, payload);
        } else {
          return done(new Error("User not Found"), null);
        }
      }
    )
  );
};
