import React, { useState, useEffect } from 'react';
import  BatchBuilder  from './components/BatchBuilder';
import  GasCalculator  from './components/GasCalculator';
import  PreviewPanel  from './components/PreviewPanel';
import BatchSimulator  from './components/BatchSimulator';
import { PALLET_OPERATIONS, BATCH_TEMPLATES } from './data/palletOperations';
import type { BatchTransaction, SimulationResult } from './types/batch.types';
import {
  Package,
  Zap,
  TrendingDown,
  Shield,
  Clock,
  Layers,
  CheckCircle,
} from 'lucide-react';

// ─── Inline toast banner (replaces react-hot-toast dependency) ─
const Toast: React.FC<{ message: string | null; onClose: () => void }> = ({ message, onClose }) => {
  useEffect(() => {
    if (message) {
      const t = setTimeout(onClose, 2800);
      return () => clearTimeout(t);
    }
  }, [message, onClose]);

  if (!message) return null;
  return (
    <div className="fixed top-5 right-5 z-50 animate-fade-up">
      <div className="flex items-center gap-3 bg-gray-800 border border-green-500/30 rounded-xl px-4 py-3 shadow-xl shadow-black/30">
        <CheckCircle className="w-4 h-4 text-green-400 shrink-0" />
        <span className="text-sm text-gray-200">{message}</span>
      </div>
    </div>
  );
};

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

  const [simulation, setSimulation] = useState<SimulationResult | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [activeTemplate, setActiveTemplate] = useState<string | null>(null);

  useEffect(() => {
    console.log('📦 Batch Transaction Studio — Ready');
    console.log(`⚡ ${PALLET_OPERATIONS.length} operations | ${BATCH_TEMPLATES.length} templates`);
    BATCH_TEMPLATES.forEach((t) => {
      console.log(`   • ${t.name} → ${t.estimatedSavings}% savings`);
    });
  }, []);

  // ─── Add operation ──────────────────────────────────────────
  const addOp = (opId: string) => {
    const op = PALLET_OPERATIONS.find((o) => o.id === opId);
    if (!op) return;

    const newOp = {
      id: `op-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      operation: op,
      parameters: op.parameters.reduce(
        (acc, p) => {
          acc[p.name] = p.defaultValue ?? null;
          return acc;
        },
        {} as Record<string, string | number | null>
      ),
      order: batch.operations.length,
      gasUsed: op.estimatedGas,
    };

    setBatch((prev) => ({
      ...prev,
      operations: [...prev.operations, newOp],
      totalGas: prev.totalGas + op.estimatedGas,
      status: 'draft',
    }));
    setSimulation(null);
  };

  // ─── Remove operation ───────────────────────────────────────
  const removeOp = (opId: string) => {
    setBatch((prev) => {
      const op = prev.operations.find((o) => o.id === opId);
      if (!op) return prev;
      return {
        ...prev,
        operations: prev.operations.filter((o) => o.id !== opId),
        totalGas: prev.totalGas - op.gasUsed,
        status: 'draft',
      };
    });
    setSimulation(null);
  };

  // ─── Load template ──────────────────────────────────────────
  const loadTemplate = (templateId: string) => {
    const template = BATCH_TEMPLATES.find((t) => t.id === templateId);
    if (!template) return;

    setActiveTemplate(templateId);

    const operations = template.operations.map((op, i) => ({
      id: `tpl-${templateId}-${i}-${Date.now()}`,
      operation: op,
      parameters: op.parameters.reduce(
        (acc, p) => {
          acc[p.name] = p.defaultValue ?? null;
          return acc;
        },
        {} as Record<string, string | number | null>
      ),
      order: i,
      gasUsed: op.estimatedGas,
    }));

    const totalGas = operations.reduce((s, o) => s + o.gasUsed, 0);

    setBatch({
      id: `tpl-${templateId}-${Date.now()}`,
      name: template.name,
      operations,
      totalGas,
      gasSavings: template.estimatedSavings,
      atomic: true,
      status: 'draft',
      timestamp: new Date().toISOString(),
    });

    setSimulation(null);
    setToast(`Loaded "${template.name}" — ${operations.length} operations`);
    console.log(`📋 Template loaded: ${template.name}`);
  };

  // ─── Simulate ───────────────────────────────────────────────
  const simulate = () => {
    if (batch.operations.length === 0) return;

    const individualCost = batch.operations.reduce((s, o) => s + o.gasUsed, 0);
    const batchCost = 45000 + batch.operations.length * 8000;
    const savings = individualCost - batchCost;
    const percent = ((savings / individualCost) * 100).toFixed(1);

    const result: SimulationResult = {
      success: true,
      individualCost,
      batchCost,
      savings,
      percent,
      steps: batch.operations.map((op, i) => ({
        step: i + 1,
        operation: `${op.operation.pallet}.${op.operation.method}`,
        gasUsed: op.gasUsed,
        status: 'success',
      })),
      batchType: batch.atomic ? 'batch_all' : 'batch',
    };

    setSimulation(result);
    setBatch((prev) => ({
      ...prev,
      status: 'simulated',
      gasSavings: parseFloat(percent),
    }));

    console.log('✅ Simulation passed —', percent + '% savings');
  };

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100" style={{ background: '#0f1117' }}>
      <Toast message={toast} onClose={() => setToast(null)} />

      {/* ── Header ── */}
      <header className="border-b border-gray-800/60 bg-gray-900/70 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-5 py-3.5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="absolute -inset-1.5 bg-gradient-to-r from-primary-500 to-green-500 rounded-full blur-md opacity-25" />
                <Package className="w-9 h-9 text-white relative animate-batch-pulse" />
              </div>
              <div>
                <h1 className="text-2xl font-bold gradient-text">Batch Transaction Studio</h1>
                <p className="text-xs text-gray-600">Day 25 · PAPI Batch Calls · Doing More with Less</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5 text-sm text-gray-400">
                <Zap className="w-4 h-4 text-yellow-400" />
                <span>{batch.operations.length} ops</span>
              </div>
              <div className="flex items-center gap-1.5 text-sm text-gray-400">
                <TrendingDown className="w-4 h-4 text-green-400" />
                <span>{batch.gasSavings.toFixed(1)}% saved</span>
              </div>
              <span
                className={`px-3 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                  batch.status === 'simulated'
                    ? 'bg-green-500/15 text-green-300 border border-green-500/25'
                    : 'bg-gray-800 text-gray-500 border border-gray-700'
                }`}
              >
                {batch.status}
              </span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-7 flex flex-col gap-7">
        {/* ── Hero / Templates ── */}
        <div className="glass-card rounded-2xl p-6">
          <div className="grid lg:grid-cols-2 gap-6 items-start">
            {/* Left: pitch */}
            <div>
              <h2 className="text-2xl font-bold mb-3">
                Batch Calls: The Ultimate<br />
                <span className="gradient-text">Efficiency Hack</span>
              </h2>
              <p className="text-gray-400 text-sm leading-relaxed mb-4">
                Combine multiple blockchain operations into a single transaction. Save up to 90% on gas,
                guarantee atomicity, and simplify complex workflows — all powered by PAPI's batch utilities.
              </p>
              <div className="flex flex-wrap gap-2">
                {[
                  { icon: <Shield className="w-3.5 h-3.5 text-green-400" />, label: 'Atomic execution', bg: 'bg-green-500/10 border-green-500/20' },
                  { icon: <TrendingDown className="w-3.5 h-3.5 text-yellow-400" />, label: 'Up to 90% gas savings', bg: 'bg-yellow-500/10 border-yellow-500/20' },
                  { icon: <Clock className="w-3.5 h-3.5 text-blue-400" />, label: 'Single confirmation', bg: 'bg-blue-500/10 border-blue-500/20' },
                ].map((chip) => (
                  <div
                    key={chip.label}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium text-gray-300 ${chip.bg}`}
                  >
                    {chip.icon}
                    {chip.label}
                  </div>
                ))}
              </div>
            </div>

            {/* Right: templates */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-gray-300 flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-primary-500" />
                  Quick-Start Templates
                </h3>
              </div>
              <div className="flex flex-col gap-2">
                {BATCH_TEMPLATES.map((t) => {
                  const isActive = activeTemplate === t.id;
                  return (
                    <button
                      key={t.id}
                      onClick={() => loadTemplate(t.id)}
                      className={`w-full text-left p-3.5 rounded-xl border transition-all duration-200 ${
                        isActive
                          ? 'border-primary-500/50 bg-primary-500/8'
                          : 'border-gray-700/50 hover:border-gray-600 bg-gray-900/40 hover:bg-gray-900/60'
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="font-semibold text-sm text-gray-200">{t.name}</div>
                          <div className="text-xs text-gray-500 mt-0.5">{t.description}</div>
                          <div className="flex gap-1.5 mt-1.5">
                            {t.useCases.map((uc) => (
                              <span key={uc} className="text-xs px-1.5 py-0.5 rounded bg-gray-800 text-gray-500">{uc}</span>
                            ))}
                          </div>
                        </div>
                        <div className="text-right shrink-0 ml-3">
                          <div className="text-lg font-bold text-green-400">{t.estimatedSavings}%</div>
                          <div className="text-xs text-gray-600">savings</div>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Batch type badges */}
              <div className="mt-3 pt-3 border-t border-gray-700/40 flex items-center gap-2">
                <span className="text-xs text-gray-600">Types:</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-green-500/15 text-green-400 font-medium">batch_all</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-blue-500/15 text-blue-400 font-medium">batch</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-purple-500/15 text-purple-400 font-medium">force_batch</span>
              </div>
            </div>
          </div>
        </div>

        {/* ── Main grid ── */}
        <div className="grid lg:grid-cols-[1fr_380px] gap-6">
          {/* Left column */}
          <div className="flex flex-col gap-6">
            <BatchBuilder
              batch={batch}
              setBatch={setBatch}
              addOperation={addOp}
              removeOperation={removeOp}
            />
            <GasCalculator batch={batch} simulation={simulation} />
          </div>

          {/* Right column */}
          <div className="flex flex-col gap-6">
            <PreviewPanel batch={batch} simulation={simulation} />
            <BatchSimulator batch={batch} onSimulate={simulate} />
          </div>
        </div>
      </main>

      {/* ── Footer ── */}
      <footer className="border-t border-gray-800/40 mt-8">
        <div className="max-w-7xl mx-auto px-5 py-6">
          <div className="grid md:grid-cols-3 gap-6 text-sm">
            <div>
              <div className="font-semibold text-gray-300 mb-2">Batch Benefits</div>
              {['Up to 90% gas savings', 'Atomic execution guarantees', 'Single signature, multiple ops'].map((b) => (
                <div key={b} className="flex items-center gap-2 text-gray-500 py-0.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-400" />
                  {b}
                </div>
              ))}
            </div>
            <div>
              <div className="font-semibold text-gray-300 mb-2">Batch Types</div>
              {[
                { name: 'batch_all', desc: 'All succeed or none', color: 'bg-green-400' },
                { name: 'batch', desc: 'Continue on failure', color: 'bg-blue-400' },
                { name: 'force_batch', desc: 'Force execution', color: 'bg-purple-400' },
              ].map((bt) => (
                <div key={bt.name} className="flex items-center gap-2 text-gray-500 py-0.5">
                  <div className={`w-1.5 h-1.5 rounded-full ${bt.color}`} />
                  <span className="font-mono text-xs text-gray-400">{bt.name}</span>
                  <span>— {bt.desc}</span>
                </div>
              ))}
            </div>
            <div>
              <div className="font-semibold text-gray-300 mb-2">Learn More</div>
              <a
                href="https://polkadot-api.js.org"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary-400 hover:text-primary-300 text-xs block py-0.5 transition-colors"
              >
                PAPI Documentation →
              </a>
              <a
                href="https://wiki.polkadot.network"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary-400 hover:text-primary-300 text-xs block py-0.5 transition-colors"
              >
                Polkadot Wiki →
              </a>
            </div>
          </div>
          <div className="border-t border-gray-800/40 mt-5 pt-4 text-center text-xs text-gray-700">
            Batch Transaction Studio · Day 25/30 #PAPI30Days · Turning many into one — efficiently 📦
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;