// src/App.tsx
import React from 'react';
import { WalletConnector } from './components/WalletConnector';
import { AccountManager } from './components/AccountManager';
import { NetworkIndicator } from './components/NetworkIndicator';
import { usePolkadotExtension } from './hooks/usePolkadotExtension';
import { 
  Handshake, 
  Github, 
  Twitter, 
  Shield,
  Lock,
  Key
} from 'lucide-react';

function App() {
  const { state } = usePolkadotExtension();

  return (
    <div className="min-h-screen bg-dark-foundation text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-security-pattern opacity-10"></div>
      
      {/* Header */}
      <header className="container mx-auto px-4 py-6 relative z-10">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Handshake className="w-10 h-10 text-trust-blue animate-float-trust" />
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-security-green rounded-full animate-pulse-safe"></div>
            </div>
            <div>
              <h1 className="text-3xl font-bold trust-gradient-text">
                PAPI Trust Bridge
              </h1>
              <p className="text-gray-400 mt-1">Day 11: Secure Wallet Integration • #PAPI30Days</p>
            </div>
          </div>
          
          <div className="flex space-x-4">
            <a 
              href="https://github.com/polkadot-api" 
              target="_blank" 
              rel="noopener noreferrer"
              className="p-2 rounded-lg bg-card-layer hover:bg-border-safe transition-colors"
              title="PAPI GitHub"
            >
              <Github className="w-5 h-5" />
            </a>
            <a 
              href="https://twitter.com/hashtag/PAPI30Days" 
              target="_blank" 
              rel="noopener noreferrer"
              className="p-2 rounded-lg bg-card-layer hover:bg-border-safe transition-colors"
              title="#PAPI30Days"
            >
              <Twitter className="w-5 h-5" />
            </a>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 pb-12 relative z-10">
        {/* Stats Bar */}
        <div className="mb-8 trust-card p-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-3">
              <div className="flex items-center justify-center space-x-2">
                <Key className="w-5 h-5 text-trust-blue" />
                <p className="text-2xl font-bold text-white">
                  {state.isConnected ? '🔓' : '🔒'}
                </p>
              </div>
              <p className="text-sm text-gray-400 mt-1">
                {state.isConnected ? 'Wallet Connected' : 'Wallet Locked'}
              </p>
            </div>
            
            <div className="text-center p-3">
              <div className="flex items-center justify-center">
                <Shield className="w-5 h-5 text-security-green mr-1" />
                <p className="text-2xl font-bold text-white">{state.accounts.length}</p>
              </div>
              <p className="text-sm text-gray-400 mt-1">Accounts</p>
            </div>
            
            <div className="text-center p-3">
              <div className="flex items-center justify-center">
                <Lock className="w-5 h-5 text-accent-purple mr-1" />
                <p className="text-2xl font-bold text-white">
                  {new Set(state.accounts.map(a => a.meta.source)).size}
                </p>
              </div>
              <p className="text-sm text-gray-400 mt-1">Wallet Types</p>
            </div>
            
            <div className="text-center p-3">
              <div className="flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-security-green animate-pulse mr-2"></div>
                <p className="text-2xl font-bold text-white">
                  {state.isConnected ? '✅' : '❌'}
                </p>
              </div>
              <p className="text-sm text-gray-400 mt-1">
                {state.isConnected ? 'Secure Session' : 'No Session'}
              </p>
            </div>
          </div>
        </div>

        {/* Main Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Left: Wallet Connector */}
          <div className="lg:col-span-2">
            <WalletConnector />
          </div>

          {/* Right: Network Indicator */}
          <div>
            <NetworkIndicator />
          </div>
        </div>

        {/* Bottom Row: Account Manager */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="lg:col-span-2">
            <AccountManager />
          </div>
        </div>

        {/* Partnership Showcase */}
        <div className="mt-8 trust-card p-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-white mb-3">The Perfect Partnership</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-trust-blue to-accent-purple flex items-center justify-center">
                    <span className="text-white font-bold">P</span>
                  </div>
                  <div>
                    <p className="font-semibold text-white">PAPI's Responsibilities</p>
                    <p className="text-sm text-gray-400">Type-safe transaction building, runtime compatibility, metadata awareness</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-security-green to-warning-amber flex items-center justify-center">
                    <span className="text-white font-bold">E</span>
                  </div>
                  <div>
                    <p className="font-semibold text-white">Extension's Responsibilities</p>
                    <p className="text-sm text-gray-400">Private key security, user interface, permission management, network awareness</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex-1">
              <div className="p-6 bg-gradient-to-br from-trust-blue/10 to-security-green/10 rounded-2xl border border-trust-blue/30">
                <div className="text-center">
                  <Handshake className="w-16 h-16 mx-auto text-trust-blue mb-4 handshake-animation" />
                  <p className="text-lg font-bold text-white">Secure Handshake Protocol</p>
                  <p className="text-gray-400 mt-2">
                    PAPI builds, Extension signs. Each component excels at what it does best.
                  </p>
                  <div className="mt-4 text-sm text-gray-300">
                    <p>• Zero private key exposure</p>
                    <p>• Full type safety</p>
                    <p>• Runtime compatibility</p>
                    <p>• User-controlled permissions</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-12 pt-8 border-t border-border-safe text-center text-gray-500 text-sm">
          <p>
            Built with ❤️ for #PAPI30Days Campaign • Day 11: Secure Wallet Integration • 
            <span className="text-trust-blue ml-2">"PAPI + Polkadot.js Extension = seamless signing 🤝"</span>
          </p>
          <p className="mt-2">
            All wallet interactions via Polkadot.js Extension • Fully TypeScript compliant • 
            <a 
              href="https://github.com/polkadot-api/polkadot-api" 
              className="text-trust-blue hover:text-blue-300 ml-1"
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