import { useState, useCallback } from 'react';
import { TypedApi } from 'polkadot-api';
import { dot } from '@polkadot-api/descriptors';
import { MultiAddress } from '@polkadot-api/descriptors';
import { TransactionCall, TransactionState } from '../types/transaction';
import { amountValidator, addressValidator } from '../utils/validators';

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
    args: Record<string, any>
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

      // Dynamically call the tx method based on pallet and method
      const txMethod = (api.tx as any)[pallet]?.[method];
      if (!txMethod) {
        throw new Error(`Transaction method ${pallet}.${method} not found`);
      }

      // Build the transaction
      const tx = txMethod(args);
      
      // Get call data
      const callData = tx.encodedCallData.toString();
      
      console.log(`✅ Transaction built successfully!`);
      console.log(`📏 Call data size: ${(callData.length - 2) / 2} bytes`);
      console.log(`🔢 Call data: ${callData.substring(0, 64)}...`);

      const transaction: TransactionCall = {
        pallet,
        method,
        args,
        callData,
        description: `Execute ${method} from ${pallet} pallet`,
      };

      // Validate parameters
      const errors: string[] = [];
      const warnings: string[] = [];

      // Check for address parameters
      if (args.dest) {
        try {
          addressValidator.parse(args.dest);
        } catch {
          errors.push('Invalid destination address format');
        }
      }

      if (args.value) {
        try {
          if (typeof args.value === 'bigint' && args.value < BigInt(100000000)) {
            warnings.push('Transaction value is very small');
          }
        } catch {
          // Ignore validation errors for non-bigint values
        }
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