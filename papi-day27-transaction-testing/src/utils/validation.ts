export function isValidAddress(address: string): boolean {
  // Basic SS58 address validation
  if (!address || typeof address !== 'string') {
    return false;
  }
  
  // SS58 addresses are typically 47-48 characters
  if (address.length < 47 || address.length > 48) {
    return false;
  }
  
  // Should start with a number (network prefix)
  if (!/^[1-9]/.test(address)) {
    return false;
  }
  
  return true;
}

export function formatBalance(balance: bigint, decimals: number): string {
  const balanceStr = balance.toString().padStart(decimals + 1, '0');
  const integerPart = balanceStr.slice(0, -decimals) || '0';
  const decimalPart = balanceStr.slice(-decimals);
  
  return `${integerPart}.${decimalPart}`;
}

export interface ValidationResult {
  valid: boolean;
  message: string;
}

export function validateTransferAmount(
  amount: bigint,
  balance: bigint,
  fee: bigint
): ValidationResult {
  if (amount <= 0n) {
    return {
      valid: false,
      message: 'Amount must be greater than zero',
    };
  }
  
  if (amount + fee > balance) {
    return {
      valid: false,
      message: 'Insufficient balance',
    };
  }
  
  return {
    valid: true,
    message: '',
  };
}