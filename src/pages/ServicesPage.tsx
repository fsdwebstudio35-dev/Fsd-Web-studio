import React from 'react';
import { ArrowRight, Check } from 'lucide-react';
import { SERVICES, STUDIO_IMAGES } from '../data/studioData';
import { PageId } from '../types';
import { ImageWithFallback } from '../components/ImageWithFallback';
import { ServiceIcon } from '../components/ServiceIcon';
import {
  LetterReveal,
  MagneticButton,
  Reveal,
  RevealItem,
  RevealStagger,
  TiltCard,
} from '../components/MotionSystem';

interface ServicesPageProps {
  onNavigate: (page: PageId, preselectedService?: string) => void;
}

export const ServicesPage: React.FC<ServicesPageProps> = ({ onNavigate }) => {
  return (
    <div className="bg-white text-[#101B16]">
      {/* Page Hero */}
      <section className="pt-12 pb-12 lg:pt-16 lg:pb-16 border-b border-[#101B16]/10 bg-white">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
            <Reveal direction="up" className="lg:col-span-7">
              <p className="text-xs font-bold uppercase tracking-wider text-[#101B16]/65 mb-3">
                <LetterReveal text="Our Services" trigger="mount" />
              </p>
              <h1
                className="font-display font-extrabold text-[#101B16] tracking-tight leading-[1.08] text-balance"
                style={{ fontSize: 'clamp(2.25rem, 4vw, 3.5rem)' }}
              >
                <span className="block">
                  <LetterReveal
                    text="Digital services built for small businesses,"
                    trigger="mount"
                    delay={0.04}
                    stagger={0.018}
                  />
                </span>
                <span className="block">
                  <LetterReveal
                    text="startups, and global teams."
                    trigger="mount"
                    delay={0.34}
                    stagger={0.018}
                  />
                </span>
              </h1>
              <p className="mt-5 text-base sm:text-lg text-[#101B16]/75 leading-relaxed max-w-2xl">
                <LetterReveal
                  text="Every project is crafted around clear communication, mobile-first usability, and fast performance. Select any service below to open a tailored inquiry brief."
                  trigger="mount"
                  delay={0.38}
                />
              </p>
            </Reveal>

            <Reveal direction="left" delay={0.08} className="lg:col-span-5">
              <div className="grid grid-cols-2 gap-3.5">
                <div className="group relative aspect-[4/5] rounded-2xl overflow-hidden bg-[#101B16] border border-[#101B16]/10 shadow-md">
                  <ImageWithFallback
                    src={STUDIO_IMAGES.uiuxCraft}
                    alt="UI/UX wireframes and design system craft"
                    loading="eager"
                    fallbackTitle="UI/UX Systems"
                    className="w-full h-full object-cover transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105"
                  />
                  <div
                    aria-hidden="true"
                    className="absolute inset-0 bg-gradient-to-t from-[#101B16]/75 via-transparent to-transparent"
                  />
                  <span className="absolute bottom-3 left-3 text-xs font-bold text-white">
                    UI/UX Craft
                  </span>
                </div>

                <div className="group relative aspect-[4/5] rounded-2xl overflow-hidden bg-[#101B16] border border-[#101B16]/10 shadow-md mt-4">
                  <ImageWithFallback
                    src={STUDIO_IMAGES.responsiveCraft}
                    alt="Responsive desktop and tablet web interface craft"
                    loading="eager"
                    fallbackTitle="Responsive Builds"
                    className="w-full h-full object-cover transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105"
                  />
                  <div
                    aria-hidden="true"
                    className="absolute inset-0 bg-gradient-to-t from-[#101B16]/75 via-transparent to-transparent"
                  />
                  <span className="absolute bottom-3 left-3 text-xs font-bold text-white">
                    Responsive Web
                  </span>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Services Grid (Soft Gray #F4F6F4) */}
      <section className="py-14 lg:py-20 bg-[#F4F6F4]">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          <RevealStagger stagger={0.06} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {SERVICES.map((service) => (
              <RevealItem key={service.id}>
                <TiltCard
                  maxTilt={4.5}
                  liftY={-5}
                  className="group h-full bg-white rounded-2xl border border-[#101B16]/10 hover:border-[#101B16]/25 p-5 sm:p-7 shadow-[0_4px_20px_rgba(16,27,22,0.04)] hover:shadow-[0_18px_38px_rgba(16,27,22,0.1)] transition-[border-color,box-shadow] duration-300"
                >
                  <div>
                    <div className="relative aspect-[16/9] w-full rounded-xl overflow-hidden bg-[#101B16] mb-5">
                      <ImageWithFallback
                        src={service.image}
                        alt={`${service.title} visual showcase`}
                        fallbackTitle={service.title}
                        className="w-full h-full object-cover transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105"
                      />
                      <div
                        aria-hidden="true"
                        className="absolute inset-0 bg-gradient-to-t from-[#101B16]/75 via-[#101B16]/15 to-transparent"
                      />
                      <div className="absolute bottom-3 left-3.5 right-3.5 flex items-center justify-between gap-4">
                        <div className="w-11 h-11 rounded-xl bg-[#101B16]/90 text-[#B9F6CA] border border-[#B9F6CA]/30 flex items-center justify-center group-hover:bg-[#B9F6CA] group-hover:text-[#101B16] group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 ease-out">
                          <ServiceIcon name={service.iconName} className="w-5 h-5" />
                        </div>
                        <span className="font-mono text-xs font-semibold text-white/90 tabular-nums drop-shadow-sm">
                          {service.index}
                        </span>
                      </div>
                    </div>

                    <h2 className="font-display font-bold text-2xl text-[#101B16] transition-transform duration-200 group-hover:translate-x-0.5">
                      <LetterReveal text={service.title} />
                    </h2>

                    <p className="mt-2.5 text-sm sm:text-base text-[#101B16]/75 leading-relaxed">
                      <LetterReveal text={service.description} />
                    </p>

                    <ul className="mt-5 space-y-2.5 pt-5 border-t border-[#101B16]/10">
                      {service.deliverables.map((item) => (
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

                  <div className="mt-7 pt-5 border-t border-[#101B16]/10 flex flex-wrap items-center justify-between gap-4">
                    <span className="text-xs font-medium text-[#101B16]/60">
                      For: {service.idealFor}
                    </span>

                    <MagneticButton
                      type="button"
                      onClick={() => onNavigate('contact', service.title)}
                      className="inline-flex items-center gap-2 px-5 py-2.5 text-xs sm:text-sm font-bold text-[#101B16] bg-[#B9F6CA] hover:bg-[#9ef0b5] rounded-full shadow-sm hover:shadow-[0_8px_20px_rgba(185,246,202,0.45)] transition-all whitespace-nowrap shrink-0 cursor-pointer"
                    >
                      <span>Inquire Now</span>
                      <ArrowRight
                        className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1"
                        aria-hidden="true"
                      />
                    </MagneticButton>
                  </div>
                </TiltCard>
              </RevealItem>
            ))}
          </RevealStagger>
        </div>
      </section>

      {/* Bottom Services CTA Banner */}
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
              <LetterReveal text="Need a tailored website or web application scope?" />
            </h2>
            <p className="mt-2 text-white/80 text-sm sm:text-base">
              <LetterReveal text="Tell us what you are building and receive a structured plan with clear pricing." />
            </p>
          </Reveal>
          <Reveal direction="left" delay={0.08}>
            <MagneticButton
              type="button"
              onClick={() => onNavigate('contact')}
              className="group inline-flex items-center gap-2 px-6 py-3.5 text-sm font-bold text-[#101B16] bg-[#B9F6CA] hover:bg-[#9ef0b5] rounded-full shadow-sm hover:shadow-[0_10px_24px_rgba(185,246,202,0.38)] transition-all whitespace-nowrap shrink-0 cursor-pointer"
            >
              <span>Request a Scope</span>
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
