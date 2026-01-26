import React, { useState, useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import { ChainHeader } from './components/ChainHeader';
import { ConstantsGrid } from './components/ConstantsGrid';
import { SearchFilter } from './components/SearchFilter';
import { LoadingSpinner } from './components/LoadingSpinner';
import { useChainConstants } from './hooks/useChainConstants';
import { useConstantsFilter } from './hooks/useConstantsFilters';
import { FilterState } from './types/constants';
import { Database, Cpu, Shield, Zap, Code, Rocket } from 'lucide-react';

function App() {
  const [filterState, setFilterState] = useState<FilterState>({
    search: '',
    category: null,
    importance: null,
    chain: null,
  });

  const { constants, isLoading, error, refresh } = useChainConstants();
  const filteredConstants = useConstantsFilter(constants, filterState);

  useEffect(() => {
    console.log('🚀 Chain Constants Explorer dApp Initialized');
    console.log('✨ PAPI + React = dApp Magic');
  }, []);

  useEffect(() => {
    if (constants.length > 0) {
      console.log(`✅ Loaded ${constants.length} chain constants`);
    }
  }, [constants]);

  if (error) {
    console.error('❌ Error loading constants:', error);
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 text-gray-100 flex items-center justify-center p-6">
        <div className="text-center max-w-md">
          <Shield className="w-16 h-16 text-danger-500 mx-auto mb-4 animate-pulse" />
          <h1 className="text-2xl font-bold mb-2">Connection Error</h1>
          <p className="text-gray-400 mb-4">Failed to connect to the blockchain. Please check your connection and try again.</p>
          <button
            onClick={refresh}
            className="px-6 py-3 bg-primary-600 hover:bg-primary-700 rounded-lg font-medium transition-all hover:scale-105"
          >
            Retry Connection
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 text-gray-100">
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#1f2937',
            color: '#f9fafb',
            border: '1px solid #374151',
          },
          duration: 3000,
        }}
      />

      <ChainHeader
        constantsCount={constants.length}
        filteredCount={filteredConstants.length}
        isLoading={isLoading}
        onRefresh={refresh}
      />

      <main className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Hero Section */}
        <div className="mb-10 animate-fade-in">
          <div className="bg-gradient-to-r from-gray-800/30 to-gray-900/30 rounded-2xl p-8 border border-gray-700/50 backdrop-blur-sm shadow-2xl">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-primary-400 via-cyan-400 to-primary-500 bg-clip-text text-transparent animate-float">
                  Chain Constants Explorer
                </h1>
                <p className="text-gray-300 mb-6 text-lg leading-relaxed">
                  Explore Polkadot runtime constants with type-safe PAPI integration and beautiful React components.
                </p>
                <div className="flex flex-wrap gap-4">
                  <div className="flex items-center space-x-2 bg-gray-800/50 px-3 py-2 rounded-lg border border-gray-700">
                    <Code className="w-5 h-5 text-primary-500" />
                    <span className="text-sm font-medium">TypeScript</span>
                  </div>
                  <div className="flex items-center space-x-2 bg-gray-800/50 px-3 py-2 rounded-lg border border-gray-700">
                    <Zap className="w-5 h-5 text-yellow-500" />
                    <span className="text-sm font-medium">Real-time</span>
                  </div>
                  <div className="flex items-center space-x-2 bg-gray-800/50 px-3 py-2 rounded-lg border border-gray-700">
                    <Shield className="w-5 h-5 text-green-500" />
                    <span className="text-sm font-medium">Type-safe</span>
                  </div>
                </div>
              </div>

              <div className="bg-gray-900/50 rounded-xl p-6 border border-gray-700 shadow-lg">
                <h3 className="font-semibold mb-4 flex items-center space-x-2">
                  <Rocket className="w-5 h-5 text-primary-500" />
                  <span>dApp Architecture</span>
                </h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between items-center p-2 rounded-lg hover:bg-gray-800/50 transition-colors">
                    <span className="text-gray-400">Frontend:</span>
                    <span className="font-medium">React + TypeScript</span>
                  </div>
                  <div className="flex justify-between items-center p-2 rounded-lg hover:bg-gray-800/50 transition-colors">
                    <span className="text-gray-400">Blockchain:</span>
                    <span className="font-medium">PAPI + Polkadot</span>
                  </div>
                  <div className="flex justify-between items-center p-2 rounded-lg hover:bg-gray-800/50 transition-colors">
                    <span className="text-gray-400">Styling:</span>
                    <span className="font-medium">Tailwind CSS</span>
                  </div>
                  <div className="flex justify-between items-center p-2 rounded-lg hover:bg-gray-800/50 transition-colors">
                    <span className="text-gray-400">Build Tool:</span>
                    <span className="font-medium">Vite</span>
                  </div>
                  <div className="pt-3 border-t border-gray-700">
                    <div className="text-xs text-gray-500 mb-1">Live from chain</div>
                    <div className="font-mono text-sm font-semibold text-primary-400">
                      {constants.length} constants loaded
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Search Filter */}
        <div className="mb-8 animate-slide-up">
          <SearchFilter
            filterState={filterState}
            onFilterChange={setFilterState}
            constants={constants}
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3">
            {isLoading ? (
              <LoadingSpinner />
            ) : (
              <ConstantsGrid constants={filteredConstants} />
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Stats Card */}
            <div className="bg-gray-800/30 rounded-xl p-6 border border-gray-700 backdrop-blur-sm shadow-lg">
              <h3 className="font-semibold mb-4 flex items-center space-x-2">
                <Database className="w-5 h-5 text-primary-500" />
                <span>Constants Stats</span>
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-2 rounded-lg hover:bg-gray-700/30 transition-colors">
                  <span className="text-gray-400">Total</span>
                  <span className="font-bold text-lg text-primary-400">{constants.length}</span>
                </div>
                <div className="flex justify-between items-center p-2 rounded-lg hover:bg-gray-700/30 transition-colors">
                  <span className="text-gray-400">Filtered</span>
                  <span className="font-bold text-lg text-cyan-400">{filteredConstants.length}</span>
                </div>
                <div className="flex justify-between items-center p-2 rounded-lg hover:bg-gray-700/30 transition-colors">
                  <span className="text-gray-400">Categories</span>
                  <span className="font-bold text-lg text-green-400">
                    {Array.from(new Set(constants.map(c => c.category))).length}
                  </span>
                </div>
                <div className="pt-3 border-t border-gray-700">
                  <div className="text-xs text-gray-500 mb-2 uppercase tracking-wide">Quick Actions</div>
                  <div className="space-y-2">
                    <button
                      onClick={() => setFilterState({ search: '', category: null, importance: null, chain: null })}
                      className="w-full text-sm px-3 py-2 bg-gray-700/50 hover:bg-gray-700 rounded-lg transition-all hover:scale-105"
                    >
                      Clear Filters
                    </button>
                    <button
                      onClick={refresh}
                      className="w-full text-sm px-3 py-2 bg-primary-600/20 hover:bg-primary-600/30 text-primary-400 rounded-lg transition-all hover:scale-105"
                    >
                      Refresh Data
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Tech Stack Card */}
            <div className="bg-gray-800/30 rounded-xl p-6 border border-gray-700 backdrop-blur-sm shadow-lg">
              <h3 className="font-semibold mb-4 flex items-center space-x-2">
                <Cpu className="w-5 h-5 text-primary-500" />
                <span>Tech Stack</span>
              </h3>
              <div className="space-y-2">
                {[
                  { name: 'React 19', color: 'bg-blue-500/20 text-blue-400 border-blue-500/30' },
                  { name: 'TypeScript', color: 'bg-blue-600/20 text-blue-300 border-blue-500/30' },
                  { name: 'PAPI', color: 'bg-pink-500/20 text-pink-400 border-pink-500/30' },
                  { name: 'Tailwind CSS', color: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30' },
                  { name: 'Vite', color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' },
                  { name: 'Radix UI', color: 'bg-purple-500/20 text-purple-400 border-purple-500/30' },
                ].map((tech) => (
                  <div key={tech.name} className={`px-3 py-2 rounded-lg text-sm font-medium border ${tech.color} hover:scale-105 transition-transform cursor-default`}>
                    {tech.name}
                  </div>
                ))}
              </div>
            </div>

            {/* Console Output Card */}
            <div className="bg-gray-900/50 rounded-xl p-6 border border-gray-700 shadow-lg">
              <h3 className="font-semibold mb-4 flex items-center space-x-2">
                <Code className="w-5 h-5 text-green-500" />
                <span>Console Output</span>
              </h3>
              <div className="bg-black rounded-lg p-4 font-mono text-xs h-64 overflow-y-auto">
                <pre className="text-green-400 leading-relaxed">
{`$ npm run dev
  vite v7.2.4 dev server running at:
  ➜ Local: http://localhost:3004/
  ➜ Network: use --host to expose
  ✅ React + TypeScript + Vite
  ✅ PAPI initialized
  ✅ Tailwind CSS configured
  ✅ Radix UI components loaded
🔗 Connecting to Polkadot...
📡 Using PAPI light client
📦 Fetching runtime constants...
✨ ${constants.length} constants loaded
🎨 UI components rendered
⚡ Ready for production deployment`}
                </pre>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-12 pt-8 border-t border-gray-800/50">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <h4 className="font-semibold mb-4 text-primary-400">About This dApp</h4>
              <p className="text-gray-400 text-sm leading-relaxed">
                A production-ready React dApp demonstrating PAPI integration with type-safe blockchain interactions and modern UI patterns.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-primary-400">Week 4: dApp Development</h4>
              <p className="text-gray-400 text-sm">
                Day 22: Building dApp frontends with PAPI + React
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-primary-400">Learn More</h4>
              <div className="space-y-2 text-sm">
                <a
                  href="https://papi.how/getting-started"
                  className="text-cyan-400 hover:text-cyan-300 block transition-colors hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  PAPI Getting Started →
                </a>
                <a
                  href="https://vitejs.dev/guide/"
                  className="text-cyan-400 hover:text-cyan-300 block transition-colors hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Vite Documentation →
                </a>
              </div>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-800/50 text-center text-gray-500 text-sm">
            <p>Chain Constants Explorer • Day 22/30 #PAPI30Days • PAPI + React = dApp Magic ✨</p>
          </div>
        </footer>
      </main>
    </div>
  );
}

export default App;