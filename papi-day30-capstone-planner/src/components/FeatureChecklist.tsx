import React from 'react';
import { Check, ChevronDown } from 'lucide-react';
import { allSkills } from '../data/skills';
import { Skill } from '../types/plan.types';

interface FeatureChecklistProps {
  selectedSkills: Skill[];
  onToggle: (skill: Skill) => void;
}

export const FeatureChecklist: React.FC<FeatureChecklistProps> = ({ selectedSkills, onToggle }) => {
  const weeks = [
    { title: 'Week 1: Foundations', days: [1,2,3,4,5,6,7] },
    { title: 'Week 2: Reading Data', days: [8,9,10,11,12,13,14] },
    { title: 'Week 3: Transactions', days: [15,16,17,18,19,20,21] },
    { title: 'Week 4: Advanced', days: [22,23,24,25,26,27,28,29,30] },
  ];

  const isSelected = (skill: Skill) => selectedSkills.some(s => s.day === skill.day);

  return (
    <div className="bg-surface/50 rounded-xl p-6 border border-white/5">
      <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
        <Check className="text-primary" size={20} />
        Skills & Features Checklist
      </h3>
      <div className="space-y-4">
        {weeks.map(week => (
          <details key={week.title} className="group" open>
            <summary className="flex items-center cursor-pointer list-none">
              <ChevronDown size={18} className="mr-2 transition-transform group-open:rotate-180" />
              <span className="font-semibold text-white/80">{week.title}</span>
            </summary>
            <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-2">
              {week.days.map(day => {
                const skill = allSkills.find(s => s.day === day)!;
                const selected = isSelected(skill);
                return (
                  <button
                    key={day}
                    onClick={() => onToggle(skill)}
                    className={`flex items-center gap-3 p-3 rounded-lg text-left transition-all ${
                      selected
                        ? 'bg-gradient-to-r from-primary/20 to-secondary/20 border border-primary/50'
                        : 'bg-white/5 hover:bg-white/10 border border-transparent'
                    }`}
                  >
                    <div className={`w-5 h-5 rounded flex items-center justify-center ${
                      selected ? 'bg-primary' : 'bg-white/10'
                    }`}>
                      {selected && <Check size={14} className="text-white" />}
                    </div>
                    <div>
                      <span className="text-sm font-mono text-white/60">Day {day}</span>
                      <p className="font-medium">{skill.title}</p>
                      <p className="text-xs text-white/40">{skill.description}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </details>
        ))}
      </div>
    </div>
  );
};