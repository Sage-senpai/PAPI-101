import React, { useState } from 'react';
import { GraduationCap, Sparkles } from 'lucide-react';
import { FeatureChecklist } from './components/FeatureChecklist';
import { ChainSelector } from './components/ChainSelector';
import { ProjectPlanDisplay } from './components/ProjectPlan';
import { useProjectPlan } from './hooks/useProjectPlan';
import { useLocalStorage } from './hooks/useLocalStorage';
import { allSkills } from './data/skills';
import { availableChains } from './data/skills';
import { Skill, Chain } from './types/plan.types';
import './styles/index.css';

function App() {
  const [selectedSkills, setSelectedSkills] = useLocalStorage<Skill[]>('papi-selected-skills', []);
  const [selectedChains, setSelectedChains] = useLocalStorage<Chain[]>('papi-selected-chains', [availableChains[0]]);
  const [projectName, setProjectName] = useLocalStorage('papi-project-name', 'My PAPI dApp');
  const [projectDescription, setProjectDescription] = useLocalStorage('papi-project-desc', 'A decentralized application built with Polkadot-API');

  const { plan, loading } = useProjectPlan(selectedSkills, selectedChains, projectName, projectDescription);

  const toggleSkill = (skill: Skill) => {
    setSelectedSkills(prev =>
      prev.some(s => s.day === skill.day)
        ? prev.filter(s => s.day !== skill.day)
        : [...prev, skill]
    );
  };

  const toggleChain = (chain: Chain) => {
    setSelectedChains(prev =>
      prev.some(c => c.id === chain.id)
        ? prev.filter(c => c.id !== chain.id)
        : [...prev, chain]
    );
  };

  return (
    <div className="min-h-screen bg-dark text-white">
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?q=80&w=2574&auto=format&fit=crop')] bg-cover bg-center opacity-5" />
      
      <div className="relative container mx-auto px-4 py-12 max-w-7xl">
        {/* Header */}
        <header className="text-center mb-12">
          <div className="inline-flex items-center justify-center p-2 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-full mb-6">
            <GraduationCap className="text-primary" size={32} />
          </div>
          <h1 className="text-5xl md:text-6xl font-black mb-4">
            <span className="gradient-text">PAPI Capstone Planner</span>
          </h1>
          <p className="text-xl text-white/60 max-w-2xl mx-auto">
            You've mastered the 30‑day journey. Now design your masterpiece.
          </p>
        </header>

        {/* Main Grid */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Left Column – Inputs */}
          <div className="space-y-6">
            <div className="glass rounded-xl p-6">
              <label className="block mb-2 text-sm font-medium text-white/70">Project Name</label>
              <input
                type="text"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition"
                placeholder="My Awesome dApp"
              />
              <label className="block mt-4 mb-2 text-sm font-medium text-white/70">Description</label>
              <textarea
                value={projectDescription}
                onChange={(e) => setProjectDescription(e.target.value)}
                rows={3}
                className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition"
                placeholder="What will your dApp do?"
              />
            </div>

            <ChainSelector selectedChains={selectedChains} onToggle={toggleChain} />
            <FeatureChecklist selectedSkills={selectedSkills} onToggle={toggleSkill} />

            {/* Console Log Simulator */}
            <div className="bg-black/60 border border-white/10 rounded-xl p-4 font-mono text-sm">
              <div className="flex items-center gap-2 mb-2 text-white/40">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <div className="w-3 h-3 rounded-full bg-green-500" />
                <span className="ml-2">console.log</span>
              </div>
              <div className="space-y-1 text-green-400">
                <div className="opacity-90">🎓 PAPI Capstone Planner initialized</div>
                <div className="opacity-80">📦 Loaded {allSkills.length} skills from 30 days</div>
                <div className="opacity-80">🔗 {selectedChains.length} chain(s) selected</div>
                <div className="opacity-80">✅ {selectedSkills.length} features checked</div>
                {loading ? (
                  <div className="text-yellow-400">⚙️ Generating your project plan...</div>
                ) : plan ? (
                  <div className="text-green-400">✨ Plan generated successfully!</div>
                ) : null}
              </div>
            </div>
          </div>

          {/* Right Column – Plan Output */}
          <div>
            {loading ? (
              <div className="glass rounded-2xl p-12 flex flex-col items-center justify-center h-full">
                <div className="w-16 h-16 border-4 border-primary/30 border-t-primary rounded-full animate-spin mb-4" />
                <p className="text-white/60">Crafting your custom dApp blueprint...</p>
              </div>
            ) : plan ? (
              <ProjectPlanDisplay plan={plan} />
            ) : (
              <div className="glass rounded-2xl p-12 flex flex-col items-center justify-center h-full text-center">
                <Sparkles size={48} className="text-white/20 mb-4" />
                <h3 className="text-2xl font-bold text-white/40 mb-2">Ready to build?</h3>
                <p className="text-white/30 max-w-sm">
                  Select at least one chain and one skill – your personalized plan will appear here.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Footer – Quick Integration Guide */}
        <footer className="mt-16 pt-8 border-t border-white/10">
          <h3 className="text-xl font-bold mb-4 text-center">🚀 Quick PAPI Integration Guide</h3>
          <div className="grid md:grid-cols-4 gap-4 text-sm">
            <div className="bg-surface/30 p-4 rounded-lg">
              <span className="text-primary font-bold">1. Install & Setup</span>
              <pre className="mt-2 bg-black/30 p-2 rounded text-xs">npx papi add dot -n polkadot<br/>npx papi</pre>
            </div>
            <div className="bg-surface/30 p-4 rounded-lg">
              <span className="text-secondary font-bold">2. Choose Provider</span>
              <pre className="mt-2 bg-black/30 p-2 rounded text-xs">import { getSmProvider } from 'polkadot-api/sm-provider';</pre>
            </div>
            <div className="bg-surface/30 p-4 rounded-lg">
              <span className="text-accent font-bold">3. TypedApi</span>
              <pre className="mt-2 bg-black/30 p-2 rounded text-xs">const api = client.getTypedApi(dot);</pre>
            </div>
            <div className="bg-surface/30 p-4 rounded-lg">
              <span className="text-primary font-bold">4. Read / Write</span>
              <pre className="mt-2 bg-black/30 p-2 rounded text-xs">await api.constants.System.Version();<br/>api.tx.Balances.transfer(...);</pre>
            </div>
          </div>
          <p className="text-center text-white/40 text-xs mt-8">
            © 2024 #PAPI30Days Campaign – Built by the community, for the community.<br/>
            Next stop: official docs at <a href="https://papi.how" className="text-primary hover:underline">papi.how</a>
          </p>
        </footer>
      </div>
    </div>
  );
}

export default App;