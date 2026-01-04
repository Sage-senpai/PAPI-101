/**
 * PAPI Day 5: Chain Constants Dashboard
 * 
 * This application demonstrates:
 * 1. Fetching live constants from Polkadot
 * 2. Why hardcoded values are technical debt
 * 3. Auto-refresh and real-time updates
 * 4. Comparing hardcoded vs live values
 * 
 * Key Learning: Always fetch constants from chain, never hardcode!
 */

import { createClient } from 'polkadot-api';
import { getWsProvider } from 'polkadot-api/ws-provider/web';
import { dot } from '@polkadot-api/descriptors';

interface ChainConstant {
  id: string;
  pallet: string;
  constant: string;
  method: string;
  description: string;
  hardcodedValue?: any;
  liveValue?: any;
  lastFetched?: string;
  status?: 'pending' | 'success' | 'error';
}

class ConstantsDashboard {
  private client: any = null;
  private dotApi: any = null;
  private autoRefreshInterval: any = null;
  private isAutoRefresh = true;
  private fetchCount = 0;

  private constants: ChainConstant[] = [
    {
      id: 'system-version',
      pallet: 'System',
      constant: 'Version',
      method: 'System.Version',
      description: 'Runtime version specifications'
    },
    {
      id: 'timestamp-min-period',
      pallet: 'Timestamp',
      constant: 'MinimumPeriod',
      method: 'Timestamp.MinimumPeriod',
      description: 'Minimum block interval (milliseconds)',
      hardcodedValue: '6000ms'
    },
    {
      id: 'balances-existential-deposit',
      pallet: 'Balances',
      constant: 'ExistentialDeposit',
      method: 'Balances.ExistentialDeposit',
      description: 'Minimum account balance to exist',
      hardcodedValue: '1 DOT (10000000000n)'
    },
    {
      id: 'transaction-payment-multiplier',
      pallet: 'TransactionPayment',
      constant: 'OperationalFeeMultiplier',
      method: 'TransactionPayment.OperationalFeeMultiplier',
      description: 'Operational transaction fee multiplier',
      hardcodedValue: '5'
    },
    {
      id: 'staking-bonding-duration',
      pallet: 'Staking',
      constant: 'BondingDuration',
      method: 'Staking.BondingDuration',
      description: 'Eras before unbonding completes',
      hardcodedValue: '28 eras'
    },
    {
      id: 'staking-sessions-per-era',
      pallet: 'Staking',
      constant: 'SessionsPerEra',
      method: 'Staking.SessionsPerEra',
      description: 'Number of sessions in one era',
      hardcodedValue: '6 sessions'
    },
    {
      id: 'staking-max-unlocking-chunks',
      pallet: 'Staking',
      constant: 'MaxUnlockingChunks',
      method: 'Staking.MaxUnlockingChunks',
      description: 'Max unbonding chunks per account',
      hardcodedValue: '32 chunks'
    },
    {
      id: 'balances-max-locks',
      pallet: 'Balances',
      constant: 'MaxLocks',
      method: 'Balances.MaxLocks',
      description: 'Maximum number of locks on account',
      hardcodedValue: '50 locks'
    }
  ];

  constructor() {
    this.log('🚀 Chain Constants Dashboard initialized', 'info');
    this.log('💡 Fetching live values prevents technical debt!', 'info');
    this.initializeUI();
    this.connectToPolkadot();
  }

  /**
   * Initialize UI event listeners
   */
  private initializeUI(): void {
    // Fetch all button
    const fetchBtn = document.getElementById('fetch-all-btn');
    fetchBtn?.addEventListener('click', () => this.fetchAllConstants());

    // Export button
    const exportBtn = document.getElementById('export-btn');
    exportBtn?.addEventListener('click', () => this.exportConstants());

    // Auto-refresh toggle
    const autoRefreshToggle = document.getElementById('auto-refresh-toggle') as HTMLInputElement;
    autoRefreshToggle?.addEventListener('change', (e) => {
      this.isAutoRefresh = (e.target as HTMLInputElement).checked;
      if (this.isAutoRefresh) {
        this.startAutoRefresh();
        this.log('✅ Auto-refresh enabled (30s interval)', 'success');
      } else {
        this.stopAutoRefresh();
        this.log('⏸️  Auto-refresh disabled', 'info');
      }
    });

    // Clear console button
    const clearBtn = document.getElementById('clear-console');
    clearBtn?.addEventListener('click', () => this.clearConsole());

    // Copy buttons
    document.querySelectorAll('.copy-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const target = (e.currentTarget as HTMLElement).getAttribute('data-target');
        if (target) this.copyCode(target);
      });
    });
  }

  /**
   * Connect to Polkadot and create TypedApi instance
   */
  private async connectToPolkadot(): Promise<void> {
    const statusEl = document.getElementById('chain-status');
    
    try {
      this.log('🔌 Connecting to Polkadot mainnet...', 'info');
      
      if (statusEl) statusEl.textContent = 'Connecting...';
      
      // Create client with WebSocket provider
      this.client = createClient(
        getWsProvider('wss://rpc.polkadot.io')
      );
      
      // Get TypedApi instance
      this.dotApi = this.client.getTypedApi(dot);
      
      this.log('✅ Connected to Polkadot!', 'success');
      
      if (statusEl) {
        statusEl.textContent = 'Polkadot Mainnet';
        statusEl.style.color = 'var(--polkadot-success)';
      }
      
      // Fetch initial data
      await this.fetchRuntimeInfo();
      await this.fetchAllConstants();
      
      // Start auto-refresh
      if (this.isAutoRefresh) {
        this.startAutoRefresh();
      }
      
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Unknown error';
      this.log(`❌ Connection failed: ${errorMsg}`, 'error');
      
      if (statusEl) {
        statusEl.textContent = 'Connection Failed';
        statusEl.style.color = 'var(--polkadot-error)';
      }
    }
  }

  /**
   * Fetch runtime version and block height
   */
  private async fetchRuntimeInfo(): Promise<void> {
    try {
      // Fetch version
      const version = await this.dotApi.constants.System.Version();
      const versionEl = document.getElementById('runtime-version');
      if (versionEl) {
        versionEl.textContent = `v${version.specVersion}`;
      }
      
      // Fetch current block height
      await this.fetchBlockHeight();
      
    } catch (error) {
      this.log('⚠️  Could not fetch runtime info', 'error');
    }
  }

  /**
   * Fetch current block height
   */
  private async fetchBlockHeight(): Promise<void> {
    try {
      // Subscribe to best block and get just one value
      const unsubscribe = this.dotApi.query.System.Number.watchValue((blockNumber) => {
        const blockEl = document.getElementById('block-height');
        if (blockEl) {
          blockEl.textContent = this.formatNumber(blockNumber);
        }
        // Unsubscribe after first value
        if (unsubscribe) unsubscribe();
      });
    } catch (error) {
      // Try alternative method
      try {
        const blockNumber = await this.dotApi.query.System.Number();
        const blockEl = document.getElementById('block-height');
        if (blockEl) {
          blockEl.textContent = this.formatNumber(blockNumber);
        }
      } catch (e) {
        // Silent fail - block height is optional
      }
    }
  }

  /**
   * Fetch all constants
   */
  private async fetchAllConstants(): Promise<void> {
    this.log('📡 Fetching all constants from chain...', 'info');
    
    const fetchBtn = document.getElementById('fetch-all-btn');
    if (fetchBtn) {
      fetchBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Fetching...';
      (fetchBtn as HTMLButtonElement).disabled = true;
    }

    // Set all to pending
    this.constants.forEach(constant => {
      constant.status = 'pending';
    });
    this.renderConstants();

    // Fetch each constant
    for (const constant of this.constants) {
      await this.fetchConstant(constant);
    }

    this.fetchCount++;
    this.updateStats();

    if (fetchBtn) {
      fetchBtn.innerHTML = '<i class="fas fa-sync-alt"></i> Fetch All';
      (fetchBtn as HTMLButtonElement).disabled = false;
    }

    this.log(`✅ Fetched ${this.constants.length} constants successfully!`, 'success');
    this.updateComparison();
  }

  /**
   * Fetch a single constant
   */
  private async fetchConstant(constant: ChainConstant): Promise<void> {
    try {
      const parts = constant.method.split('.');
      let method = this.dotApi.constants;
      
      for (const part of parts) {
        method = method[part];
      }
      
      const value = await method();
      
      constant.liveValue = this.formatValue(value);
      constant.lastFetched = new Date().toLocaleTimeString();
      constant.status = 'success';
      
      this.log(`✓ ${constant.pallet}.${constant.constant}: ${constant.liveValue}`, 'success');
      
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Unknown error';
      constant.status = 'error';
      this.log(`✗ ${constant.pallet}.${constant.constant}: ${errorMsg}`, 'error');
    }
    
    this.renderConstants();
  }

  /**
   * Format value for display
   */
  private formatValue(value: any): string {
    if (value === null || value === undefined) {
      return 'null';
    }

    // Handle BigInt
    if (typeof value === 'bigint') {
      return value.toString() + 'n';
    }

    // Handle objects
    if (value && typeof value === 'object') {
      // Special handling for System.Version
      if ('specName' in value || 'spec_name' in value) {
        const specName = value.specName || value.spec_name;
        const specVersion = value.specVersion || value.spec_version;
        return `${specName} v${specVersion}`;
      }
      
      // Try toHuman first
      if ('toHuman' in value && typeof value.toHuman === 'function') {
        const human = value.toHuman();
        return typeof human === 'string' ? human : JSON.stringify(human);
      }
      
      // Try toJSON
      if ('toJSON' in value && typeof value.toJSON === 'function') {
        const json = value.toJSON();
        // For version objects, format nicely
        if (json && typeof json === 'object' && 'spec_name' in json) {
          return `${json.spec_name} v${json.spec_version}`;
        }
        return JSON.stringify(json);
      }
    }

    // Handle primitives
    if (typeof value === 'number' || typeof value === 'string' || typeof value === 'boolean') {
      return String(value);
    }

    // Fallback to JSON with BigInt handling
    try {
      return JSON.stringify(value, (key, val) => 
        typeof val === 'bigint' ? val.toString() + 'n' : val
      );
    } catch {
      return String(value);
    }
  }

  /**
   * Render constants grid
   */
  private renderConstants(): void {
    const grid = document.getElementById('constants-grid');
    if (!grid) return;

    grid.innerHTML = this.constants
      .map(constant => `
        <div class="constant-card ${constant.status || ''}" data-id="${constant.id}">
          <div class="constant-header">
            <span class="constant-name">${constant.constant}</span>
            <span class="constant-pallet">${constant.pallet}</span>
          </div>
          <div class="constant-value">
            ${constant.liveValue || '—'}
          </div>
          <div class="constant-description">
            ${constant.description}
          </div>
          <div class="constant-footer">
            <span class="constant-timestamp">
              ${constant.lastFetched ? `Updated: ${constant.lastFetched}` : 'Not fetched'}
            </span>
            <span class="constant-status status-${constant.status || 'pending'}">
              ${this.getStatusIcon(constant.status)}
            </span>
          </div>
        </div>
      `)
      .join('');
  }

  /**
   * Get status icon
   */
  private getStatusIcon(status?: string): string {
    switch (status) {
      case 'success':
        return '<i class="fas fa-check-circle"></i> Fetched';
      case 'error':
        return '<i class="fas fa-times-circle"></i> Error';
      case 'pending':
        return '<i class="fas fa-spinner fa-spin"></i> Fetching';
      default:
        return '<i class="fas fa-circle"></i> Waiting';
    }
  }

  /**
   * Update comparison section
   */
  private updateComparison(): void {
    const outdatedList = document.getElementById('outdated-values');
    const liveList = document.getElementById('live-values');
    
    if (!outdatedList || !liveList) return;

    const withHardcoded = this.constants.filter(c => c.hardcodedValue);

    outdatedList.innerHTML = withHardcoded
      .map(c => `<li>${c.constant}: ${c.hardcodedValue}</li>`)
      .join('');

    liveList.innerHTML = withHardcoded
      .map(c => `<li>${c.constant}: ${c.liveValue || 'Not fetched'}</li>`)
      .join('');
  }

  /**
   * Update stats bar
   */
  private updateStats(): void {
    const countEl = document.getElementById('constants-count');
    const updatedEl = document.getElementById('last-updated');

    if (countEl) {
      countEl.textContent = this.constants.filter(c => c.status === 'success').length.toString();
    }

    if (updatedEl) {
      updatedEl.textContent = new Date().toLocaleTimeString();
    }
  }

  /**
   * Format number with commas
   */
  private formatNumber(num: any): string {
    const n = Number(num);
    if (isNaN(n)) return String(num);
    return n.toLocaleString();
  }

  /**
   * Start auto-refresh
   */
  private startAutoRefresh(): void {
    this.stopAutoRefresh(); // Clear any existing interval
    
    this.autoRefreshInterval = setInterval(() => {
      this.log('🔄 Auto-refreshing constants...', 'info');
      this.fetchAllConstants();
    }, 30000); // 30 seconds
  }

  /**
   * Stop auto-refresh
   */
  private stopAutoRefresh(): void {
    if (this.autoRefreshInterval) {
      clearInterval(this.autoRefreshInterval);
      this.autoRefreshInterval = null;
    }
  }

  /**
   * Export constants as JSON
   */
  private exportConstants(): void {
    const data = {
      chain: 'Polkadot',
      exported: new Date().toISOString(),
      constants: this.constants.map(c => ({
        pallet: c.pallet,
        constant: c.constant,
        value: c.liveValue,
        description: c.description,
        lastFetched: c.lastFetched
      }))
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `polkadot-constants-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);

    this.log('📥 Constants exported to JSON file', 'success');
  }

  /**
   * Copy code to clipboard
   */
  private copyCode(targetId: string): void {
    const codeEl = document.getElementById(targetId);
    if (!codeEl) return;

    const code = codeEl.textContent || '';
    
    navigator.clipboard.writeText(code)
      .then(() => {
        this.log('✅ Code copied to clipboard!', 'success');
        
        // Visual feedback
        const btn = document.querySelector(`[data-target="${targetId}"]`);
        if (btn) {
          const originalHTML = btn.innerHTML;
          btn.innerHTML = '<i class="fas fa-check"></i>';
          setTimeout(() => {
            btn.innerHTML = originalHTML;
          }, 2000);
        }
      })
      .catch(() => {
        this.log('❌ Failed to copy code', 'error');
      });
  }

  /**
   * Log message to console
   */
  private log(message: string, type: 'info' | 'success' | 'error' = 'info'): void {
    const consoleContent = document.getElementById('console-content');
    if (!consoleContent) return;

    const timestamp = new Date().toLocaleTimeString();
    
    const entry = document.createElement('div');
    entry.className = 'console-entry';
    entry.innerHTML = `
      <span class="console-time">[${timestamp}]</span>
      <span class="console-text ${type}">${message}</span>
    `;
    
    consoleContent.appendChild(entry);
    consoleContent.scrollTop = consoleContent.scrollHeight;

    // Also log to browser console
    console[type === 'error' ? 'error' : 'log'](`[Constants Dashboard] ${message}`);
  }

  /**
   * Clear console
   */
  private clearConsole(): void {
    const consoleContent = document.getElementById('console-content');
    if (!consoleContent) return;

    const timestamp = new Date().toLocaleTimeString();
    consoleContent.innerHTML = `
      <div class="console-entry">
        <span class="console-time">[${timestamp}]</span>
        <span class="console-text info">Console cleared ✨</span>
      </div>
    `;
    
    this.log('Ready for new operations!', 'info');
  }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  console.log('╔═══════════════════════════════════════════╗');
  console.log('║  PAPI Day 5: Chain Constants Dashboard   ║');
  console.log('║  Fetch Live, Never Hardcode!             ║');
  console.log('╚═══════════════════════════════════════════╝');
  console.log('');
  console.log('🎯 What you\'ll learn:');
  console.log('   1. Why hardcoded values are technical debt');
  console.log('   2. How to fetch live constants from chain');
  console.log('   3. Auto-refresh and real-time updates');
  console.log('   4. Comparing hardcoded vs live values');
  console.log('');
  console.log('💡 Key Takeaway: The chain IS your configuration!');
  console.log('');
  
  new ConstantsDashboard();
});