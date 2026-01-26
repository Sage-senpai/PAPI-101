import React from 'react';
import { RefreshCcw } from 'lucide-react';

interface ChainHeaderProps {
  constantsCount: number;
  filteredCount: number;
  isLoading: boolean;
  onRefresh: () => void;
}

export const ChainHeader: React.FC<ChainHeaderProps> = ({ constantsCount, filteredCount, isLoading, onRefresh }) => { 
  return (
    <header className="bg-gray-900 p-6 shadow-md">
      <div className="container mx-auto flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-primary-400">Chain Constants Explorer</h1>
          <p className="text-gray-400 mt-1">Total: {constantsCount} | Filtered: {filteredCount}</p>
        </div>
        <button
          onClick={onRefresh}
          className="flex items-center space-x-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 rounded-lg transition-colors"
          disabled={isLoading}
        >
          <RefreshCcw className="w-4 h-4" />
          <span>{isLoading ? 'Loading...' : 'Refresh'}</span>
        </button>
      </div>
    </header>
  );
};