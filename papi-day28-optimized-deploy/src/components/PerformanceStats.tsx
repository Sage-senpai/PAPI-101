import React from 'react';
import { Gauge, Package, Zap, TrendingUp } from 'lucide-react';
import '../styles/PerformanceStats.css';

interface Metrics {
  loadTime: number;
  estimatedSizeKB: number;
  timestamp: number;
}

interface PerformanceStatsProps {
  metrics: Metrics;
  loading: boolean;
}

export const PerformanceStats: React.FC<PerformanceStatsProps> = ({
  metrics,
  loading,
}) => {
  const getLoadTimeGrade = (time: number) => {
    if (time === 0) return 'N/A';
    if (time < 1000) return 'Excellent';
    if (time < 2000) return 'Good';
    if (time < 3000) return 'Fair';
    return 'Needs Optimization';
  };

  const getBundleSizeGrade = (size: number) => {
    if (size === 0) return 'N/A';
    if (size < 100) return 'Excellent';
    if (size < 200) return 'Good';
    if (size < 500) return 'Fair';
    return 'Heavy';
  };

  return (
    <div className="performance-stats">
      <div className="stats-header">
        <TrendingUp size={20} />
        <h3>Performance Metrics</h3>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon-wrapper">
            <Zap className="stat-icon" size={24} />
          </div>
          <div className="stat-content">
            <p className="stat-label">Load Time</p>
            <p className="stat-value">
              {loading ? (
                <span className="loading-text">Loading...</span>
              ) : metrics.loadTime > 0 ? (
                `${metrics.loadTime}ms`
              ) : (
                'N/A'
              )}
            </p>
            <p className="stat-grade">{getLoadTimeGrade(metrics.loadTime)}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper">
            <Package className="stat-icon" size={24} />
          </div>
          <div className="stat-content">
            <p className="stat-label">Bundle Size</p>
            <p className="stat-value">
              {loading ? (
                <span className="loading-text">Calculating...</span>
              ) : metrics.estimatedSizeKB > 0 ? (
                `${metrics.estimatedSizeKB}KB`
              ) : (
                'N/A'
              )}
            </p>
            <p className="stat-grade">{getBundleSizeGrade(metrics.estimatedSizeKB)}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper">
            <Gauge className="stat-icon" size={24} />
          </div>
          <div className="stat-content">
            <p className="stat-label">Performance Score</p>
            <p className="stat-value">
              {loading ? (
                <span className="loading-text">...</span>
              ) : metrics.loadTime > 0 && metrics.estimatedSizeKB > 0 ? (
                `${Math.min(
                  100,
                  Math.round(100 - (metrics.loadTime / 50 + metrics.estimatedSizeKB / 10))
                )}/100`
              ) : (
                'N/A'
              )}
            </p>
            <p className="stat-grade">
              {metrics.loadTime < 2000 && metrics.estimatedSizeKB < 200
                ? 'Excellent'
                : 'Good'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};