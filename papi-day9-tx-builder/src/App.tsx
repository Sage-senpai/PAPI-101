//src/app
import React, { useState } from 'react';
import { TurboBackground } from './components/TurboBackground';
import { ChainStatus } from './components/ChainStatus';
import { PalletExplorer } from './components/PalletExplorer';
import { TransactionBuilder } from './components/TransactionBuilder';
import { TransactionInspector } from './components/TransactionInspector';
import { usePolkadotAPI } from './hooks/usePolkadotAPI';
import { Send, Github, Twitter, Zap, Sparkles } from 'lucide-react';

function App() {
  const { api, chainInfo, isLoading, error, connect, disconnect } = usePolkadotAPI();
  const [selectedPallet, setSelectedPallet] = useState<string | null>('Balances');
  const [selectedCall, setSelectedCall] = useState<string | null>('transfer_keep_alive');
  const [isConnected, setIsConnected] = useState(false);
  const [lastBuiltTx, setLastBuiltTx] = useState<any>(null);

  const handleConnect = async () => {
    await connect();
    setIsConnected(true);
  };

  const handleDisconnect = () => {
    disconnect();
    setIsConnected(false);
    setSelectedPallet(null);
    setSelectedCall(null);
    setLastBuiltTx(null);
  };

  const handleSelectPallet = (pallet: string, call: string) => {
    setSelectedPallet(pallet);
    setSelectedCall(call);
    console.log(`🎯 Selected: ${pallet}.${call}`);
  };

  const handleTransactionBuilt = () => {
    console.log('✨ Transaction built successfully!');
  };

  return (
    <div className="min-h-screen bg-dark-bg text-white relative overflow-hidden">
      <TurboBackground />
      
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Zap className="w-10 h-10 text-turbo-blue animate-pulse" />
              <Sparkles className="absolute -top-1 -right-1 w-4 h-4 text-yellow-400 animate-pulse" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-turbo-blue via-turbo-purple to-polka bg-clip-text text-transparent">
                PAPI Turbo Transaction Builder
              </h1>
              <p className="text-gray-400 mt-1">Day 9: Master PAPI's tx method • #PAPI30Days</p>
            </div>
          </div>
          
          <div className="flex space-x-4">
            <a 
              href="https://github.com/polkadot-api" 
              target="_blank" 
              rel="noopener noreferrer"
              className="p-2 rounded-lg bg-card-bg hover:bg-border-color transition-colors"
              title="PAPI GitHub"
            >
              <Github className="w-5 h-5" />
            </a>
            <a 
              href="https://twitter.com/hashtag/PAPI30Days" 
              target="_blank" 
              rel="noopener noreferrer"
              className="p-2 rounded-lg bg-card-bg hover:bg-border-color transition-colors"
              title="#PAPI30Days"
            >
              <Twitter className="w-5 h-5" />
            </a>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 pb-12">
        {/* Connection Controls */}
        <div className="mb-8">
          <ChainStatus 
            chainInfo={chainInfo}
            isConnected={isConnected && !!chainInfo}
            isLoading={isLoading}
            error={error}
          />
          
          <div className="flex space-x-4 mt-4">
            <button
              onClick={handleConnect}
              disabled={isLoading || (isConnected && !!chainInfo)}
              className="px-6 py-3 bg-gradient-to-r from-turbo-blue to-turbo-purple text-white font-bold rounded-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Connecting...
                </>
              ) : isConnected && chainInfo ? (
                'Connected 🟢'
              ) : (
                <>
                  <Send className="w-5 h-5 mr-2" />
                  Connect to Polkadot
                </>
              )}
            </button>
            
            <button
              onClick={handleDisconnect}
              disabled={!isConnected || isLoading}
              className="px-6 py-3 bg-card-bg border border-border-color text-white font-bold rounded-lg hover:bg-black/50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Disconnect
            </button>
          </div>
        </div>

        {/* Main Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Left: Pallet Explorer */}
          <div className="lg:col-span-1">
            <PalletExplorer 
              onSelectPallet={handleSelectPallet}
              selectedPallet={selectedPallet}
              selectedCall={selectedCall}
            />
          </div>

          {/* Center: Transaction Builder */}
          <div className="lg:col-span-2">
            <TransactionBuilder 
              api={api}
              selectedPallet={selectedPallet}
              selectedCall={selectedCall}
              onTransactionBuilt={handleTransactionBuilt}
            />
          </div>
        </div>

        {/* Bottom: Transaction Inspector */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="lg:col-span-2">
            <TransactionInspector 
              transaction={lastBuiltTx}
            />
          </div>
        </div>

        {/* Info Panel */}
        <div className="mt-8 glass-card p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-4 bg-black/30 rounded-lg">
              <h4 className="font-bold text-turbo-blue mb-2">🎯 Today's Achievement</h4>
              <p className="text-sm text-gray-300">
                You've mastered PAPI's `tx` method for building fully typed, runtime-compatible transactions without manual encoding.
              </p>
            </div>
            
            <div className="p-4 bg-black/30 rounded-lg">
              <h4 className="font-bold text-purple-400 mb-2">🏎️ Turbo Mode Active</h4>
              <p className="text-sm text-gray-300">
                Auto-fill parameters, real-time validation, and call data inspection make transaction building 10x faster.
              </p>
            </div>
            
            <div className="p-4 bg-black/30 rounded-lg">
              <h4 className="font-bold text-green-400 mb-2">🔜 Next: Signing</h4>
              <p className="text-sm text-gray-300">
                Tomorrow (Day 10) we'll learn to sign transactions using call data with `txFromCallData`.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-12 pt-8 border-t border-border-color text-center text-gray-500 text-sm">
          <p>
            Built with ❤️ for #PAPI30Days Campaign • Day 9: Transaction Building • 
            <span className="text-turbo-blue ml-2">"So smooth, it feels illegal 🏎️"</span>
          </p>
          <p className="mt-2">
            All transactions built via PAPI's typed `tx` method • Fully TypeScript compliant • 
            <a 
              href="https://github.com/polkadot-api/polkadot-api" 
              className="text-turbo-blue hover:text-blue-300 ml-1"
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