import express from "express";
import passport from "passport";

import { authController } from "./auth/auth.controller";
import { usersController } from "./users/users.controller";

export const apiRouter = express();

apiRouter.get("/health", (req, res) => {
  res.send({ status: "up" });
});
apiRouter.use("/auth", authController.router);

/**
 * PROTECTED ROUTES
 */

apiRouter.use(passport.authenticate("jwt", { session: false }));
apiRouter.use("/users", usersController.router);
