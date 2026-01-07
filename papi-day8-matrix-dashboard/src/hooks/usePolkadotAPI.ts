// src/hooks/usePolkadotAPI.ts
import { useState, useEffect, useCallback } from 'react';
import { createClient } from 'polkadot-api';
import type { TypedApi, PolkadotClient } from 'polkadot-api';
import { getSmProvider } from '@polkadot-api/sm-provider';
import { startFromWorker } from 'polkadot-api/smoldot/from-worker';
import { dot } from '@polkadot-api/descriptors';
import type { Dot } from '@polkadot-api/descriptors';
import SmWorker from 'polkadot-api/smoldot/worker?worker';
import { chainSpec } from 'polkadot-api/chains/polkadot';

export interface ChainInfo {
  chainName: string;
  version: string;
  specVersion: number;
  existentialDeposit: bigint;
  currentBlock: number;
}

export interface UsePolkadotAPIResult {
  api: TypedApi<Dot> | null;
  chainInfo: ChainInfo | null;
  isLoading: boolean;
  error: string | null;
  connect: () => Promise<void>;
  disconnect: () => void;
}

export const usePolkadotAPI = (): UsePolkadotAPIResult => {
  const [api, setApi] = useState<TypedApi<Dot> | null>(null);
  const [chainInfo, setChainInfo] = useState<ChainInfo | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [client, setClient] = useState<PolkadotClient | null>(null);

  const connect = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      console.log("🚀 Initializing PAPI connection...");
      
      // Initialize Smoldot with worker
      const smoldot = startFromWorker(new SmWorker());
      
      // Add Polkadot chain using built-in chain spec
      console.log("📡 Loading Polkadot chain spec...");
      const chain = await smoldot.addChain({ chainSpec });
      
      console.log("✅ Chain added to Smoldot");
      
      // Create provider from chain
      const smoldotProvider = getSmProvider(chain);
      
      // Create PAPI client
      const papiClient = createClient(smoldotProvider);
      setClient(papiClient);
      
      // Get typed API
      const typedApi = papiClient.getTypedApi(dot);
      setApi(typedApi);
      
      console.log("✅ PAPI Client initialized successfully!");
      console.log("📡 Connected to Polkadot via Smoldot light-client");
      
      // Fetch chain info using proper APIs
      console.log("📊 Fetching chain information...");
      const [version, existentialDeposit, blockNumber] = await Promise.all([
        typedApi.constants.System.Version(),
        typedApi.constants.Balances.ExistentialDeposit(),
        typedApi.query.System.Number.getValue()
      ]);
      
      setChainInfo({
        chainName: version.impl_name,
        version: `${version.spec_version}.${version.impl_version}`,
        specVersion: version.spec_version,
        existentialDeposit,
        currentBlock: blockNumber
      });
      
      console.log("✅ Chain info fetched:", {
        chainName: version.impl_name,
        version: `${version.spec_version}.${version.impl_version}`,
        existentialDeposit: existentialDeposit.toString(),
        currentBlock: blockNumber
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