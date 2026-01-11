//src/components/ChainOrchestrator.tsx
import React, { useState } from 'react';
import { 
  Music, 
  Play, 
  Pause, 
  RefreshCw, 
  Zap, 
  BarChart3,
  Cpu,
  Network
} from 'lucide-react';
import { useMultiChain } from '../hooks/useMultiChain';
import { CHAIN_CONFIGS,type formatTokenAmount, getChainColor, getChainIcon } from '../utils/chainConfig';
import { calculateHealthScore, formatLatency, getHealthIcon } from '../utils/metricsCalculator';
import { motion, AnimatePresence } from 'framer-motion';

export const ChainOrchestrator: React.FC = () => {
  const { 
    connections, 
    isInitializing, 
    activeChains, 
    toggleChain, 
    updateAllMetrics,
    getAllMetrics 
  } = useMultiChain();
  const [isPlaying, setIsPlaying] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(true);

  const handleToggleChain = (chainId: string) => {
    toggleChain(chainId);
    console.log(`🎛️ Toggled chain: ${chainId}`);
  };

  const handleRefresh = async () => {
    console.log('🔄 Manual refresh requested');
    await updateAllMetrics();
  };

  const allMetrics = getAllMetrics();

  return (
    <div className="console-card p-6 conductor-glow">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-2xl font-bold text-white flex items-center">
            <Music className="w-7 h-7 mr-3 text-accent-orchestra animate-wave-music" />
            Chain Orchestrator
          </h3>
          <p className="text-gray-400">Conduct your multi-chain symphony</p>
        </div>
        <div className="flex items-center space-x-2 px-3 py-1 bg-accent-orchestra/20 rounded-lg">
          <Network className="w-4 h-4 text-accent-orchestra" />
          <span className="text-sm font-semibold text-accent-orchestra">Day 13</span>
        </div>
      </div>

      {/* Controls */}
      <div className="mb-6 p-4 bg-black/30 rounded-lg border border-border-stage">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="flex items-center space-x-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
            >
              {isPlaying ? (
                <>
                  <Pause className="w-4 h-4" />
                  <span>Pause Symphony</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4" />
                  <span>Play Symphony</span>
                </>
              )}
            </button>
            
            <button
              onClick={handleRefresh}
              disabled={isInitializing}
              className="flex items-center space-x-2 px-4 py-2 bg-accent-orchestra/20 hover:bg-accent-orchestra/30 text-accent-orchestra rounded-lg transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${isInitializing ? 'animate-spin' : ''}`} />
              <span>Refresh All</span>
            </button>
          </div>
          
          <div className="flex items-center space-x-2">
            <Zap className="w-4 h-4 text-yellow-400" />
            <span className="text-sm text-gray-400">Auto-refresh:</span>
            <button
              onClick={() => setAutoRefresh(!autoRefresh)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                autoRefresh ? 'bg-success-maestro' : 'bg-gray-700'
              }`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                autoRefresh ? 'translate-x-6' : 'translate-x-1'
              }`} />
            </button>
          </div>
        </div>
      </div>

      {/* Chain Selection */}
      <div className="mb-6">
        <h4 className="font-semibold text-white mb-3 flex items-center">
          <Cpu className="w-5 h-5 mr-2 text-gray-400" />
          Active Chains
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {CHAIN_CONFIGS.map((chain) => {
            const isActive = activeChains.includes(chain.id);
            const metrics = allMetrics[chain.id];
            const healthScore = metrics ? calculateHealthScore(metrics) : 0;
            const healthIcon = getHealthIcon(healthScore);
            
            return (
              <motion.div
                key={chain.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: chain.id === 'polkadot' ? 0 : chain.id === 'kusama' ? 0.1 : 0.2 }}
              >
                <div
                  className={`p-4 rounded-lg border cursor-pointer transition-all ${
                    isActive
                      ? 'border-accent-orchestra/50 bg-black/30'
                      : 'border-gray-700 bg-black/20 opacity-60'
                  }`}
                  onClick={() => handleToggleChain(chain.id)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-3">
                      <div className="text-2xl">{chain.icon}</div>
                      <div>
                        <p className="font-semibold text-white">{chain.name}</p>
                        <p className="text-xs text-gray-400">{chain.token}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <div className={`status-indicator ${
                        isActive ? 'connected-status' : 'disconnected-status'
                      }`} />
                      <span className="text-sm">{healthIcon}</span>
                    </div>
                  </div>
                  
                  <AnimatePresence>
                    {isActive && metrics && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="mt-3 pt-3 border-t border-border-stage/50 space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-400">Block:</span>
                            <span className="text-white font-mono">#{metrics.blockNumber.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-400">Latency:</span>
                            <span className="text-white">{formatLatency(metrics.latency)}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-400">Validators:</span>
                            <span className="text-white">{metrics.validatorCount}</span>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Connection Status */}
      <div className="mb-6">
        <h4 className="font-semibold text-white mb-3 flex items-center">
          <BarChart3 className="w-5 h-5 mr-2 text-gray-400" />
          Connection Status
        </h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="p-4 bg-black/30 rounded-lg">
            <p className="text-sm text-gray-400">Active Chains</p>
            <p className="text-2xl font-bold text-white">
              {Object.keys(connections).length}
            </p>
          </div>
          
          <div className="p-4 bg-black/30 rounded-lg">
            <p className="text-sm text-gray-400">Total Blocks</p>
            <p className="text-2xl font-bold text-white">
              {Object.values(allMetrics).reduce((sum, m) => sum + m.blockNumber, 0).toLocaleString()}
            </p>
          </div>
          
          <div className="p-4 bg-black/30 rounded-lg">
            <p className="text-sm text-gray-400">Avg Latency</p>
            <p className="text-2xl font-bold text-white">
              {Object.values(allMetrics).length > 0
                ? `${Math.round(Object.values(allMetrics).reduce((sum, m) => sum + m.latency, 0) / Object.values(allMetrics).length)}ms`
                : '0ms'}
            </p>
          </div>
          
          <div className="p-4 bg-black/30 rounded-lg">
            <p className="text-sm text-gray-400">System Health</p>
            <p className="text-2xl font-bold text-success-maestro">
              {Object.values(allMetrics).length > 0
                ? `${Math.round(Object.values(allMetrics).reduce((sum, m) => sum + calculateHealthScore(m), 0) / Object.values(allMetrics).length)}%`
                : '0%'}
            </p>
          </div>
        </div>
      </div>

      {/* Chain Details */}
      {Object.keys(connections).length > 0 && (
        <div className="mt-6 p-4 bg-gradient-to-r from-accent-orchestra/10 to-success-maestro/10 rounded-lg border border-accent-orchestra/30">
          <div className="flex items-center space-x-2 mb-3">
            <div className="w-2 h-2 rounded-full bg-success-maestro animate-pulse"></div>
            <span className="font-bold text-white">Multi-Chain Symphony Active</span>
          </div>
          <p className="text-sm text-gray-300">
            Successfully connected to {Object.keys(connections).length} chains. 
            {isPlaying ? ' Symphony is playing - chains are synchronized.' : ' Symphony is paused.'}
            {autoRefresh && ' Auto-refresh is enabled.'}
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {Object.entries(connections).map(([chainId, connection]) => (
              <div
                key={chainId}
                className="px-3 py-1 rounded-full text-xs"
                style={{
                  backgroundColor: `${getChainColor(chainId)}20`,
                  borderColor: `${getChainColor(chainId)}40`,
                  color: getChainColor(chainId)
                }}
              >
                {getChainIcon(chainId)} {chainId}: #{connection.metrics.blockNumber}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Initialization Status */}
      {isInitializing && (
        <div className="mt-6 p-4 bg-yellow-900/20 border border-yellow-500/30 rounded-lg">
          <div className="flex items-center space-x-3">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-yellow-400"></div>
            <div>
              <p className="font-semibold text-yellow-300">Initializing Chains</p>
              <p className="text-sm text-gray-300">Connecting to {activeChains.length} chain(s)...</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};