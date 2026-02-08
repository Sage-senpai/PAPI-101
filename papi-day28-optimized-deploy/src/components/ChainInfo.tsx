import React, { useEffect, useState } from 'react';
import { Activity, Cpu, Database, Zap } from 'lucide-react';
import './ChainInfo.css';

interface ChainInfoProps {
  api: any;
  bundleSize: number;
}

interface ChainData {
  name: string;
  version: string;
  chain: string;
  nodeName: string;
  blockNumber: number | null;
  timestamp: number | null;
}

export const ChainInfo: React.FC<ChainInfoProps> = ({ api, bundleSize }) => {
  const [chainData, setChainData] = useState<ChainData>({
    name: '',
    version: '',
    chain: '',
    nodeName: '',
    blockNumber: null,
    timestamp: null,
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
        const [properties, version, header, timestamp] = await Promise.all([
          api.constants.System.Properties(),
          api.constants.System.Version(),
          api.query.System.Header.getValue({ at: 'best' }),
          api.query.Timestamp.Now.getValue({ at: 'best' }),
        ]);

        const endTime = performance.now();
        
        setChainData({
          name: properties.ss58Format === 0 ? 'Polkadot' : 'Kusama',
          version: version.specVersion.toString(),
          chain: properties.chain?.toString() || 'Unknown',
          nodeName: version.implName.toString(),
          blockNumber: header?.number ?? null,
          timestamp: timestamp ? Number(timestamp) : null,
        });

        setPerformanceMetrics({
          loadTime: Math.round(endTime - startTime),
          memoryUsed: Math.round((performance as any).memory?.usedJSHeapSize / 1024 / 1024),
          requests: 4,
        });

        console.log(`📊 Chain data fetched in ${endTime - startTime}ms`);
        console.log(`🧠 Memory usage: ${Math.round((performance as any).memory?.usedJSHeapSize / 1024 / 1024)}MB`);
        
      } catch (error) {
        console.error('Error fetching chain data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchChainData();
    
    // Subscribe to new blocks
    const unsubscribe = api.query.System.Number.watchValue().subscribe((blockNumber: any) => {
      setChainData(prev => ({
        ...prev,
        blockNumber: Number(blockNumber),
      }));
    });

    return () => unsubscribe.unsubscribe();
  }, [api]);

  if (loading) {
    return (
      <div className="chain-info loading">
        <div className="loading-spinner"></div>
        <p>Loading optimized chain data...</p>
      </div>
    );
  }

  return (
    <div className="chain-info">
      <div className="info-header">
        <h3>{chainData.name} Chain Info</h3>
        <div className="performance-badge">
          <Zap size={16} />
          <span>Optimized</span>
        </div>
      </div>
      
      <div className="info-grid">
        <div className="info-card">
          <Activity className="info-icon" />
          <div className="info-content">
            <label>Chain</label>
            <h4>{chainData.chain}</h4>
          </div>
        </div>
        
        <div className="info-card">
          <Cpu className="info-icon" />
          <div className="info-content">
            <label>Runtime Version</label>
            <h4>{chainData.version}</h4>
          </div>
        </div>
        
        <div className="info-card">
          <Database className="info-icon" />
          <div className="info-content">
            <label>Block Number</label>
            <h4>{chainData.blockNumber?.toLocaleString() || 'N/A'}</h4>
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
            <span className="metric-value">{performanceMetrics.memoryUsed}MB</span>
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