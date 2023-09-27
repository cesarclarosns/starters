import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import passport from "passport";
import "./auth/auth.strategies";
import { apiRouter } from "./router";
import { corsOptions } from "../config/cors.config";

export const app = express();

app.use(morgan("combined"));
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

app.use(passport.initialize());
app.use("/api", apiRouter);
