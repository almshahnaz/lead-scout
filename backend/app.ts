import express from "express";
import cors from "cors";
import session from "express-session";

import authRoutes from "./routes/authRoutes.js";
import batchRoutes from "./routes/batchRoutes.js";

const app = express();

process.loadEnvFile();

const sessionSecret = process.env.SESSION_SECRET;
if (!sessionSecret) {
  throw new Error("SESSION_SECRET is not set in .env");
}

if (!process.env.CORS_ORIGIN) {
  throw new Error("CORS_ORIGIN is not set in .env");
}

app.use(cors({ origin: process.env.CORS_ORIGIN, credentials: true }));
app.use(express.json());
app.use(
  session({
    secret: sessionSecret,
    resave: false,
    saveUninitialized: false,
  }),
);

app.use(authRoutes);
app.use(batchRoutes);

export default app;
