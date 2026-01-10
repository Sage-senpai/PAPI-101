// src/components/WalletConnector.tsx
import React, { useState } from 'react';
import { 
  Plug, 
  Shield, 
  CheckCircle, 
  AlertCircle, 
  RefreshCw,
  Download,
  ExternalLink
} from 'lucide-react';
import { usePolkadotExtension } from '../hooks/usePolkadotExtension';
import { getSecurityColor, getSecurityIcon } from '../utils/securityCheck';

export const WalletConnector: React.FC = () => {
  const { state, securityCheck, connect, disconnect, refreshAccounts } = usePolkadotExtension();
  const [appName, setAppName] = useState('PAPI Trust Bridge');
  const [isCustomizing, setIsCustomizing] = useState(false);

  const handleConnect = () => {
    connect(appName);
  };

  const handleDisconnect = () => {
    disconnect();
  };

  const handleInstallExtension = () => {
    window.open('https://polkadot.js.org/extension/', '_blank');
  };

  return (
    <div className="trust-card p-6 secure-glow">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-2xl font-bold text-white flex items-center">
            <Plug className="w-7 h-7 mr-3 text-trust-blue animate-pulse-safe" />
            Wallet Connection Hub
          </h3>
          <p className="text-gray-400">Secure integration with Polkadot.js Extension</p>
        </div>
        <div className="flex items-center space-x-2 px-3 py-1 bg-trust-blue/20 rounded-lg">
          <Shield className="w-4 h-4 text-trust-blue" />
          <span className="text-sm font-semibold text-trust-blue">Day 11</span>
        </div>
      </div>

      {/* Extension Status */}
      <div className="mb-6">
        <div className={`p-4 rounded-lg border ${
          state.isAvailable 
            ? 'bg-security-green/10 border-security-green/30' 
            : 'bg-warning-amber/10 border-warning-amber/30'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {state.isAvailable ? (
                <CheckCircle className="w-6 h-6 text-security-green" />
              ) : (
                <AlertCircle className="w-6 h-6 text-warning-amber" />
              )}
              <div>
                <p className="font-semibold text-white">
                  {state.isAvailable ? 'Extension Available' : 'Extension Not Detected'}
                </p>
                <p className="text-sm text-gray-400">
                  {state.isAvailable 
                    ? 'Polkadot.js Extension is installed and ready' 
                    : 'Install the extension to connect your wallet'}
                </p>
              </div>
            </div>
            
            {!state.isAvailable && (
              <button
                onClick={handleInstallExtension}
                className="px-4 py-2 bg-trust-blue text-white font-medium rounded-lg hover:bg-blue-600 transition-colors flex items-center"
              >
                <Download className="w-4 h-4 mr-2" />
                Install Extension
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Connection Controls */}
      {state.isAvailable && (
        <div className="space-y-4">
          {/* App Name Customization */}
          {isCustomizing && (
            <div className="p-4 bg-black/30 rounded-lg border border-border-safe">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Application Name
              </label>
              <input
                type="text"
                value={appName}
                onChange={(e) => setAppName(e.target.value)}
                className="w-full px-4 py-2 bg-black/50 border border-border-safe rounded-lg focus:outline-none focus:border-trust-blue text-white"
                placeholder="Enter your dApp name"
              />
              <p className="text-xs text-gray-400 mt-2">
                This name will appear in the extension permission prompt
              </p>
            </div>
          )}

          <div className="flex space-x-4">
            {!state.isConnected ? (
              <button
                onClick={handleConnect}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-trust-blue to-accent-purple text-white font-bold rounded-lg hover:opacity-90 transition-all flex items-center justify-center connection-ring animate-connection-pulse"
              >
                <Plug className="w-5 h-5 mr-2" />
                Connect Wallet
              </button>
            ) : (
              <button
                onClick={handleDisconnect}
                className="flex-1 px-6 py-3 bg-gray-800 border border-gray-700 text-white font-bold rounded-lg hover:bg-gray-700 transition-colors"
              >
                Disconnect Wallet
              </button>
            )}
            
            <button
              onClick={() => setIsCustomizing(!isCustomizing)}
              className="px-4 py-3 bg-gray-800 text-white font-medium rounded-lg hover:bg-gray-700 transition-colors"
            >
              {isCustomizing ? 'Cancel' : 'Customize'}
            </button>
            
            {state.isConnected && (
              <button
                onClick={refreshAccounts}
                className="px-4 py-3 bg-gray-800 text-white font-medium rounded-lg hover:bg-gray-700 transition-colors"
                title="Refresh accounts"
              >
                <RefreshCw className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Security Status */}
      <div className="mt-6 p-4 bg-black/30 rounded-lg border border-border-safe">
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-semibold text-white flex items-center">
            <Shield className="w-5 h-5 mr-2 text-security-green" />
            Security Status
          </h4>
          <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getSecurityColor(securityCheck.level)}`}>
            {getSecurityIcon(securityCheck.level)} {securityCheck.level.toUpperCase()}
          </span>
        </div>
        
        <div className="space-y-2">
          {Object.entries(securityCheck.checks).map(([key, value]) => (
            <div key={key} className="flex items-center justify-between">
              <span className="text-sm text-gray-400 capitalize">
                {key.replace(/([A-Z])/g, ' $1').trim()}
              </span>
              {value ? (
                <CheckCircle className="w-4 h-4 text-security-green" />
              ) : (
                <AlertCircle className="w-4 h-4 text-warning-amber" />
              )}
            </div>
          ))}
        </div>

        {securityCheck.warnings.length > 0 && (
          <div className="mt-4 pt-4 border-t border-border-safe">
            <p className="text-sm font-semibold text-warning-amber mb-2">⚠️ Warnings</p>
            <ul className="text-sm text-gray-300 space-y-1">
              {securityCheck.warnings.map((warning, idx) => (
                <li key={idx}>• {warning}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Error Display */}
      {state.error && (
        <div className="mt-6 p-4 bg-red-900/20 border border-red-500/30 rounded-lg">
          <div className="flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-red-400 mt-0.5" />
            <div>
              <p className="font-semibold text-red-300">Connection Error</p>
              <p className="text-sm text-gray-300 mt-1">{state.error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Connection Info */}
      {state.isConnected && (
        <div className="mt-6 p-4 bg-gradient-to-r from-trust-blue/10 to-accent-purple/10 rounded-lg border border-trust-blue/30">
          <div className="flex items-center space-x-2 mb-2">
            <CheckCircle className="w-5 h-5 text-security-green" />
            <span className="font-bold text-white">Successfully Connected!</span>
          </div>
          <p className="text-sm text-gray-300">
            Your wallet is now securely connected. The extension manages your private keys,
            while PAPI handles the transaction building. Perfect partnership! 🤝
          </p>
        </div>
      )}

      {/* Help Link */}
      <div className="mt-6 pt-4 border-t border-border-safe/50">
        <a
          href="https://wiki.polkadot.network/docs/learn-account-generation"
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-trust-blue hover:text-blue-300 flex items-center"
        >
          <ExternalLink className="w-4 h-4 mr-1" />
          Learn more about wallet security best practices
        </a>
      </div>
    </div>
  );
};