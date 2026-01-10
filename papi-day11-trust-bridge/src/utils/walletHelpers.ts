// src/utils/walletHelper.ts
import type { WalletAccount } from '../types/wallet';

export const formatAddress = (address: string, start: number = 6, end: number = 4): string => {
  if (address.length <= start + end) return address;
  return `${address.slice(0, start)}...${address.slice(-end)}`;
};

export const getAccountSourceIcon = (source: string): string => {
  const icons: Record<string, string> = {
    'polkadot-js': '🟣',
    'talisman': '🟡',
    'subwallet-js': '🔵',
    'enkrypt': '🟢',
    'fearless-wallet': '🔴',
    'ledger': '⚫',
    'polkadot-vault': '🟤',
  };
  return icons[source] || '⚪';
};

export const getAccountSourceName = (source: string): string => {
  const names: Record<string, string> = {
    'polkadot-js': 'Polkadot.js',
    'talisman': 'Talisman',
    'subwallet-js': 'SubWallet',
    'enkrypt': 'Enkrypt',
    'fearless-wallet': 'Fearless Wallet',
    'ledger': 'Ledger',
    'polkadot-vault': 'Polkadot Vault',
  };
  return names[source] || 'Unknown Wallet';
};

export const sortAccounts = (accounts: WalletAccount[], sortBy: 'name' | 'balance' | 'source' = 'name'): WalletAccount[] => {
  return [...accounts].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return (a.meta.name || '').localeCompare(b.meta.name || '');
      case 'source':
        return (a.meta.source || '').localeCompare(b.meta.source || '');
      default:
        return 0;
    }
  });
};

export const filterAccounts = (accounts: WalletAccount[], search: string): WalletAccount[] => {
  if (!search.trim()) return accounts;
  
  const searchLower = search.toLowerCase();
  return accounts.filter(account => 
    account.address.toLowerCase().includes(searchLower) ||
    account.meta.name.toLowerCase().includes(searchLower) ||
    account.meta.source.toLowerCase().includes(searchLower)
  );
};

export const calculateAccountBalance = (free: bigint, decimals: number = 10): string => {
  const divisor = BigInt(10 ** decimals);
  const whole = free / divisor;
  const fractional = free % divisor;
  
  return `${whole.toString()}.${fractional.toString().padStart(decimals, '0').slice(0, 4)}`;
};

export const validateAddress = (address: string): boolean => {
  // Basic SS58 validation
  return address.length >= 47 && address.length <= 48 && /^[0-9a-zA-Z]+$/.test(address);
};

export const getNetworkFromGenesisHash = (genesisHash?: string | null): string => {
  const networks: Record<string, string> = {
    '0x91b171bb158e2d3848fa23a9f1c25182fb8e20313b2c1eb49219da7a70ce90c3': 'Polkadot',
    '0xb0a8d493285c2df73290dfb7e61f870f17b41801197a149ca93654499ea3dafe': 'Kusama',
    '0xe143f23803ac50e8f6f8e62695d1ce9e4e1d68aa36c1cd2cfd15340213f3423e': 'Westend',
  };
  
  return genesisHash ? networks[genesisHash] || 'Unknown Network' : 'Unknown Network';
};