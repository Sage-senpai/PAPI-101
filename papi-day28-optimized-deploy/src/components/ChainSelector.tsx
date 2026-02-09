import React from 'react';
import { Network } from 'lucide-react';
import '../styles/ChainSelector.css';

interface ChainSelectorProps {
  selectedChain: string | null;
  onChainSelect: (chain: 'polkadot' | 'kusama' | null) => void;
}

export const ChainSelector: React.FC<ChainSelectorProps> = ({
  selectedChain,
  onChainSelect,
}) => {
  return (
    <div className="chain-selector">
      <div className="selector-header">
        <Network size={24} />
        <h2>Select Chain</h2>
        <span className="optimized-badge">Lazy Load</span>
      </div>

      <div className="chain-buttons">
        <button
          className={`chain-button polkadot ${
            selectedChain === 'polkadot' ? 'active' : ''
          }`}
          onClick={() => onChainSelect('polkadot')}
          data-chain="polkadot"
        >
          <div className="chain-dot"></div>
          <div className="chain-info">
            <span className="chain-name">Polkadot</span>
            <small className="chain-meta">DOT • ~50KB</small>
          </div>
        </button>

        <button
          className={`chain-button kusama ${
            selectedChain === 'kusama' ? 'active' : ''
          }`}
          onClick={() => onChainSelect('kusama')}
          data-chain="kusama"
        >
          <div className="chain-dot"></div>
          <div className="chain-info">
            <span className="chain-name">Kusama</span>
            <small className="chain-meta">KSM • ~50KB</small>
          </div>
        </button>

        {selectedChain && (
          <button className="chain-button clear" onClick={() => onChainSelect(null)}>
            <span>Clear Selection</span>
            <small className="chain-meta">Unload modules</small>
          </button>
        )}
      </div>

      <div className="optimization-info">
        <div className="info-item">
          <span className="info-icon">⏱️</span>
          <span>Chain descriptors load on-demand</span>
        </div>
        <div className="info-item">
          <span className="info-icon">📦</span>
          <span>Each chain adds ~50KB</span>
        </div>
        <div className="info-item">
          <span className="info-icon">⚡</span>
          <span>WASM cached after first load</span>
        </div>
      </div>
    </div>
  );
};