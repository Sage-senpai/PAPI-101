import React from 'react';
import { ImportStrategy, PAPI_MODULES, formatBytes } from '../utils/bundleAnalyzer';
import { Package, ChevronRight, ExternalLink, CheckCircle, XCircle } from 'lucide-react';

interface BundleAnalyzerProps {
  strategy: ImportStrategy;
}

export const BundleAnalyzer: React.FC<BundleAnalyzerProps> = ({ strategy }) => {
  return (
    <div className="bg-gray-800/30 rounded-xl p-6 border border-gray-700">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold flex items-center space-x-2">
          <Package className="w-5 h-5" />
          <span>Bundle Composition</span>
        </h2>
        <a
          href="/bundle-analysis.html"
          target="_blank"
          className="text-sm text-primary-400 hover:text-primary-300 flex items-center space-x-1"
          rel="noopener noreferrer"
        >
          <span>View Full Analysis</span>
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>

      {/* Module List */}
      <div className="space-y-4 mb-6">
        {strategy.modules.map((module, index) => (
          <div
            key={index}
            className="bg-gray-900/50 rounded-lg p-4 border border-gray-700 hover:border-primary-500/50 transition-colors"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-3">
                <div className={`w-3 h-3 rounded-full ${
                  module.dynamicImport ? 'bg-success-500' : 'bg-warning-500'
                }`}></div>
                <span className="font-medium font-mono">{module.name}</span>
                {module.dynamicImport && (
                  <span className="text-xs px-2 py-0.5 bg-success-500/20 text-success-300 rounded-full">
                    Dynamic
                  </span>
                )}
              </div>
              <div className="text-right">
                <div className="font-mono">{formatBytes(module.size)}</div>
                <div className="text-xs text-gray-500">
                  {formatBytes(module.gzipped)} gzipped
                </div>
              </div>
            </div>
            
            <div className="text-sm text-gray-400 font-mono bg-gray-900 p-3 rounded border border-gray-800">
              {module.importPath}
            </div>
            
            <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-800">
              <div className="flex items-center space-x-4 text-sm">
                <div className="flex items-center space-x-1">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Tree-shakeable</span>
                </div>
                {module.dynamicImport && (
                  <div className="flex items-center space-x-1">
                    <CheckCircle className="w-4 h-4 text-blue-500" />
                    <span>Lazy-loaded</span>
                  </div>
                )}
              </div>
              <div className="text-xs text-gray-500">
                Impact: {((module.size / strategy.totalSize) * 100).toFixed(1)}%
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Import Code Preview */}
      <div>
        <h3 className="font-semibold mb-3 text-gray-300">Implementation Code</h3>
        <pre className="bg-gray-900 rounded-lg p-4 border border-gray-700 overflow-x-auto text-sm">
          <code className="text-gray-300">
{`// ${strategy.name}
${strategy.code}

// Usage example
async function initializePAPI() {
  ${strategy.id === 'monolithic' ? '' : '// Load modules on-demand'}
  ${strategy.modules.map(m => 
    m.dynamicImport ? `const ${m.name.replace('-', '_')} = await ${m.importPath};` : ''
  ).filter(Boolean).join('\n  ')}
  
  // Initialize client with selected strategy
  const client = createClient(
    getSmProvider(chainSpec)
  );
  
  return client.getTypedApi(dot);
}`}
          </code>
        </pre>
      </div>
    </div>
  );
};