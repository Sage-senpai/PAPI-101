import React from 'react';
import { Network } from 'lucide-react';
import './ChainSelector.css';

interface ChainSelectorProps {
  selectedChain: string | null;
  onChainSelect: (chain: 'polkadot' | 'kusama' | null) => void;
}

export const ChainSelector: React.FC<ChainSelectorProps> = ({ 
  selectedChain, 
  onChainSelect 
}) => {
  return (
    <div className="chain-selector">
      <div className="selector-header">
        <Network size={24} />
        <h2>Select Chain</h2>
        <span className="optimized-badge">Optimized Load</span>
      </div>
      
      <div className="chain-buttons">
        <button
          className={`chain-button ${selectedChain === 'polkadot' ? 'active' : ''}`}
          onClick={() => onChainSelect('polkadot')}
          data-chain="polkadot"
        >
          <div className="chain-dot"></div>
          <span>Polkadot</span>
          <small>DOT • ~50KB</small>
        </button>
        
        <button
          className={`chain-button ${selectedChain === 'kusama' ? 'active' : ''}`}
          onClick={() => onChainSelect('kusama')}
          data-chain="kusama"
        >
          <div className="chain-dot" style={{ backgroundColor: '#000' }}></div>
          <span>Kusama</span>
          <small>KSM • ~50KB</small>
        </button>
        
        <button
          className="chain-button clear"
          onClick={() => onChainSelect(null)}
        >
          Clear Selection
          <small>Unload chain modules</small>
        </button>
      </div>
      
      <div className="optimization-info">
        <p>⏱️ Chain descriptors load on-demand</p>
        <p>📦 Each chain adds ~50KB to bundle</p>
        <p>⚡ WASM cached for future visits</p>
      </div>
    </div>
  );
};