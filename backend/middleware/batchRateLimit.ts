import { rateLimit } from "express-rate-limit";

export const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 1,
  keyGenerator: (req) => req.session.userID || "",
  message: { error: "Too many requests" },
});
