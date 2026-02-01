import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ChainCard } from './ChainCard';
import { CHAINS } from '../services/chainRegistry';
import { Globe, Database, Users, Clock } from 'lucide-react';

interface ChainDashboardProps {
  selectedChains: string[];
  isMonitoring: boolean;
}

export const ChainDashboard: React.FC<ChainDashboardProps> = ({
  selectedChains,
  isMonitoring,
}) => {
  const [chainData, setChainData] = useState(
    selectedChains.map(id => CHAINS.find(c => c.id === id)!)
  );

  useEffect(() => {
    if (!isMonitoring) return;

    const interval = setInterval(() => {
      setChainData(prev => prev.map(chain => ({
        ...chain,
        lastBlock: chain.lastBlock + Math.floor(Math.random() * 5 + 1),
        peers: Math.max(20, chain.peers + Math.floor(Math.random() * 10 - 5)),
        status: Math.random() > 0.98 ? 'syncing' : 'online',
      })));
    }, 6000);

    return () => clearInterval(interval);
  }, [isMonitoring, selectedChains]);

  const totalBlocks = chainData.reduce((sum, c) => sum + c.lastBlock, 0);
  const totalPeers = chainData.reduce((sum, c) => sum + c.peers, 0);
  const totalAccounts = chainData.reduce((sum, c) => sum + c.activeAccounts, 0);
  const avgBlockTime = chainData.reduce((sum, c) => sum + c.averageBlockTime, 0) / chainData.length || 0;

  return (
    <div className="bg-gray-800/30 rounded-xl p-6 border border-gray-700">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold flex items-center space-x-2">
          <Globe className="w-5 h-5" />
          <span>Live Multi-Chain Overview</span>
        </h2>
        <div className="text-sm text-gray-500">
          Monitoring {chainData.length} chain{chainData.length !== 1 ? 's' : ''}
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-gradient-to-br from-chain-polkadot/20 to-chain-polkadot/5 rounded-xl p-4 border border-chain-polkadot/30">
          <div className="flex items-center space-x-3">
            <Database className="w-5 h-5 text-chain-polkadot" />
            <div>
              <div className="text-2xl font-bold">{totalBlocks.toLocaleString()}</div>
              <div className="text-xs text-gray-400">Total Blocks</div>
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-chain-kusama/20 to-chain-kusama/5 rounded-xl p-4 border border-chain-kusama/30">
          <div className="flex items-center space-x-3">
            <Users className="w-5 h-5 text-chain-kusama" />
            <div>
              <div className="text-2xl font-bold">{totalPeers}</div>
              <div className="text-xs text-gray-400">Total Peers</div>
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-chain-astar/20 to-chain-astar/5 rounded-xl p-4 border border-chain-astar/30">
          <div className="flex items-center space-x-3">
            <Users className="w-5 h-5 text-chain-astar" />
            <div>
              <div className="text-2xl font-bold">{totalAccounts.toLocaleString()}</div>
              <div className="text-xs text-gray-400">Active Accounts</div>
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-chain-moonbeam/20 to-chain-moonbeam/5 rounded-xl p-4 border border-chain-moonbeam/30">
          <div className="flex items-center space-x-3">
            <Clock className="w-5 h-5 text-chain-moonbeam" />
            <div>
              <div className="text-2xl font-bold">{avgBlockTime.toFixed(1)}s</div>
              <div className="text-xs text-gray-400">Avg Block Time</div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {chainData.map((chain, index) => (
          <motion.div
            key={chain.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
          >
            <ChainCard chain={chain} isMonitoring={isMonitoring} index={index} />
          </motion.div>
        ))}
      </div>

      <div className="mt-8 p-6 bg-gray-900/50 rounded-xl border border-gray-700">
        <h3 className="font-semibold mb-4 flex items-center space-x-2">
          <Cpu className="w-5 h-5" />
          <span>PAPI Multi-Chain in Action</span>
        </h3>
        <pre className="bg-gray-950 rounded-lg p-4 overflow-x-auto text-sm">
          <code className="text-gray-300">
{`// Connect and query multiple chains seamlessly
const clients = {
  polkadot: createClient(getSmProvider('wss://rpc.polkadot.io')),
  kusama: createClient(getSmProvider('wss://kusama-rpc.polkadot.io')),
  astar: createClient(getSmProvider('wss://astar-rpc.dwellir.com')),
};

const apis = {
  polkadot: clients.polkadot.getTypedApi(polkadot),
  kusama: clients.kusama.getTypedApi(kusama),
  astar: clients.astar.getTypedApi(astar),
};

// Unified queries across chains
const versions = await Promise.all([
  apis.polkadot.constants.System.Version(),
  apis.kusama.constants.System.Version(),
  apis.astar.constants.System.Version(),
]);`}
          </code>
        </pre>
        <p className="mt-4 text-sm text-gray-400">
          One consistent API surface for every chain – that's the PAPI advantage!
        </p>
      </div>
    </div>
  );
};