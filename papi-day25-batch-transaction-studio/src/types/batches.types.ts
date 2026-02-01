export interface TransactionOperation {
  id: string;
  pallet: string;
  method: string;
  description: string;
  parameters: OperationParameter[];
  estimatedGas: number;
  color: string;
  icon: string;
  category: 'transfer' | 'staking' | 'governance' | 'utility' | 'assets';
}

export interface OperationParameter {
  name: string;
  type: string;
  description: string;
  required: boolean;
  defaultValue?: any;
}

export interface BatchTransaction {
  id: string;
  name: string;
  operations: BatchOperation[];
  totalGas: number;
  gasSavings: number;
  atomic: boolean;
  status: 'draft' | 'simulated' | 'ready';
  timestamp: string;
}

export interface BatchOperation {
  id: string;
  operation: TransactionOperation;
  parameters: Record<string, any>;
  order: number;
  gasUsed: number;
}

export interface GasCalculation {
  individualCost: number;
  batchCost: number;
  savings: number;
  savingsPercentage: number;
}