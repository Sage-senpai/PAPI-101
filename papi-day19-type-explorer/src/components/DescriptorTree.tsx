import React from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';

interface TreeNode {
  name: string;
  type: string;
  children?: TreeNode[];
}

const DescriptorTree: React.FC = () => {
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set(['root', 'pallets']));
  
  const treeData: TreeNode = {
    name: 'Descriptor',
    type: 'Root',
    children: [
      {
        name: 'Constants',
        type: 'Module',
        children: [
          { name: 'existentialDeposit', type: 'u128' },
          { name: 'blockTime', type: 'u64' },
        ]
      },
      {
        name: 'Pallets',
        type: 'Module',
        children: [
          {
            name: 'Balances',
            type: 'Pallet',
            children: [
              {
                name: 'Transfer',
                type: 'Call',
                children: [
                  { name: 'dest', type: 'MultiAddress' },
                  { name: 'value', type: 'u128' },
                ]
              },
            ]
          },
          {
            name: 'System',
            type: 'Pallet',
            children: [
              { name: 'Account', type: 'Storage', children: [
                { name: 'nonce', type: 'u32' },
                { name: 'free', type: 'u128' },
              ] },
            ]
          },
        ]
      },
      {
        name: 'Events',
        type: 'Module',
        children: [
          { name: 'Transfer', type: 'Event', children: [
            { name: 'from', type: 'AccountId' },
            { name: 'to', type: 'AccountId' },
            { name: 'amount', type: 'u128' },
          ] },
        ]
      },
    ]
  };

  const toggleNode = (name: string) => {
    setExpandedNodes(prev => {
      const newSet = new Set(prev);
      if (newSet.has(name)) {
        newSet.delete(name);
      } else {
        newSet.add(name);
      }
      return newSet;
    });
  };

  const renderNode = (node: TreeNode, depth: number = 0, parentPath: string = '') => {
    const path = parentPath ? `${parentPath}.${node.name}` : node.name;
    const isExpanded = expandedNodes.has(path);
    const hasChildren = node.children && node.children.length > 0;
    
    return (
      <div style={{ paddingLeft: `${depth * 20}px` }}>
        <div className="flex items-center space-x-2 py-1 hover:bg-gray-700/50 rounded cursor-pointer" onClick={() => toggleNode(path)}>
          {hasChildren ? (
            isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />
          ) : (
            <div className="w-4 h-4" />
          )}
          <span className="font-mono">{node.name}</span>
          <span className="text-gray-500 text-sm">({node.type})</span>
        </div>
        {hasChildren && isExpanded && node.children.map(child => renderNode(child, depth + 1, path))}
      </div>
    );
  };

  return (
    <div className="bg-black rounded-xl p-6 border border-gray-800 font-mono text-sm overflow-y-auto max-h-[500px] scrollbar-thin">
      {renderNode(treeData)}
    </div>
  );
};