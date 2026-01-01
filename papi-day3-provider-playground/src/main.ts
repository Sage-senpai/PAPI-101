// src/main.ts
import { createClient } from 'polkadot-api'
import { getSmProvider } from 'polkadot-api/sm-provider'
import { getWsProvider } from 'polkadot-api/ws-provider'
import { dot } from '@polkadot-api/descriptors'
import { chainSpec } from 'polkadot-api/chains/polkadot'
import { startFromWorker } from 'polkadot-api/smoldot/from-worker'
import SmWorker from 'polkadot-api/smoldot/worker?worker'

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
  private dotApi: any = null
  private stats: ProviderStats = {
    smoldot: { latency: 0, blockHeight: 0, connectionTime: 0 },
    wss: { latency: 0, blockHeight: 0, connectionTime: 0 }
  }

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
      metricElement.textContent = metric === 'latency' ? `${value}ms` : value.toString()
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
      consoleContent.innerHTML = '<div class="log-entry"><span class="log-time">[10:30:00]</span><span class="log-text">Log cleared. Ready for new connections.</span></div>'
    }
  }

  private capitalize(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1)
  }

  async connectSmoldot(): Promise<void> {
    this.updateStatus('smoldot', 'connecting')
    this.log('Starting Smoldot connection...', 'smoldot')

    const startTime = Date.now()

    try {
      // Initialize Smoldot worker
      const worker = new SmWorker()
      const smoldot = startFromWorker(worker)
      
      this.log('Smoldot worker initialized', 'smoldot')

      // Add Polkadot chain
      const chain = await smoldot.addChain({ chainSpec })
      this.log('Polkadot chain added to Smoldot', 'smoldot')

      // Create client with Smoldot provider
      const client = createClient(getSmProvider(chain))
      this.log('PAPI client created with Smoldot provider', 'smoldot')

      // Get typed API
      this.dotApi = client.getTypedApi(dot)
      this.log('Typed API obtained. Testing connection...', 'smoldot')

      // Test connection by getting chain version
      const version = await this.dotApi.constants.System.Version()
      this.log(`Connected! Chain version: ${version.specVersion}`, 'success')

      const connectionTime = Date.now() - startTime
      this.updateMetric('smoldot', 'connectionTime', connectionTime)
      this.updateStatus('smoldot', 'connected')

      // Start monitoring
      this.startMonitoring('smoldot')

    } catch (error) {
      this.log(`Smoldot connection failed: ${error instanceof Error ? error.message : 'Unknown error'}`, 'error')
      this.updateStatus('smoldot', 'disconnected')
    }
  }

  async connectWSS(): Promise<void> {
    this.updateStatus('wss', 'connecting')
    this.log('Starting WSS connection...', 'wss')

    const startTime = Date.now()

    try {
      // Create client with WSS provider
      const client = createClient(
        getWsProvider('wss://rpc.polkadot.io')
      )
      this.log('PAPI client created with WSS provider', 'wss')

      // Get typed API
      this.dotApi = client.getTypedApi(dot)
      this.log('Typed API obtained. Testing connection...', 'wss')

      // Test connection by getting chain version
      const version = await this.dotApi.constants.System.Version()
      this.log(`Connected! Chain version: ${version.specVersion}`, 'success')

      const connectionTime = Date.now() - startTime
      this.updateMetric('wss', 'connectionTime', connectionTime)
      this.updateStatus('wss', 'connected')

      // Start monitoring
      this.startMonitoring('wss')

    } catch (error) {
      this.log(`WSS connection failed: ${error instanceof Error ? error.message : 'Unknown error'}`, 'error')
      this.updateStatus('wss', 'disconnected')
    }
  }

  private async startMonitoring(provider: 'smoldot' | 'wss'): Promise<void> {
    // Monitor latency
    setInterval(async () => {
      try {
        const start = Date.now()
        await this.dotApi.constants.System.Version()
        const latency = Date.now() - start
        
        this.updateMetric(provider, 'latency', latency)
        
        // Update block height periodically
        if (Math.random() < 0.2) { // 20% chance each interval
          const header = await this.dotApi.query.System.Header.getValue()
          this.updateMetric(provider, 'blockHeight', header.number)
        }
      } catch (error) {
        this.log(`${this.capitalize(provider)} monitoring error`, 'error')
      }
    }, 2000)
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