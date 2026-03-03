import { Router } from "express";
import { z } from "zod";
import { tradeController } from "../controllers/trade.controller.js";
import { authMiddleware } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";

export const tradeRoutes = Router();

// All trade routes require authentication
tradeRoutes.use(authMiddleware);

// Validation schemas
const createTradeSchema = z.object({
    chatSessionId: z.string().uuid("Invalid chat session ID"),
    asset: z.string().min(1, "Asset is required"), // e.g., "BTC/USD"
    symbol: z.string().min(1, "Symbol is required"), // e.g., "BTC"
    direction: z.enum(["Long", "Short"]),
    entryPrice: z.number().positive("Entry price must be positive"),
    currentPrice: z.number().positive("Current price must be positive"),
    leverage: z.number().min(1).default(1),
    positionSize: z.number().positive("Position size must be positive"),
    strategy: z.object({
        takeProfit: z.array(z.number()),
        stopLoss: z.number(),
        invalidationConditions: z.array(
            z.object({
                type: z.enum(["price", "indicator", "cross", "time"]),
                description: z.string(),
                rule: z.record(z.unknown()),
            })
        ),
    }),
});

const updateTradeSchema = z.object({
    status: z.enum(["Active", "Needs Attention", "Closed"]).optional(),
    currentPrice: z.number().positive().optional(),
});

const listTradesQuery = z.object({
    status: z.enum(["Active", "Needs Attention", "Closed"]).optional(),
});

// Routes
tradeRoutes.get(
    "/",
    validate({ query: listTradesQuery }),
    tradeController.list
);
tradeRoutes.post(
    "/",
    validate({ body: createTradeSchema }),
    tradeController.create
);
tradeRoutes.get("/:id", tradeController.get);
tradeRoutes.patch(
    "/:id",
    validate({ body: updateTradeSchema }),
    tradeController.update
);
tradeRoutes.delete("/:id", tradeController.remove);
