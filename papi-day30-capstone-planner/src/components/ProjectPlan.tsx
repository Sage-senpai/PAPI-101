import React from 'react';
import { Download, Twitter } from 'lucide-react';
import { ProjectPlan } from '../types/plan.types';
import { exportToMarkdown } from '../utils/markdownExporter';
import { ShareButton } from './ShareButton';

interface ProjectPlanProps {
  plan: ProjectPlan;
}

export const ProjectPlanDisplay: React.FC<ProjectPlanProps> = ({ plan }) => {
  const handleExport = () => {
    const markdown = exportToMarkdown(plan);
    const blob = new Blob([markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${plan.name.replace(/\s+/g, '-').toLowerCase()}-plan.md`;
    a.click();
    URL.revokeObjectURL(url);

    console.log('📄 Project plan exported!');
    console.log('File:', a.download);
    console.log('Size:', blob.size, 'bytes');
  };

  return (
    <div className="glass rounded-2xl p-6 mt-8 animate-float">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-3xl font-bold gradient-text">{plan.name}</h2>
          <p className="text-white/60 mt-1">{plan.description}</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleExport}
            className="p-3 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
            title="Export as Markdown"
          >
            <Download size={20} />
          </button>
          <ShareButton plan={plan} />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold text-lg mb-2">🎯 Features</h3>
            <ul className="space-y-1">
              {plan.features.slice(0, 8).map((f, i) => (
                <li key={i} className="flex items-start gap-2 text-sm">
                  <span className="text-primary">•</span>
                  {f}
                </li>
              ))}
              {plan.features.length > 8 && (
                <li className="text-white/40 text-sm">+{plan.features.length - 8} more</li>
              )}
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-lg mb-2">📦 Tech Stack</h3>
            <div className="flex flex-wrap gap-2">
              {plan.techStack.map((tech, i) => (
                <span key={i} className="px-3 py-1 bg-white/5 rounded-full text-xs font-mono border border-white/10">
                  {tech}
                </span>
              ))}
            </div>
          </div>
          <div>
            <h3 className="font-semibold text-lg mb-2">📁 Folder Structure</h3>
            <pre className="bg-black/30 p-4 rounded-lg text-xs font-mono text-white/70 overflow-x-auto">
              {plan.folderStructure.join('\n')}
            </pre>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <h3 className="font-semibold text-lg mb-2">💻 Key Code Snippets</h3>
            <div className="space-y-3">
              {plan.codeSnippets.slice(0, 3).map((snippet, i) => (
                <div key={i} className="bg-black/30 rounded-lg p-3">
                  <p className="text-xs text-white/40 mb-1">{snippet.title}</p>
                  <pre className="text-xs font-mono text-primary/90 overflow-x-auto whitespace-pre-wrap">
                    {snippet.code}
                  </pre>
                </div>
              ))}
              {plan.codeSnippets.length > 3 && (
                <p className="text-white/40 text-xs">+{plan.codeSnippets.length - 3} more snippets</p>
              )}
            </div>
          </div>
          <div>
            <h3 className="font-semibold text-lg mb-2">🚀 Next Steps</h3>
            <ol className="list-decimal list-inside space-y-1 text-sm">
              {plan.nextSteps.map((step, i) => (
                <li key={i} className="text-white/80">{step}</li>
              ))}
            </ol>
          </div>
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-white/10 flex justify-between items-center">
        <span className="text-xs text-white/40">
          Generated with ❤️ by PAPI Capstone Planner • #PAPI30Days
        </span>
        <span className="text-xs font-mono bg-primary/20 px-3 py-1 rounded-full">
          Plan v1.0
        </span>
      </div>
    </div>
  );
};