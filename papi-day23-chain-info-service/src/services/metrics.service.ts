import client from 'prom-client';
import { logger } from '../utils/logger';

class MetricsService {
  private register: typeof client.register;
  public httpRequestDuration: client.Histogram<string>;
  public httpRequestTotal: client.Counter<string>;
  public activeConnections: client.Gauge<string>;

  constructor() {
    this.register = new client.Registry();
    
    client.collectDefaultMetrics({ register: this.register });

    this.httpRequestDuration = new client.Histogram({
      name: 'http_request_duration_seconds',
      help: 'Duration of HTTP requests in seconds',
      labelNames: ['method', 'route', 'status_code'],
      buckets: [0.1, 0.3, 0.5, 0.7, 1, 3, 5, 7, 10],
      registers: [this.register],
    });

    this.httpRequestTotal = new client.Counter({
      name: 'http_requests_total',
      help: 'Total number of HTTP requests',
      labelNames: ['method', 'route', 'status_code'],
      registers: [this.register],
    });

    this.activeConnections = new client.Gauge({
      name: 'websocket_active_connections',
      help: 'Number of active WebSocket connections',
      registers: [this.register],
    });

    logger.info('Metrics service initialized');
  }

  getMetrics(): Promise<string> {
    return this.register.metrics();
  }

  getRegister() {
    return this.register;
  }
}

export const metricsService = new MetricsService();

export const initMetricsService = (): void => {
  logger.info('Metrics service ready');
};