import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Camera,
  Check,
  ExternalLink,
  Eye,
  Plus,
  RotateCcw,
  Trash2,
  X,
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
  MagneticButton,
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
  onAddProject: (
    project: Omit<PortfolioProject, 'id'>
  ) => Promise<{ ok: boolean; error?: string; createdId?: string }>;
  onUpdateProject: (
    project: PortfolioProject
  ) => Promise<{ ok: boolean; error?: string }>;
  onDeleteProject: (id: string) => Promise<{ ok: boolean; error?: string }>;
  onResetProjects: () => Promise<{ ok: boolean; error?: string }>;
}

const CATEGORIES: ('All' | PortfolioCategory)[] = [
  'All',
  'E-Commerce',
  'Business Websites',
  'Portfolio Websites',
  'Web Applications',
];

const PROJECT_CATEGORY_OPTIONS: PortfolioCategory[] = [
  'E-Commerce',
  'Business Websites',
  'Portfolio Websites',
  'Web Applications',
];

interface ProjectEditorState {
  id: string | null;
  title: string;
  category: PortfolioCategory;
  description: string;
  thumbnail: string;
  liveDemoUrl: string;
  techStackText: string;
}

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

function resizeScreenshotToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = typeof reader.result === 'string' ? reader.result : '';
      if (!result) {
        reject(new Error('Could not read file.'));
        return;
      }
      const img = new Image();
      img.onload = () => {
        const maxWidth = 1280;
        let { width, height } = img;
        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(result);
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', 0.86));
      };
      img.onerror = () => resolve(result);
      img.src = result;
    };
    reader.onerror = () => reject(new Error('Failed to read image file.'));
    reader.readAsDataURL(file);
  });
}

function getSignedCircularOffset(index: number, activeIndex: number, total: number): number {
  if (total <= 1) return 0;
  let diff = index - activeIndex;
  // Keep previous card (-1) visible behind on the left and upcoming cards (+1, +2, +3) stacked behind on the right
  if (diff < -1) diff += total;
  if (diff > total - 2 && total > 2) diff -= total;
  return diff;
}

export const PortfolioShowcase: React.FC<PortfolioShowcaseProps> = ({
  projects,
  isLoading = false,
  isModalBlockingKeys = false,
  showFilters = false,
  variant = 'gray',
  onOpenProject,
  onAddProject,
  onUpdateProject,
  onDeleteProject,
  onResetProjects,
}) => {
  const [activeCategory, setActiveCategory] = useState<'All' | PortfolioCategory>('All');
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [isTabletOrSmaller, setIsTabletOrSmaller] = useState(false);

  // Project Manager modal states
  const [isManagerOpen, setIsManagerOpen] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [managerError, setManagerError] = useState('');
  const [uploadError, setUploadError] = useState('');
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState('');
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [editor, setEditor] = useState<ProjectEditorState>({
    id: null,
    title: '',
    category: 'Business Websites',
    description: '',
    thumbnail: '',
    liveDemoUrl: '',
    techStackText: 'React, TypeScript, Tailwind CSS',
  });

  const isFine = useIsFinePointer();
  const prefersReduced = useReducedMotion();
  const enableMouseParallax = isFine && !prefersReduced && !isTabletOrSmaller;

  // Stage mouse parallax motion values (zero React re-renders on mousemove)
  const stageRef = useRef<HTMLDivElement | null>(null);
  const rawMouseX = useMotionValue(0);
  const rawMouseY = useMotionValue(0);
  const rawSpotX = useMotionValue(50);
  const rawSpotY = useMotionValue(50);
  const spotOpacity = useMotionValue(0);

  const stageParallaxX = useSpring(rawMouseX, { stiffness: 160, damping: 24 });
  const stageParallaxY = useSpring(rawMouseY, { stiffness: 160, damping: 24 });
  const stageRotateX = useSpring(
    useMotionValue(0),
    { stiffness: 180, damping: 24 }
  );
  const stageRotateY = useSpring(
    useMotionValue(0),
    { stiffness: 180, damping: 24 }
  );

  const stageSpotlightBg = useMotionTemplate`radial-gradient(460px circle at ${rawSpotX}% ${rawSpotY}%, rgba(185, 246, 202, 0.24), transparent 70%)`;

  useEffect(() => {
    const checkWidth = () => {
      setIsTabletOrSmaller(window.innerWidth < 1024);
    };
    checkWidth();
    window.addEventListener('resize', checkWidth);
    return () => window.removeEventListener('resize', checkWidth);
  }, []);

  const filteredProjects =
    showFilters && activeCategory !== 'All'
      ? projects.filter((p) => p.category === activeCategory)
      : projects;

  const totalProjects = filteredProjects.length;
  const safeIndex = totalProjects > 0 ? Math.min(activeIndex, totalProjects - 1) : 0;
  const currentProject = totalProjects > 0 ? filteredProjects[safeIndex] : null;

  useEffect(() => {
    setActiveIndex(0);
    setConfirmDeleteId(null);
  }, [activeCategory]);

  useEffect(() => {
    if (activeIndex >= totalProjects && totalProjects > 0) {
      setActiveIndex(totalProjects - 1);
    }
  }, [activeIndex, totalProjects]);

  const goToNext = useCallback(() => {
    if (totalProjects <= 1) return;
    setDirection(1);
    setConfirmDeleteId(null);
    setActiveIndex((prev) => (prev + 1) % totalProjects);
  }, [totalProjects]);

  const goToPrev = useCallback(() => {
    if (totalProjects <= 1) return;
    setDirection(-1);
    setConfirmDeleteId(null);
    setActiveIndex((prev) => (prev - 1 + totalProjects) % totalProjects);
  }, [totalProjects]);

  const goToIndex = useCallback(
    (targetIdx: number) => {
      if (targetIdx === safeIndex || totalProjects <= 1) return;
      setDirection(targetIdx > safeIndex ? 1 : -1);
      setConfirmDeleteId(null);
      setActiveIndex(targetIdx);
    },
    [safeIndex, totalProjects]
  );

  // Keyboard arrow navigation
  useEffect(() => {
    if (isManagerOpen || isModalBlockingKeys || totalProjects <= 1) return;

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
  }, [goToNext, goToPrev, isManagerOpen, isModalBlockingKeys, totalProjects]);

  const handleStageMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!enableMouseParallax || !stageRef.current) return;
    const rect = stageRef.current.getBoundingClientRect();
    const nx = (e.clientX - rect.left) / rect.width - 0.5;
    const ny = (e.clientY - rect.top) / rect.height - 0.5;

    rawMouseX.set(nx * 24);
    rawMouseY.set(ny * 18);
    stageRotateY.set(nx * 7);
    stageRotateX.set(-ny * 6);
    rawSpotX.set((nx + 0.5) * 100);
    rawSpotY.set((ny + 0.5) * 100);
    spotOpacity.set(1);
  };

  const handleStageMouseLeave = () => {
    rawMouseX.set(0);
    rawMouseY.set(0);
    stageRotateX.set(0);
    stageRotateY.set(0);
    spotOpacity.set(0);
  };

  const handleMobileDragEnd = (
    _event: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo
  ) => {
    if (info.offset.x < -45 || info.velocity.x < -300) {
      goToNext();
    } else if (info.offset.x > 45 || info.velocity.x > 300) {
      goToPrev();
    }
  };

  const openAddModal = () => {
    setManagerError('');
    setUploadError('');
    setEditor({
      id: null,
      title: '',
      category: activeCategory === 'All' ? 'Business Websites' : activeCategory,
      description: '',
      thumbnail: '',
      liveDemoUrl: '',
      techStackText: 'React, TypeScript, Tailwind CSS',
    });
    setIsManagerOpen(true);
  };

  const handleScreenshotUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadError('');

    if (!file.type.startsWith('image/')) {
      setUploadError('Please upload a valid PNG, JPG, or WebP screenshot.');
      e.target.value = '';
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setUploadError('Image size must be under 10 MB.');
      e.target.value = '';
      return;
    }

    try {
      const dataUrl = await resizeScreenshotToDataUrl(file);
      setEditor((prev) => ({ ...prev, thumbnail: dataUrl }));
    } catch {
      setUploadError('Could not process the selected screenshot.');
    } finally {
      e.target.value = '';
    }
  };

  const handleSaveProject = async (e: React.FormEvent) => {
    e.preventDefault();
    setManagerError('');

    const title = editor.title.trim();
    const description = editor.description.trim();
    const liveUrlRaw = editor.liveDemoUrl.trim();

    if (title.length < 2) {
      setManagerError('Please enter a project name (at least 2 characters).');
      return;
    }
    if (description.length < 10) {
      setManagerError('Please enter a project description (at least 10 characters).');
      return;
    }

    let safeLiveUrl = '';
    if (liveUrlRaw.length > 0) {
      const checked = getSafeWebsiteUrl(liveUrlRaw);
      if (!checked) {
        setManagerError('Please enter a valid live website URL (e.g. https://example.com).');
        return;
      }
      safeLiveUrl = checked;
    }

    const techStack = editor.techStackText
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean)
      .slice(0, 8);

    const existing = editor.id
      ? projects.find((p) => p.id === editor.id)
      : undefined;

    const payload: Omit<PortfolioProject, 'id'> = {
      title,
      category: editor.category,
      description,
      overview: existing?.overview && editor.id ? description : description,
      highlights: existing?.highlights ?? [
        'Responsive design across desktop, tablet, and mobile',
        'Performance-optimized custom frontend engineering',
      ],
      thumbnail:
        editor.thumbnail.trim() ||
        '/src/assets/images/project_business_corporate_1795607201341.jpg',
      liveDemoUrl: safeLiveUrl,
      techStack: techStack.length > 0 ? techStack : ['React', 'TypeScript'],
      previewHeadline: title,
      previewSubheadline: description,
      isSample: false,
    };

    setSaving(true);
    const result = editor.id
      ? await onUpdateProject({ id: editor.id, ...payload })
      : await onAddProject(payload);
    setSaving(false);

    if (!result.ok) {
      setManagerError(result.error || 'Could not save project.');
      return;
    }

    setNotice(editor.id ? `Updated "${title}".` : `Added "${title}" to portfolio.`);
    setIsManagerOpen(false);
    if (!editor.id) {
      setActiveCategory('All');
      setActiveIndex(0);
    }
  };

  const handleDeleteCurrent = async (id: string) => {
    const result = await onDeleteProject(id);
    if (result.ok) {
      setNotice('Project removed from showcase.');
      setConfirmDeleteId(null);
    }
  };

  const handleReset = async () => {
    const result = await onResetProjects();
    if (result.ok) {
      setNotice('Restored starter sample projects.');
      setActiveCategory('All');
      setActiveIndex(0);
    }
  };

  const safeExternalSiteUrl = currentProject
    ? getSafeWebsiteUrl(currentProject.liveDemoUrl)
    : undefined;
  const hasAnySample = projects.some((p) => p.isSample);

  const bgClass = variant === 'light' ? 'bg-white' : 'bg-[#F4F6F4]';

  return (
    <section
      id="portfolio-showcase"
      className={`relative overflow-hidden py-16 lg:py-24 ${bgClass} border-b border-[#101B16]/10`}
    >
      {/* Subtle Ambient Accent */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 -left-24 w-96 h-96 rounded-full bg-[#B9F6CA]/25 blur-3xl"
      />

      <div className="relative max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Bar: Heading + Add Project CTA */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10">
          <Reveal direction="up" className="max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-wider text-[#101B16]/65 mb-2">
              Selected Works
            </p>
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl lg:text-[2.65rem] text-[#101B16] tracking-tight leading-[1.1] text-balance">
              Interactive Project Showcase.
            </h2>
            <p className="mt-3 text-sm sm:text-base text-[#101B16]/75 leading-relaxed">
              Explore our layered digital builds. Navigate with arrows, keyboard keys, or
              click any preview card in the stack.
              {hasAnySample && (
                <span className="block mt-1 text-xs font-medium text-[#101B16]/60">
                  Starter items marked as Sample Project — add or edit your real client
                  websites anytime.
                </span>
              )}
            </p>
          </Reveal>

          <Reveal direction="left" delay={0.08} className="flex flex-wrap items-center gap-2.5 shrink-0">
            <MagneticButton
              type="button"
              onClick={openAddModal}
              className="group inline-flex items-center gap-2 px-5 py-2.5 text-xs sm:text-sm font-bold text-[#101B16] bg-[#B9F6CA] hover:bg-[#9ef0b5] rounded-full border border-[#101B16]/10 shadow-sm hover:shadow-[0_8px_22px_rgba(185,246,202,0.45)] transition-all whitespace-nowrap cursor-pointer"
            >
              <Plus
                className="w-4 h-4 transition-transform duration-200 group-hover:rotate-90"
                aria-hidden="true"
              />
              <span>Add Project</span>
            </MagneticButton>

            <motion.button
              type="button"
              whileHover={{ y: -1 }}
              whileTap={{ scale: 0.96 }}
              onClick={handleReset}
              className="group inline-flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold text-[#101B16]/75 hover:text-[#101B16] bg-white border border-[#101B16]/12 rounded-full transition-colors whitespace-nowrap cursor-pointer"
            >
              <RotateCcw
                className="w-3.5 h-3.5 transition-transform duration-300 group-hover:-rotate-90"
                aria-hidden="true"
              />
              <span>Reset Samples</span>
            </motion.button>
          </Reveal>
        </div>

        {/* Optional Category Filter Bar */}
        {showFilters && (
          <div
            role="tablist"
            aria-label="Filter projects by category"
            className="mb-10 flex flex-wrap items-center gap-2"
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
                      ? 'text-white'
                      : 'bg-white text-[#101B16] border border-[#101B16]/10 hover:bg-[#e9eee9]'
                  }`}
                >
                  {isSelected && (
                    <motion.span
                      layoutId="showcase-category-pill"
                      transition={{ type: 'spring', stiffness: 420, damping: 32 }}
                      className="absolute inset-0 bg-[#101B16] rounded-full"
                    />
                  )}
                  <span className="relative z-10">{category}</span>
                </button>
              );
            })}
          </div>
        )}

        <AnimatePresence>
          {notice && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.22, ease: EASE_AGENCY }}
              className="mb-8 p-3.5 rounded-xl bg-[#B9F6CA]/40 border border-[#101B16]/15 text-xs font-semibold text-[#101B16] flex items-center justify-between gap-2"
            >
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 shrink-0" aria-hidden="true" />
                <span>{notice}</span>
              </div>
              <button
                type="button"
                onClick={() => setNotice('')}
                aria-label="Dismiss notice"
                className="p-1 hover:bg-[#101B16]/10 rounded-lg cursor-pointer"
              >
                <X className="w-3.5 h-3.5" aria-hidden="true" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Showcase Stage */}
        {isLoading ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 h-[420px] rounded-3xl bg-white/70 border border-[#101B16]/10 animate-pulse" />
            <div className="lg:col-span-5 h-[460px] rounded-3xl bg-white border border-[#101B16]/10 animate-pulse" />
          </div>
        ) : !currentProject ? (
          <div className="rounded-3xl bg-white border border-[#101B16]/10 p-12 text-center space-y-4">
            <h3 className="font-display font-bold text-xl text-[#101B16]">
              No projects in this category yet
            </h3>
            <p className="text-sm text-[#101B16]/65 max-w-md mx-auto">
              Add a real project to showcase your live website work or switch to All
              projects.
            </p>
            <div className="flex justify-center gap-3">
              <MagneticButton
                type="button"
                onClick={openAddModal}
                className="inline-flex items-center gap-2 px-5 py-2.5 text-xs sm:text-sm font-bold text-[#101B16] bg-[#B9F6CA] hover:bg-[#9ef0b5] rounded-full cursor-pointer"
              >
                <Plus className="w-4 h-4" aria-hidden="true" />
                <span>Add New Project</span>
              </MagneticButton>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
            {/* LEFT COLUMN: 3D Perspective Layered Preview Stack (Desktop/Tablet) + Swipe Preview (Mobile) */}
            <div className="lg:col-span-7">
              {/* Mobile View: Single Interactive Swipeable Preview */}
              <div className="md:hidden">
                <AnimatePresence mode="wait" custom={direction}>
                  <motion.div
                    key={currentProject.id}
                    custom={direction}
                    drag={totalProjects > 1 ? 'x' : false}
                    dragConstraints={{ left: 0, right: 0 }}
                    dragElastic={0.22}
                    onDragEnd={handleMobileDragEnd}
                    initial={{ opacity: 0, x: direction * 36, scale: 0.97 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    exit={{ opacity: 0, x: direction * -36, scale: 0.97 }}
                    transition={{ duration: 0.28, ease: EASE_AGENCY }}
                    className="rounded-2xl bg-white p-2.5 border border-[#101B16]/12 shadow-[0_16px_40px_rgba(16,27,22,0.12)]"
                  >
                    <div className="px-3 py-2 flex items-center justify-between border-b border-[#101B16]/8 mb-2">
                      <span className="font-mono text-[11px] font-semibold text-[#101B16]/60">
                        {formatTwoDigits(safeIndex + 1)} / {formatTwoDigits(totalProjects)}
                      </span>
                      <span className="text-[11px] font-semibold text-[#101B16]/65">
                        {totalProjects > 1 ? 'Swipe to browse' : currentProject.category}
                      </span>
                    </div>
                    <div className="aspect-[16/10] w-full rounded-xl overflow-hidden bg-[#101B16]">
                      <ImageWithFallback
                        src={currentProject.thumbnail}
                        alt={`${currentProject.title} website preview`}
                        fallbackTitle={currentProject.title}
                        fallbackSubtitle={currentProject.category}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Tablet & Desktop View: 3D Layered Perspective Stack */}
              <div
                ref={stageRef}
                onMouseMove={handleStageMouseMove}
                onMouseLeave={handleStageMouseLeave}
                className="hidden md:flex relative h-[430px] lg:h-[520px] items-center justify-center select-none"
                style={{ perspective: '1500px' }}
              >
                {/* Cursor-following subtle green aura behind stack */}
                {enableMouseParallax && (
                  <motion.div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-4 rounded-[36px] transition-opacity duration-300"
                    style={{
                      background: stageSpotlightBg,
                      opacity: spotOpacity,
                    }}
                  />
                )}

                <motion.div
                  style={
                    enableMouseParallax
                      ? {
                          x: stageParallaxX,
                          y: stageParallaxY,
                          rotateX: stageRotateX,
                          rotateY: stageRotateY,
                          transformStyle: 'preserve-3d',
                        }
                      : { transformStyle: 'preserve-3d' }
                  }
                  className="relative w-full max-w-[540px] lg:max-w-[590px] aspect-[16/10.5]"
                >
                  {filteredProjects.map((project, idx) => {
                    const rel = getSignedCircularOffset(idx, safeIndex, totalProjects);
                    const isCurrent = rel === 0;
                    const isPrev = rel === -1;
                    const isVisibleStack = rel >= -1 && rel <= 3;

                    if (!isVisibleStack) return null;

                    const spreadFactor = isTabletOrSmaller ? 0.65 : 1;

                    let targetX = 0;
                    let targetY = 0;
                    let targetScale = 1;
                    let targetRotateY = -7;
                    let targetRotateX = 2.5;
                    let targetRotateZ = -1.5;
                    let targetOpacity = 1;
                    let zIndex = 40;

                    if (isCurrent) {
                      targetX = -14 * spreadFactor;
                      targetY = 6 * spreadFactor;
                      targetScale = 1;
                      targetRotateY = isTabletOrSmaller ? -4 : -7;
                      targetRotateX = 2.5;
                      targetRotateZ = -1.5;
                      targetOpacity = 1;
                      zIndex = 40;
                    } else if (isPrev) {
                      targetX = -82 * spreadFactor;
                      targetY = 26 * spreadFactor;
                      targetScale = 0.86;
                      targetRotateY = 10;
                      targetRotateX = -2;
                      targetRotateZ = -8;
                      targetOpacity = 0.22;
                      zIndex = 8;
                    } else {
                      // Upcoming cards layered behind & offset diagonally
                      targetX = rel * 44 * spreadFactor;
                      targetY = -rel * 20 * spreadFactor;
                      targetScale = Math.max(0.76, 1 - rel * 0.07);
                      targetRotateY = -7 - rel * 3;
                      targetRotateX = 2.5 + rel * 1;
                      targetRotateZ = -1.5 + rel * 4.2;
                      targetOpacity = Math.max(0.42, 1 - rel * 0.2);
                      zIndex = 40 - rel * 8;
                    }

                    return (
                      <motion.div
                        key={project.id}
                        role="button"
                        tabIndex={0}
                        aria-label={`Select ${project.title}`}
                        onClick={() => {
                          if (isCurrent) {
                            onOpenProject(project, 'details');
                          } else {
                            goToIndex(idx);
                          }
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            if (isCurrent) {
                              onOpenProject(project, 'details');
                            } else {
                              goToIndex(idx);
                            }
                          }
                        }}
                        initial={false}
                        animate={{
                          x: targetX,
                          y: targetY,
                          scale: targetScale,
                          rotateX: prefersReduced ? 0 : targetRotateX,
                          rotateY: prefersReduced ? 0 : targetRotateY,
                          rotateZ: prefersReduced ? 0 : targetRotateZ,
                          opacity: targetOpacity,
                        }}
                        whileHover={
                          !prefersReduced && isFine
                            ? {
                                y: targetY - 10,
                                scale: isCurrent ? 1.025 : targetScale + 0.03,
                                rotateZ: targetRotateZ + (isCurrent ? 1 : -1.5),
                              }
                            : undefined
                        }
                        transition={{
                          type: 'spring',
                          stiffness: 220,
                          damping: 25,
                          mass: 0.85,
                        }}
                        style={{
                          zIndex,
                          transformStyle: 'preserve-3d',
                        }}
                        data-cursor={isCurrent ? 'view' : 'interactive'}
                        className={`group absolute inset-0 rounded-2xl bg-white p-2.5 sm:p-3 border cursor-pointer transition-shadow duration-300 ${
                          isCurrent
                            ? 'border-[#101B16]/15 shadow-[0_32px_70px_rgba(16,27,22,0.22)]'
                            : 'border-[#101B16]/12 shadow-[0_20px_45px_rgba(16,27,22,0.14)] hover:shadow-[0_28px_56px_rgba(16,27,22,0.2)]'
                        }`}
                      >
                        {/* Minimal Browser Chrome Bar */}
                        <div className="px-3 py-2 border-b border-[#101B16]/8 flex items-center justify-between mb-2">
                          <span className="font-mono text-[11px] font-semibold text-[#101B16]/60 truncate">
                            {formatTwoDigits(idx + 1)} · {project.title}
                          </span>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-[#101B16]/55 shrink-0">
                            {project.category}
                          </span>
                        </div>

                        {/* Screenshot Viewport */}
                        <div className="relative w-full h-[calc(100%-36px)] rounded-xl overflow-hidden bg-[#101B16]">
                          <ImageWithFallback
                            src={project.thumbnail}
                            alt={`${project.title} — ${project.category}`}
                            fallbackTitle={project.title}
                            fallbackSubtitle={project.category}
                            className="w-full h-full object-cover transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]"
                          />

                          {/* Subtle lime corner highlight on active card */}
                          {isCurrent && (
                            <div
                              aria-hidden="true"
                              className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-[#101B16]/35 via-transparent to-[#B9F6CA]/10 opacity-70 group-hover:opacity-20 transition-opacity duration-300"
                            />
                          )}
                        </div>
                      </motion.div>
                    );
                  })}
                </motion.div>
              </div>
            </div>

            {/* RIGHT COLUMN: Clean White Floating Project Details Card */}
            <div className="lg:col-span-5">
              <div className="rounded-3xl bg-white border border-[#101B16]/10 p-6 sm:p-8 shadow-[0_24px_64px_rgba(16,27,22,0.1)]">
                {/* Top Meta Row: Animated Counter (01/04) + Sample Indicator + Edit/Delete */}
                <div className="flex items-center justify-between gap-3 pb-4 border-b border-[#101B16]/10">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="inline-flex items-baseline gap-1 font-mono tabular-nums">
                      <AnimatePresence mode="wait">
                        <motion.span
                          key={safeIndex}
                          initial={{ opacity: 0, y: direction * 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: direction * -8 }}
                          transition={{ duration: 0.2, ease: EASE_AGENCY }}
                          className="text-lg font-extrabold text-[#101B16]"
                        >
                          {formatTwoDigits(safeIndex + 1)}
                        </motion.span>
                      </AnimatePresence>
                      <span className="text-xs font-semibold text-[#101B16]/45">
                        / {formatTwoDigits(totalProjects)}
                      </span>
                    </div>

                    {currentProject.isSample && (
                      <span className="text-[11px] font-bold uppercase tracking-wider text-[#101B16]/60 truncate">
                        · Sample Project
                      </span>
                    )}
                  </div>

                  {/* Delete Control */}
                  <div className="flex items-center gap-1 shrink-0">
                    {confirmDeleteId === currentProject.id ? (
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleDeleteCurrent(currentProject.id)}
                          className="px-2.5 py-1 rounded-full bg-red-600 text-white text-[11px] font-bold hover:bg-red-700 cursor-pointer"
                        >
                          Delete
                        </button>
                        <button
                          type="button"
                          onClick={() => setConfirmDeleteId(null)}
                          className="px-2.5 py-1 rounded-full bg-[#F4F6F4] text-[#101B16] text-[11px] font-semibold cursor-pointer"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setConfirmDeleteId(currentProject.id)}
                        aria-label={`Delete ${currentProject.title}`}
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-[#101B16]/55 hover:text-red-700 hover:bg-red-50 transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Animated Project Content */}
                <AnimatePresence mode="wait" custom={direction}>
                  <motion.div
                    key={currentProject.id}
                    custom={direction}
                    initial={{ opacity: 0, y: direction * 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: direction * -14 }}
                    transition={{ duration: 0.28, ease: EASE_AGENCY }}
                    className="pt-5 space-y-5"
                  >
                    {/* Crisp Card Screenshot Preview */}
                    <button
                      type="button"
                      onClick={() => onOpenProject(currentProject, 'details')}
                      className="group block w-full aspect-[16/9] rounded-2xl overflow-hidden bg-[#F4F6F4] border border-[#101B16]/10 cursor-pointer text-left"
                      aria-label={`Inspect ${currentProject.title}`}
                    >
                      <ImageWithFallback
                        src={currentProject.thumbnail}
                        alt={currentProject.title}
                        fallbackTitle={currentProject.title}
                        fallbackSubtitle={currentProject.category}
                        className="w-full h-full object-cover transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.05]"
                      />
                    </button>

                    {/* Title + Description */}
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-[#101B16]/60 mb-1">
                        {currentProject.category}
                      </p>
                      <h3 className="font-display font-extrabold text-2xl text-[#101B16] tracking-tight leading-snug">
                        {currentProject.title}
                      </h3>
                      <p className="mt-2.5 text-sm text-[#101B16]/75 leading-relaxed">
                        {currentProject.description}
                      </p>
                    </div>

                    {/* Category & Technology Tags */}
                    <div className="flex flex-wrap items-center gap-1.5 pt-1">
                      <span className="px-2.5 py-1 rounded-md bg-[#101B16] text-[#B9F6CA] text-[11px] font-bold">
                        {currentProject.category}
                      </span>
                      {currentProject.techStack.map((tech) => (
                        <span
                          key={tech}
                          className="px-2.5 py-1 rounded-md bg-[#F4F6F4] text-[#101B16]/80 text-[11px] font-semibold"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>

                    {/* Action Buttons: Visit Site + Case Study */}
                    <div className="pt-1 flex flex-wrap items-center gap-3">
                      {safeExternalSiteUrl ? (
                        <MagneticLink
                          href={safeExternalSiteUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group flex-1 min-w-[160px] h-11 px-5 rounded-full bg-[#B9F6CA] hover:bg-[#9ef0b5] text-[#101B16] text-xs sm:text-sm font-bold inline-flex items-center justify-center gap-2 border border-[#101B16]/10 shadow-sm hover:shadow-[0_8px_22px_rgba(185,246,202,0.45)] transition-all whitespace-nowrap"
                        >
                          <span>Visit Site</span>
                          <ArrowUpRight
                            className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                            aria-hidden="true"
                          />
                        </MagneticLink>
                      ) : (
                        <MagneticButton
                          type="button"
                          onClick={() => onOpenProject(currentProject, 'live')}
                          className="group flex-1 min-w-[160px] h-11 px-5 rounded-full bg-[#B9F6CA] hover:bg-[#9ef0b5] text-[#101B16] text-xs sm:text-sm font-bold inline-flex items-center justify-center gap-2 border border-[#101B16]/10 shadow-sm hover:shadow-[0_8px_22px_rgba(185,246,202,0.45)] transition-all whitespace-nowrap cursor-pointer"
                        >
                          <Eye className="w-4 h-4" aria-hidden="true" />
                          <span>
                            {currentProject.isSample ? 'Preview Sample' : 'Live Demo'}
                          </span>
                        </MagneticButton>
                      )}

                      <motion.button
                        type="button"
                        whileTap={{ scale: 0.96 }}
                        onClick={() => onOpenProject(currentProject, 'details')}
                        className="group h-11 px-5 rounded-full bg-[#F4F6F4] hover:bg-[#101B16] text-[#101B16] hover:text-white text-xs sm:text-sm font-bold inline-flex items-center justify-center gap-1.5 transition-colors whitespace-nowrap cursor-pointer"
                      >
                        <span>Case Study</span>
                        <ExternalLink
                          className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                          aria-hidden="true"
                        />
                      </motion.button>
                    </div>
                  </motion.div>
                </AnimatePresence>

                {/* Navigation Controls Row: Prev / Dots / Next */}
                <div className="mt-6 pt-5 border-t border-[#101B16]/10 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.06 }}
                      whileTap={{ scale: 0.92 }}
                      onClick={goToPrev}
                      disabled={totalProjects <= 1}
                      aria-label="Previous project"
                      className="w-10 h-10 rounded-full border border-[#101B16]/15 bg-white hover:bg-[#101B16] text-[#101B16] hover:text-white disabled:opacity-40 flex items-center justify-center transition-colors cursor-pointer"
                    >
                      <ArrowLeft className="w-4 h-4" aria-hidden="true" />
                    </motion.button>

                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.06 }}
                      whileTap={{ scale: 0.92 }}
                      onClick={goToNext}
                      disabled={totalProjects <= 1}
                      aria-label="Next project"
                      className="w-10 h-10 rounded-full border border-[#101B16]/15 bg-[#101B16] hover:bg-[#1d3027] text-[#B9F6CA] disabled:opacity-40 flex items-center justify-center transition-colors cursor-pointer"
                    >
                      <ArrowRight className="w-4 h-4" aria-hidden="true" />
                    </motion.button>
                  </div>

                  {/* Interactive Project Dots */}
                  <div className="flex items-center gap-1.5 overflow-x-auto max-w-[180px] py-1">
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
                              ? 'w-7 bg-[#101B16]'
                              : 'w-2 bg-[#101B16]/20 hover:bg-[#101B16]/45'
                          }`}
                        />
                      );
                    })}
                  </div>

                  <span className="hidden sm:inline text-[11px] font-medium text-[#101B16]/50 whitespace-nowrap">
                    ← / → Keys
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Unlimited Project Manager Modal (Add / Edit) */}
      <AnimatePresence>
        {isManagerOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#101B16]/75 backdrop-blur-sm"
            role="dialog"
            aria-modal="true"
            aria-labelledby="project-manager-title"
            onClick={() => setIsManagerOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 14 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 14 }}
              transition={{ duration: 0.24, ease: EASE_AGENCY }}
              className="bg-white rounded-2xl border border-[#101B16]/10 w-full max-w-xl max-h-[90vh] flex flex-col overflow-hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="px-6 py-4 border-b border-[#101B16]/10 flex items-center justify-between">
                <h3
                  id="project-manager-title"
                  className="font-display font-bold text-lg text-[#101B16]"
                >
                  {editor.id ? 'Edit Portfolio Project' : 'Add New Portfolio Project'}
                </h3>
                <button
                  type="button"
                  onClick={() => setIsManagerOpen(false)}
                  aria-label="Close modal"
                  className="w-9 h-9 rounded-xl flex items-center justify-center text-[#101B16]/70 hover:bg-[#F4F6F4] cursor-pointer"
                >
                  <X className="w-5 h-5" aria-hidden="true" />
                </button>
              </div>

              <form onSubmit={handleSaveProject} className="p-6 space-y-4 overflow-y-auto">
                {/* Screenshot Upload or URL */}
                <div>
                  <span className="block text-xs font-bold text-[#101B16] mb-2">
                    Website Preview Screenshot
                  </span>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                    <div className="w-full sm:w-44 aspect-[16/10] rounded-xl bg-[#101B16] overflow-hidden shrink-0 border border-[#101B16]/10 flex items-center justify-center text-white/60 text-xs">
                      {editor.thumbnail ? (
                        <img
                          src={editor.thumbnail}
                          alt="Project screenshot preview"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span>Preview image</span>
                      )}
                    </div>

                    <div className="flex-1 space-y-2">
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleScreenshotUpload}
                        className="hidden"
                      />
                      <div className="flex flex-wrap items-center gap-2">
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#B9F6CA] hover:bg-[#9ef0b5] text-[#101B16] text-xs font-bold transition-colors cursor-pointer"
                        >
                          <Camera className="w-3.5 h-3.5" aria-hidden="true" />
                          <span>Upload Screenshot</span>
                        </button>
                        {editor.thumbnail && (
                          <button
                            type="button"
                            onClick={() =>
                              setEditor((prev) => ({ ...prev, thumbnail: '' }))
                            }
                            className="px-3 py-2 rounded-full bg-[#F4F6F4] hover:bg-[#e5eae5] text-[#101B16] text-xs font-semibold cursor-pointer"
                          >
                            Remove
                          </button>
                        )}
                      </div>
                      <input
                        type="text"
                        value={
                          editor.thumbnail.startsWith('data:image/')
                            ? ''
                            : editor.thumbnail
                        }
                        onChange={(e) =>
                          setEditor((prev) => ({ ...prev, thumbnail: e.target.value }))
                        }
                        placeholder="Or paste screenshot image URL (optional)"
                        className="w-full h-10 px-3 text-xs rounded-xl bg-[#F4F6F4] text-[#101B16] focus:outline-none focus:ring-2 focus:ring-[#101B16]/30 focus:bg-white"
                      />
                    </div>
                  </div>
                  {uploadError && (
                    <p className="mt-1.5 text-xs text-red-700 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                      <span>{uploadError}</span>
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="proj-title"
                      className="block text-xs font-bold text-[#101B16] mb-1.5"
                    >
                      Project Name *
                    </label>
                    <input
                      id="proj-title"
                      type="text"
                      value={editor.title}
                      onChange={(e) =>
                        setEditor((prev) => ({ ...prev, title: e.target.value }))
                      }
                      placeholder="e.g. Horizon Logistics Web Portal"
                      className="w-full h-11 px-4 text-sm rounded-xl bg-[#F4F6F4] text-[#101B16] focus:outline-none focus:ring-2 focus:ring-[#101B16]/30 focus:bg-white"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="proj-category"
                      className="block text-xs font-bold text-[#101B16] mb-1.5"
                    >
                      Category *
                    </label>
                    <select
                      id="proj-category"
                      value={editor.category}
                      onChange={(e) =>
                        setEditor((prev) => ({
                          ...prev,
                          category: e.target.value as PortfolioCategory,
                        }))
                      }
                      className="w-full h-11 px-3 text-sm rounded-xl bg-[#F4F6F4] text-[#101B16] focus:outline-none focus:ring-2 focus:ring-[#101B16]/30"
                    >
                      {PROJECT_CATEGORY_OPTIONS.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="proj-description"
                    className="block text-xs font-bold text-[#101B16] mb-1.5"
                  >
                    Description *
                  </label>
                  <textarea
                    id="proj-description"
                    rows={3}
                    value={editor.description}
                    onChange={(e) =>
                      setEditor((prev) => ({ ...prev, description: e.target.value }))
                    }
                    placeholder="Concise summary of the website, goals, and key capabilities..."
                    className="w-full p-3.5 text-sm rounded-xl bg-[#F4F6F4] text-[#101B16] focus:outline-none focus:ring-2 focus:ring-[#101B16]/30 focus:bg-white resize-y"
                  />
                </div>

                <div>
                  <label
                    htmlFor="proj-live-url"
                    className="block text-xs font-bold text-[#101B16] mb-1.5"
                  >
                    Live Website URL
                  </label>
                  <input
                    id="proj-live-url"
                    type="url"
                    value={editor.liveDemoUrl}
                    onChange={(e) =>
                      setEditor((prev) => ({ ...prev, liveDemoUrl: e.target.value }))
                    }
                    placeholder="https://your-client-website.com"
                    className="w-full h-11 px-4 text-sm rounded-xl bg-[#F4F6F4] text-[#101B16] focus:outline-none focus:ring-2 focus:ring-[#101B16]/30 focus:bg-white"
                  />
                  <p className="mt-1 text-[11px] text-[#101B16]/55">
                    Clicking Visit Site opens this exact URL in a new tab.
                  </p>
                </div>

                <div>
                  <label
                    htmlFor="proj-tech"
                    className="block text-xs font-bold text-[#101B16] mb-1.5"
                  >
                    Technology Tags (comma separated)
                  </label>
                  <input
                    id="proj-tech"
                    type="text"
                    value={editor.techStackText}
                    onChange={(e) =>
                      setEditor((prev) => ({ ...prev, techStackText: e.target.value }))
                    }
                    placeholder="React, TypeScript, Tailwind CSS, Next.js"
                    className="w-full h-11 px-4 text-sm rounded-xl bg-[#F4F6F4] text-[#101B16] focus:outline-none focus:ring-2 focus:ring-[#101B16]/30 focus:bg-white"
                  />
                </div>

                {managerError && (
                  <p className="text-xs text-red-700 flex items-center gap-1.5">
                    <AlertCircle className="w-4 h-4 shrink-0" aria-hidden="true" />
                    <span>{managerError}</span>
                  </p>
                )}

                <div className="pt-2 flex items-center justify-end gap-3 border-t border-[#101B16]/10">
                  <button
                    type="button"
                    onClick={() => setIsManagerOpen(false)}
                    className="px-5 py-2.5 rounded-full bg-[#F4F6F4] hover:bg-[#e5eae5] text-[#101B16] text-xs font-bold cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="inline-flex items-center gap-1.5 px-6 py-2.5 rounded-full bg-[#101B16] hover:bg-[#1c2e26] disabled:opacity-60 text-[#B9F6CA] text-xs font-bold cursor-pointer"
                  >
                    <Check className="w-4 h-4" aria-hidden="true" />
                    <span>
                      {saving ? 'Saving...' : editor.id ? 'Save Changes' : 'Add Project'}
                    </span>
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};
