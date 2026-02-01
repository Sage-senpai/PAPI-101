import { TransactionOperation } from '../types/batch.types';

export const PALLET_OPERATIONS: TransactionOperation[] = [
  {
    id: 'balances-transfer',
    pallet: 'Balances',
    method: 'transfer_keep_alive',
    description: 'Transfer tokens while keeping sender alive',
    parameters: [
      { name: 'dest', type: 'MultiAddress', description: 'Destination', required: true },
      { name: 'value', type: 'Compact<u128>', description: 'Amount', required: true, defaultValue: '10000000000' },
    ],
    estimatedGas: 65000,
    color: '#3B82F6',
    icon: '💸',
    category: 'transfer',
  },
  {
    id: 'staking-bond',
    pallet: 'Staking',
    method: 'bond',
    description: 'Bond funds for staking',
    parameters: [
      { name: 'controller', type: 'AccountId', description: 'Controller account', required: true },
      { name: 'value', type: 'Compact<u128>', description: 'Bond amount', required: true, defaultValue: '100000000000' },
      { name: 'payee', type: 'RewardDestination', description: 'Reward destination', required: true, defaultValue: 'Staked' },
    ],
    estimatedGas: 95000,
    color: '#8B5CF6',
    icon: '🔒',
    category: 'staking',
  },
  {
    id: 'utility-batch-all',
    pallet: 'Utility',
    method: 'batch_all',
    description: 'Atomic batch – all succeed or none execute',
    parameters: [
      { name: 'calls', type: 'Vec<Call>', description: 'Calls to execute', required: true },
    ],
    estimatedGas: 45000,
    color: '#059669',
    icon: '🔄',
    category: 'utility',
  },
  {
    id: 'democracy-vote',
    pallet: 'Democracy',
    method: 'vote',
    description: 'Cast vote on referendum',
    parameters: [
      { name: 'ref_index', type: 'ReferendumIndex', description: 'Referendum index', required: true },
      { name: 'vote', type: 'AccountVote', description: 'Vote details', required: true },
    ],
    estimatedGas: 85000,
    color: '#F59E0B',
    icon: '🗳️',
    category: 'governance',
  },
  {
    id: 'assets-transfer',
    pallet: 'Assets',
    method: 'transfer',
    description: 'Transfer custom assets',
    parameters: [
      { name: 'id', type: 'AssetId', description: 'Asset identifier', required: true },
      { name: 'target', type: 'MultiAddress', description: 'Destination', required: true },
      { name: 'amount', type: 'Compact<u128>', description: 'Amount', required: true },
    ],
    estimatedGas: 72000,
    color: '#06B6D4',
    icon: '🏦',
    category: 'assets',
  },
  // Add 3-4 more realistic operations for variety
];

export const BATCH_TEMPLATES = [
  {
    id: 'staking-full-cycle',
    name: 'Full Staking Cycle',
    description: 'Transfer → Bond → Nominate in one atomic batch',
    operations: [
      PALLET_OPERATIONS[0],
      PALLET_OPERATIONS[1],
      // Add nominate operation
    ],
    estimatedSavings: 78,
  },
  // More templates...
];