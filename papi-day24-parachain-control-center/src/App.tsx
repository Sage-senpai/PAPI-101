import React, { useState, useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import { ChainDashboard } from './components/ChainDashboard';
import { CrossChainCompare } from './components/CrossChainCompare';
import { NetworkGraph } from './components/NetworkGraph';
import { AlertPanel } from './components/AlertPanel';
import { ChainSelector } from './components/ChainSelector';
import { CHAINS } from './services/chainRegistry';
import { Globe, Zap, Cpu, Network, Rocket, Shield, BarChart3 } from 'lucide-react';
import './styles/globals.css';
import './styles/chainAnimations.css';

function App() {
  const [selectedChains, setSelectedChains] = useState<string[]>(['polkadot', 'kusama', 'astar']);
  const [isMonitoring, setIsMonitoring] = useState<boolean>(true);
  const [connectedChains, setConnectedChains] = useState<number>(selectedChains.length);
  const [crossChainEvents, setCrossChainEvents] = useState<number>(0);

  useEffect(() => {
    console.log('===========================================');
    console.log('🌉 PARACHAIN CONTROL CENTER INITIALIZED');
    console.log('===========================================');
    console.log('🎯 Multi-Chain Dashboard Powered by PAPI');
    console.log('🔗 Monitor multiple parachains simultaneously');
    console.log('⚡ Real-time cross-chain comparisons');
    console.log('📊 Network visualization and analytics');
    console.log('===========================================');
    console.log('');
    console.log('💡 Active chains:');
    selectedChains.forEach(id => {
      const chain = CHAINS.find(c => c.id === id);
      console.log(`   • ${chain?.icon} ${chain?.name}`);
    });
    console.log('');

    const eventInterval = setInterval(() => {
      setCrossChainEvents(prev => prev + 1);
      if (crossChainEvents % 5 === 0) {
        console.log(`📈 Cross-chain sync event #${crossChainEvents + 1}`);
      }
    }, 4000);

    return () => clearInterval(eventInterval);
  }, [selectedChains]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-100">
      <Toaster position="top-right" />
      
      <header className="border-b border-gray-700/50 bg-gray-900/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center space-x-4">
              <Globe className="w-10 h-10 text-white animate-pulse-chain" />
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-chain-polkadot via-chain-kusama to-chain-astar bg-clip-text text-transparent">
                  Parachain Control Center
                </h1>
                <p className="text-gray-400">Day 24: Mastering Cross-Chain with PAPI</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-status-online rounded-full animate-ping"></div>
                <span className="text-sm">{connectedChains} chains live</span>
              </div>
              <div className="flex items-center space-x-2">
                <Zap className="w-5 h-5 text-yellow-500" />
                <span className="text-sm">{crossChainEvents} sync events</span>
              </div>
              <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                isMonitoring ? 'bg-status-online/20 text-status-online' : 'bg-status-offline/20 text-status-offline'
              }`}>
                {isMonitoring ? 'MONITORING' : 'PAUSED'}
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-10 animate-slide-in-chain">
          <div className="bg-gradient-to-r from-gray-800/30 to-gray-900/30 rounded-2xl p-8 border border-gray-700/50 backdrop-blur-sm animate-cross-chain-glow">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="text-3xl font-bold mb-4">Unified Control Across Ecosystems</h2>
                <p className="text-gray-300 mb-6 text-lg">
                  Experience the power of PAPI multi-chain in action. Monitor relay chains and parachains simultaneously, compare metrics, and visualize the interconnected Polkadot network.
                </p>
                <div className="flex flex-wrap gap-4">
                  <div className="flex items-center space-x-2">
                    <Network className="w-5 h-5 text-primary-500" />
                    <span>Live multi-chain data</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Cpu className="w-5 h-5 text-green-500" />
                    <span>Type-safe across chains</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Shield className="w-5 h-5 text-yellow-500" />
                    <span>Cross-chain insights</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-900/50 rounded-xl p-6 border border-gray-700">
                <h3 className="font-semibold mb-4 flex items-center space-x-2">
                  <Rocket className="w-5 h-5" />
                  <span>Network Overview</span>
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-gray-800/50 rounded-lg">
                    <div className="text-2xl font-bold text-chain-polkadot">{CHAINS.length}</div>
                    <div className="text-sm text-gray-400">Chains Available</div>
                  </div>
                  <div className="text-center p-4 bg-gray-800/50 rounded-lg">
                    <div className="text-2xl font-bold text-chain-kusama">{selectedChains.length}</div>
                    <div className="text-sm text-gray-400">Active Monitoring</div>
                  </div>
                  <div className="text-center p-4 bg-gray-800/50 rounded-lg">
                    <div className="text-2xl font-bold text-chain-astar">{crossChainEvents}</div>
                    <div className="text-sm text-gray-400">Sync Events</div>
                  </div>
                  <div className="text-center p-4 bg-gray-800/50 rounded-lg">
                    <div className="text-2xl font-bold text-chain-moonbeam">Real-time</div>
                    <div className="text-sm text-gray-400">Update Frequency</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold flex items-center space-x-2">
              <BarChart3 className="w-5 h-5" />
              <span>Choose Your Chains</span>
            </h3>
          </div>
          <ChainSelector
            chains={CHAINS}
            selectedChains={selectedChains}
            onSelectionChange={setSelectedChains}
          />
        </div>

        <div className="grid lg:grid-cols-3 gap-8 mb-8">
          <div className="lg:col-span-2">
            <ChainDashboard
              selectedChains={selectedChains}
              isMonitoring={isMonitoring}
            />
          </div>

          <div className="space-y-8">
            <AlertPanel selectedChains={selectedChains} />
            
            <div className="bg-gray-800/30 rounded-xl p-6 border border-gray-700">
              <h3 className="text-xl font-semibold mb-4">PAPI Multi-Chain Power</h3>
              <div className="space-y-4">
                <div className="p-4 bg-gray-900/50 rounded-lg">
                  <h4 className="font-medium mb-2">Unified Interface</h4>
                  <p className="text-sm text-gray-400">
                    Same code, same types, multiple chains – PAPI makes it effortless
                  </p>
                </div>
                <div className="p-4 bg-gray-900/50 rounded-lg">
                  <h4 className="font-medium mb-2">Efficient Connections</h4>
                  <p className="text-sm text-gray-400">
                    Optimized WebSocket management across chains
                  </p>
                </div>
                <div className="p-4 bg-gray-900/50 rounded-lg">
                  <h4 className="font-medium mb-2">Runtime Safety</h4>
                  <p className="text-sm text-gray-400">
                    Metadata-driven types prevent runtime surprises
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-8">
          <CrossChainCompare selectedChains={selectedChains} />
        </div>

        <div className="mb-8">
          <NetworkGraph selectedChains={selectedChains} />
        </div>
      </main>

      <footer className="border-t border-gray-800/50 mt-12">
        <div className="container mx-auto px-6 py-8">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <h3 className="font-semibold mb-4">Cross-Chain Excellence</h3>
              <p className="text-gray-400 text-sm">
                Experience how PAPI enables seamless multi-chain dApps, bringing the full Polkadot ecosystem to your fingertips.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Featured Chains</h3>
              <div className="flex flex-wrap gap-2">
                {CHAINS.map(chain => (
                  <span
                    key={chain.id}
                    className="px-3 py-1 rounded-full text-sm"
                    style={{
                      backgroundColor: `${chain.color}20`,
                      color: chain.color,
                      border: `1px solid ${chain.color}40`,
                    }}
                  >
                    {chain.name}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Resources</h3>
              <div className="space-y-2 text-sm">
                <a 
                  href="https://papi.how/recipes/connect-to-multiple-chains"
                  className="text-primary-400 hover:text-primary-300 block"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  PAPI Multi-Chain Guide
                </a>
                <a 
                  href="https://wiki.polkadot.network/docs/learn-parachains"
                  className="text-primary-400 hover:text-primary-300 block"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Polkadot Parachains Overview
                </a>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800/50 mt-8 pt-8 text-center text-gray-500 text-sm">
            <p>Parachain Control Center • Day 24/30 #PAPI30Days • Unlocking the multi-chain future 🌉</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;