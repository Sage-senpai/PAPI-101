import { createClient } from 'polkadot-api';
import { getWsProvider } from 'polkadot-api/ws-provider';
import { dot } from '@polkadot-api/descriptors';

// Interface for constants
interface ChainConstant {
  pallet: string;
  constant: string;
  description: string;
  method: string;
}

class TypedApiExplorer {
  private client: any = null;
  private dotApi: any = null;
  private selectedConstant: ChainConstant | null = null;

  // Updated valid constants based on latest Polkadot runtime
  private constants: ChainConstant[] = [
    {
      pallet: 'System',
      constant: 'Version',
      description: 'Runtime version details',
      method: 'System.Version'
    },
    {
      pallet: 'Timestamp',
      constant: 'MinimumPeriod',
      description: 'Min time between blocks',
      method: 'Timestamp.MinimumPeriod'
    },
    {
      pallet: 'Balances',
      constant: 'ExistentialDeposit',
      description: 'Min balance for account survival',
      method: 'Balances.ExistentialDeposit'
    },
    {
      pallet: 'TransactionPayment',
      constant: 'OperationalFeeMultiplier',
      description: 'Fee multiplier for ops',
      method: 'TransactionPayment.OperationalFeeMultiplier'
    },
    {
      pallet: 'Staking',
      constant: 'BondingDuration',
      description: 'Eras for bonded funds lock',
      method: 'Staking.BondingDuration'
    },
    {
      pallet: 'ElectionProviderMultiPhase',
      constant: 'SignedDeposit',
      description: 'Deposit for candidacy submission',
      method: 'ElectionProviderMultiPhase.SignedDeposit'
    }
  ];

  constructor() {
    this.initializeUI();
    this.log('🚀 Explorer ready', 'info');
    this.log('Initialize to begin', 'info');
  }

  private initializeUI(): void {
    // Setup connection button
    const connectBtn = document.getElementById('connect-btn');
    if (connectBtn) {
      connectBtn.addEventListener('click', () => this.connectToPolkadot());
    }

    // Setup clear console button
    const clearBtn = document.getElementById('clear-console');
    if (clearBtn) {
      clearBtn.addEventListener('click', () => this.clearConsole());
    }

    // Setup copy code button
    const copyBtn = document.querySelector('.copy-btn');
    if (copyBtn) {
      copyBtn.addEventListener('click', () => this.copyCode());
    }

    // Render constants grid
    this.renderConstantsGrid();
  }

  private renderConstantsGrid(): void {
    const grid = document.getElementById('constants-grid');
    if (!grid) return;

    grid.innerHTML = '';
    
    this.constants.forEach(constant => {
      const card = document.createElement('div');
      card.className = 'constant-card';
      card.dataset.method = constant.method;
      
      card.innerHTML = `
        <div class="constant-header">
          <span class="constant-name">${constant.constant}</span>
          <span class="constant-pallet">${constant.pallet}</span>
        </div>
        <p class="constant-description">${constant.description}</p>
      `;
      
      card.addEventListener('click', () => this.selectConstant(constant));
      grid.appendChild(card);
    });
  }

  private async connectToPolkadot(): Promise<void> {
    const connectBtn = document.getElementById('connect-btn') as HTMLButtonElement;
    const statusElement = document.getElementById('connection-status');
    
    if (!connectBtn || !statusElement) return;
    
    connectBtn.disabled = true;
    connectBtn.textContent = 'Connecting...';
    statusElement.textContent = 'Connecting';
    statusElement.className = 'status-indicator';
    
    this.log('🔌 Connecting to Polkadot via WSS...', 'info');
    
    try {
      // Create client with WSS provider
      this.client = createClient(
        getWsProvider('wss://rpc.polkadot.io')
      );
      
      this.log('✅ WebSocket connection established', 'success');
      
      // Get TypedApi instance
      this.dotApi = this.client.getTypedApi(dot);
      
      this.log('🎯 TypedApi instance created successfully!', 'success');
      this.log('✨ You now have full type safety for all Polkadot interactions', 'info');
      
      // Update UI
      connectBtn.textContent = 'Connected!';
      statusElement.textContent = 'Connected';
      statusElement.classList.add('connected');
      
      // Enable constant exploration
      this.enableConstantExploration();
      
      // Log the success message from the requirement
      console.log("TypedApi ready for Polkadot!");
      this.log('Console: TypedApi ready for Polkadot!', 'success');
      
      // Fetch and display system version
      await this.fetchSystemVersion();
      
    } catch (error) {
      this.log(`❌ Connection failed: ${error instanceof Error ? error.message : 'Unknown error'}`, 'error');
      connectBtn.disabled = false;
      connectBtn.textContent = 'Initialize TypedApi';
      statusElement.textContent = 'Disconnected';
      statusElement.className = 'status-indicator';
    }
  }

  private async fetchSystemVersion(): Promise<void> {
    if (!this.dotApi) return;
    
    try {
      this.log('📡 Fetching System.Version constant...', 'info');
      
      const version = await this.dotApi.constants.System.Version();
      
      this.log(`✅ Chain: ${version.specName} v${version.specVersion}`, 'success');
      this.log(`   • Spec Name: ${version.specName}`, 'info');
      this.log(`   • Spec Version: ${version.specVersion}`, 'info');
      this.log(`   • Impl Name: ${version.implName}`, 'info');
      this.log(`   • Impl Version: ${version.implVersion}`, 'info');
      
      // Display in result section
      this.displayResult('System.Version', 'System.Version()', version);
      
    } catch (error) {
      this.log(`❌ Failed to fetch System.Version: ${error instanceof Error ? error.message : 'Unknown error'}`, 'error');
    }
  }

  private selectConstant(constant: ChainConstant): void {
    if (!this.dotApi) {
      this.log('Please connect to Polkadot first', 'error');
      return;
    }
    
    this.selectedConstant = constant;
    
    // Update UI
    document.querySelectorAll('.constant-card').forEach(card => {
      card.classList.remove('selected');
    });
    
    const selectedCard = document.querySelector(`[data-method="${constant.method}"]`);
    if (selectedCard) {
      selectedCard.classList.add('selected');
    }
    
    this.log(`🔍 Selected constant: ${constant.pallet}.${constant.constant}`, 'info');
    this.log(`Description: ${constant.description}`, 'info');
    
    // Fetch the constant value
    this.fetchConstantValue(constant);
  }

  private async fetchConstantValue(constant: ChainConstant): Promise<void> {
    if (!this.dotApi) return;
    
    try {
      this.log(`📡 Fetching ${constant.pallet}.${constant.constant}...`, 'info');
      
      // Use eval to call the method dynamically (safe in this context)
      const methodPath = constant.method.split('.');
      let method = this.dotApi.constants;
      
      for (const part of methodPath) {
        method = method[part];
      }
      
      const value = await method();
      
      this.log(`✅ ${constant.pallet}.${constant.constant} fetched successfully`, 'success');
      
      // Display the result
      this.displayResult(
        `${constant.pallet}.${constant.constant}`,
        `${constant.method}()`,
        value
      );
      
    } catch (error) {
      this.log(`❌ Failed to fetch constant: ${error instanceof Error ? error.message : 'Unknown error'}`, 'error');
    }
  }

  private displayResult(name: string, method: string, value: any): void {
    const resultName = document.getElementById('result-name');
    const resultType = document.getElementById('result-type');
    const resultJson = document.getElementById('result-json');
    
    if (!resultName || !resultType || !resultJson) return;
    
    resultName.textContent = name;
    resultType.textContent = this.getTypeName(value);
    
    // Format the value nicely
    let formattedValue: any = value;
    
    if (value && typeof value === 'object') {
      if ('toJSON' in value && typeof value.toJSON === 'function') {
        formattedValue = value.toJSON();
      } else if ('toHuman' in value && typeof value.toHuman === 'function') {
        formattedValue = value.toHuman();
      }
    }
    
    resultJson.textContent = JSON.stringify(formattedValue, null, 2);
  }

  private getTypeName(value: any): string {
    if (value === null) return 'null';
    if (value === undefined) return 'undefined';
    if (typeof value === 'object') {
      if (value.constructor && value.constructor.name) {
        return value.constructor.name;
      }
      return 'Object';
    }
    return typeof value;
  }

  private enableConstantExploration(): void {
    document.querySelectorAll('.constant-card').forEach(card => {
      card.classList.add('enabled');
    });
    
    this.log('🎯 Constants are now clickable! Try clicking any constant to fetch its value', 'info');
  }

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
    
    const timeSpan = document.createElement('span');
    timeSpan.className = 'console-time';
    timeSpan.textContent = `[${timestamp}]`;
    
    const textSpan = document.createElement('span');
    textSpan.className = `console-text ${type}`;
    textSpan.textContent = message;
    
    entry.appendChild(timeSpan);
    entry.appendChild(textSpan);
    consoleContent.appendChild(entry);
    
    // Auto-scroll to bottom
    consoleContent.scrollTop = consoleContent.scrollHeight;
    
    // Also log to browser console
    const consoleMethod = type === 'error' ? 'error' : type === 'success' ? 'log' : 'info';
    console[consoleMethod](`[TypedApi Explorer] ${message}`);
  }

  private clearConsole(): void {
    const consoleContent = document.getElementById('console-content');
    if (consoleContent) {
      consoleContent.innerHTML = `
        <div class="console-entry">
          <span class="console-time">[${new Date().toLocaleTimeString()}]</span>
          <span class="console-text info">Console cleared</span>
        </div>
      `;
    }
  }

  private copyCode(): void {
    const codeElement = document.getElementById('typedapi-code');
    if (!codeElement) return;
    
    const code = codeElement.textContent || '';
    navigator.clipboard.writeText(code)
      .then(() => {
        this.log('✅ Code copied to clipboard!', 'success');
        
        // Show temporary feedback
        const copyBtn = document.querySelector('.copy-btn');
        if (copyBtn) {
          const originalText = copyBtn.textContent;
          copyBtn.textContent = 'Copied!';
          setTimeout(() => {
            if (copyBtn.textContent === 'Copied!') {
              copyBtn.textContent = originalText;
            }
          }, 2000);
        }
      })
      .catch(err => {
        this.log(`❌ Failed to copy: ${err}`, 'error');
      });
  }
}
document.addEventListener('DOMContentLoaded', () => {
  console.log('=== PAPI Day 4: TypedApi Explorer ===');
  console.log('Initializing...');
  console.log('Experience typed interactions!');
  console.log('===');
  
  new TypedApiExplorer();
});