import { useState, FormEvent } from 'react';
import { motion } from 'framer-motion';
import { Send, X, Loader2 } from 'lucide-react';
import { ProjectCategory, TechStack } from '../types/project.types';
import './SubmissionForm.css';

interface SubmissionFormProps {
  onSubmit: (project: Record<string, unknown>) => void;
  onClose: () => void;
}

const allCategories: ProjectCategory[] = ['defi', 'nft', 'governance', 'tools', 'education', 'social', 'gaming'];
const allTech: TechStack[] = ['react', 'vue', 'nextjs', 'typescript', 'papi', 'smoldot', 'tailwind', 'graphql', 'subql', 'rust'];

export const SubmissionForm = ({ onSubmit, onClose }: SubmissionFormProps) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    developer: '',
    twitterHandle: '',
    githubUrl: '',
    liveUrl: '',
    imageUrl: ''
  });

  const [selectedCategories, setSelectedCategories] = useState<ProjectCategory[]>([]);
  const [selectedTech, setSelectedTech] = useState<TechStack[]>(['typescript', 'papi']);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    const newProject = {
      ...formData,
      categories: selectedCategories,
      techStack: selectedTech,
      createdAt: new Date(),
      likes: 0,
      featured: false,
      submissionDay: 29
    };

    console.log('🎉 Project Submitted!');
    console.log('=====================');
    console.log('Project Name:', newProject.name);
    console.log('Developer:', newProject.developer);
    console.log('Twitter:', newProject.twitterHandle);
    console.log('Categories:', newProject.categories.join(', '));
    console.log('Tech Stack:', newProject.techStack.join(', '));
    console.log('GitHub:', newProject.githubUrl || 'Not provided');
    console.log('Live URL:', newProject.liveUrl || 'Not provided');
    console.log('');
    console.log('📤 Ready to share on Twitter!');
    console.log('👉 Use hashtag: #PAPI30Days');
    console.log('👉 Tag: @Polkadot');
    console.log('👉 Share your GitHub/live URLs');
    console.log('');
    console.log('🚀 Your project will appear in the gallery after review!');

    onSubmit(newProject);
    setIsSubmitting(false);
  };

  const toggleCategory = (category: ProjectCategory) => {
    setSelectedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const toggleTech = (tech: TechStack) => {
    setSelectedTech(prev =>
      prev.includes(tech)
        ? prev.filter(t => t !== tech)
        : [...prev, tech]
    );
  };

  return (
    <motion.div
      className="submission-form-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <div className="submission-form" onClick={(e) => e.stopPropagation()}>
        <div className="form-header">
          <h2>Submit Your Project</h2>
          <p>Share what you built during #PAPI30Days!</p>
          <button className="close-button" onClick={onClose} type="button">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="name">Project Name *</label>
              <input
                id="name"
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                required
                placeholder="e.g., PAPI DeFi Dashboard"
              />
            </div>

            <div className="form-group">
              <label htmlFor="developer">Your Name *</label>
              <input
                id="developer"
                type="text"
                value={formData.developer}
                onChange={(e) => setFormData({...formData, developer: e.target.value})}
                required
                placeholder="e.g., Alex Chen"
              />
            </div>

            <div className="form-group">
              <label htmlFor="twitter">Twitter Handle</label>
              <input
                id="twitter"
                type="text"
                value={formData.twitterHandle}
                onChange={(e) => setFormData({...formData, twitterHandle: e.target.value})}
                placeholder="@yourhandle"
              />
            </div>

            <div className="form-group full-width">
              <label htmlFor="description">Project Description *</label>
              <textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                required
                rows={3}
                placeholder="Describe what your project does and why it's awesome..."
              />
            </div>

            <div className="form-group full-width">
              <label>Categories</label>
              <div className="category-grid">
                {allCategories.map((category) => (
                  <button
                    key={category}
                    type="button"
                    className={`category-button ${selectedCategories.includes(category) ? 'selected' : ''}`}
                    onClick={() => toggleCategory(category)}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            <div className="form-group full-width">
              <label>Tech Stack</label>
              <div className="tech-grid">
                {allTech.map((tech) => (
                  <button
                    key={tech}
                    type="button"
                    className={`tech-button ${selectedTech.includes(tech) ? 'selected' : ''}`}
                    onClick={() => toggleTech(tech)}
                  >
                    {tech}
                  </button>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="github">GitHub URL</label>
              <input
                id="github"
                type="url"
                value={formData.githubUrl}
                onChange={(e) => setFormData({...formData, githubUrl: e.target.value})}
                placeholder="https://github.com/username/repo"
              />
            </div>

            <div className="form-group">
              <label htmlFor="live">Live Demo URL</label>
              <input
                id="live"
                type="url"
                value={formData.liveUrl}
                onChange={(e) => setFormData({...formData, liveUrl: e.target.value})}
                placeholder="https://your-demo.vercel.app"
              />
            </div>

            <div className="form-group full-width">
              <label htmlFor="image">Image URL</label>
              <input
                id="image"
                type="url"
                value={formData.imageUrl}
                onChange={(e) => setFormData({...formData, imageUrl: e.target.value})}
                placeholder="https://images.unsplash.com/photo-..."
              />
            </div>
          </div>

          <div className="form-actions">
            <button type="button" className="cancel-button" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="submit-button" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="spinner" size={18} />
                  Submitting...
                </>
              ) : (
                <>
                  <Send size={18} />
                  Submit & Share
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </motion.div>
  );
};
