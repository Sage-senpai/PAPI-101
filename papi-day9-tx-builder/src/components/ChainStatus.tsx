//src/components/chainstatus
import React from 'react';
import { Wifi, Cpu, Hash, Shield, Zap } from 'lucide-react';
import { ChainInfo } from '../hooks/usePolkadotAPI';
import { formatBalance } from '../utils/formatters';

interface ChainStatusProps {
  chainInfo: ChainInfo | null;
  isConnected: boolean;
  isLoading: boolean;
  error: string | null;
}

export const ChainStatus: React.FC<ChainStatusProps> = ({
  chainInfo,
  isConnected,
  isLoading,
  error,
}) => {
  if (isLoading) {
    return (
      <div className="glass-card p-6 turbo-glow border-turbo-blue/30">
        <div className="flex items-center space-x-3">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-turbo-blue"></div>
          <div>
            <p className="font-semibold text-turbo-blue">Connecting to Polkadot...</p>
            <p className="text-sm text-gray-400">Initializing light client</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="glass-card p-6 border-red-500/30 bg-red-900/10">
        <div className="flex items-center space-x-3">
          <Shield className="w-6 h-6 text-red-500" />
          <div>
            <p className="font-semibold text-red-400">Connection Error</p>
            <p className="text-sm text-gray-300">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!isConnected || !chainInfo) {
    return (
      <div className="glass-card p-6">
        <div className="flex items-center space-x-3">
          <Wifi className="w-6 h-6 text-gray-500" />
          <div>
            <p className="font-semibold text-gray-400">Not Connected</p>
            <p className="text-sm text-gray-500">Connect to build transactions</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-card p-6 turbo-glow border-turbo-blue/30">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <Wifi className="w-4 h-4 text-turbo-blue" />
            <span className="text-sm text-gray-400">Status</span>
          </div>
          <p className="font-bold text-green-400 flex items-center">
            <span className="h-2 w-2 bg-green-400 rounded-full mr-2 animate-pulse"></span>
            Connected
          </p>
        </div>
        
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <Cpu className="w-4 h-4 text-purple-400" />
            <span className="text-sm text-gray-400">Runtime</span>
          </div>
          <p className="font-bold text-white">v{chainInfo.version}</p>
        </div>
        
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <Hash className="w-4 h-4 text-green-400" />
            <span className="text-sm text-gray-400">Block</span>
          </div>
          <p className="font-bold text-white">#{chainInfo.blockNumber.toLocaleString()}</p>
        </div>
        
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <Zap className="w-4 h-4 text-yellow-400" />
            <span className="text-sm text-gray-400">Min Balance</span>
          </div>
          <p className="font-bold text-white">{formatBalance(chainInfo.existentialDeposit)}</p>
        </div>
      </div>
      
      <div className="mt-4 pt-4 border-t border-border-color/50">
        <p className="text-sm text-gray-400">
          <span className="text-turbo-blue font-semibold">💡 Ready for transactions:</span> Use the builder below to construct transactions using PAPI's tx method
        </p>
      </div>
    </div>
  );
};