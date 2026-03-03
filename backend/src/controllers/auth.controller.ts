import type { Request, Response, NextFunction } from "express";
import { authService } from "../services/auth.service.js";
import type { AuthenticatedRequest } from "../types/index.js";

export const authController = {
    async register(req: Request, res: Response, next: NextFunction) {
        try {
            const { email, password } = req.body;
            const result = await authService.register(email, password);
            res.status(201).json(result);
        } catch (err) {
            next(err);
        }
    },

    async login(req: Request, res: Response, next: NextFunction) {
        try {
            const { email, password } = req.body;
            const result = await authService.login(email, password);
            res.json(result);
        } catch (err) {
            next(err);
        }
    },

    async me(req: Request, res: Response, next: NextFunction) {
        try {
            const { user: jwtUser } = req as AuthenticatedRequest;
            if (!jwtUser) {
                res.status(401).json({ error: { message: "Not authenticated" } });
                return;
            }
            const user = await authService.getProfile(jwtUser.userId);
            res.json({ user });
        } catch (err) {
            next(err);
        }
    },
};
