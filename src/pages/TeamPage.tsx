import React from 'react';
import { ArrowRight } from 'lucide-react';
import { STUDIO_IMAGES } from '../data/studioData';
import { PageId, TeamMember } from '../types';
import { ImageWithFallback } from '../components/ImageWithFallback';
import { AdminAuthStatus } from '../components/TeamAdminPanel';
import { TeamSection } from '../components/TeamSection';
import { WelcomeTeamSection } from '../components/WelcomeTeamSection';
import { LetterReveal, MagneticButton, Reveal } from '../components/MotionSystem';

interface TeamPageProps {
  members: TeamMember[];
  isLoading?: boolean;
  adminMembers: TeamMember[];
  isLoadingAdminMembers?: boolean;
  adminToken: string | null;
  adminStatus: AdminAuthStatus;
  onRefreshAdminStatus: () => Promise<void>;
  onClaimAdmin: (passcode: string) => Promise<{ ok: boolean; error?: string }>;
  onLoginAdmin: (passcode: string) => Promise<{ ok: boolean; error?: string }>;
  onLogoutAdmin: () => Promise<void>;
  onAddMember: (member: Omit<TeamMember, 'id'>) => Promise<{ ok: boolean; error?: string }>;
  onUpdateMember: (member: TeamMember) => Promise<{ ok: boolean; error?: string }>;
  onDeleteMember: (id: string) => Promise<{ ok: boolean; error?: string }>;
  onToggleVisibility: (id: string, isVisible: boolean) => Promise<{ ok: boolean; error?: string }>;
  onReorderMembers: (orderedIds: string[]) => Promise<{ ok: boolean; error?: string }>;
  onResetDefault: () => Promise<{ ok: boolean; error?: string }>;
  onNavigate: (page: PageId) => void;
}

export const TeamPage: React.FC<TeamPageProps> = ({
  members,
  isLoading = false,
  adminMembers,
  isLoadingAdminMembers = false,
  adminToken,
  adminStatus,
  onRefreshAdminStatus,
  onClaimAdmin,
  onLoginAdmin,
  onLogoutAdmin,
  onAddMember,
  onUpdateMember,
  onDeleteMember,
  onToggleVisibility,
  onReorderMembers,
  onResetDefault,
  onNavigate,
}) => {
  return (
    <div className="bg-white text-[#101B16]">
      <WelcomeTeamSection />
      <TeamSection
        members={members}
        isLoading={isLoading}
        adminMembers={adminMembers}
        isLoadingAdminMembers={isLoadingAdminMembers}
        adminToken={adminToken}
        adminStatus={adminStatus}
        onRefreshAdminStatus={onRefreshAdminStatus}
        onClaimAdmin={onClaimAdmin}
        onLoginAdmin={onLoginAdmin}
        onLogoutAdmin={onLogoutAdmin}
        onAddMember={onAddMember}
        onUpdateMember={onUpdateMember}
        onDeleteMember={onDeleteMember}
        onToggleVisibility={onToggleVisibility}
        onReorderMembers={onReorderMembers}
        onResetDefault={onResetDefault}
        variant="gray"
      />

      {/* Bottom CTA */}
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
              <LetterReveal text="Want to collaborate directly with our studio specialists?" />
            </h2>
            <p className="mt-2 text-white/80 text-sm sm:text-base">
              <LetterReveal text="Share your project goals and connect with our engineering and design leads." />
            </p>
          </Reveal>
          <Reveal direction="left" delay={0.08}>
            <MagneticButton
              type="button"
              onClick={() => onNavigate('contact')}
              className="group inline-flex items-center gap-2 px-6 py-3.5 text-sm font-bold text-[#101B16] bg-[#B9F6CA] hover:bg-[#9ef0b5] rounded-full shadow-sm hover:shadow-[0_10px_24px_rgba(185,246,202,0.38)] transition-all whitespace-nowrap shrink-0 cursor-pointer"
            >
              <span>Start a Project</span>
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
