import React, { useMemo } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell, Legend,
} from 'recharts';
import { motion } from 'framer-motion';
import { BarChart3, Trophy } from 'lucide-react';
import { CHAINS } from '../services/chainRegistry';

interface CrossChainCompareProps {
  selectedChains: string[];
}

/* ─── static metric definitions ─── */
interface MetricDef {
  key:           string;
  label:         string;
  unit:          string;
  higher:        boolean;                         // true = higher is better
  getValue:      (c: typeof CHAINS[0]) => number; // extract numeric value
  format:        (v: number) => string;
}

const METRICS: MetricDef[] = [
  {
    key: 'blockTime', label: 'Block Time', unit: 'seconds', higher: false,
    getValue: c => c.averageBlockTime,
    format:   v => `${v}s`,
  },
  {
    key: 'peers', label: 'Network Peers', unit: 'peers', higher: true,
    getValue: c => c.peers || 50,                   // seed fallback
    format:   v => v.toLocaleString(),
  },
  {
    key: 'accounts', label: 'Active Accounts', unit: 'accounts', higher: true,
    getValue: c => c.activeAccounts || 200_000,
    format:   v => (v / 1000).toFixed(0) + 'k',
  },
];

/* ─── colour lookup ─── */
function chainColor(id: string): string {
  const map: Record<string, string> = {
    polkadot: '#E6007A', kusama: '#c8c8c8', astar: '#0085FF',
    moonbeam: '#5A4FCF', acala: '#FF4F7D', parallel: '#EF3A37',
  };
  return map[id] ?? '#0ea5e9';
}

export const CrossChainCompare: React.FC<CrossChainCompareProps> = ({ selectedChains }) => {
  const chains = useMemo(
    () => selectedChains
      .map(id => CHAINS.find(c => c.id === id))
      .filter((c): c is typeof CHAINS[0] => !!c),
    [selectedChains]
  );

  /* build one dataset per metric */
  const datasets = useMemo(() =>
    METRICS.map(metric => {
      const data = chains.map(c => ({
        name:  c.name,
        id:    c.id,
        value: metric.getValue(c),
        color: chainColor(c.id),
      }));

      // determine best performer
      const best = [...data].sort((a, b) =>
        metric.higher ? b.value - a.value : a.value - b.value
      )[0];

      return { metric, data, bestId: best?.id ?? '' };
    }),
    [chains]
  );

  if (chains.length < 2) {
    return (
      <div className="bg-gray-800/30 rounded-xl p-8 border border-gray-700 text-center">
        <BarChart3 className="w-8 h-8 text-gray-600 mx-auto mb-3" />
        <p className="text-gray-500 text-sm">Select at least 2 chains to compare</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-800/30 rounded-xl p-6 border border-gray-700">
      {/* header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <BarChart3 className="w-5 h-5" />
          Cross-Chain Comparison
        </h2>
        <span className="text-xs text-gray-500">
          {chains.length} chains compared
        </span>
      </div>

      {/* one chart row per metric */}
      <div className="space-y-8">
        {datasets.map(({ metric, data, bestId }, idx) => (
          <motion.div
            key={metric.key}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: idx * 0.12 }}
          >
            {/* metric header row */}
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium text-gray-300">{metric.label}</h3>
              {bestId && (
                <div className="flex items-center gap-1.5 text-xs text-yellow-400">
                  <Trophy className="w-3.5 h-3.5" />
                  <span>
                    {CHAINS.find(c => c.id === bestId)?.name ?? ''} — best
                  </span>
                </div>
              )}
            </div>

            {/* bar chart */}
            <div className="h-40">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data} margin={{ top: 4, right: 8, bottom: 4, left: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
                  <XAxis
                    dataKey="name"
                    tick={{ fill: '#9ca3af', fontSize: 11 }}
                    axisLine={{ stroke: '#4b5563' }}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fill: '#6b7280', fontSize: 10 }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={metric.format}
                  />
                  <Tooltip
                    contentStyle={{
                      background: '#1f2937',
                      border: '1px solid #374151',
                      borderRadius: '8px',
                      color: '#f3f4f6',
                      fontSize: '12px',
                    }}
                    formatter={(value: number) => [metric.format(value), metric.label]}
                    cursor={{ fill: 'rgba(255,255,255,0.04)' }}
                  />
                  <Bar dataKey="value" radius={[4, 4, 0, 0]} animationDuration={800}>
                    {data.map((entry, i) => (
                      <Cell
                        key={i}
                        fill={entry.color}
                        fillOpacity={entry.id === bestId ? 1 : 0.5}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        ))}
      </div>

      {/* legend pills */}
      <div className="mt-6 pt-4 border-t border-gray-700 flex flex-wrap gap-3">
        {chains.map(c => (
          <div key={c.id} className="flex items-center gap-1.5">
            <span
              className="inline-block w-3 h-3 rounded-sm"
              style={{ backgroundColor: chainColor(c.id) }}
            />
            <span className="text-xs text-gray-400">{c.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};