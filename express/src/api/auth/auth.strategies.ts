import passport from "passport";
import { Strategy as JWTStrategy } from "passport-jwt";
import { ACCESS_TOKEN_SECRET } from "../../config/config";

passport.use(
  new JWTStrategy(
    {
      secretOrKey: ACCESS_TOKEN_SECRET,
      jwtFromRequest: (req) => {
        return req.headers.authorization?.split(" ")?.[1]!;
      },
    },
    (payload, done) => {
      done(null, payload);
    }
  )
);
