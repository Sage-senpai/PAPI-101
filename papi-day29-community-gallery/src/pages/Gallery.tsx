import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Filter, 
  TrendingUp, 
  Users, 
  Code2, 
  Plus,
  Twitter
} from 'lucide-react';
import { ProjectCard } from '../components/ProjectCard';
import { SubmissionForm } from '../components/SubmissionForm';
import { ProjectFilters } from '../components/ProjectFilters';
import { sampleProjects, projectStats } from '../data/projects';
import { Project, ProjectCategory, TechStack } from '../types/project.types';
import './Gallery.css';

export const Gallery: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>(sampleProjects);
  const [showForm, setShowForm] = useState(false);
  const [filters, setFilters] = useState<{
    categories: ProjectCategory[];
    tech: TechStack[];
    featuredOnly: boolean;
    search: string;
  }>({
    categories: [],
    tech: [],
    featuredOnly: false,
    search: ''
  });

  const filteredProjects = projects.filter(project => {
    if (filters.categories.length > 0) {
      const hasCategory = filters.categories.some(cat => 
        project.categories.includes(cat)
      );
      if (!hasCategory) return false;
    }

    if (filters.tech.length > 0) {
      const hasTech = filters.tech.some(tech => 
        project.techStack.includes(tech)
      );
      if (!hasTech) return false;
    }

    if (filters.featuredOnly && !project.featured) return false;

    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      return (
        project.name.toLowerCase().includes(searchLower) ||
        project.description.toLowerCase().includes(searchLower) ||
        project.developer.toLowerCase().includes(searchLower) ||
        project.techStack.some(tech => tech.toLowerCase().includes(searchLower))
      );
    }

    return true;
  });

  const handleLike = (projectId: string) => {
    setProjects(prev => prev.map(project => 
      project.id === projectId 
        ? { ...project, likes: project.likes + 1 }
        : project
    ));
    console.log(`❤️ Liked project: ${projectId}`);
  };

  const handleShare = (project: Project) => {
    const tweetText = `Check out "${project.name}" by ${project.developer} built with #PAPI during #PAPI30Days!`;
    const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}&url=${encodeURIComponent(project.liveUrl || project.githubUrl || '')}`;
    window.open(tweetUrl, '_blank');
    console.log('🐦 Opening Twitter share dialog...');
    console.log('Project:', project.name);
    console.log('Share URL:', tweetUrl);
  };

  const handleSubmit = (newProject: any) => {
    const projectWithId = {
      ...newProject,
      id: `user-${Date.now()}`,
      imageUrl: newProject.imageUrl || 'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=800&q=80'
    };
    
    setProjects(prev => [projectWithId, ...prev]);
    setShowForm(false);
    
    console.log('✅ Project added to local gallery!');
    console.log('Total projects now:', projects.length + 1);
  };

  return (
    <div className="gallery-container">
      <header className="gallery-header">
        <div className="header-content">
          <h1>
            <span className="gradient-text">#PAPI30Days</span>
            <br />
            Community Gallery
          </h1>
          <p className="subtitle">
            Showcasing amazing projects built with Polkadot-API during our 30-day campaign
          </p>
          
          <div className="header-stats">
            <div className="stat">
              <Code2 size={24} />
              <div>
                <span className="stat-value">{projectStats.totalProjects}+</span>
                <span className="stat-label">Projects</span>
              </div>
            </div>
            <div className="stat">
              <Users size={24} />
              <div>
                <span className="stat-value">{projectStats.totalDevelopers}+</span>
                <span className="stat-label">Developers</span>
              </div>
            </div>
            <div className="stat">
              <TrendingUp size={24} />
              <div>
                <span className="stat-value">{projectStats.totalCategories}</span>
                <span className="stat-label">Categories</span>
              </div>
            </div>
          </div>
        </div>

        <button 
          className="cta-button"
          onClick={() => setShowForm(true)}
        >
          <Plus size={20} />
          Share Your Project
        </button>
      </header>

      <ProjectFilters filters={filters} onFilterChange={setFilters} />

      <div className="projects-grid">
        <AnimatePresence>
          {filteredProjects.length > 0 ? (
            filteredProjects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                onLike={handleLike}
                onShare={handleShare}
              />
            ))
          ) : (
            <div className="no-projects">
              <Filter size={48} />
              <h3>No projects match your filters</h3>
              <p>Try adjusting your filters or submit a new project!</p>
            </div>
          )}
        </AnimatePresence>
      </div>

      <div className="share-banner">
        <div className="banner-content">
          <Twitter size={32} />
          <div>
            <h3>Share Your Journey!</h3>
            <p>
              Tweet about your #PAPI30Days experience and tag 
              <strong> @Polkadot</strong> for a chance to be featured
            </p>
          </div>
          <a
            href="https://twitter.com/intent/tweet?text=I%20just%20completed%20the%20%23PAPI30Days%20challenge!%20Built%20something%20awesome%20with%20%40Polkadot%27s%20light-client%20API%20%E2%9A%A1%EF%B8%8F%0A%0ACheck%20out%20the%20community%20gallery%3A"
            target="_blank"
            rel="noopener noreferrer"
            className="tweet-button"
          >
            Tweet #PAPI30Days
          </a>
        </div>
      </div>

      <AnimatePresence>
        {showForm && (
          <SubmissionForm
            onSubmit={handleSubmit}
            onClose={() => setShowForm(false)}
          />
        )}
      </AnimatePresence>

      <div className="console-section">
        <h4>Developer Console</h4>
        <div className="console-output">
          <div className="console-line info">✅ Gallery loaded with {projects.length} projects</div>
          <div className="console-line info">🔍 {filteredProjects.length} projects match current filters</div>
          <div className="console-line success">🚀 Ready to showcase your project!</div>
          <div className="console-line">
            💡 <strong>Pro Tip:</strong> Open browser console to see detailed submission logs
          </div>
        </div>
      </div>
    </div>
  );
};