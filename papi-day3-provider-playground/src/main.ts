// src/main.ts
import { createClient } from 'polkadot-api'
import { getSmProvider } from 'polkadot-api/sm-provider'
import { getWsProvider } from 'polkadot-api/ws-provider'
import { chainSpec } from 'polkadot-api/chains/polkadot'
import { startFromWorker } from 'polkadot-api/smoldot/from-worker'
import SmWorker from 'polkadot-api/smoldot/worker?worker'
import './style.css'

// Type definitions for our components
interface ConnectionMetrics {
  latency: number
  blockHeight: number
  connectionTime: number
}

interface ProviderStats {
  smoldot: ConnectionMetrics
  wss: ConnectionMetrics
}

class ProviderPlayground {
  private smoldotClient: any = null
  private wssClient: any = null
  private stats: ProviderStats = {
    smoldot: { latency: 0, blockHeight: 0, connectionTime: 0 },
    wss: { latency: 0, blockHeight: 0, connectionTime: 0 }
  }
  private monitoringIntervals: { smoldot?: NodeJS.Timeout; wss?: NodeJS.Timeout } = {}

  constructor() {
    this.initializeUI()
    this.log('Provider Playground initialized. Ready to connect!', 'info')
  }

  private initializeUI(): void {
    // Setup event listeners
    document.getElementById('smoldot-connect')?.addEventListener('click', () => this.connectSmoldot())
    document.getElementById('wss-connect')?.addEventListener('click', () => this.connectWSS())
    document.getElementById('clear-log')?.addEventListener('click', () => this.clearLog())

    // Initialize metrics display
    this.updateMetricsDisplay()
  }

  private updateStatus(provider: 'smoldot' | 'wss', status: 'disconnected' | 'connecting' | 'connected'): void {
    const element = document.getElementById(`${provider}-status`)
    if (!element) return

    const indicator = element.querySelector('.status-indicator')
    const text = element.querySelector('.status-text')

    if (indicator) {
      indicator.className = 'status-indicator'
      indicator.classList.add(status)
    }

    if (text) {
      text.textContent = this.capitalize(status)
    }

    this.log(`${this.capitalize(provider)}: ${status}`, provider)
  }

  private updateMetric(provider: 'smoldot' | 'wss', metric: keyof ConnectionMetrics, value: number): void {
    this.stats[provider][metric] = value
    this.updateMetricsDisplay()

    const element = document.getElementById(`${provider}-metrics`)
    if (!element) return

    const metricElement = element.querySelector(`[data-metric="${metric}"]`)
    if (metricElement) {
      if (metric === 'latency') {
        metricElement.textContent = `${value}ms`
      } else if (metric === 'blockHeight') {
        metricElement.textContent = value.toLocaleString()
      } else {
        metricElement.textContent = value.toString()
      }
    }
  }

  private updateMetricsDisplay(): void {
    // Update comparison bars
    const maxTime = Math.max(this.stats.smoldot.connectionTime, this.stats.wss.connectionTime, 1)
    const smoldotPercentage = (this.stats.smoldot.connectionTime / maxTime) * 100
    const wssPercentage = (this.stats.wss.connectionTime / maxTime) * 100

    const smoldotBar = document.getElementById('smoldot-time-bar')
    const wssBar = document.getElementById('wss-time-bar')

    if (smoldotBar) {
      smoldotBar.style.width = `${smoldotPercentage}%`
      const label = smoldotBar.querySelector('.bar-label')
      if (label) {
        label.textContent = this.stats.smoldot.connectionTime > 0 
          ? `Smoldot: ${this.stats.smoldot.connectionTime}ms`
          : 'Smoldot: -'
      }
    }

    if (wssBar) {
      wssBar.style.width = `${wssPercentage}%`
      const label = wssBar.querySelector('.bar-label')
      if (label) {
        label.textContent = this.stats.wss.connectionTime > 0 
          ? `WSS: ${this.stats.wss.connectionTime}ms`
          : 'WSS: -'
      }
    }

    // Update resource dots
    this.updateResourceDots('smoldot', this.stats.smoldot.latency)
    this.updateResourceDots('wss', this.stats.wss.latency)
  }

  private updateResourceDots(provider: 'smoldot' | 'wss', latency: number): void {
    const dotsContainer = document.getElementById(`${provider}-resource-dots`)
    if (!dotsContainer) return

    const dots = dotsContainer.querySelectorAll('.dot')
    const activeDots = Math.min(5, Math.max(1, Math.ceil((1000 - Math.min(latency, 1000)) / 200)))

    dots.forEach((dot, index) => {
      dot.classList.toggle('active', index < activeDots)
    })
  }

  private log(message: string, type: 'smoldot' | 'wss' | 'info' | 'success' | 'error' = 'info'): void {
    const consoleContent = document.getElementById('console-content')
    if (!consoleContent) return

    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    const logEntry = document.createElement('div')
    logEntry.className = 'log-entry'

    const timeSpan = document.createElement('span')
    timeSpan.className = 'log-time'
    timeSpan.textContent = `[${timestamp}]`

    const textSpan = document.createElement('span')
    textSpan.className = `log-text ${type}`
    textSpan.textContent = message

    logEntry.appendChild(timeSpan)
    logEntry.appendChild(textSpan)
    consoleContent.appendChild(logEntry)

    // Auto-scroll to bottom
    consoleContent.scrollTop = consoleContent.scrollHeight
  }

  private clearLog(): void {
    const consoleContent = document.getElementById('console-content')
    if (consoleContent) {
      consoleContent.innerHTML = '<div class="log-entry"><span class="log-time">[Ready]</span><span class="log-text">Log cleared. Ready for new connections.</span></div>'
    }
  }

  private capitalize(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1)
  }

  async connectSmoldot(): Promise<void> {
    // Prevent multiple connections
    if (this.smoldotClient) {
      this.log('Already connected to Smoldot', 'info')
      return
    }

    this.updateStatus('smoldot', 'connecting')
    this.log('Starting Smoldot connection...', 'smoldot')
    this.log('⏳ This may take 30-60 seconds for first connection', 'info')

    const startTime = Date.now()

    try {
      // Initialize Smoldot worker
      this.log('🔧 Initializing Smoldot worker...', 'smoldot')
      const worker = new SmWorker()
      const smoldot = startFromWorker(worker)
      
      this.log('✓ Smoldot worker initialized', 'smoldot')

      // Add Polkadot chain
      this.log('🔗 Adding Polkadot chain to Smoldot...', 'smoldot')
      const chain = await smoldot.addChain({ chainSpec })
      this.log('✓ Polkadot chain added', 'smoldot')

      // Create client with Smoldot provider
      this.log('🚀 Creating PAPI client...', 'smoldot')
      this.smoldotClient = createClient(getSmProvider(chain))
      this.log('✓ PAPI client created', 'smoldot')

      // Test connection - subscribe to get first finalized block
      this.log('🔍 Testing connection...', 'smoldot')
      
      // Wait for first block using Promise wrapper
      const firstBlock = await new Promise((resolve, reject) => {
        const timeout = setTimeout(() => reject(new Error('Connection timeout')), 120000)
        const subscription = this.smoldotClient.finalizedBlock$.subscribe({
          next: (block: any) => {
            clearTimeout(timeout)
            subscription.unsubscribe()
            resolve(block)
          },
          error: (err: Error) => {
            clearTimeout(timeout)
            reject(err)
          }
        })
      })
      
      this.log(`✓ Connected! Block #${(firstBlock as any).number}`, 'success')

      const connectionTime = Date.now() - startTime
      this.updateMetric('smoldot', 'connectionTime', connectionTime)
      this.updateMetric('smoldot', 'blockHeight', (firstBlock as any).number)
      this.updateStatus('smoldot', 'connected')

      // Start monitoring
      this.startMonitoring('smoldot')

    } catch (error) {
      this.log(`❌ Smoldot connection failed: ${error instanceof Error ? error.message : 'Unknown error'}`, 'error')
      this.updateStatus('smoldot', 'disconnected')
      this.smoldotClient = null
    }
  }

  async connectWSS(): Promise<void> {
    // Prevent multiple connections
    if (this.wssClient) {
      this.log('Already connected to WSS', 'info')
      return
    }

    this.updateStatus('wss', 'connecting')
    this.log('Starting WSS connection...', 'wss')

    const startTime = Date.now()

    try {
      // Create client with WSS provider
      this.log('🔧 Creating WSS provider...', 'wss')
      this.wssClient = createClient(
        getWsProvider('wss://rpc.polkadot.io')
      )
      this.log('✓ WSS provider created', 'wss')

      // Test connection - subscribe to get first finalized block
      this.log('🔍 Testing connection...', 'wss')
      
      // Wait for first block using Promise wrapper
      const firstBlock = await new Promise((resolve, reject) => {
        const timeout = setTimeout(() => reject(new Error('Connection timeout')), 30000)
        const subscription = this.wssClient.finalizedBlock$.subscribe({
          next: (block: any) => {
            clearTimeout(timeout)
            subscription.unsubscribe()
            resolve(block)
          },
          error: (err: Error) => {
            clearTimeout(timeout)
            reject(err)
          }
        })
      })

      this.log(`✓ Connected! Block #${(firstBlock as any).number}`, 'success')

      const connectionTime = Date.now() - startTime
      this.updateMetric('wss', 'connectionTime', connectionTime)
      this.updateMetric('wss', 'blockHeight', (firstBlock as any).number)
      this.updateStatus('wss', 'connected')

      // Start monitoring
      this.startMonitoring('wss')

    } catch (error) {
      this.log(`❌ WSS connection failed: ${error instanceof Error ? error.message : 'Unknown error'}`, 'error')
      this.updateStatus('wss', 'disconnected')
      this.wssClient = null
    }
  }

  private async startMonitoring(provider: 'smoldot' | 'wss'): Promise<void> {
    const client = provider === 'smoldot' ? this.smoldotClient : this.wssClient
    
    if (!client) return

    // Clear existing interval if any
    if (this.monitoringIntervals[provider]) {
      clearInterval(this.monitoringIntervals[provider])
    }

    this.log(`📊 Starting ${provider.toUpperCase()} monitoring...`, 'info')

    // Subscribe to new blocks for continuous updates
    try {
      client.finalizedBlock$.subscribe({
        next: (block: any) => {
          this.updateMetric(provider, 'blockHeight', block.number)
        },
        error: (err: Error) => {
          this.log(`${this.capitalize(provider)} block subscription error: ${err.message}`, 'error')
        }
      })

      // Monitor latency periodically
      this.monitoringIntervals[provider] = setInterval(async () => {
        try {
          const start = Date.now()
          
          // Get single block value for latency test
          await new Promise((resolve, reject) => {
            const timeout = setTimeout(() => reject(new Error('Latency test timeout')), 5000)
            const subscription = client.finalizedBlock$.subscribe({
              next: (block: any) => {
                clearTimeout(timeout)
                subscription.unsubscribe()
                resolve(block)
              },
              error: (err: Error) => {
                clearTimeout(timeout)
                reject(err)
              }
            })
          })
          
          const latency = Date.now() - start
          this.updateMetric(provider, 'latency', latency)
        } catch (error) {
          // Silently handle monitoring errors to avoid spam
          console.warn(`${provider} latency check failed:`, error)
        }
      }, 5000) // Check every 5 seconds

    } catch (error) {
      this.log(`${this.capitalize(provider)} monitoring setup failed`, 'error')
    }
  }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  console.log('🚀 PAPI Day 3: Provider Playground initialized!')
  console.log('=============================================')
  console.log('Testing both Smoldot and WSS providers...')
  console.log('Smoldot: Light-client, decentralized, browser-based')
  console.log('WSS: WebSocket, fast, centralized endpoint')
  console.log('=============================================')
  
  new ProviderPlayground()
})

// Export for potential module usage
export { ProviderPlayground }