// src/utils/transactionExamples.ts
// ==========================================
import type { ExampleTransaction } from '../types/decoding';

export const EXAMPLE_TRANSACTIONS: ExampleTransaction[] = [
  {
    id: 'transfer-1',
    name: 'Simple Balance Transfer',
    hex: '0x0400a0dec5ad1224d8e1c7c0c5c54e50e0e7e7d1b5a0b6a3b5c0d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4',
    description: 'Transfer 1 DOT to another account (Balances.transfer)',
    category: 'balances',
    difficulty: 'easy',
    tags: ['transfer', 'balances', 'beginner']
  },
  {
    id: 'staking-bond',
    name: 'Staking Bond',
    hex: '0x0700a0dec5ad1224d8e1c7c0c5c54e50e0e7e7d1b5a0b6a3b5c0d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8',
    description: 'Bond 100 DOT for staking with controller account',
    category: 'staking',
    difficulty: 'medium',
    tags: ['staking', 'bond', 'validator']
  },
  {
    id: 'batch-transfer',
    name: 'Utility Batch',
    hex: '0x1802a0dec5ad1224d8e1c7c0c5c54e50e0e7e7d1b5a0b6a3b5c0d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3',
    description: 'Batch of multiple transfers in one transaction',
    category: 'utility',
    difficulty: 'hard',
    tags: ['batch', 'utility', 'advanced']
  }
];
