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
  defaultValue?: string | number | null;
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
  parameters: Record<string, string | number | null>;
  order: number;
  gasUsed: number;
}

export interface GasCalculation {
  individualCost: number;
  batchCost: number;
  savings: number;
  savingsPercentage: number;
}

export interface SimulationResult {
  success: boolean;
  individualCost: number;
  batchCost: number;
  savings: number;
  percent: string;
  steps: SimulationStep[];
  batchType: string;
}

export interface SimulationStep {
  step: number;
  operation: string;
  gasUsed: number;
  status: 'success' | 'pending';
}

export interface BatchTemplate {
  id: string;
  name: string;
  description: string;
  operations: TransactionOperation[];
  useCases: string[];
  estimatedSavings: number;
  complexity: 'simple' | 'medium' | 'complex';
}