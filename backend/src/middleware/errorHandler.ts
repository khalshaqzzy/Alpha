import type { Request, Response, NextFunction } from "express";
import { AppError } from "../types/index.js";

export function errorHandler(
    err: Error,
    _req: Request,
    res: Response,
    _next: NextFunction
): void {
    // Known application error
    if (err instanceof AppError) {
        res.status(err.statusCode).json({
            error: {
                message: err.message,
                code: err.code,
            },
        });
        return;
    }

    // Prisma known errors
    if (err.name === "PrismaClientKnownRequestError") {
        const prismaErr = err as any;
        if (prismaErr.code === "P2002") {
            res.status(409).json({
                error: {
                    message: "A record with this value already exists.",
                    code: "DUPLICATE_ENTRY",
                },
            });
            return;
        }
        if (prismaErr.code === "P2025") {
            res.status(404).json({
                error: {
                    message: "Record not found.",
                    code: "NOT_FOUND",
                },
            });
            return;
        }
    }

    // Zod validation errors
    if (err.name === "ZodError") {
        res.status(400).json({
            error: {
                message: "Validation failed.",
                code: "VALIDATION_ERROR",
                details: (err as any).errors,
            },
        });
        return;
    }

    // Unexpected errors
    console.error("Unhandled error:", err);
    res.status(500).json({
        error: {
            message:
                process.env.NODE_ENV === "development"
                    ? err.message
                    : "Internal server error",
            code: "INTERNAL_ERROR",
        },
    });
}
