import { useState, useEffect, useCallback } from 'react';
import { ChainConstant } from '../types/constants';
import toast from 'react-hot-toast';
import { usePapiClient } from './usePapiClient';

const constantsList: Omit<ChainConstant, 'value'>[] = [
  { id: 'system-blockhashcount', pallet: 'System', name: 'BlockHashCount', type: 'u32', description: 'The number of recent blocks to keep in storage.', documentation: ['Block hash count.'], chain: 'polkadot', category: 'system', importance: 'medium' },
  { id: 'system-blocklength', pallet: 'System', name: 'BlockLength', type: 'BlockLength', description: 'Maximum length of a block.', documentation: ['Max block length.'], chain: 'polkadot', category: 'system', importance: 'high' },
  { id: 'system-blockweights', pallet: 'System', name: 'BlockWeights', type: 'BlockWeights', description: 'Weights for block execution.', documentation: ['Block weights.'], chain: 'polkadot', category: 'system', importance: 'high' },
  { id: 'system-dbweight', pallet: 'System', name: 'DbWeight', type: 'RuntimeDbWeight', description: 'DB read/write weights.', documentation: ['DB weight.'], chain: 'polkadot', category: 'system', importance: 'medium' },
  { id: 'system-ss58prefix', pallet: 'System', name: 'SS58Prefix', type: 'u16', description: 'SS58 address prefix.', documentation: ['SS58 prefix.'], chain: 'polkadot', category: 'system', importance: 'low' },
  { id: 'system-version', pallet: 'System', name: 'Version', type: 'RuntimeVersion', description: 'Runtime version info.', documentation: ['Version.'], chain: 'polkadot', category: 'system', importance: 'high' },
  { id: 'balances-existentialdeposit', pallet: 'Balances', name: 'ExistentialDeposit', type: 'Balance', description: 'Minimum balance for account existence.', documentation: ['Existential deposit.'], chain: 'polkadot', category: 'balances', importance: 'high' },
  { id: 'balances-maxlocks', pallet: 'Balances', name: 'MaxLocks', type: 'u32', description: 'Max number of locks on an account.', documentation: ['Max locks.'], chain: 'polkadot', category: 'balances', importance: 'medium' },
  { id: 'balances-maxreserves', pallet: 'Balances', name: 'MaxReserves', type: 'u32', description: 'Max number of reserves.', documentation: ['Max reserves.'], chain: 'polkadot', category: 'balances', importance: 'medium' },
  { id: 'staking-historydepth', pallet: 'Staking', name: 'HistoryDepth', type: 'u32', description: 'Number of eras to keep in history.', documentation: ['History depth.'], chain: 'polkadot', category: 'staking', importance: 'medium' },
  { id: 'staking-maxnominators', pallet: 'Staking', name: 'MaxNominators', type: 'u32', description: 'Maximum number of nominators.', documentation: ['Max nominators.'], chain: 'polkadot', category: 'staking', importance: 'high' },
  { id: 'staking-maxvalidators', pallet: 'Staking', name: 'MaxValidators', type: 'u32', description: 'Maximum number of validators.', documentation: ['Max validators.'], chain: 'polkadot', category: 'staking', importance: 'high' },
  // Add more for length, up to 20 or so
];

export const useChainConstants = () => {
  const { api, error: clientError } = usePapiClient();
  const [constants, setConstants] = useState<ChainConstant[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!api) return;
    try {
      setIsLoading(true);
      const fetchedConstants = constantsList.map(c => ({
        ...c,
        value: api.constants[c.pallet][c.name],
      }));
      setConstants(fetchedConstants);
      toast.success(`Loaded ${fetchedConstants.length} constants`);
    } catch (err) {
      const fetchError = err instanceof Error ? err : new Error('Failed to fetch constants');
      setError(fetchError);
      toast.error('Failed to load constants');
    } finally {
      setIsLoading(false);
    }
  }, [api]);

  useEffect(() => {
    if (clientError) setError(clientError);
  }, [clientError]);

  const refresh = useCallback(() => {
    // Constants are static, but can simulate refresh
    setConstants([]);
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 1000);
  }, []);

  return {
    constants,
    isLoading,
    error,
    refresh,
  };
};