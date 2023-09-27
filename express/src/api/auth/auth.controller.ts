import { RequestHandler, Router } from "express";
import { authService } from "./auth.service";
import jsonwebtoken from "jsonwebtoken";
import { REFRESH_TOKEN_SECRET } from "../../config/config";

class AuthController {
  router = Router();

  constructor() {
    this.router.post("/sign-in", this.signIn());
    this.router.post("/sign-up", this.signUp());
    this.router.post("/refresh", this.refreshToken());
    this.router.post("/sign-out", this.signOut());
  }

  signIn(): RequestHandler {
    return async (req, res) => {
      try {
        const { user, accessToken, refreshToken } = await authService.signIn(
          req.body
        );

        res.cookie("refreshToken", refreshToken, {
          httpOnly: true,
          maxAge: 1 * 60 * 60 * 1000,
        });

        res.send({
          user,
          accessToken,
        });
      } catch (err) {
        console.log(err?.toString());
        res.status(401).send(err);
      }
    };
  }

  signUp(): RequestHandler {
    return async (req, res) => {
      try {
        const { user } = await authService.signUp(req.body);
        res.send({ message: "OK" });
      } catch (err) {
        console.log(err?.toString());
        res.status(401).send(err);
      }
    };
  }

  refreshToken(): RequestHandler {
    return async (req, res) => {
      try {
        const refreshToken = req.cookies?.refreshToken;
        if (!refreshToken) throw "Unauthorized";

        const payload = jsonwebtoken.verify(
          refreshToken,
          REFRESH_TOKEN_SECRET
        ) as any;
        const userId = payload?._id;

        const {
          payload: user,
          accessToken,
          refreshToken: newRefreshToken,
        } = await authService.refreshToken({
          refreshToken,
          userId,
        });

        // Refresh token rotation
        res.cookie("refreshToken", newRefreshToken, {
          httpOnly: true,
          maxAge: 1 * 60 * 60 * 1000,
        });

        res.send({
          user,
          accessToken,
        });
      } catch (err) {
        console.log(err?.toString());
        res.status(401).send(err);
      }
    };
  }

  signOut(): RequestHandler {
    return async (req, res) => {
      try {
        res.clearCookie("refreshToken", { httpOnly: true });

        const refreshToken = req.cookies?.refreshToken;
        if (!refreshToken) throw "Unauthorized";

        const payload = jsonwebtoken.verify(
          refreshToken,
          REFRESH_TOKEN_SECRET
        ) as any;
        const userId = payload?._id;
        await authService.signOut({
          userId,
          refreshToken,
        });

        res.send({ message: "OK" });
      } catch (err) {
        console.log(err?.toString());
        res.status(500).send(err);
      }
    };
  }
}

export const authController = new AuthController();
