import React from 'react';
import { ArrowUp, ArrowUpRight, Mail, MessageCircle } from 'lucide-react';
import { motion } from 'motion/react';
import { buildWhatsAppUrl, STUDIO_CONFIG } from '../config/studioConfig';
import { SERVICES, STUDIO_IMAGES } from '../data/studioData';
import { PageId } from '../types';
import { ImageWithFallback } from './ImageWithFallback';
import { EASE_AGENCY, LetterReveal, MagneticButton, Reveal, RevealItem, RevealStagger } from './MotionSystem';

interface FooterProps {
  onNavigate: (page: PageId, preselectedService?: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const whatsappUrl = buildWhatsAppUrl(
    'Hello FSD Web Studio, I would like to discuss a new digital project.'
  );

  const handleBackToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative overflow-hidden bg-[#101B16] text-white border-t border-white/10">
      {/* Subtle architectural background texture with high-contrast scrim */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <ImageWithFallback
          src={STUDIO_IMAGES.ctaBackdrop}
          alt=""
          className="w-full h-full object-cover opacity-15"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#101B16]/96 via-[#101B16]/92 to-[#101B16]/95" />
      </div>

      {/* Subtle ambient background highlight */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-32 -right-24 w-96 h-96 rounded-full bg-[#B9F6CA]/8 blur-3xl"
      />

      <div className="relative max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-14 lg:py-16">
        <RevealStagger className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8">
          {/* Brand + Tagline + Contact */}
          <RevealItem className="lg:col-span-4 space-y-4">
            <motion.button
              type="button"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onNavigate('home')}
              className="group inline-flex items-center gap-2.5 text-left cursor-pointer"
            >
              <svg
                width="28"
                height="28"
                viewBox="0 0 32 32"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
                className="transition-transform duration-300 group-hover:-rotate-3 group-hover:scale-105"
              >
                <rect width="32" height="32" rx="8" fill="#FFFFFF" />
                <path
                  d="M8.5 9.5H23.5V13H12.5V15H20.5V18.5H12.5V23H8.5V9.5Z"
                  fill="#101B16"
                />
                <rect x="19.5" y="18.5" width="4" height="4.5" rx="1" fill="#101B16" />
              </svg>
              <span className="font-display font-bold text-lg tracking-tight text-white">
                <LetterReveal text={STUDIO_CONFIG.brandName} />
              </span>
            </motion.button>

            <p className="text-sm font-semibold text-[#B9F6CA]">
              <LetterReveal text={STUDIO_CONFIG.tagline} />
            </p>

            <p className="text-sm text-white/75 leading-relaxed max-w-sm">
              <LetterReveal text="Minimalist web development, e-commerce, UI/UX design, and custom web applications for startups, small businesses, and global clients." />
            </p>

            <div className="pt-2 space-y-2 text-sm">
              <a
                href={`mailto:${STUDIO_CONFIG.email}`}
                className="group inline-flex items-center gap-2 text-white/90 hover:text-[#B9F6CA] transition-colors"
              >
                <Mail
                  className="w-4 h-4 text-[#B9F6CA] transition-transform duration-200 group-hover:scale-110"
                  aria-hidden="true"
                />
                <span className="link-underline">{STUDIO_CONFIG.email}</span>
              </a>

              <div>
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-2 text-white/90 hover:text-[#B9F6CA] transition-colors"
                >
                  <MessageCircle
                    className="w-4 h-4 text-[#B9F6CA] transition-transform duration-200 group-hover:scale-110"
                    aria-hidden="true"
                  />
                  <span className="link-underline">
                    WhatsApp: {STUDIO_CONFIG.whatsappDisplay}
                  </span>
                  <ArrowUpRight
                    className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    aria-hidden="true"
                  />
                </a>
              </div>
            </div>
          </RevealItem>

          {/* Navigation */}
          <RevealItem className="lg:col-span-2">
            <h3 className="font-display font-bold text-sm text-white mb-4">
              <LetterReveal text="Navigation" />
            </h3>
            <ul className="space-y-2.5 text-sm">
              {(
                [
                  { id: 'home', label: 'Home' },
                  { id: 'about', label: 'About' },
                  { id: 'team', label: 'Our Team' },
                  { id: 'services', label: 'Services' },
                  { id: 'portfolio', label: 'Portfolio' },
                  { id: 'contact', label: 'Contact' },
                ] as { id: PageId; label: string }[]
              ).map((item) => (
                <li key={item.id}>
                  <button
                    type="button"
                    onClick={() => onNavigate(item.id)}
                    className="link-underline text-white/75 hover:text-[#B9F6CA] transition-colors cursor-pointer"
                  >
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </RevealItem>

          {/* Services */}
          <RevealItem className="lg:col-span-4">
            <h3 className="font-display font-bold text-sm text-white mb-4">
              <LetterReveal text="Services" />
            </h3>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2.5 text-sm">
              {SERVICES.map((service) => (
                <li key={service.id}>
                  <button
                    type="button"
                    onClick={() => onNavigate('contact', service.title)}
                    className="link-underline text-white/75 hover:text-[#B9F6CA] transition-colors text-left cursor-pointer"
                  >
                    {service.title}
                  </button>
                </li>
              ))}
            </ul>
          </RevealItem>

          {/* Social Links */}
          <RevealItem className="lg:col-span-2">
            <h3 className="font-display font-bold text-sm text-white mb-4">
              <LetterReveal text="Social Media" />
            </h3>
            <ul className="space-y-2.5 text-sm">
              {STUDIO_CONFIG.socialLinks.map((social) => (
                <li key={social.label}>
                  <motion.a
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ x: 3 }}
                    transition={{ duration: 0.18, ease: EASE_AGENCY }}
                    className="group inline-flex items-center gap-1.5 text-white/75 hover:text-[#B9F6CA] transition-colors"
                  >
                    <span className="link-underline">{social.label}</span>
                    <ArrowUpRight
                      className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                      aria-hidden="true"
                    />
                  </motion.a>
                </li>
              ))}
            </ul>
          </RevealItem>
        </RevealStagger>

        <Reveal
          delay={0.08}
          className="mt-12 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-white/60"
        >
          <p>
            © {new Date().getFullYear()} {STUDIO_CONFIG.brandName}. All rights reserved.
          </p>

          <div className="flex flex-wrap items-center gap-5">
            <p>{STUDIO_CONFIG.tagline}</p>

            <MagneticButton
              type="button"
              onClick={handleBackToTop}
              aria-label="Back to top"
              className="group inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/8 hover:bg-[#B9F6CA] text-white/85 hover:text-[#101B16] border border-white/12 transition-colors cursor-pointer"
            >
              <span>Back to Top</span>
              <ArrowUp
                className="w-3.5 h-3.5 transition-transform duration-200 group-hover:-translate-y-0.5"
                aria-hidden="true"
              />
            </MagneticButton>
          </div>
        </Reveal>
      </div>
    </footer>
  );
};
