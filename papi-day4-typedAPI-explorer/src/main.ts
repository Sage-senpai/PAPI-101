/**
 * PAPI Day 4: TypedApi Explorer
 * 
 * This application demonstrates the power of TypedApi by:
 * 1. Connecting to Polkadot via WebSocket
 * 2. Creating a fully typed API instance
 * 3. Fetching chain constants with type safety
 * 4. Displaying results in an interactive UI
 * 
 * Key Learning: TypedApi provides compile-time type safety for all blockchain interactions!
 */

import { createClient } from 'polkadot-api';
import { getWsProvider } from 'polkadot-api/ws-provider/web';
import { dot } from '@polkadot-api/descriptors';

// Interface for chain constants we'll explore
interface ChainConstant {
  pallet: string;
  constant: string;
  description: string;
  method: string;
}

/**
 * Main application class for TypedApi Explorer
 */
class TypedApiExplorer {
  private client: any = null;
  private dotApi: any = null;

  /**
   * Chain constants available for exploration
   * These are updated for the latest Polkadot runtime
   */
  private constants: ChainConstant[] = [
    {
      pallet: 'System',
      constant: 'Version',
      description: 'Get runtime version information including spec name, version, and implementation details',
      method: 'System.Version'
    },
    {
      pallet: 'Timestamp',
      constant: 'MinimumPeriod',
      description: 'Minimum time between blocks in milliseconds (Polkadot: 3000ms = 6s blocks)',
      method: 'Timestamp.MinimumPeriod'
    },
    {
      pallet: 'Balances',
      constant: 'ExistentialDeposit',
      description: 'Minimum balance required for an account to exist (1 DOT = 10^10 Planck)',
      method: 'Balances.ExistentialDeposit'
    },
    {
      pallet: 'TransactionPayment',
      constant: 'OperationalFeeMultiplier',
      description: 'Fee multiplier for operational transactions',
      method: 'TransactionPayment.OperationalFeeMultiplier'
    },
    {
      pallet: 'Staking',
      constant: 'BondingDuration',
      description: 'Number of eras that bonded funds remain locked after unbonding (28 eras = 28 days)',
      method: 'Staking.BondingDuration'
    },
    {
      pallet: 'Staking',
      constant: 'SessionsPerEra',
      description: 'Number of sessions per era (1 era = 6 sessions = 1 day on Polkadot)',
      method: 'Staking.SessionsPerEra'
    }
  ];

  constructor() {
    this.log('🎯 TypedApi Explorer initialized', 'info');
    this.log('📚 This demo shows how TypedApi provides type safety for blockchain interactions', 'info');
    this.initializeUI();
  }

  /**
   * Initialize all UI event listeners and render initial state
   */
  private initializeUI(): void {
    // Connection button
    const connectBtn = document.getElementById('connect-btn');
    connectBtn?.addEventListener('click', () => this.connectToPolkadot());

    // Console clear button
    const clearBtn = document.getElementById('clear-console');
    clearBtn?.addEventListener('click', () => this.clearConsole());

    // Code copy button
    const copyBtn = document.querySelector('.copy-btn');
    copyBtn?.addEventListener('click', () => this.copyCode());

    // Render constants grid
    this.renderConstantsGrid();

    this.log('✨ UI ready! Click "Initialize TypedApi" to begin', 'info');
  }

  /**
   * Render the grid of clickable constants
   */
  private renderConstantsGrid(): void {
    const grid = document.getElementById('constants-grid');
    if (!grid) return;

    grid.innerHTML = this.constants
      .map(constant => `
        <div class="constant-card" data-method="${constant.method}">
          <div class="constant-header">
            <span class="constant-name">${constant.constant}</span>
            <span class="constant-pallet">${constant.pallet}</span>
          </div>
          <p class="constant-description">${constant.description}</p>
        </div>
      `)
      .join('');

    // Add click handlers
    grid.querySelectorAll('.constant-card').forEach(card => {
      const method = card.getAttribute('data-method');
      const constant = this.constants.find(c => c.method === method);
      if (constant) {
        card.addEventListener('click', () => this.selectConstant(constant));
      }
    });
  }

  /**
   * Connect to Polkadot and create TypedApi instance
   * This is where the magic happens!
   */
  private async connectToPolkadot(): Promise<void> {
    const connectBtn = document.getElementById('connect-btn') as HTMLButtonElement;
    const statusElement = document.getElementById('connection-status');
    
    if (!connectBtn || !statusElement) return;
    
    connectBtn.disabled = true;
    connectBtn.textContent = 'Connecting...';
    statusElement.textContent = 'Connecting';
    statusElement.className = 'status-indicator';
    
    this.log('🔌 Initiating WebSocket connection to Polkadot...', 'info');
    
    try {
      // Step 1: Create WebSocket provider
      this.log('📡 Step 1: Creating WebSocket provider for wss://rpc.polkadot.io', 'info');
      const provider = getWsProvider('wss://rpc.polkadot.io');
      
      // Step 2: Create PAPI client
      this.log('🔧 Step 2: Creating PAPI client...', 'info');
      this.client = createClient(provider);
      
      this.log('✅ Client created successfully!', 'success');
      
      // Step 3: Get TypedApi instance - THIS IS THE KEY!
      this.log('🎯 Step 3: Creating TypedApi instance with generated descriptors...', 'info');
      this.dotApi = this.client.getTypedApi(dot);
      
      this.log('✨ TypedApi instance created! You now have full type safety!', 'success');
      this.log('💡 All methods are typed, autocomplete works, and TypeScript will catch errors at compile time', 'info');
      
      // Update UI
      connectBtn.textContent = '✓ Connected';
      connectBtn.classList.add('connected');
      statusElement.textContent = 'Connected';
      statusElement.classList.add('connected');
      
      // Enable constant exploration
      this.enableConstantExploration();
      
      // Log the success message
      console.log("TypedApi ready for Polkadot!");
      this.log('📝 Console: TypedApi ready for Polkadot!', 'success');
      
      // Automatically fetch System.Version to show it in action
      setTimeout(() => this.fetchSystemVersion(), 500);
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      this.log(`❌ Connection failed: ${errorMessage}`, 'error');
      this.log('💡 Tip: Check your internet connection and try again', 'info');
      
      connectBtn.disabled = false;
      connectBtn.textContent = 'Retry Connection';
      statusElement.textContent = 'Disconnected';
      statusElement.className = 'status-indicator';
    }
  }

  /**
   * Fetch System.Version to demonstrate TypedApi in action
   */
  private async fetchSystemVersion(): Promise<void> {
    if (!this.dotApi) return;
    
    try {
      this.log('🔍 Auto-fetching System.Version to demonstrate TypedApi...', 'info');
      
      // This call is fully typed! TypeScript knows the exact return type
      const version = await this.dotApi.constants.System.Version();
      
      this.log(`✅ Successfully fetched runtime version!`, 'success');
      this.log(`   📦 Spec Name: ${version.specName}`, 'info');
      this.log(`   🔢 Spec Version: ${version.specVersion}`, 'info');
      this.log(`   🏗️  Impl Name: ${version.implName}`, 'info');
      this.log(`   📝 Impl Version: ${version.implVersion}`, 'info');
      
      this.displayResult('System.Version', 'System.Version()', version);
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      this.log(`❌ Failed to fetch System.Version: ${errorMessage}`, 'error');
    }
  }

  /**
   * Handle constant selection and fetch its value
   */
  private selectConstant(constant: ChainConstant): void {
    if (!this.dotApi) {
      this.log('⚠️  Please connect to Polkadot first!', 'error');
      return;
    }
    
    // Update UI to show selection
    document.querySelectorAll('.constant-card').forEach(card => {
      card.classList.remove('selected');
    });
    
    const selectedCard = document.querySelector(`[data-method="${constant.method}"]`);
    selectedCard?.classList.add('selected');
    
    this.log(`🎯 Selected: ${constant.pallet}.${constant.constant}`, 'info');
    this.log(`📄 ${constant.description}`, 'info');
    
    // Fetch the constant value
    this.fetchConstantValue(constant);
  }

  /**
   * Fetch a constant's value using TypedApi
   */
  private async fetchConstantValue(constant: ChainConstant): Promise<void> {
    if (!this.dotApi) return;
    
    try {
      this.log(`📡 Fetching ${constant.method}...`, 'info');
      
      // Navigate the typed API path
      const parts = constant.method.split('.');
      let method = this.dotApi.constants;
      
      for (const part of parts) {
        method = method[part];
      }
      
      // Fetch the value - this is fully typed!
      const value = await method();
      
      this.log(`✅ Successfully fetched ${constant.constant}!`, 'success');
      
      // Format and display
      this.displayResult(
        `${constant.pallet}.${constant.constant}`,
        `dotApi.constants.${constant.method}()`,
        value
      );
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      this.log(`❌ Failed to fetch ${constant.constant}: ${errorMessage}`, 'error');
      
      // Check if constant doesn't exist
      if (errorMessage.includes('not found')) {
        this.log(`💡 This constant may not exist in the current Polkadot runtime`, 'info');
      }
    }
  }

  /**
   * Display fetched constant in the results section
   */
  private displayResult(name: string, method: string, value: any): void {
    const resultName = document.getElementById('result-name');
    const resultType = document.getElementById('result-type');
    const resultJson = document.getElementById('result-json');
    
    if (!resultName || !resultType || !resultJson) return;
    
    resultName.textContent = `${name} → ${method}`;
    resultType.textContent = this.getTypeName(value);
    
    // Format the value for display
    let formattedValue: any = value;
    
    if (value && typeof value === 'object') {
      if ('toJSON' in value && typeof value.toJSON === 'function') {
        formattedValue = value.toJSON();
      } else if ('toHuman' in value && typeof value.toHuman === 'function') {
        formattedValue = value.toHuman();
      }
    }
    
    // Handle BigInt serialization
    try {
      resultJson.textContent = JSON.stringify(formattedValue, (key, value) => {
        if (typeof value === 'bigint') {
          return value.toString() + 'n'; // Convert BigInt to string with 'n' suffix
        }
        return value;
      }, 2);
    } catch (error) {
      // Fallback: convert to string
      resultJson.textContent = String(formattedValue);
    }
  }

  /**
   * Get a human-readable type name
   */
  private getTypeName(value: any): string {
    if (value === null) return 'null';
    if (value === undefined) return 'undefined';
    
    if (typeof value === 'bigint') return 'bigint';
    if (typeof value === 'object') {
      if (value.constructor?.name) {
        return value.constructor.name;
      }
      if (Array.isArray(value)) return 'Array';
      return 'Object';
    }
    
    return typeof value;
  }

  /**
   * Enable interaction with constant cards
   */
  private enableConstantExploration(): void {
    document.querySelectorAll('.constant-card').forEach(card => {
      card.classList.add('enabled');
    });
    
    this.log('🎯 Constants enabled! Click any constant to fetch its value', 'success');
    this.log('💡 Try clicking different constants to see TypedApi in action!', 'info');
  }

  /**
   * Log message to the developer console
   */
  private log(message: string, type: 'info' | 'success' | 'error' = 'info'): void {
    const consoleContent = document.getElementById('console-content');
    if (!consoleContent) return;
    
    const timestamp = new Date().toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit' 
    });
    
    const entry = document.createElement('div');
    entry.className = 'console-entry';
    
    entry.innerHTML = `
      <span class="console-time">[${timestamp}]</span>
      <span class="console-text ${type}">${message}</span>
    `;
    
    consoleContent.appendChild(entry);
    consoleContent.scrollTop = consoleContent.scrollHeight;
    
    // Also log to browser console
    const consoleMethod = type === 'error' ? 'error' : 'log';
    console[consoleMethod](`[TypedApi Explorer] ${message}`);
  }

  /**
   * Clear the developer console
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

  /**
   * Copy code snippet to clipboard
   */
  private copyCode(): void {
    const codeElement = document.getElementById('typedapi-code');
    if (!codeElement) return;
    
    const code = codeElement.textContent || '';
    
    navigator.clipboard.writeText(code)
      .then(() => {
        this.log('✅ Code copied to clipboard!', 'success');
        
        const copyBtn = document.querySelector('.copy-btn');
        if (copyBtn) {
          const originalText = copyBtn.textContent;
          copyBtn.textContent = '✓ Copied!';
          setTimeout(() => {
            copyBtn.textContent = originalText;
          }, 2000);
        }
      })
      .catch(err => {
        this.log(`❌ Failed to copy: ${err}`, 'error');
      });
  }
}

// Initialize the application when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  console.log('╔══════════════════════════════════════════╗');
  console.log('║   PAPI Day 4: TypedApi Explorer         ║');
  console.log('║   Experience Typed Blockchain Magic!    ║');
  console.log('╚══════════════════════════════════════════╝');
  console.log('');
  console.log('🎯 What you\'ll learn:');
  console.log('   1. How to create a TypedApi instance');
  console.log('   2. Benefits of compile-time type safety');
  console.log('   3. Exploring chain constants with types');
  console.log('   4. Real-world TypedApi usage patterns');
  console.log('');
  console.log('💡 Tip: Open your IDE to see autocomplete in action!');
  console.log('');
  
  new TypedApiExplorer();
});