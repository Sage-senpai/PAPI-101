//src/utils/polkadotClient.ts
import { ApiPromise, WsProvider } from '@polkadot/api'

let clientInstance: ApiPromise | null = null

export const createPolkadotClient = async () => {
  if (clientInstance) {
    console.log('♻️  Reusing existing API instance')
    return clientInstance
  }

  try {
    console.log('🚀 Connecting to Polkadot mainnet via public RPC...')
    
    // Use Polkadot's public RPC endpoints
    const provider = new WsProvider([
      'wss://rpc.polkadot.io',
      'wss://polkadot.api.onfinality.io/public-ws',
      'wss://polkadot-rpc.dwellir.com',
    ], false)

    const api = await ApiPromise.create({ provider })
    
    // Wait for the API to be ready
    await api.isReady
    
    console.log('✅ Connected to Polkadot!')
    console.log('🔗 Chain:', (await api.rpc.system.chain()).toString())
    console.log('📊 Node:', (await api.rpc.system.name()).toString())

    clientInstance = api
    
    return clientInstance
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error)
    console.error('❌ Connection failed:', msg)
    throw error
  }
}

export const destroyPolkadotClient = () => {
  if (clientInstance) {
    try {
      clientInstance.disconnect()
      clientInstance = null
      console.log('🗑️  API disconnected')
    } catch (error) {
      console.error('Error disconnecting:', error)
    }
  }
}