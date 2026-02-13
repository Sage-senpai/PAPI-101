export type Week = 1 | 2 | 3 | 4;
export type Day = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19 | 20 | 21 | 22 | 23 | 24 | 25 | 26 | 27 | 28 | 29 | 30;

export interface Skill {
  day: Day;
  title: string;
  category: 'setup' | 'read' | 'tx' | 'advanced' | 'deploy';
  description: string;
}

export interface Chain {
  id: string;
  name: string;
  descriptor: string;
  wsUrl: string;
  icon: string;
}

export interface ProjectPlan {
  name: string;
  description: string;
  chains: Chain[];
  features: string[];
  techStack: string[];
  dependencies: string[];
  folderStructure: string[];
  codeSnippets: { title: string; code: string }[];
  nextSteps: string[];
}