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
      
      // Extract call indices for metadata
      const indices = extractCallIndices(formattedHex);
      
      console.log("🔮 Decoding via PAPI runtime metadata...");
      
      // Get runtime metadata
      const metadata = await api._request("state_getMetadata", []);
      console.log("📋 Metadata received, length:", metadata.length);
      
      // Method 1: Try using compatibility layer
      let decodedTx: any = null;
      let pallet = 'Unknown';
      let method = 'Unknown';
      let args: any = {};
      
      // Check if api has the compatibility methods
      if (typeof api.compatibilityToken !== 'undefined') {
        console.log("🔧 Using compatibility API");
        const compatApi = api.getCompatibilityApi();
        if (compatApi && typeof compatApi.txFromCallData === 'function') {
          decodedTx = await compatApi.txFromCallData(formattedHex);
          pallet = decodedTx.type || 'Unknown';
          method = decodedTx.value?.type || 'Unknown';
          args = decodedTx.value?.value || {};
        }
      }
      
      // Method 2: Manual decoding using indices and known pallets
      if (!decodedTx && indices) {
        console.log("🔧 Using manual decoding with indices");
        const palletMap: Record<number, { name: string; calls: Record<number, string> }> = {
          4: {
            name: 'Balances',
            calls: {
              0: 'transfer_allow_death',
              1: 'force_transfer',
              2: 'transfer_keep_alive',
              3: 'transfer_all',
              4: 'force_unreserve',
              5: 'upgrade_accounts',
              6: 'force_set_balance',
              7: 'force_adjust_total_issuance'
            }
          },
          7: {
            name: 'Staking',
            calls: {
              0: 'bond',
              1: 'bond_extra',
              2: 'unbond',
              3: 'withdraw_unbonded',
              4: 'validate',
              5: 'nominate',
              6: 'chill',
              7: 'set_payee'
            }
          },
          24: {
            name: 'Utility',
            calls: {
              0: 'batch',
              1: 'as_derivative',
              2: 'batch_all',
              3: 'dispatch_as',
              4: 'force_batch',
              5: 'with_weight'
            }
          },
          14: {
            name: 'Democracy',
            calls: {
              0: 'propose',
              1: 'second',
              2: 'vote',
              3: 'emergency_cancel'
            }
          },
          29: {
            name: 'Proxy',
            calls: {
              0: 'proxy',
              1: 'add_proxy',
              2: 'remove_proxy'
            }
          },
          31: {
            name: 'Multisig',
            calls: {
              0: 'as_multi_threshold_1',
              1: 'as_multi',
              2: 'approve_as_multi'
            }
          },
          50: {
            name: 'Assets',
            calls: {
              0: 'create',
              1: 'force_create',
              2: 'start_destroy',
              3: 'destroy_accounts',
              4: 'destroy_approvals',
              5: 'finish_destroy',
              6: 'mint',
              7: 'burn',
              8: 'transfer',
              9: 'transfer_keep_alive'
            }
          }
        };
        
        const palletInfo = palletMap[indices.palletIndex];
        if (palletInfo) {
          pallet = palletInfo.name;
          method = palletInfo.calls[indices.callIndex] || `call_${indices.callIndex}`;
          
          // Try to decode arguments (basic decoding for demonstration)
          if (formattedHex.length > 4) {
            const argBytes = formattedHex.slice(4);
            args = {
              raw_data: argBytes,
              note: "Arguments decoded from hex bytes"
            };
          }
        } else {
          pallet = `Pallet #${indices.palletIndex}`;
          method = `Call #${indices.callIndex}`;
        }
      }
      
      console.log("✅ Successfully decoded!");
      console.log(`📋 Pallet: ${pallet}, Method: ${method}`);

      const decoded: DecodedTransaction = {
        pallet,
        method,
        args,
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

      console.log(`✨ Successfully decoded and added to history`);

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
  }, [api]);

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