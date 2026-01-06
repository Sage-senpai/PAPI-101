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
      
      // Update stats
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
    }
  }

  private async executeRuntimeCall(): Promise<void> {
    if (!this.dotApi) {
      this.log('Please wait for connection to establish', 'error');
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
          this.displayMetadataResults(result, responseTime);
          break;
          
        case 'transaction-queue':
          // This would require transaction data - for demo, we'll show a message
          this.log('ℹ️ Transaction Queue API requires transaction data for full demo', 'info');
          result = { message: 'Transaction Queue API available - requires tx data for full call' };
          responseTime = Date.now() - startTime;
          this.displayGenericResults(result, responseTime, 'Transaction Queue API');
          break;
          
        case 'account-nonce':
          // This would require account parameter - for demo, we'll show a message
          this.log('ℹ️ Account Nonce API requires account parameter for full demo', 'info');
          result = { message: 'Account Nonce API available - requires account parameter for full call' };
          responseTime = Date.now() - startTime;
          this.displayGenericResults(result, responseTime, 'Account Nonce API');
          break;
          
        case 'core':
          try {
            result = await this.dotApi.apis.Core.version();
            responseTime = Date.now() - startTime;
            this.displayGenericResults(result, responseTime, 'Core API');
          } catch (coreError) {
            // Core API might not be available in all runtimes
            this.log(`⚠️ Core API not available: ${coreError instanceof Error ? coreError.message : 'Unknown error'}`, 'info');
            result = { message: 'Core API not available in this runtime version' };
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
      
      // Display error in results
      this.displayError(error, errorTime);
    }
  }

  private updateRuntimeStats(metadata: any, responseTime: number): void {
    // Update runtime version
    const versionElement = document.getElementById('runtime-version');
    if (versionElement && metadata.specVersion) {
      versionElement.textContent = metadata.specVersion.toString();
    }
    
    // Update spec name
    const specElement = document.getElementById('spec-name');
    if (specElement && metadata.specName) {
      specElement.textContent = metadata.specName.toString();
    }
    
    // Update pallets count (estimate)
    const palletsElement = document.getElementById('pallets-count');
    if (palletsElement && metadata.pallets) {
      palletsElement.textContent = metadata.pallets.length?.toString() || '?';
    }
    
    // Update response time
    const timeElement = document.getElementById('response-time');
    if (timeElement) {
      timeElement.textContent = `${responseTime} ms`;
    }
  }

  private displayMetadataResults(metadata: any, responseTime: number): void {
    // Format the metadata for display
    let formattedMetadata: any = metadata;
    
    if (metadata && typeof metadata === 'object') {
      if ('toJSON' in metadata && typeof metadata.toJSON === 'function') {
        formattedMetadata = metadata.toJSON();
      } else if ('toHuman' in metadata && typeof metadata.toHuman === 'function') {
        formattedMetadata = metadata.toHuman();
      }
    }
    
    // Display in JSON view
    const resultElement = document.getElementById('runtime-result');
    if (resultElement) {
      resultElement.textContent = JSON.stringify(formattedMetadata, (key, val) => 
        typeof val === 'bigint' ? val.toString() : val, 2
      );
    }
    
    // Update insights
    this.updateMetadataInsights(metadata);
    
    // Update response time
    const timeElement = document.getElementById('response-time');
    if (timeElement) {
      timeElement.textContent = `${responseTime} ms`;
    }
  }

  private displayGenericResults(result: any, responseTime: number, apiName: string): void {
    // Format the result for display
    let formattedResult: any = result;
    
    if (result && typeof result === 'object') {
      if ('toJSON' in result && typeof result.toJSON === 'function') {
        formattedResult = result.toJSON();
      } else if ('toHuman' in result && typeof result.toHuman === 'function') {
        formattedResult = result.toHuman();
      }
    }
    
    // Display in JSON view
    const resultElement = document.getElementById('runtime-result');
    if (resultElement) {
      resultElement.textContent = JSON.stringify(formattedResult, (key, val) => 
        typeof val === 'bigint' ? val.toString() : val, 2
      );
    }
    
    // Update insights for generic API
    this.updateGenericInsights(apiName);
    
    // Update response time
    const timeElement = document.getElementById('response-time');
    if (timeElement) {
      timeElement.textContent = `${responseTime} ms`;
    }
  }

  private updateMetadataInsights(metadata: any): void {
    // Update chain spec
    const chainSpecElement = document.getElementById('chain-spec');
    if (chainSpecElement && metadata.specName && metadata.specVersion) {
      chainSpecElement.textContent = `${metadata.specName} v${metadata.specVersion}`;
    }
    
    // Update runtime capabilities
    const capabilitiesElement = document.getElementById('runtime-capabilities');
    if (capabilitiesElement) {
      let capabilities = '';
      
      if (metadata.pallets && Array.isArray(metadata.pallets)) {
        capabilities = `${metadata.pallets.length} pallets available`;
        
        // Add some notable pallets if available
        const notablePallets = metadata.pallets
          .filter((p: any) => ['Balances', 'Staking', 'Identity', 'Democracy'].includes(p.name))
          .map((p: any) => p.name)
          .join(', ');
        
        if (notablePallets) {
          capabilities += ` (including: ${notablePallets})`;
        }
      } else {
        capabilities = 'Runtime structure loaded';
      }
      
      capabilitiesElement.textContent = capabilities;
    }
  }

  private updateGenericInsights(apiName: string): void {
    // Update chain spec (generic)
    const chainSpecElement = document.getElementById('chain-spec');
    if (chainSpecElement) {
      chainSpecElement.textContent = `${apiName} response received`;
    }
    
    // Update runtime capabilities
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
      timeElement.textContent = `${responseTime} ms (failed)`;
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
      .catch(err => {
        this.log(`❌ Failed to copy: ${err}`, 'error');
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
      consoleContent.innerHTML = `
        <div class="console-entry">
          <span class="console-time">[${new Date().toLocaleTimeString()}]</span>
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