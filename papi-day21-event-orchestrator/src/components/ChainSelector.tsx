// ============================================================================
// FILE: papi-event-orchestrator/src/components/ChainSelector.tsx
// PURPOSE: Multi-chain selection component with toggle functionality
// DAY: 13 - Multi-Chain Setup
// STATUS: FIXED - Fully working with proper state management
// ============================================================================

import React from 'react';
import type { ChainConfig } from '../data/chainConfig';

interface ChainSelectorProps {
  chains: ChainConfig[];
  selectedChains: string[];
  onChange: (selectedChains: string[]) => void;
}

/**
 * ChainSelector Component
 * 
 * Provides multi-chain selection UI allowing users to toggle chain monitoring.
 * 
 * Week 3 Teaching Points:
 * - State management with parent component (selectedChains)
 * - Event handling for chain selection
 * - Conditional styling based on selection state
 * - Type safety with TypeScript interfaces
 * 
 * @param chains - Available chains from chainConfig
 * @param selectedChains - Array of currently selected chain IDs
 * @param onChange - Callback fired when selection changes
 */
export const ChainSelector: React.FC<ChainSelectorProps> = ({
  chains,
  selectedChains,
  onChange,
}) => {
  /**
   * Toggle chain selection
   * - If chain is selected, remove it
   * - If chain is not selected, add it
   * - Update parent component via onChange callback
   * 
   * Day 13: Multi-Chain Setup - demonstrates adding/removing chains dynamically
   */
  const toggleChain = (chainId: string) => {
    if (selectedChains.includes(chainId)) {
      // Remove chain from selection
      onChange(selectedChains.filter(id => id !== chainId));
      console.log(`❌ Deselected chain: ${chainId}`);
    } else {
      // Add chain to selection
      onChange([...selectedChains, chainId]);
      console.log(`✅ Selected chain: ${chainId}`);
    }
  };

  return (
    <div className="flex flex-wrap gap-3">
      {chains.map((chain) => {
        const isSelected = selectedChains.includes(chain.id);

        return (
          <button
            key={chain.id}
            onClick={() => toggleChain(chain.id)}
            className={`
              px-4 py-2 rounded-lg font-medium transition-all duration-300 
              border-2 cursor-pointer
              ${
                isSelected
                  ? 'ring-2 ring-offset-2 ring-offset-gray-900 opacity-100 scale-105'
                  : 'opacity-60 hover:opacity-80'
              }
            `}
            style={{
              backgroundColor: `${chain.color}30`,
              borderColor: chain.color,
              color: chain.color,
            }}
            aria-pressed={isSelected}
            aria-label={`Toggle ${chain.name} monitoring`}
          >
            <div className="flex items-center gap-2">
              <span>{chain.name}</span>
              
              {/* Testnet indicator */}
              {chain.testnet && (
                <span className="text-xs bg-yellow-500/40 text-yellow-200 px-2 py-0.5 rounded font-semibold">
                  Testnet
                </span>
              )}

              {/* Selection indicator */}
              {isSelected && (
                <span className="text-lg ml-1">✓</span>
              )}
            </div>
          </button>
        );
      })}
    </div>
  );
};