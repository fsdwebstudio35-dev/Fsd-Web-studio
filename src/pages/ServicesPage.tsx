import React from 'react';
import { ArrowRight, Check } from 'lucide-react';
import { SERVICES } from '../data/studioData';
import { PageId } from '../types';
import { ServiceIcon } from '../components/ServiceIcon';
import {
  LineReveal,
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
          <Reveal direction="up" className="max-w-3xl">
            <p className="text-xs font-bold uppercase tracking-wider text-[#101B16]/65 mb-3">
              Our Services
            </p>
            <h1
              className="font-display font-extrabold text-[#101B16] tracking-tight leading-[1.08] text-balance"
              style={{ fontSize: 'clamp(2.25rem, 4vw, 3.5rem)' }}
            >
              <LineReveal
                lines={[
                  'Digital services built for small businesses,',
                  'startups, and global teams.',
                ]}
                baseDelay={0.04}
              />
            </h1>
            <p className="mt-5 text-base sm:text-lg text-[#101B16]/75 leading-relaxed">
              Every project is crafted around clear communication, mobile-first
              usability, and fast performance. Select any service below to open a
              tailored inquiry brief.
            </p>
          </Reveal>
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
                  className="group h-full bg-white rounded-2xl border border-[#101B16]/10 hover:border-[#101B16]/25 p-6 sm:p-8 shadow-[0_4px_20px_rgba(16,27,22,0.04)] hover:shadow-[0_18px_38px_rgba(16,27,22,0.1)] transition-[border-color,box-shadow] duration-300"
                >
                  <div>
                    <div className="flex items-center justify-between gap-4 mb-5">
                      <div className="w-12 h-12 rounded-xl bg-[#101B16] text-[#B9F6CA] flex items-center justify-center group-hover:bg-[#B9F6CA] group-hover:text-[#101B16] group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 ease-out">
                        <ServiceIcon name={service.iconName} className="w-6 h-6" />
                      </div>
                      <span className="font-mono text-xs font-semibold text-[#101B16]/45 tabular-nums group-hover:text-[#101B16]/75 transition-colors">
                        {service.index}
                      </span>
                    </div>

                    <h2 className="font-display font-bold text-2xl text-[#101B16] transition-transform duration-200 group-hover:translate-x-0.5">
                      {service.title}
                    </h2>

                    <p className="mt-3 text-sm sm:text-base text-[#101B16]/75 leading-relaxed">
                      {service.description}
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
    </div>
  );
};
