//src/hooks/useMultiChain.ts
import { useState, useEffect, useCallback, useRef } from 'react';
import { createClient, TypedApi } from 'polkadot-api';
import { getSmProvider } from '@polkadot-api/sm-provider';
import { dot, ksm, wnd } from '@polkadot-api/descriptors';
import { CHAIN_CONFIGS } from '../utils/chainConfig';
import type { ChainConfig, ChainMetrics, ChainConnection, CrossChainOperation } from '../types/multiChain';
import { calculateHealthScore } from '../utils/metricsCalculator';

export const useMultiChain = () => {
  const [connections, setConnections] = useState<Record<string, ChainConnection>>({});
  const [isInitializing, setIsInitializing] = useState(false);
  const [operations, setOperations] = useState<CrossChainOperation[]>([]);
  const [activeChains, setActiveChains] = useState<string[]>(['polkadot', 'kusama', 'westend']);
  const updateIntervalRef = useRef<NodeJS.Timeout>();

  const initializeChain = useCallback(async (chainConfig: ChainConfig): Promise<ChainConnection | null> => {
    console.log(`🌐 Initializing connection to ${chainConfig.name}...`);
    
    try {
      const startTime = Date.now();
      
      // Create provider and client
      const provider = getSmProvider(chainConfig.rpcUrl);
      const client = createClient(provider);
      
      // Get appropriate descriptor
      let api: TypedApi<any>;
      switch (chainConfig.network) {
        case 'polkadot':
          api = client.getTypedApi(dot);
          break;
        case 'kusama':
          api = client.getTypedApi(ksm);
          break;
        case 'westend':
          api = client.getTypedApi(wnd);
          break;
        default:
          throw new Error(`Unsupported network: ${chainConfig.network}`);
      }
      
      // Fetch initial metrics
      const [version, header, validatorCount, totalIssuance] = await Promise.all([
        api.constants.System.Version(),
        api.query.System.Header.getValue({ at: 'best' }),
        api.query.Session.Validators.getValue({ at: 'best' }).then(vals => vals.length).catch(() => 0),
        api.query.Balances.TotalIssuance.getValue({ at: 'best' }).catch(() => BigInt(0))
      ]);
      
      const latency = Date.now() - startTime;
      
      const metrics: ChainMetrics = {
        chainId: chainConfig.id,
        timestamp: new Date(),
        blockNumber: Number(header.number),
        blockHash: header.hash,
        specVersion: version.specVersion,
        transactionVersion: version.transactionVersion,
        validatorCount,
        totalIssuance,
        activeAccounts: 0, // Would need to query accounts
        epochProgress: 0, // Would need to calculate from epoch
        latency,
        status: 'connected'
      };
      
      const connection: ChainConnection = {
        api,
        client,
        provider,
        metrics,
        lastUpdate: new Date()
      };
      
      console.log(`✅ Connected to ${chainConfig.name}:`);
      console.log(`   Block: #${metrics.blockNumber}`);
      console.log(`   Version: ${version.specName} v${version.specVersion}`);
      console.log(`   Latency: ${latency}ms`);
      console.log(`   Validators: ${validatorCount}`);
      
      return connection;
      
    } catch (error) {
      console.error(`❌ Failed to connect to ${chainConfig.name}:`, error);
      
      // Create connection with error state
      const metrics: ChainMetrics = {
        chainId: chainConfig.id,
        timestamp: new Date(),
        blockNumber: 0,
        blockHash: '',
        specVersion: 0,
        transactionVersion: 0,
        validatorCount: 0,
        totalIssuance: BigInt(0),
        activeAccounts: 0,
        epochProgress: 0,
        latency: 0,
        status: 'error',
        lastError: error instanceof Error ? error.message : 'Unknown error'
      };
      
      return {
        api: null,
        client: null,
        provider: null,
        metrics,
        lastUpdate: new Date()
      };
    }
  }, []);

  const initializeAllChains = useCallback(async () => {
    setIsInitializing(true);
    console.log('🎼 Initializing multi-chain connections...');
    
    try {
      const chainPromises = CHAIN_CONFIGS
        .filter(chain => activeChains.includes(chain.id))
        .map(async (chainConfig) => {
          const connection = await initializeChain(chainConfig);
          return { chainId: chainConfig.id, connection };
        });
      
      const results = await Promise.all(chainPromises);
      
      const newConnections: Record<string, ChainConnection> = {};
      results.forEach(({ chainId, connection }) => {
        if (connection) {
          newConnections[chainId] = connection;
        }
      });
      
      setConnections(newConnections);
      console.log(`✅ Multi-chain initialization complete: ${Object.keys(newConnections).length} chains connected`);
      
    } catch (error) {
      console.error('❌ Failed to initialize multi-chain connections:', error);
    } finally {
      setIsInitializing(false);
    }
  }, [initializeChain, activeChains]);

  const updateChainMetrics = useCallback(async (chainId: string) => {
    const connection = connections[chainId];
    if (!connection?.api) return;
    
    try {
      const startTime = Date.now();
      
      const [header, validators] = await Promise.all([
        connection.api.query.System.Header.getValue({ at: 'best' }),
        connection.api.query.Session.Validators.getValue({ at: 'best' }).then(vals => vals.length).catch(() => 0)
      ]);
      
      const latency = Date.now() - startTime;
      
      const updatedMetrics: ChainMetrics = {
        ...connection.metrics,
        timestamp: new Date(),
        blockNumber: Number(header.number),
        blockHash: header.hash,
        validatorCount: validators,
        latency,
        status: 'connected'
      };
      
      setConnections(prev => ({
        ...prev,
        [chainId]: {
          ...connection,
          metrics: updatedMetrics,
          lastUpdate: new Date()
        }
      }));
      
      console.log(`📈 Updated ${chainId}: Block #${updatedMetrics.blockNumber}, Latency: ${latency}ms`);
      
    } catch (error) {
      console.error(`❌ Failed to update metrics for ${chainId}:`, error);
      
      setConnections(prev => ({
        ...prev,
        [chainId]: {
          ...connection,
          metrics: {
            ...connection.metrics,
            status: 'error',
            lastError: error instanceof Error ? error.message : 'Connection lost'
          },
          lastUpdate: new Date()
        }
      }));
    }
  }, [connections]);

  const updateAllMetrics = useCallback(async () => {
    console.log('🔄 Updating metrics for all chains...');
    
    const updatePromises = Object.keys(connections).map(chainId => 
      updateChainMetrics(chainId)
    );
    
    await Promise.all(updatePromises);
    console.log('✅ All chain metrics updated');
  }, [connections, updateChainMetrics]);

  const executeCrossChainOperation = useCallback(async <T>(
    operationId: string,
    chains: string[],
    operation: (api: TypedApi<any>, chainId: string) => Promise<T>
  ): Promise<Record<string, T>> => {
    const operationStart = new Date();
    const op: CrossChainOperation = {
      id: operationId,
      type: 'query',
      chains,
      status: 'executing',
      results: {},
      startedAt: operationStart
    };
    
    setOperations(prev => [...prev, op]);
    
    try {
      const chainPromises = chains.map(async (chainId) => {
        const connection = connections[chainId];
        if (!connection?.api) {
          return {
            chainId,
            success: false,
            error: 'Chain not connected',
            duration: 0
          };
        }
        
        const startTime = Date.now();
        try {
          const data = await operation(connection.api, chainId);
          const duration = Date.now() - startTime;
          
          return {
            chainId,
            success: true,
            data,
            duration
          };
        } catch (error) {
          const duration = Date.now() - startTime;
          return {
            chainId,
            success: false,
            error: error instanceof Error ? error.message : 'Operation failed',
            duration
          };
        }
      });
      
      const results = await Promise.all(chainPromises);
      
      const resultsObj: Record<string, any> = {};
      results.forEach(result => {
        resultsObj[result.chainId] = {
          success: result.success,
          data: result.data,
          error: result.error,
          duration: result.duration
        };
      });
      
      const completedOp: CrossChainOperation = {
        ...op,
        status: 'completed',
        results: resultsObj,
        completedAt: new Date()
      };
      
      setOperations(prev => prev.map(o => o.id === operationId ? completedOp : o));
      
      return resultsObj;
      
    } catch (error) {
      const failedOp: CrossChainOperation = {
        ...op,
        status: 'failed',
        results: {},
        completedAt: new Date()
      };
      
      setOperations(prev => prev.map(o => o.id === operationId ? failedOp : o));
      throw error;
    }
  }, [connections]);

  const toggleChain = useCallback((chainId: string) => {
    setActiveChains(prev => {
      if (prev.includes(chainId)) {
        // Disconnect chain
        setConnections(prevConnections => {
          const newConnections = { ...prevConnections };
          if (newConnections[chainId]?.client) {
            newConnections[chainId].client.destroy();
          }
          delete newConnections[chainId];
          return newConnections;
        });
        return prev.filter(id => id !== chainId);
      } else {
        // Will be connected on next initialization
        return [...prev, chainId];
      }
    });
  }, []);

  const getChainApi = useCallback((chainId: string): TypedApi<any> | null => {
    return connections[chainId]?.api || null;
  }, [connections]);

  const getChainMetrics = useCallback((chainId: string): ChainMetrics | null => {
    return connections[chainId]?.metrics || null;
  }, [connections]);

  const getAllMetrics = useCallback((): Record<string, ChainMetrics> => {
    const metrics: Record<string, ChainMetrics> = {};
    Object.entries(connections).forEach(([chainId, connection]) => {
      metrics[chainId] = connection.metrics;
    });
    return metrics;
  }, [connections]);

  // Initialize chains on mount
  useEffect(() => {
    initializeAllChains();
    
    // Set up periodic updates
    updateIntervalRef.current = setInterval(updateAllMetrics, 30000); // Update every 30 seconds
    
    return () => {
      if (updateIntervalRef.current) {
        clearInterval(updateIntervalRef.current);
      }
      
      // Clean up all connections
      Object.values(connections).forEach(connection => {
        if (connection.client) {
          connection.client.destroy();
        }
      });
    };
  }, [initializeAllChains]);

  // Re-initialize when active chains change
  useEffect(() => {
    if (!isInitializing) {
      initializeAllChains();
    }
  }, [activeChains]);

  return {
    connections,
    isInitializing,
    operations,
    activeChains,
    initializeAllChains,
    updateAllMetrics,
    executeCrossChainOperation,
    toggleChain,
    getChainApi,
    getChainMetrics,
    getAllMetrics,
    chainConfigs: CHAIN_CONFIGS
  };
};