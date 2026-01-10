import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import { web3Accounts, web3Enable } from '@polkadot/extension-dapp';
import type { InjectedExtension } from '@polkadot/extension-inject/types';
import type { WalletAccount, ExtensionState, NetworkInfo, SecurityCheck } from '../types/wallet';
import { performSecurityCheck } from '../utils/securityCheck';

interface WalletContextType {
  state: ExtensionState;
  extensions: InjectedExtension[];
  securityCheck: SecurityCheck;
  connect: (appName?: string) => Promise<void>;
  disconnect: () => void;
  selectAccount: (account: WalletAccount) => void;
  refreshAccounts: () => Promise<void>;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const WalletProvider = ({ children }: { children: ReactNode }) => {
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
      console.log('🔍 Extension check:', hasExtension);
      
      setState(prev => ({
        ...prev,
        isAvailable: hasExtension,
      }));
    };

    checkExtension();
    const interval = setInterval(checkExtension, 5000);
    return () => clearInterval(interval);
  }, []);

  const connect = useCallback(async (appName: string = 'PAPI Trust Bridge') => {
    console.log('🤝 Connecting to extension...');

    try {
      if (typeof window.injectedWeb3 === 'undefined') {
        throw new Error('Extension not detected');
      }

      const injectedExtensions = await web3Enable(appName);
      setExtensions(injectedExtensions);
      
      if (injectedExtensions.length === 0) {
        throw new Error('No extension authorized access');
      }

      const allAccounts = await web3Accounts();
      console.log('📋 Accounts:', allAccounts.length);

      if (allAccounts.length === 0) {
        throw new Error('No accounts found');
      }

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

      const network: NetworkInfo = {
        name: 'Polkadot',
        ss58Format: 0,
        token: 'DOT',
        tokenDecimals: 10,
        isConnected: true,
        genesisHash: '0x91b171bb158e2d3848fa23a9f1c25182fb8e20313b2c1eb49219da7a70ce90c3',
        specVersion: 1000000,
      };

      const newSecurityCheck = performSecurityCheck();
      setSecurityCheck(newSecurityCheck);

      const newState: ExtensionState = {
        isAvailable: true,
        isConnected: true,
        accounts: mappedAccounts,
        selectedAccount: mappedAccounts[0] || null,
        network,
        permissions: {
          canSign: true,
          canSignRaw: injectedExtensions[0].signer.signRaw !== undefined,
          canGetAccounts: true,
        },
        error: null,
      };

      console.log('✅ Connected! Setting state:', newState);
      setState(newState);

    } catch (error) {
      console.error('❌ Connection error:', error);
      setState(prev => ({
        ...prev,
        isConnected: false,
        error: error instanceof Error ? error.message : 'Connection failed',
      }));
    }
  }, []);

  const disconnect = useCallback(() => {
    console.log('🔌 Disconnecting...');
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

      console.log('✅ Accounts refreshed');
    } catch (error) {
      console.error('❌ Refresh failed:', error);
    }
  }, [state.isConnected]);

  useEffect(() => {
    console.log('🔄 Context state updated:', {
      isConnected: state.isConnected,
      accountsCount: state.accounts.length,
      hasNetwork: !!state.network,
    });
  }, [state]);

  return (
    <WalletContext.Provider value={{
      state,
      extensions,
      securityCheck,
      connect,
      disconnect,
      selectAccount,
      refreshAccounts,
    }}>
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
};