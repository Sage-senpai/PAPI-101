import { Filter, Star, Search } from 'lucide-react';
import { ProjectCategory, TechStack, FilterState } from '../types/project.types';
import './ProjectFilters.css';

interface ProjectFiltersProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
}

const allCategories: ProjectCategory[] = ['defi', 'nft', 'governance', 'tools', 'education', 'social', 'gaming'];
const allTech: TechStack[] = ['react', 'vue', 'nextjs', 'typescript', 'papi', 'smoldot', 'tailwind', 'graphql', 'subql', 'rust'];

export const ProjectFilters = ({ filters, onFilterChange }: ProjectFiltersProps) => {
  const toggleCategory = (category: ProjectCategory) => {
    const newCategories = filters.categories.includes(category)
      ? filters.categories.filter(c => c !== category)
      : [...filters.categories, category];

    onFilterChange({ ...filters, categories: newCategories });
  };

  const toggleTech = (tech: TechStack) => {
    const newTech = filters.tech.includes(tech)
      ? filters.tech.filter(t => t !== tech)
      : [...filters.tech, tech];

    onFilterChange({ ...filters, tech: newTech });
  };

  const toggleFeatured = () => {
    onFilterChange({ ...filters, featuredOnly: !filters.featuredOnly });
  };

  const handleSearch = (search: string) => {
    onFilterChange({ ...filters, search });
  };

  const clearFilters = () => {
    onFilterChange({
      categories: [],
      tech: [],
      featuredOnly: false,
      search: ''
    });
  };

  const hasActiveFilters = filters.categories.length > 0 ||
                          filters.tech.length > 0 ||
                          filters.featuredOnly ||
                          filters.search.length > 0;

  return (
    <div className="filters-container">
      <div className="filters-header">
        <h2 className="filters-title">
          <Filter size={20} />
          Filters
        </h2>
        {hasActiveFilters && (
          <button className="clear-button" onClick={clearFilters}>
            Clear All
          </button>
        )}
      </div>

      <div className="search-box">
        <Search size={18} className="search-icon" />
        <input
          type="text"
          className="search-input"
          placeholder="Search projects, developers, or technologies..."
          value={filters.search}
          onChange={(e) => handleSearch(e.target.value)}
        />
      </div>

      <div className="filter-section">
        <label className="filter-label">Categories</label>
        <div className="filter-grid">
          {allCategories.map((category) => (
            <button
              key={category}
              className={`filter-button ${filters.categories.includes(category) ? 'selected' : ''}`}
              onClick={() => toggleCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      <div className="filter-section">
        <label className="filter-label">Tech Stack</label>
        <div className="filter-grid">
          {allTech.map((tech) => (
            <button
              key={tech}
              className={`filter-button ${filters.tech.includes(tech) ? 'selected' : ''}`}
              onClick={() => toggleTech(tech)}
            >
              {tech}
            </button>
          ))}
        </div>
      </div>

      <div className="filter-section">
        <label className="filter-label">Featured</label>
        <div
          className={`featured-toggle ${filters.featuredOnly ? 'active' : ''}`}
          onClick={toggleFeatured}
        >
          <input
            type="checkbox"
            className="toggle-checkbox"
            checked={filters.featuredOnly}
            onChange={toggleFeatured}
          />
          <span className="toggle-label">
            <Star size={16} fill={filters.featuredOnly ? '#E6007A' : 'none'} />
            Show featured projects only
          </span>
        </div>
      </div>
    </div>
  );
};
