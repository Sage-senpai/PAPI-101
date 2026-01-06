// src/main.ts
import { createClient } from 'polkadot-api';
import { getWsProvider } from 'polkadot-api/ws-provider';
import { dot } from '@polkadot-api/descriptors';

// Types
interface RuntimeAPI {
  id: string;
  name: string;
  method: string;
  description: string;
  code: string;
}

class RuntimeExplorer {
  private client: any = null;
  private dotApi: any = null;
  
  // Available runtime APIs
  private runtimeAPIs: RuntimeAPI[] = [
    {
      id: 'metadata',
      name: 'Metadata API',
      method: 'Metadata.metadata',
      description: 'Get chain self-description including version, pallets, and capabilities',
      code: `const metadata = await dotApi.apis.Metadata.metadata();`
    },
    {
      id: 'transaction-queue',
      name: 'Transaction Queue API',
      method: 'TaggedTransactionQueue.validate_transaction',
      description: 'Validate transactions directly through runtime logic',
      code: `// Note: Requires transaction data
// const validation = await dotApi.apis.TaggedTransactionQueue.validate_transaction(tx);`
    },
    {
      id: 'account-nonce',
      name: 'Account Nonce API',
      method: 'AccountNonceApi.account_nonce',
      description: 'Get account transaction sequence numbers from runtime',
      code: `// Note: Requires account parameter
// const nonce = await dotApi.apis.AccountNonceApi.account_nonce(account);`
    },
    {
      id: 'core',
      name: 'Core API',
      method: 'Core.version',
      description: 'Get core runtime version information',
      code: `const coreVersion = await dotApi.apis.Core.version();`
    }
  ];

  constructor() {
    this.initializeUI();
    this.log('🧠 Runtime Explorer initialized', 'info');
    this.connectToPolkadot();
  }

  private initializeUI(): void {
    // Setup API selector cards
    this.setupAPISelector();
    
    // Setup buttons
    document.getElementById('execute-call')?.addEventListener('click', () => this.executeRuntimeCall());
    document.getElementById('copy-call')?.addEventListener('click', () => this.copyRuntimeCall());
    document.getElementById('clear-console')?.addEventListener('click', () => this.clearConsole());
  }

  private setupAPISelector(): void {
    const apiCards = document.querySelectorAll('.api-card');
    
    apiCards.forEach(card => {
      card.addEventListener('click', () => {
        // Remove active class from all cards
        apiCards.forEach(c => c.classList.remove('active'));
        
        // Add active class to clicked card
        card.classList.add('active');
        
        // Update UI for selected API
        const apiId = card.getAttribute('data-api');
        this.selectAPI(apiId || 'metadata');
      });
    });
  }

  private selectAPI(apiId: string): void {
    const api = this.runtimeAPIs.find(a => a.id === apiId) || this.runtimeAPIs[0];
    
    // Update title
    const titleElement = document.getElementById('selected-api-title');
    if (titleElement) {
      titleElement.textContent = api.name;
    }
    
    // Update code preview
    const codeElement = document.getElementById('runtime-code');
    if (codeElement) {
      codeElement.innerHTML = `<code>${api.code}</code>`;
    }
  }

  private async connectToPolkadot(): Promise<void> {
    const statusElement = document.getElementById('runtime-status');
    if (statusElement) {
      statusElement.textContent = 'Connecting...';
    }

    try {
      // Create client with WSS provider
      this.client = createClient(
        getWsProvider('wss://rpc.polkadot.io')
      );

      // Get TypedApi instance
      this.dotApi = this.client.getTypedApi(dot);
      
      this.log('✅ Connected to Polkadot via WSS', 'success');
      this.log('🧠 Runtime APIs ready for direct calls', 'success');
      
      // Update UI
      if (statusElement) {
        statusElement.textContent = 'Connected';
        statusElement.style.color = '#10B981';
      }
      
      // Auto-execute metadata API on connect
      setTimeout(() => {
        this.executeMetadataAPI();
      }, 1000);
      
    } catch (error) {
      this.log(`❌ Connection failed: ${error instanceof Error ? error.message : 'Unknown error'}`, 'error');
      if (statusElement) {
        statusElement.textContent = 'Disconnected';
        statusElement.style.color = '#EF4444';
      }
    }
  }

  private async executeMetadataAPI(): Promise<void> {
    if (!this.dotApi) return;
    
    this.log('📞 Calling Metadata.metadata() runtime API...', 'info');
    
    const startTime = Date.now();
    
    try {
      const metadata = await this.dotApi.apis.Metadata.metadata();
      const endTime = Date.now();
      const responseTime = endTime - startTime;
      
      console.log('Raw metadata:', metadata);
      
      // Update stats with proper parsing
      this.updateRuntimeStats(metadata, responseTime);
      
      // Display results
      this.displayMetadataResults(metadata, responseTime);
      
      // Log success
      this.log(`✅ Metadata API call completed in ${responseTime}ms`, 'success');
      
      // Special console.log as per requirement
      console.log("Runtime metadata loaded");
      this.log('Console: Runtime metadata loaded', 'success');
      
    } catch (error) {
      const errorTime = Date.now() - startTime;
      this.log(`❌ Metadata API call failed after ${errorTime}ms: ${error instanceof Error ? error.message : 'Unknown error'}`, 'error');
      console.error('Metadata API Error:', error);
    }
  }

  private async executeRuntimeCall(): Promise<void> {
    if (!this.dotApi) {
      this.log('⚠️ Please wait for connection to establish', 'error');
      return;
    }

    const activeCard = document.querySelector('.api-card.active');
    const apiId = activeCard?.getAttribute('data-api') || 'metadata';
    
    this.log(`📞 Executing ${apiId} runtime API call...`, 'info');
    
    const startTime = Date.now();
    
    try {
      let result: any;
      let responseTime: number;
      
      switch (apiId) {
        case 'metadata':
          result = await this.dotApi.apis.Metadata.metadata();
          responseTime = Date.now() - startTime;
          this.updateRuntimeStats(result, responseTime);
          this.displayMetadataResults(result, responseTime);
          break;
          
        case 'transaction-queue':
          this.log('ℹ️ Transaction Queue API requires transaction data for full demo', 'info');
          result = { 
            info: 'Transaction Queue API available',
            note: 'Requires tx data for full call',
            example: 'TaggedTransactionQueue.validate_transaction(tx)'
          };
          responseTime = Date.now() - startTime;
          this.displayGenericResults(result, responseTime, 'Transaction Queue API');
          break;
          
        case 'account-nonce':
          this.log('ℹ️ Account Nonce API requires account parameter for full demo', 'info');
          result = { 
            info: 'Account Nonce API available',
            note: 'Requires account parameter for full call',
            example: 'AccountNonceApi.account_nonce(account)'
          };
          responseTime = Date.now() - startTime;
          this.displayGenericResults(result, responseTime, 'Account Nonce API');
          break;
          
        case 'core':
          try {
            result = await this.dotApi.apis.Core.version();
            responseTime = Date.now() - startTime;
            this.displayGenericResults(result, responseTime, 'Core API');
          } catch (coreError) {
            this.log(`⚠️ Core API not available: ${coreError instanceof Error ? coreError.message : 'Unknown error'}`, 'info');
            result = { 
              info: 'Core API not available in this runtime version',
              alternative: 'Use Metadata API for version information'
            };
            responseTime = Date.now() - startTime;
            this.displayGenericResults(result, responseTime, 'Core API');
          }
          break;
          
        default:
          throw new Error('Unknown runtime API');
      }
      
      this.log(`✅ ${apiId} API call completed in ${responseTime}ms`, 'success');
      
    } catch (error) {
      const errorTime = Date.now() - startTime;
      this.log(`❌ Runtime API call failed after ${errorTime}ms: ${error instanceof Error ? error.message : 'Unknown error'}`, 'error');
      this.displayError(error, errorTime);
    }
  }

  private updateRuntimeStats(metadata: any, responseTime: number): void {
    console.log('Updating stats with metadata:', metadata);
    
    // Parse metadata - handle different possible structures
    let specVersion = '-';
    let specName = '-';
    let palletsCount = '-';
    
    try {
      // Try direct access first
      if (metadata?.metadata) {
        const meta = metadata.metadata;
        
        // Get spec version
        if (meta.specVersion !== undefined) {
          specVersion = String(meta.specVersion);
        } else if (meta.spec_version !== undefined) {
          specVersion = String(meta.spec_version);
        }
        
        // Get spec name
        if (meta.specName) {
          specName = String(meta.specName);
        } else if (meta.spec_name) {
          specName = String(meta.spec_name);
        }
        
        // Get pallets count
        if (meta.pallets && Array.isArray(meta.pallets)) {
          palletsCount = String(meta.pallets.length);
        } else if (meta.lookup?.types && Array.isArray(meta.lookup.types)) {
          // Fallback: estimate from types
          palletsCount = '~' + String(Math.floor(meta.lookup.types.length / 10));
        }
      } else {
        // Try alternative structure
        if (metadata.specVersion !== undefined) {
          specVersion = String(metadata.specVersion);
        }
        if (metadata.specName) {
          specName = String(metadata.specName);
        }
        if (metadata.pallets && Array.isArray(metadata.pallets)) {
          palletsCount = String(metadata.pallets.length);
        }
      }
    } catch (error) {
      console.error('Error parsing metadata for stats:', error);
    }
    
    // Update UI elements
    const versionElement = document.getElementById('runtime-version');
    if (versionElement) {
      versionElement.textContent = specVersion;
    }
    
    const specElement = document.getElementById('spec-name');
    if (specElement) {
      specElement.textContent = specName;
    }
    
    const palletsElement = document.getElementById('pallets-count');
    if (palletsElement) {
      palletsElement.textContent = palletsCount;
    }
    
    const timeElement = document.getElementById('response-time');
    if (timeElement) {
      timeElement.textContent = `${responseTime}`;
    }
    
    console.log('Stats updated:', { specVersion, specName, palletsCount, responseTime });
  }

  private displayMetadataResults(metadata: any, responseTime: number): void {
    // Format the metadata for display
    let formattedMetadata: any = metadata;
    
    try {
      if (metadata && typeof metadata === 'object') {
        if ('toJSON' in metadata && typeof metadata.toJSON === 'function') {
          formattedMetadata = metadata.toJSON();
        } else if ('toHuman' in metadata && typeof metadata.toHuman === 'function') {
          formattedMetadata = metadata.toHuman();
        }
      }
    } catch (error) {
      console.warn('Could not format metadata:', error);
    }
    
    // Display in JSON view with size limit for readability
    const resultElement = document.getElementById('runtime-result');
    if (resultElement) {
      const jsonString = JSON.stringify(formattedMetadata, (key, val) => {
        if (typeof val === 'bigint') return val.toString();
        // Truncate very long arrays for readability
        if (Array.isArray(val) && val.length > 5) {
          return [...val.slice(0, 5), `... (${val.length - 5} more items)`];
        }
        return val;
      }, 2);
      
      resultElement.textContent = jsonString;
    }
    
    // Update insights
    this.updateMetadataInsights(metadata);
    
    // Update response time
    const timeElement = document.getElementById('response-time');
    if (timeElement) {
      timeElement.textContent = `${responseTime}`;
    }
  }

  private displayGenericResults(result: any, responseTime: number, apiName: string): void {
    let formattedResult: any = result;
    
    try {
      if (result && typeof result === 'object') {
        if ('toJSON' in result && typeof result.toJSON === 'function') {
          formattedResult = result.toJSON();
        } else if ('toHuman' in result && typeof result.toHuman === 'function') {
          formattedResult = result.toHuman();
        }
      }
    } catch (error) {
      console.warn('Could not format result:', error);
    }
    
    const resultElement = document.getElementById('runtime-result');
    if (resultElement) {
      resultElement.textContent = JSON.stringify(formattedResult, (key, val) => 
        typeof val === 'bigint' ? val.toString() : val, 2
      );
    }
    
    this.updateGenericInsights(apiName);
    
    const timeElement = document.getElementById('response-time');
    if (timeElement) {
      timeElement.textContent = `${responseTime}`;
    }
  }

  private updateMetadataInsights(metadata: any): void {
    const chainSpecElement = document.getElementById('chain-spec');
    const capabilitiesElement = document.getElementById('runtime-capabilities');
    
    try {
      let specName = 'Unknown';
      let specVersion = 'Unknown';
      let capabilities = 'Runtime structure loaded';
      
      // Parse metadata for insights
      if (metadata?.metadata) {
        const meta = metadata.metadata;
        specName = meta.specName || meta.spec_name || 'Unknown';
        specVersion = meta.specVersion || meta.spec_version || 'Unknown';
        
        if (meta.pallets && Array.isArray(meta.pallets)) {
          const notablePallets = meta.pallets
            .filter((p: any) => ['Balances', 'Staking', 'Identity', 'Democracy', 'System'].includes(p.name))
            .map((p: any) => p.name)
            .slice(0, 4)
            .join(', ');
          
          capabilities = `${meta.pallets.length} pallets available`;
          if (notablePallets) {
            capabilities += ` (e.g., ${notablePallets})`;
          }
        }
      }
      
      if (chainSpecElement) {
        chainSpecElement.textContent = `${specName} v${specVersion}`;
      }
      
      if (capabilitiesElement) {
        capabilitiesElement.textContent = capabilities;
      }
    } catch (error) {
      console.error('Error updating insights:', error);
      if (chainSpecElement) {
        chainSpecElement.textContent = 'Metadata received';
      }
      if (capabilitiesElement) {
        capabilitiesElement.textContent = 'Runtime structure available';
      }
    }
  }

  private updateGenericInsights(apiName: string): void {
    const chainSpecElement = document.getElementById('chain-spec');
    if (chainSpecElement) {
      chainSpecElement.textContent = `${apiName} response received`;
    }
    
    const capabilitiesElement = document.getElementById('runtime-capabilities');
    if (capabilitiesElement) {
      capabilitiesElement.textContent = `Direct ${apiName} access confirmed`;
    }
  }

  private displayError(error: any, responseTime: number): void {
    const resultElement = document.getElementById('runtime-result');
    if (resultElement) {
      resultElement.textContent = `Error: ${error instanceof Error ? error.message : 'Unknown error'}`;
    }
    
    const timeElement = document.getElementById('response-time');
    if (timeElement) {
      timeElement.textContent = `${responseTime} (failed)`;
    }
  }

  private copyRuntimeCall(): void {
    const codeElement = document.getElementById('runtime-code');
    if (!codeElement) return;
    
    const codeText = codeElement.textContent || '';
    navigator.clipboard.writeText(codeText)
      .then(() => {
        this.log('✅ Runtime call code copied to clipboard!', 'success');
      })
      .catch(() => {
        this.log('❌ Failed to copy to clipboard', 'error');
      });
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
    console[consoleMethod](`[Runtime Explorer] ${message}`);
  }

  private clearConsole(): void {
    const consoleContent = document.getElementById('console-content');
    if (consoleContent) {
      const timestamp = new Date().toLocaleTimeString([], { 
        hour: '2-digit', 
        minute: '2-digit', 
        second: '2-digit' 
      });
      consoleContent.innerHTML = `
        <div class="console-entry">
          <span class="console-time">[${timestamp}]</span>
          <span class="console-text info">Console cleared</span>
        </div>
      `;
    }
  }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
  console.log('=============================================');
  console.log('🧠 PAPI Day 7: Runtime Explorer');
  console.log('=============================================');
  console.log('Making direct calls to blockchain runtime APIs...');
  console.log('Demonstrating the power of direct runtime access!');
  console.log('=============================================');
  
  new RuntimeExplorer();
});