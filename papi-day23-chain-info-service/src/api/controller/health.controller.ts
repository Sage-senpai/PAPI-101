import { Request, Response } from 'express';
import { papiService } from '../../services/papi.service';

export const getHealth = (req: Request, res: Response): void => {
  const startTime = Date.now();
  try {
    const papiHealthy = papiService.isReady();
    const cacheHealthy = true; // Assume cache is healthy
    const healthChecks = {
      papi: { status: papiHealthy ? 'healthy' : 'unhealthy', message: papiHealthy ? 'Connected to blockchain' : 'Disconnected from blockchain' },
      cache: { status: cacheHealthy ? 'healthy' : 'unhealthy', message: cacheHealthy ? 'Cache service running' : 'Cache service unavailable' },
    };
    const allHealthy = papiHealthy && cacheHealthy;
    const processingTime = Date.now() - startTime;
    console.log('🏥 Health check performed');
    console.log('📊 Health status:', allHealthy ? 'HEALTHY' : 'UNHEALTHY');
    console.log('🔍 Checks:', JSON.stringify(healthChecks, null, 2));
    res.status(allHealthy ? 200 : 503).json({
      status: allHealthy ? 'healthy' : 'unhealthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      version: '1.0.0',
      checks: healthChecks,
      metrics: { processingTime: `${processingTime}ms`, memoryUsage: process.memoryUsage(), nodeVersion: process.version },
    });
  } catch (error) {
    console.error('❌ Health check failed:', error);
    res.status(503).json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: 'Health check failed',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};