import React from 'react';
import { CHAINS } from '../utils/chainConfig';
import { DescriptorTree } from './DescriptorTree';
import { TypeCard } from './TypeCard';
import { Code2, FileJson, GitBranch, Lock } from 'lucide-react';

interface TypeExplorerProps {
  chainId: string;
}

export const TypeExplorer: React.FC<TypeExplorerProps> = ({ chainId }) => {
  const chain = CHAINS.find(c => c.id === chainId);
  
  const sampleTypes = [
    {
      name: 'Balances.Transfer',
      category: 'Transaction',
      description: 'Transfer some liquid free balance to another account',
      params: [
        { name: 'dest', type: 'MultiAddress', required: true },
        { name: 'value', type: 'u128', required: true },
      ],
      returnType: 'DispatchResult',
    },
    {
      name: 'Timestamp.Now',
      category: 'Constant',
      description: 'Current time for the current block',
      value: 'u64',
      source: 'runtime',
    },
    {
      name: 'System.Account',
      category: 'Storage',
      description: 'The full account information for a particular account ID',
      keyType: 'AccountId32',
      valueType: 'AccountInfo',
      default: 'Default::default()',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Chain Info Banner */}
      <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-xl p-6 border border-gray-700">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center space-x-3 mb-2">
              <Code2 className="w-6 h-6 text-primary-500" />
              <h2 className="text-2xl font-bold">{chain?.name} Type Descriptor</h2>
            </div>
            <p className="text-gray-400">
              Auto-generated TypeScript interfaces from {chain?.name} runtime metadata
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-400">Descriptor Path</p>
            <p className="font-mono text-sm bg-gray-900 px-3 py-1 rounded mt-1">
              @polkadot-api/descriptors/{chain?.descriptorName}.ts
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Type Cards Column */}
        <div className="lg:col-span-2 space-y-6">
          <h3 className="text-xl font-semibold flex items-center space-x-2">
            <FileJson className="w-5 h-5" />
            <span>Generated Type Examples</span>
          </h3>
          
          {sampleTypes.map((type, index) => (
            <TypeCard key={index} type={type} />
          ))}
          
          {/* Descriptor Tree */}
          <div className="bg-gray-800/30 rounded-xl p-6 border border-gray-700">
            <h3 className="text-xl font-semibold mb-4 flex items-center space-x-2">
              <GitBranch className="w-5 h-5" />
              <span>Descriptor Structure</span>
            </h3>
            <DescriptorTree />
          </div>
        </div>

        {/* Info Panel */}
        <div className="space-y-6">
          <div className="bg-gray-800/30 rounded-xl p-6 border border-gray-700">
            <h3 className="text-xl font-semibold mb-4">How It Works</h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-primary-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-primary-500 font-bold">1</span>
                </div>
                <div>
                  <h4 className="font-medium">Fetch Metadata</h4>
                  <p className="text-gray-400 text-sm">Connect to chain via WebSocket</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-primary-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-primary-500 font-bold">2</span>
                </div>
                <div>
                  <h4 className="font-medium">Parse & Transform</h4>
                  <p className="text-gray-400 text-sm">Convert metadata to TypeScript AST</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-primary-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-primary-500 font-bold">3</span>
                </div>
                <div>
                  <h4 className="font-medium">Generate Types</h4>
                  <p className="text-gray-400 text-sm">Create typed interfaces for all chain features</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-primary-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-primary-500 font-bold">4</span>
                </div>
                <div>
                  <h4 className="font-medium">Type Safety</h4>
                  <p className="text-gray-400 text-sm">Enjoy compile-time validation</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-800/30 rounded-xl p-6 border border-gray-700">
            <div className="flex items-center space-x-3 mb-4">
              <Lock className="w-5 h-5 text-green-500" />
              <h3 className="text-xl font-semibold">Benefits</h3>
            </div>
            <ul className="space-y-3">
              <li className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm">Always in sync with runtime</span>
              </li>
              <li className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm">Zero manual type maintenance</span>
              </li>
              <li className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm">Automatic runtime upgrade handling</span>
              </li>
              <li className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm">Full IDE IntelliSense support</span>
              </li>
            </ul>
          </div>

          {/* Console Output Simulator */}
          <div className="bg-black rounded-xl p-4 border border-gray-800 font-mono text-sm">
            <div className="flex space-x-2 mb-3">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            </div>
            <pre className="text-green-400">
{`$ npx papi add ${chain?.id} -n ${chain?.descriptorName}
✅ Added chain descriptor for ${chain?.name}

$ npx papi
🔧 Generating types from metadata...
📦 Created: @polkadot-api/descriptors/
├── ${chain?.descriptorName}.ts
├── ${chain?.descriptorName}/constants.ts
├── ${chain?.descriptorName}/tx.ts
└── ${chain?.descriptorName}/query.ts

🎉 Type generation complete!
Total types: 142 across 24 pallets`}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};