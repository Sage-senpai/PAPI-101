import React, { useState, useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import { BatchBuilder } from './components/BatchBuilder';
import { GasCalculator } from './components/GasCalculator';
import { PreviewPanel } from './components/PreviewPanel';
import { BatchSimulator } from './components/BatchSimulator';
import { PALLET_OPERATIONS, BATCH_TEMPLATES } from './data/palletOperations';
import { BatchTransaction } from './types/batch.types';
import { Package, Zap, Calculator, Play, Save, Download, TrendingDown } from 'lucide-react';
import './styles/globals.css';
import './styles/builderAnimations.css';

function App() {
  const [batch, setBatch] = useState<BatchTransaction>({
    id: `batch-${Date.now()}`,
    name: 'New Batch Transaction',
    operations: [],
    totalGas: 0,
    gasSavings: 0,
    atomic: true,
    status: 'draft',
    timestamp: new Date().toISOString(),
  });

  const [simulation, setSimulation] = useState<any>(null);

  useEffect(() => {
    console.log('📦 Batch Transaction Studio – Ready for creation');
    console.log('⚡ Powered by PAPI batch utilities');
    console.log(`🎯 ${PALLET_OPERATIONS.length} operations available`);
    console.log(`📋 ${BATCH_TEMPLATES.length} ready-to-use templates`);
    console.log('');
    console.log('Quick start ideas:');
    BATCH_TEMPLATES.forEach(t => {
      console.log(`   • ${t.name} → ${t.estimatedSavings}% savings`);
    });
  }, []);

  const addOp = (opId: string) => {
    const op = PALLET_OPERATIONS.find(o => o.id === opId);
    if (!op) return;

    const newOp = {
      id: `op-${Date.now()}`,
      operation: op,
      parameters: op.parameters.reduce((acc, p) => {
        acc[p.name] = p.defaultValue ?? null;
        return acc;
      }, {} as Record<string, any>),
      order: batch.operations.length,
      gasUsed: op.estimatedGas,
    };

    setBatch(prev => ({
      ...prev,
      operations: [...prev.operations, newOp],
      totalGas: prev.totalGas + op.estimatedGas,
    }));
  };

  const removeOp = (opId: string) => {
    setBatch(prev => {
      const op = prev.operations.find(o => o.id === opId);
      if (!op) return prev;
      return {
        ...prev,
        operations: prev.operations.filter(o => o.id !== opId),
        totalGas: prev.totalGas - op.gasUsed,
      };
    });
  };

  const simulate = () => {
    if (batch.operations.length === 0) return;

    const individual = batch.operations.reduce((sum, op) => sum + op.gasUsed, 0);
    const batchBase = 45000;
    const perOp = 8000;
    const batchCost = batchBase + batch.operations.length * perOp;
    const savings = individual - batchCost;
    const percent = (savings / individual) * 100;

    setSimulation({
      individualCost: individual,
      batchCost,
      savings,
      percent: percent.toFixed(1),
      success: true,
    });

    setBatch(prev => ({ ...prev, status: 'simulated' }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-100">
      <Toaster position="top-right" />
      
      <header className="border-b border-gray-700/50 bg-gray-900/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center space-x-4">
              <Package className="w-10 h-10 text-white animate-batch-pulse" />
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-primary-500 to-green-500 bg-clip-text text-transparent">
                  Batch Transaction Studio
                </h1>
                <p className="text-gray-400">Day 25: Mastering Efficient Transactions</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <Zap className="w-5 h-5 text-yellow-500" />
                <span className="text-sm">{batch.operations.length} operations</span>
              </div>
              <div className="flex items-center space-x-2">
                <TrendingDown className="w-5 h-5 text-green-500" />
                <span className="text-sm">{batch.gasSavings.toFixed(1)}% saved</span>
              </div>
              <div className={`px-4 py-1 rounded-full text-sm font-medium ${
                batch.status === 'simulated' ? 'bg-green-500/20 text-green-300' : 'bg-gray-600/20 text-gray-300'
              }`}>
                {batch.status.toUpperCase()}
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-10">
          <div className="bg-gradient-to-r from-gray-800/30 to-gray-900/30 rounded-2xl p-8 border border-gray-700/50 backdrop-blur-sm">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="text-3xl font-bold mb-4">Batch Calls: Efficiency Redefined</h2>
                <p className="text-gray-300 mb-6 text-lg">
                  Bundle multiple operations into one transaction. Save gas, ensure atomicity, reduce user friction – all with PAPI's elegant batch utilities.
                </p>
                <div className="flex flex-wrap gap-4">
                  <div className="flex items-center space-x-2 bg-green-500/10 px-4 py-2 rounded-lg">
                    <TrendingDown className="w-5 h-5 text-green-400" />
                    <span>Up to 90% gas savings</span>
                  </div>
                  <div className="flex items-center space-x-2 bg-blue-500/10 px-4 py-2 rounded-lg">
                    <Shield className="w-5 h-5 text-blue-400" />
                    <span>Atomic guarantees</span>
                  </div>
                  <div className="flex items-center space-x-2 bg-purple-500/10 px-4 py-2 rounded-lg">
                    <Clock className="w-5 h-5 text-purple-400" />
                    <span>Single confirmation</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-900/50 rounded-xl p-6 border border-gray-700">
                <h3 className="font-semibold mb-4">Quick-Start Templates</h3>
                <div className="space-y-3">
                  {BATCH_TEMPLATES.map(t => (
                    <button
                      key={t.id}
                      className="w-full text-left p-4 rounded-lg bg-gray-800/50 hover:bg-gray-700/50 transition-colors"
                    >
                      <div className="flex justify-between">
                        <div>
                          <h4 className="font-medium">{t.name}</h4>
                          <p className="text-sm text-gray-400">{t.description}</p>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-green-400">{t.estimatedSavings}%</div>
                          <div className="text-xs text-gray-500">savings</div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <BatchBuilder
              batch={batch}
              setBatch={setBatch}
              addOperation={addOp}
              removeOperation={removeOp}
            />
            <GasCalculator batch={batch} simulation={simulation} />
          </div>

          <div className="space-y-8">
            <PreviewPanel batch={batch} simulation={simulation} />
            <BatchSimulator batch={batch} onSimulate={simulate} />
          </div>
        </div>
      </main>

      <footer className="border-t border-gray-800/50 mt-12 py-8">
        <div className="container mx-auto px-6 text-center text-gray-500 text-sm">
          Batch Transaction Studio • Day 25/30 #PAPI30Days • Turning many into one – efficiently 📦
        </div>
      </footer>
    </div>
  );
}

export default App;