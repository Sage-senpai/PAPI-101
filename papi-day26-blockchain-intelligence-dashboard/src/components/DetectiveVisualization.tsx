import React, { useState, useEffect } from 'react';
import { Search, Eye, FileSearch, Network, Shield } from 'lucide-react';
import toast from 'react-hot-toast';

interface DetectiveVisualizationProps {
  account: string;
  detectiveMode: boolean;
}

interface Investigation {
  id: string;
  title: string;
  status: 'open' | 'investigating' | 'solved';
  progress: number;
}

export const DetectiveVisualization: React.FC<DetectiveVisualizationProps> = ({ 
  account, 
  detectiveMode 
}) => {
  const [investigations, setInvestigations] = useState<Investigation[]>([]);
  const [scanning, setScanning] = useState(false);

  useEffect(() => {
    if (detectiveMode) {
      setInvestigations([
        { id: '1', title: 'Weekend Activity Spike', status: 'investigating', progress: 65 },
        { id: '2', title: 'Balance Correlation Analysis', status: 'open', progress: 25 },
        { id: '3', title: 'Address Clustering', status: 'solved', progress: 100 },
      ]);
      
      console.log('🕵️ Detective mode engaged - scanning blockchain for patterns...');
    }
  }, [detectiveMode, account]);

  const runScan = () => {
    setScanning(true);
    console.log('🔍 Running deep investigation scan...');
    
    setTimeout(() => {
      toast.success('Investigation scan complete!', {
        icon: '🔍',
        duration: 3000,
      });
      setScanning(false);
    }, 3000);
  };

  if (!detectiveMode) {
    return (
      <div className="bg-gray-800/40 rounded-2xl p-8 border border-gray-700/60 text-center">
        <Shield className="w-16 h-16 text-gray-600 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-gray-400 mb-2">Detective Mode Disabled</h3>
        <p className="text-sm text-gray-500">Enable detective mode to access investigation tools</p>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-purple-900/10 to-pink-900/10 rounded-2xl p-6 border border-purple-500/30 hover:border-purple-500/60 transition-all duration-500 hover:shadow-[0_0_30px_rgba(168,85,247,0.3)]">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold flex items-center space-x-3">
          <div className="p-2 bg-purple-500/20 rounded-lg">
            <Search className="w-6 h-6 text-purple-400" />
          </div>
          <span>Investigation Center</span>
        </h3>
        <div className="flex items-center space-x-2">
          <Eye className={`w-4 h-4 ${scanning ? 'text-purple-400 animate-pulse' : 'text-gray-400'}`} />
          <span className="text-xs font-medium text-gray-400">
            {scanning ? 'Scanning...' : 'Ready'}
          </span>
        </div>
      </div>

      {/* Active Investigations */}
      <div className="space-y-3 mb-6">
        {investigations.map((inv, idx) => (
          <div
            key={inv.id}
            className={`bg-gray-900/50 rounded-xl p-4 border transition-all duration-300 ${
              inv.status === 'solved' ? 'border-green-500/30' :
              inv.status === 'investigating' ? 'border-purple-500/30 shadow-[0_0_15px_rgba(168,85,247,0.2)]' :
              'border-gray-700/50'
            }`}
            style={{ animationDelay: `${idx * 100}ms` }}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <FileSearch className={`w-4 h-4 ${
                  inv.status === 'solved' ? 'text-green-400' :
                  inv.status === 'investigating' ? 'text-purple-400 animate-pulse' :
                  'text-gray-400'
                }`} />
                <span className="font-semibold text-sm">{inv.title}</span>
              </div>
              <span className={`text-xs px-2 py-1 rounded-full uppercase font-bold ${
                inv.status === 'solved' ? 'bg-green-500/20 text-green-400' :
                inv.status === 'investigating' ? 'bg-purple-500/20 text-purple-400' :
                'bg-gray-500/20 text-gray-400'
              }`}>
                {inv.status}
              </span>
            </div>

            {/* Progress Bar */}
            <div className="relative h-2 bg-gray-800 rounded-full overflow-hidden">
              <div 
                className={`absolute top-0 left-0 h-full rounded-full transition-all duration-1000 ${
                  inv.status === 'solved' ? 'bg-gradient-to-r from-green-500 to-emerald-400' :
                  inv.status === 'investigating' ? 'bg-gradient-to-r from-purple-500 to-pink-400 animate-pulse' :
                  'bg-gradient-to-r from-gray-500 to-slate-400'
                }`}
                style={{ width: `${inv.progress}%` }}
              ></div>
            </div>
            <div className="text-xs text-gray-400 mt-1 text-right">{inv.progress}% complete</div>
          </div>
        ))}
      </div>

      {/* Scan Button */}
      <button
        onClick={runScan}
        disabled={scanning}
        className={`w-full py-3 rounded-xl font-bold text-white transition-all duration-300 flex items-center justify-center space-x-2 ${
          scanning 
            ? 'bg-gray-700 cursor-not-allowed' 
            : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 hover:shadow-[0_0_20px_rgba(168,85,247,0.5)]'
        }`}
      >
        {scanning ? (
          <>
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            <span>Scanning Blockchain...</span>
          </>
        ) : (
          <>
            <Search className="w-5 h-5" />
            <span>Run Deep Investigation</span>
          </>
        )}
      </button>

      {/* Network Graph Preview */}
      <div className="mt-6 pt-6 border-t border-gray-700/50">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold text-gray-400 uppercase">Address Network</span>
          <Network className="w-4 h-4 text-purple-400" />
        </div>
        <div className="relative h-32 bg-gray-900/50 rounded-xl overflow-hidden border border-gray-700/50">
          {/* Simulated network visualization */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative">
              <div className="w-3 h-3 bg-purple-400 rounded-full animate-ping"></div>
              <div className="absolute top-0 left-0 w-3 h-3 bg-purple-500 rounded-full"></div>
            </div>
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="absolute w-2 h-2 bg-pink-400 rounded-full"
                style={{
                  top: `${20 + Math.random() * 60}%`,
                  left: `${20 + Math.random() * 60}%`,
                  animation: `pulse ${2 + i * 0.5}s infinite`,
                  animationDelay: `${i * 0.2}s`,
                }}
              ></div>
            ))}
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-transparent"></div>
        </div>
        <div className="text-xs text-gray-500 mt-2">
          7 connected addresses • 23 transactions • 3 clusters
        </div>
      </div>
    </div>
  );
};