export interface ChainConfig {
  id: string;
  name: string;
  wsEndpoint: string;
  color: string;
  testnet: boolean;
  supportedEvents: string[];
  status: 'connected' | 'connecting' | 'disconnected';
}

export const CHAINS: ChainConfig[] = [
  {
    id: 'polkadot',
    name: 'Polkadot',
    wsEndpoint: 'wss://rpc.polkadot.io',
    color: '#E6007A',
    testnet: false,
    supportedEvents: [
      'Balances.Transfer',
      'Staking.Rewarded',
      'Staking.Slashed',
      'Democracy.Proposed',
      'Treasury.Deposit',
    ],
    status: 'disconnected',
  },
  {
    id: 'kusama',
    name: 'Kusama',
    wsEndpoint: 'wss://kusama-rpc.polkadot.io',
    color: '#000000',
    testnet: false,
    supportedEvents: [
      'Balances.Transfer',
      'Staking.Rewarded',
      'Crowdloan.Contributed',
      'ParachainStaking.Rewarded',
    ],
    status: 'disconnected',
  },
  {
    id: 'westend',
    name: 'Westend',
    wsEndpoint: 'wss://westend-rpc.polkadot.io',
    color: '#DA68A7',
    testnet: true,
    supportedEvents: [
      'Balances.Transfer',
      'System.NewAccount',
      'Utility.BatchCompleted',
      'Sudo.Sudid',
    ],
    status: 'disconnected',
  },
];

export interface EventType {
  id: string;
  name: string;
  description: string;
  severity: 'info' | 'warning' | 'danger' | 'success';
  chains: string[];
  importance: number; // 1-10
}

export const EVENT_TYPES: EventType[] = [
  {
    id: 'balances.transfer',
    name: 'Balances.Transfer',
    description: 'Transfer of native tokens between accounts',
    severity: 'info',
    chains: ['polkadot', 'kusama', 'westend'],
    importance: 8,
  },
  {
    id: 'staking.rewarded',
    name: 'Staking.Rewarded',
    description: 'Staking rewards distributed to validators/nominators',
    severity: 'success',
    chains: ['polkadot', 'kusama'],
    importance: 9,
  },
  {
    id: 'staking.slashed',
    name: 'Staking.Slashed',
    description: 'Validator/nominator slashed for misbehavior',
    severity: 'danger',
    chains: ['polkadot', 'kusama'],
    importance: 10,
  },
  {
    id: 'democracy.proposed',
    name: 'Democracy.Proposed',
    description: 'New democracy proposal submitted',
    severity: 'warning',
    chains: ['polkadot', 'kusama'],
    importance: 7,
  },
  {
    id: 'treasury.deposit',
    name: 'Treasury.Deposit',
    description: 'Funds deposited to treasury',
    severity: 'info',
    chains: ['polkadot', 'kusama'],
    importance: 6,
  },
  {
    id: 'system.newaccount',
    name: 'System.NewAccount',
    description: 'New account created on-chain',
    severity: 'info',
    chains: ['westend'],
    importance: 5,
  },
];