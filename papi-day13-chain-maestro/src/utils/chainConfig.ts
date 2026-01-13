// src/utils/chainConfig.ts
import type { ChainConfig, ChainMetrics } from '../types/multiChain';

export const CHAIN_CONFIGS: ChainConfig[] = [
  {
    id: 'polkadot',
    name: 'Polkadot',
    network: 'polkadot',
    rpcUrl: 'wss://rpc.polkadot.io',
    token: 'DOT',
    tokenDecimals: 10,
    color: '#E6007A',
    icon: '🟣',
    description: 'The flagship blockchain for security and stability',
    isActive: true
  },
  {
    id: 'kusama',
    name: 'Kusama',
    network: 'kusama',
    rpcUrl: 'wss://kusama-rpc.polkadot.io',
    token: 'KSM',
    tokenDecimals: 12,
    color: '#000000',
    icon: '🟡',
    description: 'The canary network for fast-paced experimentation',
    isActive: true
  },
  {
    id: 'westend',
    name: 'Westend',
    network: 'westend',
    rpcUrl: 'wss://westend-rpc.polkadot.io',
    token: 'WND',
    tokenDecimals: 12,
    color: '#00AEEF',
    icon: '🔵',
    description: 'Test network for development and experimentation',
    isActive: true
  }
];

export const getChainConfig = (chainId: string): ChainConfig | undefined => {
  return CHAIN_CONFIGS.find(chain => chain.id === chainId);
};

export const getChainColor = (chainId: string): string => {
  const config = getChainConfig(chainId);
  return config?.color || '#6D28D9';
};

export const getChainIcon = (chainId: string): string => {
  const config = getChainConfig(chainId);
  return config?.icon || '⛓️';
};

export const formatTokenAmount = (amount: bigint, chainId: string): string => {
  const config = getChainConfig(chainId);
  if (!config) return '0';
  
  const divisor = BigInt(10 ** config.tokenDecimals);
  const whole = amount / divisor;
  const fractional = amount % divisor;
  
  return `${whole.toLocaleString()}.${fractional.toString().padStart(config.tokenDecimals, '0').slice(0, 4)} ${config.token}`;
};

export const calculateChainPerformance = (metrics: ChainMetrics[]): {
  fastest: string;
  slowest: string;
  averageLatency: number;
  reliability: number;
} => {
  if (metrics.length === 0) {
    return {
      fastest: 'N/A',
      slowest: 'N/A',
      averageLatency: 0,
      reliability: 0
    };
  }
  
  const validMetrics = metrics.filter(m => m.latency > 0);
  const averageLatency = validMetrics.reduce((sum, m) => sum + m.latency, 0) / validMetrics.length;
  const fastest = validMetrics.reduce((min, m) => m.latency < min.latency ? m : min, validMetrics[0]);
  const slowest = validMetrics.reduce((max, m) => m.latency > max.latency ? m : max, validMetrics[0]);
  const reliability = (validMetrics.length / metrics.length) * 100;
  
  return {
    fastest: fastest?.chainId || 'N/A',
    slowest: slowest?.chainId || 'N/A',
    averageLatency,
    reliability
  };
};

export const compareChains = (chainA: ChainMetrics, chainB: ChainMetrics, metric: keyof ChainMetrics): number => {
  const valueA = chainA[metric];
  const valueB = chainB[metric];
  
  if (typeof valueA === 'number' && typeof valueB === 'number') {
    if (valueA > valueB) return -1;
    if (valueA < valueB) return 1;
  }
  
  return 0;
};