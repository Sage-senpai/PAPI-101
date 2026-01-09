//src/components/ByteInspector.tsx
import React from 'react';
import { Binary, Hash, Eye, Info } from 'lucide-react';
import type { ByteAnalysis } from '../types/decoding';
import { decodeByte } from '../utils/byteParser';

interface ByteInspectorProps {
  bytes: ByteAnalysis[];
  decoded: any;
}

export const ByteInspector: React.FC<ByteInspectorProps> = ({ bytes, decoded }) => {
  if (bytes.length === 0) {
    return (
      <div className="crystal-card p-6 h-full flex flex-col items-center justify-center">
        <Binary className="w-16 h-16 text-gray-700 mb-4" />
        <p className="text-gray-500 text-center">Decode hex to inspect bytes</p>
      </div>
    );
  }

  // Group bytes into rows of 16 for display
  const byteRows = [];
  for (let i = 0; i < bytes.length; i += 16) {
    byteRows.push(bytes.slice(i, i + 16));
  }

  return (
    <div className="crystal-card p-6 h-full">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-white flex items-center">
            <Eye className="w-5 h-5 mr-2 text-sparkle-blue" />
            Byte Inspector
          </h3>
          <p className="text-gray-400">Visual breakdown of hex bytes</p>
        </div>
        <div className="text-sm text-gray-400">
          {bytes.length} bytes • {byteRows.length} rows
        </div>
      </div>

      {/* Legend */}
      <div className="mb-6 p-3 bg-black/30 rounded-lg">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-purple-500/30 border border-purple-500/50 rounded"></div>
            <span className="text-xs text-gray-300">Pallet Index</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-blue-500/30 border border-blue-500/50 rounded"></div>
            <span className="text-xs text-gray-300">Call Index</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500/30 border border-green-500/50 rounded"></div>
            <span className="text-xs text-gray-300">Length Prefix</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-yellow-500/30 border border-yellow-500/50 rounded"></div>
            <span className="text-xs text-gray-300">Parameter Data</span>
          </div>
        </div>
      </div>

      {/* Byte Grid */}
      <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
        {byteRows.map((row, rowIndex) => (
          <div key={rowIndex} className="border border-border-magic/30 rounded-lg overflow-hidden">
            <div className="px-3 py-2 bg-black/30 border-b border-border-magic/30">
              <div className="flex items-center justify-between">
                <span className="text-sm font-mono-magic text-gray-400">
                  Offset: 0x{(rowIndex * 16).toString(16).padStart(4, '0').toUpperCase()}
                </span>
                <span className="text-xs text-gray-500">
                  Bytes {rowIndex * 16} - {rowIndex * 16 + row.length - 1}
                </span>
              </div>
            </div>
            
            <div className="p-3">
              <div className="grid grid-cols-8 md:grid-cols-16 gap-1">
                {row.map((byte) => (
                  <div key={byte.position} className="text-center">
                    <div
                      className={`hex-byte ${byte.color} ${
                        byte.highlight ? 'ring-1 ring-white/20' : ''
                      }`}
                      title={byte.meaning}
                    >
                      {byte.byte.toUpperCase()}
                    </div>
                    <div className="byte-label">
                      {byte.position < 10 ? byte.position : '...'}
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Row description */}
              {rowIndex === 0 && row.length >= 2 && (
                <div className="mt-3 p-2 bg-black/20 rounded text-xs">
                  <div className="flex items-center space-x-2 mb-1">
                    <Info className="w-3 h-3 text-sparkle-blue" />
                    <span className="font-semibold text-white">First two bytes:</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <span className="text-gray-400">Pallet: </span>
                      <span className="text-purple-300">
                        {decodeByte(row[0].byte, 'pallet')}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-400">Call: </span>
                      <span className="text-blue-300">
                        {decodeByte(row[1].byte, 'call')}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Byte Analysis Summary */}
      {bytes.length > 0 && (
        <div className="mt-6 p-4 bg-gradient-to-r from-magic-purple/10 to-sparkle-blue/10 rounded-lg border border-magic-purple/30">
          <div className="flex items-center space-x-2 mb-2">
            <Hash className="w-5 h-5 text-magic-purple" />
            <span className="font-bold text-white">Byte Analysis</span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="text-center p-2 bg-black/30 rounded">
              <div className="text-2xl font-bold text-purple-300">{bytes[0]?.byte || '00'}</div>
              <div className="text-xs text-gray-400">Pallet Index</div>
            </div>
            <div className="text-center p-2 bg-black/30 rounded">
              <div className="text-2xl font-bold text-blue-300">{bytes[1]?.byte || '00'}</div>
              <div className="text-xs text-gray-400">Call Index</div>
            </div>
            <div className="text-center p-2 bg-black/30 rounded">
              <div className="text-2xl font-bold text-white">{bytes.length}</div>
              <div className="text-xs text-gray-400">Total Bytes</div>
            </div>
            <div className="text-center p-2 bg-black/30 rounded">
              <div className="text-2xl font-bold text-green-300">
                {Math.floor(bytes.length / 16) + 1}
              </div>
              <div className="text-xs text-gray-400">Hex Rows</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};