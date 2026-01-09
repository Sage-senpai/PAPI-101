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

      // Access the transaction method dynamically
      const palletTx = (api.tx as unknown as Record<string, unknown>)[pallet];
      if (!palletTx || typeof palletTx !== 'object') {
        throw new Error(`Pallet ${pallet} not found`);
      }

      const txMethod = (palletTx as Record<string, (args: unknown) => { encodedCallData: Uint8Array }>)[method];
      if (!txMethod) {
        throw new Error(`Transaction method ${pallet}.${method} not found`);
      }

      // Build the transaction
      const tx = txMethod(args);
      
      // Get encoded call data
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

      // Validation
      const errors: string[] = [];
      const warnings: string[] = [];

      // Check destination address if present
      if (args.dest) {
        const destValue = typeof args.dest === 'object' && args.dest !== null && 'Id' in args.dest
          ? (args.dest as { Id: string }).Id
          : args.dest;
        
        if (typeof destValue === 'string') {
          try {
            addressValidator.parse(destValue);
          } catch {
            errors.push('Invalid destination address format');
          }
        }
      }

      // Check controller address if present
      if (args.controller) {
        const controllerValue = typeof args.controller === 'object' && args.controller !== null && 'Id' in args.controller
          ? (args.controller as { Id: string }).Id
          : args.controller;
        
        if (typeof controllerValue === 'string') {
          try {
            addressValidator.parse(controllerValue);
          } catch {
            errors.push('Invalid controller address format');
          }
        }
      }

      // Check value if present
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