import React, { useState } from 'react';
import { TypeExplorer } from './components/TypeExplorer';
import { ChainSelector } from './components/ChainSelector';
import { CHAINS } from './utils/chainConfig';
import { FileCode, Cpu, Database, Shield } from 'lucide-react';
import './styles/globals.css';

function App() {
  const [selectedChain, setSelectedChain] = useState<string>(CHAINS[0].id);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  const handleGenerateTypes = async () => {
    setIsGenerating(true);
    // Simulate type generation
    await new Promise(resolve => setTimeout(resolve, 1500));
    console.log(`🎉 Type generation complete for ${CHAINS.find(c => c.id === selectedChain)?.name}!`);
    console.log(`📡 Generated from: ${CHAINS.find(c => c.id === selectedChain)?.wsEndpoint}`);
    console.log(`🔧 Descriptor path: @polkadot-api/descriptors/${CHAINS.find(c => c.id === selectedChain)?.descriptorName}`);
    setIsGenerating(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-950 text-gray-100">
      {/* Header */}
      <header className="border-b border-gray-800">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <FileCode className="w-8 h-8 text-primary-500" />
              <div>
                <h1 className="text-2xl font-bold">PAPI Type Explorer</h1>
                <p className="text-gray-400 text-sm">Visualize auto-generated blockchain types</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm">
                <Cpu className="w-4 h-4" />
                <span>Runtime: v9430</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <Database className="w-4 h-4" />
                <span>Metadata: Latest</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Generated Types</p>
                <p className="text-2xl font-bold mt-2">142</p>
              </div>
              <FileCode className="w-8 h-8 text-primary-500" />
            </div>
          </div>
          
          <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Pallets</p>
                <p className="text-2xl font-bold mt-2">24</p>
              </div>
              <Cpu className="w-8 h-8 text-green-500" />
            </div>
          </div>
          
          <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Storage Entries</p>
                <p className="text-2xl font-bold mt-2">89</p>
              </div>
              <Database className="w-8 h-8 text-yellow-500" />
            </div>
          </div>
          
          <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Type Safety</p>
                <p className="text-2xl font-bold mt-2">100%</p>
              </div>
              <Shield className="w-8 h-8 text-purple-500" />
            </div>
          </div>
        </div>

        {/* Control Panel */}
        <div className="bg-gray-800/30 rounded-xl p-6 border border-gray-700 mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold mb-2">Chain Configuration</h2>
              <p className="text-gray-400">
                Select a chain and generate TypeScript types from its runtime metadata
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <ChainSelector 
                chains={CHAINS}
                selectedChain={selectedChain}
                onSelect={setSelectedChain}
              />
              
              <button
                onClick={handleGenerateTypes}
                disabled={isGenerating}
                className="px-6 py-3 bg-primary-600 hover:bg-primary-700 disabled:bg-gray-700 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
              >
                {isGenerating ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Generating...</span>
                  </>
                ) : (
                  <>
                    <FileCode className="w-4 h-4" />
                    <span>Generate Types</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Type Explorer */}
        <TypeExplorer chainId={selectedChain} />
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-800 mt-12">
        <div className="container mx-auto px-6 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <p className="text-gray-400">PAPI Type Explorer • Day 19/30 #PAPI30Days</p>
            </div>
            <div className="flex space-x-4">
              <a 
                href="https://github.com/polkadot-api"
                className="text-gray-400 hover:text-white transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                GitHub
              </a>
              <a 
                href="https://polkadot-api.js.org"
                className="text-gray-400 hover:text-white transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                Documentation
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;