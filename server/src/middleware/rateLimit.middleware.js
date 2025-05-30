import rateLimit from "express-rate-limit";

// Rate limiter for authentication routes
export const authRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per windowMs
  message: {
    success: false,
    message: "Too many authentication attempts. Please try again later.",
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  skipSuccessfulRequests: true, // Don't count successful requests
});

// Rate limiter for registration (stricter)
export const registerRateLimit = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // increased for testing - limit each IP to 10 registration attempts per hour
  message: {
    success: false,
    message: "Too many registration attempts. Please try again after an hour.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Rate limiter for login
export const loginRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // increased for testing - limit each IP to 10 login attempts per 15 minutes
  message: {
    success: false,
    message: "Too many login attempts. Please try again in 15 minutes.",
  },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true,
});
