import rateLimit from 'express-rate-limit';
import { config } from '../config/environment';

export const rateLimiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.max,
  message: {
    error: 'Too many requests',
    message: `Rate limit exceeded. Max ${config.rateLimit.max} requests per 15 minutes.`,
    retryAfter: config.rateLimit.windowMs / 1000,
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (_req, res) => {
    res.status(429).json({
      error: 'Too many requests',
      message: `Rate limit exceeded. Max ${config.rateLimit.max} requests per 15 minutes.`,
      retryAfter: Math.ceil(config.rateLimit.windowMs / 1000),
      timestamp: new Date().toISOString(),
    });
  },
});