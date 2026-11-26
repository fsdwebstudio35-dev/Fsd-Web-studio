import React, { useRef } from 'react';
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  MessageCircle,
} from 'lucide-react';
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react';
import { buildWhatsAppUrl, STUDIO_CONFIG } from '../config/studioConfig';
import {
  ABOUT_CONTENT,
  HERO_3D_IMAGE,
  PROCESS_STEPS,
  SAMPLE_TESTIMONIALS,
  SERVICES,
  STUDIO_IMAGES,
  WHY_CHOOSE_US,
} from '../data/studioData';
import { PageId, PortfolioProject, TeamMember } from '../types';
import { ImageWithFallback } from '../components/ImageWithFallback';
import { PortfolioShowcase } from '../components/PortfolioShowcase';
import { ReasonIcon, ServiceIcon } from '../components/ServiceIcon';
import { AdminAuthStatus } from '../components/TeamAdminPanel';
import { TeamSection } from '../components/TeamSection';
import { WelcomeTeamSection } from '../components/WelcomeTeamSection';
import {
  EASE_AGENCY,
  LetterReveal,
  MagneticButton,
  MagneticLink,
  Reveal,
  RevealItem,
  RevealStagger,
  TiltCard,
  useIsFinePointer,
} from '../components/MotionSystem';

interface HomePageProps {
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
  teamMembers: TeamMember[];
  isLoadingTeam?: boolean;
  adminMembers: TeamMember[];
  isLoadingAdminMembers?: boolean;
  adminToken: string | null;
  adminStatus: AdminAuthStatus;
  onRefreshAdminStatus: () => Promise<void>;
  onClaimAdmin: (passcode: string) => Promise<{ ok: boolean; error?: string }>;
  onLoginAdmin: (passcode: string) => Promise<{ ok: boolean; error?: string }>;
  onLogoutAdmin: () => Promise<void>;
  onAddTeamMember: (member: Omit<TeamMember, 'id'>) => Promise<{ ok: boolean; error?: string }>;
  onUpdateTeamMember: (member: TeamMember) => Promise<{ ok: boolean; error?: string }>;
  onDeleteTeamMember: (id: string) => Promise<{ ok: boolean; error?: string }>;
  onToggleTeamVisibility: (id: string, isVisible: boolean) => Promise<{ ok: boolean; error?: string }>;
  onReorderTeam: (orderedIds: string[]) => Promise<{ ok: boolean; error?: string }>;
  onResetTeam: () => Promise<{ ok: boolean; error?: string }>;
}

export const HomePage: React.FC<HomePageProps> = ({
  onNavigate,
  onOpenProject,
  projects,
  isLoadingProjects = false,
  isModalOpen = false,
  onAddProject,
  onUpdateProject,
  onDeleteProject,
  onResetProjects,
  teamMembers,
  isLoadingTeam = false,
  adminMembers,
  isLoadingAdminMembers = false,
  adminToken,
  adminStatus,
  onRefreshAdminStatus,
  onClaimAdmin,
  onLoginAdmin,
  onLogoutAdmin,
  onAddTeamMember,
  onUpdateTeamMember,
  onDeleteTeamMember,
  onToggleTeamVisibility,
  onReorderTeam,
  onResetTeam,
}) => {
  const heroRef = useRef<HTMLElement | null>(null);
  const servicesSectionRef = useRef<HTMLElement | null>(null);
  const prefersReduced = useReducedMotion();
  const isFine = useIsFinePointer();

  const { scrollYProgress: heroScroll } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });

  const visualParallaxY = useTransform(
    heroScroll,
    [0, 1],
    prefersReduced || !isFine ? [0, 0] : [0, 36]
  );
  const glowParallaxY = useTransform(
    heroScroll,
    [0, 1],
    prefersReduced ? [0, 0] : [0, -28]
  );

  const whatsappUrl = buildWhatsAppUrl(
    'Hello FSD Web Studio, I would like to discuss starting a new project.'
  );

  const handleScrollToServices = () => {
    servicesSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="bg-white text-[#101B16]">
      {/* 1. HERO SECTION (White Canvas with Ambient Motion & Parallax) */}
      <section
        ref={heroRef}
        className="relative overflow-hidden bg-white border-b border-[#101B16]/10"
      >
        {/* Subtle Moving Background Blobs & Architectural Accents */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 overflow-hidden"
        >
          <motion.div
            animate={
              prefersReduced
                ? undefined
                : { x: [0, 26, -14, 0], y: [0, -18, 14, 0], scale: [1, 1.06, 0.96, 1] }
            }
            transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute -top-28 -left-24 w-[420px] h-[420px] rounded-full bg-[#B9F6CA]/35 blur-3xl"
          />
          <motion.div
            animate={
              prefersReduced
                ? undefined
                : { x: [0, -22, 18, 0], y: [0, 22, -12, 0] }
            }
            transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut' }}
            className="hidden md:block absolute -bottom-32 right-[15%] w-[360px] h-[360px] rounded-full bg-[#B9F6CA]/25 blur-3xl"
          />
          <motion.div
            style={{ y: glowParallaxY }}
            className="hidden lg:block absolute top-14 right-12 w-24 h-24 rounded-3xl border border-[#101B16]/8 rotate-12"
          />
        </div>

        <div className="relative max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-10 lg:pt-16 lg:pb-14">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-stretch">
            {/* Left Column: Line-by-line Headline Reveal, Description, Magnetic CTAs */}
            <div className="lg:col-span-6 flex flex-col justify-center">
              <motion.p
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, ease: EASE_AGENCY }}
                className="text-sm font-bold text-[#101B16]/70 mb-4"
              >
                <LetterReveal
                  text={`${STUDIO_CONFIG.brandName} · ${STUDIO_CONFIG.tagline}`}
                  trigger="mount"
                  delay={0.02}
                />
              </motion.p>

              <h1
                className="font-display font-extrabold text-[#101B16] tracking-tight leading-[1.06] text-balance"
                style={{ fontSize: 'clamp(2.35rem, 4.2vw, 3.75rem)' }}
              >
                <span className="block">
                  <LetterReveal
                    text="We build digital experiences"
                    trigger="mount"
                    delay={0.08}
                    stagger={0.02}
                  />
                </span>
                <span className="block">
                  <LetterReveal
                    text="that grow your business."
                    trigger="mount"
                    delay={0.32}
                    stagger={0.02}
                  />
                </span>
              </h1>

              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, delay: 0.24, ease: EASE_AGENCY }}
                className="mt-5 text-base sm:text-lg text-[#101B16]/75 leading-relaxed max-w-xl"
              >
                <LetterReveal
                  text="We turn ideas into powerful websites, digital products and experiences that help your business move forward."
                  trigger="mount"
                  delay={0.36}
                />
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, delay: 0.34, ease: EASE_AGENCY }}
                className="mt-8 flex flex-wrap items-center gap-3.5"
              >
                <MagneticButton
                  type="button"
                  onClick={() => onNavigate('contact')}
                  className="group inline-flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-bold text-[#101B16] bg-[#B9F6CA] hover:bg-[#9ef0b5] rounded-full border border-[#101B16]/10 shadow-sm hover:shadow-[0_10px_26px_rgba(185,246,202,0.55)] transition-all duration-200 whitespace-nowrap shrink-0 cursor-pointer"
                >
                  <LetterReveal text="Start a Project" trigger="mount" stagger={0.02} />
                  <ArrowRight
                    className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1"
                    aria-hidden="true"
                  />
                </MagneticButton>

                <MagneticButton
                  type="button"
                  onClick={() => onNavigate('portfolio')}
                  className="group inline-flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-bold text-[#101B16] bg-[#F4F6F4] hover:bg-[#101B16] hover:text-white rounded-full transition-colors duration-200 whitespace-nowrap shrink-0 cursor-pointer"
                >
                  <LetterReveal text="Explore Our Work" trigger="mount" stagger={0.02} />
                  <ArrowUpRight
                    className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    aria-hidden="true"
                  />
                </MagneticButton>
              </motion.div>
            </div>

            {/* Right Column: Parallax + Floating Browser Mockups + 3D Green Backdrop */}
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 18 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.16, ease: EASE_AGENCY }}
              style={{ y: visualParallaxY }}
              className="lg:col-span-6 flex"
            >
              <div className="relative w-full min-h-[380px] sm:min-h-[440px] lg:h-full rounded-3xl overflow-hidden bg-gradient-to-br from-[#101B16] via-[#15281f] to-[#0b1410] p-5 sm:p-8 flex items-center justify-center shadow-[0_20px_50px_rgba(16,27,22,0.14)]">
                {/* 3D Green Render Backdrop */}
                <div className="absolute inset-0">
                  <ImageWithFallback
                    src={HERO_3D_IMAGE}
                    alt="Abstract 3D deep forest green and lime green architectural geometry"
                    loading="eager"
                    className="w-full h-full object-cover opacity-85"
                  />
                  <div
                    aria-hidden="true"
                    className="absolute inset-0 bg-gradient-to-tr from-[#101B16]/85 via-[#101B16]/35 to-transparent"
                  />
                </div>

                {/* Animated Lime Radial Glow */}
                <motion.div
                  aria-hidden="true"
                  animate={
                    prefersReduced
                      ? undefined
                      : { scale: [1, 1.15, 1], opacity: [0.22, 0.35, 0.22] }
                  }
                  transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
                  className="absolute -top-16 -right-16 w-64 h-64 rounded-full bg-[#B9F6CA]/30 blur-3xl pointer-events-none"
                />

                {/* Floating Desktop Browser Mockup */}
                <motion.div
                  animate={prefersReduced ? undefined : { y: [0, -8, 0] }}
                  transition={{
                    duration: 5.5,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                  whileHover={isFine ? { y: -4, scale: 1.015 } : undefined}
                  className="group relative z-10 w-full max-w-[430px] rounded-2xl bg-white/95 backdrop-blur-md border border-white/40 shadow-2xl overflow-hidden"
                >
                  <div className="px-4 py-2.5 bg-[#F4F6F4] border-b border-[#101B16]/10 flex items-center justify-between">
                    <span className="font-mono text-[11px] text-[#101B16]/60 truncate">
                      fsdwebstudio.com
                    </span>
                    <span className="text-[11px] font-bold text-[#101B16]">
                      Web Experience
                    </span>
                  </div>

                  <div className="p-4 sm:p-5 space-y-3.5">
                    <div className="relative aspect-[16/9] w-full rounded-xl overflow-hidden bg-[#101B16] border border-[#101B16]/10">
                      <ImageWithFallback
                        src={STUDIO_IMAGES.heroMockupPreview}
                        alt="Modern web architecture preview on clean studio display"
                        loading="eager"
                        fallbackTitle="FSD Web Studio"
                        className="w-full h-full object-cover transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105"
                      />
                      <div
                        aria-hidden="true"
                        className="absolute inset-0 bg-gradient-to-t from-[#101B16]/65 via-transparent to-transparent"
                      />
                      <p className="absolute bottom-2.5 left-3 right-3 text-[11px] font-semibold text-white">
                        Digital Product Architecture · Responsive Engineering
                      </p>
                    </div>

                    <h2 className="font-display font-extrabold text-base sm:text-lg text-[#101B16] leading-snug">
                      <LetterReveal text="Fast, minimal interfaces crafted to convert." trigger="mount" delay={0.3} />
                    </h2>

                    <div className="grid grid-cols-2 gap-2.5">
                      <div className="p-2.5 rounded-xl bg-[#F4F6F4] transition-colors hover:bg-[#e9eee9]">
                        <div className="text-xs font-bold text-[#101B16]">
                          Mobile-First
                        </div>
                        <div className="text-[11px] text-[#101B16]/65 mt-0.5">
                          Responsive layout
                        </div>
                      </div>
                      <div className="p-2.5 rounded-xl bg-[#B9F6CA] transition-colors hover:bg-[#a6f2bc]">
                        <div className="text-xs font-bold text-[#101B16]">
                          Custom Code
                        </div>
                        <div className="text-[11px] text-[#101B16]/80 mt-0.5">
                          React &amp; TypeScript
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Secondary Floating Mobile Browser Card */}
                <motion.div
                  animate={prefersReduced ? undefined : { y: [0, 7, 0] }}
                  transition={{
                    duration: 4.8,
                    repeat: Infinity,
                    ease: 'easeInOut',
                    delay: 0.4,
                  }}
                  className="hidden sm:flex flex-col z-20 absolute bottom-4 right-4 w-44 rounded-2xl bg-[#101B16]/95 backdrop-blur-md border border-[#B9F6CA]/35 p-3.5 shadow-xl text-white"
                >
                  <div className="text-[10px] font-semibold text-[#B9F6CA]">
                    Mobile Viewport
                  </div>
                  <div className="font-display font-bold text-xs mt-1 leading-snug">
                    Tailored UI across every device
                  </div>
                  <div className="mt-2.5 h-1.5 w-full rounded-full bg-white/15 overflow-hidden">
                    <motion.div
                      initial={{ width: '25%' }}
                      animate={{ width: '80%' }}
                      transition={{ duration: 1.1, delay: 0.4, ease: EASE_AGENCY }}
                      className="h-full bg-[#B9F6CA] rounded-full"
                    />
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>

          {/* Smooth Scroll-Down Indicator */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.55, ease: EASE_AGENCY }}
            className="mt-10 lg:mt-12 flex justify-center"
          >
            <button
              type="button"
              onClick={handleScrollToServices}
              aria-label="Scroll to services section"
              className="group inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold text-[#101B16]/65 hover:text-[#101B16] hover:bg-[#F4F6F4] transition-colors cursor-pointer"
            >
              <span>Scroll to explore</span>
              <motion.span
                animate={prefersReduced ? undefined : { y: [0, 4, 0] }}
                transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
                className="inline-flex"
              >
                <ArrowDown className="w-3.5 h-3.5" aria-hidden="true" />
              </motion.span>
            </button>
          </motion.div>
        </div>
      </section>

      {/* 2. SERVICES SECTION (Soft Gray #F4F6F4 — Visual 3D Tilt Cards) */}
      <section
        ref={servicesSectionRef}
        className="py-16 lg:py-24 bg-[#F4F6F4] border-b border-[#101B16]/10"
      >
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <Reveal direction="up" className="max-w-2xl">
              <p className="text-xs font-bold uppercase tracking-wider text-[#101B16]/65 mb-2">
                <LetterReveal text="Our Services" />
              </p>
              <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-[#101B16] tracking-tight text-balance">
                <LetterReveal text="Focused digital capabilities built around business growth." />
              </h2>
            </Reveal>

            <Reveal direction="left" delay={0.08}>
              <MagneticButton
                type="button"
                onClick={() => onNavigate('services')}
                className="group inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold text-[#101B16] hover:bg-white transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                <span>All Services</span>
                <ArrowRight
                  className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1"
                  aria-hidden="true"
                />
              </MagneticButton>
            </Reveal>
          </div>

          <RevealStagger className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {SERVICES.map((service) => (
              <RevealItem key={service.id}>
                <TiltCard
                  maxTilt={6}
                  liftY={-6}
                  className="group h-full bg-white rounded-2xl border border-[#101B16]/8 hover:border-[#101B16]/25 p-4 sm:p-5 shadow-[0_4px_20px_rgba(16,27,22,0.04)] hover:shadow-[0_18px_36px_rgba(16,27,22,0.1)] transition-[border-color,box-shadow] duration-300"
                >
                  <div>
                    {/* Visual Header with Smooth Zoom & Icon Overlay */}
                    <div className="relative aspect-[16/10] w-full rounded-xl overflow-hidden bg-[#101B16] mb-4">
                      <ImageWithFallback
                        src={service.image}
                        alt={`${service.title} visual showcase by FSD Web Studio`}
                        fallbackTitle={service.title}
                        className="w-full h-full object-cover transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105"
                      />
                      <div
                        aria-hidden="true"
                        className="absolute inset-0 bg-gradient-to-t from-[#101B16]/75 via-[#101B16]/15 to-transparent"
                      />
                      <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between gap-2">
                        <div className="w-9 h-9 rounded-lg bg-[#101B16]/90 text-[#B9F6CA] border border-[#B9F6CA]/30 flex items-center justify-center group-hover:bg-[#B9F6CA] group-hover:text-[#101B16] group-hover:scale-105 transition-all duration-300 ease-out">
                          <ServiceIcon name={service.iconName} className="w-4 h-4" />
                        </div>
                        <span className="font-mono text-xs font-semibold text-white/90 tabular-nums drop-shadow-sm">
                          {service.index}
                        </span>
                      </div>
                    </div>

                    <h3 className="font-display font-bold text-lg text-[#101B16] transition-transform duration-200 group-hover:translate-x-0.5">
                      <LetterReveal text={service.title} />
                    </h3>

                    <p className="mt-2 text-sm text-[#101B16]/70 leading-relaxed">
                      <LetterReveal text={service.description} />
                    </p>
                  </div>

                  <div className="mt-5 pt-4 border-t border-[#101B16]/8">
                    <button
                      type="button"
                      onClick={() => onNavigate('contact', service.title)}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-[#101B16] link-underline whitespace-nowrap cursor-pointer"
                    >
                      <span>Inquire Now</span>
                      <ArrowRight
                        className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-1"
                        aria-hidden="true"
                      />
                    </button>
                  </div>
                </TiltCard>
              </RevealItem>
            ))}
          </RevealStagger>
        </div>
      </section>

      {/* 3. ABOUT STUDIO INTRO (Deep Forest Green #101B16 with Studio Photography) */}
      <section className="relative overflow-hidden py-16 lg:py-24 bg-[#101B16] text-white">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          <ImageWithFallback
            src={STUDIO_IMAGES.ctaBackdrop}
            alt=""
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-[#101B16]/95 via-[#101B16]/88 to-[#0b1410]/95" />
        </div>

        <motion.div
          aria-hidden="true"
          animate={
            prefersReduced
              ? undefined
              : { x: [0, 30, 0], y: [0, -20, 0] }
          }
          transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut' }}
          className="pointer-events-none absolute -top-24 right-0 w-96 h-96 rounded-full bg-[#B9F6CA]/10 blur-3xl"
        />

        <div className="relative max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            <Reveal direction="right" className="lg:col-span-6 space-y-5">
              <p className="text-xs font-bold uppercase tracking-wider text-[#B9F6CA]">
                <LetterReveal text="About FSD Web Studio" />
              </p>
              <h2 className="font-display font-extrabold text-3xl sm:text-4xl lg:text-5xl tracking-tight leading-[1.1] text-balance">
                <LetterReveal text={ABOUT_CONTENT.title} />
              </h2>
              <p className="text-base text-white/80 leading-relaxed">
                <LetterReveal text={ABOUT_CONTENT.whoWeAre} />
              </p>
              <div className="pt-2">
                <MagneticButton
                  type="button"
                  onClick={() => onNavigate('about')}
                  className="group inline-flex items-center gap-2 px-6 py-3 text-sm font-bold text-[#101B16] bg-[#B9F6CA] hover:bg-[#9ef0b5] rounded-full shadow-sm hover:shadow-[0_10px_24px_rgba(185,246,202,0.3)] transition-all duration-200 whitespace-nowrap cursor-pointer"
                >
                  <LetterReveal text="About Our Studio" />
                  <ArrowRight
                    className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1"
                    aria-hidden="true"
                  />
                </MagneticButton>
              </div>
            </Reveal>

            <div className="lg:col-span-6 space-y-5">
              <Reveal direction="left">
                <motion.div
                  whileHover={isFine ? { scale: 1.015 } : undefined}
                  transition={{ duration: 0.3, ease: EASE_AGENCY }}
                  className="group relative aspect-[16/9] w-full rounded-2xl overflow-hidden border border-white/15 bg-[#0b1410] shadow-xl"
                >
                  <ImageWithFallback
                    src={STUDIO_IMAGES.aboutWorkspace}
                    alt="Minimalist architectural studio workspace at FSD Web Studio"
                    fallbackTitle="FSD Web Studio Workspace"
                    className="w-full h-full object-cover transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105"
                  />
                  <div
                    aria-hidden="true"
                    className="absolute inset-0 bg-gradient-to-t from-[#101B16]/80 via-[#101B16]/20 to-transparent"
                  />
                  <div className="absolute bottom-4 left-5 right-5 flex items-center justify-between gap-3">
                    <span className="font-display font-bold text-sm text-white">
                      Design &amp; Engineering Studio
                    </span>
                    <span className="text-xs font-semibold text-[#B9F6CA]">
                      Built for Lasting Clarity
                    </span>
                  </div>
                </motion.div>
              </Reveal>

              <RevealStagger
                stagger={0.1}
                className="grid grid-cols-1 sm:grid-cols-2 gap-5"
              >
                <RevealItem direction="left">
                  <motion.div
                    whileHover={isFine ? { y: -4 } : undefined}
                    transition={{ duration: 0.22, ease: EASE_AGENCY }}
                    className="h-full p-6 rounded-2xl bg-white/5 hover:bg-white/[0.08] border border-white/10 hover:border-[#B9F6CA]/35 space-y-2.5 transition-colors duration-200"
                  >
                    <h3 className="font-display font-bold text-lg text-[#B9F6CA]">
                      <LetterReveal text="Our Mission" />
                    </h3>
                    <p className="text-sm text-white/75 leading-relaxed">
                      <LetterReveal text={ABOUT_CONTENT.mission} />
                    </p>
                  </motion.div>
                </RevealItem>

                <RevealItem direction="left">
                  <motion.div
                    whileHover={isFine ? { y: -4 } : undefined}
                    transition={{ duration: 0.22, ease: EASE_AGENCY }}
                    className="h-full p-6 rounded-2xl bg-white/5 hover:bg-white/[0.08] border border-white/10 hover:border-[#B9F6CA]/35 space-y-2.5 transition-colors duration-200"
                  >
                    <h3 className="font-display font-bold text-lg text-[#B9F6CA]">
                      <LetterReveal text="Our Vision" />
                    </h3>
                    <p className="text-sm text-white/75 leading-relaxed">
                      <LetterReveal text={ABOUT_CONTENT.vision} />
                    </p>
                  </motion.div>
                </RevealItem>
              </RevealStagger>
            </div>
          </div>
        </div>
      </section>

      {/* 4. FEATURED PORTFOLIO SHOWCASE (Soft Gray #F4F6F4 — 3D Layered Perspective Stack) */}
      <PortfolioShowcase
        projects={projects}
        isLoading={isLoadingProjects}
        isModalBlockingKeys={isModalOpen}
        variant="gray"
        onOpenProject={onOpenProject}
        onAddProject={onAddProject}
        onUpdateProject={onUpdateProject}
        onDeleteProject={onDeleteProject}
        onResetProjects={onResetProjects}
      />

      {/* 5. OUR PROCESS (Deep Forest Green #101B16 with Stage Photography) */}
      <section className="relative overflow-hidden py-16 lg:py-24 bg-[#101B16] text-white">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          <ImageWithFallback
            src={STUDIO_IMAGES.ctaBackdrop}
            alt=""
            className="w-full h-full object-cover opacity-15"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#101B16]/95 via-[#101B16]/90 to-[#101B16]/95" />
        </div>

        <motion.div
          aria-hidden="true"
          animate={
            prefersReduced
              ? undefined
              : { x: [0, -24, 0], y: [0, 18, 0] }
          }
          transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
          className="pointer-events-none absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-[#B9F6CA]/10 blur-3xl"
        />

        <div className="relative max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal direction="up" className="max-w-2xl mb-12">
            <p className="text-xs font-bold uppercase tracking-wider text-[#B9F6CA] mb-2">
              <LetterReveal text="Our Process" />
            </p>
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl tracking-tight text-balance">
              <LetterReveal text="Four clear stages from idea to live launch." />
            </h2>
          </Reveal>

          <RevealStagger stagger={0.08} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {PROCESS_STEPS.map((step) => (
              <RevealItem key={step.number}>
                <motion.div
                  whileHover={isFine ? { y: -5 } : undefined}
                  transition={{ duration: 0.22, ease: EASE_AGENCY }}
                  className="group h-full rounded-2xl bg-white/5 hover:bg-white/[0.08] border border-white/10 hover:border-[#B9F6CA]/35 p-4 sm:p-5 flex flex-col justify-between transition-colors duration-200"
                >
                  <div>
                    <div className="relative aspect-[16/9] w-full rounded-xl overflow-hidden bg-[#0b1410] mb-4 border border-white/10">
                      <ImageWithFallback
                        src={step.image}
                        alt={`${step.title} stage at FSD Web Studio`}
                        fallbackTitle={step.title}
                        className="w-full h-full object-cover transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105"
                      />
                      <div
                        aria-hidden="true"
                        className="absolute inset-0 bg-gradient-to-t from-[#101B16]/80 via-[#101B16]/20 to-transparent"
                      />
                      <div className="absolute bottom-2 left-3 font-display font-extrabold text-2xl text-[#B9F6CA] tabular-nums drop-shadow-sm transition-transform duration-200 group-hover:translate-x-1">
                        {step.number}
                      </div>
                    </div>

                    <h3 className="font-display font-bold text-xl text-white">
                      <LetterReveal text={step.title} />
                    </h3>
                    <p className="mt-2 text-sm text-white/75 leading-relaxed">
                      <LetterReveal text={step.description} />
                    </p>
                  </div>

                  <div className="mt-5 pt-4 border-t border-white/10 text-xs font-semibold text-[#B9F6CA]">
                    <LetterReveal text={step.output} />
                  </div>
                </motion.div>
              </RevealItem>
            ))}
          </RevealStagger>
        </div>
      </section>

      {/* 6. WHY CHOOSE US (Soft Gray #F4F6F4 with Editorial Thumbnails) */}
      <section className="py-16 lg:py-24 bg-[#F4F6F4] border-b border-[#101B16]/10">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal direction="up" className="max-w-2xl mb-12">
            <p className="text-xs font-bold uppercase tracking-wider text-[#101B16]/65 mb-2">
              <LetterReveal text="Why Choose Us" />
            </p>
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-[#101B16] tracking-tight text-balance">
              <LetterReveal text="Built on clear craft, speed, and direct partnership." />
            </h2>
          </Reveal>

          <RevealStagger stagger={0.06} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {WHY_CHOOSE_US.map((item) => (
              <RevealItem key={item.title}>
                <motion.div
                  whileHover={isFine ? { y: -4 } : undefined}
                  transition={{ duration: 0.22, ease: EASE_AGENCY }}
                  className="group h-full bg-white rounded-2xl border border-[#101B16]/8 hover:border-[#101B16]/20 p-5 sm:p-6 shadow-[0_4px_18px_rgba(16,27,22,0.03)] hover:shadow-[0_14px_30px_rgba(16,27,22,0.07)] transition-[border-color,box-shadow] duration-200"
                >
                  <div className="relative aspect-[16/9] w-full rounded-xl overflow-hidden bg-[#101B16] mb-5">
                    <ImageWithFallback
                      src={item.image}
                      alt={`${item.title} — FSD Web Studio advantage`}
                      fallbackTitle={item.title}
                      className="w-full h-full object-cover transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105"
                    />
                    <div
                      aria-hidden="true"
                      className="absolute inset-0 bg-gradient-to-t from-[#101B16]/65 via-transparent to-transparent"
                    />
                    <div className="absolute bottom-2.5 left-2.5 w-10 h-10 rounded-xl bg-[#B9F6CA] text-[#101B16] flex items-center justify-center shadow-sm transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6">
                      <ReasonIcon name={item.iconName} className="w-5 h-5" />
                    </div>
                  </div>
                  <h3 className="font-display font-bold text-lg text-[#101B16]">
                    <LetterReveal text={item.title} />
                  </h3>
                  <p className="mt-2 text-sm text-[#101B16]/70 leading-relaxed">
                    <LetterReveal text={item.description} />
                  </p>
                </motion.div>
              </RevealItem>
            ))}
          </RevealStagger>
        </div>
      </section>

      {/* 7. WELCOME TO THE TEAM + MEET OUR TEAM */}
      <WelcomeTeamSection />
      <TeamSection
        members={teamMembers}
        isLoading={isLoadingTeam}
        adminMembers={adminMembers}
        isLoadingAdminMembers={isLoadingAdminMembers}
        adminToken={adminToken}
        adminStatus={adminStatus}
        onRefreshAdminStatus={onRefreshAdminStatus}
        onClaimAdmin={onClaimAdmin}
        onLoginAdmin={onLoginAdmin}
        onLogoutAdmin={onLogoutAdmin}
        onAddMember={onAddTeamMember}
        onUpdateMember={onUpdateTeamMember}
        onDeleteMember={onDeleteTeamMember}
        onToggleVisibility={onToggleTeamVisibility}
        onReorderMembers={onReorderTeam}
        onResetDefault={onResetTeam}
        variant="light"
      />

      {/* 8. TESTIMONIALS (Soft Gray #F4F6F4 — Visual Category Context + Clearly Labeled Samples) */}
      <section className="py-16 lg:py-24 bg-[#F4F6F4] border-b border-[#101B16]/10">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
            <Reveal direction="up" className="max-w-2xl">
              <p className="text-xs font-bold uppercase tracking-wider text-[#101B16]/65 mb-2">
                <LetterReveal text="Testimonials" />
              </p>
              <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-[#101B16] tracking-tight text-balance">
                <LetterReveal text="Client feedback showcase." />
              </h2>
            </Reveal>
            <Reveal direction="left" delay={0.08}>
              <p className="text-xs text-[#101B16]/60 max-w-sm">
                <LetterReveal text="Sample preview cards shown below. Verified client reviews are published upon project completion." />
              </p>
            </Reveal>
          </div>

          <RevealStagger stagger={0.08} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {SAMPLE_TESTIMONIALS.map((item) => (
              <RevealItem key={item.id}>
                <motion.blockquote
                  whileHover={isFine ? { y: -4 } : undefined}
                  transition={{ duration: 0.22, ease: EASE_AGENCY }}
                  className="group h-full rounded-2xl bg-white border border-[#101B16]/8 hover:border-[#101B16]/20 p-5 sm:p-6 flex flex-col justify-between shadow-[0_4px_18px_rgba(16,27,22,0.03)] hover:shadow-[0_14px_30px_rgba(16,27,22,0.07)] transition-[border-color,box-shadow] duration-200"
                >
                  <div>
                    <div className="relative aspect-[16/9] w-full rounded-xl overflow-hidden bg-[#101B16] mb-5">
                      <ImageWithFallback
                        src={item.image}
                        alt={`${item.projectCategory} project showcase preview`}
                        fallbackTitle={item.projectCategory}
                        className="w-full h-full object-cover transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105"
                      />
                      <div
                        aria-hidden="true"
                        className="absolute inset-0 bg-gradient-to-t from-[#101B16]/75 via-[#101B16]/15 to-transparent"
                      />
                      <p className="absolute bottom-2.5 left-3 right-3 text-xs font-semibold text-white">
                        <LetterReveal text={`${item.projectCategory} · Sample Preview`} />
                      </p>
                    </div>

                    <p className="text-xs font-semibold text-[#101B16]/55 mb-2.5">
                      <LetterReveal text={item.label} />
                    </p>
                    <p className="text-sm sm:text-base text-[#101B16] font-medium leading-relaxed">
                      <LetterReveal text={`“${item.quote}”`} />
                    </p>
                  </div>

                  <footer className="mt-6 pt-4 border-t border-[#101B16]/10">
                    <div className="font-display font-bold text-sm text-[#101B16]">
                      <LetterReveal text={item.authorPlaceholder} />
                    </div>
                    <div className="text-xs text-[#101B16]/65 mt-0.5">
                      <LetterReveal text={item.rolePlaceholder} />
                    </div>
                  </footer>
                </motion.blockquote>
              </RevealItem>
            ))}
          </RevealStagger>
        </div>
      </section>

      {/* 9. FINAL CTA (Deep Forest Green #101B16 with Architectural Background) */}
      <section className="relative overflow-hidden py-16 lg:py-24 bg-[#101B16] text-white">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          <ImageWithFallback
            src={STUDIO_IMAGES.ctaBackdrop}
            alt=""
            className="w-full h-full object-cover opacity-35"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#101B16]/94 via-[#101B16]/86 to-[#101B16]/78" />
        </div>

        <motion.div
          aria-hidden="true"
          animate={
            prefersReduced
              ? undefined
              : { scale: [1, 1.12, 1], opacity: [0.12, 0.22, 0.12] }
          }
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
          className="pointer-events-none absolute -top-24 right-1/4 w-96 h-96 rounded-full bg-[#B9F6CA]/20 blur-3xl"
        />

        <div className="relative max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <Reveal direction="right" className="lg:col-span-8">
              <p className="text-xs font-bold uppercase tracking-wider text-[#B9F6CA] mb-3">
                <LetterReveal text="Let's Talk" />
              </p>
              <h2 className="font-display font-extrabold text-3xl sm:text-4xl lg:text-5xl tracking-tight text-balance">
                <LetterReveal text="Ready to turn your next idea into a high-performing digital product?" />
              </h2>
              <p className="mt-4 text-base text-white/80 leading-relaxed max-w-2xl">
                <LetterReveal text="Tell us what you are building or start a direct WhatsApp conversation with FSD Web Studio." />
              </p>
            </Reveal>

            <Reveal
              direction="left"
              delay={0.1}
              className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-3"
            >
              <MagneticButton
                type="button"
                onClick={() => onNavigate('contact')}
                className="group inline-flex items-center justify-center gap-2 px-6 py-4 text-sm font-bold text-[#101B16] bg-[#B9F6CA] hover:bg-[#9ef0b5] rounded-full shadow-sm hover:shadow-[0_10px_28px_rgba(185,246,202,0.38)] transition-all duration-200 whitespace-nowrap cursor-pointer"
              >
                <LetterReveal text="Start a Project" />
                <ArrowRight
                  className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1"
                  aria-hidden="true"
                />
              </MagneticButton>

              <MagneticLink
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center justify-center gap-2 px-6 py-4 text-sm font-bold text-white bg-white/10 hover:bg-white/15 border border-white/15 hover:border-[#B9F6CA]/45 rounded-full transition-colors whitespace-nowrap"
              >
                <MessageCircle
                  className="w-4 h-4 text-[#B9F6CA] transition-transform duration-200 group-hover:scale-110"
                  aria-hidden="true"
                />
                <LetterReveal text="Chat on WhatsApp" />
              </MagneticLink>
            </Reveal>
          </div>
        </div>
      </section>
    </div>
  );
};
