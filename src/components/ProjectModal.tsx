import React, { useEffect, useState } from 'react';
import {
  ArrowRight,
  Check,
  ExternalLink,
  Monitor,
  Smartphone,
  X,
} from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { PortfolioCategory, PortfolioProject } from '../types';
import { ImageWithFallback } from './ImageWithFallback';
import { EASE_AGENCY, MagneticButton } from './MotionSystem';

interface ProjectModalProps {
  project: PortfolioProject | null;
  initialTab?: 'details' | 'live';
  onClose: () => void;
  onStartSimilar: (serviceTitle: string) => void;
}

export const ProjectModal: React.FC<ProjectModalProps> = ({
  project,
  initialTab = 'details',
  onClose,
  onStartSimilar,
}) => {
  const [activeTab, setActiveTab] = useState<'details' | 'live'>(initialTab);
  const [viewportMode, setViewportMode] = useState<'desktop' | 'mobile'>('desktop');

  useEffect(() => {
    setActiveTab(initialTab);
    setViewportMode('desktop');
  }, [project, initialTab]);

  useEffect(() => {
    if (!project) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [project, onClose]);

  const mapCategoryToService = (category: PortfolioCategory): string => {
    switch (category) {
      case 'E-Commerce':
        return 'E-Commerce Development';
      case 'Web Applications':
        return 'Web Applications';
      default:
        return 'Website Development';
    }
  };

  return (
    <AnimatePresence>
      {project && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.22, ease: EASE_AGENCY }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-[#101B16]/75 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="project-modal-title"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 14 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 14 }}
            transition={{ duration: 0.26, ease: EASE_AGENCY }}
            className="bg-white rounded-2xl border border-[#101B16]/10 w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="px-5 sm:px-7 py-4 border-b border-[#101B16]/10 flex items-center justify-between gap-4 bg-white">
              <div className="min-w-0">
                <div className="text-xs font-semibold text-[#101B16]/60">
                  {project.category}
                </div>
                <h2
                  id="project-modal-title"
                  className="font-display font-bold text-xl sm:text-2xl text-[#101B16] truncate mt-0.5"
                >
                  {project.title}
                </h2>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <div className="hidden sm:flex items-center p-1 bg-[#F4F6F4] rounded-xl">
                  {(['details', 'live'] as const).map((tab) => {
                    const active = activeTab === tab;
                    return (
                      <button
                        key={tab}
                        type="button"
                        onClick={() => setActiveTab(tab)}
                        className={`relative px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                          active
                            ? 'text-white'
                            : 'text-[#101B16]/70 hover:text-[#101B16]'
                        }`}
                      >
                        {active && (
                          <motion.span
                            layoutId="project-modal-tab-bg"
                            transition={{ type: 'spring', stiffness: 420, damping: 32 }}
                            className="absolute inset-0 bg-[#101B16] rounded-lg"
                          />
                        )}
                        <span className="relative z-10">
                          {tab === 'details' ? 'Project Overview' : 'Live Demo'}
                        </span>
                      </button>
                    );
                  })}
                </div>

                <motion.button
                  type="button"
                  whileHover={{ rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  transition={{ duration: 0.2 }}
                  onClick={onClose}
                  aria-label="Close project modal"
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-[#101B16]/70 hover:text-[#101B16] hover:bg-[#F4F6F4] transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" aria-hidden="true" />
                </motion.button>
              </div>
            </div>

            {/* Mobile Tab Switcher */}
            <div className="sm:hidden px-5 py-2.5 border-b border-[#101B16]/10 bg-[#F4F6F4] flex items-center gap-2">
              <button
                type="button"
                onClick={() => setActiveTab('details')}
                className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                  activeTab === 'details'
                    ? 'bg-[#101B16] text-white'
                    : 'bg-white text-[#101B16]'
                }`}
              >
                Project Overview
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('live')}
                className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                  activeTab === 'live'
                    ? 'bg-[#101B16] text-white'
                    : 'bg-white text-[#101B16]'
                }`}
              >
                Live Demo
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-5 sm:p-7 space-y-6">
              <AnimatePresence mode="wait">
                {activeTab === 'details' ? (
                  <motion.div
                    key="details"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.22, ease: EASE_AGENCY }}
                    className="space-y-6"
                  >
                    <div className="aspect-[16/9] w-full rounded-2xl overflow-hidden border border-[#101B16]/10 bg-[#F4F6F4]">
                      <ImageWithFallback
                        src={project.thumbnail}
                        alt={project.title}
                        fallbackTitle={project.title}
                        fallbackSubtitle={project.category}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="space-y-2">
                      <h3 className="font-display font-bold text-lg text-[#101B16]">
                        Architecture &amp; Approach
                      </h3>
                      <p className="text-sm sm:text-base text-[#101B16]/75 leading-relaxed">
                        {project.overview}
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                      <div>
                        <h4 className="font-display font-bold text-sm text-[#101B16] mb-3">
                          Key Capabilities
                        </h4>
                        <ul className="space-y-2.5">
                          {project.highlights.map((item) => (
                            <li
                              key={item}
                              className="flex items-start gap-2.5 text-sm text-[#101B16]/80"
                            >
                              <Check
                                className="w-4 h-4 text-[#101B16] shrink-0 mt-0.5"
                                aria-hidden="true"
                              />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="p-5 rounded-2xl bg-[#F4F6F4] flex flex-col justify-between gap-4">
                        <div>
                          <h4 className="font-display font-bold text-sm text-[#101B16] mb-2">
                            Technology Stack
                          </h4>
                          <p className="text-sm text-[#101B16]/75">
                            {project.techStack.join(' · ')}
                          </p>
                        </div>
                        <div className="pt-3 border-t border-[#101B16]/10">
                          <span className="text-xs font-medium text-[#101B16]/60">
                            {project.liveDemoUrl ? 'Live Website' : 'Project Status'}
                          </span>
                          {project.liveDemoUrl ? (
                            <a
                              href={project.liveDemoUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="mt-0.5 flex items-center gap-1.5 font-mono text-xs text-[#101B16] hover:underline truncate"
                            >
                              <span className="truncate">{project.liveDemoUrl}</span>
                              <ExternalLink className="w-3 h-3 shrink-0" aria-hidden="true" />
                            </a>
                          ) : (
                            <div className="text-xs font-medium text-[#101B16]/75 mt-0.5">
                              Sample preview — add a live URL in Portfolio Manager
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="live"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.22, ease: EASE_AGENCY }}
                    className="space-y-4"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-3 bg-[#F4F6F4] px-4 py-2.5 rounded-xl">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="text-xs font-semibold text-[#101B16]/60 shrink-0">
                          {project.liveDemoUrl ? 'Live URL:' : 'Preview Mode:'}
                        </span>
                        {project.liveDemoUrl ? (
                          <a
                            href={project.liveDemoUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-mono text-xs text-[#101B16] hover:underline truncate"
                          >
                            {project.liveDemoUrl}
                          </a>
                        ) : (
                          <span className="text-xs font-medium text-[#101B16]/75 truncate">
                            {project.isSample ? 'Sample Interactive Preview' : 'Interactive Studio Preview'}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => setViewportMode('desktop')}
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                            viewportMode === 'desktop'
                              ? 'bg-[#101B16] text-white'
                              : 'text-[#101B16]/70 hover:text-[#101B16]'
                          }`}
                        >
                          <Monitor className="w-3.5 h-3.5" aria-hidden="true" />
                          <span>Desktop</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setViewportMode('mobile')}
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                            viewportMode === 'mobile'
                              ? 'bg-[#101B16] text-white'
                              : 'text-[#101B16]/70 hover:text-[#101B16]'
                          }`}
                        >
                          <Smartphone className="w-3.5 h-3.5" aria-hidden="true" />
                          <span>Mobile</span>
                        </button>
                      </div>
                    </div>

                    <div className="bg-[#F4F6F4] rounded-2xl p-4 sm:p-6 flex justify-center">
                      <div
                        className={`bg-white rounded-2xl border border-[#101B16]/10 overflow-hidden shadow-md transition-all duration-300 ease-out ${
                          viewportMode === 'mobile' ? 'w-[340px]' : 'w-full'
                        }`}
                      >
                        <div className="px-5 py-3.5 border-b border-[#101B16]/10 flex items-center justify-between">
                          <span className="font-display font-bold text-sm text-[#101B16]">
                            {project.title}
                          </span>
                          <div className="flex items-center gap-3 text-xs font-semibold text-[#101B16]/70">
                            {viewportMode === 'desktop' && (
                              <>
                                <span>Overview</span>
                                <span>Work</span>
                              </>
                            )}
                            <span className="px-3 py-1 rounded-full bg-[#B9F6CA] text-[#101B16]">
                              Contact
                            </span>
                          </div>
                        </div>

                        <div className="p-6 sm:p-8 bg-[#101B16] text-white">
                          <p className="text-xs font-semibold text-[#B9F6CA] mb-2">
                            {project.category}
                          </p>
                          <h3 className="font-display font-bold text-xl sm:text-2xl leading-snug max-w-lg">
                            {project.previewHeadline}
                          </h3>
                          <p className="mt-2.5 text-sm text-white/75 max-w-lg">
                            {project.previewSubheadline}
                          </p>
                        </div>

                        <div className="aspect-[16/9] w-full overflow-hidden">
                          <ImageWithFallback
                            src={project.thumbnail}
                            alt={`${project.title} interactive preview`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Modal Footer */}
            <div className="px-5 sm:px-7 py-4 border-t border-[#101B16]/10 bg-[#F4F6F4] flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-xs font-medium text-[#101B16]/70">
                <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
                <span>
                  {project.isSample ? 'FSD Web Studio · Sample Project' : 'FSD Web Studio Showcase'}
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-2.5">
                {project.liveDemoUrl && (
                  <a
                    href={project.liveDemoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 text-xs sm:text-sm font-bold text-[#101B16] bg-white border border-[#101B16]/15 hover:border-[#101B16]/35 rounded-full transition-colors whitespace-nowrap shrink-0"
                  >
                    <span>Visit Live Site</span>
                    <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
                  </a>
                )}
                <MagneticButton
                  type="button"
                  onClick={() => {
                    onClose();
                    onStartSimilar(mapCategoryToService(project.category));
                  }}
                  className="group inline-flex items-center gap-2 px-5 py-2.5 text-xs sm:text-sm font-bold text-[#101B16] bg-[#B9F6CA] hover:bg-[#9ef0b5] rounded-full transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                >
                  <span>Start a Similar Project</span>
                  <ArrowRight
                    className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5"
                    aria-hidden="true"
                  />
                </MagneticButton>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
