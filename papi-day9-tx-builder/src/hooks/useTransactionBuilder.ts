// src/hooks/useTransactionBuilder.ts
import { useState, useCallback } from 'react';
import type { TypedApi } from 'polkadot-api';
import { dot } from '@polkadot-api/descriptors';
import type { TransactionCall, TransactionState } from '../types/transaction';
import { addressValidator } from '../utils/validators';

export const useTransactionBuilder = (api: TypedApi<typeof dot> | null) => {
  const [state, setState] = useState<TransactionState>({
    isBuilding: false,
    error: null,
    transaction: null,
    validation: {
      isValid: false,
      errors: [],
      warnings: [],
    },
  });

  const buildTransaction = useCallback(async (
    pallet: string,
    method: string,
    args: Record<string, unknown>
  ) => {
    if (!api) {
      setState(prev => ({
        ...prev,
        error: 'API not connected. Please connect to Polkadot first.',
        transaction: null,
      }));
      return;
    }

    setState(prev => ({
      ...prev,
      isBuilding: true,
      error: null,
      validation: { isValid: false, errors: [], warnings: [] },
    }));

    try {
      console.log(`🏗️ Building transaction: ${pallet}.${method}`);
      console.log('📦 Parameters:', args);

      const txMethod = (api.tx as Record<string, Record<string, (args: unknown) => { encodedCallData: Uint8Array }>>)[pallet]?.[method];
      if (!txMethod) {
        throw new Error(`Transaction method ${pallet}.${method} not found`);
      }

      const tx = txMethod(args);
      const callData = `0x${Array.from(tx.encodedCallData).map(b => b.toString(16).padStart(2, '0')).join('')}`;
      
      console.log(`✅ Transaction built successfully!`);
      console.log(`📏 Call data size: ${callData.length / 2 - 1} bytes`);

      const transaction: TransactionCall = {
        pallet,
        method,
        args,
        callData,
        description: `Execute ${method} from ${pallet} pallet`,
      };

      const errors: string[] = [];
      const warnings: string[] = [];

      if (args.dest && typeof args.dest === 'string') {
        try {
          addressValidator.parse(args.dest);
        } catch {
          errors.push('Invalid destination address format');
        }
      }

      if (args.value && typeof args.value === 'bigint' && args.value < BigInt(100000000)) {
        warnings.push('Transaction value is very small');
      }

      setState({
        isBuilding: false,
        error: null,
        transaction,
        validation: {
          isValid: errors.length === 0,
          errors,
          warnings,
        },
      });

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error building transaction';
      console.error('❌ Transaction building error:', error);
      
      setState(prev => ({
        ...prev,
        isBuilding: false,
        error: errorMessage,
        transaction: null,
        validation: {
          isValid: false,
          errors: [errorMessage],
          warnings: [],
        },
      }));
    }
  }, [api]);

  const clearTransaction = useCallback(() => {
    setState({
      isBuilding: false,
      error: null,
      transaction: null,
      validation: {
        isValid: false,
        errors: [],
        warnings: [],
      },
    });
    console.log('🧹 Transaction cleared');
  }, []);

  return {
    state,
    buildTransaction,
    clearTransaction,
  };
};