//src/hooks/usePolkadotAPI.ts
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
    apis: [string, number][];
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
  const [client, setClient] = useState<any>(null);

  const connect = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      console.log("🎩 Initializing PAPI Hex Whisperer...");
      console.log("🔮 Loading runtime metadata for txFromCallData support...");
      
      // Initialize Smoldot provider
      const smoldotProvider = getSmProvider("wss://rpc.polkadot.io");
      
      // Create PAPI client
      const papiClient = createClient(smoldotProvider);
      setClient(papiClient);
      
      // Get typed API
      const typedApi = papiClient.getTypedApi(dot);
      setApi(typedApi);
      
      console.log("✅ PAPI client initialized with txFromCallData support!");
      console.log("📡 Connected to Polkadot via light-client");
      console.log("✨ Ready to decode hex call data!");
      
      // Fetch chain info
      const [version, existentialDeposit, header, runtimeVersion] = await Promise.all([
        typedApi.constants.System.Version(),
        typedApi.constants.Balances.ExistentialDeposit(),
        typedApi.query.System.Header.getValue({ at: 'best' }),
        typedApi.apis.Core.Version()
      ]);
      
      const chainInfoData: ChainInfo = {
        chainName: version.implName,
        version: `${version.specVersion}.${version.implVersion}`,
        specVersion: version.specVersion,
        txVersion: runtimeVersion.transactionVersion,
        existentialDeposit,
        blockNumber: Number(header.number),
        runtimeVersion: {
          specName: runtimeVersion.specName,
          implName: runtimeVersion.implName,
          authoringVersion: runtimeVersion.authoringVersion,
          specVersion: runtimeVersion.specVersion,
          implVersion: runtimeVersion.implVersion,
          apis: runtimeVersion.apis,
          transactionVersion: runtimeVersion.transactionVersion,
          stateVersion: runtimeVersion.stateVersion,
        },
      };
      
      setChainInfo(chainInfoData);
      
      console.log("📊 Chain Info Loaded:", {
        chainName: chainInfoData.chainName,
        specVersion: chainInfoData.specVersion,
        txVersion: chainInfoData.txVersion,
        blockNumber: chainInfoData.blockNumber,
      });
      
      console.log("🔍 Important: txFromCallData requires valid runtime metadata");
      console.log("💡 All hex decoding will be validated against current runtime");
      
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