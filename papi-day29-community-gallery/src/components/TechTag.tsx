import React from 'react';
import { TechStack } from '../types/project.types';
import './TechTag.css';

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

export const TechTag: React.FC<TechTagProps> = ({ tech }) => {
  return (
    <span 
      className="tech-tag"
      style={{ 
        backgroundColor: `${techColors[tech]}20`,
        color: techColors[tech],
        borderColor: techColors[tech]
      }}
    >
      <span className="tech-icon">{techIcons[tech]}</span>
      <span className="tech-name">{tech}</span>
    </span>
  );
};