import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChainConfig } from '../services/chainRegistry';
import { Check } from 'lucide-react';

interface ChainSelectorProps {
  chains: ChainConfig[];
  selectedChains: string[];
  onSelectionChange: (ids: string[]) => void;
}

export const ChainSelector: React.FC<ChainSelectorProps> = ({
  chains,
  selectedChains,
  onSelectionChange,
}) => {
  const toggle = (id: string) => {
    onSelectionChange(
      selectedChains.includes(id)
        ? selectedChains.filter(c => c !== id)
        : [...selectedChains, id]
    );
  };

  return (
    <div className="flex flex-wrap gap-3">
      {chains.map(chain => {
        const active = selectedChains.includes(chain.id);
        return (
          <button
            key={chain.id}
            onClick={() => toggle(chain.id)}
            className="relative flex items-center gap-2.5 px-4 py-2.5 rounded-xl border transition-all duration-300 text-sm font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
            style={{
              backgroundColor: active ? `${chain.color}18` : 'rgba(31,41,55,0.6)',
              borderColor:     active ? `${chain.color}60` : 'rgba(75,85,99,0.4)',
              color:           active ? chain.color        : '#9ca3af',
              boxShadow:       active ? `0 0 12px ${chain.color}22` : 'none',
            }}
          >
            {/* icon badge */}
            <span
              className="text-lg leading-none"
              style={{ filter: active ? 'none' : 'grayscale(0.7) brightness(0.6)' }}
            >
              {chain.icon}
            </span>

            {/* label */}
            <span>{chain.name}</span>
            <span
              className="text-xs opacity-50"
              style={{ color: active ? chain.color : '#6b7280' }}
            >
              {chain.tokenSymbol}
            </span>

            {/* check mark – slides in when active */}
            <AnimatePresence>
              {active && (
                <motion.span
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit  ={{ scale: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="ml-auto"
                >
                  <Check className="w-3.5 h-3.5" style={{ color: chain.color }} />
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        );
      })}
    </div>
  );
};