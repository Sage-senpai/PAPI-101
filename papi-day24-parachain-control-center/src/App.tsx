import React, { useState, useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import { ChainDashboard }      from './components/ChainDashboard';
import { CrossChainCompare }   from './components/CrossChainCompare';
import { NetworkGraph }        from './components/NetworkGraph';
import { AlertPanel }          from './components/AlertPanel';
import { ChainSelector }       from './components/ChainSelector';
import { CHAINS }              from './services/chainRegistry';
import { Globe, Zap, Network, Cpu, Rocket, Shield, BarChart3 } from 'lucide-react';

function App() {
  const [selectedChains, setSelectedChains] = useState<string[]>([
    'polkadot', 'kusama', 'astar',
  ]);
  const [isMonitoring]         = useState(true);
  const [crossChainEvents, setCrossChainEvents] = useState(0);

  /* ── console banner + live event counter ── */
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
      const c = CHAINS.find(ch => ch.id === id);
      console.log(`   • ${c?.icon} ${c?.name}`);
    });
    console.log('');

    const interval = setInterval(() => {
      setCrossChainEvents(prev => {
        const next = prev + 1;
        if (next % 5 === 0) console.log(`📈 Cross-chain sync event #${next}`);
        return next;
      });
    }, 4000);

    return () => clearInterval(interval);
  }, [selectedChains]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-100">
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#1f2937',
            color:      '#f9fafb',
            border:     '1px solid #374151',
          },
        }}
      />

      {/* ──────────── HEADER ──────────── */}
      <header className="border-b border-gray-700/50 bg-gray-900/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            {/* logo + title */}
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-[#E6007A] via-[#0085FF] to-[#5A4FCF] rounded-full blur opacity-30" />
                <Globe className="w-9 h-9 text-white relative" style={{ animation: 'pulseChain 2s infinite' }} />
              </div>
              <div>
                <h1
                  className="text-2xl font-bold"
                  style={{
                    background: 'linear-gradient(90deg, #E6007A, #0085FF, #5A4FCF)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  Parachain Control Center
                </h1>
                <p className="text-gray-400 text-sm">Day 24 · Mastering Cross-Chain with PAPI</p>
              </div>
            </div>

            {/* status pills */}
            <div className="flex items-center space-x-5">
              <div className="flex items-center space-x-2">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500" />
                </span>
                <span className="text-sm">{selectedChains.length} chains live</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <Zap className="w-4 h-4 text-yellow-400" />
                <span className="text-sm">{crossChainEvents} sync events</span>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-500/15 text-green-400 border border-green-500/30">
                MONITORING
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* ──────────── MAIN ──────────── */}
      <main className="max-w-7xl mx-auto px-4 py-8">

        {/* ── Hero banner ── */}
        <section className="mb-10" style={{ animation: 'slideInChain 0.5s ease-out both' }}>
          <div
            className="rounded-2xl p-8 border border-gray-700/50 backdrop-blur-sm"
            style={{
              background: 'linear-gradient(135deg, rgba(31,41,55,0.5), rgba(17,24,39,0.6))',
              animation: 'crossChainGlow 4s infinite alternate',
            }}
          >
            <div className="grid md:grid-cols-2 gap-8 items-center">
              {/* left copy */}
              <div>
                <h2 className="text-3xl font-bold mb-4">Unified Control Across Ecosystems</h2>
                <p className="text-gray-300 mb-6 text-base leading-relaxed">
                  Experience the power of PAPI multi-chain in action. Monitor relay chains and
                  parachains simultaneously, compare metrics, and visualise the interconnected
                  Polkadot network — all from one dashboard.
                </p>
                <div className="flex flex-wrap gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Network className="w-4 h-4 text-sky-400" />
                    <span>Live multi-chain data</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Cpu className="w-4 h-4 text-green-400" />
                    <span>Type-safe across chains</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-yellow-400" />
                    <span>Cross-chain insights</span>
                  </div>
                </div>
              </div>

              {/* right stats box */}
              <div className="bg-gray-900/50 rounded-xl p-6 border border-gray-700">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <Rocket className="w-4 h-4" />
                  Network Overview
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: 'Chains Available',  value: CHAINS.length,          color: '#E6007A' },
                    { label: 'Active Monitoring',  value: selectedChains.length,  color: '#c8c8c8' },
                    { label: 'Sync Events',        value: crossChainEvents,       color: '#0085FF' },
                    { label: 'Update Frequency',   value: 'Real-time',            color: '#5A4FCF' },
                  ].map(({ label, value, color }) => (
                    <div key={label} className="bg-gray-800/50 rounded-lg p-3 text-center">
                      <div className="text-xl font-bold" style={{ color }}>{value}</div>
                      <div className="text-xs text-gray-400 mt-0.5">{label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Chain selector ── */}
        <section className="mb-8">
          <h3 className="text-lg font-semibold flex items-center gap-2 mb-4">
            <BarChart3 className="w-5 h-5" />
            Choose Your Chains
          </h3>
          <ChainSelector
            chains={CHAINS}
            selectedChains={selectedChains}
            onSelectionChange={setSelectedChains}
          />
        </section>

        {/* ── Main 2/3 + sidebar 1/3 ── */}
        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2">
            <ChainDashboard selectedChains={selectedChains} isMonitoring={isMonitoring} />
          </div>

          <div className="space-y-6">
            <AlertPanel selectedChains={selectedChains} />

            {/* PAPI power card */}
            <div className="bg-gray-800/30 rounded-xl p-5 border border-gray-700">
              <h3 className="text-base font-semibold mb-3">PAPI Multi-Chain Power</h3>
              <div className="space-y-3">
                {[
                  ['Unified Interface',    'Same code, same types, multiple chains — PAPI makes it effortless.'],
                  ['Efficient Connections','Optimised WebSocket management shared across chains.'],
                  ['Runtime Safety',       'Metadata-driven types prevent runtime surprises.'],
                ].map(([title, desc]) => (
                  <div key={title} className="p-3 bg-gray-900/50 rounded-lg">
                    <h4 className="text-sm font-medium mb-1">{title}</h4>
                    <p className="text-xs text-gray-400">{desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── Cross-chain comparison ── */}
        <section className="mb-8">
          <CrossChainCompare selectedChains={selectedChains} />
        </section>

        {/* ── Network graph ── */}
        <section className="mb-8">
          <NetworkGraph selectedChains={selectedChains} />
        </section>
      </main>

      {/* ──────────── FOOTER ──────────── */}
      <footer className="border-t border-gray-800/50 mt-4">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <h3 className="font-semibold mb-3">Cross-Chain Excellence</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                PAPI enables seamless multi-chain dApps, bringing the full Polkadot ecosystem
                to your fingertips with one unified API.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-3">Featured Chains</h3>
              <div className="flex flex-wrap gap-2">
                {CHAINS.map(chain => (
                  <span
                    key={chain.id}
                    className="px-3 py-0.5 rounded-full text-xs font-medium"
                    style={{
                      backgroundColor: `${chain.color}18`,
                      color:           chain.color,
                      border:          `1px solid ${chain.color}35`,
                    }}
                  >
                    {chain.name}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-3">Resources</h3>
              <div className="space-y-2 text-sm">
                <a
                  href="https://papi.how/recipes/connect-to-multiple-chains"
                  className="text-sky-400 hover:text-sky-300 transition-colors block"
                  target="_blank" rel="noopener noreferrer"
                >
                  PAPI Multi-Chain Guide →
                </a>
                <a
                  href="https://wiki.polkadot.network/docs/learn-parachains"
                  className="text-sky-400 hover:text-sky-300 transition-colors block"
                  target="_blank" rel="noopener noreferrer"
                >
                  Polkadot Parachains Overview →
                </a>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800/50 mt-8 pt-6 text-center text-gray-600 text-xs">
            Parachain Control Center · Day 24/30 #PAPI30Days · Unlocking the multi-chain future 🌉
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;