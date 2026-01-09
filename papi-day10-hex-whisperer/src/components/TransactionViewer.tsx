//src/components/TransactionViewer
import React from 'react';
import { 
  FileText, 
  Code, 
  Package, 
  CheckCircle, 
  XCircle,
  Copy,
  Share2,
  Download
} from 'lucide-react';
import type { DecodedTransaction } from '../types/decoding';
import { calculateHexSize } from '../utils/hexUtils';

interface TransactionViewerProps {
  decoded: DecodedTransaction | null;
}

export const TransactionViewer: React.FC<TransactionViewerProps> = ({ decoded }) => {
  if (!decoded) {
    return (
      <div className="crystal-card p-6 h-full flex flex-col items-center justify-center">
        <FileText className="w-16 h-16 text-gray-700 mb-4" />
        <p className="text-gray-500 text-center">Decoded transaction will appear here</p>
        <p className="text-sm text-gray-600 mt-2">Try decoding an example or paste your own hex</p>
      </div>
    );
  }

  const handleCopyJSON = () => {
    navigator.clipboard.writeText(JSON.stringify(decoded, null, 2));
  };

  const handleDownloadJSON = () => {
    const blob = new Blob([JSON.stringify(decoded, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `decoded-tx-${new Date().toISOString()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="crystal-card p-6 h-full magic-reveal">
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center space-x-2">
            {decoded.isValid ? (
              <CheckCircle className="w-6 h-6 text-success-emerald" />
            ) : (
              <XCircle className="w-6 h-6 text-red-500" />
            )}
            <h3 className="text-2xl font-bold text-white">
              Decoded Transaction
            </h3>
          </div>
          <p className="text-gray-400">
            {decoded.isValid ? 'Successfully decoded' : 'Failed to decode'}
          </p>
        </div>
        
        <div className="flex space-x-2">
          <button
            onClick={handleCopyJSON}
            className="p-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
            title="Copy JSON"
          >
            <Copy className="w-4 h-4" />
          </button>
          <button
            onClick={handleDownloadJSON}
            className="p-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
            title="Download JSON"
          >
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Status Badge */}
      <div className={`mb-6 p-3 rounded-lg border ${
        decoded.isValid 
          ? 'bg-success-emerald/10 border-success-emerald/30' 
          : 'bg-red-500/10 border-red-500/30'
      }`}>
        <div className="flex items-center justify-between">
          <div>
            <p className={`font-semibold ${decoded.isValid ? 'text-success-emerald' : 'text-red-400'}`}>
              {decoded.isValid ? '✓ Valid Transaction' : '✗ Invalid Transaction'}
            </p>
            <p className="text-sm text-gray-400">
              Decoded at {decoded.decodedAt.toLocaleTimeString()}
            </p>
          </div>
          {decoded.metadata && (
            <div className="text-right">
              <p className="text-sm text-gray-300">
                Pallet #{decoded.metadata.palletIndex} • Call #{decoded.metadata.callIndex}
              </p>
              <p className="text-xs text-gray-500">
                {calculateHexSize(decoded.callData)}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Error Display */}
      {decoded.error && (
        <div className="mb-6 p-4 bg-red-900/20 border border-red-500/30 rounded-lg">
          <p className="font-semibold text-red-300">Error Details</p>
          <p className="text-sm text-gray-300 mt-1">{decoded.error}</p>
        </div>
      )}

      {/* Transaction Details */}
      <div className="space-y-6">
        {/* Pallet & Method */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-black/30 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <Package className="w-4 h-4 text-purple-400" />
              <span className="text-sm text-gray-400">Pallet</span>
            </div>
            <p className="text-xl font-bold text-white">{decoded.pallet}</p>
          </div>
          
          <div className="p-4 bg-black/30 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <Code className="w-4 h-4 text-blue-400" />
              <span className="text-sm text-gray-400">Method</span>
            </div>
            <p className="text-xl font-bold text-white">{decoded.method}</p>
          </div>
        </div>

        {/* Arguments */}
        {Object.keys(decoded.args).length > 0 && (
          <div>
            <h4 className="font-semibold text-white mb-3">Arguments</h4>
            <div className="p-4 bg-black/30 rounded-lg">
              <pre className="text-sm text-gray-300 font-mono-magic whitespace-pre-wrap overflow-x-auto">
                {JSON.stringify(decoded.args, (key, value) => {
                  if (typeof value === 'bigint') {
                    return value.toString();
                  }
                  if (value && typeof value === 'object' && value.__kind) {
                    return `${value.__kind}: ${JSON.stringify(value.value)}`;
                  }
                  return value;
                }, 2)}
              </pre>
            </div>
          </div>
        )}

        {/* Metadata */}
        {decoded.metadata && (
          <div>
            <h4 className="font-semibold text-white mb-3">Technical Details</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="p-3 bg-black/30 rounded">
                <p className="text-xs text-gray-400">Pallet Index</p>
                <p className="font-bold text-white">0x{decoded.metadata.palletIndex.toString(16).toUpperCase()}</p>
              </div>
              <div className="p-3 bg-black/30 rounded">
                <p className="text-xs text-gray-400">Call Index</p>
                <p className="font-bold text-white">0x{decoded.metadata.callIndex.toString(16).toUpperCase()}</p>
              </div>
              <div className="p-3 bg-black/30 rounded">
                <p className="text-xs text-gray-400">Bytes</p>
                <p className="font-bold text-white">{decoded.metadata.bytes}</p>
              </div>
              <div className="p-3 bg-black/30 rounded">
                <p className="text-xs text-gray-400">Version</p>
                <p className="font-bold text-white">SCALE v{decoded.metadata.version}</p>
              </div>
            </div>
          </div>
        )}

        {/* PAPI Magic Note */}
        <div className="p-4 bg-gradient-to-r from-magic-purple/10 to-sparkle-blue/10 rounded-lg border border-magic-purple/30">
          <div className="flex items-start space-x-3">
            <Share2 className="w-5 h-5 text-magic-purple mt-0.5" />
            <div>
              <p className="font-bold text-white">PAPI's txFromCallData Magic</p>
              <p className="text-sm text-gray-300 mt-1">
                This decoding was made possible by PAPI's `txFromCallData` method, which uses 
                runtime metadata to understand hex structure. No manual decoding tables needed!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};