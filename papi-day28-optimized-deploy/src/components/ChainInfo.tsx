import React, { useEffect, useState } from 'react';
import { Activity, Cpu, Database, Zap, Clock } from 'lucide-react';
import '../styles/ChainInfo.css';
import { formatDistanceToNow } from 'date-fns';

interface ChainInfoProps {
  api: any;
  bundleSize: number;
}

interface ChainData {
  name: string;
  version: string;
  chain: string;
  blockNumber: number | null;
  timestamp: number | null;
  lastUpdate: Date;
}

export const ChainInfo: React.FC<ChainInfoProps> = ({ api, bundleSize }) => {
  const [chainData, setChainData] = useState<ChainData>({
    name: '',
    version: '',
    chain: '',
    blockNumber: null,
    timestamp: null,
    lastUpdate: new Date(),
  });
  const [loading, setLoading] = useState(true);
  const [performanceMetrics, setPerformanceMetrics] = useState({
    loadTime: 0,
    memoryUsed: 0,
    requests: 0,
  });

  useEffect(() => {
    if (!api) return;

    const fetchChainData = async () => {
      setLoading(true);
      const startTime = performance.now();

      try {
        console.log('📊 Fetching chain metadata...');

        // Get current block number using RPC calls
        const [blockHash, chainName, version] = await Promise.all([
          api.call('chain_getBlockHash', []),
          api.call('system_chain', []).catch(() => 'Polkadot'),
          api.call('system_version', []).catch(() => 'Unknown'),
        ]);

        // Get block details
        let currentBlock = 0;
        if (blockHash) {
          const block = await api.call('chain_getBlock', [blockHash]);
          if (block && block.block && block.block.header) {
            currentBlock = parseInt(block.block.header.number, 16);
          }
        }

        const endTime = performance.now();

        setChainData({
          name: chainName || 'Polkadot Network',
          version: version || 'Latest',
          chain: chainName || 'Polkadot',
          blockNumber: currentBlock,
          timestamp: Date.now(),
          lastUpdate: new Date(),
        });

        setPerformanceMetrics({
          loadTime: Math.round(endTime - startTime),
          memoryUsed:
            Math.round(
              ((performance as any).memory?.usedJSHeapSize || 0) / 1024 / 1024
            ) || 0,
          requests: 3,
        });

        console.log(`✅ Chain data fetched in ${(endTime - startTime).toFixed(2)}ms`);
      } catch (error) {
        console.error('❌ Error fetching chain data:', error);
        setChainData({
          name: 'Chain Network',
          version: 'Connected',
          chain: 'Polkadot',
          blockNumber: null,
          timestamp: Date.now(),
          lastUpdate: new Date(),
        });
      } finally {
        setLoading(false);
      }
    };

    fetchChainData();

    // Subscribe to new block headers
    let subscriptionId: string | null = null;
    
    const subscribeToBlocks = async () => {
      try {
        subscriptionId = await api.subscribe(
          'chain_subscribeNewHeads',
          [],
          (header: any) => {
            if (header && header.number) {
              const blockNum = parseInt(header.number, 16);
              setChainData((prev) => ({
                ...prev,
                blockNumber: blockNum,
                lastUpdate: new Date(),
              }));
            }
          }
        );
        console.log('✅ Subscribed to new blocks');
      } catch (error) {
        console.error('❌ Subscription error:', error);
      }
    };

    subscribeToBlocks();

    return () => {
      if (subscriptionId) {
        api.unsubscribe(subscriptionId).catch(() => {
          // Ignore unsubscribe errors
        });
      }
    };
  }, [api]);

  if (loading) {
    return (
      <div className="chain-info loading">
        <div className="loading-spinner"></div>
        <p>Fetching optimized chain data...</p>
      </div>
    );
  }

  return (
    <div className="chain-info">
      <div className="info-header">
        <h3>{chainData.name}</h3>
        <div className="performance-badge">
          <Zap size={16} />
          <span>Live</span>
        </div>
      </div>

      <div className="info-grid">
        <div className="info-card">
          <Activity className="info-icon" size={24} />
          <div className="info-content">
            <label>Chain Status</label>
            <h4>Connected</h4>
          </div>
        </div>

        <div className="info-card">
          <Cpu className="info-icon" size={24} />
          <div className="info-content">
            <label>Runtime</label>
            <h4>{chainData.version}</h4>
          </div>
        </div>

        <div className="info-card">
          <Database className="info-icon" size={24} />
          <div className="info-content">
            <label>Block Number</label>
            <h4>{chainData.blockNumber?.toLocaleString() || 'N/A'}</h4>
          </div>
        </div>

        <div className="info-card">
          <Clock className="info-icon" size={24} />
          <div className="info-content">
            <label>Last Update</label>
            <h4>{formatDistanceToNow(chainData.lastUpdate, { addSuffix: true })}</h4>
          </div>
        </div>
      </div>

      <div className="performance-metrics">
        <h4>Performance Metrics</h4>
        <div className="metrics-grid">
          <div className="metric">
            <span className="metric-label">Bundle Size</span>
            <span className="metric-value">{bundleSize.toFixed(1)} KB</span>
          </div>
          <div className="metric">
            <span className="metric-label">Load Time</span>
            <span className="metric-value">{performanceMetrics.loadTime}ms</span>
          </div>
          <div className="metric">
            <span className="metric-label">Memory</span>
            <span className="metric-value">
              {performanceMetrics.memoryUsed > 0
                ? `${performanceMetrics.memoryUsed}MB`
                : 'N/A'}
            </span>
          </div>
          <div className="metric">
            <span className="metric-label">Requests</span>
            <span className="metric-value">{performanceMetrics.requests}</span>
          </div>
        </div>
      </div>
    </div>
  );
};