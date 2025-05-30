import express from "express";
import { register, login, getMe } from "../controllers/auth.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import {
  validateRequest,
  registerSchema,
  loginSchema,
} from "../validation/auth.validation.js";
import {
  registerRateLimit,
  loginRateLimit,
} from "../middleware/rateLimit.middleware.js";

const authRouter = express.Router();

// Auth routes with validation middleware and rate limiting
authRouter.post(
  "/register",
  registerRateLimit,
  validateRequest(registerSchema),
  register
);
authRouter.post("/login", loginRateLimit, validateRequest(loginSchema), login);
authRouter.get("/me", protect, getMe);

export default authRouter;
