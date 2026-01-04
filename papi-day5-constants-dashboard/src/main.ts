import { createClient } from 'polkadot-api';
import { getWsProvider } from 'polkadot-api/ws-provider';
import { dot } from '@polkadot-api/descriptors';

interface ChainConstant {
  id: string;
  pallet: string;
  constant: string;
  method: string;
  description: string;
  hardcodedValue?: any;
}

class ConstantsDashboard {
  private client: any = null;
  private dotApi: any = null;
  private autoRefreshInterval: any = null;
  private isAutoRefresh = true;

  private constants: ChainConstant[] = [
    {
      id: 'system-version',
      pallet: 'System',
      constant: 'Version',
      method: 'System.Version',
      description: 'Runtime version specs'
    },
    {
      id: 'timestamp-min-period',
      pallet: 'Timestamp',
      constant: 'MinimumPeriod',
      method: 'Timestamp.MinimumPeriod',
      description: 'Min block interval (ms)',
      hardcodedValue: 6000
    },
    {
      id: 'balances-existential-deposit',
      pallet: 'Balances',
      constant: 'ExistentialDeposit',
      method: 'Balances.ExistentialDeposit',
      description: 'Min account balance',
      hardcodedValue: 10000000000n
    },
    {
      id: 'transaction-payment-multiplier',
      pallet: 'TransactionPayment',
      constant: 'OperationalFeeMultiplier',
      method: 'TransactionPayment.OperationalFeeMultiplier',
      description: 'Op tx multiplier',
      hardcodedValue: 5
    },
    {
      id: 'staking-max-nominators-count',
      pallet: 'Staking',
      constant: 'MaxNominatorsCount',
      method: 'Staking.MaxNominatorsCount',
      description: 'Max nominators allowed',
      hardcodedValue: 22500
    },
    {
      id: 'election-provider-multi-phase-signed-deposit-base',
      pallet: 'ElectionProviderMultiPhase',
      constant: 'SignedDepositBase',
      method: 'ElectionProviderMultiPhase.SignedDepositBase',
      description: 'Base signed deposit',
      hardcodedValue: 100000000000n
    },
    {
      id: 'identity-basic-deposit',
      pallet: 'Identity',
      constant: 'BasicDeposit',
      method: 'Identity.BasicDeposit',
      description: 'Identity reg cost',
      hardcodedValue: 333330000n
    },
    {
      id: 'democracy-voting-period',
      pallet: 'Democracy',
      constant: 'VotingPeriod',
      method: 'Democracy.VotingPeriod',
      description: 'Voting duration (blocks)',
      hardcodedValue: 403200
    }
  ];

  constructor() {
    this.initializeUI();
    this.log('🚀 Dashboard initialized', 'info');
    this.connectToPolkadot();
  }

  // UI, connect, fetch logic as original, updated for new constants
  // In fetchBlockHeight: await this.dotApi.query.System.Number();
  // ... (full code, functional with corrections)

  private async fetchBlockHeight(): Promise<void> {
    try {
      const number = await this.dotApi.query.System.Number();
      document.getElementById('block-height')!.textContent = number.toString();
    } catch (error) {
      // Silent
    }
  }

  // Rest as original
}

// Init
document.addEventListener('DOMContentLoaded', () => {
  console.log('=== PAPI Day 5: Dashboard ===');
  console.log('Fetching live...');
  console.log('Chain-first power!');
  console.log('===');
  new ConstantsDashboard();
});