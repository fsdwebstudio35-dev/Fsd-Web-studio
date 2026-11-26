import React from 'react';
import { ArrowRight } from 'lucide-react';
import { PageId, PortfolioProject } from '../types';
import { PortfolioShowcase } from '../components/PortfolioShowcase';
import {
  LineReveal,
  MagneticButton,
  Reveal,
} from '../components/MotionSystem';

interface PortfolioPageProps {
  onNavigate: (page: PageId, preselectedService?: string) => void;
  onOpenProject: (project: PortfolioProject, mode: 'details' | 'live') => void;
  projects: PortfolioProject[];
  isLoadingProjects?: boolean;
  isModalOpen?: boolean;
  onAddProject: (
    project: Omit<PortfolioProject, 'id'>
  ) => Promise<{ ok: boolean; error?: string; createdId?: string }>;
  onUpdateProject: (
    project: PortfolioProject
  ) => Promise<{ ok: boolean; error?: string }>;
  onDeleteProject: (id: string) => Promise<{ ok: boolean; error?: string }>;
  onResetProjects: () => Promise<{ ok: boolean; error?: string }>;
}

export const PortfolioPage: React.FC<PortfolioPageProps> = ({
  onNavigate,
  onOpenProject,
  projects,
  isLoadingProjects = false,
  isModalOpen = false,
  onAddProject,
  onUpdateProject,
  onDeleteProject,
  onResetProjects,
}) => {
  return (
    <div className="bg-white text-[#101B16]">
      {/* Page Header */}
      <section className="pt-12 pb-10 lg:pt-16 lg:pb-14 border-b border-[#101B16]/10 bg-white">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal direction="up" className="max-w-3xl">
            <p className="text-xs font-bold uppercase tracking-wider text-[#101B16]/65 mb-3">
              Portfolio Gallery
            </p>
            <h1
              className="font-display font-extrabold text-[#101B16] tracking-tight leading-[1.08] text-balance"
              style={{ fontSize: 'clamp(2.25rem, 4vw, 3.5rem)' }}
            >
              <LineReveal
                lines={['Digital work crafted for clarity,', 'speed, and modern brands.']}
                baseDelay={0.04}
              />
            </h1>
            <p className="mt-5 text-base sm:text-lg text-[#101B16]/75 leading-relaxed">
              Browse projects across e-commerce, business websites, creative
              portfolios, and custom web applications. Filter by category, navigate
              with keyboard arrows or swipe, and add your own live client websites.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Interactive 3D Layered Showcase (Soft Gray #F4F6F4) */}
      <PortfolioShowcase
        projects={projects}
        isLoading={isLoadingProjects}
        isModalBlockingKeys={isModalOpen}
        showFilters
        variant="gray"
        onOpenProject={onOpenProject}
        onAddProject={onAddProject}
        onUpdateProject={onUpdateProject}
        onDeleteProject={onDeleteProject}
        onResetProjects={onResetProjects}
      />

      {/* Bottom Conversion Banner (Deep Forest Green #101B16) */}
      <section className="py-16 bg-[#101B16] text-white">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <Reveal direction="right">
            <h2 className="font-display font-extrabold text-2xl sm:text-3xl tracking-tight">
              Want to build something similar for your brand?
            </h2>
            <p className="mt-2 text-white/75 text-sm sm:text-base">
              Share your goals and we will prepare a clear project scope.
            </p>
          </Reveal>
          <Reveal direction="left" delay={0.08}>
            <MagneticButton
              type="button"
              onClick={() => onNavigate('contact')}
              className="group inline-flex items-center gap-2 px-6 py-3.5 text-sm font-bold text-[#101B16] bg-[#B9F6CA] hover:bg-[#9ef0b5] rounded-full shadow-sm hover:shadow-[0_10px_24px_rgba(185,246,202,0.38)] transition-all whitespace-nowrap shrink-0 cursor-pointer"
            >
              <span>Start a Project</span>
              <ArrowRight
                className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1"
                aria-hidden="true"
              />
            </MagneticButton>
          </Reveal>
        </div>
      </section>
    </div>
  );
};
