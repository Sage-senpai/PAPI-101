import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ChainCard } from './ChainCard';
import { CHAINS } from '../services/chainRegistry';
import { Globe, Cpu, Database, Users, Clock } from 'lucide-react';

interface ChainDashboardProps {
  selectedChains: string[];
  isMonitoring: boolean;
}

export const ChainDashboard: React.FC<ChainDashboardProps> = ({
  selectedChains,
  isMonitoring,
}) => {
  const [chainData, setChainData] = useState(() =>
    selectedChains
      .map(id => CHAINS.find(c => c.id === id))
      .filter((c): c is typeof CHAINS[0] => !!c)
  );

  // Re-sync when the parent selection changes
  useEffect(() => {
    setChainData(
      selectedChains
        .map(id => CHAINS.find(c => c.id === id))
        .filter((c): c is typeof CHAINS[0] => !!c)
    );
  }, [selectedChains]);

  // Simulated live ticker
  useEffect(() => {
    if (!isMonitoring) return;

    const interval = setInterval(() => {
      setChainData(prev =>
        prev.map(chain => ({
          ...chain,
          lastBlock: chain.lastBlock + Math.floor(Math.random() * 5 + 1),
          peers: Math.max(20, chain.peers + Math.floor(Math.random() * 10 - 5)),
          status: (Math.random() > 0.97 ? 'syncing' : 'online') as 'online' | 'syncing' | 'offline',
        }))
      );
    }, 6000);

    return () => clearInterval(interval);
  }, [isMonitoring]);

  const totalBlocks   = chainData.reduce((s, c) => s + c.lastBlock, 0);
  const totalPeers    = chainData.reduce((s, c) => s + c.peers, 0);
  const totalAccounts = chainData.reduce((s, c) => s + c.activeAccounts, 0);
  const avgBlockTime  = chainData.length
    ? chainData.reduce((s, c) => s + c.averageBlockTime, 0) / chainData.length
    : 0;

  return (
    <div className="bg-gray-800/30 rounded-xl p-6 border border-gray-700">
      {/* ── Header ── */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold flex items-center space-x-2">
          <Globe className="w-5 h-5" />
          <span>Live Multi-Chain Overview</span>
        </h2>
        <span className="text-sm text-gray-500">
          Monitoring {chainData.length} chain{chainData.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* ── Aggregate stat cards ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { icon: Database,  color: 'chain-polkadot', label: 'Total Blocks',    value: totalBlocks.toLocaleString() },
          { icon: Users,     color: 'chain-kusama',   label: 'Total Peers',     value: String(totalPeers) },
          { icon: Users,     color: 'chain-astar',    label: 'Active Accounts', value: totalAccounts.toLocaleString() },
          { icon: Clock,     color: 'chain-moonbeam', label: 'Avg Block Time',  value: `${avgBlockTime.toFixed(1)}s` },
        ].map(({ icon: Icon, color, label, value }) => (
          <div
            key={label}
            className={`bg-gradient-to-br from-${color}/20 to-${color}/5 rounded-xl p-4 border border-${color}/30`}
            style={{
              background: `linear-gradient(135deg, ${getChainHex(color)}33, ${getChainHex(color)}0d)`,
              border: `1px solid ${getChainHex(color)}4d`,
            }}
          >
            <div className="flex items-center space-x-3">
              <Icon className="w-5 h-5" style={{ color: getChainHex(color) }} />
              <div>
                <div className="text-2xl font-bold">{value}</div>
                <div className="text-xs text-gray-400">{label}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Chain card grid ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {chainData.map((chain, i) => (
          <motion.div
            key={chain.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.1 }}
          >
            <ChainCard chain={chain} isMonitoring={isMonitoring} index={i} />
          </motion.div>
        ))}
      </div>

      {/* ── PAPI code showcase ── */}
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
  kusama:   createClient(getSmProvider('wss://kusama-rpc.polkadot.io')),
  astar:    createClient(getSmProvider('wss://astar-rpc.dwellir.com')),
};

const apis = {
  polkadot: clients.polkadot.getTypedApi(polkadot),
  kusama:   clients.kusama.getTypedApi(kusama),
  astar:    clients.astar.getTypedApi(astar),
};

// Unified queries across all chains
const versions = await Promise.all([
  apis.polkadot.constants.System.Version(),
  apis.kusama.constants.System.Version(),
  apis.astar.constants.System.Version(),
]);`}
          </code>
        </pre>
        <p className="mt-4 text-sm text-gray-400">
          One consistent API surface for every chain — that's the PAPI advantage.
        </p>
      </div>
    </div>
  );
};

/* ── tiny helper so inline styles can reference chain colours ── */
function getChainHex(token: string): string {
  const map: Record<string, string> = {
    'chain-polkadot':  '#E6007A',
    'chain-kusama':    '#c8c8c8',
    'chain-astar':     '#0085FF',
    'chain-moonbeam':  '#5A4FCF',
    'chain-acala':     '#FF4F7D',
    'chain-parallel':  '#EF3A37',
  };
  return map[token] ?? '#0ea5e9';
}