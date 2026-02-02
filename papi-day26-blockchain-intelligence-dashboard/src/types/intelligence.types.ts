export interface RealTimeState {
  timestamp: string;
  blockNumber: number;
  freeBalance: string;
  reservedBalance: string;
  nonce: number;
  recentEvents: Array<{ type: string; data: any }>;
}

export interface HistoricalSeries {
  period: '1h' | '24h' | '7d' | '30d' | '90d';
  points: Array<{
    timestamp: string;
    balance: number;
    txCount: number;
    incoming: number;
    outgoing: number;
  }>;
  summary: {
    avgDailyBalance: number;
    totalTx: number;
    netFlow: number;
    trend: 'rising' | 'falling' | 'stable';
    volatility: number;
  };
}

export interface FusedInsight {
  type: 'trend' | 'anomaly' | 'pattern' | 'prediction';
  title: string;
  description: string;
  confidence: number;
  severity: 'low' | 'medium' | 'high';
  evidence: string[];
  timestamp: string;
}

export interface IntelligenceAlert {
  id: string;
  severity: 'info' | 'warning' | 'critical';
  title: string;
  description: string;
  source: 'papi' | 'indexer' | 'fusion';
  timestamp: string;
  acknowledged: boolean;
}