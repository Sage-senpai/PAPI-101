//src/hooks/useHexDecoder.ts
import { useState, useCallback } from 'react';
import type { DecodedTransaction, DecodingState } from '../types/decoding';
import { isValidHex, calculateHexSize, extractCallIndices } from '../utils/hexUtils';
import { analyzeBytes } from '../utils/byteParser';

export const useHexDecoder = (api: any | null) => {
  const [state, setState] = useState<DecodingState>({
    isDecoding: false,
    error: null,
    decoded: null,
    history: [],
    bytesAnalysis: [],
  });

  const decodeHex = useCallback(async (hex: string) => {
    if (!api) {
      setState(prev => ({
        ...prev,
        error: 'API not connected. Please connect to Polkadot first.',
        decoded: null,
      }));
      return;
    }

    // Validate hex format
    if (!isValidHex(hex)) {
      setState(prev => ({
        ...prev,
        error: 'Invalid hex format. Hex must contain only 0-9, a-f, A-F and have even length.',
        decoded: null,
        bytesAnalysis: [],
      }));
      return;
    }

    // Ensure hex starts with 0x
    const formattedHex = hex.startsWith('0x') ? hex : `0x${hex}`;

    setState(prev => ({
      ...prev,
      isDecoding: true,
      error: null,
    }));

    console.log(`🔍 Starting hex decoding: ${formattedHex.substring(0, 32)}...`);
    console.log(`📏 Hex size: ${calculateHexSize(formattedHex)}`);

    try {
      // Analyze bytes for visualization
      const bytesAnalysis = analyzeBytes(formattedHex);
      
      // Try to extract call indices
      const indices = extractCallIndices(formattedHex);
      
      // For demo purposes, create a mock decoded transaction
      // In production, you would use: await api.txFromCallData(formattedHex)
      const mockPallets: Record<number, string> = {
        4: 'Balances',
        7: 'Staking',
        24: 'Utility',
        30: 'Multisig',
        50: 'Assets',
      };

      const mockMethods: Record<number, string> = {
        0: 'transfer',
        1: 'transfer_keep_alive',
        2: 'force_transfer',
        3: 'transfer_all',
      };

      const pallet = indices ? mockPallets[indices.palletIndex] || `Pallet #${indices.palletIndex}` : 'Unknown';
      const method = indices ? mockMethods[indices.callIndex] || `call_${indices.callIndex}` : 'Unknown';
      
      console.log("✅ Successfully decoded hex!");
      console.log("📋 Decoded transaction:", { pallet, method });

      const decoded: DecodedTransaction = {
        pallet,
        method,
        args: {
          dest: '5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY',
          value: '1000000000000'
        },
        callData: formattedHex,
        decodedAt: new Date(),
        isValid: true,
        metadata: indices ? {
          palletIndex: indices.palletIndex,
          callIndex: indices.callIndex,
          bytes: (formattedHex.length - 2) / 2,
          version: 4,
        } : undefined,
      };

      setState(prev => ({
        isDecoding: false,
        error: null,
        decoded,
        history: [decoded, ...prev.history.slice(0, 4)],
        bytesAnalysis,
      }));

      console.log(`✨ Added to decoding history (${state.history.length + 1} items)`);

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to decode hex';
      console.error('❌ Decoding error:', error);
      
      const indices = extractCallIndices(formattedHex);
      const bytesAnalysis = analyzeBytes(formattedHex);
      
      setState(prev => ({
        isDecoding: false,
        error: errorMessage,
        decoded: {
          pallet: indices ? `Pallet #${indices.palletIndex}` : 'Unknown',
          method: indices ? `Call #${indices.callIndex}` : 'Unknown',
          args: {},
          callData: formattedHex,
          decodedAt: new Date(),
          isValid: false,
          error: errorMessage,
          metadata: indices ? {
            palletIndex: indices.palletIndex,
            callIndex: indices.callIndex,
            bytes: (formattedHex.length - 2) / 2,
            version: 4,
          } : undefined,
        },
        history: prev.history,
        bytesAnalysis,
      }));
    }
  }, [api, state.history.length]);

  const clearDecoder = useCallback(() => {
    setState({
      isDecoding: false,
      error: null,
      decoded: null,
      history: [],
      bytesAnalysis: [],
    });
    console.log('🧹 Decoder cleared');
  }, []);

  return {
    state,
    decodeHex,
    clearDecoder,
  };
};