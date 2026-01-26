import React from 'react';
import { ChainConstant } from '../types/constants';
import { Hash, FileText, Shield, Zap, AlertTriangle } from 'lucide-react';
import { formatValue } from '../utils/formatters';
interface ConstantCardProps {
  constant: ChainConstant;
}
export const ConstantCard: React.FC<ConstantCardProps> = ({ constant }) => {
  const getImportanceIcon = () => {
    switch (constant.importance) {
      case 'high': return <AlertTriangle className="w-4 h-4 text-danger-500" />;
      case 'medium': return <Shield className="w-4 h-4 text-warning-500" />;
      case 'low': return <Zap className="w-4 h-4 text-success-500" />;
      default: return <Zap className="w-4 h-4" />;
    }
  };
  const getCategoryColor = () => {
    switch (constant.category) {
      case 'system': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'balances': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'staking': return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      case 'governance': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };
  return (
    <div className="bg-gray-800/30 rounded-xl p-6 border border-gray-700 hover:border-primary-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary-500/10 group">
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="flex items-center space-x-2 mb-2">
            <Hash className="w-4 h-4 text-gray-500" />
            <span className="font-mono text-sm text-gray-400">{constant.pallet}</span>
          </div>
          <h3 className="text-lg font-semibold group-hover:text-primary-400 transition-colors">
            {constant.name}
          </h3>
        </div>
        <div className="flex items-center space-x-2">
          {getImportanceIcon()}
          <span className={`px-2 py-1 rounded text-xs ${getCategoryColor()}`}>
            {constant.category}
          </span>
        </div>
      </div>
      <p className="text-gray-300 mb-4 text-sm">{constant.description}</p>
      <div className="mb-4 p-3 bg-gray-900/50 rounded-lg border border-gray-700">
        <div className="flex justify-between items-center mb-1">
          <span className="text-xs text-gray-500">Value</span>
          <span className="text-xs font-mono text-gray-400">{constant.type}</span>
        </div>
        <div className="font-mono text-lg break-all">
          {formatValue(constant.value)}
        </div>
      </div>
      {constant.documentation.length > 0 && (
        <div className="pt-4 border-t border-gray-700">
          <div className="flex items-center space-x-2 mb-2">
            <FileText className="w-4 h-4 text-gray-500" />
            <span className="text-xs text-gray-500">Documentation</span>
          </div>
          <p className="text-sm text-gray-400 italic">
            {constant.documentation[0]}
          </p>
        </div>
      )}
      <div className="mt-4 pt-4 border-t border-gray-700">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 rounded-full bg-green-500"></div>
            <span className="text-gray-500">Type-safe via PAPI</span>
          </div>
          <span className="text-gray-500">Chain: {constant.chain}</span>
        </div>
      </div>
    </div>
  );
};