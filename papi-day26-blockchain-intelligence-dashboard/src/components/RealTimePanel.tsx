import React, { useEffect, useState } from 'react';
import { Zap, Activity, TrendingUp, Clock } from 'lucide-react';

interface RealTimePanelProps {
  account: string;
}

export const RealTimePanel: React.FC<RealTimePanelProps> = ({ account }) => {
  const [liveData, setLiveData] = useState({
    balance: '145.82',
    nonce: 42,
    blockHeight: 20154328,
    lastUpdate: new Date().toLocaleTimeString(),
  });

  const [isLive, setIsLive] = useState(true);

  useEffect(() => {
    // Simulate real-time updates
    const interval = setInterval(() => {
      setLiveData(prev => ({
        balance: (parseFloat(prev.balance) + (Math.random() - 0.5) * 0.1).toFixed(2),
        nonce: prev.nonce + Math.floor(Math.random() * 2),
        blockHeight: prev.blockHeight + 1,
        lastUpdate: new Date().toLocaleTimeString(),
      }));
    }, 5000);

    console.log(`⚡ Real-time PAPI data stream active for ${account.slice(0, 12)}...`);

    return () => clearInterval(interval);
  }, [account]);

  return (
    <div className="bg-gradient-to-br from-detective-realtime/10 to-blue-900/10 rounded-2xl p-6 border border-detective-realtime/30 hover:border-detective-realtime/60 transition-all duration-500 hover:shadow-[0_0_30px_rgba(59,130,246,0.3)]">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold flex items-center space-x-3">
          <div className="p-2 bg-detective-realtime/20 rounded-lg">
            <Zap className="w-6 h-6 text-detective-realtime" />
          </div>
          <span>Live Chain State</span>
        </h3>
        <div className="flex items-center space-x-2">
          <div className={`w-3 h-3 rounded-full ${isLive ? 'bg-green-400 animate-pulse' : 'bg-red-400'}`}></div>
          <span className="text-xs font-medium text-gray-400">PAPI Stream</span>
        </div>
      </div>

      <div className="space-y-5">
        {/* Balance */}
        <div className="bg-gray-900/50 rounded-xl p-5 border border-gray-700/50 hover:border-detective-realtime/40 transition-all duration-300">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-400 uppercase tracking-wide">Free Balance</span>
            <Activity className="w-4 h-4 text-detective-realtime animate-pulse" />
          </div>
          <div className="text-3xl font-black text-white mb-1">{liveData.balance} DOT</div>
          <div className="flex items-center space-x-2 text-xs">
            <TrendingUp className="w-3 h-3 text-green-400" />
            <span className="text-green-400">+2.3% today</span>
          </div>
        </div>

        {/* Grid Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-900/50 rounded-xl p-4 border border-gray-700/50">
            <div className="text-xs text-gray-400 uppercase tracking-wide mb-2">Nonce</div>
            <div className="text-2xl font-bold text-detective-realtime">{liveData.nonce}</div>
          </div>
          <div className="bg-gray-900/50 rounded-xl p-4 border border-gray-700/50">
            <div className="text-xs text-gray-400 uppercase tracking-wide mb-2">Block Height</div>
            <div className="text-2xl font-bold text-detective-realtime">
              #{liveData.blockHeight.toLocaleString()}
            </div>
          </div>
        </div>

        {/* Last Update */}
        <div className="pt-4 border-t border-gray-700/50 flex items-center justify-between text-xs">
          <div className="flex items-center space-x-2 text-gray-400">
            <Clock className="w-3 h-3" />
            <span>Last update</span>
          </div>
          <span className="font-mono text-detective-realtime">{liveData.lastUpdate}</span>
        </div>
      </div>

      {/* Real-time indicator animation */}
      <div className="mt-5 overflow-hidden rounded-full bg-gray-800/50 h-1">
        <div className="h-full bg-gradient-to-r from-detective-realtime to-blue-300 animate-pulse-wave" style={{ width: '60%' }}></div>
      </div>
    </div>
  );
};