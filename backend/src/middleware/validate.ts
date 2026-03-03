import type { Request, Response, NextFunction } from "express";
import { z, ZodSchema } from "zod";

/**
 * Creates an Express middleware that validates request body/params/query
 * against the provided Zod schemas.
 */
export function validate(schemas: {
    body?: ZodSchema;
    params?: ZodSchema;
    query?: ZodSchema;
}) {
    return (req: Request, res: Response, next: NextFunction): void => {
        try {
            if (schemas.body) {
                req.body = schemas.body.parse(req.body);
            }
            if (schemas.params) {
                req.params = schemas.params.parse(req.params) as any;
            }
            if (schemas.query) {
                req.query = schemas.query.parse(req.query) as any;
            }
            next();
        } catch (err) {
            if (err instanceof z.ZodError) {
                res.status(400).json({
                    error: {
                        message: "Validation failed.",
                        code: "VALIDATION_ERROR",
                        details: err.errors.map((e) => ({
                            field: e.path.join("."),
                            message: e.message,
                        })),
                    },
                });
                return;
            }
            next(err);
        }
    };
}
