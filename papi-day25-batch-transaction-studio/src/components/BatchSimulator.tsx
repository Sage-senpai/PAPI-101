import React, { useState, useEffect } from 'react';
import type { BatchTransaction, SimulationResult } from '../types/batch.types';
import { Play, RotateCcw, CheckCircle2, Loader2, AlertTriangle } from 'lucide-react';

interface BatchSimulatorProps {
  batch: BatchTransaction;
  onSimulate: () => void;
}

const BatchSimulator: React.FC<BatchSimulatorProps> = ({ batch, onSimulate }) => {
  const [isRunning, setIsRunning] = useState(false);
  const [visibleSteps, setVisibleSteps] = useState<number>(0);
  const hasOps = batch.operations.length > 0;
  const simulated = batch.status === 'simulated';

  // Animate steps appearing one by one after simulation fires
  useEffect(() => {
    if (simulated && hasOps) {
      setVisibleSteps(0);
      let i = 0;
      const interval = setInterval(() => {
        i += 1;
        setVisibleSteps(i);
        if (i >= batch.operations.length) clearInterval(interval);
      }, 320);
      return () => clearInterval(interval);
    }
  }, [simulated, batch.operations.length, hasOps]);

  const handleSimulate = () => {
    setIsRunning(true);
    setVisibleSteps(0);
    // Brief delay for UX feedback before result fires
    setTimeout(() => {
      onSimulate();
      setIsRunning(false);
    }, 600);
  };

  const handleReset = () => {
    setVisibleSteps(0);
  };

  // Gas math (mirrors App logic)
  const individualCost = batch.operations.reduce((s, o) => s + o.gasUsed, 0);
  const batchCost = hasOps ? 45000 + batch.operations.length * 8000 : 0;
  const savings = individualCost - batchCost;
  const percent = individualCost > 0 ? ((savings / individualCost) * 100).toFixed(1) : '0';

  return (
    <div className="glass-card rounded-2xl p-6 flex flex-col gap-5">
      <h2 className="text-xl font-bold flex items-center gap-2">
        <Play className="w-5 h-5 text-primary-500" />
        Simulator
      </h2>

      {/* Action buttons */}
      <div className="flex gap-2">
        <button
          onClick={handleSimulate}
          disabled={!hasOps || isRunning}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl font-semibold text-sm transition-all duration-200 ${
            hasOps && !isRunning
              ? 'bg-gradient-to-r from-primary-600 to-blue-600 hover:from-primary-500 hover:to-blue-500 text-white shadow-lg shadow-primary-500/20 hover:shadow-primary-500/30'
              : 'bg-gray-800 text-gray-600 cursor-not-allowed'
          }`}
        >
          {isRunning ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Simulating…
            </>
          ) : (
            <>
              <Play className="w-4 h-4" />
              Simulate Batch
            </>
          )}
        </button>

        {simulated && (
          <button
            onClick={handleReset}
            className="px-4 py-2.5 rounded-xl border border-gray-700 text-gray-400 hover:border-gray-600 hover:text-gray-200 transition-colors text-sm"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Empty state */}
      {!hasOps && (
        <p className="text-xs text-gray-600 text-center py-2">
          Add at least one operation before simulating
        </p>
      )}

      {/* Simulation result */}
      {simulated && hasOps && (
        <div className="flex flex-col gap-3 animate-fade-up">
          {/* Step replay */}
          <div className="space-y-1.5">
            {batch.operations.map((op, i) => {
              const revealed = i < visibleSteps;
              return (
                <div
                  key={op.id}
                  className={`flex items-center gap-2.5 p-2.5 rounded-lg border transition-all duration-300 ${
                    revealed
                      ? 'border-green-500/30 bg-green-500/8'
                      : 'border-gray-700/40 bg-gray-900/40 opacity-40'
                  }`}
                >
                  {revealed ? (
                    <CheckCircle2 className="w-4 h-4 text-green-400 shrink-0" />
                  ) : (
                    <div className="w-4 h-4 rounded-full border-2 border-gray-600 shrink-0" />
                  )}
                  <div className="flex-1 min-w-0">
                    <span className="text-xs font-mono text-gray-200 truncate block">
                      {i + 1}. {op.operation.pallet}.{op.operation.method}
                    </span>
                  </div>
                  <span className="text-xs text-gray-600 font-mono shrink-0">
                    {op.gasUsed.toLocaleString()}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Summary (shows after all steps revealed) */}
          {visibleSteps >= batch.operations.length && (
            <div
              className="mt-1 p-4 rounded-xl border border-green-500/25 bg-green-500/8 animate-fade-up"
            >
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle2 className="w-5 h-5 text-green-400" />
                <span className="text-sm font-bold text-green-300">Simulation Passed</span>
              </div>
              <div className="grid grid-cols-3 gap-3 text-center">
                <div>
                  <div className="text-xs text-gray-500">Batch Cost</div>
                  <div className="text-sm font-bold text-gray-200">{batchCost.toLocaleString()}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500">Savings</div>
                  <div className="text-sm font-bold text-green-300">{percent}%</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500">Type</div>
                  <div className="text-sm font-bold text-gray-200">
                    {batch.atomic ? 'batch_all' : 'batch'}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default BatchSimulator;