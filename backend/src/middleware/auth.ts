import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import type { AuthenticatedRequest, JwtPayload } from "../types/index.js";

export function authMiddleware(
    req: Request,
    res: Response,
    next: NextFunction
): void {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        res.status(401).json({
            error: { message: "Authentication required. Provide a Bearer token." },
        });
        return;
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, env.JWT_SECRET) as JwtPayload;
        (req as AuthenticatedRequest).user = decoded;
        next();
    } catch {
        res.status(401).json({
            error: { message: "Invalid or expired token." },
        });
    }
}
