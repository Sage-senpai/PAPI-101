// src/hooks/usePolkadotAPI.ts
import { useState, useEffect, useCallback } from 'react';
import { createClient, type TypedApi } from 'polkadot-api';
import { getSmProvider } from '@polkadot-api/sm-provider';
import { dot } from '@polkadot-api/descriptors';
import type { polkadot } from '@polkadot-api/descriptors';

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
    setIsLoading(true);
    setError(null);
    
    try {
      console.log("🚀 Initializing PAPI client with Smoldot provider...");
      
      const smoldotProvider = getSmProvider(polkadot);
      const papiClient = createClient(smoldotProvider);
      setClient(papiClient);
      
      const typedApi = papiClient.getTypedApi(dot);
      setApi(typedApi);
      
      console.log("✅ PAPI client initialized successfully!");
      
      const [version, existentialDeposit, bestBlock, runtimeVersion] = await Promise.all([
        typedApi.constants.System.Version(),
        typedApi.constants.Balances.ExistentialDeposit(),
        typedApi.query.System.Number.getValue(),
        typedApi.apis.Core.version()
      ]);
      
      // Convert APIs array to string array for display
      const apisArray = runtimeVersion.apis.map((api) => {
        const [nameBytes, version] = api;
        // Convert FixedSizeBinary to hex string
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
      
      setChainInfo(chainInfoData);
      console.log("📊 Chain Info Loaded:", chainInfoData);
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(`Connection failed: ${errorMessage}`);
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