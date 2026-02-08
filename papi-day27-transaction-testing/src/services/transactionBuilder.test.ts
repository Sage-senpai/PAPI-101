import { buildTransferTransaction, calculateFee, type DotDescriptor } from './transactionBuilder';
import type { TypedApi } from 'polkadot-api';

// Mock the entire PAPI TypedApi
const createMockApi = () => ({
  tx: {
    Balances: {
      transfer_keep_alive: jest.fn((_params: any) => ({
        sign: jest.fn(),
        submit: jest.fn(),
        callData: '0xmockCallData',
      })),
    },
  },
} as unknown as TypedApi<DotDescriptor>);

describe('Transaction Builder Service', () => {
  let mockApi: TypedApi<DotDescriptor>;

  beforeEach(() => {
    mockApi = createMockApi();
    jest.clearAllMocks();
  });

  describe('buildTransferTransaction', () => {
    it('should create a valid transfer transaction', () => {
      const params = {
        dest: '5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty',
        value: 10000000000n,
        api: mockApi,
      };

      const tx = buildTransferTransaction(params);

      expect(mockApi.tx.Balances.transfer_keep_alive).toHaveBeenCalledWith({
        dest: { Id: params.dest },
        value: params.value,
      });
      expect(tx.callData).toBe('0xmockCallData');
    });

    it('should throw error for invalid address length', () => {
      const params = {
        dest: 'short',
        value: 10000000000n,
        api: mockApi,
      };

      expect(() => buildTransferTransaction(params)).toThrow(
        'Invalid destination address'
      );
    });

    it('should throw error for zero or negative value', () => {
      const params = {
        dest: '5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty',
        value: 0n,
        api: mockApi,
      };

      expect(() => buildTransferTransaction(params)).toThrow(
        'Transfer value must be positive'
      );
    });
  });

  describe('calculateFee', () => {
    it('should correctly calculate 1% fee', () => {
      const amount = 1000000000n;
      const fee = calculateFee(amount, 1);
      expect(fee).toBe(10000000n);
    });

    it('should throw error for invalid fee percentage', () => {
      expect(() => calculateFee(1000000000n, -1)).toThrow(
        'Fee percentage must be between 0 and 100'
      );
      expect(() => calculateFee(1000000000n, 101)).toThrow(
        'Fee percentage must be between 0 and 100'
      );
    });

    it('should return zero fee for 0%', () => {
      const fee = calculateFee(1000000000n, 0);
      expect(fee).toBe(0n);
    });
  });
});