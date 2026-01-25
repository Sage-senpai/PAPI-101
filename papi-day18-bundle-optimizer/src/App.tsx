import React, { useState, useEffect } from 'react';
import { BundleAnalyzer } from './components/BundleAnalyzer';
import { ImportStrategyCard } from './components/ImportStrategyCard';
import { PerformanceChart } from './components/PerformanceChart';
import { IMPORT_STRATEGIES, calculateSavings } from './utils/bundleAnalyzer';
import { Package, Zap, Timer, Download, Code, ArrowRight } from 'lucide-react';
import './styles/globals.css';
import './styles/animations.css';

function App() {
  const [selectedStrategy, setSelectedStrategy] = useState<string>('monolithic');
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [analysisComplete, setAnalysisComplete] = useState<boolean>(false);

  const currentStrategy = IMPORT_STRATEGIES.find(s => s.id === selectedStrategy)!;
  const savings = calculateSavings(currentStrategy);

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    console.log('🔍 Starting bundle analysis...');
    console.log(`📦 Selected strategy: ${currentStrategy.name}`);
    console.log(`📊 Initial bundle size: ${IMPORT_STRATEGIES[0].totalSize} bytes`);
    console.log(`🎯 Optimized size: ${currentStrategy.totalSize} bytes`);
    console.log(`💾 Savings: ${savings.percentSaved.toFixed(1)}% smaller`);
    console.log(`⚡ Estimated load time improvement: ${savings.loadTimeSaved}ms faster`);
    
    // Simulate analysis
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    console.log('✅ Bundle analysis complete!');
    console.log('📈 Check the bundle visualization at: http://localhost:3001/bundle-analysis.html');
    
    setIsAnalyzing(false);
    setAnalysisComplete(true);
    
    // Trigger dynamic import simulation
    if (selectedStrategy !== 'monolithic') {
      simulateDynamicImport();
    }
  };

  const simulateDynamicImport = async () => {
    console.log('🚀 Simulating dynamic imports...');
    console.log('⏳ Loading modules on-demand:');
    
    // Simulate progressive loading
    const modules = currentStrategy.modules.filter(m => m.dynamicImport);
    for (const module of modules) {
      await new Promise(resolve => setTimeout(resolve, 500));
      console.log(`✅ Loaded: ${module.name} (${module.size} bytes)`);
    }
    console.log('🎉 All dynamic modules loaded!');
  };

  useEffect(() => {
    console.log('🚀 PAPI Bundle Optimizer initialized');
    console.log('📊 Compare different import strategies for optimal performance');
    console.log('💡 Tip: Dynamic imports can reduce initial bundle size by up to 70%');
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-100">
      {/* Header */}
      <header className="border-b border-gray-700/50 bg-gray-900/50 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Package className="w-10 h-10 text-primary-500" />
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-success-500 rounded-full border-2 border-gray-900"></div>
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-primary-500 to-cyan-400 bg-clip-text text-transparent">
                  PAPI Bundle Optimizer
                </h1>
                <p className="text-gray-400">Day 18: Dynamic Imports & Performance</p>
              </div>
            </div>
            
            <div className="hidden md:flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <Zap className="w-5 h-5 text-yellow-500" />
                <span className="text-sm">Optimized Loading</span>
              </div>
              <div className="flex items-center space-x-2">
                <Timer className="w-5 h-5 text-green-500" />
                <span className="text-sm">Faster dApps</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-gray-800/50 to-gray-900/50 rounded-2xl p-8 border border-gray-700 mb-8 animate-fade-in">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-2xl font-bold mb-4">Optimize Your dApp's Performance</h2>
              <p className="text-gray-300 mb-6">
                Learn how PAPI's dynamic imports can reduce your bundle size by up to <span className="font-bold text-success-500">70%</span> and improve load times by <span className="font-bold text-success-500">300ms+</span>.
              </p>
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center space-x-2">
                  <Download className="w-5 h-5 text-primary-500" />
                  <span>Smaller initial downloads</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Code className="w-5 h-5 text-green-500" />
                  <span>Better code splitting</span>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-900/50 rounded-xl p-6 border border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">Current Strategy</h3>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  currentStrategy.id === 'monolithic' ? 'bg-danger-500/20 text-danger-300' :
                  currentStrategy.id === 'dynamic-client' ? 'bg-warning-500/20 text-warning-300' :
                  'bg-success-500/20 text-success-300'
                }`}>
                  {currentStrategy.performanceScore}/100
                </span>
              </div>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm text-gray-400 mb-1">
                    <span>Bundle Size</span>
                    <span>{Math.round(currentStrategy.totalSize / 1024)} KB</span>
                  </div>
                  <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-primary-500 to-cyan-400 transition-all duration-500"
                      style={{ width: `${(currentStrategy.totalSize / IMPORT_STRATEGIES[0].totalSize) * 100}%` }}
                    ></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm text-gray-400 mb-1">
                    <span>Gzipped</span>
                    <span>{Math.round(currentStrategy.totalGzipped / 1024)} KB</span>
                  </div>
                  <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-green-500 to-emerald-400 transition-all duration-500"
                      style={{ width: `${(currentStrategy.totalGzipped / IMPORT_STRATEGIES[0].totalGzipped) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Strategy Selection */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4 flex items-center space-x-2">
            <Code className="w-5 h-5" />
            <span>Select Import Strategy</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {IMPORT_STRATEGIES.map((strategy) => (
              <ImportStrategyCard
                key={strategy.id}
                strategy={strategy}
                isSelected={selectedStrategy === strategy.id}
                onSelect={() => setSelectedStrategy(strategy.id)}
              />
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 mb-8">
          {/* Bundle Analyzer */}
          <div className="lg:col-span-2">
            <BundleAnalyzer strategy={currentStrategy} />
          </div>

          {/* Savings Panel */}
          <div className="space-y-6">
            <div className="bg-gray-800/30 rounded-xl p-6 border border-gray-700">
              <h3 className="text-xl font-semibold mb-4">Performance Impact</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Size Reduction</span>
                  <span className="text-2xl font-bold text-success-500">
                    {savings.percentSaved.toFixed(1)}%
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Bytes Saved</span>
                  <span className="text-xl font-mono">
                    {(savings.sizeSaved / 1024).toFixed(1)} KB
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Faster Load</span>
                  <span className="text-xl text-success-500">
                    ~{savings.loadTimeSaved}ms
                  </span>
                </div>
                <div className="pt-4 border-t border-gray-700">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-400">Performance Score</span>
                    <span className="text-2xl font-bold">{currentStrategy.performanceScore}/100</span>
                  </div>
                  <div className="h-3 bg-gray-700 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500 transition-all duration-500"
                      style={{ width: `${currentStrategy.performanceScore}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Analyze Button */}
            <button
              onClick={handleAnalyze}
              disabled={isAnalyzing}
              className="w-full py-4 px-6 bg-gradient-to-r from-primary-600 to-cyan-600 hover:from-primary-700 hover:to-cyan-700 disabled:opacity-50 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center space-x-3 group"
            >
              {isAnalyzing ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Analyzing Bundle...</span>
                </>
              ) : (
                <>
                  <span>Analyze Bundle Performance</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>

            {analysisComplete && (
              <div className="bg-success-500/10 border border-success-500/30 rounded-xl p-4 animate-slide-up">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-success-500/20 rounded-full flex items-center justify-center">
                    <Zap className="w-4 h-4 text-success-500" />
                  </div>
                  <div>
                    <p className="font-medium">Analysis Complete!</p>
                    <p className="text-sm text-gray-400">Check browser console for detailed metrics</p>
                  </div>
                </div>
              </div>
            )}

            {/* Tips */}
            <div className="bg-gray-800/30 rounded-xl p-6 border border-gray-700">
              <h4 className="font-semibold mb-3">💡 Pro Tips</h4>
              <ul className="space-y-2 text-sm text-gray-300">
                <li className="flex items-start space-x-2">
                  <div className="w-1.5 h-1.5 bg-primary-500 rounded-full mt-1.5"></div>
                  <span>Use dynamic imports for large modules like descriptors</span>
                </li>
                <li className="flex items-start space-x-2">
                  <div className="w-1.5 h-1.5 bg-primary-500 rounded-full mt-1.5"></div>
                  <span>Keep critical path modules (client) in main bundle</span>
                </li>
                <li className="flex items-start space-x-2">
                  <div className="w-1.5 h-1.5 bg-primary-500 rounded-full mt=1.5"></div>
                  <span>Enable compression (gzip/brotli) for extra savings</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Performance Chart */}
        <div className="bg-gray-800/30 rounded-xl p-6 border border-gray-700 mb-8">
          <h2 className="text-xl font-semibold mb-6">Performance Comparison</h2>
          <PerformanceChart strategies={IMPORT_STRATEGIES} />
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-800/50 mt-12">
        <div className="container mx-auto px-6 py-8">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <h3 className="font-semibold mb-4">About This Tool</h3>
              <p className="text-gray-400 text-sm">
                This dashboard demonstrates PAPI's dynamic import capabilities and their impact on bundle size and performance.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Console Output</h3>
              <p className="text-gray-400 text-sm">
                Open your browser's Developer Tools console to see real-time analysis results and simulated dynamic imports.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Learn More</h3>
              <div className="space-y-2 text-sm">
                <a 
                  href="https://polkadot-api.js.org/docs/advanced/dynamic-imports"
                  className="text-primary-400 hover:text-primary-300 block"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  PAPI Dynamic Imports Docs
                </a>
                <a 
                  href="https://vitejs.dev/guide/features.html#dynamic-import"
                  className="text-primary-400 hover:text-primary-300 block"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Vite Dynamic Import Guide
                </a>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800/50 mt-8 pt-8 text-center text-gray-500 text-sm">
            <p>PAPI Bundle Optimizer • Day 18/30 #PAPI30Days • Built with Vite + TypeScript</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;