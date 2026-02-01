import React, { useEffect, useRef, useState, useMemo } from 'react';
import { forceSimulation, forceLink, forceManyBody, forceCenter } from 'd3-force';
import type { Simulation, SimulationNodeDatum, SimulationLinkDatum } from 'd3-force';
import { Network } from 'lucide-react';
import { CHAINS } from '../services/chainRegistry';

interface NetworkGraphProps {
  selectedChains: string[];
}

/* ─── d3 types ─── */
interface GNode extends SimulationNodeDatum {
  id:          string;
  name:        string;
  color:       string;
  isRelay:     boolean;
  icon:        string;
  x?: number;
  y?: number;
}

interface GLink extends SimulationLinkDatum<GNode> {
  source: string | GNode;
  target: string | GNode;
}

function chainColor(id: string): string {
  const map: Record<string, string> = {
    polkadot: '#E6007A', kusama: '#c8c8c8', astar: '#0085FF',
    moonbeam: '#5A4FCF', acala: '#FF4F7D', parallel: '#EF3A37',
  };
  return map[id] ?? '#0ea5e9';
}

export const NetworkGraph: React.FC<NetworkGraphProps> = ({ selectedChains }) => {
  const svgRef  = useRef<SVGSVGElement>(null);
  const simRef  = useRef<Simulation<GNode, GLink> | null>(null);
  const [tick, setTick] = useState(0); // force re-render each tick

  const { nodes, links } = useMemo(() => {
    const chainObjs = selectedChains
      .map(id => CHAINS.find(c => c.id === id))
      .filter((c): c is typeof CHAINS[0] => !!c);

    const relays  = chainObjs.filter(c =>  c.isRelayChain);
    const paras   = chainObjs.filter(c => !c.isRelayChain);

    const nodes: GNode[] = chainObjs.map(c => ({
      id:      c.id,
      name:    c.name,
      color:   chainColor(c.id),
      isRelay: c.isRelayChain,
      icon:    c.icon,
    }));

    // every parachain links to every relay; relays link to each other
    const links: GLink[] = [];
    relays.forEach(r => {
      paras.forEach(p => links.push({ source: r.id, target: p.id }));
    });
    if (relays.length === 2) {
      links.push({ source: relays[0].id, target: relays[1].id });
    }

    return { nodes, links };
  }, [selectedChains]);

  useEffect(() => {
    if (nodes.length === 0) return;

    const W = 700, H = 320;

    const sim = forceSimulation<GNode, GLink>(nodes)
      .force('link',    forceLink<GNode, GLink>(links).id(d => d.id).distance(90))
      .force('charge',  forceManyBody<GNode>().strength(-220))
      .force('center',  forceCenter<GNode>(W / 2, H / 2))
      .alphaTarget(0.05)
      .alphaDecay(0.02);

    sim.on('tick', () => setTick(t => t + 1));

    simRef.current = sim;
    return () => sim.stop();
  }, [nodes, links]);

  /* clamp positions inside the SVG */
  const W = 700, H = 320;
  const clamp = (v: number | undefined, lo: number, hi: number) =>
    Math.max(lo, Math.min(hi, v ?? (lo + hi) / 2));

  return (
    <div className="bg-gray-800/30 rounded-xl p-6 border border-gray-700">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <Network className="w-5 h-5" />
          Parachain Network Topology
        </h2>
        <span className="text-xs text-gray-500">
          {nodes.length} nodes · {links.length} links
        </span>
      </div>

      {nodes.length < 2 ? (
        <div className="h-48 flex items-center justify-center">
          <p className="text-gray-600 text-sm">Select at least 2 chains to visualise the network</p>
        </div>
      ) : (
        <svg
          ref={svgRef}
          viewBox={`0 0 ${W} ${H}`}
          className="w-full rounded-lg"
          style={{ background: 'linear-gradient(135deg, #111827 0%, #1f2937 100%)' }}
        >
          <defs>
            {nodes.map(n => (
              <radialGradient key={`g-${n.id}`} id={`g-${n.id}`}>
                <stop offset="0%" stopColor={n.color} stopOpacity={0.9} />
                <stop offset="100%" stopColor={n.color} stopOpacity={0.3} />
              </radialGradient>
            ))}
          </defs>

          {/* links */}
          {links.map((link, i) => {
            const s = link.source as GNode;
            const t = link.target as GNode;
            return (
              <line
                key={i}
                x1={clamp(s.x, 30, W - 30)}
                y1={clamp(s.y, 30, H - 30)}
                x2={clamp(t.x, 30, W - 30)}
                y2={clamp(t.y, 30, H - 30)}
                stroke="#4b5563"
                strokeWidth={1.5}
                strokeOpacity={0.5}
                strokeDasharray="4 3"
              />
            );
          })}

          {/* nodes */}
          {nodes.map(node => {
            const cx = clamp(node.x, 38, W - 38);
            const cy = clamp(node.y, 38, H - 38);
            const r  = node.isRelay ? 28 : 22;
            return (
              <g key={node.id}>
                {/* outer glow */}
                <circle cx={cx} cy={cy} r={r + 6} fill={node.color} fillOpacity={0.08} />
                {/* main circle */}
                <circle
                  cx={cx} cy={cy} r={r}
                  fill={`url(#g-${node.id})`}
                  stroke={node.color}
                  strokeWidth={2}
                  strokeOpacity={0.7}
                />
                {/* icon text */}
                <text
                  x={cx} y={cy + 1}
                  textAnchor="middle" dominantBaseline="central"
                  fontSize={node.isRelay ? 18 : 15}
                >
                  {node.icon}
                </text>
                {/* label */}
                <text
                  x={cx} y={cy + r + 16}
                  textAnchor="middle"
                  fill="#d1d5db"
                  fontSize={10}
                  fontWeight={500}
                >
                  {node.name}
                </text>
              </g>
            );
          })}
        </svg>
      )}

      {/* legend */}
      <div className="mt-4 flex flex-wrap gap-4 text-xs text-gray-500">
        <div className="flex items-center gap-1.5">
          <span className="inline-block w-3 h-3 rounded-full border-2 border-gray-400" />
          Relay chain (larger)
        </div>
        <div className="flex items-center gap-1.5">
          <span className="inline-block w-2.5 h-2.5 rounded-full border-2 border-gray-500" />
          Parachain
        </div>
        <div className="flex items-center gap-1.5">
          <span className="inline-block w-6 border-t-2 border-dashed border-gray-500" />
          XCM channel
        </div>
      </div>
    </div>
  );
};