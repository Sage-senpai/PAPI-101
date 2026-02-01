import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import { createServer } from 'http';
import { WebSocketServer } from 'ws';
import { config } from './config/environment';
import { logger } from './utils/logger';
import { requestLogger } from './middleware/requestLogger';
import { errorHandler } from './middleware/errorHandler';
import { rateLimiter } from './middleware/rateLimiter';
import { initPapiService } from './services/papi.service';
import { initWebSocketService } from './services/websocket.service';
import { initMetricsService } from './services/metrics.service';
import chainRoutes from './api/routes/chain.routes';
import healthRoutes from './api/routes/health.routes';
import metricsRoutes from './api/routes/metrics.routes';

class ChainInfoApiService {
  private app: express.Application;
  private server: ReturnType<typeof createServer>;
  private wsServer: WebSocketServer;

  constructor() {
    this.app = express();
    this.server = createServer(this.app);
    this.wsServer = new WebSocketServer({ server: this.server });
    this.initializeMiddleware();
    this.initializeRoutes();
    this.initializeErrorHandling();
  }

  private initializeMiddleware(): void {
    this.app.use(helmet());
    this.app.use(cors({
      origin: config.cors.origin,
      credentials: config.cors.credentials,
    }));
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(compression());
    this.app.use(requestLogger);
    this.app.use('/api/', rateLimiter);
    console.log('🔧 Middleware initialized');
    console.log(`🛡️ CORS configured for origin: ${config.cors.origin}`);
    console.log(`📊 Rate limiting: ${config.rateLimit.max} requests per 15min`);
  }

  private initializeRoutes(): void {
    this.app.use('/api/chain', chainRoutes);
    this.app.use('/api/health', healthRoutes);
    this.app.use('/api/metrics', metricsRoutes);
    this.app.get('/', (req, res) => {
      res.json({
        service: 'Chain Info API Service',
        version: '1.0.0',
        documentation: '/api-docs',
        endpoints: {
          chain: '/api/chain',
          health: '/api/health',
          metrics: '/api/metrics',
          websocket: '/ws',
        },
        chain: config.papi.chain,
      });
    });
    this.app.get('/api-docs', (req, res) => {
      res.json({
        endpoints: [
          { method: 'GET', path: '/api/chain/version', description: 'Get chain runtime version', example: 'curl http://localhost:3005/api/chain/version' },
          { method: 'GET', path: '/api/chain/constants', description: 'Get all chain constants', example: 'curl http://localhost:3005/api/chain/constants' },
          { method: 'GET', path: '/api/chain/block/:number', description: 'Get block information', example: 'curl http://localhost:3005/api/chain/block/123456' },
          { method: 'GET', path: '/api/chain/latest', description: 'Get latest block number', example: 'curl http://localhost:3005/api/chain/latest' },
          { method: 'GET', path: '/api/health', description: 'Service health check', example: 'curl http://localhost:3005/api/health' },
          { method: 'GET', path: '/api/metrics', description: 'Service metrics (Prometheus format)', example: 'curl http://localhost:3005/api/metrics' },
          { method: 'WS', path: '/ws', description: 'WebSocket for real-time chain updates', example: 'new WebSocket("ws://localhost:3005/ws")' },
        ],
      });
    });
    console.log('🚀 API routes initialized');
    console.log('📚 Documentation available at /api-docs');
  }

  private async initializeServices(): Promise<void> {
    try {
      await initPapiService();
      console.log('✅ PAPI service connected to chain');
      initWebSocketService(this.wsServer);
      console.log('🔌 WebSocket server initialized');
      initMetricsService();
      console.log('📈 Metrics service initialized');
    } catch (error) {
      console.error('❌ Failed to initialize services:', error);
      process.exit(1);
    }
  }

  private initializeErrorHandling(): void {
    this.app.use((req, res) => {
      res.status(404).json({
        error: 'Not Found',
        message: `Route ${req.method} ${req.path} not found`,
        timestamp: new Date().toISOString(),
      });
    });
    this.app.use(errorHandler);
    console.log('🛡️ Error handling middleware initialized');
  }

  public async start(): Promise<void> {
    await this.initializeServices();
    
    this.server.listen(config.port, () => {
      console.log('\n' + '='.repeat(60));
      console.log('🚀 Chain Info API Service Started!');
      console.log('='.repeat(60));
      console.log(`📡 Environment: ${config.nodeEnv}`);
      console.log(`🌐 Server: http://localhost:${config.port}`);
      console.log(`🔗 Blockchain: ${config.papi.chain}`);
      console.log(`📊 Metrics: http://localhost:${config.port}/api/metrics`);
      console.log(`🏥 Health: http://localhost:${config.port}/api/health`);
      console.log(`🔌 WebSocket: ws://localhost:${config.port}/ws`);
      console.log('='.repeat(60) + '\n');
      console.log('📋 Available endpoints:');
      console.log('  GET  /                 - Service info');
      console.log('  GET  /api-docs         - API documentation');
      console.log('  GET  /api/chain        - Chain data endpoints');
      console.log('  GET  /api/health       - Health check');
      console.log('  GET  /api/metrics      - Prometheus metrics');
      console.log('  WS   /ws               - Real-time WebSocket');
      console.log('');
      console.log('💡 Try these commands:');
      console.log(`  curl http://localhost:${config.port}/api/chain/version`);
      console.log(`  curl http://localhost:${config.port}/api/health`);
      console.log('');
      console.log('⚡ Service is ready to serve blockchain data!');
    });
    process.on('SIGTERM', () => this.shutdown());
    process.on('SIGINT', () => this.shutdown());
  }

  private shutdown(): void {
    console.log('\n🔴 Shutting down gracefully...');
    this.wsServer.close();
    this.server.close(() => {
      console.log('✅ Server closed');
      process.exit(0);
    });
    setTimeout(() => {
      console.warn('⚠️ Forcing shutdown...');
      process.exit(1);
    }, 10000);
  }
}

const service = new ChainInfoApiService();
service.start();

export default service;