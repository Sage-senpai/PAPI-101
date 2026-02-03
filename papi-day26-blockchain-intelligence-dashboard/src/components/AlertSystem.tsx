import React, { useEffect } from 'react';
import { AlertTriangle, Bell, CheckCircle, XCircle, Info } from 'lucide-react';
import toast from 'react-hot-toast';

interface Alert {
  id: string;
  severity: 'info' | 'warning' | 'critical';
  title: string;
  description: string;
  timestamp: string;
}

interface AlertSystemProps {
  account: string;
  alerts: Alert[];
  setAlerts: (alerts: Alert[]) => void;
}

export const AlertSystem: React.FC<AlertSystemProps> = ({ account, alerts, setAlerts }) => {
  useEffect(() => {
    // Generate initial alerts
    const initialAlerts: Alert[] = [
      {
        id: '1',
        severity: 'warning',
        title: 'Unusual Activity Pattern',
        description: 'Weekend transaction volume 35% above average',
        timestamp: new Date().toISOString(),
      },
      {
        id: '2',
        severity: 'info',
        title: 'Balance Milestone',
        description: 'Account balance exceeded 140 DOT threshold',
        timestamp: new Date(Date.now() - 3600000).toISOString(),
      },
      {
        id: '3',
        severity: 'critical',
        title: 'Large Transfer Detected',
        description: 'Outgoing transfer of 25 DOT to new address',
        timestamp: new Date(Date.now() - 7200000).toISOString(),
      },
    ];
    
    setAlerts(initialAlerts);
    
    // Show toast for critical alerts
    initialAlerts
      .filter(a => a.severity === 'critical')
      .forEach(alert => {
        toast.error(alert.title, {
          duration: 5000,
          icon: '🚨',
        });
      });

    console.log(`🚨 Alert system monitoring ${account.slice(0, 12)}...`);
    console.log(`📊 ${initialAlerts.length} active alerts detected`);

    // Simulate new alerts periodically
    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        const newAlert: Alert = {
          id: Date.now().toString(),
          severity: Math.random() > 0.5 ? 'info' : 'warning',
          title: 'New Pattern Detected',
          description: 'Staking reward received',
          timestamp: new Date().toISOString(),
        };
        
        setAlerts(prev => [newAlert, ...prev].slice(0, 10));
        toast.success(newAlert.title, { duration: 3000 });
      }
    }, 15000);

    return () => clearInterval(interval);
  }, [account]);

  const getSeverityConfig = (severity: string) => {
    switch (severity) {
      case 'critical':
        return {
          icon: XCircle,
          color: 'text-red-400',
          bg: 'bg-red-500/10',
          border: 'border-red-500/30',
          glow: 'shadow-[0_0_15px_rgba(239,68,68,0.3)]',
        };
      case 'warning':
        return {
          icon: AlertTriangle,
          color: 'text-yellow-400',
          bg: 'bg-yellow-500/10',
          border: 'border-yellow-500/30',
          glow: 'shadow-[0_0_15px_rgba(234,179,8,0.3)]',
        };
      default:
        return {
          icon: Info,
          color: 'text-blue-400',
          bg: 'bg-blue-500/10',
          border: 'border-blue-500/30',
          glow: 'shadow-[0_0_15px_rgba(59,130,246,0.3)]',
        };
    }
  };

  return (
    <div className="bg-gray-800/40 rounded-2xl p-6 border border-gray-700/60">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold flex items-center space-x-3">
          <div className="p-2 bg-detective-alert/20 rounded-lg">
            <Bell className="w-6 h-6 text-detective-alert animate-bounce" />
          </div>
          <span>Alert System</span>
        </h3>
        <div className="flex items-center space-x-2 bg-detective-alert/20 px-3 py-1 rounded-full">
          <div className="w-2 h-2 rounded-full bg-detective-alert animate-pulse"></div>
          <span className="text-xs font-bold text-detective-alert">{alerts.length} Active</span>
        </div>
      </div>

      <div className="space-y-3 max-h-96 overflow-y-auto custom-scrollbar">
        {alerts.length === 0 ? (
          <div className="text-center py-12">
            <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-3" />
            <p className="text-gray-400">No alerts at this time</p>
            <p className="text-xs text-gray-500 mt-1">System monitoring active</p>
          </div>
        ) : (
          alerts.map((alert, idx) => {
            const config = getSeverityConfig(alert.severity);
            const Icon = config.icon;
            
            return (
              <div
                key={alert.id}
                className={`${config.bg} ${config.border} ${config.glow} rounded-xl p-4 border hover:scale-[1.02] transition-all duration-300`}
                style={{
                  animation: `slideIn 0.3s ease-out ${idx * 0.1}s both`,
                }}
              >
                <div className="flex items-start space-x-3">
                  <div className={`p-2 rounded-lg ${config.bg}`}>
                    <Icon className={`w-5 h-5 ${config.color} ${alert.severity === 'critical' ? 'animate-pulse' : ''}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className={`font-bold text-sm ${config.color}`}>{alert.title}</h4>
                      <span className={`text-xs px-2 py-0.5 rounded-full uppercase font-bold ${config.bg} ${config.color}`}>
                        {alert.severity}
                      </span>
                    </div>
                    <p className="text-sm text-gray-300 mb-2">{alert.description}</p>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>{new Date(alert.timestamp).toLocaleTimeString()}</span>
                      <button className={`${config.color} hover:underline font-medium`}>
                        Investigate →
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Alert Statistics */}
      <div className="mt-6 pt-4 border-t border-gray-700/50">
        <div className="grid grid-cols-3 gap-3">
          <div className="text-center">
            <div className="text-2xl font-bold text-red-400">
              {alerts.filter(a => a.severity === 'critical').length}
            </div>
            <div className="text-xs text-gray-400">Critical</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-400">
              {alerts.filter(a => a.severity === 'warning').length}
            </div>
            <div className="text-xs text-gray-400">Warning</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-400">
              {alerts.filter(a => a.severity === 'info').length}
            </div>
            <div className="text-xs text-gray-400">Info</div>
          </div>
        </div>
      </div>
    </div>
  );
};