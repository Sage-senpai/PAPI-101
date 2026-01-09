//src/components/HexDecoder.tsx
import React, { useState, useEffect } from 'react';
import { Wand2, Search, Copy, Check, AlertCircle, Sparkles, History } from 'lucide-react';
import { useHexDecoder } from '../hooks/useHexDecoder';
import type { TypedApi } from 'polkadot-api';
import { dot } from '@polkadot-api/descriptors';
import { isValidHex, formatHex, calculateHexSize } from '../utils/hexUtils';
import { EXAMPLE_TRANSACTIONS } from '../utils/transactionExamples';

interface HexDecoderProps {
  api: TypedApi<typeof dot> | null;
  onDecode: (hex: string) => void;
}

export const HexDecoder: React.FC<HexDecoderProps> = ({ api, onDecode }) => {
  const { state, decodeHex } = useHexDecoder(api);
  const [hexInput, setHexInput] = useState('');
  const [copied, setCopied] = useState(false);
  const [showExamples, setShowExamples] = useState(false);

  useEffect(() => {
    // Load a default example on mount
    if (EXAMPLE_TRANSACTIONS[0]) {
      setHexInput(EXAMPLE_TRANSACTIONS[0].hex);
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (hexInput.trim()) {
      decodeHex(hexInput);
      onDecode(hexInput);
    }
  };

  const handleExampleClick = (hex: string) => {
    setHexInput(hex);
    decodeHex(hex);
    onDecode(hex);
    setShowExamples(false);
  };

  const handleCopyHex = () => {
    if (hexInput) {
      navigator.clipboard.writeText(hexInput);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleClear = () => {
    setHexInput('');
    setShowExamples(false);
  };

  const isHexValid = isValidHex(hexInput);

  return (
    <div className="crystal-card p-6 magic-glow">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-2xl font-bold text-white flex items-center">
            <Wand2 className="w-7 h-7 mr-3 text-magic-purple animate-wave" />
            Hex Whisperer
          </h3>
          <p className="text-gray-400">Decode any call data hex with PAPI's txFromCallData</p>
        </div>
        <div className="flex items-center space-x-2 px-3 py-1 bg-magic-purple/20 rounded-lg">
          <Sparkles className="w-4 h-4 text-magic-purple" />
          <span className="text-sm font-semibold text-magic-purple">Day 10</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Call Data Hex
            <span className="ml-2 text-xs text-gray-500">
              (Start with 0x, e.g., 0x0400a0dec5...)
            </span>
          </label>
          
          <div className="relative">
            <textarea
              value={hexInput}
              onChange={(e) => setHexInput(e.target.value)}
              placeholder="Paste call data hex here (0x...)"
              rows={4}
              className="w-full px-4 py-3 bg-black/50 border border-border-magic rounded-lg focus:outline-none focus:border-magic-purple text-white font-mono-magic resize-none"
              spellCheck={false}
            />
            
            <div className="absolute right-3 top-3 flex space-x-2">
              <button
                type="button"
                onClick={handleCopyHex}
                disabled={!hexInput}
                className="p-1.5 bg-gray-800 hover:bg-gray-700 rounded transition-colors"
                title="Copy hex"
              >
                {copied ? (
                  <Check className="w-4 h-4 text-success-emerald" />
                ) : (
                  <Copy className="w-4 h-4 text-gray-400" />
                )}
              </button>
              
              <button
                type="button"
                onClick={() => setShowExamples(!showExamples)}
                className="p-1.5 bg-magic-purple/20 hover:bg-magic-purple/30 rounded transition-colors"
                title="Show examples"
              >
                <History className="w-4 h-4 text-magic-purple" />
              </button>
            </div>
          </div>
          
          <div className="flex justify-between items-center mt-2">
            <div className="flex space-x-4">
              {hexInput && (
                <>
                  <span className={`text-sm ${isHexValid ? 'text-success-emerald' : 'text-warning-amber'}`}>
                    {isHexValid ? '✓ Valid hex' : '⚠ Invalid format'}
                  </span>
                  <span className="text-sm text-gray-400">
                    {calculateHexSize(hexInput)}
                  </span>
                </>
              )}
            </div>
            
            <button
              type="button"
              onClick={handleClear}
              className="text-sm text-gray-400 hover:text-white"
            >
              Clear
            </button>
          </div>
        </div>

        {/* Example Gallery */}
        {showExamples && (
          <div className="p-4 bg-black/30 rounded-lg border border-border-magic">
            <h4 className="font-semibold text-white mb-3 flex items-center">
              <Sparkles className="w-4 h-4 mr-2 text-sparkle-blue" />
              Example Transactions
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {EXAMPLE_TRANSACTIONS.map((example) => (
                <button
                  key={example.id}
                  onClick={() => handleExampleClick(example.hex)}
                  className="p-3 text-left bg-gray-900/50 hover:bg-gray-800/50 rounded border border-gray-800 transition-colors"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium text-white">{example.name}</p>
                      <p className="text-xs text-gray-400 mt-1">{example.description}</p>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded ${
                      example.difficulty === 'easy' 
                        ? 'bg-success-emerald/20 text-success-emerald' 
                        : example.difficulty === 'medium'
                        ? 'bg-warning-amber/20 text-warning-amber'
                        : 'bg-magic-purple/20 text-magic-purple'
                    }`}>
                      {example.difficulty}
                    </span>
                  </div>
                  <p className="text-xs font-mono-magic text-gray-500 mt-2 truncate">
                    {example.hex.substring(0, 40)}...
                  </p>
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="flex space-x-4">
          <button
            type="submit"
            disabled={state.isDecoding || !hexInput.trim()}
            className="flex-1 px-6 py-3 bg-gradient-to-r from-magic-purple to-sparkle-blue text-white font-bold rounded-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center"
          >
            {state.isDecoding ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Decoding Magic...
              </>
            ) : (
              <>
                <Wand2 className="w-5 h-5 mr-2" />
                Decode Hex
              </>
            )}
          </button>
          
          <button
            type="button"
            onClick={() => handleExampleClick(EXAMPLE_TRANSACTIONS[0].hex)}
            className="px-4 py-3 bg-gray-800 border border-gray-700 text-white font-medium rounded-lg hover:bg-gray-700 transition-colors"
          >
            Try Example
          </button>
        </div>
      </form>

      {/* Error Display */}
      {state.error && (
        <div className="mt-6 p-4 bg-red-900/20 border border-red-500/30 rounded-lg">
          <div className="flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-red-400 mt-0.5" />
            <div>
              <p className="font-semibold text-red-300">Decoding Failed</p>
              <p className="text-sm text-gray-300 mt-1">{state.error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Hex Preview */}
      {hexInput && isHexValid && (
        <div className="mt-6 p-4 bg-black/30 rounded-lg">
          <h4 className="font-semibold text-white mb-2">Hex Preview</h4>
          <pre className="text-sm text-gray-300 font-mono-magic whitespace-pre-wrap overflow-x-auto">
            {formatHex(hexInput)}
          </pre>
        </div>
      )}

      <div className="mt-6 pt-4 border-t border-border-magic/50">
        <p className="text-sm text-gray-400">
          <span className="text-magic-purple font-semibold">💡 Pro Tip:</span> Try decoding hex from failed transactions, mempool data, or historical blocks to understand what's happening on-chain.
        </p>
      </div>
    </div>
  );
};