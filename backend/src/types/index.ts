// ── Shared types for the Alpha backend ────────────────────────────

import type { Request } from "express";

// ── Auth ──────────────────────────────────────────────────────────
export interface JwtPayload {
    userId: string;
    email: string;
}

export interface AuthenticatedRequest extends Request {
    user?: JwtPayload;
}

// ── Trade ─────────────────────────────────────────────────────────
export type TradeDirection = "Long" | "Short";
export type TradeStatus = "Active" | "Needs Attention" | "Closed";
export type ChatSessionStatus = "CREATED" | "ACTIVE" | "IDLE" | "ARCHIVED";

export interface TradeStrategy {
    takeProfit: number[];
    stopLoss: number;
    invalidationConditions: InvalidationCondition[];
}

export interface InvalidationCondition {
    type: "price" | "indicator" | "cross" | "time";
    description: string;
    rule: Record<string, unknown>;
}

// ── Trade response (matches frontend TradeCard props) ─────────────
export interface TradeResponse {
    id: string;
    asset: string;
    symbol: string;
    direction: TradeDirection;
    entryPrice: number;
    currentPrice: number;
    takeProfit: number;
    stopLoss: number;
    pnl: number;
    pnlPercent: number;
    status: TradeStatus;
    leverage: number;
    positionSize: number;
    chatSessionId: string;
    createdAt: string;
}

// ── Chat ──────────────────────────────────────────────────────────
export interface AgentStep {
    label: string;
    status: "completed" | "active" | "pending";
    duration?: string;
}

export interface ChatMessage {
    id: string;
    role: "user" | "assistant";
    content: string;
    hasStrategy?: boolean;
    agentSteps?: AgentStep[];
    timestamp: string;
}

// ── API Error ─────────────────────────────────────────────────────
export class AppError extends Error {
    constructor(
        public statusCode: number,
        message: string,
        public code?: string
    ) {
        super(message);
        this.name = "AppError";
    }
}
