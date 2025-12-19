// api/src/server.js
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
import searchRoutes from "./routes/search.js";

const app = express();

// Middlewares
const allowedOrigins = [
  "http://localhost:5173",
  process.env.CORS_ORIGIN, // Ton URL de production finale
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      const cleanOrigin = origin.endsWith("/") ? origin.slice(0, -1) : origin;

      const isVercel = cleanOrigin.endsWith(".vercel.app");
      const isAllowed = allowedOrigins.includes(cleanOrigin);

      if (isAllowed || isVercel) {
        callback(null, true);
      } else {
        console.error("CORS refusé pour :", origin);
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
  }),
);

app.use(helmet());
app.use(express.json());
app.use(cookieParser());
app.use(passport.initialize());
app.use(morgan("dev"));

// Routes
app.get("/api/health", (_req, res) => res.json({ ok: true }));
app.use("/api/auth", authRoutes);
app.use("/api/boards", boardRoutes);
app.use("/api/lists", listRoutes);
app.use("/api/cards", cardRoutes);
app.use("/api/user", userRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/labels", labelRoutes);
app.use("/api/search", searchRoutes); // Nouvelle route
app.use("/api", invitationRoutes);

// Export pour les tests
export { app };

// Démarrage du serveur
const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Current NODE_ENV: ${process.env.NODE_ENV}`);
  console.log(`API server listening on http://localhost:${PORT}`);
});
