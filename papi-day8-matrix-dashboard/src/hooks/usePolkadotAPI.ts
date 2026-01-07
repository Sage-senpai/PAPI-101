// src/hooks/usePolkadotAPI.ts
import { useState, useEffect, useCallback } from 'react';
import { createClient, TypedApi } from 'polkadot-api';
import { getSmProvider } from '@polkadot-api/sm-provider';
import { dot } from '@polkadot-api/descriptors';

export interface ChainInfo {
  chainName: string;
  version: string;
  specVersion: number;
  existentialDeposit: bigint;
  currentBlock: number;
}

export interface UsePolkadotAPIResult {
  api: TypedApi<typeof dot> | null;
  chainInfo: ChainInfo | null;
  isLoading: boolean;
  error: string | null;
  connect: () => Promise<void>;
  disconnect: () => void;
}

export const usePolkadotAPI = (): UsePolkadotAPIResult => {
  const [api, setApi] = useState<TypedApi<typeof dot> | null>(null);
  const [chainInfo, setChainInfo] = useState<ChainInfo | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [client, setClient] = useState<any>(null);

  const connect = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Initialize Smoldot provider with Polkadot chain
      const smoldotProvider = getSmProvider("wss://rpc.polkadot.io");
      
      // Create PAPI client
      const papiClient = createClient(smoldotProvider);
      setClient(papiClient);
      
      // Get typed API
      const typedApi = papiClient.getTypedApi(dot);
      setApi(typedApi);
      
      console.log("🚀 PAPI Client initialized successfully!");
      console.log("📡 Connected to Polkadot via light-client");
      
      // Fetch chain info
      const [version, existentialDeposit, header] = await Promise.all([
        typedApi.constants.System.Version(),
        typedApi.constants.Balances.ExistentialDeposit(),
        typedApi.query.System.Header.getValue({ at: 'best' })
      ]);
      
      setChainInfo({
        chainName: version.implName,
        version: `${version.specVersion}.${version.implVersion}`,
        specVersion: version.specVersion,
        existentialDeposit,
        currentBlock: Number(header.number)
      });
      
      console.log("✅ Chain info fetched:", {
        chainName: version.implName,
        version: `${version.specVersion}.${version.implVersion}`,
        existentialDeposit: existentialDeposit.toString(),
        currentBlock: Number(header.number)
      });
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(`Failed to connect: ${errorMessage}`);
      console.error("❌ Connection error:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const disconnect = useCallback(() => {
    if (client) {
      client.destroy();
      console.log("🔌 Disconnected from Polkadot");
    }
    setApi(null);
    setChainInfo(null);
    setClient(null);
  }, [client]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (client) {
        client.destroy();
      }
    };
  }, [client]);

  return {
    api,
    chainInfo,
    isLoading,
    error,
    connect,
    disconnect
  };
};