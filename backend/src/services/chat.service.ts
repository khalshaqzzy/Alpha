import { prisma } from "../lib/prisma.js";
import { AppError } from "../types/index.js";

export const chatService = {
    /** List all chat sessions for a user (sorted newest first) */
    async listSessions(userId: string) {
        return prisma.chatSession.findMany({
            where: { userId },
            select: {
                id: true,
                title: true,
                status: true,
                createdAt: true,
                updatedAt: true,
                _count: { select: { trades: true } },
            },
            orderBy: { updatedAt: "desc" },
        });
    },

    /** Create a new chat session */
    async createSession(userId: string, title?: string) {
        return prisma.chatSession.create({
            data: {
                userId,
                title: title || "New Chat",
                status: "CREATED",
                history: [],
            },
            select: {
                id: true,
                title: true,
                status: true,
                createdAt: true,
            },
        });
    },

    /** Get a single chat session with history */
    async getSession(sessionId: string, userId: string) {
        const session = await prisma.chatSession.findUnique({
            where: { id: sessionId },
            include: {
                trades: {
                    select: { id: true, asset: true, status: true },
                },
            },
        });

        if (!session) {
            throw new AppError(404, "Chat session not found.", "SESSION_NOT_FOUND");
        }
        if (session.userId !== userId) {
            throw new AppError(403, "Access denied.", "FORBIDDEN");
        }

        return session;
    },

    /** Update a chat session (title, chartState, status) */
    async updateSession(
        sessionId: string,
        userId: string,
        data: { title?: string; chartState?: unknown; status?: string }
    ) {
        // Verify ownership
        const session = await prisma.chatSession.findUnique({
            where: { id: sessionId },
            select: { userId: true },
        });
        if (!session) {
            throw new AppError(404, "Chat session not found.", "SESSION_NOT_FOUND");
        }
        if (session.userId !== userId) {
            throw new AppError(403, "Access denied.", "FORBIDDEN");
        }

        return prisma.chatSession.update({
            where: { id: sessionId },
            data: {
                ...(data.title !== undefined && { title: data.title }),
                ...(data.chartState !== undefined && { chartState: data.chartState as any }),
                ...(data.status !== undefined && { status: data.status }),
            },
            select: {
                id: true,
                title: true,
                status: true,
                chartState: true,
                updatedAt: true,
            },
        });
    },

    /** Delete a chat session */
    async deleteSession(sessionId: string, userId: string) {
        const session = await prisma.chatSession.findUnique({
            where: { id: sessionId },
            select: { userId: true },
        });
        if (!session) {
            throw new AppError(404, "Chat session not found.", "SESSION_NOT_FOUND");
        }
        if (session.userId !== userId) {
            throw new AppError(403, "Access denied.", "FORBIDDEN");
        }

        await prisma.chatSession.delete({ where: { id: sessionId } });
        return { success: true };
    },
};
