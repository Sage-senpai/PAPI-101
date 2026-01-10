// src/components/NetworkIndicator.tsx
import { 
  Globe, 
  Wifi, 
  Server, 
  Shield,
  RefreshCw,
  AlertCircle,
  Plug
} from 'lucide-react';
import { useWallet } from '../contexts/WalletContext';
import { getNetworkFromGenesisHash } from '../utils/walletHelpers';

export const NetworkIndicator = () => {
  const { state } = useWallet();

  if (!state.isConnected || !state.network) {
    return (
      <div className="trust-card p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-white flex items-center">
            <Globe className="w-5 h-5 mr-2 text-gray-500" />
            Network Status
          </h3>
          <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
        </div>
        
        <div className="text-center py-8">
          <div className="mb-4 relative inline-block">
            <Globe className="w-16 h-16 text-gray-600 mx-auto" />
            <div className="absolute -bottom-1 -right-1 bg-gray-700 rounded-full p-1">
              <Plug className="w-5 h-5 text-gray-400" />
            </div>
          </div>
          <p className="text-gray-400 mb-2">No Network Connected</p>
          <p className="text-sm text-gray-500">
            Connect your wallet to view network details
          </p>
        </div>

        <div className="mt-4 p-3 bg-black/30 rounded-lg border border-border-safe">
          <p className="text-xs text-gray-500 text-center">
            Network information will appear here after connecting
          </p>
        </div>
      </div>
    );
  }

  const networkName = getNetworkFromGenesisHash(state.network.genesisHash);

  return (
    <div className="trust-card p-6">
      <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
        <div>
          <h3 className="text-xl font-bold text-white flex items-center">
            <Globe className="w-6 h-6 mr-2 text-trust-blue" />
            Network Connection
          </h3>
          <p className="text-gray-400">Active blockchain network</p>
        </div>
        <div className={`px-3 py-1 rounded-full text-sm font-semibold ${
          state.network.isConnected
            ? 'bg-security-green/20 text-security-green'
            : 'bg-warning-amber/20 text-warning-amber'
        }`}>
          {state.network.isConnected ? '✅ Connected' : '⚠️ Disconnected'}
        </div>
      </div>

      <div className="space-y-4">
        <div className="p-4 bg-black/30 rounded-lg border border-border-safe">
          <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
            <div className="flex items-center space-x-2">
              <Server className="w-5 h-5 text-blue-400" />
              <span className="font-semibold text-white">{networkName}</span>
            </div>
            <span className="text-xs px-2 py-1 bg-gray-800 rounded">
              SS58: {state.network.ss58Format}
            </span>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Native Token:</span>
              <span className="text-white font-medium">{state.network.token}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Decimals:</span>
              <span className="text-white font-medium">{state.network.tokenDecimals}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Spec Version:</span>
              <span className="text-white font-medium">v{state.network.specVersion}</span>
            </div>
          </div>
        </div>

        <div className="p-4 bg-black/30 rounded-lg border border-border-safe">
          <div className="flex items-center space-x-2 mb-3">
            <Wifi className="w-5 h-5 text-green-400" />
            <span className="font-semibold text-white">Connection Health</span>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-400">Extension Connection</span>
              <div className="flex items-center space-x-1">
                <div className={`w-2 h-2 rounded-full ${
                  state.isConnected ? 'bg-security-green animate-pulse' : 'bg-gray-500'
                }`}></div>
                <span className="text-xs text-gray-300">
                  {state.isConnected ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-400">Chain Connection</span>
              <div className="flex items-center space-x-1">
                <div className={`w-2 h-2 rounded-full ${
                  state.network.isConnected ? 'bg-security-green animate-pulse' : 'bg-warning-amber'
                }`}></div>
                <span className="text-xs text-gray-300">
                  {state.network.isConnected ? 'Synced' : 'Not Synced'}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-400">Accounts Loaded</span>
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 rounded-full bg-security-green animate-pulse"></div>
                <span className="text-xs text-gray-300">
                  {state.accounts.length} account{state.accounts.length !== 1 ? 's' : ''}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 bg-gradient-to-r from-security-green/10 to-trust-blue/10 rounded-lg border border-security-green/30">
          <div className="flex items-center space-x-2 mb-2">
            <Shield className="w-5 h-5 text-security-green animate-shield-glow" />
            <span className="font-bold text-white">Security Features</span>
          </div>
          <ul className="text-sm text-gray-300 space-y-1">
            <li>• Private keys secured in extension</li>
            <li>• Transaction validation by PAPI</li>
            <li>• Network-aware signing</li>
            <li>• Permission-based access control</li>
          </ul>
        </div>

        <div className="p-4 bg-black/30 rounded-lg border border-border-safe">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <p className="font-semibold text-white">Switch Network</p>
              <p className="text-sm text-gray-400">Connect to different chains</p>
            </div>
            <button
              className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors flex items-center opacity-50 cursor-not-allowed"
              disabled
              title="Coming soon"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Switch
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-2 flex items-center">
            <AlertCircle className="w-3 h-3 mr-1" />
            Network switching requires extension support
          </p>
        </div>
      </div>
    </div>
  );
};