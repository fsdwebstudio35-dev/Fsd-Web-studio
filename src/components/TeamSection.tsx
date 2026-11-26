import React, { useState } from 'react';
import {
  ArrowUpRight,
  Github,
  Globe,
  Linkedin,
  Lock,
  ShieldCheck,
  User,
} from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';
import { TeamMember } from '../types';
import { AdminAuthStatus, TeamAdminPanel } from './TeamAdminPanel';
import {
  EASE_AGENCY,
  MagneticButton,
  Reveal,
  RevealItem,
  RevealStagger,
  TiltCard,
  useIsFinePointer,
} from './MotionSystem';

interface TeamSectionProps {
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
  variant?: 'light' | 'gray';
}

function getSafeExternalUrl(raw?: string): string | undefined {
  if (!raw) return undefined;
  const trimmed = raw.trim();
  if (!trimmed) return undefined;
  const candidate = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
  try {
    const parsed = new URL(candidate);
    if (parsed.protocol === 'http:' || parsed.protocol === 'https:') {
      return parsed.toString();
    }
    return undefined;
  } catch {
    return undefined;
  }
}

function getInitials(name: string): string {
  const parts = name
    .replace(/\./g, ' ')
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  if (parts.length === 0) return 'FS';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

export const TeamSection: React.FC<TeamSectionProps> = ({
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
  variant = 'gray',
}) => {
  const [isAdminPanelOpen, setIsAdminPanelOpen] = useState(false);
  const prefersReduced = useReducedMotion();
  const isFine = useIsFinePointer();

  const isAuthenticated = Boolean(adminToken && adminStatus.authenticated);
  const bgClass = variant === 'light' ? 'bg-white' : 'bg-[#F4F6F4]';

  return (
    <section
      id="our-team"
      className={`relative overflow-hidden py-16 lg:py-24 ${bgClass} border-b border-[#101B16]/10`}
    >
      {/* Floating Background Decorations */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <motion.div
          animate={
            prefersReduced
              ? undefined
              : { x: [0, 24, -12, 0], y: [0, -18, 12, 0], scale: [1, 1.08, 0.96, 1] }
          }
          transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -top-24 right-[-6%] w-80 h-80 rounded-full bg-[#B9F6CA]/28 blur-3xl"
        />
        <motion.div
          animate={
            prefersReduced
              ? undefined
              : { x: [0, -20, 14, 0], y: [0, 18, -10, 0] }
          }
          transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut' }}
          className="hidden md:block absolute -bottom-24 left-[-5%] w-72 h-72 rounded-full bg-[#B9F6CA]/20 blur-3xl"
        />
        <motion.div
          animate={prefersReduced ? undefined : { rotate: [12, 22, 12], y: [0, -10, 0] }}
          transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
          className="hidden lg:block absolute top-20 left-10 w-16 h-16 rounded-2xl border border-[#101B16]/8"
        />
      </div>

      <div className="relative max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header + Admin Dashboard Trigger */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12">
          <Reveal direction="up" className="max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-wider text-[#101B16]/65 mb-2">
              Meet Our Team
            </p>
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl lg:text-[2.6rem] text-[#101B16] tracking-tight leading-[1.1] text-balance">
              The Creative Minds Behind FSD.
            </h2>
            <p className="mt-3 text-base sm:text-lg text-[#101B16]/75 leading-relaxed">
              Meet the talented people turning ideas into digital experiences.
            </p>
          </Reveal>

          <Reveal direction="left" delay={0.08} className="flex flex-wrap items-center gap-3 shrink-0">
            <MagneticButton
              type="button"
              onClick={() => setIsAdminPanelOpen(true)}
              className={`group inline-flex items-center gap-2 px-5 py-2.5 text-xs sm:text-sm font-bold rounded-full border transition-all whitespace-nowrap cursor-pointer ${
                isAuthenticated
                  ? 'bg-[#B9F6CA] hover:bg-[#9ef0b5] text-[#101B16] border-[#101B16]/15 shadow-sm hover:shadow-[0_8px_22px_rgba(185,246,202,0.45)]'
                  : 'bg-white hover:bg-[#101B16] text-[#101B16] hover:text-[#B9F6CA] border-[#101B16]/15 shadow-xs'
              }`}
            >
              {isAuthenticated ? (
                <ShieldCheck className="w-4 h-4" aria-hidden="true" />
              ) : (
                <Lock className="w-3.5 h-3.5" aria-hidden="true" />
              )}
              <span>{isAuthenticated ? 'Admin Dashboard (Unlocked)' : 'Admin Dashboard'}</span>
            </MagneticButton>
          </Reveal>
        </div>

        {/* Team Member Cards Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div
                key={n}
                className="h-[420px] rounded-3xl bg-white border border-[#101B16]/10 animate-pulse"
              />
            ))}
          </div>
        ) : members.length === 0 ? (
          <Reveal className="bg-white rounded-3xl border border-[#101B16]/10 p-12 text-center space-y-4">
            <p className="font-display font-bold text-lg text-[#101B16]">
              No public team profiles active right now
            </p>
            <p className="text-sm text-[#101B16]/65 max-w-md mx-auto">
              Open the Admin Dashboard to publish or add team member profiles.
            </p>
            <MagneticButton
              type="button"
              onClick={() => setIsAdminPanelOpen(true)}
              className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-bold text-[#101B16] bg-[#B9F6CA] hover:bg-[#9ef0b5] rounded-full cursor-pointer"
            >
              <Lock className="w-4 h-4" aria-hidden="true" />
              <span>Open Admin Dashboard</span>
            </MagneticButton>
          </Reveal>
        ) : (
          <RevealStagger
            stagger={0.07}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7"
          >
            {members.map((member) => {
              const safeLinkedin = getSafeExternalUrl(member.linkedinUrl);
              const safeGithub = getSafeExternalUrl(
                member.githubUrl ||
                  (member.secondaryType !== 'portfolio' ? member.secondaryUrl : undefined)
              );
              const safePortfolio = getSafeExternalUrl(
                member.portfolioUrl ||
                  (member.secondaryType === 'portfolio' ? member.secondaryUrl : undefined)
              );
              const hasAnySocial = Boolean(safeLinkedin || safeGithub || safePortfolio);
              const isHighlighted = Boolean(member.isFeatured);
              const initials = getInitials(member.fullName);

              return (
                <RevealItem key={member.id}>
                  <div className="group relative h-full rounded-3xl p-[1.5px] transition-all duration-300">
                    {/* Animated Green Border & Glow on Hover (subtle default emphasis on highlighted member) */}
                    <div
                      aria-hidden="true"
                      className={`pointer-events-none absolute inset-0 rounded-3xl bg-gradient-to-br from-[#B9F6CA] via-[#101B16]/25 to-[#B9F6CA]/80 transition-opacity duration-300 ${
                        isHighlighted
                          ? 'opacity-70 group-hover:opacity-100'
                          : 'opacity-0 group-hover:opacity-100'
                      }`}
                    />
                    <div
                      aria-hidden="true"
                      className="pointer-events-none absolute -inset-1 rounded-[28px] bg-[#B9F6CA]/30 blur-xl opacity-0 group-hover:opacity-65 transition-opacity duration-500"
                    />

                    <TiltCard
                      maxTilt={5}
                      liftY={-6}
                      spotlightColor="rgba(185, 246, 202, 0.24)"
                      data-cursor="team"
                      className={`relative h-full bg-white rounded-[22px] overflow-hidden border transition-[border-color,box-shadow] duration-300 ${
                        isHighlighted
                          ? 'border-[#101B16]/20 shadow-[0_14px_38px_rgba(16,27,22,0.09)] group-hover:shadow-[0_24px_54px_rgba(16,27,22,0.16)]'
                          : 'border-[#101B16]/10 group-hover:border-transparent shadow-[0_6px_22px_rgba(16,27,22,0.04)] group-hover:shadow-[0_22px_48px_rgba(16,27,22,0.14)]'
                      }`}
                    >
                      {/* Subtle 3px Lime Top Accent for Highlighted Profile */}
                      {isHighlighted && (
                        <div
                          aria-hidden="true"
                          className="h-[3px] w-full bg-gradient-to-r from-[#101B16] via-[#B9F6CA] to-[#101B16]"
                        />
                      )}

                      <div>
                        {/* Portrait Frame with Smooth Image Zoom */}
                        <div className="relative aspect-[4/3] w-full bg-[#101B16] overflow-hidden">
                          {member.photoUrl ? (
                            <img
                              src={member.photoUrl}
                              alt={`${member.fullName} — ${member.jobTitle}`}
                              className="w-full h-full object-cover transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.07]"
                            />
                          ) : (
                            <div className="relative w-full h-full flex flex-col items-center justify-center p-6 bg-gradient-to-br from-[#101B16] via-[#15261e] to-[#0b130f] text-white transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]">
                              <div
                                aria-hidden="true"
                                className="absolute -top-10 -right-10 w-36 h-36 rounded-full bg-[#B9F6CA]/12 blur-2xl group-hover:bg-[#B9F6CA]/22 transition-colors duration-300"
                              />
                              <div className="relative w-16 h-16 rounded-2xl bg-[#B9F6CA]/14 border border-[#B9F6CA]/35 flex items-center justify-center text-[#B9F6CA] font-display font-extrabold text-xl tracking-tight mb-3 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
                                {initials || <User className="w-7 h-7" aria-hidden="true" />}
                              </div>
                              <span className="text-[11px] font-bold uppercase tracking-wider text-[#B9F6CA]/90 text-center">
                                {member.jobTitle}
                              </span>
                              <span className="mt-1 text-[11px] text-white/55 text-center">
                                Photo upload via Admin Panel
                              </span>
                            </div>
                          )}

                          {/* Subtle gradient overlay */}
                          <div
                            aria-hidden="true"
                            className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#101B16]/45 via-transparent to-transparent opacity-60 group-hover:opacity-30 transition-opacity duration-300"
                          />
                        </div>

                        {/* Profile Content */}
                        <div className="p-6">
                          <div className="flex items-center justify-between gap-2">
                            <p className="text-xs font-bold uppercase tracking-wider text-[#101B16]/60 transition-transform duration-200 group-hover:translate-x-0.5">
                              {member.jobTitle}
                            </p>
                            {isHighlighted && (
                              <span className="text-[11px] font-bold text-[#101B16] bg-[#B9F6CA]/70 px-2 py-0.5 rounded-md">
                                Core Focus
                              </span>
                            )}
                          </div>

                          <h3 className="font-display font-extrabold text-xl text-[#101B16] mt-1.5 transition-transform duration-200 group-hover:translate-x-0.5">
                            {member.fullName}
                          </h3>

                          {member.specialty && (
                            <p className="mt-1 text-xs font-semibold text-[#101B16]/75 leading-snug">
                              {member.specialty}
                            </p>
                          )}

                          <p className="mt-3 text-sm text-[#101B16]/75 leading-relaxed">
                            {member.bio}
                          </p>

                          {/* Skills */}
                          {member.skills && member.skills.length > 0 && (
                            <div className="mt-4 flex flex-wrap gap-1.5">
                              {member.skills.slice(0, 5).map((skill) => (
                                <span
                                  key={skill}
                                  className="px-2.5 py-1 rounded-md bg-[#F4F6F4] group-hover:bg-[#e9f0ea] text-[#101B16]/85 text-[11px] font-semibold transition-colors duration-200"
                                >
                                  {skill}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Social Links Footer */}
                      <div className="px-6 py-4 border-t border-[#101B16]/8 bg-[#F4F6F4]/55 flex items-center justify-between gap-3">
                        {hasAnySocial ? (
                          <div className="flex flex-wrap items-center gap-2">
                            {safeLinkedin && (
                              <motion.a
                                href={safeLinkedin}
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label={`${member.fullName} LinkedIn`}
                                whileHover={isFine ? { y: -2, scale: 1.05 } : undefined}
                                whileTap={{ scale: 0.95 }}
                                transition={{ duration: 0.18, ease: EASE_AGENCY }}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-[#101B16]/10 hover:bg-[#B9F6CA] hover:border-[#101B16]/20 text-[#101B16] text-xs font-semibold transition-colors"
                              >
                                <Linkedin className="w-3.5 h-3.5" aria-hidden="true" />
                                <span>LinkedIn</span>
                                <ArrowUpRight className="w-3 h-3 opacity-70" aria-hidden="true" />
                              </motion.a>
                            )}

                            {safeGithub && (
                              <motion.a
                                href={safeGithub}
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label={`${member.fullName} GitHub`}
                                whileHover={isFine ? { y: -2, scale: 1.05 } : undefined}
                                whileTap={{ scale: 0.95 }}
                                transition={{ duration: 0.18, ease: EASE_AGENCY }}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-[#101B16]/10 hover:bg-[#B9F6CA] hover:border-[#101B16]/20 text-[#101B16] text-xs font-semibold transition-colors"
                              >
                                <Github className="w-3.5 h-3.5" aria-hidden="true" />
                                <span>GitHub</span>
                                <ArrowUpRight className="w-3 h-3 opacity-70" aria-hidden="true" />
                              </motion.a>
                            )}

                            {safePortfolio && (
                              <motion.a
                                href={safePortfolio}
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label={`${member.fullName} Personal Portfolio`}
                                whileHover={isFine ? { y: -2, scale: 1.05 } : undefined}
                                whileTap={{ scale: 0.95 }}
                                transition={{ duration: 0.18, ease: EASE_AGENCY }}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-[#101B16]/10 hover:bg-[#B9F6CA] hover:border-[#101B16]/20 text-[#101B16] text-xs font-semibold transition-colors"
                              >
                                <Globe className="w-3.5 h-3.5" aria-hidden="true" />
                                <span>Portfolio</span>
                                <ArrowUpRight className="w-3 h-3 opacity-70" aria-hidden="true" />
                              </motion.a>
                            )}
                          </div>
                        ) : (
                          <span className="text-[11px] font-medium text-[#101B16]/50">
                            FSD Web Studio · Specialist Profile
                          </span>
                        )}
                      </div>
                    </TiltCard>
                  </div>
                </RevealItem>
              );
            })}
          </RevealStagger>
        )}
      </div>

      {/* Secure Team Admin Dashboard */}
      <TeamAdminPanel
        isOpen={isAdminPanelOpen}
        onClose={() => setIsAdminPanelOpen(false)}
        adminToken={adminToken}
        adminStatus={adminStatus}
        onRefreshStatus={onRefreshAdminStatus}
        onClaimAdmin={onClaimAdmin}
        onLoginAdmin={onLoginAdmin}
        onLogoutAdmin={onLogoutAdmin}
        adminMembers={adminMembers}
        isLoadingAdminMembers={isLoadingAdminMembers}
        onAddMember={onAddMember}
        onUpdateMember={onUpdateMember}
        onDeleteMember={onDeleteMember}
        onToggleVisibility={onToggleVisibility}
        onReorderMembers={onReorderMembers}
        onResetDefault={onResetDefault}
      />
    </section>
  );
};
