//src/hooks/usePolkadotAPI.ts
import { useState, useEffect, useCallback } from 'react';
import { createClient } from 'polkadot-api';
import { getSmProvider } from 'polkadot-api/sm-provider';
import { start } from 'polkadot-api/smoldot';
import { chainSpec } from 'polkadot-api/chains/polkadot';

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
      console.log("🔮 Starting Smoldot light client...");
      
      const smoldot = start();
      const chain = await smoldot.addChain({ chainSpec });
      
      console.log("✅ Smoldot light client started!");
      
      const jsonRpcProvider = getSmProvider(chain);
      const papiClient = createClient(jsonRpcProvider);
      
      setClient(papiClient);
      setApi(papiClient);
      
      console.log("📡 PAPI client created and connected!");
      console.log("🔍 Client methods:", Object.keys(papiClient));
      
      try {
        const finalizedBlock = await papiClient.getFinalizedBlock();
        
        setChainInfo({
          chainName: "Polkadot",
          version: "Latest",
          specVersion: 0,
          blockNumber: finalizedBlock.number,
        });
        
        console.log("📊 Connected to Polkadot - Block:", finalizedBlock.number);
        console.log("✨ Ready to decode hex!");
      } catch (infoErr) {
        console.warn("⚠️ Using default chain info");
        setChainInfo({
          chainName: "Polkadot",
          version: "Latest",
          specVersion: 0,
          blockNumber: 0,
        });
      }
      
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
  }, [client]);

  useEffect(() => {
    return () => {
      if (client) {
        try {
          client.destroy();
        } catch (err) {
          console.error("Cleanup error:", err);
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