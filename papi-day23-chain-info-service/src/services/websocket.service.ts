import { WebSocketServer, WebSocket } from 'ws';
import { logger } from '../utils/logger';
import { papiService } from './papi.service';
import { metricsService } from './metrics.service';

class WebSocketService {
  private wss: WebSocketServer | null = null;
  private clients: Set<WebSocket> = new Set();
  private blockSubscriptionInterval: NodeJS.Timeout | null = null;

  initialize(wss: WebSocketServer): void {
    this.wss = wss;

    this.wss.on('connection', (ws: WebSocket) => {
      this.handleConnection(ws);
    });

    this.startBlockSubscription();
    logger.info('WebSocket service initialized');
  }

  private handleConnection(ws: WebSocket): void {
    this.clients.add(ws);
    metricsService.activeConnections.inc();
    
    console.log(`🔌 New WebSocket connection. Total clients: ${this.clients.size}`);
    logger.info('WebSocket client connected', { totalClients: this.clients.size });

    ws.send(JSON.stringify({
      type: 'connection',
      message: 'Connected to Chain Info API WebSocket',
      timestamp: new Date().toISOString(),
    }));

    ws.on('message', (message: string) => {
      try {
        const data = JSON.parse(message.toString());
        this.handleMessage(ws, data);
      } catch (error) {
        logger.error('WebSocket message parse error', { error });
        ws.send(JSON.stringify({ type: 'error', message: 'Invalid JSON' }));
      }
    });

    ws.on('close', () => {
      this.clients.delete(ws);
      metricsService.activeConnections.dec();
      console.log(`🔌 WebSocket disconnected. Total clients: ${this.clients.size}`);
      logger.info('WebSocket client disconnected', { totalClients: this.clients.size });
    });

    ws.on('error', (error) => {
      logger.error('WebSocket error', { error });
    });
  }

  private handleMessage(ws: WebSocket, data: any): void {
    logger.debug('WebSocket message received', { type: data.type });

    switch (data.type) {
      case 'subscribe':
        ws.send(JSON.stringify({
          type: 'subscribed',
          message: 'Subscribed to block updates',
          timestamp: new Date().toISOString(),
        }));
        break;
      case 'ping':
        ws.send(JSON.stringify({
          type: 'pong',
          timestamp: new Date().toISOString(),
        }));
        break;
      default:
        ws.send(JSON.stringify({
          type: 'error',
          message: `Unknown message type: ${data.type}`,
        }));
    }
  }

  private startBlockSubscription(): void {
    this.blockSubscriptionInterval = setInterval(async () => {
      if (this.clients.size === 0) return;

      try {
        const blockNumber = await papiService.getLatestBlockNumber();
        this.broadcast({
          type: 'block',
          data: {
            number: blockNumber,
            timestamp: new Date().toISOString(),
          },
        });
      } catch (error) {
        logger.error('Block subscription error', { error });
      }
    }, 6000);
  }

  private broadcast(message: any): void {
    const data = JSON.stringify(message);
    this.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(data);
      }
    });
    logger.debug('Broadcast to WebSocket clients', { clientCount: this.clients.size });
  }

  shutdown(): void {
    if (this.blockSubscriptionInterval) {
      clearInterval(this.blockSubscriptionInterval);
    }
    this.clients.forEach((client) => client.close());
    this.clients.clear();
    logger.info('WebSocket service shut down');
  }
}

export const websocketService = new WebSocketService();

export const initWebSocketService = (wss: WebSocketServer): void => {
  websocketService.initialize(wss);
};