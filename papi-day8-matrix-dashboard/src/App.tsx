// src/App.tsx
import { useState } from 'react';
import { MatrixBackground } from './components/MatrixBackground';
import { ConnectionStatus } from './components/ConnectionStatus';
import { ChainInfo } from './components/ChainInfo';
import { usePolkadotAPI } from './hooks/usePolkadotAPI';
import { Zap, Github, Twitter } from 'lucide-react';

function App() {
  const { api, chainInfo, isLoading, error, connect, disconnect } = usePolkadotAPI();
  const [isConnected, setIsConnected] = useState(false);

  const handleConnect = async () => {
    await connect();
    setIsConnected(true);
  };

  const handleDisconnect = () => {
    disconnect();
    setIsConnected(false);
  };

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      <MatrixBackground />
      
      {/* Header */}
      <header className="container mx-auto px-4 py-6 relative z-10">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold matrix-text flex items-center">
              <Zap className="w-6 h-6 md:w-8 md:h-8 mr-2 md:mr-3 text-matrix-green" />
              PAPI Matrix Dashboard
            </h1>
            <p className="text-gray-400 mt-2 text-sm md:text-base">Week 1 Recap - #PAPI30Days Campaign</p>
          </div>
          
          <div className="flex space-x-4">
            <a 
              href="https://github.com/polkadot-api" 
              target="_blank" 
              rel="noopener noreferrer"
              className="p-2 rounded-lg bg-gray-900/50 hover:bg-gray-800 transition-colors"
              title="PAPI GitHub"
            >
              <Github className="w-5 h-5" />
            </a>
            <a 
              href="https://x.com/sage_senpeak" 
              target="_blank" 
              rel="noopener noreferrer"
              className="p-2 rounded-lg bg-gray-900/50 hover:bg-gray-800 transition-colors"
              title="#PAPI30Days"
            >
              <Twitter className="w-5 h-5" />
            </a>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 relative z-10">
        {/* Connection Controls */}
        <div className="mb-8">
          <ConnectionStatus 
            isConnected={isConnected && !!chainInfo}
            isLoading={isLoading}
            error={error}
            chainName={chainInfo?.chainName}
          />
          
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 mt-4">
            <button
              onClick={handleConnect}
              disabled={isLoading || (isConnected && !!chainInfo)}
              className="px-6 py-3 bg-matrix-green text-black font-bold rounded-lg hover:bg-green-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
            >
              {isLoading ? 'Connecting...' : isConnected && chainInfo ? 'Connected 🟢' : 'Connect to Polkadot'}
            </button>
            
            <button
              onClick={handleDisconnect}
              disabled={!isConnected || isLoading}
              className="px-6 py-3 bg-gray-800 text-white font-bold rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Disconnect
            </button>
          </div>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Chain Info */}
          <div className="lg:col-span-2">
            <ChainInfo api={api} chainInfo={chainInfo} />
          </div>

          {/* Week 1 Learnings Panel */}
          <div className="glass-card p-6">
            <h3 className="text-xl font-bold mb-6 text-matrix-green">Week 1 Recap</h3>
            
            <div className="space-y-4">
              <div className="p-4 bg-gray-900/30 rounded-lg">
                <h4 className="font-bold text-blue-400 mb-2">✓ PAPI Installation</h4>
                <p className="text-sm text-gray-400">
                  Lightweight setup with auto-generated types from chain metadata
                </p>
              </div>
              
              <div className="p-4 bg-gray-900/30 rounded-lg">
                <h4 className="font-bold text-purple-400 mb-2">✓ Provider Selection</h4>
                <p className="text-sm text-gray-400">
                  Smoldot for decentralization vs WSS for speed
                </p>
              </div>
              
              <div className="p-4 bg-gray-900/30 rounded-lg">
                <h4 className="font-bold text-green-400 mb-2">✓ TypedApi Mastery</h4>
                <p className="text-sm text-gray-400">
                  Fully typed interfaces for constants, storage, and runtime APIs
                </p>
              </div>
              
              <div className="p-4 bg-gray-900/30 rounded-lg">
                <h4 className="font-bold text-yellow-400 mb-2">✓ Data Reading</h4>
                <p className="text-sm text-gray-400">
                  Three pillars: Constants (truth), Storage (state), Runtime APIs (brain)
                </p>
              </div>
            </div>

            <div className="mt-8 p-4 bg-black/50 rounded-lg border border-matrix-green/20">
              <p className="text-sm text-gray-300">
                <span className="text-matrix-green font-bold">Console Logs:</span> Check browser console for real-time connection logs and data fetching information.
              </p>
              <button
                onClick={() => console.log("🚀 PAPI Matrix Dashboard Active - All systems operational!")}
                className="mt-3 text-xs px-3 py-1 bg-gray-800 rounded hover:bg-gray-700 transition-colors w-full sm:w-auto"
              >
                Test Console Log
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-12 pt-8 border-t border-gray-800 text-center text-gray-500 text-sm">
          <p className="mb-2">
            Built with ❤️ by Dvyne for #PAPI30Days Campaign • Day 8: Week 1 Recap • 
            <span className="text-matrix-green ml-2">"I can see the types now" 🔵</span>
          </p>
          <p>
            All data fetched via Polkadot-API light-client • Fully TypeScript compliant • 
            <a 
              href="https://github.com/Sage-senpai/PAPI-101" 
              className="text-blue-400 hover:text-blue-300 ml-1"
              target="_blank"
              rel="noopener noreferrer"
            >
              View on GitHub
            </a>
          </p>
        </footer>
      </main>
    </div>
  );
}

export default App;