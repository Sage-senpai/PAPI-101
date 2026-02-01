import React from 'react';
import { ChainConfig } from '../services/chainRegistry';
import { 
  Zap, Users, Clock, Database, Wifi, Cpu, 
  TrendingUp, AlertCircle, CheckCircle 
} from 'lucide-react';

interface ChainCardProps {
  chain: ChainConfig;
  isMonitoring: boolean;
  index: number;
}

export const ChainCard: React.FC<ChainCardProps> = ({ chain, isMonitoring, index }) => {
  const getStatusStyle = () => {
    switch (chain.status) {
      case 'online': return 'bg-status-online/20 text-status-online border-status-online/30';
      case 'syncing': return 'bg-status-syncing/20 text-status-syncing border-status-syncing/30';
      case 'offline': return 'bg-status-offline/20 text-status-offline border-status-offline/30';
      default: return 'bg-gray-500/20 text-gray-500 border-gray-500/30';
    }
  };

  const getStatusIcon = () => {
    switch (chain.status) {
      case 'online': return <CheckCircle className="w-4 h-4" />;
      case 'syncing': return <AlertCircle className="w-4 h-4" />;
      default: return <AlertCircle className="w-4 h-4" />;
    }
  };

  return (
    <div 
      className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-xl p-6 border border-gray-700 hover:border-gray-600 transition-all duration-300 group"
      style={{ 
        animationDelay: `${index * 120}ms`,
        borderLeft: `4px solid ${chain.color}`,
      }}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div 
            className="w-10 h-10 rounded-lg flex items-center justify-center text-xl shadow-lg"
            style={{ backgroundColor: `${chain.color}30`, color: chain.color }}
          >
            {chain.icon}
          </div>
          <div>
            <h3 className="text-lg font-semibold group-hover:text-white transition-colors">
              {chain.name}
            </h3>
            <div className="flex items-center space-x-2 mt-1">
              <span className="text-sm text-gray-400">{chain.tokenSymbol}</span>
              {chain.isRelayChain && (
                <span className="text-xs px-2 py-0.5 bg-yellow-500/20 text-yellow-400 rounded">
                  Relay
                </span>
              )}
              <span className="text-xs px-2 py-0.5 bg-gray-700 rounded">
                ID: {chain.parachainId || 'Relay'}
              </span>
            </div>
          </div>
        </div>
        
        <div className={`flex items-center space-x-2 px-3 py-1 rounded-full text-sm ${getStatusStyle()}`}>
          {getStatusIcon()}
          <span className="capitalize">{chain.status}</span>
        </div>
      </div>

      <p className="text-gray-400 text-sm mb-6 line-clamp-2">
        {chain.features.join(' • ')}
      </p>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="flex items-center space-x-3">
          <Database className="w-4 h-4 text-gray-400" />
          <div>
            <div className="text-lg font-semibold">{chain.lastBlock.toLocaleString()}</div>
            <div className="text-xs text-gray-500">Blocks</div>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <Wifi className="w-4 h-4 text-gray-400" />
          <div>
            <div className="text-lg font-semibold">{chain.peers}</div>
            <div className="text-xs text-gray-500">Peers</div>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <Clock className="w-4 h-4 text-gray-400" />
          <div>
            <div className="text-lg font-semibold">{chain.averageBlockTime}s</div>
            <div className="text-xs text-gray-500">Block Time</div>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <Users className="w-4 h-4 text-gray-400" />
          <div>
            <div className="text-lg font-semibold">{chain.activeAccounts.toLocaleString()}</div>
            <div className="text-xs text-gray-500">Accounts</div>
          </div>
        </div>
      </div>

      <div className="pt-4 border-t border-gray-700">
        <div className="flex items-center justify-between text-xs">
          <span className="text-gray-500">RPC</span>
          <code className="text-gray-400 truncate max-w-[180px]">
            {chain.rpcEndpoint}
          </code>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-700">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${isMonitoring ? 'animate-ping bg-green-500' : 'bg-gray-500'}`}></div>
            <span className="text-gray-500">PAPI Active</span>
          </div>
          <span className="text-gray-500">v{chain.specVersion}</span>
        </div>
      </div>
    </div>
  );
};