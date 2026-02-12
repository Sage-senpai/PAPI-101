export type ProjectCategory = 
  | 'defi' 
  | 'nft' 
  | 'governance' 
  | 'tools' 
  | 'education' 
  | 'social' 
  | 'gaming';

export type TechStack = 
  | 'react' 
  | 'vue' 
  | 'nextjs' 
  | 'typescript' 
  | 'papi' 
  | 'smoldot' 
  | 'tailwind' 
  | 'graphql'
  | 'subql'
  | 'rust';

export interface Project {
  id: string;
  name: string;
  description: string;
  developer: string;
  twitterHandle: string;
  categories: ProjectCategory[];
  techStack: TechStack[];
  githubUrl?: string;
  liveUrl?: string;
  imageUrl: string;
  createdAt: Date;
  likes: number;
  featured: boolean;
  submissionDay: number; // Which day of #PAPI30Days
}

export interface ProjectStats {
  totalProjects: number;
  totalDevelopers: number;
  totalCategories: number;
  mostPopularTech: TechStack;
  featuredProjects: number;
}

export interface FilterState {
  categories: ProjectCategory[];
  tech: TechStack[];
  featuredOnly: boolean;
  search: string;
}