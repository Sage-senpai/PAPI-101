// src/hooks/usePolkadotExtension.ts
import { useState, useEffect, useCallback } from 'react';
import { web3Accounts, web3Enable } from '@polkadot/extension-dapp';
import type { InjectedExtension } from '@polkadot/extension-inject/types';
import type { WalletAccount, ExtensionState, NetworkInfo } from '../types/wallet';
import { performSecurityCheck } from '../utils/securityCheck';

export const usePolkadotExtension = () => {
  const [state, setState] = useState<ExtensionState>({
    isAvailable: false,
    isConnected: false,
    accounts: [],
    selectedAccount: null,
    network: null,
    permissions: {
      canSign: false,
      canSignRaw: false,
      canGetAccounts: false,
    },
    error: null,
  });

  const [extensions, setExtensions] = useState<InjectedExtension[]>([]);
  const [securityCheck, setSecurityCheck] = useState(performSecurityCheck());

  // Check for extension availability
  useEffect(() => {
    const checkExtension = () => {
      const hasExtension = typeof window.injectedWeb3 !== 'undefined';
      console.log('🔍 Checking for Polkadot.js Extension:', hasExtension ? 'Available' : 'Not Available');
      
      setState(prev => ({
        ...prev,
        isAvailable: hasExtension,
      }));
    };

    checkExtension();
    
    // Listen for extension installation
    const interval = setInterval(checkExtension, 5000);
    return () => clearInterval(interval);
  }, []);

  // Connect to extension
  const connect = useCallback(async (appName: string = 'PAPI Trust Bridge') => {
    if (!state.isAvailable) {
      const error = 'Polkadot.js Extension not detected. Please install it first.';
      console.error('❌ Connection failed:', error);
      
      setState(prev => ({
        ...prev,
        error,
      }));
      return;
    }

    try {
      console.log('🤝 Connecting to Polkadot.js Extension...');
      console.log('📝 App name:', appName);
      
      // Request extension authorization
      const injectedExtensions = await web3Enable(appName);
      setExtensions(injectedExtensions);
      
      if (injectedExtensions.length === 0) {
        throw new Error('No extension authorized access');
      }

      console.log('✅ Extensions authorized:', injectedExtensions.map(e => e.name));
      
      // Get accounts
      const allAccounts = await web3Accounts();
      console.log('📋 Accounts found:', allAccounts.length);

      // Map to our interface
      const mappedAccounts: WalletAccount[] = allAccounts.map(account => ({
        address: account.address,
        meta: {
          name: account.meta.name || 'Unnamed Account',
          source: account.meta.source || 'unknown',
          genesisHash: account.meta.genesisHash,
        },
        type: account.type,
        publicKey: account.publicKey,
      }));

      // Check permissions from first extension
      const firstExtension = injectedExtensions[0];
      const permissions = {
        canSign: true, // Assume true if extension is connected
        canSignRaw: firstExtension.signer.signRaw !== undefined,
        canGetAccounts: true,
      };

      // Determine network from genesis hash (if available)
      let network: NetworkInfo | null = null;
      if (mappedAccounts.length > 0 && mappedAccounts[0].meta.genesisHash) {
        network = {
          name: 'Polkadot', // This would be determined from genesis hash
          ss58Format: 0, // Polkadot format
          token: 'DOT',
          tokenDecimals: 10,
          isConnected: true,
          genesisHash: mappedAccounts[0].meta.genesisHash,
          specVersion: 1000, // This would be fetched from chain
        };
      }

      setState({
        isAvailable: true,
        isConnected: true,
        accounts: mappedAccounts,
        selectedAccount: mappedAccounts[0] || null,
        network,
        permissions,
        error: null,
      });

      // Update security check
      setSecurityCheck(performSecurityCheck());

      console.log('✅ Successfully connected to extension!');
      console.log('📊 Security check:', securityCheck.level);
      console.log('👤 Selected account:', mappedAccounts[0]?.address);

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error connecting to extension';
      console.error('❌ Connection error:', error);
      
      setState(prev => ({
        ...prev,
        isConnected: false,
        error: errorMessage,
      }));
    }
  }, [state.isAvailable, securityCheck.level]);

  const disconnect = useCallback(() => {
    console.log('🔌 Disconnecting from extension...');
    
    setState({
      isAvailable: true,
      isConnected: false,
      accounts: [],
      selectedAccount: null,
      network: null,
      permissions: {
        canSign: false,
        canSignRaw: false,
        canGetAccounts: false,
      },
      error: null,
    });
    
    setExtensions([]);
    console.log('✅ Disconnected successfully');
  }, []);

  const selectAccount = useCallback((account: WalletAccount) => {
    console.log('👤 Selecting account:', account.address);
    
    setState(prev => ({
      ...prev,
      selectedAccount: account,
    }));
  }, []);

  const refreshAccounts = useCallback(async () => {
    if (!state.isConnected) return;
    
    try {
      console.log('🔄 Refreshing accounts...');
      const allAccounts = await web3Accounts();
      
      const mappedAccounts: WalletAccount[] = allAccounts.map(account => ({
        address: account.address,
        meta: {
          name: account.meta.name || 'Unnamed Account',
          source: account.meta.source || 'unknown',
          genesisHash: account.meta.genesisHash,
        },
        type: account.type,
        publicKey: account.publicKey,
      }));

      setState(prev => ({
        ...prev,
        accounts: mappedAccounts,
        selectedAccount: mappedAccounts.find(a => a.address === prev.selectedAccount?.address) || mappedAccounts[0] || null,
      }));

      console.log('✅ Accounts refreshed:', mappedAccounts.length);
    } catch (error) {
      console.error('❌ Failed to refresh accounts:', error);
    }
  }, [state.isConnected]);

  return {
    state,
    extensions,
    securityCheck,
    connect,
    disconnect,
    selectAccount,
    refreshAccounts,
  };
};