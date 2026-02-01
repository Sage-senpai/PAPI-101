import { Router } from 'express';
import { metricsService } from '../../services/metrics.service';

const router = Router();

router.get('/', async (_req, res) => {
  try {
    const metrics = await metricsService.getMetrics();
    res.set('Content-Type', metricsService.getRegister().contentType);
    res.send(metrics);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch metrics' });
  }
});

export default router;