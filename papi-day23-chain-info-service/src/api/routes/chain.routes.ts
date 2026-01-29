import { Router } from 'express';
import { param } from 'express-validator';
import { getChainVersion, getChainConstants, getBlockInfo, getLatestBlock } from '../controllers/chain.controller';

const router = Router();

router.get('/version', getChainVersion);
router.get('/constants', getChainConstants);
router.get(
  '/block/:number',
  param('number').isInt({ min: 1 }).withMessage('Block number must be a positive integer'),
  getBlockInfo
);
router.get('/latest', getLatestBlock);

export default router;