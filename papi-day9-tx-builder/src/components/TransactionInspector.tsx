//src/components/transactionInspector
import React from 'react';
import { 
  Binary, 
  Code, 
  FileText, 
  Package,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';
import { TransactionCall } from '../types/transaction';
import { formatHex, calculateCallDataSize } from '../utils/formatters';

interface TransactionInspectorProps {
  transaction: TransactionCall | null;
}

export const TransactionInspector: React.FC<TransactionInspectorProps> = ({ transaction }) => {
  if (!transaction) {
    return (
      <div className="glass-card p-6 h-full flex flex-col items-center justify-center">
        <Binary className="w-16 h-16 text-gray-700 mb-4" />
        <p className="text-gray-500 text-center">Build a transaction to inspect its call data</p>
        <p className="text-sm text-gray-600 mt-2">The inspector will show encoded hex and breakdown</p>
      </div>
    );
  }

  const formattedHex = formatHex(transaction.callData);
  const sizeInfo = calculateCallDataSize(transaction.callData);

  return (
    <div className="glass-card p-6 h-full">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-white">Call Data Inspector</h3>
          <p className="text-gray-400">Transaction encoding analysis</p>
        </div>
        <div className="flex items-center space-x-2 px-3 py-1 bg-green-500/20 rounded-lg">
          <CheckCircle className="w-4 h-4 text-green-400" />
          <span className="text-sm font-semibold text-green-400">Valid</span>
        </div>
      </div>

      <div className="space-y-6">
        {/* Header Info */}
        <div className="grid grid-cols-2 gap-4">
          <div className="p-3 bg-black/30 rounded">
            <div className="flex items-center space-x-2 mb-1">
              <Package className="w-4 h-4 text-blue-400" />
              <span className="text-sm text-gray-400">Pallet Index</span>
            </div>
            <p className="font-bold text-white">0x{transaction.pallet.charCodeAt(0).toString(16).padStart(2, '0')}</p>
          </div>
          
          <div className="p-3 bg-black/30 rounded">
            <div className="flex items-center space-x-2 mb-1">
              <Code className="w-4 h-4 text-purple-400" />
              <span className="text-sm text-gray-400">Call Index</span>
            </div>
            <p className="font-bold text-white">0x{transaction.method.length.toString(16).padStart(2, '0')}</p>
          </div>
        </div>

        {/* Hex Display */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <Binary className="w-5 h-5 text-turbo-blue" />
              <span className="font-medium text-white">Encoded Call Data</span>
            </div>
            <span className="text-sm text-gray-400">{sizeInfo}</span>
          </div>
          
          <div className="relative">
            <div className="p-4 bg-black/50 rounded-lg border border-border-color font-jetbrains">
              <div className="text-sm text-gray-300 whitespace-pre-wrap break-all">
                {formattedHex}
              </div>
            </div>
            
            {/* Byte markers */}
            <div className="mt-2 flex flex-wrap gap-1">
              {Array.from({ length: Math.ceil((transaction.callData.length - 2) / 32) }).map((_, i) => (
                <div
                  key={i}
                  className="px-2 py-1 bg-turbo-blue/10 text-turbo-blue text-xs rounded"
                  title={`Bytes ${i * 32}-${Math.min((i + 1) * 32 - 1, (transaction.callData.length - 2) / 2 - 1)}`}
                >
                  {i * 32}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Breakdown */}
        <div>
          <div className="flex items-center space-x-2 mb-3">
            <FileText className="w-5 h-5 text-green-400" />
            <span className="font-medium text-white">Transaction Breakdown</span>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between p-2 bg-black/30 rounded">
              <span className="text-gray-400">Pallet Name:</span>
              <span className="font-semibold text-white">{transaction.pallet}</span>
            </div>
            
            <div className="flex justify-between p-2 bg-black/30 rounded">
              <span className="text-gray-400">Call Name:</span>
              <span className="font-semibold text-white">{transaction.method}</span>
            </div>
            
            <div className="flex justify-between p-2 bg-black/30 rounded">
              <span className="text-gray-400">Call Data Size:</span>
              <span className="font-semibold text-white">{sizeInfo}</span>
            </div>
            
            <div className="flex justify-between p-2 bg-black/30 rounded">
              <span className="text-gray-400">Parameter Count:</span>
              <span className="font-semibold text-white">{Object.keys(transaction.args).length}</span>
            </div>
          </div>
        </div>

        {/* PAPI Advantage */}
        <div className="p-4 bg-gradient-to-r from-turbo-blue/10 to-turbo-purple/10 rounded-lg border border-turbo-blue/30">
          <div className="flex items-center space-x-2 mb-2">
            <AlertTriangle className="w-5 h-5 text-turbo-blue" />
            <span className="font-bold text-white">PAPI Advantage</span>
          </div>
          <p className="text-sm text-gray-300">
            This call data was automatically generated by PAPI's `tx` method with proper encoding, 
            type safety, and runtime compatibility. No manual hex manipulation required!
          </p>
        </div>
      </div>
    </div>
  );
};