import React, { useState } from 'react';
import { Rocket, Github, Cloud, Server, ChevronDown, ChevronUp } from 'lucide-react';
import '../styles/DeploymentGuide.css';

export const DeploymentGuide: React.FC = () => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="deployment-guide">
      <div className="guide-header" onClick={() => setExpanded(!expanded)}>
        <div className="header-content">
          <Rocket size={24} />
          <h3>Deployment Guide</h3>
        </div>
        {expanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
      </div>

      {expanded && (
        <div className="guide-content">
          <div className="deployment-options">
            <div className="deployment-card vercel">
              <div className="card-header">
                <Cloud size={32} />
                <h4>Deploy to Vercel</h4>
              </div>
              <div className="card-body">
                <p className="description">
                  Zero-config deployment with automatic optimizations
                </p>
                <div className="steps">
                  <div className="step">
                    <span className="step-number">1</span>
                    <span>Install Vercel CLI: <code>npm i -g vercel</code></span>
                  </div>
                  <div className="step">
                    <span className="step-number">2</span>
                    <span>Run: <code>vercel</code></span>
                  </div>
                  <div className="step">
                    <span className="step-number">3</span>
                    <span>Deploy to production: <code>vercel --prod</code></span>
                  </div>
                </div>
                <a
                  href="https://vercel.com/new"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="deploy-button vercel-btn"
                >
                  Deploy to Vercel
                </a>
              </div>
            </div>

            <div className="deployment-card netlify">
              <div className="card-header">
                <Server size={32} />
                <h4>Deploy to Netlify</h4>
              </div>
              <div className="card-body">
                <p className="description">
                  Instant builds with global CDN and rollback support
                </p>
                <div className="steps">
                  <div className="step">
                    <span className="step-number">1</span>
                    <span>Install CLI: <code>npm i -g netlify-cli</code></span>
                  </div>
                  <div className="step">
                    <span className="step-number">2</span>
                    <span>Build: <code>npm run build</code></span>
                  </div>
                  <div className="step">
                    <span className="step-number">3</span>
                    <span>Deploy: <code>netlify deploy --prod</code></span>
                  </div>
                </div>
                <a
                  href="https://app.netlify.com/start"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="deploy-button netlify-btn"
                >
                  Deploy to Netlify
                </a>
              </div>
            </div>

            <div className="deployment-card github">
              <div className="card-header">
                <Github size={32} />
                <h4>GitHub Pages</h4>
              </div>
              <div className="card-body">
                <p className="description">
                  Free hosting for static sites with custom domains
                </p>
                <div className="steps">
                  <div className="step">
                    <span className="step-number">1</span>
                    <span>Update <code>vite.config.ts</code> base path</span>
                  </div>
                  <div className="step">
                    <span className="step-number">2</span>
                    <span>Run: <code>npm run build</code></span>
                  </div>
                  <div className="step">
                    <span className="step-number">3</span>
                    <span>Push dist folder to gh-pages branch</span>
                  </div>
                </div>
                <a
                  href="https://docs.github.com/en/pages"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="deploy-button github-btn"
                >
                  Learn More
                </a>
              </div>
            </div>
          </div>

          <div className="optimization-checklist">
            <h4>Pre-Deployment Checklist</h4>
            <div className="checklist">
              <div className="checklist-item">
                <input type="checkbox" id="build" />
                <label htmlFor="build">
                  ✅ Run production build and verify bundle sizes
                </label>
              </div>
              <div className="checklist-item">
                <input type="checkbox" id="test" />
                <label htmlFor="test">
                  ✅ Test on multiple devices and network speeds
                </label>
              </div>
              <div className="checklist-item">
                <input type="checkbox" id="env" />
                <label htmlFor="env">
                  ✅ Configure environment variables
                </label>
              </div>
              <div className="checklist-item">
                <input type="checkbox" id="cache" />
                <label htmlFor="cache">
                  ✅ Verify caching headers are correct
                </label>
              </div>
              <div className="checklist-item">
                <input type="checkbox" id="pwa" />
                <label htmlFor="pwa">
                  ✅ Test PWA installation and offline functionality
                </label>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};