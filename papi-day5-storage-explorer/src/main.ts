// src/main.ts
import { createClient } from 'polkadot-api';
import { getWsProvider } from 'polkadot-api/ws-provider';
import { dot } from '@polkadot-api/descriptors';

// Types
interface QueryResult {
  query: string;
  result: any;
  time: number;
  timestamp: Date;
  type: string;
}

class StorageExplorer {
  private client: any = null;
  private dotApi: any = null;
  private activeSubscriptions: Map<string, () => void> = new Map();
  private queryHistory: QueryResult[] = [];
  
  // Sample addresses for demonstration
  private sampleAddresses = [
    '15oF4uVJwmo4TdGW7VfQxNLavjCXviqxT9S1MgbjMNHr6Sp5',
    '1hCMdtRsaTFjVjS9Q9pZkY5v8qBvYQf8zJQcKp8qKp8qKp8q',
    '14Ns6kKbCoka3MS4Hn6b7oRw9fFejG8RH5rq5j63U3WZ3Jp',
    '12gX8C6q4p8qKp8qKp8qKp8qKp8qKp8qKp8qKp8qKp8qKp'
  ];

  constructor() {
    this.initializeUI();
    this.log('🚀 Storage Explorer initialized', 'info');
    this.connectToPolkadot();
  }

  private initializeUI(): void {
    // Setup buttons
    document.getElementById('query-btn')?.addEventListener('click', () => this.executeQuery());
    document.getElementById('subscribe-btn')?.addEventListener('click', () => this.toggleSubscription());
    document.getElementById('clear-results')?.addEventListener('click', () => this.clearResults());
    document.getElementById('export-json')?.addEventListener('click', () => this.exportResults());
    document.getElementById('copy-query')?.addEventListener('click', () => this.copyQuery());
    document.getElementById('clear-console')?.addEventListener('click', () => this.clearConsole());
    document.getElementById('random-address')?.addEventListener('click', () => this.randomAddress());

    // Setup address input
    const addressInput = document.getElementById('account-address') as HTMLInputElement;
    if (addressInput) {
      addressInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          this.executeQuery();
        }
      });
    }
  }

  private async connectToPolkadot(): Promise<void> {
    const statusElement = document.getElementById('chain-status');
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
      this.log('🎯 TypedApi ready for storage queries', 'success');
      
      // Update UI
      if (statusElement) {
        statusElement.textContent = 'Connected';
        statusElement.style.color = '#10B981';
      }
      
      // Get initial block height
      await this.updateBlockHeight();
      
    } catch (error) {
      this.log(`❌ Connection failed: ${error instanceof Error ? error.message : 'Unknown error'}`, 'error');
      if (statusElement) {
        statusElement.textContent = 'Disconnected';
        statusElement.style.color = '#EF4444';
      }
    }
  }

  private async updateBlockHeight(): Promise<void> {
    try {
      const header = await this.dotApi.query.System.Header.getValue();
      if (header && header.number) {
        document.getElementById('block-height')!.textContent = header.number.toString();
      }
    } catch (error) {
      // Silently fail - non-critical
    }
  }

  private async executeQuery(): Promise<void> {
    if (!this.dotApi) {
      this.log('Please wait for connection to establish', 'error');
      return;
    }

    const addressInput = document.getElementById('account-address') as HTMLInputElement;
    const storageSelect = document.getElementById('storage-item') as HTMLSelectElement;
    
    if (!addressInput || !storageSelect) return;
    
    const address = addressInput.value.trim();
    const storageItem = storageSelect.value;
    
    if (!address) {
      this.log('Please enter an account address', 'error');
      return;
    }

    // Validate address format (basic validation)
    if (address.length < 40) {
      this.log('Address appears to be invalid', 'error');
      return;
    }

    this.log(`🔍 Querying ${storageItem} for address: ${address.substring(0, 16)}...`, 'info');
    
    const startTime = Date.now();
    
    try {
      let result: any;
      let queryString = '';
      
      switch (storageItem) {
        case 'balances-account':
          result = await this.dotApi.query.Balances.Account(address);
          queryString = `await dotApi.query.Balances.Account("${address}")`;
          break;
          
        case 'system-account':
          result = await this.dotApi.query.System.Account(address);
          queryString = `await dotApi.query.System.Account("${address}")`;
          break;
          
        case 'timestamp-now':
          result = await this.dotApi.query.Timestamp.Now();
          queryString = `await dotApi.query.Timestamp.Now()`;
          break;
          
        case 'staking-bonded':
          result = await this.dotApi.query.Staking.Bonded(address);
          queryString = `await dotApi.query.Staking.Bonded("${address}")`;
          break;
          
        case 'identity-identity-of':
          result = await this.dotApi.query.Identity.IdentityOf(address);
          queryString = `await dotApi.query.Identity.IdentityOf("${address}")`;
          break;
          
        default:
          throw new Error('Unknown storage item');
      }
      
      const endTime = Date.now();
      const queryTime = endTime - startTime;
      
      // Update stats
      this.updateStats(queryTime);
      
      // Display results
      this.displayResult(result, queryString, queryTime, storageItem);
      
      // Log success
      this.log(`✅ Query completed in ${queryTime}ms`, 'success');
      
      // Add to history
      this.addToHistory({
        query: queryString,
        result: result,
        time: queryTime,
        timestamp: new Date(),
        type: storageItem
      });
      
    } catch (error) {
      const errorTime = Date.now() - startTime;
      this.log(`❌ Query failed after ${errorTime}ms: ${error instanceof Error ? error.message : 'Unknown error'}`, 'error');
      
      // Display error in result
      this.displayError(error, errorTime);
    }
  }

  private displayResult(result: any, queryString: string, queryTime: number, storageItem: string): void {
    // Format the result
    let formattedResult: any = result;
    
    if (result && typeof result === 'object') {
      if ('toJSON' in result && typeof result.toJSON === 'function') {
        formattedResult = result.toJSON();
      } else if ('toHuman' in result && typeof result.toHuman === 'function') {
        formattedResult = result.toHuman();
      }
    }
    
    // Display in JSON view
    const resultElement = document.getElementById('typed-result');
    if (resultElement) {
      resultElement.textContent = JSON.stringify(formattedResult, (key, val) => 
        typeof val === 'bigint' ? val.toString() : val, 2
      );
    }
    
    // Update query info
    const queryElement = document.getElementById('typed-query');
    if (queryElement) {
      queryElement.textContent = queryString;
    }
    
    // Update time info
    const timeElement = document.getElementById('typed-time');
    if (timeElement) {
      timeElement.textContent = `${queryTime} ms`;
    }
    
    // Update response time in stats
    const responseTimeElement = document.getElementById('response-time');
    if (responseTimeElement) {
      responseTimeElement.textContent = `${queryTime} ms`;
    }
    
    // Display type information
    this.displayTypeInfo(result, storageItem);
    
    // Special handling for balance display
    if (storageItem === 'balances-account' && result && result.data) {
      this.displayBalanceBreakdown(result.data);
    }
  }

  private displayTypeInfo(result: any, storageItem: string): void {
    const typeInfoElement = document.getElementById('type-info');
    const propertiesElement = document.getElementById('type-properties');
    
    if (!typeInfoElement || !propertiesElement) return;
    
    // Determine return type
    let returnType = 'unknown';
    if (result && typeof result === 'object') {
      if (result.constructor && result.constructor.name) {
        returnType = result.constructor.name;
      } else if (result.$type) {
        returnType = result.$type;
      }
    }
    
    // Update return type
    const typeValueElements = typeInfoElement.querySelectorAll('.type-value');
    if (typeValueElements[0]) {
      typeValueElements[0].textContent = returnType;
    }
    
    // Extract and display properties
    propertiesElement.innerHTML = '';
    
    if (result && typeof result === 'object') {
      const properties = Object.keys(result).slice(0, 10); // Limit to first 10
      
      properties.forEach(prop => {
        const propElement = document.createElement('span');
        propElement.className = 'type-property';
        propElement.textContent = prop;
        
        // Add click to show value
        propElement.addEventListener('click', () => {
          this.log(`Property "${prop}": ${JSON.stringify(result[prop])}`, 'info');
        });
        
        propertiesElement.appendChild(propElement);
      });
      
      if (Object.keys(result).length > 10) {
        const moreElement = document.createElement('span');
        moreElement.className = 'type-property';
        moreElement.textContent = `+${Object.keys(result).length - 10} more`;
        propertiesElement.appendChild(moreElement);
      }
    }
  }

  private displayBalanceBreakdown(balanceData: any): void {
    // This would display a visual breakdown of the balance
    // For now, just log it
    if (balanceData.free) {
      const free = typeof balanceData.free === 'bigint' ? balanceData.free : BigInt(balanceData.free || 0);
      const reserved = typeof balanceData.reserved === 'bigint' ? balanceData.reserved : BigInt(balanceData.reserved || 0);
      const total = free + reserved;
      
      this.log(`💰 Balance breakdown: Total: ${this.formatBalance(total)}, Free: ${this.formatBalance(free)}, Reserved: ${this.formatBalance(reserved)}`, 'info');
    }
  }

  private displayError(error: any, queryTime: number): void {
    const resultElement = document.getElementById('typed-result');
    if (resultElement) {
      resultElement.textContent = `Error: ${error instanceof Error ? error.message : 'Unknown error'}`;
    }
    
    const timeElement = document.getElementById('typed-time');
    if (timeElement) {
      timeElement.textContent = `${queryTime} ms (failed)`;
    }
  }

  private async toggleSubscription(): Promise<void> {
    if (!this.dotApi) {
      this.log('Please wait for connection to establish', 'error');
      return;
    }

    const addressInput = document.getElementById('account-address') as HTMLInputElement;
    const subscribeBtn = document.getElementById('subscribe-btn') as HTMLButtonElement;
    
    if (!addressInput || !subscribeBtn) return;
    
    const address = addressInput.value.trim();
    const subscriptionId = `balances-${address}`;
    
    if (this.activeSubscriptions.has(subscriptionId)) {
      // Unsubscribe
      const unsubscribe = this.activeSubscriptions.get(subscriptionId);
      if (unsubscribe) {
        unsubscribe();
        this.activeSubscriptions.delete(subscriptionId);
        subscribeBtn.innerHTML = '<i class="fas fa-satellite-dish"></i> Subscribe to Updates';
        this.log(`📡 Unsubscribed from balance updates for ${address.substring(0, 16)}...`, 'info');
      }
    } else {
      // Subscribe
      if (!address) {
        this.log('Please enter an account address', 'error');
        return;
      }

      try {
        const unsubscribe = this.dotApi.query.Balances.Account
          .watchValue(address)
          .subscribe((update: any) => {
            const now = new Date();
            const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
            
            if (update && update.data) {
              const free = update.data.free || 0n;
              const reserved = update.data.reserved || 0n;
              const total = free + reserved;
              
              this.log(`[${timeStr}] Balance update: ${this.formatBalance(total)} (Free: ${this.formatBalance(free)})`, 'info');
            }
          });
        
        this.activeSubscriptions.set(subscriptionId, unsubscribe);
        subscribeBtn.innerHTML = '<i class="fas fa-ban"></i> Stop Subscription';
        this.log(`📡 Subscribed to balance updates for ${address.substring(0, 16)}...`, 'success');
        
        // Update active queries count
        this.updateActiveQueriesCount();
        
      } catch (error) {
        this.log(`❌ Failed to subscribe: ${error instanceof Error ? error.message : 'Unknown error'}`, 'error');
      }
    }
  }

  private updateStats(queryTime: number): void {
    // Update response time
    const responseTimeElement = document.getElementById('response-time');
    if (responseTimeElement) {
      responseTimeElement.textContent = `${queryTime} ms`;
    }
    
    // Update active queries
    this.updateActiveQueriesCount();
  }

  private updateActiveQueriesCount(): void {
    const activeQueriesElement = document.getElementById('active-queries');
    if (activeQueriesElement) {
      activeQueriesElement.textContent = this.activeSubscriptions.size.toString();
    }
  }

  private addToHistory(queryResult: QueryResult): void {
    this.queryHistory.push(queryResult);
    
    // Keep only last 10
    if (this.queryHistory.length > 10) {
      this.queryHistory.shift();
    }
  }

  private clearResults(): void {
    const resultElement = document.getElementById('typed-result');
    if (resultElement) {
      resultElement.textContent = 'Results cleared. Execute a new query...';
    }
    
    const queryElement = document.getElementById('typed-query');
    if (queryElement) {
      queryElement.textContent = '-';
    }
    
    const timeElement = document.getElementById('typed-time');
    if (timeElement) {
      timeElement.textContent = '- ms';
    }
    
    this.log('🧹 Query results cleared', 'info');
  }

  private exportResults(): void {
    if (this.queryHistory.length === 0) {
      this.log('No query results to export', 'error');
      return;
    }
    
    const exportData = {
      generated: new Date().toISOString(),
      queries: this.queryHistory,
      totalQueries: this.queryHistory.length,
      activeSubscriptions: this.activeSubscriptions.size
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `storage-queries-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    this.log('📥 Query results exported as JSON', 'success');
  }

  private copyQuery(): void {
    const queryElement = document.getElementById('typed-query');
    if (!queryElement || queryElement.textContent === '-') {
      this.log('No query to copy', 'error');
      return;
    }
    
    navigator.clipboard.writeText(queryElement.textContent)
      .then(() => {
        this.log('✅ Query copied to clipboard!', 'success');
      })
      .catch(err => {
        this.log(`❌ Failed to copy: ${err}`, 'error');
      });
  }

  private randomAddress(): void {
    const randomIndex = Math.floor(Math.random() * this.sampleAddresses.length);
    const addressInput = document.getElementById('account-address') as HTMLInputElement;
    
    if (addressInput) {
      addressInput.value = this.sampleAddresses[randomIndex];
      this.log(`🎲 Random address selected: ${this.sampleAddresses[randomIndex].substring(0, 16)}...`, 'info');
    }
  }

  private formatBalance(balance: bigint | number): string {
    const bal = typeof balance === 'bigint' ? balance : BigInt(balance || 0);
    
    // Convert planck to DOT (1 DOT = 10^10 planck)
    const dotAmount = Number(bal) / 1e10;
    
    if (dotAmount >= 1) {
      return `${dotAmount.toFixed(4)} DOT`;
    } else if (dotAmount > 0) {
      return `${dotAmount.toFixed(8)} DOT`;
    } else {
      return `${bal.toString()} Planck`;
    }
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
    console[consoleMethod](`[Storage Explorer] ${message}`);
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
  console.log('🚀 PAPI Day 6: Storage Explorer');
  console.log('=============================================');
  console.log('Exploring blockchain storage with typed queries...');
  console.log('Demonstrating the power of PAPI storage queries!');
  console.log('=============================================');
  
  new StorageExplorer();
});