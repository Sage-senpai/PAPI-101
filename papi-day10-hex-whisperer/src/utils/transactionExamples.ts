// src/utils/transactionExamples.ts
// Real transaction examples from Polkadot chain
import type { ExampleTransaction } from '../types/decoding';

export const EXAMPLE_TRANSACTIONS: ExampleTransaction[] = [
  {
    id: 'transfer-1',
    name: 'Balance Transfer (Balances.transfer_keep_alive)',
    hex: '0x040300913c63c91273cdc1f5d806f97e60f18c3e53c283d3f3a8d7f3e6b5a8f8e9d7c6b5a4936f0f',
    description: 'Transfer DOT using transfer_keep_alive to ensure sender account stays alive',
    category: 'balances',
    difficulty: 'easy',
    tags: ['transfer', 'balances', 'beginner']
  },
  {
    id: 'transfer-2',
    name: 'Simple Balance Transfer (Balances.transfer)',
    hex: '0x040000d43593c715fdd31c61141abd04a99fd6822c8558854ccde39a5684e7a56da27d0700e8764817',
    description: 'Basic balance transfer from one account to another',
    category: 'balances',
    difficulty: 'easy',
    tags: ['transfer', 'balances', 'basic']
  },
  {
    id: 'staking-bond',
    name: 'Staking Bond (Staking.bond)',
    hex: '0x070000d43593c715fdd31c61141abd04a99fd6822c8558854ccde39a5684e7a56da27d0700e40b540201',
    description: 'Bond DOT tokens for staking with a controller account',
    category: 'staking',
    difficulty: 'medium',
    tags: ['staking', 'bond', 'validator']
  },
  {
    id: 'staking-nominate',
    name: 'Nominate Validators (Staking.nominate)',
    hex: '0x070504d43593c715fdd31c61141abd04a99fd6822c8558854ccde39a5684e7a56da27d',
    description: 'Nominate validators to stake your bonded tokens',
    category: 'staking',
    difficulty: 'medium',
    tags: ['staking', 'nominate', 'validator']
  },
  {
    id: 'utility-batch',
    name: 'Batch Transactions (Utility.batch)',
    hex: '0x180008040300d43593c715fdd31c61141abd04a99fd6822c8558854ccde39a5684e7a56da27d0700e87648170403008eaf04151687736326c9fea17e25fc5287613693c912909cb226aa4794f26a480700e8764817',
    description: 'Execute multiple transactions atomically in a single batch',
    category: 'utility',
    difficulty: 'hard',
    tags: ['batch', 'utility', 'advanced']
  },
  {
    id: 'utility-batch-all',
    name: 'Batch All (Utility.batch_all)',
    hex: '0x180208040000d43593c715fdd31c61141abd04a99fd6822c8558854ccde39a5684e7a56da27d0700e8764817',
    description: 'Batch transactions with all-or-nothing execution guarantee',
    category: 'utility',
    difficulty: 'hard',
    tags: ['batch', 'utility', 'atomic']
  },
  {
    id: 'proxy-add',
    name: 'Add Proxy (Proxy.add_proxy)',
    hex: '0x1d0100d43593c715fdd31c61141abd04a99fd6822c8558854ccde39a5684e7a56da27d0000',
    description: 'Add a proxy account for delegation',
    category: 'utility',
    difficulty: 'medium',
    tags: ['proxy', 'delegation', 'governance']
  },
  {
    id: 'democracy-vote',
    name: 'Democracy Vote (Democracy.vote)',
    hex: '0x0e020100010082',
    description: 'Vote on a referendum in the democracy pallet',
    category: 'governance',
    difficulty: 'medium',
    tags: ['democracy', 'vote', 'governance']
  },
  {
    id: 'multisig-as-multi',
    name: 'Multisig Execution (Multisig.as_multi)',
    hex: '0x1f020302d43593c715fdd31c61141abd04a99fd6822c8558854ccde39a5684e7a56da27d00010203',
    description: 'Execute a multisig transaction requiring multiple approvals',
    category: 'utility',
    difficulty: 'hard',
    tags: ['multisig', 'advanced', 'security']
  },
  {
    id: 'assets-transfer',
    name: 'Assets Transfer (Assets.transfer)',
    hex: '0x320400000000d43593c715fdd31c61141abd04a99fd6822c8558854ccde39a5684e7a56da27d0700e8764817',
    description: 'Transfer custom asset tokens',
    category: 'assets',
    difficulty: 'medium',
    tags: ['assets', 'tokens', 'transfer']
  }
];