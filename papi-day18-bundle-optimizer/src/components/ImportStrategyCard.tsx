import React from 'react';
import { ImportStrategy, formatBytes } from '../utils/bundleAnalyzer';
import { Check, Zap, Package, Cpu } from 'lucide-react';

interface ImportStrategyCardProps {
  strategy: ImportStrategy;
  isSelected: boolean;
  onSelect: () => void;
}

export const ImportStrategyCard: React.FC<ImportStrategyCardProps> = ({
  strategy,
  isSelected,
  onSelect,
}) => {
  const getIcon = () => {
    switch (strategy.id) {
      case 'monolithic': return <Package className="w-5 h-5" />;
      case 'dynamic-client': return <Zap className="w-5 h-5" />;
      case 'fully-dynamic': return <Cpu className="w-5 h-5" />;
      default: return <Package className="w-5 h-5" />;
    }
  };

  const getColor = () => {
    switch (strategy.performanceScore) {
      case 35: return 'border-red-500/30';
      case 75: return 'border-yellow-500/30';
      case 85: return 'border-green-500/30';
      case 90: return 'border-emerald-500/30';
      default: return 'border-gray-700';
    }
  };

  return (
    <button
      onClick={onSelect}
      className={`text-left p-5 rounded-xl border-2 transition-all duration-300 ${
        isSelected 
          ? 'bg-gray-800/50 border-primary-500 shadow-lg shadow-primary-500/10' 
          : `bg-gray-900/30 hover:bg-gray-800/30 ${getColor()}`
      }`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className={`p-2 rounded-lg ${
            isSelected ? 'bg-primary-500/20' : 'bg-gray-800'
          }`}>
            {getIcon()}
          </div>
          <div>
            <h3 className="font-semibold">{strategy.name}</h3>
            <p className="text-xs text-gray-500 mt-1">
              {strategy.modules.length} module{strategy.modules.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>
        
        {isSelected && (
          <div className="w-6 h-6 bg-primary-500 rounded-full flex items-center justify-center">
            <Check className="w-4 h-4 text-white" />
          </div>
        )}
      </div>
      
      <p className="text-sm text-gray-400 mb-4">{strategy.description}</p>
      
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Total Size:</span>
          <span className="font-mono">{formatBytes(strategy.totalSize)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Gzipped:</span>
          <span className="font-mono">{formatBytes(strategy.totalGzipped)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Score:</span>
          <span className={`font-semibold ${
            strategy.performanceScore >= 80 ? 'text-green-500' :
            strategy.performanceScore >= 60 ? 'text-yellow-500' :
            'text-red-500'
          }`}>
            {strategy.performanceScore}/100
          </span>
        </div>
      </div>
      
      <div className="mt-4 pt-4 border-t border-gray-800">
        <div className="text-xs text-gray-500">Includes:</div>
        <div className="flex flex-wrap gap-1 mt-1">
          {strategy.modules.map((module, idx) => (
            <span 
              key={idx}
              className="px-2 py-0.5 bg-gray-800 rounded text-xs font-mono"
            >
              {module.name}
            </span>
          ))}
        </div>
      </div>
    </button>
  );
};