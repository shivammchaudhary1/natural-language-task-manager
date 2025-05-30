// Environment variable configuration
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Export environment variables with defaults
export default {
  // Server configuration
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || "development",

  // MongoDB configuration
  mongoUri: process.env.MONGO_URI || "mongodb://localhost:27017/nltm",

  // Security configuration
  jwtSecret: process.env.JWT_SECRET || "default_jwt_secret_key_here",
  jwtExpire: process.env.JWT_EXPIRE || "30d",

  // Rate limiting configuration
  rateLimitWindow: process.env.RATE_LIMIT_WINDOW || 15, // minutes
  rateLimitMax: process.env.RATE_LIMIT_MAX || 1000, // requests

  // GEMINI
  geminiApiKey: process.env.GEMINI_API_KEY || "default_gem",
};
