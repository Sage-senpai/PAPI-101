import NodeCache from 'node-cache';
import { config } from '../config/environment';
import { logger } from '../utils/logger';

class CacheService {
  private cache: NodeCache;

  constructor() {
    this.cache = new NodeCache({
      stdTTL: config.cache.ttl,
      checkperiod: config.cache.checkPeriod,
      useClones: false,
    });

    this.cache.on('expired', (key, _value) => {
      logger.debug('Cache key expired', { key });
    });

    logger.info('Cache service initialized', {
      ttl: config.cache.ttl,
      checkPeriod: config.cache.checkPeriod,
    });
  }

  get<T>(key: string): T | undefined {
    try {
      return this.cache.get<T>(key);
    } catch (error) {
      logger.error('Cache get error', { error, key });
      return undefined;
    }
  }

  set<T>(key: string, value: T, ttl?: number): boolean {
    try {
      return this.cache.set(key, value, ttl || config.cache.ttl);
    } catch (error) {
      logger.error('Cache set error', { error, key });
      return false;
    }
  }

  del(key: string): number {
    try {
      return this.cache.del(key);
    } catch (error) {
      logger.error('Cache delete error', { error, key });
      return 0;
    }
  }

  flush(): void {
    try {
      this.cache.flushAll();
      logger.info('Cache flushed');
    } catch (error) {
      logger.error('Cache flush error', { error });
    }
  }

  getStats() {
    return this.cache.getStats();
  }
}

export const cacheService = new CacheService();