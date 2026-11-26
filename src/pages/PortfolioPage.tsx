import React from 'react';
import { ArrowRight } from 'lucide-react';
import { STUDIO_IMAGES } from '../data/studioData';
import { PageId, PortfolioProject } from '../types';
import { ImageWithFallback } from '../components/ImageWithFallback';
import { PortfolioShowcase } from '../components/PortfolioShowcase';
import {
  LetterReveal,
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
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
            <Reveal direction="up" className="lg:col-span-7">
              <p className="text-xs font-bold uppercase tracking-wider text-[#101B16]/65 mb-3">
                <LetterReveal text="Portfolio Gallery" trigger="mount" />
              </p>
              <h1
                className="font-display font-extrabold text-[#101B16] tracking-tight leading-[1.08] text-balance"
                style={{ fontSize: 'clamp(2.25rem, 4vw, 3.5rem)' }}
              >
                <span className="block">
                  <LetterReveal
                    text="Digital work crafted for clarity,"
                    trigger="mount"
                    delay={0.04}
                    stagger={0.018}
                  />
                </span>
                <span className="block">
                  <LetterReveal
                    text="speed, and modern brands."
                    trigger="mount"
                    delay={0.32}
                    stagger={0.018}
                  />
                </span>
              </h1>
              <p className="mt-5 text-base sm:text-lg text-[#101B16]/75 leading-relaxed max-w-2xl">
                <LetterReveal
                  text="Browse projects across e-commerce, business websites, creative portfolios, and custom web applications. Filter by category, navigate with keyboard arrows or swipe, and explore interactive previews."
                  trigger="mount"
                  delay={0.36}
                />
              </p>
            </Reveal>

            <Reveal direction="left" delay={0.08} className="lg:col-span-5">
              <div className="group relative aspect-[16/10] w-full rounded-2xl overflow-hidden bg-[#101B16] border border-[#101B16]/10 shadow-md">
                <ImageWithFallback
                  src={STUDIO_IMAGES.portfolioCraft}
                  alt="Curated editorial web portfolio layouts on tablet in architectural studio"
                  loading="eager"
                  fallbackTitle="Selected Works"
                  className="w-full h-full object-cover transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105"
                />
                <div
                  aria-hidden="true"
                  className="absolute inset-0 bg-gradient-to-t from-[#101B16]/75 via-transparent to-transparent"
                />
                <div className="absolute bottom-3.5 left-4 right-4 flex items-center justify-between text-white">
                  <span className="font-display font-bold text-sm">
                    Interactive 3D Case Showcase
                  </span>
                  <span className="text-xs font-semibold text-[#B9F6CA]">
                    Use arrows or swipe
                  </span>
                </div>
              </div>
            </Reveal>
          </div>
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
      <section className="relative overflow-hidden py-16 bg-[#101B16] text-white">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          <ImageWithFallback
            src={STUDIO_IMAGES.ctaBackdrop}
            alt=""
            className="w-full h-full object-cover opacity-35"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#101B16]/94 via-[#101B16]/86 to-[#101B16]/78" />
        </div>

        <div className="relative max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <Reveal direction="right">
            <h2 className="font-display font-extrabold text-2xl sm:text-3xl tracking-tight">
              <LetterReveal text="Want to build something similar for your brand?" />
            </h2>
            <p className="mt-2 text-white/80 text-sm sm:text-base">
              <LetterReveal text="Share your goals and we will prepare a clear project scope." />
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
