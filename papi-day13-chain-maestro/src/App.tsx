// src/App.tsx
import React from 'react';
import { SymphonyBackground } from './components/SymphonyBackground';
import { ChainOrchestrator } from './components/ChainOrchestrator';
import { useMultiChain } from './hooks/useMultiChain';
import { 
  Music, 
  Github, 
  Twitter, 
  Zap,
  Layers,
  Globe
} from 'lucide-react';
import { getChainColor, getChainIcon } from './utils/chainConfig';
import { calculateHealthScore, formatLatency, getHealthIcon } from './utils/metricsCalculator';

function App() {
  const { connections, isInitializing } = useMultiChain();

  return (
    <div className="min-h-screen bg-dark-stage text-white relative overflow-hidden">
      <SymphonyBackground />
      
      <header className="container mx-auto px-4 py-6 relative z-10">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Music className="w-10 h-10 text-accent-orchestra animate-float-orchestra" />
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-success-maestro rounded-full animate-pulse"></div>
            </div>
            <div>
              <h1 className="text-3xl font-bold maestro-text">
                PAPI Chain Maestro
              </h1>
              <p className="text-gray-400 mt-1">Day 13: Multi-Chain Mastery • #PAPI30Days</p>
            </div>
          </div>
          
          <div className="flex space-x-4">
            <a 
              href="https://github.com/polkadot-api" 
              target="_blank" 
              rel="noopener noreferrer"
              className="p-2 rounded-lg bg-card-console hover:bg-border-stage transition-colors"
              title="PAPI GitHub"
            >
              <Github className="w-5 h-5" />
            </a>
            <a 
              href="https://twitter.com/hashtag/PAPI30Days" 
              target="_blank" 
              rel="noopener noreferrer"
              className="p-2 rounded-lg bg-card-console hover:bg-border-stage transition-colors"
              title="#PAPI30Days"
            >
              <Twitter className="w-5 h-5" />
            </a>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 pb-12 relative z-10">
        <div className="mb-8 console-card p-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3">
              <div className="flex items-center justify-center space-x-2">
                <Globe className="w-5 h-5 text-polkadot-purple" />
                <p className="text-2xl font-bold text-white">
                  {Object.keys(connections).length}
                </p>
              </div>
              <p className="text-sm text-gray-400 mt-1">Chains Connected</p>
            </div>
            
            <div className="text-center p-3">
              <div className="flex items-center justify-center">
                <Layers className="w-5 h-5 text-kusama-yellow mr-1" />
                <p className="text-2xl font-bold text-white">
                  {Object.values(connections).reduce((sum, conn) => sum + conn.metrics.blockNumber, 0).toLocaleString()}
                </p>
              </div>
              <p className="text-sm text-gray-400 mt-1">Total Blocks</p>
            </div>
            
            <div className="text-center p-3">
              <div className="flex items-center justify-center">
                <Zap className="w-5 h-5 text-westend-blue mr-1" />
                <p className="text-2xl font-bold text-white">
                  {Object.values(connections).length > 0
                    ? `${Math.round(Object.values(connections).reduce((sum, conn) => sum + conn.metrics.latency, 0) / Object.values(connections).length)}ms`
                    : '0ms'}
                </p>
              </div>
              <p className="text-sm text-gray-400 mt-1">Avg Latency</p>
            </div>
            
            <div className="text-center p-3">
              <div className="flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-success-maestro animate-pulse mr-2"></div>
                <p className="text-2xl font-bold text-white">
                  {isInitializing ? '🔄' : '✅'}
                </p>
              </div>
              <p className="text-sm text-gray-400 mt-1">
                {isInitializing ? 'Initializing' : 'Symphony Ready'}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <div className="lg:col-span-2">
            <ChainOrchestrator />
          </div>

          <div className="console-card p-6">
            <div className="flex items-center space-x-2 mb-4">
              <Zap className="w-5 h-5 text-accent-orchestra" />
              <h3 className="text-xl font-bold text-white">Multi-Chain Insights</h3>
            </div>
            
            <div className="space-y-4">
              <div className="p-4 bg-black/30 rounded border border-border-stage">
                <p className="font-semibold text-white mb-2">🎯 Today's Achievement</p>
                <p className="text-sm text-gray-300">
                  You're conducting multiple blockchain networks simultaneously with PAPI's multi-chain capabilities.
                </p>
              </div>
              
              <div className="p-4 bg-black/30 rounded border border-border-stage">
                <p className="font-semibold text-white mb-2">⚡ PAPI Magic</p>
                <p className="text-sm text-gray-300">
                  Same API, different chains. PAPI descriptors make multi-chain development feel like single-chain development.
                </p>
              </div>
              
              <div className="p-4 bg-black/30 rounded border border-border-stage">
                <p className="font-semibold text-white mb-2">🔗 Chain Comparison</p>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Polkadot:</span>
                    <span className="text-white">Stability & Security</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Kusama:</span>
                    <span className="text-white">Speed & Experimentation</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Westend:</span>
                    <span className="text-white">Testing & Development</span>
                  </div>
                </div>
              </div>
              
              <div className="p-4 bg-gradient-to-r from-accent-orchestra/10 to-success-maestro/10 rounded border border-accent-orchestra/30">
                <p className="font-bold text-white mb-2">🎼 Symphony Status</p>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-300">Active Chains</p>
                    <p className="text-2xl font-bold text-white">
                      {Object.keys(connections).length}/3
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-300">Health</p>
                    <p className="text-xl font-bold text-success-maestro">
                      {Object.values(connections).length > 0 ? 'Excellent' : 'Starting...'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="console-card p-6">
          <h3 className="text-xl font-bold text-white mb-6">Chain Performance Dashboard</h3>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border-stage">
                  <th className="text-left py-3 px-4 text-gray-400 font-medium">Chain</th>
                  <th className="text-left py-3 px-4 text-gray-400 font-medium">Status</th>
                  <th className="text-left py-3 px-4 text-gray-400 font-medium">Block #</th>
                  <th className="text-left py-3 px-4 text-gray-400 font-medium">Version</th>
                  <th className="text-left py-3 px-4 text-gray-400 font-medium">Validators</th>
                  <th className="text-left py-3 px-4 text-gray-400 font-medium">Latency</th>
                  <th className="text-left py-3 px-4 text-gray-400 font-medium">Health</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(connections).map(([chainId, connection]) => (
                  <tr key={chainId} className="border-b border-border-stage/30 hover:bg-black/20">
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-2">
                        <span className="text-xl">{getChainIcon(chainId)}</span>
                        <div>
                          <p className="font-medium text-white capitalize">{chainId}</p>
                          <p className="text-xs text-gray-400">{connection.metrics.blockHash.substring(0, 16)}...</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center">
                        <div className={`status-indicator ${
                          connection.metrics.status === 'connected' 
                            ? 'connected-status' 
                            : connection.metrics.status === 'connecting'
                            ? 'connecting-status'
                            : 'disconnected-status'
                        }`} />
                        <span className="capitalize text-white">{connection.metrics.status}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <p className="font-mono text-white">#{connection.metrics.blockNumber.toLocaleString()}</p>
                    </td>
                    <td className="py-3 px-4">
                      <p className="text-white">v{connection.metrics.specVersion}</p>
                    </td>
                    <td className="py-3 px-4">
                      <p className="text-white">{connection.metrics.validatorCount}</p>
                    </td>
                    <td className="py-3 px-4">
                      <p className="text-white">{formatLatency(connection.metrics.latency)}</p>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-2">
                        <span>{getHealthIcon(calculateHealthScore(connection.metrics))}</span>
                        <span className="text-white">{calculateHealthScore(connection.metrics)}%</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {Object.keys(connections).length === 0 && !isInitializing && (
            <div className="text-center py-8">
              <p className="text-gray-500">No chains connected. Use the orchestrator to connect chains.</p>
            </div>
          )}
          
          {isInitializing && (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent-orchestra mx-auto mb-3"></div>
              <p className="text-gray-400">Initializing multi-chain connections...</p>
            </div>
          )}
        </div>

        <footer className="mt-12 pt-8 border-t border-border-stage text-center text-gray-500 text-sm">
          <p>
            Built with ❤️ by Dvyne for #PAPI30Days Campaign • Day 13: Multi-Chain Mastery • 
            <span className="text-accent-orchestra ml-2">"Because one chain is never enough 🌉"</span>
          </p>
          <p className="mt-2">
            Simultaneous connections to Polkadot, Kusama, and Westend • Fully TypeScript compliant • 
            <a 
              href="https://github.com/polkadot-api/polkadot-api" 
              className="text-accent-orchestra hover:text-purple-300 ml-1"
              target="_blank"
              rel="noopener noreferrer"
            >
              View Documentation
            </a>
          </p>
        </footer>
      </main>
    </div>
  );
}

export default App;