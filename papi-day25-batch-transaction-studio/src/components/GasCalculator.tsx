import React from 'react';
import type { BatchTransaction, SimulationResult } from '../types/batch.types';
import { TrendingDown, Zap, Shield, AlertCircle } from 'lucide-react';

interface GasCalculatorProps {
  batch: BatchTransaction;
  simulation: SimulationResult | null;
}

const GAS_BASE = 45000;
const GAS_PER_OP = 8000;

function calcGas(batch: BatchTransaction) {
  const individualCost = batch.operations.reduce((s, o) => s + o.gasUsed, 0);
  const batchCost = individualCost > 0 ? GAS_BASE + batch.operations.length * GAS_PER_OP : 0;
  const savings = individualCost - batchCost;
  const percent = individualCost > 0 ? (savings / individualCost) * 100 : 0;
  return { individualCost, batchCost, savings, percent };
}

const BATCH_TYPES = [
  {
    id: 'batch_all' as const,
    label: 'batch_all',
    subtitle: 'Atomic — all succeed or none',
    color: '#10b981',
    icon: <Shield className="w-4 h-4" />,
  },
  {
    id: 'batch' as const,
    label: 'batch',
    subtitle: 'Continue on individual failure',
    color: '#3b82f6',
    icon: <Zap className="w-4 h-4" />,
  },
  {
    id: 'force_batch' as const,
    label: 'force_batch',
    subtitle: 'Force all — ignore failures',
    color: '#8b5cf6',
    icon: <AlertCircle className="w-4 h-4" />,
  },
];

const GasCalculator: React.FC<GasCalculatorProps> = ({ batch, simulation }) => {
  const { individualCost, batchCost, savings, percent } = calcGas(batch);
  const hasOps = batch.operations.length > 0;

  // Determine current batch type label from batch.atomic flag
  // We expand this: atomic=true => batch_all, atomic=false => batch (default non-atomic)
  const activeBatchType = batch.atomic ? 'batch_all' : 'batch';

  return (
    <div className="glass-card rounded-2xl p-6">
      <h2 className="text-xl font-bold mb-5 flex items-center gap-2">
        <TrendingDown className="w-5 h-5 text-green-400" />
        Gas Calculator
      </h2>

      {/* Cost comparison cards */}
      <div className="grid grid-cols-3 gap-3 mb-5">
        <div className="bg-gray-900/60 rounded-xl p-4 border border-gray-700/40">
          <div className="text-xs text-gray-500 mb-1 uppercase tracking-wider">Individual</div>
          <div className="text-xl font-bold text-gray-300">
            {hasOps ? individualCost.toLocaleString() : '—'}
          </div>
          <div className="text-xs text-gray-600 mt-0.5">gas units</div>
        </div>

        <div className="bg-gray-900/60 rounded-xl p-4 border border-green-500/20 relative overflow-hidden">
          {hasOps && (
            <div className="absolute inset-0 bg-gradient-to-r from-green-500/5 to-transparent" />
          )}
          <div className="relative">
            <div className="text-xs text-green-400 mb-1 uppercase tracking-wider font-medium">Batched</div>
            <div className="text-xl font-bold text-green-300">
              {hasOps ? batchCost.toLocaleString() : '—'}
            </div>
            <div className="text-xs text-gray-600 mt-0.5">gas units</div>
          </div>
        </div>

        <div className="bg-gray-900/60 rounded-xl p-4 border border-yellow-500/20 relative overflow-hidden">
          {hasOps && (
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/5 to-transparent" />
          )}
          <div className="relative">
            <div className="text-xs text-yellow-400 mb-1 uppercase tracking-wider font-medium">Saved</div>
            <div className="text-xl font-bold text-yellow-300">
              {hasOps ? `${percent.toFixed(1)}%` : '—'}
            </div>
            <div className="text-xs text-gray-600 mt-0.5">{hasOps ? savings.toLocaleString() + ' units' : ''}</div>
          </div>
        </div>
      </div>

      {/* Savings bar */}
      {hasOps && (
        <div className="mb-5">
          <div className="flex justify-between text-xs text-gray-500 mb-1.5">
            <span>Individual cost</span>
            <span>Batch cost</span>
          </div>
          <div className="h-3 bg-gray-800 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-700 ease-out"
              style={{
                width: `${100 - percent}%`,
                background: 'linear-gradient(90deg, #10b981, #0ea5e9)',
              }}
            />
          </div>
          <div className="flex justify-between text-xs mt-1">
            <span className="text-green-400 font-medium">↓ {percent.toFixed(1)}% cheaper as batch</span>
            <span className="text-gray-600">{batch.operations.length} op{batch.operations.length !== 1 ? 's' : ''} → 1 tx</span>
          </div>
        </div>
      )}

      {/* Batch type selector */}
      <div>
        <div className="text-xs text-gray-500 mb-2.5 uppercase tracking-wider font-medium">Batch Type</div>
        <div className="grid grid-cols-3 gap-2">
          {BATCH_TYPES.map((bt) => {
            const isActive = activeBatchType === bt.id;
            return (
              <div
                key={bt.id}
                className={`p-3 rounded-xl border transition-all duration-200 cursor-pointer ${
                  isActive
                    ? 'border-opacity-60 bg-opacity-10'
                    : 'border-gray-700 hover:border-gray-600 bg-gray-900/40'
                }`}
                style={
                  isActive
                    ? { borderColor: bt.color, backgroundColor: `${bt.color}10` }
                    : {}
                }
              >
                <div className="flex items-center gap-2 mb-1" style={{ color: isActive ? bt.color : '#9ca3af' }}>
                  {bt.icon}
                  <span className="text-xs font-bold font-mono">{bt.label}</span>
                </div>
                <div className="text-xs text-gray-600">{bt.subtitle}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Simulation result echo */}
      {simulation && (
        <div className="mt-4 pt-4 border-t border-gray-700/40">
          <div className="text-xs text-gray-500 mb-2 uppercase tracking-wider">Last Simulation</div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-xs text-green-400 font-medium">
              Passed — {simulation.percent}% savings confirmed
            </span>
          </div>
        </div>
      )}

      {/* Empty state */}
      {!hasOps && (
        <div className="mt-4 pt-4 border-t border-gray-700/40 text-center">
          <p className="text-xs text-gray-600">Add operations to see live gas calculations</p>
        </div>
      )}
    </div>
  );
};

export default GasCalculator;