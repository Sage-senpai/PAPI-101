import { isValidAddress, formatBalance, validateTransferAmount } from './validation';

describe('Validation Utilities', () => {
  describe('isValidAddress', () => {
    it('validates correct SS58 addresses', () => {
      expect(isValidAddress('5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty')).toBe(true);
      expect(isValidAddress('5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY')).toBe(true);
    });

    it('rejects invalid addresses', () => {
      expect(isValidAddress('not-an-address')).toBe(false);
      expect(isValidAddress('5FHneW46xGXgs5mUiveU4sb')).toBe(false);
      expect(isValidAddress('')).toBe(false);
    });
  });

  describe('formatBalance', () => {
    it('formats balance with correct decimals', () => {
      expect(formatBalance(123456789012n, 10)).toBe('12.3456789012');
      expect(formatBalance(10000000000n, 8)).toBe('100.00000000');
      expect(formatBalance(0n, 12)).toBe('0.000000000000');
    });

    it('handles edge cases', () => {
      expect(formatBalance(1n, 0)).toBe('1');
      expect(formatBalance(0n, 0)).toBe('0');
    });
  });

  describe('validateTransferAmount', () => {
    it('validates transfer amounts correctly', () => {
      expect(validateTransferAmount(1000000n, 100000000n, 1000000n)).toEqual({
        valid: true,
        message: '',
      });

      expect(validateTransferAmount(0n, 100000000n, 1000000n)).toEqual({
        valid: false,
        message: 'Amount must be greater than zero',
      });

      expect(validateTransferAmount(50000000n, 1000000n, 100000000n)).toEqual({
        valid: false,
        message: 'Insufficient balance',
      });
    });
  });
});