import { Router } from "express";
import { z } from "zod";
import { authController } from "../controllers/auth.controller.js";
import { authMiddleware } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { authLimiter } from "../middleware/rateLimiter.js";

export const authRoutes = Router();

// Validation schemas
const registerSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z
        .string()
        .min(8, "Password must be at least 8 characters")
        .max(128, "Password must be at most 128 characters"),
});

const loginSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(1, "Password is required"),
});

// Routes
authRoutes.post(
    "/register",
    authLimiter,
    validate({ body: registerSchema }),
    authController.register
);

authRoutes.post(
    "/login",
    authLimiter,
    validate({ body: loginSchema }),
    authController.login
);

authRoutes.get("/me", authMiddleware, authController.me);
