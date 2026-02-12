import { TechStack } from '../types/project.types';

const techIcons: Record<TechStack, string> = {
  react: '⚛️',
  vue: '🟢',
  nextjs: '▲',
  typescript: 'TS',
  papi: 'PAPI',
  smoldot: '🔥',
  tailwind: '🎨',
  graphql: '🔷',
  subql: '🔍',
  rust: '🦀'
};

const techColors: Record<TechStack, string> = {
  react: '#61DAFB',
  vue: '#42B883',
  nextjs: '#000000',
  typescript: '#3178C6',
  papi: '#E6007A',
  smoldot: '#FF6B35',
  tailwind: '#38B2AC',
  graphql: '#E10098',
  subql: '#13B5EC',
  rust: '#DEA584'
};

interface TechTagProps {
  tech: TechStack;
}

export const TechTag = ({ tech }: TechTagProps) => {
  const color = techColors[tech];

  return (
    <span
      className="tech-tag"
      style={{
        backgroundColor: `${color}20`,
        color: color,
        borderColor: color,
        border: `1px solid ${color}40`,
        padding: '0.375rem 0.75rem',
        borderRadius: '20px',
        fontSize: '0.8125rem',
        fontWeight: 600,
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.375rem',
        transition: 'all 0.2s ease'
      }}
    >
      <span className="tech-icon">{techIcons[tech]}</span>
      <span className="tech-name">{tech}</span>
    </span>
  );
};
