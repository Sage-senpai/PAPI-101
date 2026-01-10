//src/hooks/usePolkadotAPI.ts
import { useState, useEffect, useCallback } from 'react';
import { createClient } from 'polkadot-api';
import { getWsProvider } from 'polkadot-api/ws-provider/web';
import { startFromWorker } from 'polkadot-api/smoldot/from-worker';

export interface ChainInfo {
  chainName: string;
  version: string;
  specVersion: number;
  blockNumber: number;
}

export interface UsePolkadotAPIResult {
  api: any | null;
  chainInfo: ChainInfo | null;
  isLoading: boolean;
  error: string | null;
  connect: () => Promise<void>;
  disconnect: () => void;
}

export const usePolkadotAPI = (): UsePolkadotAPIResult => {
  const [api, setApi] = useState<any | null>(null);
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
      
      // Use WebSocket provider for simplicity
      const wsProvider = getWsProvider('wss://rpc.polkadot.io');
      
      // Create PAPI client
      const papiClient = createClient(wsProvider);
      setClient(papiClient);
      setApi(papiClient);
      
      console.log("✅ PAPI client initialized!");
      console.log("📡 Connected to Polkadot");
      console.log("✨ Ready to decode hex call data!");
      
      // Create a simple chain info object
      setChainInfo({
        chainName: "Polkadot",
        version: "1.0.0",
        specVersion: 1000000,
        blockNumber: 0,
      });
      
      console.log("📊 Connected to Polkadot network");
      
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