import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { PortfolioProject } from '../types';
import { ImageWithFallback } from './ImageWithFallback';

interface ProjectPreviewCardVisualProps {
  project: PortfolioProject;
  className?: string;
}

export const ProjectPreviewCardVisual: React.FC<ProjectPreviewCardVisualProps> = ({
  project,
  className = '',
}) => {
  return (
    <div className="relative w-full h-full overflow-hidden">
      <ImageWithFallback
        src={project.thumbnail}
        alt={`${project.title} — ${project.category}`}
        fallbackTitle={project.title}
        fallbackSubtitle={project.category}
        className={`w-full h-full object-cover transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.07] ${className}`}
      />
      {/* Subtle forest overlay & hover prompt */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#101B16]/75 via-[#101B16]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-between p-5"
      >
        <div className="translate-y-2 group-hover:translate-y-0 transition-transform duration-300 ease-out">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#B9F6CA]">
            {project.category}
          </span>
          <div className="font-display font-bold text-sm text-white">
            Explore Case Study
          </div>
        </div>
        <span className="w-9 h-9 rounded-full bg-[#B9F6CA] text-[#101B16] flex items-center justify-center translate-y-2 group-hover:translate-y-0 transition-transform duration-300 ease-out shadow-md">
          <ArrowUpRight className="w-4 h-4" />
        </span>
      </div>
    </div>
  );
};
