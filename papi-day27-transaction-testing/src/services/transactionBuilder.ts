import type { TypedApi } from 'polkadot-api';

// Mock dot type for testing - in production you'd generate this from chain metadata
export type DotDescriptor = any;

export interface TransferParams {
  dest: string;
  value: bigint;
  api: TypedApi<DotDescriptor>;
}

export function buildTransferTransaction({ dest, value, api }: TransferParams) {
  if (!dest || dest.length !== 48) {
    throw new Error('Invalid destination address');
  }
  
  if (value <= 0n) {
    throw new Error('Transfer value must be positive');
  }

  return api.tx.Balances.transfer_keep_alive({
    dest: { Id: dest },
    value,
  });
}

export function calculateFee(amount: bigint, feePercentage: number): bigint {
  if (feePercentage < 0 || feePercentage > 100) {
    throw new Error('Fee percentage must be between 0 and 100');
  }
  
  return (amount * BigInt(feePercentage * 100)) / 10000n;
}