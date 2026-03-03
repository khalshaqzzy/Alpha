import type { Request, Response, NextFunction } from "express";
import { tradeService } from "../services/trade.service.js";
import type { AuthenticatedRequest } from "../types/index.js";

function getUserId(req: Request): string {
    return (req as AuthenticatedRequest).user!.userId;
}

export const tradeController = {
    async list(req: Request, res: Response, next: NextFunction) {
        try {
            const status = req.query.status as string | undefined;
            const trades = await tradeService.listTrades(getUserId(req), status);
            res.json({ trades });
        } catch (err) {
            next(err);
        }
    },

    async create(req: Request, res: Response, next: NextFunction) {
        try {
            const trade = await tradeService.createTrade(getUserId(req), req.body);
            res.status(201).json({ trade });
        } catch (err) {
            next(err);
        }
    },

    async get(req: Request, res: Response, next: NextFunction) {
        try {
            const trade = await tradeService.getTrade(req.params.id as string, getUserId(req));
            res.json({ trade });
        } catch (err) {
            next(err);
        }
    },

    async update(req: Request, res: Response, next: NextFunction) {
        try {
            const trade = await tradeService.updateTrade(
                req.params.id as string,
                getUserId(req),
                req.body
            );
            res.json({ trade });
        } catch (err) {
            next(err);
        }
    },

    async remove(req: Request, res: Response, next: NextFunction) {
        try {
            await tradeService.deleteTrade(req.params.id as string, getUserId(req));
            res.status(204).send();
        } catch (err) {
            next(err);
        }
    },
};
