import React from 'react';
import { Globe } from 'lucide-react';
import { availableChains } from '../data/skills';
import { Chain } from '../types/plan.types';

interface ChainSelectorProps {
  selectedChains: Chain[];
  onToggle: (chain: Chain) => void;
}

export const ChainSelector: React.FC<ChainSelectorProps> = ({ selectedChains, onToggle }) => {
  return (
    <div className="bg-surface/50 rounded-xl p-6 border border-white/5">
      <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
        <Globe className="text-secondary" size={20} />
        Select Target Chains
      </h3>
      <div className="grid grid-cols-2 gap-3">
        {availableChains.map(chain => {
          const selected = selectedChains.some(c => c.id === chain.id);
          return (
            <button
              key={chain.id}
              onClick={() => onToggle(chain)}
              className={`flex items-center gap-3 p-4 rounded-lg transition-all ${
                selected
                  ? 'bg-gradient-to-br from-secondary/20 to-accent/20 border border-secondary'
                  : 'bg-white/5 hover:bg-white/10 border border-transparent'
              }`}
            >
              <span className="text-2xl">{chain.icon}</span>
              <div className="flex-1 text-left">
                <p className="font-bold">{chain.name}</p>
                <p className="text-xs font-mono text-white/40">{chain.descriptor}</p>
              </div>
              {selected && <Check size={18} className="text-secondary" />}
            </button>
          );
        })}
      </div>
    </div>
  );
};