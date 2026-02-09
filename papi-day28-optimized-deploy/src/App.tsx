import { useState } from 'react';
import { ChainSelector } from './components/ChainSelector';
import { ChainInfo } from './components/ChainInfo';
import { PerformanceStats } from './components/PerformanceStats';
import { DeploymentGuide } from './components/DeploymentGuide';
import { useOptimizedApi, Chain } from './hooks/useOptimizedApi';
import './styles/App.css';

function App() {
  const [selectedChain, setSelectedChain] = useState<Chain>(null);
  const { api, loading, error, metrics } = useOptimizedApi(selectedChain);

  return (
    <div className="app">
      <header className="header">
        <h1>PAPI Optimized Deployment</h1>
        <p>
          Production-ready Polkadot dApp with cutting-edge optimizations,
          dynamic imports, and sub-500KB bundle size
        </p>
      </header>

      <div className="optimization-banner">
        <div className="banner-content">
          <span className="banner-icon">⚡</span>
          <div>
            <h3>Ultra-Optimized Architecture</h3>
            <p>
              Code splitting • Dynamic imports • Brotli compression • PWA ready
              • &lt;3s load on 3G
            </p>
          </div>
        </div>
      </div>

      <PerformanceStats metrics={metrics} loading={loading} />

      <div className="main-content">
        <ChainSelector
          selectedChain={selectedChain}
          onChainSelect={setSelectedChain}
        />

        <div className="content-area">
          {error && (
            <div className="error-message">
              <p>❌ {error}</p>
            </div>
          )}

          {loading && (
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <p>Loading optimized chain module...</p>
            </div>
          )}

          {api && !loading && <ChainInfo api={api} bundleSize={metrics.estimatedSizeKB} />}

          {!selectedChain && !loading && (
            <div className="empty-state">
              <h3>👆 Select a chain to begin</h3>
              <p>
                Chain descriptors will be loaded dynamically, keeping your
                initial bundle size minimal
              </p>
            </div>
          )}
        </div>
      </div>

      <DeploymentGuide />

      <footer className="footer">
        <p>
          Built with PAPI • Optimized for production • Ready to deploy
        </p>
      </footer>
    </div>
  );
}

export default App;