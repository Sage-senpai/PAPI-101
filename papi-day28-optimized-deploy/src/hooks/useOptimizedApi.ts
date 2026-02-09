import { useState, useEffect, useCallback } from 'react';

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

      // Dynamically import PAPI and Smoldot
      const { createClient } = await import('polkadot-api');
      const { getSmProvider } = await import('@polkadot-api/sm-provider');
      const { start: startSmoldot } = await import('smoldot');

      const smoldot = startSmoldot();

      const endpoint =
        chain === 'polkadot'
          ? 'wss://rpc.polkadot.io'
          : 'wss://kusama-rpc.polkadot.io';

      console.log(`📡 Connecting to ${endpoint}...`);

      // Fetch chain spec from public repository
      const chainSpecUrl = chain === 'polkadot'
        ? 'https://raw.githubusercontent.com/paritytech/polkadot-sdk/master/polkadot/node/service/chain-specs/polkadot.json'
        : 'https://raw.githubusercontent.com/paritytech/polkadot-sdk/master/polkadot/node/service/chain-specs/kusama.json';

      console.log(`📥 Fetching chainspec from ${chainSpecUrl}...`);
      const chainSpecResponse = await fetch(chainSpecUrl);
      const chainSpec = await chainSpecResponse.text();

      const smoldotChain = await smoldot.addChain({
        chainSpec,
      });

      const client = createClient(getSmProvider(smoldotChain));
      
      // Get the untyped API (no descriptors needed)
      const untypedApi = client.getUntypedApi();

      const loadTime = performance.now() - start;
      // Rough but useful size estimation based on load time
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