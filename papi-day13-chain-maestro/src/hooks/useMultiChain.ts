// src/hooks/useMultiChain.ts
import { useState, useEffect, useCallback, useRef } from 'react';
import { CHAIN_CONFIGS } from '../utils/chainConfig';
import type { ChainConfig, ChainMetrics, ChainConnection, CrossChainOperation } from '../types/multiChain';

// Mock data generator for demo purposes
const generateMockMetrics = (chainId: string): ChainMetrics => {
  const baseBlock = chainId === 'polkadot' ? 22000000 : chainId === 'kusama' ? 25000000 : 8000000;
  
  return {
    chainId,
    timestamp: new Date(),
    blockNumber: baseBlock + Math.floor(Math.random() * 1000),
    blockHash: `0x${Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}`,
    specVersion: chainId === 'polkadot' ? 1002004 : chainId === 'kusama' ? 1002005 : 1002000,
    transactionVersion: 24,
    validatorCount: chainId === 'polkadot' ? 297 : chainId === 'kusama' ? 1000 : 150,
    totalIssuance: BigInt(chainId === 'polkadot' ? 1370000000 : chainId === 'kusama' ? 15000000 : 5000000) * BigInt(1e10),
    activeAccounts: Math.floor(Math.random() * 10000) + 50000,
    epochProgress: Math.random() * 100,
    latency: Math.floor(Math.random() * 300) + 50,
    status: 'connected' as const
  };
};

export const useMultiChain = () => {
  const [connections, setConnections] = useState<Record<string, ChainConnection>>({});
  const [isInitializing, setIsInitializing] = useState(false);
  const [operations, setOperations] = useState<CrossChainOperation[]>([]);
  const [activeChains, setActiveChains] = useState<string[]>(['polkadot', 'kusama', 'westend']);
  const updateIntervalRef = useRef<NodeJS.Timeout>();

  const initializeChain = useCallback(async (chainConfig: ChainConfig): Promise<ChainConnection | null> => {
    console.log(`🌐 Initializing connection to ${chainConfig.name}...`);
    
    try {
      // Simulate connection delay
      await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 1000));
      
      const metrics = generateMockMetrics(chainConfig.id);
      
      const connection: ChainConnection = {
        api: null, // Would be actual TypedApi in production
        client: null, // Would be actual PolkadotClient in production
        provider: null,
        metrics,
        lastUpdate: new Date()
      };
      
      console.log(`✅ Connected to ${chainConfig.name}:`);
      console.log(`   Block: #${metrics.blockNumber}`);
      console.log(`   Version: v${metrics.specVersion}`);
      console.log(`   Latency: ${metrics.latency}ms`);
      console.log(`   Validators: ${metrics.validatorCount}`);
      
      return connection;
      
    } catch (error) {
      console.error(`❌ Failed to connect to ${chainConfig.name}:`, error);
      
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
    if (!connection) return;
    
    try {
      // Simulate fetching new metrics
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const updatedMetrics = generateMockMetrics(chainId);
      
      setConnections(prev => ({
        ...prev,
        [chainId]: {
          ...connection,
          metrics: updatedMetrics,
          lastUpdate: new Date()
        }
      }));
      
      console.log(`📈 Updated ${chainId}: Block #${updatedMetrics.blockNumber}, Latency: ${updatedMetrics.latency}ms`);
      
    } catch (error) {
      console.error(`❌ Failed to update metrics for ${chainId}:`, error);
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

  const executeCrossChainOperation = useCallback(async <T,>(
    operationId: string,
    chains: string[],
    operation: (api: any, chainId: string) => Promise<T>
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
        setConnections(prevConnections => {
          const newConnections = { ...prevConnections };
          delete newConnections[chainId];
          return newConnections;
        });
        return prev.filter(id => id !== chainId);
      } else {
        return [...prev, chainId];
      }
    });
  }, []);

  const getChainApi = useCallback((chainId: string): any | null => {
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

  useEffect(() => {
    initializeAllChains();
    
    updateIntervalRef.current = setInterval(() => {
      updateAllMetrics();
    }, 10000); // Update every 10 seconds
    
    return () => {
      if (updateIntervalRef.current) {
        clearInterval(updateIntervalRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!isInitializing && Object.keys(connections).length !== activeChains.length) {
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