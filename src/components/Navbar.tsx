import React, { useState } from 'react';
import { ArrowRight, Menu, X } from 'lucide-react';
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'motion/react';
import { STUDIO_CONFIG } from '../config/studioConfig';
import { PageId } from '../types';
import { EASE_AGENCY, LetterReveal, MagneticButton } from './MotionSystem';

interface NavbarProps {
  currentPage: PageId;
  onNavigate: (page: PageId) => void;
}

const NAV_LINKS: { id: PageId; label: string }[] = [
  { id: 'home', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'team', label: 'Our Team' },
  { id: 'services', label: 'Services' },
  { id: 'portfolio', label: 'Portfolio' },
  { id: 'contact', label: 'Contact' },
];

export const Navbar: React.FC<NavbarProps> = ({ currentPage, onNavigate }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, 'change', (latest) => {
    const next = latest > 18;
    if (next !== scrolled) {
      setScrolled(next);
    }
  });

  const handleSelect = (page: PageId) => {
    onNavigate(page);
    setMobileOpen(false);
  };

  return (
    <header
      className={`sticky top-0 z-40 transition-all duration-300 ${
        scrolled
          ? 'bg-white/95 backdrop-blur-lg border-b border-[#101B16]/12 shadow-[0_8px_30px_rgba(16,27,22,0.06)]'
          : 'bg-white/85 backdrop-blur-md border-b border-[#101B16]/8'
      }`}
    >
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: FSD Logo + Wordmark */}
        <motion.button
          type="button"
          onClick={() => handleSelect('home')}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          transition={{ duration: 0.2, ease: EASE_AGENCY }}
          className="group inline-flex items-center gap-2.5 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#101B16] rounded-sm"
          aria-label="FSD Web Studio Home"
        >
          <motion.svg
            width="28"
            height="28"
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
            className="shrink-0 transition-transform duration-300 ease-out group-hover:rotate-[-4deg] group-hover:scale-105"
          >
            <rect width="32" height="32" rx="8" fill="#101B16" />
            <path d="M8.5 9.5H23.5V13H12.5V15H20.5V18.5H12.5V23H8.5V9.5Z" fill="#FFFFFF" />
            <rect x="19.5" y="18.5" width="4" height="4.5" rx="1" fill="#B9F6CA" />
          </motion.svg>
          <span className="font-display font-bold text-[17px] tracking-tight text-[#101B16] whitespace-nowrap shrink-0">
            <LetterReveal text={STUDIO_CONFIG.brandName} trigger="mount" stagger={0.018} />
          </span>
        </motion.button>

        {/* Zone 2: Single-line navigation links with animated active indicator & hover underline */}
        <nav aria-label="Main navigation" className="hidden md:flex items-center gap-7">
          {NAV_LINKS.map((link) => {
            const isActive = currentPage === link.id;
            return (
              <button
                key={link.id}
                type="button"
                onClick={() => handleSelect(link.id)}
                className={`group relative py-1.5 text-sm font-semibold transition-colors duration-200 whitespace-nowrap shrink-0 cursor-pointer ${
                  isActive
                    ? 'text-[#101B16]'
                    : 'text-[#101B16]/65 hover:text-[#101B16]'
                }`}
              >
                <LetterReveal text={link.label} trigger="mount" stagger={0.022} />

                {/* Hover underline for inactive items */}
                {!isActive && (
                  <span
                    aria-hidden="true"
                    className="absolute left-0 right-0 -bottom-0.5 h-[2px] bg-[#101B16]/40 scale-x-0 group-hover:scale-x-100 transition-transform duration-200 origin-left"
                  />
                )}

                {/* Shared layout active indicator */}
                {isActive && (
                  <motion.span
                    layoutId="navbar-active-indicator"
                    aria-hidden="true"
                    transition={{ type: 'spring', stiffness: 420, damping: 32 }}
                    className="absolute left-0 right-0 -bottom-0.5 h-[2px] bg-[#101B16] rounded-full"
                  />
                )}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Magnetic Let's Talk CTA + Mobile Hamburger */}
        <div className="flex items-center gap-3 shrink-0">
          <MagneticButton
            type="button"
            onClick={() => handleSelect('contact')}
            className="group hidden md:inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-[#101B16] bg-[#B9F6CA] hover:bg-[#9ef0b5] rounded-full border border-[#101B16]/10 shadow-sm hover:shadow-[0_6px_18px_rgba(185,246,202,0.55)] transition-all duration-200 whitespace-nowrap shrink-0 cursor-pointer"
          >
            <LetterReveal text="Let's Talk" trigger="mount" stagger={0.022} />
            <ArrowRight
              className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5"
              aria-hidden="true"
            />
          </MagneticButton>

          <motion.button
            type="button"
            whileTap={{ scale: 0.92 }}
            onClick={() => setMobileOpen((prev) => !prev)}
            className="md:hidden inline-flex items-center justify-center w-11 h-11 rounded-xl text-[#101B16] hover:bg-[#F4F6F4] transition-colors cursor-pointer"
            aria-expanded={mobileOpen}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          >
            <AnimatePresence mode="wait" initial={false}>
              {mobileOpen ? (
                <motion.span
                  key="close"
                  initial={{ opacity: 0, rotate: -45 }}
                  animate={{ opacity: 1, rotate: 0 }}
                  exit={{ opacity: 0, rotate: 45 }}
                  transition={{ duration: 0.16 }}
                >
                  <X className="w-5 h-5" aria-hidden="true" />
                </motion.span>
              ) : (
                <motion.span
                  key="menu"
                  initial={{ opacity: 0, rotate: 45 }}
                  animate={{ opacity: 1, rotate: 0 }}
                  exit={{ opacity: 0, rotate: -45 }}
                  transition={{ duration: 0.16 }}
                >
                  <Menu className="w-5 h-5" aria-hidden="true" />
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        </div>
      </div>

      {/* Animated Mobile Navigation Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.28, ease: EASE_AGENCY }}
            className="md:hidden overflow-hidden border-t border-[#101B16]/10 bg-white/98 backdrop-blur-md"
          >
            <div className="px-4 py-4 space-y-1.5">
              <nav aria-label="Mobile navigation" className="flex flex-col space-y-1">
                {NAV_LINKS.map((link, idx) => {
                  const isActive = currentPage === link.id;
                  return (
                    <motion.button
                      key={link.id}
                      type="button"
                      initial={{ opacity: 0, x: -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{
                        duration: 0.22,
                        delay: idx * 0.035,
                        ease: EASE_AGENCY,
                      }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleSelect(link.id)}
                      className={`w-full min-h-[44px] px-4 py-2.5 text-left text-sm font-semibold rounded-xl transition-colors flex items-center justify-between cursor-pointer ${
                        isActive
                          ? 'bg-[#101B16] text-white'
                          : 'text-[#101B16] hover:bg-[#F4F6F4]'
                      }`}
                    >
                      <span>{link.label}</span>
                      {isActive && (
                        <span className="text-xs font-semibold text-[#B9F6CA]">Active</span>
                      )}
                    </motion.button>
                  );
                })}
              </nav>

              <div className="pt-3 border-t border-[#101B16]/10">
                <motion.button
                  type="button"
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleSelect('contact')}
                  className="w-full min-h-[44px] inline-flex items-center justify-center gap-2 px-5 py-3 text-sm font-bold text-[#101B16] bg-[#B9F6CA] hover:bg-[#9ef0b5] rounded-full transition-colors cursor-pointer"
                >
                  <span>Let&apos;s Talk</span>
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
