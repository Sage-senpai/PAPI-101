//src/types/multiChain.ts
export interface ChainConfig {
  id: string;
  name: string;
  network: 'polkadot' | 'kusama' | 'westend';
  rpcUrl: string;
  token: string;
  tokenDecimals: number;
  color: string;
  icon: string;
  description: string;
  isActive: boolean;
  specVersion?: number;
  genesisHash?: string;
}

export interface ChainMetrics {
  chainId: string;
  timestamp: Date;
  blockNumber: number;
  blockHash: string;
  specVersion: number;
  transactionVersion: number;
  validatorCount: number;
  totalIssuance: bigint;
  activeAccounts: number;
  epochProgress: number;
  latency: number; // ms
  status: 'connected' | 'connecting' | 'disconnected' | 'error';
  lastError?: string;
}

export interface CrossChainComparison {
  timestamp: Date;
  metrics: {
    [chainId: string]: ChainMetrics;
  };
  comparisons: {
    fastestChain: string;
    highestBlock: string;
    latestVersion: string;
    mostActive: string;
  };
  statistics: {
    totalBlocks: number;
    totalValidators: number;
    totalIssuance: bigint;
    averageLatency: number;
  };
}

export interface CrossChainOperation {
  id: string;
  type: 'query' | 'transaction' | 'subscription';
  chains: string[];
  status: 'pending' | 'executing' | 'completed' | 'failed';
  results: {
    [chainId: string]: {
      success: boolean;
      data?: any;
      error?: string;
      duration: number;
    };
  };
  startedAt: Date;
  completedAt?: Date;
}

export interface ChainConnection {
  api: any; // TypedApi instance
  client: any; // PAPI client
  provider: any; // Provider instance
  metrics: ChainMetrics;
  lastUpdate: Date;
}