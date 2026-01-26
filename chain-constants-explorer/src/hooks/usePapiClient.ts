import { useState, useEffect } from 'react';
import { createClient } from 'polkadot-api';
import { getSmProvider } from 'polkadot-api/sm-provider';
import { chainSpec } from 'polkadot-api/chains/polkadot';
import { start } from 'polkadot-api/smoldot';
import { dot } from '@polkadot-api/descriptors';

export const usePapiClient = () => {
  const [api, setApi] = useState<any>(null);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const init = async () => {
      try {
        const smoldot = start();
        const chain = await smoldot.addChain({ chainSpec });
        const client = createClient(getSmProvider(chain));
        const dotApi = client.getTypedApi(dot);
        setApi(dotApi);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to initialize PAPI client'));
      }
    };
    init();
    return () => {
      // Cleanup if needed
    };
  }, []);

  return { api, error };
};