import React from 'react';
import { SearchCheck, Shield, Cpu, Database } from 'lucide-react';

interface IntelligenceHeaderProps {
  account: string;
  setAccount: (account: string) => void;
  range: '24h' | '7d' | '30d' | '90d';
  setRange: (range: '24h' | '7d' | '30d' | '90d') => void;
  detectiveMode: boolean;
  setDetectiveMode: (mode: boolean) => void;
  alertCount: number;
}

export const IntelligenceHeader: React.FC<IntelligenceHeaderProps> = ({
  account,
  setAccount,
  range,
  setRange,
  detectiveMode,
  setDetectiveMode,
  alertCount,
}) => {
  return (
    <header className="border-b border-gray-700/50 bg-gray-900/80 backdrop-blur-xl sticky top-0 z-50 shadow-2xl">
      <div className="container mx-auto px-6 py-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          {/* Logo & Title */}
          <div className="flex items-center space-x-4">
            <div className="relative group">
              <div className="absolute -inset-2 bg-gradient-to-r from-detective-realtime via-detective-historical to-detective-fusion rounded-full blur-lg opacity-40 group-hover:opacity-60 transition-opacity duration-500"></div>
              <div className="relative p-3 bg-gradient-to-br from-gray-800 to-gray-900 rounded-full">
                <SearchCheck className="w-8 h-8 text-white animate-pulse" />
              </div>
            </div>
            <div>
              <h1 className="text-3xl font-black bg-gradient-to-r from-detective-realtime via-detective-historical to-detective-fusion bg-clip-text text-transparent animate-gradient">
                Blockchain Intelligence
              </h1>
              <p className="text-sm text-gray-400 font-medium">PAPI × Indexer Fusion Engine</p>
            </div>
          </div>

          {/* Controls */}
          <div className="flex flex-wrap items-center gap-4">
            {/* Detective Mode Toggle */}
            <div className="flex items-center space-x-3 bg-gray-800/50 px-4 py-2 rounded-xl border border-gray-700/50 hover:border-detective-fusion/50 transition-all duration-300">
              <Shield className={`w-5 h-5 transition-colors duration-300 ${detectiveMode ? 'text-detective-fusion' : 'text-gray-500'}`} />
              <span className="text-sm font-medium">Detective</span>
              <button
                onClick={() => setDetectiveMode(!detectiveMode)}
                className={`relative w-14 h-7 flex items-center rounded-full p-1 cursor-pointer transition-all duration-500 ${
                  detectiveMode 
                    ? 'bg-gradient-to-r from-detective-fusion to-green-400' 
                    : 'bg-gray-700'
                }`}
                aria-label="Toggle detective mode"
              >
                <div className={`bg-white w-5 h-5 rounded-full shadow-lg transition-transform duration-500 ${
                  detectiveMode ? 'transform translate-x-7' : ''
                }`}></div>
              </button>
            </div>

            {/* Data Sources Indicator */}
            <div className="flex items-center space-x-2 bg-gray-800/50 px-4 py-2 rounded-xl border border-gray-700/50">
              <Cpu className="w-5 h-5 text-detective-realtime animate-pulse" />
              <span className="text-sm font-medium">3 Sources</span>
            </div>

            {/* Alert Counter */}
            <div className="flex items-center space-x-2 bg-gradient-to-r from-detective-alert/20 to-orange-500/20 px-4 py-2 rounded-xl border border-detective-alert/40">
              <Database className="w-5 h-5 text-detective-alert" />
              <span className="text-sm font-bold">{alertCount} Alerts</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};