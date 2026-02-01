import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, AlertTriangle, Info, CheckCircle2, XCircle } from 'lucide-react';
import { CHAINS, CrossChainAlert } from '../services/chainRegistry';

interface AlertPanelProps {
  selectedChains: string[];
}

/* ── deterministic seed generator ── */
let _seed = 42;
function seededRandom() {
  _seed = (_seed * 1664525 + 1013904223) & 0x7fffffff;
  return _seed / 0x7fffffff;
}

function generateAlerts(chainIds: string[]): CrossChainAlert[] {
  const templates: { type: CrossChainAlert['type']; tmpl: (name: string) => string }[] = [
    { type: 'success', tmpl: n => `${n}: new block produced successfully` },
    { type: 'info',    tmpl: n => `${n}: peer count updated` },
    { type: 'info',    tmpl: n => `${n}: metadata sync complete` },
    { type: 'warning', tmpl: n => `${n}: block time exceeded 8s threshold` },
    { type: 'warning', tmpl: n => `${n}: peer count dropped below 30` },
    { type: 'danger',  tmpl: n => `${n}: RPC connection timeout` },
    { type: 'success', tmpl: n => `${n}: cross-chain XCM message delivered` },
    { type: 'info',    tmpl: n => `${n}: spec version updated` },
  ];

  const now = Date.now();
  return chainIds.slice(0, 4).flatMap((id, ci) => {
    const chain = CHAINS.find(c => c.id === id);
    if (!chain) return [];
    return [0, 1].map((i) => {
      const t = templates[(ci * 2 + i) % templates.length];
      return {
        id:        `${id}-${now}-${i}`,
        type:      t.type,
        chain:     chain.name,
        message:   t.tmpl(chain.name),
        timestamp: new Date(now - (ci * 2 + i) * 4000).toLocaleTimeString(),
        priority:  t.type === 'danger' ? 0 : t.type === 'warning' ? 1 : t.type === 'success' ? 2 : 3,
      };
    });
  }).sort((a, b) => a.priority - b.priority);
}

const ICON_MAP: Record<string, React.FC<{ className?: string }>> = {
  danger:  XCircle,
  warning: AlertTriangle,
  success: CheckCircle2,
  info:    Info,
};

const COLOR_MAP: Record<string, { bg: string; border: string; text: string; icon: string }> = {
  danger:  { bg: '#ef444412', border: '#ef444440', text: '#fca5a5', icon: '#ef4444' },
  warning: { bg: '#f59e0b12', border: '#f59e0b40', text: '#fcd34d', icon: '#f59e0b' },
  success: { bg: '#10b98112', border: '#10b98140', text: '#6ee7b7', icon: '#10b981' },
  info:    { bg: '#0ea5e912', border: '#0ea5e940', text: '#7dd3fc', icon: '#0ea5e9' },
};

export const AlertPanel: React.FC<AlertPanelProps> = ({ selectedChains }) => {
  const [alerts, setAlerts] = useState<CrossChainAlert[]>(() =>
    generateAlerts(selectedChains)
  );

  const refresh = useCallback(() => {
    setAlerts(generateAlerts(selectedChains));
  }, [selectedChains]);

  useEffect(() => { refresh(); }, [refresh]);

  useEffect(() => {
    const t = setInterval(refresh, 12000);
    return () => clearInterval(t);
  }, [refresh]);

  return (
    <div className="bg-gray-800/30 rounded-xl p-5 border border-gray-700">
      {/* header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Bell className="w-4 h-4 text-yellow-400" />
          Live Alerts
        </h3>
        <span className="text-xs text-gray-500">{alerts.length} active</span>
      </div>

      {/* alert list */}
      <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
        <AnimatePresence>
          {alerts.map(alert => {
            const Icon  = ICON_MAP[alert.type] ?? Info;
            const style = COLOR_MAP[alert.type] ?? COLOR_MAP.info;
            return (
              <motion.div
                key={alert.id}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0  }}
                exit  ={{ opacity: 0, x: 12  }}
                transition={{ duration: 0.25 }}
                className="rounded-lg p-3 flex items-start gap-3"
                style={{ backgroundColor: style.bg, border: `1px solid ${style.border}` }}
              >
                <Icon className="w-4 h-4mt-0.5 shrink-0" style={{ color: style.icon }} />
                <div className="min-w-0 flex-1">
                  <p className="text-xs leading-snug" style={{ color: style.text }}>
                    {alert.message}
                  </p>
                  <p className="text-xs text-gray-600 mt-0.5">{alert.timestamp}</p>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {alerts.length === 0 && (
          <p className="text-xs text-gray-600 text-center py-6">
            No alerts — select chains to monitor
          </p>
        )}
      </div>
    </div>
  );
};