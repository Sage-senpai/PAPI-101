export interface ChainConfig {
  id: string;
  name: string;
  tokenSymbol: string;
  color: string;
  rpcEndpoint: string;
  parachainId: number;
  isRelayChain: boolean;
  status: 'online' | 'syncing' | 'offline';
  lastBlock: number;
  specVersion: number;
  peers: number;
  averageBlockTime: number;
  totalIssuance: string;
  activeAccounts: number;
  features: string[];
  icon: string;
}

export const CHAINS: ChainConfig[] = [
  {
    id: 'polkadot',
    name: 'Polkadot',
    tokenSymbol: 'DOT',
    color: '#E6007A',
    rpcEndpoint: 'wss://rpc.polkadot.io',
    parachainId: 0,
    isRelayChain: true,
    status: 'online',
    lastBlock: 0,
    specVersion: 0,
    peers: 0,
    averageBlockTime: 6,
    totalIssuance: '1.4B+',
    activeAccounts: 0,
    features: ['Shared Security', 'Governance', 'Parachains'],
    icon: '🏗️',
  },
  {
    id: 'kusama',
    name: 'Kusama',
    tokenSymbol: 'KSM',
    color: '#000000',
    rpcEndpoint: 'wss://kusama-rpc.polkadot.io',
    parachainId: 0,
    isRelayChain: true,
    status: 'online',
    lastBlock: 0,
    specVersion: 0,
    peers: 0,
    averageBlockTime: 6,
    totalIssuance: '10M+',
    activeAccounts: 0,
    features: ['Canary Network', 'Fast Upgrades', 'Experimental Features'],
    icon: '🎪',
  },
  {
    id: 'astar',
    name: 'Astar Network',
    tokenSymbol: 'ASTR',
    color: '#0085FF',
    rpcEndpoint: 'wss://astar-rpc.dwellir.com',
    parachainId: 2006,
    isRelayChain: false,
    status: 'online',
    lastBlock: 0,
    specVersion: 0,
    peers: 0,
    averageBlockTime: 12,
    totalIssuance: '7B+',
    activeAccounts: 0,
    features: ['EVM + WASM', 'dApp Staking', 'Multi-VM'],
    icon: '⭐',
  },
  {
    id: 'moonbeam',
    name: 'Moonbeam',
    tokenSymbol: 'GLMR',
    color: '#5A4FCF',
    rpcEndpoint: 'wss://moonbeam.public.blastapi.io',
    parachainId: 2004,
    isRelayChain: false,
    status: 'online',
    lastBlock: 0,
    specVersion: 0,
    peers: 0,
    averageBlockTime: 12,
    totalIssuance: '1B+',
    activeAccounts: 0,
    features: ['Ethereum Compatible', 'Solidity Support', 'Cross-Chain'],
    icon: '🌙',
  },
  {
    id: 'acala',
    name: 'Acala',
    tokenSymbol: 'ACA',
    color: '#FF4F7D',
    rpcEndpoint: 'wss://acala-rpc.dwellir.com',
    parachainId: 2000,
    isRelayChain: false,
    status: 'online',
    lastBlock: 0,
    specVersion: 0,
    peers: 0,
    averageBlockTime: 12,
    totalIssuance: '1.2B+',
    activeAccounts: 0,
    features: ['DeFi Hub', 'Stablecoins', 'Liquid Staking'],
    icon: '🦋',
  },
  {
    id: 'parallel',
    name: 'Parallel Finance',
    tokenSymbol: 'PARA',
    color: '#EF3A37',
    rpcEndpoint: 'wss://parallel.api.onfinality.io/public-ws',
    parachainId: 2012,
    isRelayChain: false,
    status: 'online',
    lastBlock: 0,
    specVersion: 0,
    peers: 0,
    averageBlockTime: 12,
    totalIssuance: '1B+',
    activeAccounts: 0,
    features: ['Lending', 'Liquid Staking', 'AMM'],
    icon: '⚡',
  },
];

export interface CrossChainComparison {
  metric: string;
  values: Record<string, any>;
  bestPerformer?: string;
}

export interface CrossChainAlert {
  id: string;
  type: 'info' | 'warning' | 'danger' | 'success';
  chain: string;
  message: string;
  timestamp: string;
  priority: number;
}