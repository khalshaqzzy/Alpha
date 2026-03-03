import { prisma } from "../lib/prisma.js";
import { AppError } from "../types/index.js";
import type { TradeResponse, TradeStrategy } from "../types/index.js";

export const tradeService = {
    /** List all trades for a user, optionally filtered by status */
    async listTrades(userId: string, status?: string): Promise<TradeResponse[]> {
        const trades = await prisma.trade.findMany({
            where: {
                userId,
                ...(status && { status }),
            },
            orderBy: { createdAt: "desc" },
        });

        return trades.map(formatTradeResponse);
    },

    /** Create a new trade from a strategy card */
    async createTrade(
        userId: string,
        data: {
            chatSessionId: string;
            asset: string;
            symbol: string;
            direction: string;
            entryPrice: number;
            currentPrice: number;
            leverage: number;
            positionSize: number;
            strategy: TradeStrategy;
        }
    ): Promise<TradeResponse> {
        // Verify the chat session belongs to the user
        const session = await prisma.chatSession.findUnique({
            where: { id: data.chatSessionId },
            select: { userId: true },
        });
        if (!session) {
            throw new AppError(404, "Chat session not found.", "SESSION_NOT_FOUND");
        }
        if (session.userId !== userId) {
            throw new AppError(403, "Access denied.", "FORBIDDEN");
        }

        const trade = await prisma.trade.create({
            data: {
                userId,
                chatSessionId: data.chatSessionId,
                asset: data.asset,
                symbol: data.symbol,
                direction: data.direction,
                entryPrice: data.entryPrice,
                currentPrice: data.currentPrice,
                leverage: data.leverage,
                positionSize: data.positionSize,
                strategy: data.strategy as any,
                agentLog: [],
            },
        });

        return formatTradeResponse(trade);
    },

    /** Get a single trade by ID */
    async getTrade(tradeId: string, userId: string): Promise<TradeResponse> {
        const trade = await prisma.trade.findUnique({
            where: { id: tradeId },
        });

        if (!trade) {
            throw new AppError(404, "Trade not found.", "TRADE_NOT_FOUND");
        }
        if (trade.userId !== userId) {
            throw new AppError(403, "Access denied.", "FORBIDDEN");
        }

        return formatTradeResponse(trade);
    },

    /** Update a trade (status, currentPrice) */
    async updateTrade(
        tradeId: string,
        userId: string,
        data: { status?: string; currentPrice?: number }
    ): Promise<TradeResponse> {
        const trade = await prisma.trade.findUnique({
            where: { id: tradeId },
            select: { userId: true },
        });
        if (!trade) {
            throw new AppError(404, "Trade not found.", "TRADE_NOT_FOUND");
        }
        if (trade.userId !== userId) {
            throw new AppError(403, "Access denied.", "FORBIDDEN");
        }

        const updated = await prisma.trade.update({
            where: { id: tradeId },
            data: {
                ...(data.status !== undefined && { status: data.status }),
                ...(data.currentPrice !== undefined && { currentPrice: data.currentPrice }),
            },
        });

        return formatTradeResponse(updated);
    },

    /** Delete a trade */
    async deleteTrade(tradeId: string, userId: string) {
        const trade = await prisma.trade.findUnique({
            where: { id: tradeId },
            select: { userId: true },
        });
        if (!trade) {
            throw new AppError(404, "Trade not found.", "TRADE_NOT_FOUND");
        }
        if (trade.userId !== userId) {
            throw new AppError(403, "Access denied.", "FORBIDDEN");
        }

        await prisma.trade.delete({ where: { id: tradeId } });
        return { success: true };
    },
};

// ── Helpers ───────────────────────────────────────────────────────

/**
 * Computes P/L and formats the trade for the frontend TradeCard component.
 */
function formatTradeResponse(trade: {
    id: string;
    asset: string;
    symbol: string;
    direction: string;
    entryPrice: number;
    currentPrice: number;
    status: string;
    leverage: number;
    positionSize: number;
    strategy: unknown;
    chatSessionId: string;
    createdAt: Date;
}): TradeResponse {
    const strategy = trade.strategy as TradeStrategy;

    // Compute P/L
    const priceDiff =
        trade.direction === "Long"
            ? trade.currentPrice - trade.entryPrice
            : trade.entryPrice - trade.currentPrice;

    const pnl =
        trade.entryPrice !== 0
            ? (priceDiff / trade.entryPrice) * trade.positionSize * trade.leverage
            : 0;

    const pnlPercent =
        trade.positionSize !== 0
            ? (pnl / trade.positionSize) * 100
            : 0;

    // Extract first takeProfit and stopLoss for the card
    const takeProfit =
        Array.isArray(strategy?.takeProfit) && strategy.takeProfit.length > 0
            ? strategy.takeProfit[0]
            : 0;
    const stopLoss = strategy?.stopLoss ?? 0;

    return {
        id: trade.id,
        asset: trade.asset,
        symbol: trade.symbol,
        direction: trade.direction as "Long" | "Short",
        entryPrice: trade.entryPrice,
        currentPrice: trade.currentPrice,
        takeProfit,
        stopLoss,
        pnl: Math.round(pnl * 100) / 100,
        pnlPercent: Math.round(pnlPercent * 100) / 100,
        status: trade.status as "Active" | "Needs Attention" | "Closed",
        leverage: trade.leverage,
        positionSize: trade.positionSize,
        chatSessionId: trade.chatSessionId,
        createdAt: trade.createdAt.toISOString(),
    };
}
