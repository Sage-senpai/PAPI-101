import { Request, Response } from 'express';
import { papiService } from '../../services/papi.service';
import { logger } from '../../utils/logger';

export const getChainVersion = (req: Request, res: Response): void => {
  try {
    console.log('📊 API Request: GET /api/chain/version');
    console.log('👤 Client IP:', req.ip);
    console.log('📅 Timestamp:', new Date().toISOString());
    const startTime = Date.now();
    const version = papiService.getChainVersion();
    const processingTime = Date.now() - startTime;
    logger.info('Chain version API called', { clientIp: req.ip, processingTime, specVersion: version.specVersion });
    console.log(`✅ Chain version fetched in ${processingTime}ms`);
    console.log('📦 Response:', JSON.stringify(version, null, 2));
    res.json({
      success: true,
      data: version,
      metadata: {
        source: 'blockchain',
        cached: false,
        processingTime: `${processingTime}ms`,
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('❌ Error fetching chain version:', error);
    logger.error('Chain version API error', { error, clientIp: req.ip });
    res.status(500).json({
      success: false,
      error: 'Failed to fetch chain version',
      message: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString(),
    });
  }
};

export const getChainConstants = (req: Request, res: Response): void => {
  try {
    console.log('📊 API Request: GET /api/chain/constants');
    console.log('👤 Client IP:', req.ip);
    const startTime = Date.now();
    const constants = papiService.getConstants();
    const processingTime = Date.now() - startTime;
    logger.info('Chain constants API called', { clientIp: req.ip, processingTime, constantCount: Object.keys(constants).length });
    console.log(`✅ ${Object.keys(constants).length} constants fetched in ${processingTime}ms`);
    res.json({
      success: true,
      data: constants,
      metadata: {
        count: Object.keys(constants).length,
        processingTime: `${processingTime}ms`,
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('❌ Error fetching chain constants:', error);
    logger.error('Chain constants API error', { error, clientIp: req.ip });
    res.status(500).json({
      success: false,
      error: 'Failed to fetch chain constants',
      message: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString(),
    });
  }
};

export const getBlockInfo = async (req: Request, res: Response): Promise<void> => {
  try {
    const blockNumber = parseInt(req.params.number, 10);
    console.log(`📊 API Request: GET /api/chain/block/${blockNumber}`);
    console.log('👤 Client IP:', req.ip);
    const startTime = Date.now();
    const block = await papiService.getBlockInfo(blockNumber);
    const processingTime = Date.now() - startTime;
    logger.info('Block info API called', { clientIp: req.ip, blockNumber, processingTime });
    console.log(`✅ Block ${blockNumber} fetched in ${processingTime}ms`);
    res.json({
      success: true,
      data: block,
      metadata: {
        blockNumber,
        processingTime: `${processingTime}ms`,
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('❌ Error fetching block info:', error);
    logger.error('Block info API error', { error, clientIp: req.ip, blockNumber: req.params.number });
    res.status(500).json({
      success: false,
      error: 'Failed to fetch block information',
      message: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString(),
    });
  }
};

export const getLatestBlock = async (req: Request, res: Response): Promise<void> => {
  try {
    console.log('📊 API Request: GET /api/chain/latest');
    console.log('👤 Client IP:', req.ip);
    const startTime = Date.now();
    const blockNumber = await papiService.getLatestBlockNumber();
    const processingTime = Date.now() - startTime;
    logger.info('Latest block API called', { clientIp: req.ip, processingTime, blockNumber });
    console.log(`✅ Latest block number fetched in ${processingTime}ms: ${blockNumber}`);
    res.json({
      success: true,
      data: { blockNumber },
      metadata: {
        processingTime: `${processingTime}ms`,
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('❌ Error fetching latest block:', error);
    logger.error('Latest block API error', { error, clientIp: req.ip });
    res.status(500).json({
      success: false,
      error: 'Failed to fetch latest block number',
      message: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString(),
    });
  }
};