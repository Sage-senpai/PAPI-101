import React, { useState } from 'react';
import type { BatchTransaction, SimulationResult } from '../types/batch.types';
import { Eye, Code2, Download, CheckCircle, Circle } from 'lucide-react';

interface PreviewPanelProps {
  batch: BatchTransaction;
  simulation: SimulationResult | null;
}

function generateCode(batch: BatchTransaction): string {
  const batchMethod = batch.atomic ? 'batch_all' : 'batch';
  const calls = batch.operations.map((op) => {
    const params = op.operation.parameters
      .map((p) => {
        const val = op.parameters[p.name];
        if (val == null) return `  ${p.name}: /* TODO */`;
        if (p.type.includes('u128') || p.type.includes('Compact'))
          return `  ${p.name}: ${val}n`;
        return `  ${p.name}: "${val}"`;
      })
      .join(',\n    ');
    return `  api.tx.${op.operation.pallet}.${op.operation.method}({\n    ${params}\n  })`;
  });

  return `import { createClient } from "polkadot-api";
import { getSmProvider } from "@polkadot-api/sm-provider";
import { polkadot } from "@polkadot-api/descriptors";

const client = createClient(getSmProvider("wss://rpc.polkadot.io"));
const api = client.getTypedApi(polkadot);

// Batch transaction (${batchMethod})
const batchTx = api.tx.Utility.${batchMethod}([
${calls.join(',\n')}
]);

// Sign and send
const unsub = await batchTx.signAndSend(signer, ({ status }) => {
  if (status.isFinalized) {
    console.log("✅ Batch finalized:", status.asFinalized.toString());
    unsub();
  }
});
`;
}

const PreviewPanel: React.FC<PreviewPanelProps> = ({ batch, simulation }) => {
  const [tab, setTab] = useState<'structure' | 'code'>('structure');
  const code = generateCode(batch);

  const downloadCode = () => {
    const blob = new Blob([code], { type: 'text/typescript' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'batch-transaction.ts';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="glass-card rounded-2xl p-6 flex flex-col gap-5">
      <h2 className="text-xl font-bold flex items-center gap-2">
        <Eye className="w-5 h-5 text-primary-500" />
        Preview
      </h2>

      {/* Tab switcher */}
      <div className="flex gap-1 bg-gray-900/60 rounded-xl p-1">
        {(['structure', 'code'] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex-1 py-1.5 rounded-lg text-xs font-semibold capitalize transition-colors ${
              tab === t
                ? 'bg-gray-800 text-gray-100 shadow-sm'
                : 'text-gray-500 hover:text-gray-300'
            }`}
          >
            {t === 'structure' ? '📋 Structure' : '💻 Code'}
          </button>
        ))}
      </div>

      {/* Structure tab */}
      {tab === 'structure' && (
        <div className="flex flex-col gap-3">
          {batch.operations.length === 0 ? (
            <p className="text-xs text-gray-600 text-center py-6">
              No operations yet — add some to see the preview
            </p>
          ) : (
            <>
              {/* Batch wrapper */}
              <div className="text-xs text-gray-500 font-mono">
                Utility.{batch.atomic ? 'batch_all' : 'batch'}([
              </div>

              {batch.operations.map((op, i) => (
                <div
                  key={op.id}
                  className="ml-4 p-3 rounded-lg border border-gray-700/60 bg-gray-900/50 animate-fade-up"
                  style={{ animationDelay: `${i * 60}ms` }}
                >
                  <div className="flex items-center gap-2 mb-1.5">
                    <span
                      className="w-2 h-2 rounded-full shrink-0"
                      style={{ background: op.operation.color }}
                    />
                    <span className="text-xs font-mono font-semibold text-gray-200">
                      {op.operation.pallet}.{op.operation.method}
                    </span>
                  </div>
                  <div className="ml-4 space-y-0.5">
                    {op.operation.parameters.map((p) => (
                      <div key={p.name} className="flex gap-2 text-xs font-mono">
                        <span className="text-gray-600">{p.name}:</span>
                        <span className="text-gray-300 truncate">
                          {op.parameters[p.name] ?? '—'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              <div className="text-xs text-gray-500 font-mono">])</div>
            </>
          )}

          {/* Simulation steps */}
          {simulation && (
            <div className="mt-2 pt-3 border-t border-gray-700/40">
              <div className="text-xs text-gray-500 uppercase tracking-wider mb-2">Execution Steps</div>
              <div className="space-y-1.5">
                {simulation.steps.map((step) => (
                  <div key={step.step} className="flex items-center gap-2">
                    {step.status === 'success' ? (
                      <CheckCircle className="w-3.5 h-3.5 text-green-400 shrink-0" />
                    ) : (
                      <Circle className="w-3.5 h-3.5 text-gray-600 shrink-0" />
                    )}
                    <span className="text-xs font-mono text-gray-300 flex-1 truncate">{step.operation}</span>
                    <span className="text-xs text-gray-600">{step.gasUsed.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Code tab */}
      {tab === 'code' && (
        <div className="flex flex-col gap-3">
          <div className="bg-gray-950 rounded-xl border border-gray-800 overflow-hidden">
            <div className="flex items-center justify-between px-4 py-2 border-b border-gray-800">
              <span className="text-xs text-gray-600 font-mono">batch-transaction.ts</span>
              <button
                onClick={downloadCode}
                className="flex items-center gap-1 text-xs text-primary-400 hover:text-primary-300 transition-colors"
              >
                <Download className="w-3 h-3" /> Download
              </button>
            </div>
            <pre className="p-4 text-xs font-mono text-gray-300 overflow-x-auto whitespace-pre leading-relaxed">
              {batch.operations.length > 0 ? code : '// Add operations to generate code…'}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
};

export default PreviewPanel;