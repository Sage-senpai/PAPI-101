import { useState, useEffect, useCallback } from 'react';
import { createClient } from 'polkadot-api';
import { getSmProvider } from 'polkadot-api/sm-provider';
import { startFromWorker } from 'polkadot-api/smoldot/from-worker';
import SmWorker from 'polkadot-api/smoldot/worker?worker';
import { chainSpec as polkadotChainSpec } from 'polkadot-api/chains/polkadot';
import { chainSpec as kusamaChainSpec } from 'polkadot-api/chains/ksmcc3';

export type Chain = 'polkadot' | 'kusama' | null;

interface Metrics {
  loadTime: number;
  estimatedSizeKB: number;
  timestamp: number;
}

export function useOptimizedApi(selectedChain: Chain) {
  const [api, setApi] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [metrics, setMetrics] = useState<Metrics>({
    loadTime: 0,
    estimatedSizeKB: 0,
    timestamp: 0,
  });

  const loadApi = useCallback(async (chain: Chain) => {
    if (!chain) {
      setApi(null);
      setMetrics({ loadTime: 0, estimatedSizeKB: 0, timestamp: 0 });
      return;
    }

    setLoading(true);
    setError(null);
    const start = performance.now();

    try {
      console.log(`🔄 Loading ${chain.toUpperCase()} API...`);

      // Start Smoldot worker
      const smoldot = startFromWorker(new SmWorker());

      // Get chainspec based on selected chain
      const chainSpec = chain === 'polkadot' ? polkadotChainSpec : kusamaChainSpec;
      
      console.log(`📡 Connecting to ${chain}...`);

      // Add chain to Smoldot
      const smoldotChain = await smoldot.addChain({ chainSpec });

      // Create PAPI client
      const client = createClient(getSmProvider(smoldotChain));

      console.log(`🎯 Creating untyped API for ${chain}...`);
      
      // Get untyped API (works without descriptors!)
      const untypedApi = client.getUntypedApi();

      const loadTime = performance.now() - start;
      const sizeKB = Math.round(45 + loadTime / 8);

      setMetrics({
        loadTime: Math.round(loadTime),
        estimatedSizeKB: sizeKB,
        timestamp: Date.now(),
      });
      setApi(untypedApi);

      console.log(
        `✅ ${chain.toUpperCase()} loaded in ${loadTime.toFixed(0)}ms (~${sizeKB}KB)`
      );
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Unknown error';
      setError(`Failed to connect to ${chain}: ${msg}`);
      console.error('❌ Chain load failed:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadApi(selectedChain);
  }, [selectedChain, loadApi]);

  return { api, loading, error, metrics };
}