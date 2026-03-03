import rateLimit from "express-rate-limit";

/** General API rate limiter — 100 requests per 15 minutes per IP */
export const generalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        error: {
            message: "Too many requests. Please try again later.",
            code: "RATE_LIMIT_EXCEEDED",
        },
    },
});

/** Auth-specific rate limiter — 20 attempts per 15 minutes per IP */
export const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 20,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        error: {
            message: "Too many authentication attempts. Please try again later.",
            code: "AUTH_RATE_LIMIT_EXCEEDED",
        },
    },
});
