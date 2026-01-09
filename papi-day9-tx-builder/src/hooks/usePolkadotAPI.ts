// src/hooks/usePolkadotAPI.ts
import { useState, useEffect, useCallback } from 'react';
import { createClient, type TypedApi } from 'polkadot-api';
import { getSmProvider } from '@polkadot-api/sm-provider';
import { dot } from '@polkadot-api/descriptors';

export interface ChainInfo {
  chainName: string;
  version: string;
  specVersion: number;
  txVersion: number;
  existentialDeposit: bigint;
  blockNumber: number;
  runtimeVersion: {
    specName: string;
    implName: string;
    authoringVersion: number;
    specVersion: number;
    implVersion: number;
    apis: string[];
    transactionVersion: number;
    stateVersion: number;
  };
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
  const [client, setClient] = useState<ReturnType<typeof createClient> | null>(null);

  const connect = useCallback(async () => {
    // Prevent multiple simultaneous connections
    if (isLoading) {
      console.log("⚠️ Connection already in progress");
      return;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      console.log("🚀 Initializing PAPI client with Smoldot provider...");
      
      // Use string URL directly
      const smoldotProvider = getSmProvider("wss://rpc.polkadot.io");
      const papiClient = createClient(smoldotProvider);
      setClient(papiClient);
      
      const typedApi = papiClient.getTypedApi(dot);
      setApi(typedApi);
      
      console.log("✅ PAPI client initialized successfully!");
      console.log("📡 Fetching chain information...");
      
      // Fetch chain info with a timeout
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Connection timeout after 30 seconds')), 30000)
      );

      const chainDataPromise = Promise.all([
        typedApi.constants.System.Version(),
        typedApi.constants.Balances.ExistentialDeposit(),
        typedApi.query.System.Number.getValue(),
        typedApi.apis.Core.version()
      ]);

      const [version, existentialDeposit, bestBlock, runtimeVersion] = await Promise.race([
        chainDataPromise,
        timeoutPromise
      ]) as Awaited<typeof chainDataPromise>;
      
      console.log("📊 Chain data received:", {
        version: version.impl_name,
        block: Number(bestBlock)
      });
      
      // Convert APIs array to string array for display
      const apisArray = runtimeVersion.apis.map((api) => {
        const [nameBytes, version] = api;
        const hexString = Array.from(nameBytes.asBytes())
          .map(b => b.toString(16).padStart(2, '0'))
          .join('');
        return `${hexString}:${version}`;
      });
      
      const chainInfoData: ChainInfo = {
        chainName: version.impl_name,
        version: `${version.spec_version}.${version.impl_version}`,
        specVersion: version.spec_version,
        txVersion: runtimeVersion.transaction_version,
        existentialDeposit,
        blockNumber: Number(bestBlock),
        runtimeVersion: {
          specName: runtimeVersion.spec_name,
          implName: runtimeVersion.impl_name,
          authoringVersion: runtimeVersion.authoring_version,
          specVersion: runtimeVersion.spec_version,
          implVersion: runtimeVersion.impl_version,
          apis: apisArray,
          transactionVersion: runtimeVersion.transaction_version,
          stateVersion: runtimeVersion.system_version,
        },
      };
      
      // CRITICAL: Set chain info BEFORE setting isLoading to false
      setChainInfo(chainInfoData);
      console.log("✅ Chain Info Loaded Successfully!");
      console.log("📊 Chain:", chainInfoData.chainName);
      console.log("🔢 Block:", chainInfoData.blockNumber);
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(`Connection failed: ${errorMessage}`);
      console.error("❌ Connection error:", err);
      
      // Clean up on error
      setApi(null);
      setChainInfo(null);
    } finally {
      // ALWAYS set isLoading to false at the end
      setIsLoading(false);
      console.log("🏁 Connection attempt completed");
    }
  }, [isLoading]);

  const disconnect = useCallback(() => {
    if (client) {
      try {
        client.destroy();
        console.log("🔌 Disconnected from Polkadot");
      } catch (err) {
        console.error("Error disconnecting:", err);
      }
    }
    setApi(null);
    setChainInfo(null);
    setClient(null);
    setError(null);
  }, [client]);

  useEffect(() => {
    return () => {
      if (client) {
        try {
          client.destroy();
        } catch (err) {
          console.error("Error cleaning up client:", err);
        }
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