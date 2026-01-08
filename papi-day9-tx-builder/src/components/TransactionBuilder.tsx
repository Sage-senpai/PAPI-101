import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { 
  Send, 
  RefreshCw, 
  Copy, 
  Check, 
  AlertCircle,
  Zap,
  ChevronDown
} from 'lucide-react';
import { useTransactionBuilder } from '../hooks/useTransactionBuilder';
import { TypedApi } from 'polkadot-api';
import { dot } from '@polkadot-api/descriptors';
import { MultiAddress } from '@polkadot-api/descriptors';
import { formatBalance, truncateAddress } from '../utils/formatters';
import { getCallParameters } from '../utils/palletsData';

interface TransactionBuilderProps {
  api: TypedApi<typeof dot> | null;
  selectedPallet: string | null;
  selectedCall: string | null;
  onTransactionBuilt: () => void;
}

// Dynamic schema based on selected call
const createSchema = (pallet: string, call: string) => {
  const baseSchema = z.object({
    pallet: z.string(),
    method: z.string(),
  });

  const fields: Record<string, z.ZodTypeAny> = {};

  // Add fields based on pallet and call
  if (pallet === 'Balances' && (call === 'transfer' || call === 'transfer_keep_alive')) {
    fields.dest = z.string()
      .min(47, 'Address too short')
      .max(48, 'Address too long')
      .regex(/^[0-9a-zA-Z]+$/, 'Invalid SS58 address');
    
    fields.value = z.string()
      .regex(/^\d+(\.\d+)?$/, 'Invalid amount')
      .transform(val => BigInt(Math.floor(parseFloat(val) * Math.pow(10, 10))));
  } else if (pallet === 'Staking' && call === 'bond') {
    fields.controller = z.string()
      .min(47, 'Address too short')
      .max(48, 'Address too long')
      .regex(/^[0-9a-zA-Z]+$/, 'Invalid SS58 address');
    
    fields.value = z.string()
      .regex(/^\d+(\.\d+)?$/, 'Invalid amount')
      .transform(val => BigInt(Math.floor(parseFloat(val) * Math.pow(10, 10))));
    
    fields.payee = z.enum(['Staked', 'Stash', 'Controller', 'Account']);
  }

  return baseSchema.extend(fields);
};

export const TransactionBuilder: React.FC<TransactionBuilderProps> = ({
  api,
  selectedPallet,
  selectedCall,
  onTransactionBuilt,
}) => {
  const { state, buildTransaction, clearTransaction } = useTransactionBuilder(api);
  const [copied, setCopied] = useState(false);
  const [autoFillUsed, setAutoFillUsed] = useState(false);

  const schema = selectedPallet && selectedCall 
    ? createSchema(selectedPallet, selectedCall)
    : z.object({});

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    setValue,
    watch,
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      pallet: selectedPallet || '',
      method: selectedCall || '',
    },
  });

  // Auto-fill when pallet/call changes
  useEffect(() => {
    if (selectedPallet && selectedCall && !autoFillUsed) {
      setValue('pallet', selectedPallet);
      setValue('method', selectedCall);
      
      const params = getCallParameters(selectedPallet, selectedCall);
      Object.entries(params).forEach(([key, value]) => {
        if (key === 'value' && typeof value === 'bigint') {
          setValue(key, (Number(value) / Math.pow(10, 10)).toString());
        } else {
          setValue(key, value.toString());
        }
      });
      
      setAutoFillUsed(true);
      console.log(`⚡ Auto-filled parameters for ${selectedPallet}.${selectedCall}`);
    }
  }, [selectedPallet, selectedCall, setValue, autoFillUsed]);

  const onSubmit = async (data: any) => {
    if (!selectedPallet || !selectedCall) return;

    console.log(`🚀 Building transaction: ${selectedPallet}.${selectedCall}`);
    console.log('📋 Form data:', data);

    // Prepare arguments
    const args: Record<string, any> = { ...data };
    delete args.pallet;
    delete args.method;

    // Convert string values back to appropriate types
    if (args.value && typeof args.value === 'string') {
      args.value = BigInt(Math.floor(parseFloat(args.value) * Math.pow(10, 10)));
    }

    // Convert MultiAddress if needed
    if (args.dest) {
      args.dest = MultiAddress.Id(args.dest);
    }
    if (args.controller) {
      args.controller = MultiAddress.Id(args.controller);
    }

    await buildTransaction(selectedPallet, selectedCall, args);
    onTransactionBuilt();
  };

  const handleCopyCallData = () => {
    if (state.transaction?.callData) {
      navigator.clipboard.writeText(state.transaction.callData);
      setCopied(true);
      console.log('📋 Call data copied to clipboard');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleReset = () => {
    reset();
    clearTransaction();
    setAutoFillUsed(false);
  };

  const formData = watch();

  return (
    <div className="glass-card p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-2xl font-bold text-white">Transaction Builder</h3>
          <p className="text-gray-400">Construct transactions using PAPI's tx method</p>
        </div>
        <div className="flex items-center space-x-2 px-3 py-1 bg-turbo-blue/20 rounded-lg">
          <Zap className="w-4 h-4 text-turbo-blue" />
          <span className="text-sm font-semibold text-turbo-blue">Day 9</span>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Selected Transaction Display */}
        {(selectedPallet && selectedCall) && (
          <div className="p-4 bg-black/30 rounded-lg border border-turbo-blue/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Building Transaction</p>
                <p className="text-xl font-bold text-white">
                  {selectedPallet}.{selectedCall}
                </p>
              </div>
              <button
                type="button"
                onClick={handleReset}
                className="px-3 py-1 text-sm bg-gray-800 hover:bg-gray-700 rounded transition-colors"
              >
                <RefreshCw className="w-4 h-4 inline mr-1" />
                Reset
              </button>
            </div>
          </div>
        )}

        {/* Dynamic Form Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {selectedPallet === 'Balances' && selectedCall && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Destination Address
                </label>
                <input
                  type="text"
                  placeholder="5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty"
                  {...register('dest')}
                  className="w-full px-4 py-2 bg-black/50 border border-border-color rounded-lg focus:outline-none focus:border-turbo-blue text-white font-jetbrains"
                />
                {errors.dest && (
                  <p className="mt-1 text-sm text-red-400">{errors.dest.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Amount (DOT)
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="1.0"
                    {...register('value')}
                    className="w-full px-4 py-2 bg-black/50 border border-border-color rounded-lg focus:outline-none focus:border-turbo-blue text-white"
                  />
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                    DOT
                  </div>
                </div>
                {errors.value && (
                  <p className="mt-1 text-sm text-red-400">{errors.value.message}</p>
                )}
                {formData.value && !errors.value && (
                  <p className="mt-1 text-sm text-gray-400">
                    = {formatBalance(parseFloat(formData.value) * Math.pow(10, 10))}
                  </p>
                )}
              </div>
            </>
          )}

          {selectedPallet === 'Staking' && selectedCall === 'bond' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Controller Address
                </label>
                <input
                  type="text"
                  placeholder="5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty"
                  {...register('controller')}
                  className="w-full px-4 py-2 bg-black/50 border border-border-color rounded-lg focus:outline-none focus:border-turbo-blue text-white font-jetbrains"
                />
                {errors.controller && (
                  <p className="mt-1 text-sm text-red-400">{errors.controller.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Amount (DOT)
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="100.0"
                    {...register('value')}
                    className="w-full px-4 py-2 bg-black/50 border border-border-color rounded-lg focus:outline-none focus:border-turbo-blue text-white"
                  />
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                    DOT
                  </div>
                </div>
                {errors.value && (
                  <p className="mt-1 text-sm text-red-400">{errors.value.message}</p>
                )}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Reward Destination
                </label>
                <select
                  {...register('payee')}
                  className="w-full px-4 py-2 bg-black/50 border border-border-color rounded-lg focus:outline-none focus:border-turbo-blue text-white"
                >
                  <option value="Staked">Staked (Add to stake)</option>
                  <option value="Stash">Stash (Pay to stash account)</option>
                  <option value="Controller">Controller (Pay to controller account)</option>
                  <option value="Account">Account (Pay to another account)</option>
                </select>
              </div>
            </>
          )}
        </div>

        {/* Build Button */}
        <div className="flex space-x-4">
          <button
            type="submit"
            disabled={state.isBuilding || !selectedPallet || !selectedCall}
            className="flex-1 px-6 py-3 bg-gradient-to-r from-turbo-blue to-turbo-purple text-white font-bold rounded-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center"
          >
            {state.isBuilding ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Building Transaction...
              </>
            ) : (
              <>
                <Send className="w-5 h-5 mr-2" />
                Build Transaction
              </>
            )}
          </button>
        </div>
      </form>

      {/* Transaction Result */}
      {state.error && (
        <div className="mt-6 p-4 bg-red-900/20 border border-red-500/30 rounded-lg">
          <div className="flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-red-400 mt-0.5" />
            <div>
              <p className="font-semibold text-red-300">Build Failed</p>
              <p className="text-sm text-gray-300 mt-1">{state.error}</p>
            </div>
          </div>
        </div>
      )}

      {state.transaction && (
        <div className="mt-6 p-4 bg-black/30 rounded-lg border border-turbo-blue/30">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h4 className="font-bold text-white text-lg">✅ Transaction Built Successfully</h4>
              <p className="text-sm text-gray-400">Call data ready for signing</p>
            </div>
            <button
              onClick={handleCopyCallData}
              className="px-3 py-1 bg-turbo-blue/20 hover:bg-turbo-blue/30 text-turbo-blue rounded transition-colors flex items-center"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 mr-1" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 mr-1" />
                  Copy Call Data
                </>
              )}
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-400 mb-1">Call Data (Hex)</p>
              <div className="p-3 bg-black/50 rounded font-jetbrains text-sm overflow-x-auto">
                {state.transaction.callData}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Size: {(state.transaction.callData.length - 2) / 2} bytes
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-400">Pallet</p>
                <p className="font-semibold text-white">{state.transaction.pallet}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Method</p>
                <p className="font-semibold text-white">{state.transaction.method}</p>
              </div>
            </div>

            {Object.keys(state.transaction.args).length > 0 && (
              <div>
                <p className="text-sm text-gray-400 mb-2">Parameters</p>
                <div className="p-3 bg-black/30 rounded">
                  <pre className="text-sm text-gray-300 whitespace-pre-wrap">
                    {JSON.stringify(state.transaction.args, (key, value) => {
                      if (typeof value === 'bigint') {
                        return value.toString();
                      }
                      return value;
                    }, 2)}
                  </pre>
                </div>
              </div>
            )}
          </div>

          {/* Validation Results */}
          {state.validation.warnings.length > 0 && (
            <div className="mt-4 p-3 bg-yellow-900/20 border border-yellow-500/30 rounded">
              <p className="text-sm text-yellow-300 font-semibold">⚠️ Warnings</p>
              <ul className="mt-1 text-sm text-yellow-200">
                {state.validation.warnings.map((warning, idx) => (
                  <li key={idx}>• {warning}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      <div className="mt-6 pt-4 border-t border-border-color/50">
        <p className="text-sm text-gray-400">
          <span className="text-turbo-blue font-semibold">💡 Day 9 Achievement:</span> You've successfully built a transaction using PAPI's tx method! 
          The call data above is ready to be signed and submitted to the chain.
        </p>
      </div>
    </div>
  );
};