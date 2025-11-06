import "dotenv/config";

import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import passport from "passport";
import "./config/passport-setup.js";

import cardRoutes from "./routes/card.js";
import authRoutes from "./routes/auth.js";
import listRoutes from "./routes/list.js";
import boardRoutes from "./routes/board.js";
import userRoutes from "./routes/user.js";
import commentRoutes from "./routes/comment.js";
import labelRoutes from "./routes/label.js";
import invitationRoutes from "./routes/invitation.js";

export const app = express();

app.use(cors({ origin: process.env.CORS_ORIGIN, credentials: true }));
app.use(helmet());
app.use(express.json());
app.use(cookieParser());
app.use(passport.initialize());
app.use(morgan("dev"));

app.get("/api/health", (_req, res) => res.json({ ok: true }));
app.use("/api/auth", authRoutes);
app.use("/api/boards", boardRoutes);
app.use("/api/lists", listRoutes);
app.use("/api/cards", cardRoutes);
app.use("/api/user", userRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/labels", labelRoutes);
app.use("/api", invitationRoutes);
