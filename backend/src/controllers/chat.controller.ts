import type { Request, Response, NextFunction } from "express";
import { chatService } from "../services/chat.service.js";
import type { AuthenticatedRequest } from "../types/index.js";

function getUserId(req: Request): string {
    return (req as AuthenticatedRequest).user!.userId;
}

export const chatController = {
    async list(req: Request, res: Response, next: NextFunction) {
        try {
            const sessions = await chatService.listSessions(getUserId(req));
            res.json({ sessions });
        } catch (err) {
            next(err);
        }
    },

    async create(req: Request, res: Response, next: NextFunction) {
        try {
            const { title } = req.body;
            const session = await chatService.createSession(getUserId(req), title);
            res.status(201).json({ session });
        } catch (err) {
            next(err);
        }
    },

    async get(req: Request, res: Response, next: NextFunction) {
        try {
            const session = await chatService.getSession(req.params.id as string, getUserId(req));
            res.json({ session });
        } catch (err) {
            next(err);
        }
    },

    async update(req: Request, res: Response, next: NextFunction) {
        try {
            const session = await chatService.updateSession(
                req.params.id as string,
                getUserId(req),
                req.body
            );
            res.json({ session });
        } catch (err) {
            next(err);
        }
    },

    async remove(req: Request, res: Response, next: NextFunction) {
        try {
            await chatService.deleteSession(req.params.id as string, getUserId(req));
            res.status(204).send();
        } catch (err) {
            next(err);
        }
    },

    /** Placeholder for AI chat — Phase 2 */
    async sendMessage(_req: Request, res: Response) {
        res.status(501).json({
            error: {
                message: "AI chat agent not yet implemented. Coming in Phase 2.",
                code: "NOT_IMPLEMENTED",
            },
        });
    },
};
