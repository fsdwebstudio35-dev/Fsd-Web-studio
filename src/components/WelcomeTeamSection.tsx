import React from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { STUDIO_CONFIG } from '../config/studioConfig';
import { ImageWithFallback } from './ImageWithFallback';
import { EASE_AGENCY, LetterReveal, useIsFinePointer } from './MotionSystem';

interface WelcomeMember {
  id: string;
  name: string;
  designation: string;
  portrait: string;
  isTransparentCutout?: boolean;
  zClass: string;
  scaleClass: string;
}

const WELCOME_MEMBERS: WelcomeMember[] = [
  {
    id: 'm-ahtasham',
    name: 'M. Ahtasham',
    designation: 'DEVELOPMENT',
    portrait: '/src/assets/images/team_portrait_ranjeet_1795693182976.jpg',
    zClass: 'z-10 hover:z-40',
    scaleClass: 'lg:scale-[1.03]',
  },
  {
    id: 'm-abdullah',
    name: 'M.Abdullah',
    designation: 'GRAPHIC DESIGNER (INTERN) / DEVELOPMENT',
    portrait: '/src/assets/images/team_portrait_abdullah_custom.png',
    isTransparentCutout: true,
    zClass: 'z-20 hover:z-40',
    scaleClass: 'lg:scale-[1.06]',
  },
  {
    id: 'mushahid-hussain',
    name: 'Mushahid Hussain',
    designation: 'FULL STACK WEB DEVELOPMENT / CLAUDE ENGINEERING',
    portrait: '/src/assets/images/team_portrait_mushahid_custom.png',
    isTransparentCutout: true,
    zClass: 'z-30 hover:z-40',
    scaleClass: 'lg:scale-[1.1]',
  },
  {
    id: 'm-asad',
    name: 'M.Asad',
    designation: 'UI/UX DESIGNER / DEVELOPMENT',
    portrait: '/src/assets/images/team_portrait_asad_1795694124136.jpg',
    zClass: 'z-20 hover:z-40',
    scaleClass: 'lg:scale-[1.06]',
  },
  {
    id: 'm-bilal',
    name: 'M.Bilal',
    designation: 'DIGITAL MARKETING SPECIALIST',
    portrait: '/src/assets/images/team_portrait_bilal_1795694374743.jpg',
    zClass: 'z-10 hover:z-40',
    scaleClass: 'lg:scale-[1.03]',
  },
];

const PORTRAIT_CUTOUT_MASK: React.CSSProperties = {
  WebkitMaskImage:
    'radial-gradient(ellipse 74% 92% at 50% 56%, rgba(0,0,0,1) 55%, rgba(0,0,0,0.88) 70%, rgba(0,0,0,0) 94%)',
  maskImage:
    'radial-gradient(ellipse 74% 92% at 50% 56%, rgba(0,0,0,1) 55%, rgba(0,0,0,0.88) 70%, rgba(0,0,0,0) 94%)',
};

const TRANSPARENT_PNG_MASK: React.CSSProperties = {
  WebkitMaskImage:
    'linear-gradient(to bottom, rgba(0,0,0,1) 76%, rgba(0,0,0,0.85) 88%, rgba(0,0,0,0) 100%)',
  maskImage:
    'linear-gradient(to bottom, rgba(0,0,0,1) 76%, rgba(0,0,0,0.85) 88%, rgba(0,0,0,0) 100%)',
};

export const WelcomeTeamSection: React.FC = () => {
  const prefersReduced = useReducedMotion();
  const isFine = useIsFinePointer();

  return (
    <section
      aria-label="Welcome to the Team"
      className="relative w-full overflow-hidden border-b border-[#5B21B6]/20 bg-gradient-to-b from-white via-[#F3EAFF] via-35% to-[#6D28D9]"
    >
      {/* Subtle Ambient Light Glows & Glass-Like Reflections */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <motion.div
          animate={
            prefersReduced
              ? undefined
              : { scale: [1, 1.08, 1], opacity: [0.38, 0.54, 0.38] }
          }
          transition={{ duration: 11, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -top-24 left-1/2 -translate-x-1/2 w-[780px] h-[340px] rounded-full bg-[#C084FC]/30 blur-3xl"
        />
        <div className="absolute bottom-12 left-1/4 w-96 h-72 rounded-full bg-[#A855F7]/35 blur-3xl" />
        <div className="absolute bottom-8 right-1/4 w-96 h-72 rounded-full bg-[#7C3AED]/40 blur-3xl" />
        {/* Subtle Glass Sheen Bar */}
        <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-white/90 to-transparent" />
      </div>

      <div className="relative max-w-[1380px] mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-10 lg:pt-12">
        {/* Top Bar: Small Company Logo at Top-Left */}
        <motion.div
          initial={prefersReduced ? false : { opacity: 0, x: -12 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.45, ease: EASE_AGENCY }}
          className="flex items-center justify-between gap-4 mb-6 sm:mb-4 lg:mb-0"
        >
          <div className="inline-flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-white/75 backdrop-blur-md border border-[#7C3AED]/15 shadow-[0_6px_22px_rgba(91,33,182,0.08)]">
            <svg
              width="24"
              height="24"
              viewBox="0 0 32 32"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
              className="shrink-0"
            >
              <rect width="32" height="32" rx="8" fill="#4C1D95" />
              <path
                d="M8.5 9.5H23.5V13H12.5V15H20.5V18.5H12.5V23H8.5V9.5Z"
                fill="#FFFFFF"
              />
              <rect x="19.5" y="18.5" width="4" height="4.5" rx="1" fill="#E9D5FF" />
            </svg>
            <span className="font-display font-bold text-xs sm:text-sm tracking-tight text-[#2E1065] whitespace-nowrap">
              <LetterReveal text={STUDIO_CONFIG.brandName} stagger={0.018} />
            </span>
          </div>
        </motion.div>

        {/* Top-Center Bold Welcome Heading */}
        <div className="text-center max-w-3xl mx-auto pt-2 pb-10 sm:pb-12 lg:pb-14">
          <h2 className="font-display font-extrabold tracking-tight leading-[0.95] text-balance select-none">
            <motion.span
              initial={prefersReduced ? false : { opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.55, ease: EASE_AGENCY }}
              className="block text-4xl sm:text-6xl lg:text-[4.25rem] text-[#3B0764] tracking-[0.04em]"
            >
              <LetterReveal text="WELCOME" stagger={0.035} />
            </motion.span>
            <motion.span
              initial={prefersReduced ? false : { opacity: 0, y: 26 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.6, delay: 0.1, ease: EASE_AGENCY }}
              className="block mt-1 text-4xl sm:text-6xl lg:text-[4.5rem] drop-shadow-[0_6px_18px_rgba(124,58,237,0.18)]"
            >
              <LetterReveal
                text="TO THE TEAM!"
                delay={0.14}
                stagger={0.032}
                letterClassName="bg-gradient-to-r from-[#5B21B6] via-[#7C3AED] to-[#9333EA] bg-clip-text text-transparent"
              />
            </motion.span>
          </h2>
        </div>

        {/* 5 Team Member Columns with Animated Vertical Dividers & Layered Overlapping Portraits */}
        <div className="relative grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 items-stretch pt-2">
          {WELCOME_MEMBERS.map((member, index) => {
            const hasDivider = index < WELCOME_MEMBERS.length - 1;
            return (
              <div
                key={member.id}
                className={`group relative flex flex-col justify-between items-center text-center min-h-[395px] sm:min-h-[430px] lg:min-h-[485px] pt-4 ${member.zClass}`}
              >
                {/* Animated Vertical Divider (Desktop 5-Column Grid) */}
                {hasDivider && (
                  <motion.span
                    aria-hidden="true"
                    initial={prefersReduced ? false : { scaleY: 0, opacity: 0 }}
                    whileInView={{ scaleY: 1, opacity: 1 }}
                    viewport={{ once: true, amount: 0.15 }}
                    transition={{
                      duration: 0.65,
                      delay: 0.12 + index * 0.07,
                      ease: EASE_AGENCY,
                    }}
                    style={{ transformOrigin: 'top center' }}
                    className="hidden lg:block pointer-events-none absolute top-0 bottom-0 right-0 w-px bg-gradient-to-b from-[#7C3AED]/15 via-[#6D28D9]/40 to-white/25 z-30"
                  />
                )}

                {/* Glassmorphic Header Block: Member Name & Designation */}
                <motion.div
                  initial={prefersReduced ? false : { opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.25 }}
                  transition={{
                    duration: 0.5,
                    delay: 0.14 + index * 0.08,
                    ease: EASE_AGENCY,
                  }}
                  className="relative z-40 px-2.5 sm:px-3.5 w-full max-w-[255px]"
                >
                  <div className="min-h-[92px] flex flex-col justify-center rounded-2xl bg-white/65 backdrop-blur-md border border-white/80 shadow-[0_8px_24px_rgba(91,33,182,0.08)] px-3.5 py-3 transition-all duration-300 group-hover:bg-white/85 group-hover:border-[#A855F7]/35 group-hover:-translate-y-1">
                    <h3 className="font-display font-extrabold text-base sm:text-lg tracking-wide text-[#2E1065] leading-tight">
                      <LetterReveal text={member.name} delay={0.1 + index * 0.05} />
                    </h3>
                    <p className="mt-1.5 text-[10px] font-bold tracking-[0.09em] text-[#6D28D9] leading-snug">
                      <LetterReveal text={member.designation} delay={0.16 + index * 0.05} />
                    </p>
                  </div>
                </motion.div>

                {/* Soft Spotlight Glow Behind Portrait */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute bottom-10 left-1/2 -translate-x-1/2 w-56 h-56 rounded-full bg-white/30 blur-2xl opacity-75 group-hover:opacity-100 transition-opacity duration-300"
                />

                {/* Bottom-Anchored Layered Overlapping Portrait Cutout */}
                <motion.div
                  initial={prefersReduced ? false : { opacity: 0, y: 42, scale: 0.95 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true, amount: 0.15 }}
                  transition={{
                    duration: 0.65,
                    delay: 0.2 + index * 0.09,
                    ease: EASE_AGENCY,
                  }}
                  whileHover={isFine ? { y: -6, scale: 1.04 } : undefined}
                  className={`relative mt-auto w-[92%] sm:w-[104%] lg:w-[122%] lg:-mx-[11%] aspect-[3/4] max-h-[340px] lg:max-h-[375px] origin-bottom transition-transform duration-300 ${member.scaleClass}`}
                >
                  <div
                    className="w-full h-full overflow-hidden"
                    style={
                      member.isTransparentCutout
                        ? TRANSPARENT_PNG_MASK
                        : PORTRAIT_CUTOUT_MASK
                    }
                  >
                    <ImageWithFallback
                      src={member.portrait}
                      alt={`${member.name} — ${member.designation}`}
                      fallbackTitle={member.name}
                      fallbackSubtitle={member.designation}
                      className={`w-full h-full transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105 ${
                        member.isTransparentCutout
                          ? 'object-contain object-bottom'
                          : 'object-cover object-top'
                      }`}
                    />
                  </div>
                </motion.div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Deep Dark Purple Bottom Gradient for Rich Layered Depth */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-28 sm:h-32 lg:h-36 bg-gradient-to-t from-[#1A0536] via-[#3B0764]/75 to-transparent z-40"
      />
    </section>
  );
};
