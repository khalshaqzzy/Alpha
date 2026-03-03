import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "../lib/prisma.js";
import { env } from "../config/env.js";
import { AppError } from "../types/index.js";
import type { JwtPayload } from "../types/index.js";

const BCRYPT_ROUNDS = 12;

export const authService = {
    async register(email: string, password: string) {
        // Check if user already exists
        const existing = await prisma.user.findUnique({ where: { email } });
        if (existing) {
            throw new AppError(409, "An account with this email already exists.", "DUPLICATE_EMAIL");
        }

        // Hash password
        const passwordHash = await bcrypt.hash(password, BCRYPT_ROUNDS);

        // Create user
        const user = await prisma.user.create({
            data: { email, passwordHash },
            select: { id: true, email: true, createdAt: true },
        });

        // Generate JWT
        const token = generateToken({ userId: user.id, email: user.email });

        return { user, token };
    },

    async login(email: string, password: string) {
        // Find user
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            throw new AppError(401, "Invalid email or password.", "INVALID_CREDENTIALS");
        }

        // Compare password
        const isValid = await bcrypt.compare(password, user.passwordHash);
        if (!isValid) {
            throw new AppError(401, "Invalid email or password.", "INVALID_CREDENTIALS");
        }

        // Generate JWT
        const token = generateToken({ userId: user.id, email: user.email });

        return {
            user: { id: user.id, email: user.email, createdAt: user.createdAt },
            token,
        };
    },

    async getProfile(userId: string) {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { id: true, email: true, createdAt: true },
        });
        if (!user) {
            throw new AppError(404, "User not found.", "USER_NOT_FOUND");
        }
        return user;
    },
};

function generateToken(payload: JwtPayload): string {
    return jwt.sign(payload, env.JWT_SECRET, {
        expiresIn: env.JWT_EXPIRES_IN,
    } as jwt.SignOptions);
}
