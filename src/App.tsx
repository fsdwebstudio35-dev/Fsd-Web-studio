/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useCallback, useEffect, useState } from 'react';
import { AnimatePresence, motion, MotionConfig } from 'motion/react';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { ProjectModal } from './components/ProjectModal';
import { FloatingWhatsApp } from './components/FloatingWhatsApp';
import { LoadingScreen } from './components/LoadingScreen';
import { CustomCursor } from './components/CustomCursor';
import { EASE_AGENCY } from './components/MotionSystem';
import { AdminAuthStatus } from './components/TeamAdminPanel';
import { HomePage } from './pages/HomePage';
import { AboutPage } from './pages/AboutPage';
import { TeamPage } from './pages/TeamPage';
import { ServicesPage } from './pages/ServicesPage';
import { PortfolioPage } from './pages/PortfolioPage';
import { ContactPage } from './pages/ContactPage';
import { INITIAL_TEAM_MEMBERS } from './data/teamData';
import { PORTFOLIO_PROJECTS } from './data/portfolioProjects';
import { PageId, PortfolioProject, TeamMember } from './types';

const VALID_PAGES: PageId[] = [
  'home',
  'about',
  'team',
  'services',
  'portfolio',
  'contact',
];

function getInitialPage(): PageId {
  const hash = window.location.hash.replace('#', '') as PageId;
  return VALID_PAGES.includes(hash) ? hash : 'home';
}

export default function App() {
  const [currentPage, setCurrentPage] = useState<PageId>(getInitialPage);
  const [preselectedService, setPreselectedService] = useState<string>('');
  const [activeProject, setActiveProject] = useState<PortfolioProject | null>(null);
  const [projectModalMode, setProjectModalMode] = useState<'details' | 'live'>('details');

  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(INITIAL_TEAM_MEMBERS);
  const [isLoadingTeam, setIsLoadingTeam] = useState<boolean>(true);

  const [adminToken, setAdminToken] = useState<string | null>(null);
  const [adminStatus, setAdminStatus] = useState<AdminAuthStatus>({
    envConfigured: false,
    claimed: false,
    authenticated: false,
  });
  const [adminMembers, setAdminMembers] = useState<TeamMember[]>(INITIAL_TEAM_MEMBERS);
  const [isLoadingAdminMembers, setIsLoadingAdminMembers] = useState<boolean>(false);

  const [projects, setProjects] = useState<PortfolioProject[]>(PORTFOLIO_PROJECTS);
  const [isLoadingProjects, setIsLoadingProjects] = useState<boolean>(true);

  useEffect(() => {
    let cancelled = false;
    setIsLoadingTeam(true);

    fetch('/api/team')
      .then((res) => (res.ok ? res.json() : Promise.reject(new Error('Failed to load'))))
      .then((data: { members?: TeamMember[] }) => {
        if (!cancelled && Array.isArray(data.members)) {
          setTeamMembers(data.members);
        }
      })
      .catch(() => {
        // Keep initial roster visible if backend is temporarily unreachable
      })
      .finally(() => {
        if (!cancelled) {
          setIsLoadingTeam(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    setIsLoadingProjects(true);

    fetch('/api/projects')
      .then((res) => (res.ok ? res.json() : Promise.reject(new Error('Failed to load'))))
      .then((data: { projects?: PortfolioProject[] }) => {
        if (!cancelled && Array.isArray(data.projects)) {
          setProjects(data.projects);
        }
      })
      .catch(() => {
        // Keep starter sample projects visible if backend is temporarily unreachable
      })
      .finally(() => {
        if (!cancelled) {
          setIsLoadingProjects(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const onHashChange = () => {
      const nextHash = window.location.hash.replace('#', '') as PageId;
      if (VALID_PAGES.includes(nextHash)) {
        setCurrentPage(nextHash);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    };
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  const fetchAdminMembers = useCallback(async (token: string) => {
    setIsLoadingAdminMembers(true);
    try {
      const res = await fetch('/api/admin/team', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        if (res.status === 401) {
          setAdminToken(null);
          setAdminStatus((prev) => ({ ...prev, authenticated: false }));
        }
        return;
      }
      const data = (await res.json()) as {
        members?: TeamMember[];
        visibleMembers?: TeamMember[];
      };
      if (Array.isArray(data.members)) {
        setAdminMembers(data.members);
      }
      if (Array.isArray(data.visibleMembers)) {
        setTeamMembers(data.visibleMembers);
      }
    } catch {
      // Ignore transient network errors
    } finally {
      setIsLoadingAdminMembers(false);
    }
  }, []);

  const handleRefreshAdminStatus = useCallback(async () => {
    try {
      const headers: Record<string, string> = {};
      if (adminToken) {
        headers.Authorization = `Bearer ${adminToken}`;
      }
      const res = await fetch('/api/admin/status', { headers });
      if (!res.ok) return;
      const data = (await res.json()) as AdminAuthStatus;
      setAdminStatus(data);
      if (data.authenticated && adminToken) {
        await fetchAdminMembers(adminToken);
      } else if (!data.authenticated && adminToken) {
        setAdminToken(null);
      }
    } catch {
      // Keep current status on transient error
    }
  }, [adminToken, fetchAdminMembers]);

  const handleClaimAdmin = async (
    passcode: string
  ): Promise<{ ok: boolean; error?: string }> => {
    try {
      const res = await fetch('/api/admin/claim', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ passcode }),
      });
      const data = (await res.json()) as { token?: string; error?: string };
      if (!res.ok || !data.token) {
        return { ok: false, error: data.error || 'Could not claim admin passcode.' };
      }
      setAdminToken(data.token);
      setAdminStatus({ envConfigured: false, claimed: true, authenticated: true });
      await fetchAdminMembers(data.token);
      return { ok: true };
    } catch {
      return { ok: false, error: 'Network error while claiming admin access.' };
    }
  };

  const handleLoginAdmin = async (
    passcode: string
  ): Promise<{ ok: boolean; error?: string }> => {
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ passcode }),
      });
      const data = (await res.json()) as { token?: string; error?: string };
      if (!res.ok || !data.token) {
        return { ok: false, error: data.error || 'Invalid admin passcode.' };
      }
      setAdminToken(data.token);
      setAdminStatus((prev) => ({ ...prev, claimed: true, authenticated: true }));
      await fetchAdminMembers(data.token);
      return { ok: true };
    } catch {
      return { ok: false, error: 'Network error while verifying passcode.' };
    }
  };

  const handleLogoutAdmin = async () => {
    const token = adminToken;
    setAdminToken(null);
    setAdminStatus((prev) => ({ ...prev, authenticated: false }));
    if (token) {
      try {
        await fetch('/api/admin/logout', {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
        });
      } catch {
        // Ignore logout network error
      }
    }
  };

  const handleNavigate = (page: PageId, serviceTitle?: string) => {
    if (serviceTitle) {
      setPreselectedService(serviceTitle);
    }
    setCurrentPage(page);
    if (window.location.hash !== `#${page}`) {
      window.history.pushState(null, '', `#${page}`);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenProject = (
    project: PortfolioProject,
    mode: 'details' | 'live' = 'details'
  ) => {
    setProjectModalMode(mode);
    setActiveProject(project);
  };

  const handleStartSimilar = (serviceTitle: string) => {
    handleNavigate('contact', serviceTitle);
  };

  const handleTeamRequest = async (
    url: string,
    method: 'POST' | 'PUT' | 'PATCH' | 'DELETE',
    body?: unknown
  ): Promise<{ ok: boolean; error?: string }> => {
    if (!adminToken) {
      return { ok: false, error: 'Admin sign-in is required to update the team.' };
    }
    try {
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`,
        },
        body: body !== undefined ? JSON.stringify(body) : undefined,
      });

      const data = (await res.json()) as {
        members?: TeamMember[];
        visibleMembers?: TeamMember[];
        error?: string;
      };

      if (res.status === 401) {
        setAdminToken(null);
        setAdminStatus((prev) => ({ ...prev, authenticated: false }));
      }

      if (!res.ok) {
        return { ok: false, error: data.error || 'Could not update team data.' };
      }

      if (Array.isArray(data.members)) {
        setAdminMembers(data.members);
      }
      if (Array.isArray(data.visibleMembers)) {
        setTeamMembers(data.visibleMembers);
      }

      return { ok: true };
    } catch {
      return { ok: false, error: 'Network error while saving team updates.' };
    }
  };

  const handleAddTeamMember = (member: Omit<TeamMember, 'id'>) =>
    handleTeamRequest('/api/team', 'POST', member);

  const handleUpdateTeamMember = (updated: TeamMember) =>
    handleTeamRequest(`/api/team/${encodeURIComponent(updated.id)}`, 'PUT', updated);

  const handleDeleteTeamMember = (id: string) =>
    handleTeamRequest(`/api/team/${encodeURIComponent(id)}`, 'DELETE');

  const handleToggleTeamVisibility = (id: string, isVisible: boolean) =>
    handleTeamRequest(
      `/api/team/${encodeURIComponent(id)}/visibility`,
      'PATCH',
      { isVisible }
    );

  const handleReorderTeam = (orderedIds: string[]) =>
    handleTeamRequest('/api/team/reorder', 'PUT', { orderedIds });

  const handleResetTeam = () => handleTeamRequest('/api/team/reset', 'POST');

  const handleProjectRequest = async (
    url: string,
    method: 'POST' | 'PUT' | 'DELETE',
    body?: unknown
  ): Promise<{ ok: boolean; error?: string; createdId?: string }> => {
    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: body !== undefined ? JSON.stringify(body) : undefined,
      });

      const data = (await res.json()) as {
        projects?: PortfolioProject[];
        project?: PortfolioProject;
        error?: string;
      };

      if (!res.ok) {
        return { ok: false, error: data.error || 'Could not update portfolio project.' };
      }

      if (Array.isArray(data.projects)) {
        setProjects(data.projects);
      }

      return { ok: true, createdId: data.project?.id };
    } catch {
      return { ok: false, error: 'Network error while saving project updates.' };
    }
  };

  const handleAddProject = (project: Omit<PortfolioProject, 'id'>) =>
    handleProjectRequest('/api/projects', 'POST', project);

  const handleUpdateProject = (updated: PortfolioProject) =>
    handleProjectRequest(`/api/projects/${encodeURIComponent(updated.id)}`, 'PUT', updated);

  const handleDeleteProject = (id: string) =>
    handleProjectRequest(`/api/projects/${encodeURIComponent(id)}`, 'DELETE');

  const handleResetProjects = () =>
    handleProjectRequest('/api/projects/reset', 'POST');

  return (
    <MotionConfig reducedMotion="user">
      <div className="min-h-screen flex flex-col bg-white text-[#101B16]">
        <CustomCursor />
        <LoadingScreen />
        <Navbar currentPage={currentPage} onNavigate={handleNavigate} />

        <main className="flex-1">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentPage}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.24, ease: EASE_AGENCY }}
            >
              {currentPage === 'home' && (
                <HomePage
                  onNavigate={handleNavigate}
                  onOpenProject={handleOpenProject}
                  projects={projects}
                  isLoadingProjects={isLoadingProjects}
                  isModalOpen={Boolean(activeProject)}
                  onAddProject={handleAddProject}
                  onUpdateProject={handleUpdateProject}
                  onDeleteProject={handleDeleteProject}
                  onResetProjects={handleResetProjects}
                  teamMembers={teamMembers}
                  isLoadingTeam={isLoadingTeam}
                  adminMembers={adminMembers}
                  isLoadingAdminMembers={isLoadingAdminMembers}
                  adminToken={adminToken}
                  adminStatus={adminStatus}
                  onRefreshAdminStatus={handleRefreshAdminStatus}
                  onClaimAdmin={handleClaimAdmin}
                  onLoginAdmin={handleLoginAdmin}
                  onLogoutAdmin={handleLogoutAdmin}
                  onAddTeamMember={handleAddTeamMember}
                  onUpdateTeamMember={handleUpdateTeamMember}
                  onDeleteTeamMember={handleDeleteTeamMember}
                  onToggleTeamVisibility={handleToggleTeamVisibility}
                  onReorderTeam={handleReorderTeam}
                  onResetTeam={handleResetTeam}
                />
              )}
              {currentPage === 'about' && <AboutPage onNavigate={handleNavigate} />}
              {currentPage === 'team' && (
                <TeamPage
                  members={teamMembers}
                  isLoading={isLoadingTeam}
                  adminMembers={adminMembers}
                  isLoadingAdminMembers={isLoadingAdminMembers}
                  adminToken={adminToken}
                  adminStatus={adminStatus}
                  onRefreshAdminStatus={handleRefreshAdminStatus}
                  onClaimAdmin={handleClaimAdmin}
                  onLoginAdmin={handleLoginAdmin}
                  onLogoutAdmin={handleLogoutAdmin}
                  onAddMember={handleAddTeamMember}
                  onUpdateMember={handleUpdateTeamMember}
                  onDeleteMember={handleDeleteTeamMember}
                  onToggleVisibility={handleToggleTeamVisibility}
                  onReorderMembers={handleReorderTeam}
                  onResetDefault={handleResetTeam}
                  onNavigate={handleNavigate}
                />
              )}
              {currentPage === 'services' && (
                <ServicesPage onNavigate={handleNavigate} />
              )}
              {currentPage === 'portfolio' && (
                <PortfolioPage
                  onNavigate={handleNavigate}
                  onOpenProject={handleOpenProject}
                  projects={projects}
                  isLoadingProjects={isLoadingProjects}
                  isModalOpen={Boolean(activeProject)}
                  onAddProject={handleAddProject}
                  onUpdateProject={handleUpdateProject}
                  onDeleteProject={handleDeleteProject}
                  onResetProjects={handleResetProjects}
                />
              )}
              {currentPage === 'contact' && (
                <ContactPage preselectedService={preselectedService} />
              )}
            </motion.div>
          </AnimatePresence>
        </main>

        <Footer onNavigate={handleNavigate} />
        <FloatingWhatsApp />

        <ProjectModal
          project={activeProject}
          initialTab={projectModalMode}
          onClose={() => setActiveProject(null)}
          onStartSimilar={handleStartSimilar}
        />
      </div>
    </MotionConfig>
  );
}
