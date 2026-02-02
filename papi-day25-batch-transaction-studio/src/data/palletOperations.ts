import type { TransactionOperation, BatchTemplate } from '../types/batch.types';

export const PALLET_OPERATIONS: TransactionOperation[] = [
  {
    id: 'balances-transfer',
    pallet: 'Balances',
    method: 'transfer_keep_alive',
    description: 'Transfer tokens while keeping sender alive',
    parameters: [
      { name: 'dest', type: 'MultiAddress', description: 'Destination address', required: true, defaultValue: '5FHneW3U6...' },
      { name: 'value', type: 'Compact<u128>', description: 'Amount in smallest unit', required: true, defaultValue: '10000000000' },
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
    description: 'Bond funds for staking rewards',
    parameters: [
      { name: 'controller', type: 'AccountId', description: 'Controller account', required: true, defaultValue: '5Grwva1...' },
      { name: 'value', type: 'Compact<u128>', description: 'Amount to bond', required: true, defaultValue: '100000000000' },
      { name: 'payee', type: 'RewardDestination', description: 'Where rewards go', required: true, defaultValue: 'Staked' },
    ],
    estimatedGas: 95000,
    color: '#8B5CF6',
    icon: '🔒',
    category: 'staking',
  },
  {
    id: 'staking-nominate',
    pallet: 'Staking',
    method: 'nominate',
    description: 'Nominate one or more validators',
    parameters: [
      { name: 'targets', type: 'Vec<MultiAddress>', description: 'Validator addresses', required: true, defaultValue: '5GrwvaBe...' },
    ],
    estimatedGas: 88000,
    color: '#8B5CF6',
    icon: '⭐',
    category: 'staking',
  },
  {
    id: 'utility-batch-all',
    pallet: 'Utility',
    method: 'batch_all',
    description: 'Atomic batch — all succeed or none execute',
    parameters: [
      { name: 'calls', type: 'Vec<Call>', description: 'Calls to execute atomically', required: true, defaultValue: null },
    ],
    estimatedGas: 45000,
    color: '#10B981',
    icon: '⚛️',
    category: 'utility',
  },
  {
    id: 'utility-batch',
    pallet: 'Utility',
    method: 'batch',
    description: 'Non-atomic batch — continues on individual failures',
    parameters: [
      { name: 'calls', type: 'Vec<Call>', description: 'Calls to execute', required: true, defaultValue: null },
    ],
    estimatedGas: 42000,
    color: '#059669',
    icon: '📦',
    category: 'utility',
  },
  {
    id: 'utility-force-batch',
    pallet: 'Utility',
    method: 'force_batch',
    description: 'Force batch — execute all regardless of failures',
    parameters: [
      { name: 'calls', type: 'Vec<Call>', description: 'Calls to force-execute', required: true, defaultValue: null },
    ],
    estimatedGas: 48000,
    color: '#6366F1',
    icon: '⚡',
    category: 'utility',
  },
  {
    id: 'democracy-vote',
    pallet: 'Democracy',
    method: 'vote',
    description: 'Cast a vote on an active referendum',
    parameters: [
      { name: 'ref_index', type: 'ReferendumIndex', description: 'Referendum index', required: true, defaultValue: '0' },
      { name: 'vote', type: 'AccountVote', description: 'Aye or Nay with conviction', required: true, defaultValue: 'Aye' },
    ],
    estimatedGas: 85000,
    color: '#F59E0B',
    icon: '🗳️',
    category: 'governance',
  },
  {
    id: 'multisig-approve',
    pallet: 'Multisig',
    method: 'approve_as_multi',
    description: 'Approve a pending multisig transaction',
    parameters: [
      { name: 'threshold', type: 'u16', description: 'Required approval count', required: true, defaultValue: '2' },
      { name: 'other_signatories', type: 'Vec<AccountId>', description: 'Other signer addresses', required: true, defaultValue: '5GrwvaBe...' },
      { name: 'call_hash', type: '[u8; 32]', description: 'Hash of the call to approve', required: true, defaultValue: '0x0000...' },
    ],
    estimatedGas: 110000,
    color: '#EF4444',
    icon: '👥',
    category: 'utility',
  },
  {
    id: 'assets-transfer',
    pallet: 'Assets',
    method: 'transfer',
    description: 'Transfer a custom asset to another account',
    parameters: [
      { name: 'id', type: 'AssetId', description: 'Asset identifier', required: true, defaultValue: '1' },
      { name: 'target', type: 'MultiAddress', description: 'Destination address', required: true, defaultValue: '5FHneW3U6...' },
      { name: 'amount', type: 'Compact<u128>', description: 'Token amount', required: true, defaultValue: '1000000' },
    ],
    estimatedGas: 72000,
    color: '#06B6D4',
    icon: '🏦',
    category: 'assets',
  },
];

export const BATCH_TEMPLATES: BatchTemplate[] = [
  {
    id: 'defi-power-combo',
    name: 'DeFi Power Combo',
    description: 'Transfer → Bond → Nominate in one atomic transaction',
    operations: [
      PALLET_OPERATIONS[0], // balances-transfer
      PALLET_OPERATIONS[1], // staking-bond
      PALLET_OPERATIONS[2], // staking-nominate
    ],
    useCases: ['Daily staking routine', 'Portfolio rebalancing'],
    estimatedSavings: 78,
    complexity: 'medium',
  },
  {
    id: 'governance-bundle',
    name: 'Governance Bundle',
    description: 'Vote on referendum + approve multisig in one go',
    operations: [
      PALLET_OPERATIONS[6], // democracy-vote
      PALLET_OPERATIONS[7], // multisig-approve
    ],
    useCases: ['DAO operations', 'Governance participation'],
    estimatedSavings: 62,
    complexity: 'simple',
  },
  {
    id: 'multi-asset-sweep',
    name: 'Multi-Asset Sweep',
    description: 'Move native + custom assets to a single destination',
    operations: [
      PALLET_OPERATIONS[0], // balances-transfer
      PALLET_OPERATIONS[8], // assets-transfer
      PALLET_OPERATIONS[8], // assets-transfer (second asset)
    ],
    useCases: ['Exchange deposits', 'Treasury consolidation'],
    estimatedSavings: 71,
    complexity: 'complex',
  },
];