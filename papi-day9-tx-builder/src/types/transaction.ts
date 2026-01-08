// src/types/transactions.ts
export interface TransactionCall {
  pallet: string;
  method: string;
  args: Record<string, any>;
  callData: string;
  description: string;
  estimatedFee?: bigint;
}

export interface PalletInfo {
  name: string;
  calls: string[];
  description: string;
  index: number;
}

export interface TransactionState {
  isBuilding: boolean;
  error: string | null;
  transaction: TransactionCall | null;
  validation: {
    isValid: boolean;
    errors: string[];
    warnings: string[];
  };
}

export interface ChainInfo {
  chainName: string;
  specVersion: number;
  txVersion: number;
  existentialDeposit: bigint;
}