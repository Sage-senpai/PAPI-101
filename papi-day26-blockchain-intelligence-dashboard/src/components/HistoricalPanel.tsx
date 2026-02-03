import React, { useEffect, useState } from 'react';
import { History, Database, BarChart3, TrendingDown } from 'lucide-react';

interface HistoricalPanelProps {
  account: string;
  range: string;
}

export const HistoricalPanel: React.FC<HistoricalPanelProps> = ({ account, range }) => {
  const [historicalData, setHistoricalData] = useState({
    totalTx: 127,
    avgBalance: '142.45',
    trend: 'up' as 'up' | 'down' | 'stable',
    trendPercent: 15.2,
    activePatterns: 3,
  });

  useEffect(() => {
    // Simulate fetching historical data from indexer
    console.log(`📚 Fetching ${range} historical data from indexer for ${account.slice(0, 12)}...`);
    
    // Mock data based on time range
    const txCount = range === '24h' ? 5 : range === '7d' ? 34 : range === '30d' ? 127 : 456;
    setHistoricalData(prev => ({
      ...prev,
      totalTx: txCount,
    }));
  }, [account, range]);

  return (
    <div className="bg-gradient-to-br from-detective-historical/10 to-purple-900/10 rounded-2xl p-6 border border-detective-historical/30 hover:border-detective-historical/60 transition-all duration-500 hover:shadow-[0_0_30px_rgba(139,92,246,0.3)]">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold flex items-center space-x-3">
          <div className="p-2 bg-detective-historical/20 rounded-lg">
            <History className="w-6 h-6 text-detective-historical" />
          </div>
          <span>Historical Archive</span>
        </h3>
        <div className="flex items-center space-x-2 text-xs bg-detective-historical/20 px-3 py-1 rounded-full">
          <Database className="w-3 h-3 text-detective-historical" />
          <span className="font-medium text-detective-historical">Indexer</span>
        </div>
      </div>

      <div className="space-y-5">
        {/* Transaction Count */}
        <div className="bg-gray-900/50 rounded-xl p-5 border border-gray-700/50 hover:border-detective-historical/40 transition-all duration-300">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-400 uppercase tracking-wide">Total Transactions</span>
            <BarChart3 className="w-4 h-4 text-detective-historical" />
          </div>
          <div className="text-3xl font-black text-white mb-1">{historicalData.totalTx}</div>
          <div className="text-xs text-gray-400">in last {range}</div>
        </div>

        {/* Grid Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-900/50 rounded-xl p-4 border border-gray-700/50">
            <div className="text-xs text-gray-400 uppercase tracking-wide mb-2">Avg Balance</div>
            <div className="text-lg font-bold text-detective-historical">{historicalData.avgBalance}</div>
            <div className="text-xs text-gray-500">DOT</div>
          </div>
          <div className="bg-gray-900/50 rounded-xl p-4 border border-gray-700/50">
            <div className="text-xs text-gray-400 uppercase tracking-wide mb-2">Patterns</div>
            <div className="text-lg font-bold text-detective-historical">{historicalData.activePatterns}</div>
            <div className="text-xs text-gray-500">detected</div>
          </div>
        </div>

        {/* Trend Analysis */}
        <div className="bg-gradient-to-r from-purple-900/20 to-pink-900/20 rounded-xl p-4 border border-purple-500/30">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs text-gray-400 uppercase tracking-wide mb-1">Trend Analysis</div>
              <div className="flex items-center space-x-2">
                <div className={`text-xl font-bold ${
                  historicalData.trend === 'up' ? 'text-green-400' : 
                  historicalData.trend === 'down' ? 'text-red-400' : 'text-gray-400'
                }`}>
                  {historicalData.trend === 'up' ? '↗' : historicalData.trend === 'down' ? '↘' : '→'} 
                  {historicalData.trendPercent}%
                </div>
              </div>
            </div>
            {historicalData.trend === 'up' ? (
              <TrendingDown className="w-8 h-8 text-green-400 rotate-180" />
            ) : (
              <TrendingDown className="w-8 h-8 text-red-400" />
            )}
          </div>
        </div>

        {/* Data Source Info */}
        <div className="pt-4 border-t border-gray-700/50 flex items-center justify-between text-xs">
          <span className="text-gray-400">SubQuery + Subsquid</span>
          <span className="font-mono text-detective-historical">Synced</span>
        </div>
      </div>

      {/* Archive indicator */}
      <div className="mt-5 flex space-x-1">
        {[...Array(20)].map((_, i) => (
          <div 
            key={i} 
            className="flex-1 h-1 bg-detective-historical/20 rounded-full"
            style={{
              opacity: 1 - (i * 0.04),
              animation: `pulse ${2 + i * 0.1}s infinite`
            }}
          ></div>
        ))}
      </div>
    </div>
  );
};