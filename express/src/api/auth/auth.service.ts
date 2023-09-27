import mongoose from "mongoose";
import {
  PASSWORD_SALT,
  ACCESS_TOKEN_SECRET,
  REFRESH_TOKEN_SECRET,
  ACCESS_TOKEN_EXPIRES_IN,
  REFRESH_TOKEN_EXPIRES_IN,
} from "../../config/config";
import { TUser, User } from "../../db/models/user.model";
import bcrypt from "bcrypt";
import jsonwebtoken from "jsonwebtoken";
import { Token } from "../../db/models/token.model";

class AuthService {
  constructor() {}

  async signIn(credentials: { email: string; password: string }) {
    const response = { errors: { email: "", password: "" } };
    const user = await User.findOne({ email: credentials.email });

    if (!user) {
      response.errors.email = "Email not registered";
      throw response;
    }

    if (!(await bcrypt.compare(credentials.password, user.password))) {
      response.errors.password = "Password is invalid";
      throw response;
    }

    const payload = await this.generateTokenPayload(user._id.toString());
    const accessToken = this.generateToken(payload);
    const refreshToken = this.generateRefreshToken(payload);

    await Token.create({
      token: refreshToken,
      userId: user._id,
      type: "refresh_token",
      expireAt: Date.now(),
    });

    return {
      accessToken,
      refreshToken,
      user: payload,
    };
  }

  async signUp(credentials: { email: string; password: string }) {
    const response = { errors: { email: "", password: "" } };

    const user = await User.findOne({ email: credentials.email });

    if (!user) {
      const hashedPassword = await bcrypt.hash(
        credentials.password,
        PASSWORD_SALT
      );

      const user = await User.create({
        email: credentials.email,
        password: hashedPassword,
      });

      return {
        user,
      };
    } else {
      response.errors.email = "Email is already taken";
      throw response;
    }
  }

  async signOut({
    refreshToken,
    userId,
  }: {
    refreshToken: string;
    userId: string;
  }) {
    await Token.deleteOne({
      token: refreshToken,
      type: "refresh_token",
      userId: new mongoose.Types.ObjectId(userId),
    });
  }

  async refreshToken({
    refreshToken,
    userId,
  }: {
    refreshToken: string;
    userId: string;
  }) {
    const token = await Token.findOne({
      token: refreshToken,
      userId: new mongoose.Types.ObjectId(userId),
    });

    if (token) {
      const payload = await this.generateTokenPayload(userId);
      const accessToken = this.generateToken(payload);
      const refreshToken = this.generateRefreshToken(payload);

      await Token.create({
        userId: new mongoose.Types.ObjectId(userId),
        token: refreshToken,
        type: "refresh_token",
        expireAt: Date.now(),
      });

      return {
        payload,
        accessToken,
        refreshToken,
      };
    } else {
      throw "Unauthorized";
    }
  }

  async generateTokenPayload(userId: string) {
    const user = await User.findOne(
      {
        _id: new mongoose.Types.ObjectId(userId),
      },
      {
        _id: 1,
        email: 1,
      }
    );
    return user?.toJSON()!;
  }

  generateToken(payload: Partial<TUser>): string {
    const token = jsonwebtoken.sign(payload, ACCESS_TOKEN_SECRET, {
      expiresIn: ACCESS_TOKEN_EXPIRES_IN,
    });
    return token;
  }

  generateRefreshToken(payload: Partial<TUser>): string {
    const token = jsonwebtoken.sign(payload, REFRESH_TOKEN_SECRET, {
      expiresIn: REFRESH_TOKEN_EXPIRES_IN,
    });
    return token;
  }
}

export const authService = new AuthService();
