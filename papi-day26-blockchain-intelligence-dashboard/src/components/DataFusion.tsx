import React, { useEffect, useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Merge, Brain, TrendingUp, AlertTriangle } from 'lucide-react';

interface DataFusionProps {
  account: string;
  range: string;
}

export const DataFusion: React.FC<DataFusionProps> = ({ account, range }) => {
  const [data, setData] = useState<any[]>([]);
  const [insights, setInsights] = useState<any[]>([]);

  useEffect(() => {
    // Simulate fused dataset (in production: query PAPI for live + indexer for history)
    const points = [];
    const now = Date.now();
    const dayMs = 86400000;
    const days = range === '24h' ? 1 : range === '7d' ? 7 : range === '30d' ? 30 : 90;

    for (let i = days; i >= 0; i--) {
      const ts = new Date(now - i * dayMs);
      const historical = 120 + Math.sin(i / 5) * 40 + Math.random() * 10;
      const realtime = i === 0 ? historical + Math.random() * 30 : null;

      points.push({
        date: ts.toLocaleDateString(),
        historical: Math.round(historical),
        realtime: realtime ? Math.round(realtime) : null,
        fused: Math.round((historical * 0.6) + (realtime || historical) * 0.4),
      });
    }

    setData(points.reverse());

    // Simulated insights from fused analysis
    setInsights([
      { title: 'Rising Accumulation', desc: 'Balance increased 18% over period', type: 'trend', icon: TrendingUp, color: 'text-green-400' },
      { title: 'Weekend Pattern Detected', desc: 'Higher tx volume Sat-Sun', type: 'pattern', icon: AlertTriangle, color: 'text-yellow-400' },
      { title: 'Potential Outflow Risk', desc: 'Recent transfers to new addresses', type: 'anomaly', icon: AlertTriangle, color: 'text-orange-400' },
    ]);

    console.log(`🧠 Fusion engine processing ${points.length} data points for ${range} range`);
  }, [account, range]);

  return (
    <div className="bg-gray-800/40 rounded-2xl p-7 border border-gray-700/60 animate-fusion-glow">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold flex items-center space-x-3">
          <Merge className="w-7 h-7 text-detective-fusion" />
          <span>Data Fusion Layer</span>
        </h2>
        <div className="text-sm text-gray-400">Live + Archive = Full Picture</div>
      </div>

      <div className="h-96 mb-8">
        <ResponsiveContainer>
          <AreaChart data={data}>
            <defs>
              <linearGradient id="historical" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.6}/>
                <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="realtime" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.7}/>
                <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="fused" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10B981" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151"/>
            <XAxis dataKey="date" stroke="#9CA3AF" fontSize={12}/>
            <YAxis stroke="#9CA3AF" fontSize={12}/>
            <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #4B5563', borderRadius: '8px' }}/>
            <Legend verticalAlign="top" height={36}/>
            <Area type="monotone" dataKey="historical" stroke="#8B5CF6" fillOpacity={1} fill="url(#historical)" name="Historical (Indexer)"/>
            <Area type="monotone" dataKey="realtime" stroke="#3B82F6" fillOpacity={1} fill="url(#realtime)" name="Live (PAPI)" dot={{ r: 5 }} activeDot={{ r: 8 }}/>
            <Area type="monotone" dataKey="fused" stroke="#10B981" fillOpacity={0.4} fill="url(#fused)" name="Fused Intelligence" strokeWidth={3}/>
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="grid md:grid-cols-3 gap-5">
        {insights.map((i, idx) => {
          const Icon = i.icon;
          return (
            <div key={idx} className={`p-5 rounded-xl border bg-gray-900/50 ${i.color.replace('text-', 'border-')}/30`}>
              <div className="flex items-start space-x-4">
                <div className={`p-3 rounded-lg ${i.color.replace('text-', 'bg-')}/10`}>
                  <Icon className={`w-6 h-6 ${i.color}`} />
                </div>
                <div>
                  <h4 className="font-semibold mb-1">{i.title}</h4>
                  <p className="text-sm text-gray-300">{i.desc}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-8 pt-6 border-t border-gray-700">
        <h4 className="font-semibold mb-4 flex items-center space-x-2">
          <Brain className="w-5 h-5 text-detective-fusion" />
          <span>Fusion Engine Status</span>
        </h4>
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-3">
            <div className="w-3 h-3 rounded-full bg-detective-fusion animate-pulse"></div>
            <span>Fusion engine processing live</span>
          </div>
          <div className="text-gray-400">Last sync: just now</div>
        </div>
      </div>
    </div>
  );
};