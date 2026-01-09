//src/app.tsx
import React, { useState } from 'react';
import { MagicBackground } from './components/MagicBackground';
import { HexDecoder } from './components/HexDecoder';
import { TransactionViewer } from './components/TransactionViewer';
import { ByteInspector } from './components/ByteInspector';
import { usePolkadotAPI } from './hooks/usePolkadotAPI';
import { Wand2, Github, Twitter, Sparkles, Zap } from 'lucide-react';

function App() {
  const { api, chainInfo, isLoading, error, connect, disconnect } = usePolkadotAPI();
  const [isConnected, setIsConnected] = useState(false);
  const [lastDecodedHex, setLastDecodedHex] = useState<string>('');
  const [decodingHistory, setDecodingHistory] = useState<string[]>([]);

  const handleConnect = async () => {
    await connect();
    setIsConnected(true);
  };

  const handleDisconnect = () => {
    disconnect();
    setIsConnected(false);
    setLastDecodedHex('');
    setDecodingHistory([]);
  };

  const handleDecode = (hex: string) => {
    setLastDecodedHex(hex);
    setDecodingHistory(prev => [hex, ...prev.slice(0, 4)]);
  };

  // Get the decoded transaction from a hook (we'll simulate this for now)
  const decodedTransaction = null; // This would come from useHexDecoder

  return (
    <div className="min-h-screen bg-dark-crystal text-white relative overflow-hidden">
      <MagicBackground />
      
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Wand2 className="w-10 h-10 text-magic-purple animate-float-magic" />
              <Sparkles className="absolute -top-1 -right-1 w-4 h-4 text-sparkle-blue animate-sparkle" />
            </div>
            <div>
              <h1 className="text-3xl font-bold sparkle-text animate-shimmer-text">
                PAPI Hex Whisperer
              </h1>
              <p className="text-gray-400 mt-1">Day 10: Master txFromCallData • #PAPI30Days</p>
            </div>
          </div>
          
          <div className="flex space-x-4">
            <a 
              href="https://github.com/polkadot-api" 
              target="_blank" 
              rel="noopener noreferrer"
              className="p-2 rounded-lg bg-crystal-card hover:bg-border-magic transition-colors"
              title="PAPI GitHub"
            >
              <Github className="w-5 h-5" />
            </a>
            <a 
              href="https://twitter.com/hashtag/PAPI30Days" 
              target="_blank" 
              rel="noopener noreferrer"
              className="p-2 rounded-lg bg-crystal-card hover:bg-border-magic transition-colors"
              title="#PAPI30Days"
            >
              <Twitter className="w-5 h-5" />
            </a>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 pb-12">
        {/* Connection Status */}
        <div className="mb-8">
          <div className="crystal-card p-6 mb-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-white">Connection Status</h3>
                <p className="text-gray-400">
                  {isConnected && chainInfo 
                    ? `Connected to ${chainInfo.chainName} (v${chainInfo.version})` 
                    : 'Not connected'}
                </p>
              </div>
              
              <div className="flex space-x-4">
                <button
                  onClick={handleConnect}
                  disabled={isLoading || (isConnected && !!chainInfo)}
                  className="px-6 py-2 bg-gradient-to-r from-magic-purple to-sparkle-blue text-white font-bold rounded-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  {isLoading ? 'Connecting...' : isConnected && chainInfo ? 'Connected 🟢' : 'Connect'}
                </button>
                
                <button
                  onClick={handleDisconnect}
                  disabled={!isConnected || isLoading}
                  className="px-6 py-2 bg-crystal-card border border-border-magic text-white font-bold rounded-lg hover:bg-black/50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Disconnect
                </button>
              </div>
            </div>
            
            {error && (
              <div className="mt-4 p-3 bg-red-900/20 border border-red-500/30 rounded">
                <p className="text-red-300">{error}</p>
              </div>
            )}
          </div>
        </div>

        {/* Main Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Left: Hex Decoder */}
          <div className="lg:col-span-2">
            <HexDecoder 
              api={api}
              onDecode={handleDecode}
            />
          </div>

          {/* Right: Connection Info */}
          <div className="crystal-card p-6">
            <div className="flex items-center space-x-2 mb-4">
              <Zap className="w-5 h-5 text-sparkle-blue" />
              <h3 className="text-xl font-bold text-white">txFromCallData Guide</h3>
            </div>
            
            <div className="space-y-4">
              <div className="p-3 bg-black/30 rounded border border-border-magic">
                <p className="font-semibold text-white mb-1">🎯 What It Does</p>
                <p className="text-sm text-gray-300">
                  Converts hex call data back into a typed transaction object using runtime metadata.
                </p>
              </div>
              
              <div className="p-3 bg-black/30 rounded border border-border-magic">
                <p className="font-semibold text-white mb-1">🔍 Use Cases</p>
                <ul className="text-sm text-gray-300 space-y-1">
                  <li>• Debugging failed transactions</li>
                  <li>• Monitoring mempool activity</li>
                  <li>• Analyzing historical data</li>
                  <li>• Building transaction explorers</li>
                </ul>
              </div>
              
              <div className="p-3 bg-black/30 rounded border border-border-magic">
                <p className="font-semibold text-white mb-1">⚡ Code Example</p>
                <pre className="text-xs text-gray-300 mt-2 font-mono-magic">
{`const callData = Binary.fromHex('0x0400...');
const tx = dotApi.txFromCallData(callData);
console.log(tx.pallet); // "Balances"
console.log(tx.method); // "transfer"`}
                </pre>
              </div>
            </div>
            
            {/* Recent Decodes */}
            {decodingHistory.length > 0 && (
              <div className="mt-6 pt-4 border-t border-border-magic">
                <p className="font-semibold text-white mb-2">Recent Decodes</p>
                <div className="space-y-2">
                  {decodingHistory.map((hex, idx) => (
                    <div key={idx} className="p-2 bg-gray-900/30 rounded text-xs font-mono-magic">
                      {hex.substring(0, 32)}...
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Bottom Row: Transaction Viewer & Byte Inspector */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <TransactionViewer decoded={decodedTransaction} />
          </div>
          <div>
            <ByteInspector 
              bytes={[]} // This would come from useHexDecoder
              decoded={decodedTransaction}
            />
          </div>
        </div>

        {/* Info Panel */}
        <div className="mt-8 crystal-card p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-4 bg-black/30 rounded-lg">
              <h4 className="font-bold text-magic-purple mb-2">🎩 Today's Achievement</h4>
              <p className="text-sm text-gray-300">
                You've mastered PAPI's `txFromCallData` method for decoding hex call data into human-readable transactions.
              </p>
            </div>
            
            <div className="p-4 bg-black/30 rounded-lg">
              <h4 className="font-bold text-sparkle-blue mb-2">🔮 The Magic Revealed</h4>
              <p className="text-sm text-gray-300">
                PAPI uses runtime metadata to understand hex structure—no manual decoding tables needed!
              </p>
            </div>
            
            <div className="p-4 bg-black/30 rounded-lg">
              <h4 className="font-bold text-success-emerald mb-2">🔜 Next: Signing</h4>
              <p className="text-sm text-gray-300">
                Tomorrow (Day 11) we'll integrate Polkadot.js extension to sign these decoded transactions.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-12 pt-8 border-t border-border-magic text-center text-gray-500 text-sm">
          <p>
            Built with ❤️ Dvyne for #PAPI30Days Campaign • Day 10: Hex Decoding • 
            <span className="text-magic-purple ml-2">"Turning hex into magic 🎩"</span>
          </p>
          <p className="mt-2">
            All hex decoding via PAPI's txFromCallData • Fully TypeScript compliant • 
            <a 
              href="https://github.com/polkadot-api/polkadot-api" 
              className="text-sparkle-blue hover:text-blue-300 ml-1"
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