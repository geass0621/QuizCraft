import rateLimit from "express-rate-limit";
export const generalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: "Too many requests, please try again later.",
});
export const strictLimiter = rateLimit({
    windowMs: 30 * 60 * 1000, // 30 minutes
    max: 10, // Limit each IP to 10 requests per windowMs
    message: "Too many requests, please try again later.",
});
