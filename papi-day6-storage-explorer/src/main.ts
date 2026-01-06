// src/main.ts
import { createClient } from 'polkadot-api';
import { getWsProvider } from 'polkadot-api/ws-provider';
import { dot } from '@polkadot-api/descriptors';

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
  private blockHeightSubscription: (() => void) | null = null;
  
  private sampleAddresses = [
    '15oF4uVJwmo4TdGW7VfQxNLavjCXviqxT9S1MgbjMNHr6Sp5', // Polkadot Foundation
    '16hp43x8DUZtU8L3cJy9Z8JMwTzuu8ZZRWqDZnpMhp464oEd', // Sample staking account
    '14Gn7SEmKhp2SEj7DDBgaPCAiXbWE5LUAN8hg8D9JYmMi7BY', // Sample account
    '13UVJyLnbVp9RBZYFwFGyDvVd1y27Tt8tkntv6Q7JVPhFsTB'  // Sample account
  ];

  constructor() {
    this.log('🚀 Storage Explorer initialized', 'info');
    this.initializeUI();
    this.connectToPolkadot();
  }

  private initializeUI(): void {
    // Query buttons
    document.getElementById('query-btn')?.addEventListener('click', () => this.executeQuery());
    document.getElementById('subscribe-btn')?.addEventListener('click', () => this.toggleSubscription());
    document.getElementById('clear-results')?.addEventListener('click', () => this.clearResults());
    
    // Export/Copy buttons
    document.getElementById('export-json')?.addEventListener('click', () => this.exportResults());
    document.getElementById('copy-result')?.addEventListener('click', () => this.copyResult());
    
    // Console controls
    document.getElementById('clear-console')?.addEventListener('click', () => this.clearConsole());
    
    // Address controls
    document.getElementById('random-address')?.addEventListener('click', () => this.randomAddress());
    
    // Enter key support
    const addressInput = document.getElementById('account-address') as HTMLInputElement;
    addressInput?.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') this.executeQuery();
    });
  }

  private async connectToPolkadot(): Promise<void> {
    this.updateConnectionStatus('connecting');
    this.log('🔌 Connecting to Polkadot...', 'info');

    try {
      // Create WebSocket provider
      const wsProvider = getWsProvider('wss://rpc.polkadot.io');
      
      // Create client
      this.client = createClient(wsProvider);
      
      // Get TypedApi
      this.dotApi = this.client.getTypedApi(dot);
      
      this.updateConnectionStatus('connected');
      this.log('✅ Connected to Polkadot mainnet', 'success');
      
      // Subscribe to block height
      await this.subscribeToBlockHeight();
      
    } catch (error) {
      this.updateConnectionStatus('disconnected');
      this.log(`❌ Connection failed: ${error instanceof Error ? error.message : 'Unknown error'}`, 'error');
      
      // Retry after 5 seconds
      setTimeout(() => this.connectToPolkadot(), 5000);
    }
  }

  private async subscribeToBlockHeight(): Promise<void> {
    try {
      this.blockHeightSubscription = this.dotApi.query.System.Number.watchValue().subscribe(
        (blockNumber: number) => {
          const blockHeightEl = document.getElementById('block-height');
          if (blockHeightEl) {
            blockHeightEl.textContent = blockNumber.toLocaleString();
          }
        }
      );
    } catch (error) {
      console.error('Failed to subscribe to block height:', error);
    }
  }

  private updateConnectionStatus(status: 'connecting' | 'connected' | 'disconnected'): void {
    const statusEl = document.getElementById('connection-status');
    if (!statusEl) return;
    
    const dot = statusEl.querySelector('.status-dot') as HTMLElement;
    const text = statusEl.querySelector('.status-text') as HTMLElement;
    
    if (status === 'connecting') {
      dot.className = 'status-dot connecting';
      text.textContent = 'Connecting...';
    } else if (status === 'connected') {
      dot.className = 'status-dot connected';
      text.textContent = 'Connected';
    } else {
      dot.className = 'status-dot disconnected';
      text.textContent = 'Disconnected';
    }
  }

  private async executeQuery(): Promise<void> {
    if (!this.dotApi) {
      this.log('⏳ Please wait for connection to establish', 'warning');
      return;
    }

    const addressInput = document.getElementById('account-address') as HTMLInputElement;
    const storageSelect = document.getElementById('storage-item') as HTMLSelectElement;
    
    if (!addressInput || !storageSelect) return;
    
    const address = addressInput.value.trim();
    const storageItem = storageSelect.value;
    
    if (!address && !storageItem.includes('timestamp')) {
      this.log('Please enter an account address', 'error');
      return;
    }

    this.log(`🔍 Querying ${storageSelect.selectedOptions[0].text}...`, 'info');
    
    const startTime = Date.now();
    
    try {
      let result: any;
      let queryString = '';
      
      switch (storageItem) {
        case 'balances-account':
          result = await this.dotApi.query.Balances.Account.getValue(address);
          queryString = `await dotApi.query.Balances.Account.getValue("${address}")`;
          break;
          
        case 'system-account':
          result = await this.dotApi.query.System.Account.getValue(address);
          queryString = `await dotApi.query.System.Account.getValue("${address}")`;
          break;
          
        case 'timestamp-now':
          result = await this.dotApi.query.Timestamp.Now.getValue();
          queryString = `await dotApi.query.Timestamp.Now.getValue()`;
          break;
          
        case 'staking-bonded':
          result = await this.dotApi.query.Staking.Bonded.getValue(address);
          queryString = `await dotApi.query.Staking.Bonded.getValue("${address}")`;
          break;
          
        case 'identity-identity-of':
          result = await this.dotApi.query.Identity.IdentityOf.getValue(address);
          queryString = `await dotApi.query.Identity.IdentityOf.getValue("${address}")`;
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
      this.log(`❌ Query failed: ${error instanceof Error ? error.message : 'Unknown error'}`, 'error');
      this.displayError(error, errorTime);
    }
  }

  private displayResult(result: any, queryString: string, queryTime: number, storageItem: string): void {
    // Format the result for display
    let formattedResult: any = result;
    
    // Convert BigInts to strings for JSON display
    const jsonReplacer = (key: string, value: any) => {
      if (typeof value === 'bigint') {
        return value.toString() + 'n';
      }
      return value;
    };
    
    // Display in JSON view
    const resultElement = document.getElementById('typed-result');
    if (resultElement) {
      if (result === undefined || result === null) {
        resultElement.textContent = 'null (no data at this storage location)';
      } else {
        resultElement.textContent = JSON.stringify(formattedResult, jsonReplacer, 2);
      }
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
    
    // Display type information
    this.displayTypeInfo(result, storageItem);
    
    // Special formatting for balance data
    if (storageItem === 'balances-account' && result && result.data) {
      this.logBalanceInfo(result.data);
    }
    
    // Special formatting for timestamp
    if (storageItem === 'timestamp-now' && result) {
      const date = new Date(Number(result));
      this.log(`🕐 Block timestamp: ${date.toLocaleString()}`, 'info');
    }
  }

  private displayTypeInfo(result: any, storageItem: string): void {
    const returnTypeEl = document.getElementById('return-type');
    const propertiesEl = document.getElementById('type-properties');
    
    if (!returnTypeEl || !propertiesEl) return;
    
    // Determine return type
    let returnType = typeof result;
    if (result === null || result === undefined) {
      returnType = 'undefined | null';
    } else if (typeof result === 'object') {
      returnType = 'AccountInfo | Balance | Identity';
    } else if (typeof result === 'bigint') {
      returnType = 'bigint (Timestamp)';
    }
    
    returnTypeEl.textContent = returnType;
    
    // Display properties
    propertiesEl.innerHTML = '';
    
    if (result && typeof result === 'object') {
      const properties = Object.keys(result).slice(0, 10);
      
      properties.forEach(prop => {
        const propBadge = document.createElement('span');
        propBadge.className = 'property-badge';
        propBadge.textContent = prop;
        propBadge.title = `Type: ${typeof result[prop]}`;
        propertiesEl.appendChild(propBadge);
      });
      
      if (Object.keys(result).length > 10) {
        const moreBadge = document.createElement('span');
        moreBadge.className = 'property-badge more';
        moreBadge.textContent = `+${Object.keys(result).length - 10} more`;
        propertiesEl.appendChild(moreBadge);
      }
    } else {
      propertiesEl.textContent = 'Primitive type (no properties)';
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
      this.log('⏳ Please wait for connection to establish', 'warning');
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
        subscribeBtn.classList.remove('active');
        this.log(`📡 Unsubscribed from balance updates`, 'info');
        this.updateActiveQueriesCount();
      }
    } else {
      // Subscribe
      if (!address) {
        this.log('Please enter an account address', 'error');
        return;
      }

      try {
        this.log(`📡 Subscribing to balance updates for ${address.substring(0, 16)}...`, 'info');
        
        const unsubscribe = this.dotApi.query.Balances.Account.watchValue(address).subscribe(
          (update: any) => {
            if (update && update.data) {
              const free = update.data.free;
              const reserved = update.data.reserved;
              
              this.log(
                `💰 Balance update: Free: ${this.formatBalance(free)}, Reserved: ${this.formatBalance(reserved)}`,
                'info'
              );
            }
          }
        );
        
        this.activeSubscriptions.set(subscriptionId, unsubscribe);
        subscribeBtn.innerHTML = '<i class="fas fa-ban"></i> Unsubscribe';
        subscribeBtn.classList.add('active');
        this.log(`✅ Subscribed to balance updates`, 'success');
        this.updateActiveQueriesCount();
        
      } catch (error) {
        this.log(`❌ Subscription failed: ${error instanceof Error ? error.message : 'Unknown error'}`, 'error');
      }
    }
  }

  private updateStats(queryTime: number): void {
    const responseTimeEl = document.getElementById('response-time');
    if (responseTimeEl) {
      responseTimeEl.textContent = `${queryTime} ms`;
    }
  }

  private updateActiveQueriesCount(): void {
    const activeQueriesEl = document.getElementById('active-queries');
    if (activeQueriesEl) {
      activeQueriesEl.textContent = this.activeSubscriptions.size.toString();
    }
  }

  private logBalanceInfo(balanceData: any): void {
    if (!balanceData) return;
    
    const free = balanceData.free || 0n;
    const reserved = balanceData.reserved || 0n;
    const frozen = balanceData.frozen || 0n;
    
    this.log(`💰 Free: ${this.formatBalance(free)} DOT`, 'info');
    this.log(`🔒 Reserved: ${this.formatBalance(reserved)} DOT`, 'info');
    this.log(`❄️ Frozen: ${this.formatBalance(frozen)} DOT`, 'info');
  }

  private formatBalance(balance: bigint | number): string {
    const bal = typeof balance === 'bigint' ? balance : BigInt(balance || 0);
    const dotAmount = Number(bal) / 1e10;
    
    if (dotAmount >= 1) {
      return `${dotAmount.toFixed(4)}`;
    } else if (dotAmount > 0) {
      return `${dotAmount.toFixed(8)}`;
    } else {
      return '0.0000';
    }
  }

  private addToHistory(queryResult: QueryResult): void {
    this.queryHistory.push(queryResult);
    if (this.queryHistory.length > 20) {
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
    
    const returnTypeEl = document.getElementById('return-type');
    if (returnTypeEl) {
      returnTypeEl.textContent = 'Not yet queried';
    }
    
    const propertiesEl = document.getElementById('type-properties');
    if (propertiesEl) {
      propertiesEl.textContent = 'Properties will appear after query';
    }
    
    this.log('🧹 Query results cleared', 'info');
  }

  private exportResults(): void {
    if (this.queryHistory.length === 0) {
      this.log('No query history to export', 'warning');
      return;
    }
    
    const exportData = {
      generated: new Date().toISOString(),
      queries: this.queryHistory.map(q => ({
        ...q,
        result: JSON.stringify(q.result, (key, val) => 
          typeof val === 'bigint' ? val.toString() + 'n' : val
        )
      })),
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
    
    this.log('📥 Query history exported', 'success');
  }

  private copyResult(): void {
    const resultElement = document.getElementById('typed-result');
    if (!resultElement || resultElement.textContent === 'Click "Execute Query" to see results...') {
      this.log('No result to copy', 'warning');
      return;
    }
    
    navigator.clipboard.writeText(resultElement.textContent || '')
      .then(() => this.log('✅ Result copied to clipboard', 'success'))
      .catch(() => this.log('❌ Failed to copy result', 'error'));
  }

  private randomAddress(): void {
    const randomIndex = Math.floor(Math.random() * this.sampleAddresses.length);
    const addressInput = document.getElementById('account-address') as HTMLInputElement;
    
    if (addressInput) {
      addressInput.value = this.sampleAddresses[randomIndex];
      this.log(`🎲 Random address: ${this.sampleAddresses[randomIndex].substring(0, 16)}...`, 'info');
    }
  }

  private log(message: string, type: 'info' | 'success' | 'error' | 'warning' = 'info'): void {
    const consoleContent = document.getElementById('console-content');
    if (!consoleContent) return;
    
    const timestamp = new Date().toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit',
      hour12: false
    });
    
    const entry = document.createElement('div');
    entry.className = `console-entry ${type}`;
    
    const timeSpan = document.createElement('span');
    timeSpan.className = 'console-time';
    timeSpan.textContent = `[${timestamp}]`;
    
    const textSpan = document.createElement('span');
    textSpan.className = 'console-text';
    textSpan.textContent = message;
    
    entry.appendChild(timeSpan);
    entry.appendChild(textSpan);
    consoleContent.appendChild(entry);
    
    // Auto-scroll
    consoleContent.scrollTop = consoleContent.scrollHeight;
    
    // Also log to browser console
    console.log(`[Storage Explorer] ${message}`);
  }

  private clearConsole(): void {
    const consoleContent = document.getElementById('console-content');
    if (consoleContent) {
      consoleContent.innerHTML = '';
      this.log('Console cleared', 'info');
    }
  }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  console.log('='.repeat(50));
  console.log('🚀 PAPI Storage Explorer - Day 6');
  console.log('='.repeat(50));
  console.log('Connecting to Polkadot mainnet...');
  console.log('Demonstrating typed storage queries with PAPI');
  console.log('='.repeat(50));
  
  new StorageExplorer();
});