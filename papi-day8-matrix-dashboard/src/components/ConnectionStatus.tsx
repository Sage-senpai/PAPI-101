// src/components/ConnectionStatus.tsx
import React from 'react';
import { Wifi, WifiOff, CheckCircle, AlertCircle } from 'lucide-react';

interface ConnectionStatusProps {
  isConnected: boolean;
  isLoading: boolean;
  error: string | null;
  chainName?: string;
}

export const ConnectionStatus: React.FC<ConnectionStatusProps> = ({
  isConnected,
  isLoading,
  error,
  chainName
}) => {
  if (isLoading) {
    return (
      <div className="flex items-center space-x-2 p-4 glass-card animate-pulse">
        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-matrix-green"></div>
        <span className="text-matrix-green">Connecting to Polkadot...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center space-x-2 p-4 glass-card border border-red-500/50">
        <AlertCircle className="w-5 h-5 text-red-500" />
        <div>
          <p className="text-red-400 font-bold">Connection Error</p>
          <p className="text-sm text-gray-400">{error}</p>
        </div>
      </div>
    );
  }

  if (isConnected && chainName) {
    return (
      <div className="flex items-center space-x-2 p-4 glass-card border border-matrix-green/50">
        <div className="relative">
          <Wifi className="w-5 h-5 text-matrix-green" />
          <CheckCircle className="absolute -top-1 -right-1 w-3 h-3 text-green-500" />
        </div>
        <div>
          <p className="text-matrix-green font-bold">Connected</p>
          <p className="text-sm text-gray-400">to {chainName} via light-client</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-2 p-4 glass-card border border-gray-700">
      <WifiOff className="w-5 h-5 text-gray-500" />
      <div>
        <p className="text-gray-400 font-bold">Disconnected</p>
        <p className="text-sm text-gray-500">Click connect to start</p>
      </div>
    </div>
  );
};