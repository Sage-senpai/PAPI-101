import { createClient } from 'polkadot-api';
import { getSmProvider } from '@polkadot-api/sm-provider';
import { chainSpec } from '@polkadot-api/chains/polkadot';
import { start } from 'smoldot';
import { dot } from '@polkadot-api/descriptors';
import { config } from '../config/environment';
import { logger } from '../utils/logger';
import { cacheService } from './cache.service';

class PapiService {
  private client: ReturnType<typeof createClient>;
  private api: ReturnType<ReturnType<typeof createClient>['getTypedApi']>;
  private isConnected = false;

  async initialize(): Promise<void> {
    try {
      console.log(`🔗 Connecting to ${config.papi.chain} using light client...`);
      const smoldot = start();
      const chain = await smoldot.addChain({ chainSpec });
      this.client = createClient(getSmProvider(chain));
      this.api = this.client.getTypedApi(dot);
      this.isConnected = true;
      await this.getChainVersion(); // Test connection
      console.log('✅ PAPI service initialized successfully');
      logger.info('PAPI service connected', { chain: config.papi.chain });
    } catch (error) {
      console.error('❌ Failed to initialize PAPI service:', error);
      logger.error('PAPI initialization failed', { error, chain: config.papi.chain });
      throw error;
    }
  }

  getChainVersion(): any {
    const cacheKey = 'chain:version';
    const cached = cacheService.get(cacheKey);
    if (cached) {
      logger.debug('Chain version served from cache');
      return cached;
    }
    try {
      console.log('📡 Fetching chain version from blockchain...');
      const version = this.api.constants.System.Version;
      const formatted = {
        specName: version.spec_name.toString(),
        implName: version.impl_name.toString(),
        authoringVersion: version.authoring_version,
        specVersion: version.spec_version,
        implVersion: version.impl_version,
        transactionVersion: version.transaction_version,
        stateVersion: version.state_version,
      };
      cacheService.set(cacheKey, formatted);
      logger.info('Chain version fetched', { specVersion: formatted.specVersion });
      return formatted;
    } catch (error) {
      logger.error('Failed to fetch chain version', { error });
      throw error;
    }
  }

  getConstants(): any {
    const cacheKey = 'chain:constants';
    const cached = cacheService.get(cacheKey);
    if (cached) {
      logger.debug('Chain constants served from cache');
      return cached;
    }
    try {
      console.log('📡 Fetching chain constants from blockchain...');
      const constants = {
        system: {
          blockHashCount: this.api.constants.System.BlockHashCount,
          dbWeight: this.api.constants.System.DbWeight,
        },
        balances: {
          existentialDeposit: this.api.constants.Balances.ExistentialDeposit,
        },
        staking: {
          historyDepth: this.api.constants.Staking.HistoryDepth,
        },
        // Add more as needed
      };
      cacheService.set(cacheKey, constants);
      logger.info('Chain constants fetched', { count: Object.keys(constants).length });
      return constants;
    } catch (error) {
      logger.error('Failed to fetch chain constants', { error });
      throw error;
    }
  }

  async getBlockInfo(blockNumber: number): Promise<any> {
    const cacheKey = `block:${blockNumber}`;
    const cached = cacheService.get(cacheKey);
    if (cached) {
      logger.debug('Block info served from cache', { blockNumber });
      return cached;
    }
    try {
      console.log(`📡 Fetching block ${blockNumber} from blockchain...`);
      const hash = await this.api.rpc.chain.getBlockHash(blockNumber);
      const block = await this.api.rpc.chain.getBlock(hash);
      cacheService.set(cacheKey, block);
      logger.info('Block info fetched', { blockNumber });
      return block;
    } catch (error) {
      logger.error('Failed to fetch block info', { error, blockNumber });
      throw error;
    }
  }

  async getLatestBlockNumber(): Promise<number> {
    try {
      const header = await this.api.rpc.chain.getHeader();
      return header.number;
    } catch (error) {
      logger.error('Failed to fetch latest block number', { error });
      throw error;
    }
  }

  isReady(): boolean {
    return this.isConnected;
  }

  getApi(): any {
    if (!this.isConnected) {
      throw new Error('PAPI service not initialized');
    }
    return this.api;
  }
}

export const papiService = new PapiService();

export const initPapiService = async (): Promise<void> => {
  await papiService.initialize();
};