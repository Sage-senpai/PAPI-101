//src/hooks/useHexDecoder.ts
import { useState, useCallback } from 'react';
import { TypedApi } from 'polkadot-api';
import { dot } from '@polkadot-api/descriptors';
import { Binary } from '@polkadot-api/descriptors';
import { DecodedTransaction, DecodingState } from '../types/decoding';
import { isValidHex, calculateHexSize, extractCallIndices } from '../utils/hexUtils';
import { analyzeBytes } from '../utils/byteParser';

export const useHexDecoder = (api: TypedApi<typeof dot> | null) => {
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
      
      // Decode using PAPI's txFromCallData
      const binary = Binary.fromHex(formattedHex);
      const decodedTx = api.txFromCallData(binary);
      
      console.log("✅ Successfully decoded hex!");
      console.log("📋 Decoded transaction:", {
        pallet: decodedTx.pallet,
        method: decodedTx.method,
        args: decodedTx.args,
      });

      const decoded: DecodedTransaction = {
        pallet: decodedTx.pallet,
        method: decodedTx.method,
        args: decodedTx.args,
        callData: formattedHex,
        decodedAt: new Date(),
        isValid: true,
        metadata: indices ? {
          palletIndex: indices.palletIndex,
          callIndex: indices.callIndex,
          bytes: (formattedHex.length - 2) / 2,
          version: 4, // SCALE encoding version
        } : undefined,
      };

      setState(prev => ({
        isDecoding: false,
        error: null,
        decoded,
        history: [decoded, ...prev.history.slice(0, 4)], // Keep last 5
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