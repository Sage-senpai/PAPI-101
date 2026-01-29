import dotenv from 'dotenv';

dotenv.config();

export const config = {
  port: parseInt(process.env.PORT || '3005', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  papi: {
    chain: process.env.PAPI_CHAIN || 'polkadot',
    timeout: parseInt(process.env.PAPI_TIMEOUT || '30000', 10),
  },
  rateLimit: {
    windowMs: 15 * 60 * 1000,
    max: parseInt(process.env.RATE_LIMIT_MAX || '100', 10),
  },
  cache: {
    ttl: parseInt(process.env.CACHE_TTL || '300', 10),
    checkPeriod: parseInt(process.env.CACHE_CHECK_PERIOD || '600', 10),
  },
  logging: {
    level: process.env.LOG_LEVEL || 'info',
    file: process.env.LOG_FILE || 'logs/app.log',
  },
  cors: {
    origin: process.env.CORS_ORIGIN || '*',
    credentials: process.env.CORS_CREDENTIALS === 'true',
  },
  healthCheck: {
    timeout: 5000,
    threshold: 0.8,
  },
} as const;

export type Config = typeof config;