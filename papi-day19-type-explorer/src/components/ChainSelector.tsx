import React from 'react';
import { CHAINS } from '../utils/chainConfig';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@radix-ui/react-select';

interface ChainSelectorProps {
  chains: typeof CHAINS;
  selectedChain: string;
  onSelect: (chainId: string) => void;
}

export const ChainSelector: React.FC<ChainSelectorProps> = ({ chains, selectedChain, onSelect }) => {
  return (
    <Select value={selectedChain} onValueChange={onSelect}>
      <SelectTrigger className="w-[200px] bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-left">
        <SelectValue placeholder="Select chain" />
      </SelectTrigger>
      <SelectContent className="bg-gray-800 border border-gray-700 rounded-lg shadow-lg">
        {chains.map(chain => (
          <SelectItem 
            key={chain.id} 
            value={chain.id} 
            className="px-4 py-2 hover:bg-gray-700 cursor-pointer"
          >
            {chain.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};