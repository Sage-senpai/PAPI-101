// src/utils/polkadotClient.ts
import { createClient } from 'polkadot-api'
import { getWsProvider } from 'polkadot-api/ws-provider/web'
import { withPolkadotSdkCompat } from 'polkadot-api/polkadot-sdk-compat'

/**
 * Polkadot WebSocket endpoints
 */
const POLKADOT_ENDPOINTS = [
  'wss://rpc.polkadot.io',
  'wss://polkadot-rpc.dwellir.com',
  'wss://polkadot.api.onfinality.io/public-ws',
]

/**
 * Create a Polkadot API client using PAPI
 */
export const createPolkadotClient = async () => {
  console.log('🚀 Creating Polkadot PAPI client...')
  
  try {
    // Create WebSocket provider with multiple endpoints for fallback
    const provider = getWsProvider(POLKADOT_ENDPOINTS[0])
    
    // Create the client with Polkadot SDK compatibility
    const client = createClient(withPolkadotSdkCompat(provider))
    
    console.log('✅ PAPI client created successfully')
    console.log('🔗 Connected to Polkadot mainnet')
    
    return client
  } catch (error) {
    console.error('❌ Failed to create PAPI client:', error)
    throw error
  }
}

/**
 * Subscribe to System.Events to watch all blockchain events
 */
export const subscribeToEvents = (
  client: any,
  eventTypes: string[],
  callback: (event: any) => void
) => {
  console.log(`📡 Subscribing to events: ${eventTypes.join(', ')}`)
  
  // Subscribe to finalized blocks
  const subscription = client.finalizedBlock$.subscribe({
    next: async (finalizedBlock: any) => {
      try {
        // Get block details
        const block = await client.getBlock(finalizedBlock.hash)
        
        // Process events from the block
        if (block?.events) {
          for (const event of block.events) {
            const eventType = `${event.pallet}.${event.name}`
            
            // Filter by event types if specified
            if (eventTypes.length === 0 || eventTypes.includes(eventType)) {
              callback({
                blockNumber: finalizedBlock.number,
                event: {
                  type: eventType,
                  pallet: event.pallet,
                  name: event.name,
                  value: event.value,
                  data: event.value, // For compatibility
                },
                hash: finalizedBlock.hash,
              })
            }
          }
        }
      } catch (error) {
        console.error('Error processing block events:', error)
      }
    },
    error: (error: any) => {
      console.error('❌ Event subscription error:', error)
    },
    complete: () => {
      console.log('🛑 Event subscription completed')
    },
  })
  
  return subscription
}

/**
 * Mock client for fallback when PAPI connection fails
 */
export class MockPolkadotClient {
  private intervals: NodeJS.Timeout[] = []

  eventSubscription(
    eventTypes: string[],
    callback: (event: any) => void,
    intervalMs: number = 5000
  ) {
    console.log(`📡 Mock subscription active for: ${eventTypes.join(', ')}`)
    console.log('💡 Using mock data - real PAPI connection failed')
    
    const interval = setInterval(() => {
      if (Math.random() > 0.3) {
        const mockEvent = this.generateMockEvent(eventTypes)
        callback(mockEvent)
      }
    }, intervalMs)

    this.intervals.push(interval)

    return {
      unsubscribe: () => {
        clearInterval(interval)
        const index = this.intervals.indexOf(interval)
        if (index > -1) {
          this.intervals.splice(index, 1)
        }
        console.log('🛑 Mock subscription stopped')
      }
    }
  }

  private generateMockEvent(eventTypes: string[]): any {
    const eventType = eventTypes[Math.floor(Math.random() * eventTypes.length)]
    const blockNumber = 17850000 + Math.floor(Math.random() * 10000)
    
    const [pallet, name] = eventType.split('.')
    
    const baseEvent = {
      blockNumber,
      event: {
        type: eventType,
        pallet,
        name,
        value: {},
        data: {},
      }
    }

    switch (eventType) {
      case 'Balances.Transfer':
        baseEvent.event.value = {
          from: this.generateAddress(),
          to: this.generateAddress(),
          amount: BigInt(Math.floor(Math.random() * 10000) * 1e10)
        }
        break
      case 'Balances.Deposit':
        baseEvent.event.value = {
          who: this.generateAddress(),
          amount: BigInt(Math.floor(Math.random() * 5000) * 1e10)
        }
        break
      case 'Staking.Rewarded':
        baseEvent.event.value = {
          stash: this.generateAddress(),
          amount: BigInt(Math.floor(Math.random() * 100) * 1e10)
        }
        break
      case 'Treasury.Awarded':
        baseEvent.event.value = {
          proposalIndex: Math.floor(Math.random() * 1000),
          award: BigInt(Math.floor(Math.random() * 50000) * 1e10),
          account: this.generateAddress()
        }
        break
    }

    baseEvent.event.data = baseEvent.event.value
    return baseEvent
  }

  private generateAddress(): string {
    const chars = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz'
    let address = '1'
    for (let i = 0; i < 47; i++) {
      address += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return address
  }

  destroy() {
    this.intervals.forEach(interval => clearInterval(interval))
    this.intervals = []
    console.log('🗑️ Mock client destroyed')
  }
}