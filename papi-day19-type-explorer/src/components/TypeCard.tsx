import React from 'react';
import { FileCode, Zap, Database } from 'lucide-react';

interface TypeCardProps {
  type: {
    name: string;
    category: string;
    description: string;
    params?: Array<{ name: string; type: string; required: boolean }>;
    value?: string;
    keyType?: string;
    valueType?: string;
    returnType?: string;
    default?: string;
    source?: string;
  };
}

export const TypeCard: React.FC<TypeCardProps> = ({ type }) => {
  const getIcon = () => {
    switch (type.category) {
      case 'Transaction': return <Zap className="w-5 h-5 text-yellow-500" />;
      case 'Constant': return <Database className="w-5 h-5 text-blue-500" />;
      case 'Storage': return <Database className="w-5 h-5 text-green-500" />;
      default: return <FileCode className="w-5 h-5" />;
    }
  };

  return (
    <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700 hover:border-primary-500 transition-colors">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          {getIcon()}
          <div>
            <h4 className="font-bold text-lg">{type.name}</h4>
            <span className="text-xs px-2 py-1 bg-gray-700 rounded-full">
              {type.category}
            </span>
          </div>
        </div>
        {type.source && (
          <span className="text-xs text-gray-400">{type.source}</span>
        )}
      </div>
      
      <p className="text-gray-300 mb-4">{type.description}</p>
      
      {type.params && (
        <div className="space-y-2 mb-4">
          <p className="text-sm text-gray-400">Parameters:</p>
          {type.params.map((param, idx) => (
            <div key={idx} className="flex items-center justify-between text-sm">
              <div className="flex items-center space-x-2">
                <span className="font-mono">{param.name}</span>
                <span className="text-gray-500">→</span>
                <span className="font-mono text-primary-400">{param.type}</span>
              </div>
              {param.required && (
                <span className="text-xs px-2 py-0.5 bg-red-500/20 text-red-300 rounded">
                  required
                </span>
              )}
            </div>
          ))}
        </div>
      )}
      
      {type.value && (
        <div className="mb-4">
          <p className="text-sm text-gray-400 mb-1">Value:</p>
          <code className="font-mono text-sm bg-gray-900 px-3 py-1 rounded">
            {type.value}
          </code>
        </div>
      )}
      
      {type.keyType && type.valueType && (
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-sm text-gray-400 mb-1">Key Type:</p>
            <code className="font-mono text-sm bg-gray-900 px-3 py-1 rounded">
              {type.keyType}
            </code>
          </div>
          <div>
            <p className="text-sm text-gray-400 mb-1">Value Type:</p>
            <code className="font-mono text-sm bg-gray-900 px-3 py-1 rounded">
              {type.valueType}
            </code>
          </div>
        </div>
      )}
      
      {type.returnType && (
        <div>
          <p className="text-sm text-gray-400 mb-1">Returns:</p>
          <code className="font-mono text-sm bg-gray-900 px-3 py-1 rounded">
            {type.returnType}
          </code>
        </div>
      )}
    </div>
  );
};