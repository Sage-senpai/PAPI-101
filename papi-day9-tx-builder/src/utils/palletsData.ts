// src/utils/palletsData.ts
import { PalletInfo } from '../types/transaction';

export const POLKADOT_PALLETS: PalletInfo[] = [
  {
    name: 'Balances',
    calls: [
      'transfer',
      'transfer_keep_alive',
      'transfer_all',
      'force_transfer',
      'set_balance',
    ],
    description: 'Handles accounts and balances',
    index: 5,
  },
  {
    name: 'Staking',
    calls: [
      'bond',
      'bond_extra',
      'unbond',
      'rebond',
      'withdraw_unbonded',
      'validate',
      'nominate',
      'chill',
      'set_payee',
    ],
    description: 'Nominated Proof-of-Stake system',
    index: 7,
  },
  {
    name: 'Utility',
    calls: [
      'batch',
      'batch_all',
      'force_batch',
      'as_derivative',
    ],
    description: 'Multi-call and dispatch utilities',
    index: 24,
  },
  {
    name: 'Multisig',
    calls: [
      'as_multi',
      'approve_as_multi',
      'cancel_as_multi',
    ],
    description: 'Multi-signature dispatch',
    index: 30,
  },
  {
    name: 'Assets',
    calls: [
      'create',
      'force_create',
      'mint',
      'burn',
      'transfer',
      'transfer_keep_alive',
      'force_transfer',
      'freeze',
      'thaw',
    ],
    description: 'Fungible asset management',
    index: 50,
  },
];

export const getCallDescription = (pallet: string, call: string): string => {
  const descriptions: Record<string, Record<string, string>> = {
    Balances: {
      transfer: 'Transfer some liquid free balance to another account',
      transfer_keep_alive: 'Transfer some liquid free balance to another account, keeping the sender alive',
      transfer_all: 'Transfer the entire transferable balance to another account',
      force_transfer: 'Transfer some liquid free balance from one account to another',
      set_balance: 'Set the balances of a given account',
    },
    Staking: {
      bond: 'Take the origin account as a stash and lock up value',
      bond_extra: 'Add extra funds that have appeared in the stash',
      unbond: 'Schedule a portion of the stash to be unlocked',
      rebond: 'Rebond a portion of the stash',
      withdraw_unbonded: 'Withdraw unbonded funds from the staking system',
    },
  };
  
  return descriptions[pallet]?.[call] || `Execute ${call} from ${pallet} pallet`;
};

export const getCallParameters = (pallet: string, call: string): Record<string, any> => {
  const templates: Record<string, Record<string, any>> = {
    Balances: {
      transfer: {
        dest: '5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty',
        value: BigInt(10000000000),
      },
      transfer_keep_alive: {
        dest: '5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty',
        value: BigInt(10000000000),
      },
      transfer_all: {
        dest: '5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty',
        keep_alive: true,
      },
    },
    Staking: {
      bond: {
        controller: '5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty',
        value: BigInt(100000000000),
        payee: 'Staked',
      },
      bond_extra: {
        max_additional: BigInt(10000000000),
      },
      unbond: {
        value: BigInt(10000000000),
      },
    },
  };
  
  return templates[pallet]?.[call] || {};
};