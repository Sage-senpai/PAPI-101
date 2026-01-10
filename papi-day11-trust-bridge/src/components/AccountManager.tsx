// src/components/AccountManager.tsx
import React, { useState } from 'react';
import { 
  Users, 
  User, 
  Wallet, 
  Copy, 
  Check, 
  Filter,
  Search,
  Eye,
  EyeOff
} from 'lucide-react';
import { usePolkadotExtension } from '../hooks/usePolkadotExtension';
import { useAccountBalances } from '../hooks/useAccountBalances';
import type { WalletAccount } from '../types/wallet';
import { 
  formatAddress, 
  getAccountSourceIcon, 
  getAccountSourceName,
  sortAccounts,
  filterAccounts
} from '../utils/walletHelpers';

export const AccountManager: React.FC = () => {
  const { state, selectAccount } = usePolkadotExtension();
  const { balances, isLoading: isLoadingBalances } = useAccountBalances(state.accounts);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'balance' | 'source'>('name');
  const [copiedAddress, setCopiedAddress] = useState<string | null>(null);
  const [showPrivateInfo, setShowPrivateInfo] = useState(false);

  const handleCopyAddress = (address: string) => {
    navigator.clipboard.writeText(address);
    setCopiedAddress(address);
    setTimeout(() => setCopiedAddress(null), 2000);
  };

  const handleSelectAccount = (account: WalletAccount) => {
    selectAccount(account);
    console.log('👤 Selected account:', account.address);
  };

  if (!state.isConnected || state.accounts.length === 0) {
    return (
      <div className="trust-card p-6 h-full flex flex-col items-center justify-center">
        <Users className="w-16 h-16 text-gray-700 mb-4" />
        <p className="text-gray-500 text-center">Connect your wallet to view accounts</p>
      </div>
    );
  }

  // Filter and sort accounts
  const filteredAccounts = filterAccounts(state.accounts, searchTerm);
  const sortedAccounts = sortAccounts(filteredAccounts, sortBy);

  return (
    <div className="trust-card p-6 h-full">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-white flex items-center">
            <Users className="w-5 h-5 mr-2 text-trust-blue" />
            Account Manager
          </h3>
          <p className="text-gray-400">
            {state.accounts.length} account{state.accounts.length !== 1 ? 's' : ''} • {sortedAccounts.length} filtered
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowPrivateInfo(!showPrivateInfo)}
            className="p-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
            title={showPrivateInfo ? 'Hide sensitive info' : 'Show sensitive info'}
          >
            {showPrivateInfo ? (
              <EyeOff className="w-4 h-4" />
            ) : (
              <Eye className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>

      {/* Controls */}
      <div className="mb-6 space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
          <input
            type="text"
            placeholder="Search accounts by name, address, or source..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-black/50 border border-border-safe rounded-lg focus:outline-none focus:border-trust-blue text-white"
          />
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <span className="text-sm text-gray-400">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="text-sm bg-black/50 border border-border-safe rounded px-2 py-1 text-white"
            >
              <option value="name">Name</option>
              <option value="source">Wallet Source</option>
            </select>
          </div>
          
          {state.selectedAccount && (
            <div className="text-sm text-gray-400">
              Selected: {formatAddress(state.selectedAccount.address)}
            </div>
          )}
        </div>
      </div>

      {/* Accounts List */}
      <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
        {sortedAccounts.map((account) => {
          const isSelected = state.selectedAccount?.address === account.address;
          const balance = balances[account.address];
          const sourceIcon = getAccountSourceIcon(account.meta.source);
          const sourceName = getAccountSourceName(account.meta.source);
          
          return (
            <div
              key={account.address}
              className={`p-4 rounded-lg border transition-all cursor-pointer ${
                isSelected
                  ? 'bg-trust-blue/10 border-trust-blue/50 connection-ring'
                  : 'bg-black/30 border-border-safe hover:bg-gray-800/30'
              }`}
              onClick={() => handleSelectAccount(account)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-trust-blue to-accent-purple flex items-center justify-center">
                      <User className="w-5 h-5 text-white" />
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-gray-900 border border-gray-700 flex items-center justify-center text-xs">
                      {sourceIcon}
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex items-center space-x-2">
                      <p className="font-semibold text-white">
                        {account.meta.name || 'Unnamed Account'}
                      </p>
                      <span className="text-xs px-2 py-0.5 bg-gray-800 rounded">
                        {sourceName}
                      </span>
                    </div>
                    
                    <div className="flex items-center space-x-2 mt-1">
                      <p className="text-sm text-gray-400 font-mono-secure">
                        {showPrivateInfo ? account.address : formatAddress(account.address)}
                      </p>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCopyAddress(account.address);
                        }}
                        className="p-1 hover:bg-gray-700 rounded transition-colors"
                        title="Copy address"
                      >
                        {copiedAddress === account.address ? (
                          <Check className="w-3 h-3 text-security-green" />
                        ) : (
                          <Copy className="w-3 h-3 text-gray-500" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
                
                <div className="text-right">
                  {isLoadingBalances ? (
                    <div className="h-4 w-24 skeleton rounded"></div>
                  ) : balance ? (
                    <>
                      <p className="font-bold text-white">
                        {balance.formatted} DOT
                      </p>
                      <p className="text-xs text-gray-500">
                        Available
                      </p>
                    </>
                  ) : (
                    <p className="text-sm text-gray-500">Loading balance...</p>
                  )}
                </div>
              </div>
              
              {/* Additional Info */}
              <div className="mt-3 pt-3 border-t border-border-safe/50 grid grid-cols-2 gap-2">
                <div className="text-xs">
                  <span className="text-gray-500">Type: </span>
                  <span className="text-gray-300">{account.type || 'unknown'}</span>
                </div>
                <div className="text-xs">
                  <span className="text-gray-500">Public Key: </span>
                  <span className="text-gray-300 font-mono-secure">
                    {showPrivateInfo && account.publicKey 
                      ? formatAddress(Buffer.from(account.publicKey).toString('hex'), 8, 8)
                      : '••••••••'}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Stats */}
      <div className="mt-6 p-4 bg-black/30 rounded-lg">
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-white">{state.accounts.length}</p>
            <p className="text-xs text-gray-400">Total Accounts</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-white">
              {new Set(state.accounts.map(a => a.meta.source)).size}
            </p>
            <p className="text-xs text-gray-400">Wallet Sources</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center">
              <Wallet className="w-4 h-4 mr-1 text-security-green" />
              <p className="text-2xl font-bold text-white">
                {Object.keys(balances).length}
              </p>
            </div>
            <p className="text-xs text-gray-400">With Balances</p>
          </div>
        </div>
      </div>

      {/* Tips */}
      <div className="mt-6 pt-4 border-t border-border-safe/50">
        <p className="text-sm text-gray-400">
          <span className="text-trust-blue font-semibold">💡 Tip:</span> Click any account to select it as the active account for transactions. Your private keys remain secure in the extension.
        </p>
      </div>
    </div>
  );
};