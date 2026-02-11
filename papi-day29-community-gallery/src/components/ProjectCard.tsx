import React from 'react';
import { motion } from 'framer-motion';
import { 
  Github, 
  ExternalLink, 
  Heart, 
  Star, 
  Calendar,
  Twitter
} from 'lucide-react';
import { Project } from '../types/project.types';
import { TechTag } from './TechTag';
import './ProjectCard.css';

interface ProjectCardProps {
  project: Project;
  onLike: (id: string) => void;
  onShare: (project: Project) => void;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ 
  project, 
  onLike, 
  onShare 
}) => {
  const formattedDate = new Date(project.createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <motion.article
      className={`project-card ${project.featured ? 'featured' : ''}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
    >
      {project.featured && (
        <div className="featured-badge">
          <Star size={14} />
          <span>Featured</span>
        </div>
      )}

      <div className="card-header">
        <div className="project-image">
          <img 
            src={project.imageUrl} 
            alt={project.name}
            loading="lazy"
          />
          <div className="image-overlay">
            <span>Day {project.submissionDay}</span>
          </div>
        </div>
        
        <div className="project-meta">
          <h3 className="project-title">{project.name}</h3>
          <div className="developer-info">
            <Twitter size={14} />
            <span className="developer-name">{project.developer}</span>
            <a 
              href={`https://twitter.com/${project.twitterHandle.replace('@', '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="twitter-handle"
            >
              {project.twitterHandle}
            </a>
          </div>
        </div>
      </div>

      <p className="project-description">{project.description}</p>

      <div className="tech-stack">
        {project.techStack.map((tech) => (
          <TechTag key={tech} tech={tech} />
        ))}
      </div>

      <div className="categories">
        {project.categories.map((category) => (
          <span key={category} className="category-tag">
            {category}
          </span>
        ))}
      </div>

      <div className="card-footer">
        <div className="stats">
          <button 
            className="like-button"
            onClick={() => onLike(project.id)}
            aria-label={`Like ${project.name}`}
          >
            <Heart size={18} fill={project.likes > 0 ? '#E6007A' : 'none'} />
            <span>{project.likes}</span>
          </button>
          
          <div className="date">
            <Calendar size={14} />
            <span>{formattedDate}</span>
          </div>
        </div>

        <div className="actions">
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="icon-button"
              aria-label="GitHub repository"
            >
              <Github size={20} />
            </a>
          )}
          
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="icon-button"
              aria-label="Live demo"
            >
              <ExternalLink size={20} />
            </a>
          )}

          <button
            className="share-button"
            onClick={() => onShare(project)}
            aria-label="Share on Twitter"
          >
            Share
          </button>
        </div>
      </div>
    </motion.article>
  );
};