import React from 'react';
import { ArrowRight, Check } from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';
import { STUDIO_CONFIG } from '../config/studioConfig';
import { PORTFOLIO_PROJECTS } from '../data/portfolioProjects';
import {
  ABOUT_CONTENT,
  PROCESS_STEPS,
  SERVICES,
  STUDIO_IMAGES,
  WHY_CHOOSE_US,
} from '../data/studioData';
import { PageId } from '../types';
import { ImageWithFallback } from '../components/ImageWithFallback';
import { ReasonIcon } from '../components/ServiceIcon';
import {
  AnimatedCounter,
  EASE_AGENCY,
  LetterReveal,
  MagneticButton,
  Reveal,
  RevealItem,
  RevealStagger,
  useIsFinePointer,
} from '../components/MotionSystem';

interface AboutPageProps {
  onNavigate: (page: PageId, preselectedService?: string) => void;
}

const STUDIO_GALLERY = [
  {
    src: STUDIO_IMAGES.discoveryStudio,
    title: 'Strategy & Architecture',
    caption: 'Wireframes, sitemaps, and clear product planning',
  },
  {
    src: STUDIO_IMAGES.teamCollaboration,
    title: 'Design & Code Craft',
    caption: 'Collaborative sprints with designers and developers',
  },
  {
    src: STUDIO_IMAGES.launchStudio,
    title: 'Performance & Launch',
    caption: 'Responsive testing, SEO readiness, and deployment',
  },
];

export const AboutPage: React.FC<AboutPageProps> = ({ onNavigate }) => {
  const prefersReduced = useReducedMotion();
  const isFine = useIsFinePointer();

  return (
    <div className="bg-white text-[#101B16]">
      {/* Page Intro (White) */}
      <section className="relative overflow-hidden pt-12 pb-14 lg:pt-16 lg:pb-20 border-b border-[#101B16]/10">
        <motion.div
          aria-hidden="true"
          animate={
            prefersReduced
              ? undefined
              : { x: [0, 20, 0], y: [0, -14, 0] }
          }
          transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut' }}
          className="pointer-events-none absolute -top-24 -right-24 w-80 h-80 rounded-full bg-[#B9F6CA]/30 blur-3xl"
        />

        <div className="relative max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            <Reveal direction="right" className="lg:col-span-7">
              <p className="text-xs font-bold uppercase tracking-wider text-[#101B16]/65 mb-3">
                <LetterReveal text={`About ${STUDIO_CONFIG.brandName}`} trigger="mount" />
              </p>
              <h1
                className="font-display font-extrabold text-[#101B16] tracking-tight leading-[1.08] text-balance"
                style={{ fontSize: 'clamp(2.25rem, 4vw, 3.5rem)' }}
              >
                <LetterReveal text={ABOUT_CONTENT.title} trigger="mount" delay={0.05} stagger={0.02} />
              </h1>
              <p className="mt-5 text-base sm:text-lg text-[#101B16]/75 leading-relaxed">
                <LetterReveal text={ABOUT_CONTENT.whoWeAre} trigger="mount" delay={0.22} />
              </p>

              {/* Real Studio Architecture Counts (Factual Only) */}
              <div className="mt-7 grid grid-cols-3 gap-4 max-w-md pt-6 border-t border-[#101B16]/10">
                <div>
                  <div className="font-display font-extrabold text-2xl sm:text-3xl text-[#101B16]">
                    <AnimatedCounter to={SERVICES.length} />
                  </div>
                  <div className="text-xs font-semibold text-[#101B16]/65 mt-0.5">
                    Core Services
                  </div>
                </div>
                <div>
                  <div className="font-display font-extrabold text-2xl sm:text-3xl text-[#101B16]">
                    <AnimatedCounter to={PROCESS_STEPS.length} />
                  </div>
                  <div className="text-xs font-semibold text-[#101B16]/65 mt-0.5">
                    Delivery Stages
                  </div>
                </div>
                <div>
                  <div className="font-display font-extrabold text-2xl sm:text-3xl text-[#101B16]">
                    <AnimatedCounter to={PORTFOLIO_PROJECTS.length} />
                  </div>
                  <div className="text-xs font-semibold text-[#101B16]/65 mt-0.5">
                    Focus Sectors
                  </div>
                </div>
              </div>

              <div className="mt-7 flex flex-wrap gap-3">
                <MagneticButton
                  type="button"
                  onClick={() => onNavigate('contact')}
                  className="group inline-flex items-center gap-2 px-6 py-3.5 text-sm font-bold text-[#101B16] bg-[#B9F6CA] hover:bg-[#9ef0b5] rounded-full border border-[#101B16]/10 shadow-sm hover:shadow-[0_10px_24px_rgba(185,246,202,0.5)] transition-all cursor-pointer"
                >
                  <span>Start a Project</span>
                  <ArrowRight
                    className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1"
                    aria-hidden="true"
                  />
                </MagneticButton>

                <MagneticButton
                  type="button"
                  onClick={() => onNavigate('services')}
                  className="inline-flex items-center gap-2 px-6 py-3.5 text-sm font-bold text-[#101B16] bg-[#F4F6F4] hover:bg-[#101B16] hover:text-white rounded-full transition-colors cursor-pointer"
                >
                  <span>Explore Services</span>
                </MagneticButton>
              </div>
            </Reveal>

            <Reveal direction="left" delay={0.1} className="lg:col-span-5">
              <motion.div
                whileHover={isFine ? { scale: 1.015 } : undefined}
                transition={{ duration: 0.3, ease: EASE_AGENCY }}
                className="group relative aspect-[4/3] w-full rounded-3xl overflow-hidden bg-[#101B16] border border-[#101B16]/10 shadow-lg"
              >
                <ImageWithFallback
                  src={STUDIO_IMAGES.aboutWorkspace}
                  alt="FSD Web Studio minimalist architectural studio workspace"
                  loading="eager"
                  fallbackTitle="FSD Web Studio"
                  fallbackSubtitle={STUDIO_CONFIG.tagline}
                  className="w-full h-full object-cover transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105"
                />
                <div
                  aria-hidden="true"
                  className="absolute inset-0 bg-gradient-to-t from-[#101B16]/75 via-transparent to-transparent"
                />
                <div className="absolute bottom-4 left-5 right-5 flex items-center justify-between gap-2 text-white">
                  <span className="font-display font-bold text-sm">
                    {STUDIO_CONFIG.brandName}
                  </span>
                  <span className="text-xs font-semibold text-[#B9F6CA]">
                    {STUDIO_CONFIG.tagline}
                  </span>
                </div>
              </motion.div>
            </Reveal>
          </div>

          {/* Studio Craft & Culture 3-Column Visual Gallery */}
          <RevealStagger stagger={0.08} className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-5">
            {STUDIO_GALLERY.map((item) => (
              <RevealItem key={item.title}>
                <div className="group relative aspect-[16/10] w-full rounded-2xl overflow-hidden bg-[#101B16] border border-[#101B16]/10 shadow-sm">
                  <ImageWithFallback
                    src={item.src}
                    alt={`${item.title} at FSD Web Studio`}
                    fallbackTitle={item.title}
                    className="w-full h-full object-cover transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105"
                  />
                  <div
                    aria-hidden="true"
                    className="absolute inset-0 bg-gradient-to-t from-[#101B16]/85 via-[#101B16]/25 to-transparent"
                  />
                  <div className="absolute bottom-3.5 left-4 right-4 text-white">
                    <h3 className="font-display font-bold text-sm sm:text-base">
                      <LetterReveal text={item.title} />
                    </h3>
                    <p className="text-xs text-white/80 mt-0.5">
                      <LetterReveal text={item.caption} />
                    </p>
                  </div>
                </div>
              </RevealItem>
            ))}
          </RevealStagger>
        </div>
      </section>

      {/* Mission & Vision (Deep Forest Green #101B16 with Backdrop) */}
      <section className="relative overflow-hidden py-16 lg:py-24 bg-[#101B16] text-white">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          <ImageWithFallback
            src={STUDIO_IMAGES.ctaBackdrop}
            alt=""
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-[#101B16]/94 via-[#101B16]/88 to-[#101B16]/94" />
        </div>

        <motion.div
          aria-hidden="true"
          animate={
            prefersReduced
              ? undefined
              : { scale: [1, 1.15, 1], opacity: [0.1, 0.18, 0.1] }
          }
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
          className="pointer-events-none absolute -bottom-24 right-10 w-80 h-80 rounded-full bg-[#B9F6CA]/20 blur-3xl"
        />

        <div className="relative max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          <RevealStagger stagger={0.1} className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <RevealItem direction="up">
              <motion.div
                whileHover={isFine ? { y: -4 } : undefined}
                transition={{ duration: 0.22, ease: EASE_AGENCY }}
                className="h-full rounded-2xl bg-white/5 hover:bg-white/[0.08] border border-white/10 hover:border-[#B9F6CA]/35 p-8 space-y-3 transition-colors duration-200"
              >
                <p className="text-xs font-bold uppercase tracking-wider text-[#B9F6CA]">
                  <LetterReveal text="Our Mission" />
                </p>
                <h2 className="font-display font-bold text-2xl text-white">
                  <LetterReveal text="Clarity, speed, and purposeful design for every client." />
                </h2>
                <p className="text-sm sm:text-base text-white/75 leading-relaxed">
                  <LetterReveal text={ABOUT_CONTENT.mission} />
                </p>
              </motion.div>
            </RevealItem>

            <RevealItem direction="up">
              <motion.div
                whileHover={isFine ? { y: -4 } : undefined}
                transition={{ duration: 0.22, ease: EASE_AGENCY }}
                className="h-full rounded-2xl bg-white/5 hover:bg-white/[0.08] border border-white/10 hover:border-[#B9F6CA]/35 p-8 space-y-3 transition-colors duration-200"
              >
                <p className="text-xs font-bold uppercase tracking-wider text-[#B9F6CA]">
                  <LetterReveal text="Our Vision" />
                </p>
                <h2 className="font-display font-bold text-2xl text-white">
                  <LetterReveal text="A long-term digital partner for ambitious businesses." />
                </h2>
                <p className="text-sm sm:text-base text-white/75 leading-relaxed">
                  <LetterReveal text={ABOUT_CONTENT.vision} />
                </p>
              </motion.div>
            </RevealItem>
          </RevealStagger>
        </div>
      </section>

      {/* Why Clients Should Work With Us (Soft Gray #F4F6F4) */}
      <section className="py-16 lg:py-24 bg-[#F4F6F4]">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start mb-12">
            <Reveal direction="right" className="lg:col-span-5">
              <p className="text-xs font-bold uppercase tracking-wider text-[#101B16]/65 mb-2">
                <LetterReveal text="Why Clients Work With Us" />
              </p>
              <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-[#101B16] tracking-tight text-balance">
                <LetterReveal text="Engineering discipline paired with clean minimal aesthetics." />
              </h2>
            </Reveal>

            <Reveal direction="left" delay={0.08} className="lg:col-span-7 bg-white rounded-2xl border border-[#101B16]/8 p-6 sm:p-8 shadow-[0_4px_18px_rgba(16,27,22,0.03)]">
              <RevealStagger stagger={0.05} className="space-y-3.5">
                {ABOUT_CONTENT.whyWorkWithUs.map((point) => (
                  <RevealItem key={point} direction="up" distance={12}>
                    <li className="flex items-start gap-3 text-sm sm:text-base text-[#101B16]/85 list-none">
                      <span className="w-6 h-6 rounded-full bg-[#B9F6CA] text-[#101B16] flex items-center justify-center shrink-0 mt-0.5">
                        <Check className="w-3.5 h-3.5" aria-hidden="true" />
                      </span>
                      <LetterReveal text={point} />
                    </li>
                  </RevealItem>
                ))}
              </RevealStagger>
            </Reveal>
          </div>

          <RevealStagger stagger={0.06} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {WHY_CHOOSE_US.map((item) => (
              <RevealItem key={item.title}>
                <motion.div
                  whileHover={isFine ? { y: -4 } : undefined}
                  transition={{ duration: 0.22, ease: EASE_AGENCY }}
                  className="group h-full bg-white rounded-2xl border border-[#101B16]/8 hover:border-[#101B16]/20 p-5 sm:p-6 shadow-[0_4px_18px_rgba(16,27,22,0.03)] hover:shadow-[0_14px_30px_rgba(16,27,22,0.07)] transition-[border-color,box-shadow] duration-200"
                >
                  <div className="relative aspect-[16/9] w-full rounded-xl overflow-hidden bg-[#101B16] mb-4">
                    <ImageWithFallback
                      src={item.image}
                      alt={`${item.title} at FSD Web Studio`}
                      fallbackTitle={item.title}
                      className="w-full h-full object-cover transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105"
                    />
                    <div
                      aria-hidden="true"
                      className="absolute inset-0 bg-gradient-to-t from-[#101B16]/65 via-transparent to-transparent"
                    />
                    <div className="absolute bottom-2.5 left-2.5 w-9 h-9 rounded-xl bg-[#101B16]/90 text-[#B9F6CA] border border-[#B9F6CA]/30 flex items-center justify-center transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6">
                      <ReasonIcon name={item.iconName} className="w-4 h-4" />
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
    </div>
  );
};
