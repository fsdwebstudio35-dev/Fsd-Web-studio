import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  ExternalLink,
  Eye,
} from 'lucide-react';
import {
  AnimatePresence,
  motion,
  PanInfo,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from 'motion/react';
import { PortfolioCategory, PortfolioProject } from '../types';
import { ImageWithFallback } from './ImageWithFallback';
import {
  EASE_AGENCY,
  LetterReveal,
  MagneticLink,
  Reveal,
  useIsFinePointer,
} from './MotionSystem';

interface PortfolioShowcaseProps {
  projects: PortfolioProject[];
  isLoading?: boolean;
  isModalBlockingKeys?: boolean;
  showFilters?: boolean;
  variant?: 'light' | 'gray';
  onOpenProject: (project: PortfolioProject, mode: 'details' | 'live') => void;
  onAddProject?: (
    project: Omit<PortfolioProject, 'id'>
  ) => Promise<{ ok: boolean; error?: string; createdId?: string }>;
  onUpdateProject?: (
    project: PortfolioProject
  ) => Promise<{ ok: boolean; error?: string }>;
  onDeleteProject?: (id: string) => Promise<{ ok: boolean; error?: string }>;
  onResetProjects?: () => Promise<{ ok: boolean; error?: string }>;
}

const CATEGORIES: ('All' | PortfolioCategory)[] = [
  'All',
  'E-Commerce',
  'Business Websites',
  'Portfolio Websites',
  'Web Applications',
];

const CINEMATIC_BACKGROUNDS = [
  {
    src: '/src/assets/images/cinema_bg_mountain_1795693392429.jpg',
    label: 'Alpine Twilight',
  },
  {
    src: '/src/assets/images/cinema_bg_desert_1795693393258.jpg',
    label: 'Dusk Dunes',
  },
  {
    src: '/src/assets/images/cinema_bg_road_1795693393136.jpg',
    label: 'Nordic Valley Road',
  },
  {
    src: '/src/assets/images/cinema_bg_nightsky_1795693394167.jpg',
    label: 'Aurora Night Sky',
  },
  {
    src: '/src/assets/images/cinema_bg_coastal_1795693394638.jpg',
    label: 'Coastal Highway',
  },
];

function getSafeWebsiteUrl(raw?: string): string | undefined {
  if (!raw) return undefined;
  const trimmed = raw.trim();
  if (!trimmed) return undefined;
  const withProto = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
  try {
    const parsed = new URL(withProto);
    if (parsed.protocol === 'http:' || parsed.protocol === 'https:') {
      return parsed.toString();
    }
    return undefined;
  } catch {
    return undefined;
  }
}

function formatTwoDigits(num: number): string {
  return String(num).padStart(2, '0');
}

function getBalancedCircularOffset(
  index: number,
  activeIndex: number,
  total: number
): number {
  if (total <= 1) return 0;
  let diff = index - activeIndex;
  const half = Math.floor(total / 2);
  while (diff > half) diff -= total;
  while (diff < -half) diff += total;
  // For even counts (like 4), prefer -1, 0, +1, +2 symmetry or balanced wings
  if (total === 4 && diff === -2) return 2;
  return diff;
}

export const PortfolioShowcase: React.FC<PortfolioShowcaseProps> = ({
  projects,
  isLoading = false,
  isModalBlockingKeys = false,
  showFilters = false,
  onOpenProject,
}) => {
  const [activeCategory, setActiveCategory] = useState<'All' | PortfolioCategory>('All');
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [viewportWidth, setViewportWidth] = useState<number>(1280);

  const isFine = useIsFinePointer();
  const prefersReduced = useReducedMotion();
  const isMobile = viewportWidth < 768;
  const isTablet = viewportWidth >= 768 && viewportWidth < 1120;
  const enableMouseParallax = isFine && !prefersReduced && !isMobile;

  // Stage & backdrop mouse parallax motion values
  const stageRef = useRef<HTMLDivElement | null>(null);
  const rawMouseX = useMotionValue(0);
  const rawMouseY = useMotionValue(0);
  const rawBgX = useMotionValue(0);
  const rawBgY = useMotionValue(0);
  const rawSpotX = useMotionValue(50);
  const rawSpotY = useMotionValue(50);
  const spotOpacity = useMotionValue(0);

  const stageParallaxX = useSpring(rawMouseX, { stiffness: 150, damping: 24 });
  const stageParallaxY = useSpring(rawMouseY, { stiffness: 150, damping: 24 });
  const bgParallaxX = useSpring(rawBgX, { stiffness: 90, damping: 24 });
  const bgParallaxY = useSpring(rawBgY, { stiffness: 90, damping: 24 });
  const stageRotateX = useSpring(useMotionValue(0), { stiffness: 170, damping: 25 });
  const stageRotateY = useSpring(useMotionValue(0), { stiffness: 170, damping: 25 });

  const stageSpotlightBg = useMotionTemplate`radial-gradient(560px circle at ${rawSpotX}% ${rawSpotY}%, rgba(185, 246, 202, 0.16), transparent 72%)`;

  useEffect(() => {
    const updateWidth = () => {
      setViewportWidth(window.innerWidth);
    };
    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  const filteredProjects =
    showFilters && activeCategory !== 'All'
      ? projects.filter((p) => p.category === activeCategory)
      : projects;

  const totalProjects = filteredProjects.length;
  const safeIndex = totalProjects > 0 ? Math.min(activeIndex, totalProjects - 1) : 0;
  const currentProject = totalProjects > 0 ? filteredProjects[safeIndex] : null;
  const activeBackdrop =
    CINEMATIC_BACKGROUNDS[safeIndex % CINEMATIC_BACKGROUNDS.length];

  useEffect(() => {
    setActiveIndex(0);
  }, [activeCategory]);

  useEffect(() => {
    if (activeIndex >= totalProjects && totalProjects > 0) {
      setActiveIndex(totalProjects - 1);
    }
  }, [activeIndex, totalProjects]);

  const goToNext = useCallback(() => {
    if (totalProjects <= 1) return;
    setDirection(1);
    setActiveIndex((prev) => (prev + 1) % totalProjects);
  }, [totalProjects]);

  const goToPrev = useCallback(() => {
    if (totalProjects <= 1) return;
    setDirection(-1);
    setActiveIndex((prev) => (prev - 1 + totalProjects) % totalProjects);
  }, [totalProjects]);

  const goToIndex = useCallback(
    (targetIdx: number) => {
      if (targetIdx === safeIndex || totalProjects <= 1) return;
      const diff = getBalancedCircularOffset(targetIdx, safeIndex, totalProjects);
      setDirection(diff >= 0 ? 1 : -1);
      setActiveIndex(targetIdx);
    },
    [safeIndex, totalProjects]
  );

  // Keyboard arrow navigation
  useEffect(() => {
    if (isModalBlockingKeys || totalProjects <= 1) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const tagName = target?.tagName?.toLowerCase();
      if (
        tagName === 'input' ||
        tagName === 'textarea' ||
        tagName === 'select' ||
        target?.isContentEditable
      ) {
        return;
      }

      if (e.key === 'ArrowRight') {
        goToNext();
      } else if (e.key === 'ArrowLeft') {
        goToPrev();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [goToNext, goToPrev, isModalBlockingKeys, totalProjects]);

  const handleStageMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!enableMouseParallax || !stageRef.current) return;
    const rect = stageRef.current.getBoundingClientRect();
    const nx = (e.clientX - rect.left) / rect.width - 0.5;
    const ny = (e.clientY - rect.top) / rect.height - 0.5;

    rawMouseX.set(nx * 18);
    rawMouseY.set(ny * 12);
    rawBgX.set(-nx * 26);
    rawBgY.set(-ny * 18);
    stageRotateY.set(nx * 4);
    stageRotateX.set(-ny * 3.5);
    rawSpotX.set((nx + 0.5) * 100);
    rawSpotY.set((ny + 0.5) * 100);
    spotOpacity.set(1);
  };

  const handleStageMouseLeave = () => {
    rawMouseX.set(0);
    rawMouseY.set(0);
    rawBgX.set(0);
    rawBgY.set(0);
    stageRotateX.set(0);
    stageRotateY.set(0);
    spotOpacity.set(0);
  };

  const handleDragEnd = (
    _event: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo
  ) => {
    if (info.offset.x < -45 || info.velocity.x < -280) {
      goToNext();
    } else if (info.offset.x > 45 || info.velocity.x > 280) {
      goToPrev();
    }
  };

  const safeExternalSiteUrl = currentProject
    ? getSafeWebsiteUrl(currentProject.liveDemoUrl)
    : undefined;
  const hasAnySample = projects.some((p) => p.isSample);

  return (
    <section
      id="portfolio-showcase"
      ref={stageRef}
      onMouseMove={handleStageMouseMove}
      onMouseLeave={handleStageMouseLeave}
      className="relative overflow-hidden min-h-[760px] lg:min-h-[860px] py-16 lg:py-20 bg-[#070E0B] text-white border-t border-b border-white/10 flex flex-col justify-between"
    >
      {/* 1. Full-Screen Cinematic Landscape Background with Crossfade & Parallax */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <AnimatePresence mode="sync">
          <motion.div
            key={activeBackdrop.src}
            initial={prefersReduced ? { opacity: 1 } : { opacity: 0, scale: 1.07 }}
            animate={{ opacity: 1, scale: 1.02 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.85, ease: EASE_AGENCY }}
            style={
              enableMouseParallax
                ? { x: bgParallaxX, y: bgParallaxY }
                : undefined
            }
            className="absolute -inset-6"
          >
            <img
              src={activeBackdrop.src}
              alt=""
              className="w-full h-full object-cover"
            />
          </motion.div>
        </AnimatePresence>

        {/* Atmospheric Dark Scrims & Vignette Overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#070E0B]/88 via-[#070E0B]/52 to-[#070E0B]/95" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#070E0B]/80 via-transparent to-[#070E0B]/80" />

        {/* Subtle Mint/Emerald Atmospheric Rim Glow */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[780px] h-[380px] rounded-full bg-[#B9F6CA]/10 blur-3xl" />

        {/* Interactive Cursor Atmospheric Spotlight */}
        {enableMouseParallax && (
          <motion.div
            className="absolute inset-0 transition-opacity duration-300"
            style={{
              background: stageSpotlightBg,
              opacity: spotOpacity,
            }}
          />
        )}
      </div>

      {/* Top Editorial Header & Project Management Controls */}
      <div className="relative z-20 max-w-[1360px] w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <Reveal direction="up" className="max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#B9F6CA] mb-2">
              <LetterReveal text={`Selected Works · ${activeBackdrop.label}`} />
            </p>
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl lg:text-[2.85rem] text-white tracking-tight leading-[1.08] text-balance">
              <LetterReveal text="Cinematic Project Showcase." />
            </h2>
            <p className="mt-2.5 text-sm sm:text-base text-white/75 leading-relaxed max-w-xl">
              <LetterReveal text="Drag, swipe, use arrow controls, or select any floating poster to explore architecture details and live previews." />
              {hasAnySample && (
                <span className="block mt-1 text-xs text-white/55">
                  <LetterReveal text="Starter items marked as Sample Project." />
                </span>
              )}
            </p>
          </Reveal>
        </div>

        {/* Optional Category Filter Bar */}
        {showFilters && (
          <div
            role="tablist"
            aria-label="Filter projects by category"
            className="mt-7 flex flex-wrap items-center gap-2"
          >
            {CATEGORIES.map((category) => {
              const isSelected = activeCategory === category;
              return (
                <button
                  key={category}
                  type="button"
                  role="tab"
                  aria-selected={isSelected}
                  onClick={() => setActiveCategory(category)}
                  className={`relative px-4 py-2 text-xs sm:text-sm font-semibold rounded-full transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    isSelected
                      ? 'text-[#101B16]'
                      : 'bg-white/10 text-white/80 hover:bg-white/18 hover:text-white backdrop-blur-md border border-white/12'
                  }`}
                >
                  {isSelected && (
                    <motion.span
                      layoutId="showcase-category-pill"
                      transition={{ type: 'spring', stiffness: 420, damping: 32 }}
                      className="absolute inset-0 bg-[#B9F6CA] rounded-full"
                    />
                  )}
                  <span className="relative z-10">
                    <LetterReveal text={category} trigger="mount" />
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* 2. Center Horizontal Floating Poster Carousel Stage */}
      <div className="relative z-20 w-full my-8 lg:my-10">
        {isLoading ? (
          <div className="max-w-[1280px] mx-auto px-4 flex items-center justify-center gap-6 h-[460px]">
            <div className="hidden md:block w-72 h-96 rounded-3xl bg-white/8 backdrop-blur-md border border-white/10 animate-pulse" />
            <div className="w-80 sm:w-96 h-[450px] rounded-3xl bg-white/14 backdrop-blur-md border border-white/20 animate-pulse" />
            <div className="hidden md:block w-72 h-96 rounded-3xl bg-white/8 backdrop-blur-md border border-white/10 animate-pulse" />
          </div>
        ) : !currentProject ? (
          <div className="max-w-xl mx-auto px-4">
            <div className="rounded-3xl bg-white/10 backdrop-blur-lg border border-white/15 p-10 text-center space-y-4">
              <h3 className="font-display font-bold text-xl text-white">
                <LetterReveal text="No projects in this category yet" />
              </h3>
              <p className="text-sm text-white/75">
                <LetterReveal text="Switch back to All projects to browse our complete showcase." />
              </p>
              {showFilters && activeCategory !== 'All' && (
                <button
                  type="button"
                  onClick={() => setActiveCategory('All')}
                  className="inline-flex items-center gap-2 px-5 py-2.5 text-xs sm:text-sm font-bold text-[#101B16] bg-[#B9F6CA] hover:bg-[#9ef0b5] rounded-full cursor-pointer transition-colors"
                >
                  <LetterReveal text="Show All Projects" trigger="mount" />
                </button>
              )}
            </div>
          </div>
        ) : (
          <motion.div
            drag={totalProjects > 1 ? 'x' : false}
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.16}
            onDragEnd={handleDragEnd}
            style={
              enableMouseParallax
                ? {
                    x: stageParallaxX,
                    y: stageParallaxY,
                    rotateX: stageRotateX,
                    rotateY: stageRotateY,
                    perspective: '1600px',
                    transformStyle: 'preserve-3d',
                  }
                : { perspective: '1600px', transformStyle: 'preserve-3d' }
            }
            className="relative w-full h-[460px] sm:h-[510px] lg:h-[550px] flex items-center justify-center select-none cursor-grab active:cursor-grabbing"
          >
            {filteredProjects.map((project, idx) => {
              const offset = getBalancedCircularOffset(idx, safeIndex, totalProjects);
              const absOffset = Math.abs(offset);
              const maxVisibleWing = isMobile ? 1 : isTablet ? 1 : 2;

              if (absOffset > maxVisibleWing) return null;

              const isCenter = offset === 0;
              const spacingUnit = isMobile ? 250 : isTablet ? 290 : 345;
              const xOffset =
                offset === 0
                  ? 0
                  : Math.sign(offset) *
                    (absOffset === 1 ? spacingUnit : spacingUnit * 1.76);
              const yOffset = isCenter ? -10 : absOffset === 1 ? 18 : 42;
              const scale = isCenter ? 1 : absOffset === 1 ? 0.84 : 0.7;
              const rotateY = isCenter ? 0 : -offset * (isMobile ? 8 : 14);
              const rotateZ = isCenter ? 0 : offset * 2.4;
              const opacity = isCenter ? 1 : absOffset === 1 ? (isMobile ? 0.38 : 0.72) : 0.38;
              const zIndex = isCenter ? 40 : absOffset === 1 ? 25 : 12;
              const cardSiteUrl = getSafeWebsiteUrl(project.liveDemoUrl);

              return (
                <motion.article
                  key={project.id}
                  role="button"
                  tabIndex={0}
                  aria-label={
                    isCenter
                      ? `Open ${project.title} details`
                      : `Focus ${project.title}`
                  }
                  onClick={() => {
                    if (isCenter) {
                      onOpenProject(project, 'details');
                    } else {
                      goToIndex(idx);
                    }
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      if (isCenter) {
                        onOpenProject(project, 'details');
                      } else {
                        goToIndex(idx);
                      }
                    }
                  }}
                  initial={false}
                  animate={{
                    x: xOffset,
                    y: yOffset,
                    scale,
                    rotateY: prefersReduced ? 0 : rotateY,
                    rotateZ: prefersReduced ? 0 : rotateZ,
                    opacity,
                  }}
                  whileHover={
                    !prefersReduced && isFine
                      ? {
                          y: yOffset - 10,
                          scale: isCenter ? 1.02 : scale + 0.03,
                        }
                      : undefined
                  }
                  transition={{
                    type: 'spring',
                    stiffness: 210,
                    damping: 26,
                    mass: 0.9,
                  }}
                  style={{
                    zIndex,
                    transformStyle: 'preserve-3d',
                  }}
                  data-cursor={isCenter ? 'view' : 'interactive'}
                  className={`group absolute w-[285px] sm:w-[350px] lg:w-[410px] h-[420px] sm:h-[470px] lg:h-[515px] rounded-3xl overflow-hidden cursor-pointer transition-shadow duration-300 ${
                    isCenter
                      ? 'border border-white/25 shadow-[0_35px_95px_rgba(0,0,0,0.75)] ring-1 ring-[#B9F6CA]/25'
                      : 'border border-white/12 shadow-[0_24px_60px_rgba(0,0,0,0.55)]'
                  }`}
                >
                  {/* Full-Bleed Poster Thumbnail with Hover Zoom */}
                  <div className="relative w-full h-full bg-[#101B16]">
                    <ImageWithFallback
                      src={project.thumbnail}
                      alt={`${project.title} — ${project.category}`}
                      fallbackTitle={project.title}
                      fallbackSubtitle={project.category}
                      className="w-full h-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.07]"
                    />

                    {/* Cinematic Bottom & Top Poster Scrims */}
                    <div
                      aria-hidden="true"
                      className={`absolute inset-0 transition-opacity duration-300 ${
                        isCenter
                          ? 'bg-gradient-to-t from-[#050B08]/95 via-[#050B08]/45 to-[#050B08]/20'
                          : 'bg-gradient-to-t from-[#050B08]/95 via-[#050B08]/60 to-[#050B08]/35'
                      }`}
                    />

                    {/* Top Index + Sample Label */}
                    <div className="absolute top-4 left-4 right-4 flex items-center justify-between gap-2 z-10">
                      <span className="font-mono text-xs font-bold text-white/90 bg-black/45 backdrop-blur-md px-2.5 py-1 rounded-lg border border-white/15 tabular-nums">
                        {formatTwoDigits(idx + 1)}
                      </span>
                      {project.isSample && (
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#B9F6CA]/95 bg-black/45 backdrop-blur-md px-2.5 py-1 rounded-lg border border-white/10">
                          Sample Project
                        </span>
                      )}
                    </div>

                    {/* Poster Content Overlay */}
                    <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6 z-10 flex flex-col justify-end">
                      <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#B9F6CA] mb-1">
                        <LetterReveal text={project.category} trigger="mount" />
                      </p>

                      <h3 className="font-display font-extrabold text-xl sm:text-2xl text-white tracking-tight leading-snug">
                        <LetterReveal text={project.title} trigger="mount" />
                      </h3>

                      <p
                        className={`mt-2 text-xs sm:text-sm text-white/80 leading-relaxed line-clamp-2 transition-opacity duration-300 ${
                          isCenter ? 'opacity-100' : 'opacity-75'
                        }`}
                      >
                        <LetterReveal text={project.description} trigger="mount" />
                      </p>

                      {isCenter && (
                        <>
                          {/* Unboxed Tech Metadata */}
                          <p className="mt-3 text-[11px] font-medium text-white/60 truncate">
                            {project.techStack.join(' · ')}
                          </p>

                          {/* Interactive Action Row on Center Card */}
                          <div
                            className="mt-4 pt-3.5 border-t border-white/15 flex items-center gap-2.5"
                            onClick={(e) => e.stopPropagation()}
                          >
                            {cardSiteUrl ? (
                              <MagneticLink
                                href={cardSiteUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group/btn flex-1 h-10 px-4 rounded-full bg-[#B9F6CA] hover:bg-[#9ef0b5] text-[#101B16] text-xs font-bold inline-flex items-center justify-center gap-1.5 transition-colors whitespace-nowrap"
                              >
                                <LetterReveal text="Visit Site" trigger="mount" />
                                <ArrowUpRight
                                  className="w-3.5 h-3.5 transition-transform duration-200 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5"
                                  aria-hidden="true"
                                />
                              </MagneticLink>
                            ) : (
                              <button
                                type="button"
                                onClick={() => onOpenProject(project, 'live')}
                                className="flex-1 h-10 px-4 rounded-full bg-[#B9F6CA] hover:bg-[#9ef0b5] text-[#101B16] text-xs font-bold inline-flex items-center justify-center gap-1.5 transition-colors whitespace-nowrap cursor-pointer"
                              >
                                <Eye className="w-3.5 h-3.5" aria-hidden="true" />
                                <LetterReveal
                                  text={project.isSample ? 'Live Preview' : 'Live Demo'}
                                  trigger="mount"
                                />
                              </button>
                            )}

                            <button
                              type="button"
                              onClick={() => onOpenProject(project, 'details')}
                              className="h-10 px-4 rounded-full bg-white/12 hover:bg-white/22 backdrop-blur-md border border-white/20 text-white text-xs font-bold inline-flex items-center justify-center gap-1.5 transition-colors whitespace-nowrap cursor-pointer"
                            >
                              <LetterReveal text="Details" trigger="mount" />
                              <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </motion.article>
              );
            })}
          </motion.div>
        )}
      </div>

      {/* 3. Glassmorphic Bottom Navigation Dock & Animated Counter */}
      {!isLoading && currentProject && (
        <div className="relative z-20 max-w-[1360px] w-full mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl rounded-2xl bg-white/8 backdrop-blur-xl border border-white/15 px-4 sm:px-6 py-3.5 flex flex-wrap items-center justify-between gap-4 shadow-[0_16px_45px_rgba(0,0,0,0.4)]">
            {/* Animated Prev / Next Buttons */}
            <div className="flex items-center gap-2.5">
              <motion.button
                type="button"
                whileHover={{ scale: 1.07 }}
                whileTap={{ scale: 0.92 }}
                onClick={goToPrev}
                disabled={totalProjects <= 1}
                aria-label="Previous project"
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-[#B9F6CA] text-white hover:text-[#101B16] border border-white/15 disabled:opacity-40 flex items-center justify-center transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" aria-hidden="true" />
              </motion.button>

              <motion.button
                type="button"
                whileHover={{ scale: 1.07 }}
                whileTap={{ scale: 0.92 }}
                onClick={goToNext}
                disabled={totalProjects <= 1}
                aria-label="Next project"
                className="w-10 h-10 rounded-full bg-[#B9F6CA] hover:bg-[#9ef0b5] text-[#101B16] disabled:opacity-40 flex items-center justify-center transition-colors shadow-sm cursor-pointer"
              >
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </motion.button>

              <div className="pl-2 inline-flex items-baseline gap-1 font-mono tabular-nums">
                <AnimatePresence mode="wait">
                  <motion.span
                    key={safeIndex}
                    initial={{ opacity: 0, y: direction * 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: direction * -8 }}
                    transition={{ duration: 0.2, ease: EASE_AGENCY }}
                    className="text-base font-extrabold text-white"
                  >
                    {formatTwoDigits(safeIndex + 1)}
                  </motion.span>
                </AnimatePresence>
                <span className="text-xs font-semibold text-white/50">
                  / {formatTwoDigits(totalProjects)}
                </span>
              </div>
            </div>

            {/* Interactive Slide Dots */}
            <div className="flex items-center gap-1.5 overflow-x-auto max-w-[200px] py-1">
              {filteredProjects.map((proj, idx) => {
                const active = idx === safeIndex;
                return (
                  <button
                    key={proj.id}
                    type="button"
                    onClick={() => goToIndex(idx)}
                    aria-label={`Go to project ${idx + 1}: ${proj.title}`}
                    className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                      active
                        ? 'w-7 bg-[#B9F6CA]'
                        : 'w-2 bg-white/30 hover:bg-white/60'
                    }`}
                  />
                );
              })}
            </div>

            {/* Direct Link Hint */}
            <div className="flex items-center gap-2">
              {safeExternalSiteUrl && (
                <a
                  href={safeExternalSiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hidden sm:inline-flex items-center gap-1 text-xs font-semibold text-[#B9F6CA] hover:underline whitespace-nowrap"
                >
                  <LetterReveal text="Visit Live" />
                  <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
