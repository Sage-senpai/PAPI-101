import { Project, ProjectStats } from '../types/project.types';

export const sampleProjects: Project[] = [
  {
    id: '1',
    name: 'PAPI DeFi Dashboard',
    description: 'Real-time multi-chain DeFi dashboard with portfolio tracking and yield optimization across Polkadot ecosystem',
    developer: 'Alex Chen',
    twitterHandle: '@alexchen',
    categories: ['defi', 'tools'],
    techStack: ['react', 'typescript', 'papi', 'tailwind'],
    githubUrl: 'https://github.com/alexchen/papi-defi-dashboard',
    liveUrl: 'https://papi-defi.vercel.app',
    imageUrl: 'https://images.unsplash.com/photo-1642790106117-e829e14a795f?w=800&q=80',
    createdAt: new Date('2024-01-15'),
    likes: 142,
    featured: true,
    submissionDay: 15
  },
  {
    id: '2',
    name: 'Cross-Chain NFT Marketplace',
    description: 'NFT marketplace supporting Polkadot, Kusama, and multiple parachains with instant swaps and real-time provenance tracking',
    developer: 'Sarah Johnson',
    twitterHandle: '@sarahweb3',
    categories: ['nft', 'tools'],
    techStack: ['nextjs', 'typescript', 'papi', 'graphql'],
    githubUrl: 'https://github.com/sarahweb3/cross-chain-nft',
    liveUrl: 'https://nft.polkadot.market',
    imageUrl: 'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=800&q=80',
    createdAt: new Date('2024-01-20'),
    likes: 89,
    featured: true,
    submissionDay: 20
  },
  {
    id: '3',
    name: 'Governance Pro',
    description: 'Advanced governance platform with proposal simulation, voting analytics, and delegation management for DAOs',
    developer: 'DAO Enthusiast',
    twitterHandle: '@daobuilder',
    categories: ['governance', 'tools'],
    techStack: ['vue', 'typescript', 'papi', 'tailwind'],
    githubUrl: 'https://github.com/daobuilder/governance-pro',
    liveUrl: 'https://gov.pro',
    imageUrl: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&q=80',
    createdAt: new Date('2024-01-25'),
    likes: 67,
    featured: true,
    submissionDay: 25
  },
  {
    id: '4',
    name: 'PAPI Learning Platform',
    description: 'Interactive tutorials and coding challenges for learning PAPI with real-time feedback and progress tracking',
    developer: 'Web3 Academy',
    twitterHandle: '@web3academy',
    categories: ['education'],
    techStack: ['react', 'typescript', 'papi'],
    githubUrl: 'https://github.com/web3academy/papi-learn',
    liveUrl: 'https://learn.papi.dev',
    imageUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&q=80',
    createdAt: new Date('2024-01-10'),
    likes: 204,
    featured: false,
    submissionDay: 10
  },
  {
    id: '5',
    name: 'Real-time Chain Analytics',
    description: 'Advanced analytics dashboard with custom metrics, real-time alerts, and predictive insights for blockchain data',
    developer: 'Data Scientist',
    twitterHandle: '@chainanalyst',
    categories: ['tools'],
    techStack: ['nextjs', 'typescript', 'papi', 'subql'],
    githubUrl: 'https://github.com/chainanalyst/papi-analytics',
    liveUrl: 'https://analytics.polkadot.dev',
    imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80',
    createdAt: new Date('2024-01-18'),
    likes: 93,
    featured: true,
    submissionDay: 18
  },
  {
    id: '6',
    name: 'Multi-Sig Wallet Manager',
    description: 'Enterprise-grade multi-signature wallet management with PAPI integration, batch transactions, and audit logs',
    developer: 'Security Pro',
    twitterHandle: '@securesigner',
    categories: ['tools'],
    techStack: ['react', 'typescript', 'papi', 'rust'],
    githubUrl: 'https://github.com/securesigner/multisig-manager',
    liveUrl: 'https://multisig.polkadot.tools',
    imageUrl: 'https://images.unsplash.com/photo-1620336655055-bd87c5d1d73f?w=800&q=80',
    createdAt: new Date('2024-01-22'),
    likes: 56,
    featured: false,
    submissionDay: 22
  }
];

export const projectStats: ProjectStats = {
  totalProjects: sampleProjects.length,
  totalDevelopers: new Set(sampleProjects.map(p => p.developer)).size,
  totalCategories: new Set(sampleProjects.flatMap(p => p.categories)).size,
  mostPopularTech: 'typescript',
  featuredProjects: sampleProjects.filter(p => p.featured).length
};