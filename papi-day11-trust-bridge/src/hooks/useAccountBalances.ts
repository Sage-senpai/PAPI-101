// src/hooks/useAccountBalances.ts
import { useState, useEffect, useCallback } from 'react';
import type { WalletAccount, AccountBalance } from '../types/wallet';
import { calculateAccountBalance } from '../utils/walletHelpers';

export const useAccountBalances = (accounts: WalletAccount[]) => {
  const [balances, setBalances] = useState<Record<string, AccountBalance>>({});
  const [isLoading, setIsLoading] = useState(false);

  const fetchBalances = useCallback(async () => {
    if (accounts.length === 0) return;

    setIsLoading(true);
    console.log('💰 Simulating balance fetch for', accounts.length, 'accounts...');

    try {
      // Simulate balance fetching with random values for demo purposes
      const newBalances: Record<string, AccountBalance> = {};

      accounts.forEach((account) => {
        // Generate random balance for demo (10-100 DOT)
        const randomFree = BigInt(Math.floor(Math.random() * 90 + 10) * 10_000_000_000);
        const randomReserved = BigInt(Math.floor(Math.random() * 5) * 10_000_000_000);
        
        const balance: AccountBalance = {
          address: account.address,
          free: randomFree,
          reserved: randomReserved,
          frozen: BigInt(0),
          total: randomFree + randomReserved,
          formatted: calculateAccountBalance(randomFree, 10),
          timestamp: new Date(),
        };

        newBalances[account.address] = balance;
      });

      setBalances(newBalances);
      console.log('✅ Balances simulated successfully');

    } catch (error) {
      console.error('❌ Failed to fetch balances:', error);
    } finally {
      setIsLoading(false);
    }
  }, [accounts]);

  useEffect(() => {
    if (accounts.length > 0) {
      fetchBalances();
      
      // Refresh balances every 30 seconds
      const interval = setInterval(fetchBalances, 30000);
      return () => clearInterval(interval);
    }
  }, [accounts, fetchBalances]);

  const getBalanceForAccount = useCallback((address: string): AccountBalance | null => {
    return balances[address] || null;
  }, [balances]);

  const getTotalBalance = useCallback((): bigint => {
    return Object.values(balances).reduce((total, balance) => total + balance.total, BigInt(0));
  }, [balances]);

  return {
    balances,
    isLoading,
    fetchBalances,
    getBalanceForAccount,
    getTotalBalance,
  };
};