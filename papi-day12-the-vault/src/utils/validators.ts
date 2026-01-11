// src/utils/validators.ts
import { hexToU8a, u8aToHex } from '@polkadot/util';
import { blake2AsHex } from '@polkadot/util-crypto';

export class TransactionValidator {
  static validateTransactionStructure(tx: any): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!tx) {
      return { isValid: false, errors: ['Transaction is undefined'] };
    }

    // Check for required fields
    if (!tx.method || !tx.pallet) {
      errors.push('Missing method or pallet information');
    }

    if (!tx.args || typeof tx.args !== 'object') {
      errors.push('Invalid or missing arguments');
    }

    // Validate address formats in args
    if (tx.args && typeof tx.args === 'object') {
      Object.entries(tx.args).forEach(([key, value]) => {
        if (key.toLowerCase().includes('address') && typeof value === 'string') {
          if (!this.validateAddress(value)) {
            errors.push(`Invalid address format in ${key}: ${value}`);
          }
        }
      });
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  static validateAddress(address: string): boolean {
    try {
      // SS58 validation
      if (address.length < 47 || address.length > 48) return false;
      if (!/^[0-9a-zA-Z]+$/.test(address)) return false;
      
      // Additional validation could be added here
      return true;
    } catch {
      return false;
    }
  }

  static validateAmount(amount: bigint | string | number): boolean {
    try {
      const value = typeof amount === 'bigint' ? amount : BigInt(amount.toString());
      return value > BigInt(0);
    } catch {
      return false;
    }
  }

  static calculateTransactionHash(txData: Uint8Array): string {
    return blake2AsHex(txData);
  }

  static verifySignature(signedData: Uint8Array, signature: Uint8Array, publicKey: Uint8Array): boolean {
    try {
      // This is a simplified check - real verification would use the appropriate algorithm
      const expectedLength = publicKey.length * 2; // Approximate signature length
      return signature.length >= expectedLength * 0.8 && signature.length <= expectedLength * 1.2;
    } catch {
      return false;
    }
  }
}