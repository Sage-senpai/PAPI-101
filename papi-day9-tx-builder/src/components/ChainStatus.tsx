// src/components/ChainStatus.tsx
import { Wifi, Cpu, Hash, Shield, Zap } from 'lucide-react';
import type { ChainInfo } from '../hooks/usePolkadotAPI';
import { formatBalance } from '../utils/formatters';

interface ChainStatusProps {
  chainInfo: ChainInfo | null;
  isConnected: boolean;
  isLoading: boolean;
  error: string | null;
}

export const ChainStatus = ({
  chainInfo,
  isConnected,
  isLoading,
  error,
}: ChainStatusProps) => {
  if (isLoading) {
    return (
      <div className="glass-card p-4 md:p-6 turbo-glow border-turbo-blue/30">
        <div className="flex items-center space-x-3">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-turbo-blue"></div>
          <div>
            <p className="font-semibold text-turbo-blue text-sm md:text-base">Connecting to Polkadot...</p>
            <p className="text-xs md:text-sm text-gray-400">Initializing light client</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="glass-card p-4 md:p-6 border-red-500/30 bg-red-900/10">
        <div className="flex items-center space-x-3">
          <Shield className="w-5 h-5 md:w-6 md:h-6 text-red-500 flex-shrink-0" />
          <div>
            <p className="font-semibold text-red-400 text-sm md:text-base">Connection Error</p>
            <p className="text-xs md:text-sm text-gray-300 break-words">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!isConnected || !chainInfo) {
    return (
      <div className="glass-card p-4 md:p-6">
        <div className="flex items-center space-x-3">
          <Wifi className="w-5 h-5 md:w-6 md:h-6 text-gray-500" />
          <div>
            <p className="font-semibold text-gray-400 text-sm md:text-base">Not Connected</p>
            <p className="text-xs md:text-sm text-gray-500">Connect to build transactions</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-card p-4 md:p-6 turbo-glow border-turbo-blue/30">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <Wifi className="w-3 h-3 md:w-4 md:h-4 text-turbo-blue" />
            <span className="text-xs md:text-sm text-gray-400">Status</span>
          </div>
          <p className="font-bold text-green-400 flex items-center text-sm md:text-base">
            <span className="h-2 w-2 bg-green-400 rounded-full mr-2 animate-pulse"></span>
            Connected
          </p>
        </div>
        
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <Cpu className="w-3 h-3 md:w-4 md:h-4 text-purple-400" />
            <span className="text-xs md:text-sm text-gray-400">Runtime</span>
          </div>
          <p className="font-bold text-white text-sm md:text-base">v{chainInfo.version}</p>
        </div>
        
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <Hash className="w-3 h-3 md:w-4 md:h-4 text-green-400" />
            <span className="text-xs md:text-sm text-gray-400">Block</span>
          </div>
          <p className="font-bold text-white text-sm md:text-base">#{chainInfo.blockNumber.toLocaleString()}</p>
        </div>
        
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <Zap className="w-3 h-3 md:w-4 md:h-4 text-yellow-400" />
            <span className="text-xs md:text-sm text-gray-400">Min Balance</span>
          </div>
          <p className="font-bold text-white text-xs md:text-sm">{formatBalance(chainInfo.existentialDeposit)}</p>
        </div>
      </div>
      
      <div className="mt-4 pt-4 border-t border-border-color/50">
        <p className="text-xs md:text-sm text-gray-400">
          <span className="text-turbo-blue font-semibold">💡 Ready for transactions:</span> Use the builder below to construct transactions using PAPI's tx method
        </p>
      </div>
    </div>
  );
};