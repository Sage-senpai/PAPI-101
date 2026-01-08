//src/components/palletexporer.tsx
import React, { useState } from 'react';
import { Search, ChevronRight, Code, Zap } from 'lucide-react';
import { POLKADOT_PALLETS, getCallDescription } from '../utils/palletsData';
import { PalletInfo } from '../types/transaction';

interface PalletExplorerProps {
  onSelectPallet: (pallet: string, call: string) => void;
  selectedPallet: string | null;
  selectedCall: string | null;
}

export const PalletExplorer: React.FC<PalletExplorerProps> = ({
  onSelectPallet,
  selectedPallet,
  selectedCall,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredPallets = POLKADOT_PALLETS.filter(pallet =>
    pallet.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    pallet.calls.some(call => call.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="glass-card p-6 h-full">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-white">Pallet Explorer</h3>
          <div className="flex items-center space-x-2">
            <Zap className="w-5 h-5 text-turbo-blue" />
            <span className="text-sm font-semibold text-turbo-blue">Turbo Mode</span>
          </div>
        </div>
        
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
          <input
            type="text"
            placeholder="Search pallets or calls..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-black/50 border border-border-color rounded-lg focus:outline-none focus:border-turbo-blue text-white"
          />
        </div>
      </div>

      <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
        {filteredPallets.map((pallet) => (
          <div key={pallet.name} className="border border-border-color rounded-lg overflow-hidden">
            <div className="p-4 bg-black/30 border-b border-border-color">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-white flex items-center">
                    <Code className="w-4 h-4 mr-2 text-turbo-blue" />
                    {pallet.name}
                  </h4>
                  <p className="text-sm text-gray-400 mt-1">{pallet.description}</p>
                </div>
                <div className="text-xs px-2 py-1 bg-turbo-blue/20 text-turbo-blue rounded">
                  #{pallet.index}
                </div>
              </div>
            </div>
            
            <div className="divide-y divide-border-color/50">
              {pallet.calls.map((call) => {
                const isSelected = selectedPallet === pallet.name && selectedCall === call;
                return (
                  <button
                    key={call}
                    onClick={() => onSelectPallet(pallet.name, call)}
                    className={`w-full p-3 text-left hover:bg-black/20 transition-colors ${
                      isSelected ? 'bg-turbo-blue/10 border-l-4 border-turbo-blue' : ''
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className={`font-medium ${isSelected ? 'text-turbo-blue' : 'text-white'}`}>
                          {call}
                        </p>
                        <p className="text-sm text-gray-400 mt-1">
                          {getCallDescription(pallet.name, call)}
                        </p>
                      </div>
                      <ChevronRight className={`w-5 h-5 ${isSelected ? 'text-turbo-blue' : 'text-gray-500'}`} />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-6 pt-4 border-t border-border-color/50">
        <p className="text-sm text-gray-400">
          <span className="text-turbo-blue font-semibold">💡 Tip:</span> Select any call to auto-fill the transaction builder with recommended parameters
        </p>
      </div>
    </div>
  );
};