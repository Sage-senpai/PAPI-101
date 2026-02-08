import { useState, useEffect, useCallback } from 'react';

export type Chain = 'polkadot' | 'kusama' | null;

export function useOptimizedApi(selectedChain: Chain) {
  const [api, setApi] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [metrics, setMetrics] = useState({ loadTime: 0, estimatedSizeKB: 0 });

  const loadApi = useCallback(async (chain: Chain) => {
    if (!chain) {
      setApi(null);
      return;
    }

    setLoading(true);
    setError(null);
    const start = performance.now();

    try {
      // Dynamic import – only loads when chain is selected
      const { [chain]: descriptor } = await import(
        /* webpackChunkName: "descriptor-[request]" */
        `@polkadot-api/descriptors/${chain}`
      );

      const { createClient } = await import('polkadot-api');
      const { getSmProvider } = await import('@polkadot-api/sm-provider');

      const endpoint = chain === 'polkadot'
        ? 'wss://rpc.polkadot.io'
        : 'wss://kusama-rpc.polkadot.io';

      const client = createClient(getSmProvider(endpoint));
      const typedApi = client.getTypedApi(descriptor);

      const loadTime = performance.now() - start;
      // Rough but useful size estimation
      const sizeKB = Math.round(45 + loadTime / 8);

      setMetrics({ loadTime: Math.round(loadTime), estimatedSizeKB: sizeKB });
      setApi(typedApi);

      console.log(`🚀 ${chain.toUpperCase()} loaded in ${loadTime.toFixed(0)} ms (~${sizeKB} KB)`);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Unknown error';
      setError(msg);
      console.error('Chain load failed:', msg);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadApi(selectedChain);
  }, [selectedChain, loadApi]);

  return { api, loading, error, metrics };
}