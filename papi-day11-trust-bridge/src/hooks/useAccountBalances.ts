// src/hooks/useAccountBalance.ts
import { useState, useEffect, useCallback } from 'react';
import { createClient, TypedApi } from 'polkadot-api';
import { getSmProvider } from '@polkadot-api/sm-provider';
import { dot } from '@polkadot-api/descriptors';
import type { WalletAccount, AccountBalance } from '../types/wallet';
import { calculateAccountBalance } from '../utils/walletHelpers';

export const useAccountBalances = (accounts: WalletAccount[]) => {
  const [balances, setBalances] = useState<Record<string, AccountBalance>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [api, setApi] = useState<TypedApi<typeof dot> | null>(null);

  // Initialize PAPI client
  useEffect(() => {
    const initAPI = async () => {
      try {
        const smoldotProvider = getSmProvider("wss://rpc.polkadot.io");
        const client = createClient(smoldotProvider);
        const typedApi = client.getTypedApi(dot);
        setApi(typedApi);
        console.log('✅ PAPI client initialized for balance fetching');
      } catch (error) {
        console.error('❌ Failed to initialize PAPI:', error);
      }
    };

    initAPI();
  }, []);

  const fetchBalances = useCallback(async () => {
    if (!api || accounts.length === 0) return;

    setIsLoading(true);
    console.log('💰 Fetching balances for', accounts.length, 'accounts...');

    try {
      const balancePromises = accounts.map(async (account) => {
        try {
          const accountInfo = await api.query.System.Account.getValue(account.address, { at: 'best' });
          
          const balance: AccountBalance = {
            address: account.address,
            free: accountInfo.data.free,
            reserved: accountInfo.data.reserved,
            frozen: accountInfo.data.frozen,
            total: accountInfo.data.free + accountInfo.data.reserved,
            formatted: calculateAccountBalance(accountInfo.data.free, 10),
            timestamp: new Date(),
          };

          return { address: account.address, balance };
        } catch (error) {
          console.error(`❌ Failed to fetch balance for ${account.address}:`, error);
          return null;
        }
      });

      const results = await Promise.all(balancePromises);
      const newBalances: Record<string, AccountBalance> = {};

      results.forEach(result => {
        if (result) {
          newBalances[result.address] = result.balance;
        }
      });

      setBalances(newBalances);
      console.log('✅ Balances fetched successfully');

    } catch (error) {
      console.error('❌ Failed to fetch balances:', error);
    } finally {
      setIsLoading(false);
    }
  }, [api, accounts]);

  // Auto-fetch balances when accounts change
  useEffect(() => {
    if (accounts.length > 0 && api) {
      fetchBalances();
      
      // Refresh balances every 30 seconds
      const interval = setInterval(fetchBalances, 30000);
      return () => clearInterval(interval);
    }
  }, [accounts, api, fetchBalances]);

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