import { useState, useEffect } from 'react';
import { ProjectPlan, Chain, Skill } from '../types/plan.types';
import { generatePlan } from '../utils/codeGenerator';

export const useProjectPlan = (
  selectedSkills: Skill[],
  selectedChains: Chain[],
  projectName: string,
  projectDescription: string
) => {
  const [plan, setPlan] = useState<ProjectPlan | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (selectedSkills.length === 0 || selectedChains.length === 0 || !projectName) {
      setPlan(null);
      return;
    }

    setLoading(true);
    
    // Simulate async generation (in real app, could be more complex)
    const timer = setTimeout(() => {
      const generatedPlan = generatePlan(
        selectedSkills,
        selectedChains,
        projectName,
        projectDescription
      );
      setPlan(generatedPlan);
      setLoading(false);
    }, 600);

    return () => clearTimeout(timer);
  }, [selectedSkills, selectedChains, projectName, projectDescription]);

  return { plan, loading };
};