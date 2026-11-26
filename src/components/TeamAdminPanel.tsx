import React, { useEffect, useRef, useState } from 'react';
import {
  AlertCircle,
  ArrowDown,
  ArrowUp,
  Camera,
  Check,
  Eye,
  EyeOff,
  Github,
  Globe,
  KeyRound,
  Linkedin,
  Lock,
  LogOut,
  Pencil,
  Plus,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  Trash2,
  User,
  X,
} from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { TeamMember } from '../types';
import { EASE_AGENCY, MagneticButton } from './MotionSystem';

export interface AdminAuthStatus {
  envConfigured: boolean;
  claimed: boolean;
  authenticated: boolean;
}

interface TeamAdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
  adminToken: string | null;
  adminStatus: AdminAuthStatus;
  onRefreshStatus: () => Promise<void>;
  onClaimAdmin: (passcode: string) => Promise<{ ok: boolean; error?: string }>;
  onLoginAdmin: (passcode: string) => Promise<{ ok: boolean; error?: string }>;
  onLogoutAdmin: () => Promise<void>;
  adminMembers: TeamMember[];
  isLoadingAdminMembers: boolean;
  onAddMember: (member: Omit<TeamMember, 'id'>) => Promise<{ ok: boolean; error?: string }>;
  onUpdateMember: (member: TeamMember) => Promise<{ ok: boolean; error?: string }>;
  onDeleteMember: (id: string) => Promise<{ ok: boolean; error?: string }>;
  onToggleVisibility: (id: string, isVisible: boolean) => Promise<{ ok: boolean; error?: string }>;
  onReorderMembers: (orderedIds: string[]) => Promise<{ ok: boolean; error?: string }>;
  onResetDefault: () => Promise<{ ok: boolean; error?: string }>;
}

interface MemberEditorState {
  id: string | null;
  fullName: string;
  jobTitle: string;
  specialty: string;
  bio: string;
  skillsText: string;
  photoUrl: string;
  linkedinUrl: string;
  githubUrl: string;
  portfolioUrl: string;
  isFeatured: boolean;
  isVisible: boolean;
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

function resizeImageToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = typeof reader.result === 'string' ? reader.result : '';
      if (!result) {
        reject(new Error('Could not read file.'));
        return;
      }
      const img = new Image();
      img.onload = () => {
        const maxSize = 640;
        let { width, height } = img;
        if (width > maxSize || height > maxSize) {
          if (width > height) {
            height = Math.round((height * maxSize) / width);
            width = maxSize;
          } else {
            width = Math.round((width * maxSize) / height);
            height = maxSize;
          }
        }
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(result);
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', 0.86));
      };
      img.onerror = () => resolve(result);
      img.src = result;
    };
    reader.onerror = () => reject(new Error('Failed to read image file.'));
    reader.readAsDataURL(file);
  });
}

const EMPTY_EDITOR: MemberEditorState = {
  id: null,
  fullName: '',
  jobTitle: '',
  specialty: '',
  bio: '',
  skillsText: '',
  photoUrl: '',
  linkedinUrl: '',
  githubUrl: '',
  portfolioUrl: '',
  isFeatured: false,
  isVisible: true,
};

export const TeamAdminPanel: React.FC<TeamAdminPanelProps> = ({
  isOpen,
  onClose,
  adminToken,
  adminStatus,
  onRefreshStatus,
  onClaimAdmin,
  onLoginAdmin,
  onLogoutAdmin,
  adminMembers,
  isLoadingAdminMembers,
  onAddMember,
  onUpdateMember,
  onDeleteMember,
  onToggleVisibility,
  onReorderMembers,
  onResetDefault,
}) => {
  const [passcode, setPasscode] = useState('');
  const [confirmPasscode, setConfirmPasscode] = useState('');
  const [showPasscode, setShowPasscode] = useState(false);
  const [authSubmitting, setAuthSubmitting] = useState(false);
  const [authError, setAuthError] = useState('');

  const [viewMode, setViewMode] = useState<'list' | 'editor'>('list');
  const [editor, setEditor] = useState<MemberEditorState>(EMPTY_EDITOR);
  const [savingMember, setSavingMember] = useState(false);
  const [editorError, setEditorError] = useState('');
  const [uploadError, setUploadError] = useState('');

  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [confirmReset, setConfirmReset] = useState(false);
  const [actionNotice, setActionNotice] = useState('');
  const [actionError, setActionError] = useState('');
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const isAuthenticated = Boolean(adminToken && adminStatus.authenticated);
  const needsClaimSetup = !adminStatus.envConfigured && !adminStatus.claimed;

  useEffect(() => {
    if (!isOpen) return;
    setAuthError('');
    setActionError('');
    onRefreshStatus();
  }, [isOpen, onRefreshStatus]);

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen, onClose]);

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');

    if (needsClaimSetup) {
      if (passcode.length < 8) {
        setAuthError('Create a passcode with at least 8 characters.');
        return;
      }
      if (passcode !== confirmPasscode) {
        setAuthError('Passcodes do not match.');
        return;
      }
      setAuthSubmitting(true);
      const res = await onClaimAdmin(passcode);
      setAuthSubmitting(false);
      if (!res.ok) {
        setAuthError(res.error || 'Could not set admin passcode.');
        return;
      }
      setPasscode('');
      setConfirmPasscode('');
      setActionNotice('Admin dashboard unlocked.');
    } else {
      if (!passcode.trim()) {
        setAuthError('Enter your admin passcode.');
        return;
      }
      setAuthSubmitting(true);
      const res = await onLoginAdmin(passcode);
      setAuthSubmitting(false);
      if (!res.ok) {
        setAuthError(res.error || 'Invalid admin passcode.');
        return;
      }
      setPasscode('');
      setActionNotice('Signed in to Team Admin Dashboard.');
    }
  };

  const openAddEditor = () => {
    setEditorError('');
    setUploadError('');
    setEditor(EMPTY_EDITOR);
    setViewMode('editor');
  };

  const openEditEditor = (member: TeamMember) => {
    setEditorError('');
    setUploadError('');
    setEditor({
      id: member.id,
      fullName: member.fullName,
      jobTitle: member.jobTitle,
      specialty: member.specialty ?? '',
      bio: member.bio,
      skillsText: (member.skills ?? []).join(', '),
      photoUrl: member.photoUrl ?? '',
      linkedinUrl: member.linkedinUrl ?? '',
      githubUrl: member.githubUrl ?? '',
      portfolioUrl: member.portfolioUrl ?? '',
      isFeatured: Boolean(member.isFeatured),
      isVisible: member.isVisible !== false,
    });
    setViewMode('editor');
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadError('');

    if (!file.type.startsWith('image/')) {
      setUploadError('Please select a valid image file (JPG, PNG, or WebP).');
      e.target.value = '';
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setUploadError('Image file must be under 10 MB.');
      e.target.value = '';
      return;
    }

    try {
      const dataUrl = await resizeImageToDataUrl(file);
      setEditor((prev) => ({ ...prev, photoUrl: dataUrl }));
    } catch {
      setUploadError('Could not process the selected image.');
    } finally {
      e.target.value = '';
    }
  };

  const handleSaveMember = async (e: React.FormEvent) => {
    e.preventDefault();
    setEditorError('');

    const fullName = editor.fullName.trim();
    const jobTitle = editor.jobTitle.trim();
    const bio = editor.bio.trim();

    if (fullName.length < 2) {
      setEditorError('Full name must be at least 2 characters.');
      return;
    }
    if (jobTitle.length < 2) {
      setEditorError('Job role must be at least 2 characters.');
      return;
    }
    if (bio.length < 10) {
      setEditorError('Bio must be at least 10 characters.');
      return;
    }

    for (const [label, val] of [
      ['LinkedIn URL', editor.linkedinUrl],
      ['GitHub URL', editor.githubUrl],
      ['Portfolio URL', editor.portfolioUrl],
    ] as const) {
      if (val.trim() && !getSafeExternalUrl(val)) {
        setEditorError(`Please enter a valid ${label} (e.g. https://...).`);
        return;
      }
    }

    const skills = editor.skillsText
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean)
      .slice(0, 10);

    const payload: Omit<TeamMember, 'id'> = {
      fullName,
      jobTitle,
      specialty: editor.specialty.trim() || undefined,
      bio,
      skills,
      photoUrl: editor.photoUrl || undefined,
      linkedinUrl: getSafeExternalUrl(editor.linkedinUrl),
      githubUrl: getSafeExternalUrl(editor.githubUrl),
      portfolioUrl: getSafeExternalUrl(editor.portfolioUrl),
      isFeatured: editor.isFeatured,
      isVisible: editor.isVisible,
    };

    setSavingMember(true);
    const result = editor.id
      ? await onUpdateMember({ id: editor.id, ...payload })
      : await onAddMember(payload);
    setSavingMember(false);

    if (!result.ok) {
      setEditorError(result.error || 'Could not save team member.');
      return;
    }

    setActionError('');
    setActionNotice(
      editor.id
        ? `Saved updates for ${fullName}.`
        : `Added ${fullName} to the team.`
    );
    setViewMode('list');
  };

  const handleMove = async (index: number, direction: -1 | 1) => {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= adminMembers.length) return;
    const ids = adminMembers.map((m) => m.id);
    const [moved] = ids.splice(index, 1);
    ids.splice(targetIndex, 0, moved);

    const result = await onReorderMembers(ids);
    if (!result.ok) {
      setActionError(result.error || 'Could not reorder team members.');
    } else {
      setActionNotice('Team order updated.');
    }
  };

  const handleToggleMemberVisibility = async (member: TeamMember) => {
    const nextVisible = member.isVisible === false;
    const result = await onToggleVisibility(member.id, nextVisible);
    if (!result.ok) {
      setActionError(result.error || 'Could not update visibility.');
    } else {
      setActionNotice(
        nextVisible
          ? `${member.fullName} is now visible on the website.`
          : `${member.fullName} is now hidden from public visitors.`
      );
    }
  };

  const handleDeleteMember = async (id: string) => {
    const result = await onDeleteMember(id);
    if (!result.ok) {
      setActionError(result.error || 'Could not delete team member.');
    } else {
      setActionNotice('Team member deleted.');
    }
    setConfirmDeleteId(null);
  };

  const handleReset = async () => {
    const result = await onResetDefault();
    setConfirmReset(false);
    if (!result.ok) {
      setActionError(result.error || 'Could not reset team.');
    } else {
      setActionNotice('Team roster reset to studio defaults.');
      setViewMode('list');
    }
  };

  const visibleCount = adminMembers.filter((m) => m.isVisible !== false).length;
  const hiddenCount = adminMembers.length - visibleCount;

  const parsedSkillPreview = editor.skillsText
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, 10);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.22 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-[#101B16]/75 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="team-admin-title"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 14 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 14 }}
            transition={{ duration: 0.26, ease: EASE_AGENCY }}
            className="bg-white rounded-3xl border border-[#101B16]/12 w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden shadow-[0_32px_90px_rgba(16,27,22,0.35)]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="px-6 py-4 bg-[#101B16] text-white flex items-center justify-between gap-4 shrink-0">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-[#B9F6CA]/15 border border-[#B9F6CA]/35 text-[#B9F6CA] flex items-center justify-center shrink-0">
                  {isAuthenticated ? (
                    <ShieldCheck className="w-5 h-5" aria-hidden="true" />
                  ) : (
                    <Lock className="w-5 h-5" aria-hidden="true" />
                  )}
                </div>
                <div className="min-w-0">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-[#B9F6CA]">
                    FSD Web Studio
                  </p>
                  <h3
                    id="team-admin-title"
                    className="font-display font-bold text-lg text-white truncate"
                  >
                    Team Admin Dashboard
                  </h3>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {isAuthenticated && (
                  <button
                    type="button"
                    onClick={async () => {
                      await onLogoutAdmin();
                      setViewMode('list');
                    }}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition-colors cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" aria-hidden="true" />
                    <span className="hidden sm:inline">Lock Panel</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Close team admin dashboard"
                  className="w-9 h-9 rounded-xl flex items-center justify-center text-white/75 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" aria-hidden="true" />
                </button>
              </div>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto p-6 sm:p-8 bg-[#F4F6F4]">
              {!isAuthenticated ? (
                <div className="max-w-md mx-auto bg-white rounded-2xl border border-[#101B16]/10 p-6 sm:p-8 shadow-sm">
                  <div className="w-12 h-12 rounded-2xl bg-[#101B16] text-[#B9F6CA] flex items-center justify-center mb-4">
                    <KeyRound className="w-5 h-5" aria-hidden="true" />
                  </div>

                  <h4 className="font-display font-bold text-xl text-[#101B16]">
                    {needsClaimSetup
                      ? 'Set Up Team Admin Passcode'
                      : 'Sign In to Manage Team'}
                  </h4>
                  <p className="mt-2 text-sm text-[#101B16]/70 leading-relaxed">
                    {needsClaimSetup
                      ? 'Create an admin passcode (8+ characters) to protect adding, editing, reordering, and hiding team profiles. You can also override it anytime via Settings → Secrets.'
                      : 'Enter your studio admin passcode to add, edit, reorder, upload photos for, or show/hide team profiles.'}
                  </p>

                  <form onSubmit={handleAuthSubmit} className="mt-6 space-y-4">
                    <div>
                      <label
                        htmlFor="admin-passcode-input"
                        className="block text-xs font-bold text-[#101B16] mb-1.5"
                      >
                        {needsClaimSetup ? 'Create Admin Passcode' : 'Admin Passcode'}
                      </label>
                      <div className="relative">
                        <input
                          id="admin-passcode-input"
                          type={showPasscode ? 'text' : 'password'}
                          value={passcode}
                          onChange={(e) => setPasscode(e.target.value)}
                          autoComplete={needsClaimSetup ? 'new-password' : 'current-password'}
                          placeholder={
                            needsClaimSetup
                              ? 'Minimum 8 characters'
                              : 'Enter admin passcode'
                          }
                          className="w-full h-11 pl-4 pr-11 text-sm rounded-xl bg-[#F4F6F4] text-[#101B16] border border-[#101B16]/10 focus:outline-none focus:ring-2 focus:ring-[#101B16]/30 focus:bg-white transition-all"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPasscode((p) => !p)}
                          aria-label={showPasscode ? 'Hide passcode' : 'Show passcode'}
                          className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1.5 text-[#101B16]/60 hover:text-[#101B16] cursor-pointer"
                        >
                          {showPasscode ? (
                            <EyeOff className="w-4 h-4" aria-hidden="true" />
                          ) : (
                            <Eye className="w-4 h-4" aria-hidden="true" />
                          )}
                        </button>
                      </div>
                    </div>

                    {needsClaimSetup && (
                      <div>
                        <label
                          htmlFor="admin-confirm-passcode-input"
                          className="block text-xs font-bold text-[#101B16] mb-1.5"
                        >
                          Confirm Passcode
                        </label>
                        <input
                          id="admin-confirm-passcode-input"
                          type={showPasscode ? 'text' : 'password'}
                          value={confirmPasscode}
                          onChange={(e) => setConfirmPasscode(e.target.value)}
                          autoComplete="new-password"
                          placeholder="Re-enter passcode"
                          className="w-full h-11 px-4 text-sm rounded-xl bg-[#F4F6F4] text-[#101B16] border border-[#101B16]/10 focus:outline-none focus:ring-2 focus:ring-[#101B16]/30 focus:bg-white transition-all"
                        />
                      </div>
                    )}

                    {authError && (
                      <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 shrink-0" aria-hidden="true" />
                        <span>{authError}</span>
                      </div>
                    )}

                    <MagneticButton
                      type="submit"
                      disabled={authSubmitting}
                      className="w-full h-11 rounded-full bg-[#101B16] hover:bg-[#1c2e26] disabled:opacity-60 text-[#B9F6CA] text-sm font-bold inline-flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Lock className="w-4 h-4" aria-hidden="true" />
                      <span>
                        {authSubmitting
                          ? 'Verifying...'
                          : needsClaimSetup
                          ? 'Claim & Open Dashboard'
                          : 'Unlock Team Dashboard'}
                      </span>
                    </MagneticButton>
                  </form>
                </div>
              ) : (
                <div className="space-y-5">
                  {/* Notices */}
                  <AnimatePresence>
                    {actionNotice && (
                      <motion.div
                        initial={{ opacity: 0, y: -6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        className="p-3.5 rounded-xl bg-[#B9F6CA]/45 border border-[#101B16]/15 text-xs font-semibold text-[#101B16] flex items-center justify-between gap-2"
                      >
                        <div className="flex items-center gap-2">
                          <Check className="w-4 h-4 shrink-0" aria-hidden="true" />
                          <span>{actionNotice}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => setActionNotice('')}
                          aria-label="Dismiss message"
                          className="p-1 hover:bg-[#101B16]/10 rounded-lg cursor-pointer"
                        >
                          <X className="w-3.5 h-3.5" aria-hidden="true" />
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {actionError && (
                    <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0" aria-hidden="true" />
                      <span>{actionError}</span>
                    </div>
                  )}

                  {viewMode === 'list' ? (
                    <>
                      {/* Toolbar */}
                      <div className="bg-white rounded-2xl border border-[#101B16]/10 p-4 sm:p-5 flex flex-wrap items-center justify-between gap-4">
                        <div className="flex flex-wrap items-center gap-3 text-xs font-semibold text-[#101B16]/75">
                          <span className="font-display font-bold text-sm text-[#101B16]">
                            {adminMembers.length} Total Profiles
                          </span>
                          <span>·</span>
                          <span className="text-emerald-800">{visibleCount} Visible</span>
                          <span>·</span>
                          <span className="text-[#101B16]/55">{hiddenCount} Hidden</span>
                        </div>

                        <div className="flex flex-wrap items-center gap-2">
                          <MagneticButton
                            type="button"
                            onClick={openAddEditor}
                            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#B9F6CA] hover:bg-[#9ef0b5] text-[#101B16] text-xs font-bold border border-[#101B16]/10 cursor-pointer"
                          >
                            <Plus className="w-3.5 h-3.5" aria-hidden="true" />
                            <span>Add Member</span>
                          </MagneticButton>

                          {confirmReset ? (
                            <div className="flex items-center gap-1.5 bg-[#F4F6F4] px-3 py-1.5 rounded-full">
                              <span className="text-xs font-semibold text-[#101B16]">
                                Reset roster?
                              </span>
                              <button
                                type="button"
                                onClick={handleReset}
                                className="px-2.5 py-1 rounded-full bg-[#101B16] text-[#B9F6CA] text-[11px] font-bold cursor-pointer"
                              >
                                Confirm
                              </button>
                              <button
                                type="button"
                                onClick={() => setConfirmReset(false)}
                                className="px-2.5 py-1 rounded-full bg-white text-[#101B16] text-[11px] font-semibold border border-[#101B16]/15 cursor-pointer"
                              >
                                Cancel
                              </button>
                            </div>
                          ) : (
                            <button
                              type="button"
                              onClick={() => setConfirmReset(true)}
                              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-[#F4F6F4] hover:bg-[#e7ece7] text-[#101B16] text-xs font-semibold transition-colors cursor-pointer"
                            >
                              <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
                              <span>Reset Defaults</span>
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Roster Rows */}
                      {isLoadingAdminMembers ? (
                        <div className="space-y-3">
                          {[1, 2, 3].map((n) => (
                            <div
                              key={n}
                              className="h-24 rounded-2xl bg-white border border-[#101B16]/10 animate-pulse"
                            />
                          ))}
                        </div>
                      ) : adminMembers.length === 0 ? (
                        <div className="bg-white rounded-2xl border border-[#101B16]/10 p-10 text-center space-y-3">
                          <p className="font-display font-bold text-base text-[#101B16]">
                            No team members in the roster
                          </p>
                          <button
                            type="button"
                            onClick={openAddEditor}
                            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#B9F6CA] text-[#101B16] text-xs font-bold cursor-pointer"
                          >
                            <Plus className="w-3.5 h-3.5" aria-hidden="true" />
                            <span>Add First Team Member</span>
                          </button>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {adminMembers.map((member, index) => {
                            const isHidden = member.isVisible === false;
                            const isConfirmDelete = confirmDeleteId === member.id;

                            return (
                              <div
                                key={member.id}
                                className={`bg-white rounded-2xl border p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors ${
                                  isHidden
                                    ? 'border-[#101B16]/10 opacity-70'
                                    : member.isFeatured
                                    ? 'border-[#101B16]/25 shadow-sm'
                                    : 'border-[#101B16]/10'
                                }`}
                              >
                                <div className="flex items-center gap-4 min-w-0">
                                  {/* Reorder Stack */}
                                  <div className="flex flex-col gap-1 shrink-0">
                                    <button
                                      type="button"
                                      disabled={index === 0}
                                      onClick={() => handleMove(index, -1)}
                                      aria-label={`Move ${member.fullName} up`}
                                      className="w-7 h-7 rounded-lg bg-[#F4F6F4] hover:bg-[#101B16] text-[#101B16] hover:text-white disabled:opacity-30 flex items-center justify-center transition-colors cursor-pointer"
                                    >
                                      <ArrowUp className="w-3.5 h-3.5" aria-hidden="true" />
                                    </button>
                                    <button
                                      type="button"
                                      disabled={index === adminMembers.length - 1}
                                      onClick={() => handleMove(index, 1)}
                                      aria-label={`Move ${member.fullName} down`}
                                      className="w-7 h-7 rounded-lg bg-[#F4F6F4] hover:bg-[#101B16] text-[#101B16] hover:text-white disabled:opacity-30 flex items-center justify-center transition-colors cursor-pointer"
                                    >
                                      <ArrowDown className="w-3.5 h-3.5" aria-hidden="true" />
                                    </button>
                                  </div>

                                  {/* Avatar */}
                                  <div className="w-14 h-14 rounded-2xl bg-[#101B16] text-[#B9F6CA] overflow-hidden flex items-center justify-center shrink-0 border border-[#101B16]/10">
                                    {member.photoUrl ? (
                                      <img
                                        src={member.photoUrl}
                                        alt={member.fullName}
                                        className="w-full h-full object-cover"
                                      />
                                    ) : (
                                      <User className="w-6 h-6" aria-hidden="true" />
                                    )}
                                  </div>

                                  {/* Info */}
                                  <div className="min-w-0">
                                    <div className="flex flex-wrap items-center gap-2">
                                      <span className="font-display font-bold text-base text-[#101B16] truncate">
                                        {member.fullName}
                                      </span>
                                      {member.isFeatured && (
                                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#B9F6CA] text-[#101B16] text-[10px] font-bold">
                                          <Sparkles className="w-3 h-3" aria-hidden="true" />
                                          <span>Highlighted</span>
                                        </span>
                                      )}
                                      {isHidden && (
                                        <span className="px-2 py-0.5 rounded-md bg-[#101B16]/10 text-[#101B16]/75 text-[10px] font-bold">
                                          Hidden
                                        </span>
                                      )}
                                    </div>
                                    <p className="text-xs font-semibold text-[#101B16]/70">
                                      {member.jobTitle}
                                    </p>
                                    {member.skills && member.skills.length > 0 && (
                                      <p className="mt-1 text-[11px] text-[#101B16]/55 truncate">
                                        {member.skills.slice(0, 4).join(' · ')}
                                      </p>
                                    )}
                                  </div>
                                </div>

                                {/* Actions */}
                                <div className="flex flex-wrap items-center gap-2 shrink-0">
                                  {isConfirmDelete ? (
                                    <div className="flex items-center gap-1.5">
                                      <button
                                        type="button"
                                        onClick={() => handleDeleteMember(member.id)}
                                        className="px-3 py-1.5 rounded-full bg-red-600 text-white text-xs font-bold hover:bg-red-700 cursor-pointer"
                                      >
                                        Confirm Delete
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() => setConfirmDeleteId(null)}
                                        className="px-3 py-1.5 rounded-full bg-[#F4F6F4] text-[#101B16] text-xs font-semibold cursor-pointer"
                                      >
                                        Cancel
                                      </button>
                                    </div>
                                  ) : (
                                    <>
                                      <button
                                        type="button"
                                        onClick={() => handleToggleMemberVisibility(member)}
                                        title={isHidden ? 'Show on website' : 'Hide from website'}
                                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-colors cursor-pointer ${
                                          isHidden
                                            ? 'bg-[#101B16] text-[#B9F6CA]'
                                            : 'bg-[#F4F6F4] hover:bg-[#e5eae5] text-[#101B16]'
                                        }`}
                                      >
                                        {isHidden ? (
                                          <>
                                            <Eye className="w-3.5 h-3.5" aria-hidden="true" />
                                            <span>Show</span>
                                          </>
                                        ) : (
                                          <>
                                            <EyeOff className="w-3.5 h-3.5" aria-hidden="true" />
                                            <span>Hide</span>
                                          </>
                                        )}
                                      </button>

                                      <button
                                        type="button"
                                        onClick={() => openEditEditor(member)}
                                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#F4F6F4] hover:bg-[#B9F6CA] text-[#101B16] text-xs font-bold transition-colors cursor-pointer"
                                      >
                                        <Pencil className="w-3.5 h-3.5" aria-hidden="true" />
                                        <span>Edit</span>
                                      </button>

                                      <button
                                        type="button"
                                        onClick={() => setConfirmDeleteId(member.id)}
                                        aria-label={`Delete ${member.fullName}`}
                                        className="w-8 h-8 rounded-full bg-[#F4F6F4] hover:bg-red-50 text-[#101B16]/65 hover:text-red-700 flex items-center justify-center transition-colors cursor-pointer"
                                      >
                                        <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
                                      </button>
                                    </>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </>
                  ) : (
                    /* Member Add / Edit Form */
                    <form
                      onSubmit={handleSaveMember}
                      className="bg-white rounded-2xl border border-[#101B16]/10 p-6 sm:p-8 space-y-5"
                    >
                      <div className="flex items-center justify-between gap-4 pb-4 border-b border-[#101B16]/10">
                        <div>
                          <p className="text-[11px] font-bold uppercase tracking-wider text-[#101B16]/60">
                            {editor.id ? 'Edit Profile' : 'New Team Member'}
                          </p>
                          <h4 className="font-display font-bold text-xl text-[#101B16]">
                            {editor.id ? editor.fullName || 'Update Profile' : 'Create Team Profile'}
                          </h4>
                        </div>
                        <button
                          type="button"
                          onClick={() => setViewMode('list')}
                          className="px-4 py-2 rounded-full bg-[#F4F6F4] hover:bg-[#e5eae5] text-xs font-bold text-[#101B16] cursor-pointer"
                        >
                          Back to Roster
                        </button>
                      </div>

                      {/* Photo Upload */}
                      <div className="flex flex-wrap items-center gap-5">
                        <div className="w-24 h-24 rounded-2xl bg-[#101B16] text-[#B9F6CA] overflow-hidden flex items-center justify-center border border-[#101B16]/10 shrink-0">
                          {editor.photoUrl ? (
                            <img
                              src={editor.photoUrl}
                              alt="Profile preview"
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <User className="w-9 h-9" aria-hidden="true" />
                          )}
                        </div>
                        <div className="space-y-2">
                          <span className="block text-xs font-bold text-[#101B16]">
                            Profile Photo
                          </span>
                          <div className="flex flex-wrap items-center gap-2">
                            <input
                              ref={fileInputRef}
                              type="file"
                              accept="image/*"
                              onChange={handlePhotoUpload}
                              className="hidden"
                            />
                            <button
                              type="button"
                              onClick={() => fileInputRef.current?.click()}
                              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#B9F6CA] hover:bg-[#9ef0b5] text-[#101B16] text-xs font-bold transition-colors cursor-pointer"
                            >
                              <Camera className="w-3.5 h-3.5" aria-hidden="true" />
                              <span>{editor.photoUrl ? 'Change Photo' : 'Upload Photo'}</span>
                            </button>
                            {editor.photoUrl && (
                              <button
                                type="button"
                                onClick={() => setEditor((prev) => ({ ...prev, photoUrl: '' }))}
                                className="px-3.5 py-2 rounded-full bg-[#F4F6F4] hover:bg-[#e5eae5] text-[#101B16] text-xs font-semibold cursor-pointer"
                              >
                                Remove Photo
                              </button>
                            )}
                          </div>
                          {uploadError && (
                            <p className="text-xs text-red-700">{uploadError}</p>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label
                            htmlFor="admin-member-name"
                            className="block text-xs font-bold text-[#101B16] mb-1.5"
                          >
                            Full Name *
                          </label>
                          <input
                            id="admin-member-name"
                            type="text"
                            value={editor.fullName}
                            onChange={(e) =>
                              setEditor((prev) => ({ ...prev, fullName: e.target.value }))
                            }
                            placeholder="e.g. M. Abdullah"
                            className="w-full h-11 px-4 text-sm rounded-xl bg-[#F4F6F4] text-[#101B16] focus:outline-none focus:ring-2 focus:ring-[#101B16]/30 focus:bg-white transition-all"
                          />
                        </div>

                        <div>
                          <label
                            htmlFor="admin-member-role"
                            className="block text-xs font-bold text-[#101B16] mb-1.5"
                          >
                            Job Role *
                          </label>
                          <input
                            id="admin-member-role"
                            type="text"
                            value={editor.jobTitle}
                            onChange={(e) =>
                              setEditor((prev) => ({ ...prev, jobTitle: e.target.value }))
                            }
                            placeholder="e.g. Web Developer"
                            className="w-full h-11 px-4 text-sm rounded-xl bg-[#F4F6F4] text-[#101B16] focus:outline-none focus:ring-2 focus:ring-[#101B16]/30 focus:bg-white transition-all"
                          />
                        </div>
                      </div>

                      <div>
                        <label
                          htmlFor="admin-member-specialty"
                          className="block text-xs font-bold text-[#101B16] mb-1.5"
                        >
                          Specialty (Optional)
                        </label>
                        <input
                          id="admin-member-specialty"
                          type="text"
                          value={editor.specialty}
                          onChange={(e) =>
                            setEditor((prev) => ({ ...prev, specialty: e.target.value }))
                          }
                          placeholder="e.g. Website Development, Frontend Development, Modern UI Design"
                          className="w-full h-11 px-4 text-sm rounded-xl bg-[#F4F6F4] text-[#101B16] focus:outline-none focus:ring-2 focus:ring-[#101B16]/30 focus:bg-white transition-all"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="admin-member-bio"
                          className="block text-xs font-bold text-[#101B16] mb-1.5"
                        >
                          Short Professional Bio *
                        </label>
                        <textarea
                          id="admin-member-bio"
                          rows={3}
                          value={editor.bio}
                          onChange={(e) =>
                            setEditor((prev) => ({ ...prev, bio: e.target.value }))
                          }
                          placeholder="Describe role, experience, and impact..."
                          className="w-full p-3.5 text-sm rounded-xl bg-[#F4F6F4] text-[#101B16] focus:outline-none focus:ring-2 focus:ring-[#101B16]/30 focus:bg-white transition-all resize-y"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="admin-member-skills"
                          className="block text-xs font-bold text-[#101B16] mb-1.5"
                        >
                          Skills (comma-separated)
                        </label>
                        <input
                          id="admin-member-skills"
                          type="text"
                          value={editor.skillsText}
                          onChange={(e) =>
                            setEditor((prev) => ({ ...prev, skillsText: e.target.value }))
                          }
                          placeholder="Website Development, Frontend Development, Modern UI Design"
                          className="w-full h-11 px-4 text-sm rounded-xl bg-[#F4F6F4] text-[#101B16] focus:outline-none focus:ring-2 focus:ring-[#101B16]/30 focus:bg-white transition-all"
                        />
                        {parsedSkillPreview.length > 0 && (
                          <div className="mt-2 flex flex-wrap gap-1.5">
                            {parsedSkillPreview.map((skill) => (
                              <span
                                key={skill}
                                className="px-2.5 py-1 rounded-md bg-[#F4F6F4] text-[#101B16] text-[11px] font-semibold"
                              >
                                {skill}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                          <label
                            htmlFor="admin-member-linkedin"
                            className="flex items-center gap-1.5 text-xs font-bold text-[#101B16] mb-1.5"
                          >
                            <Linkedin className="w-3.5 h-3.5" aria-hidden="true" />
                            <span>LinkedIn URL</span>
                          </label>
                          <input
                            id="admin-member-linkedin"
                            type="url"
                            value={editor.linkedinUrl}
                            onChange={(e) =>
                              setEditor((prev) => ({
                                ...prev,
                                linkedinUrl: e.target.value,
                              }))
                            }
                            placeholder="https://linkedin.com/in/..."
                            className="w-full h-11 px-4 text-sm rounded-xl bg-[#F4F6F4] text-[#101B16] focus:outline-none focus:ring-2 focus:ring-[#101B16]/30 focus:bg-white transition-all"
                          />
                        </div>

                        <div>
                          <label
                            htmlFor="admin-member-github"
                            className="flex items-center gap-1.5 text-xs font-bold text-[#101B16] mb-1.5"
                          >
                            <Github className="w-3.5 h-3.5" aria-hidden="true" />
                            <span>GitHub URL</span>
                          </label>
                          <input
                            id="admin-member-github"
                            type="url"
                            value={editor.githubUrl}
                            onChange={(e) =>
                              setEditor((prev) => ({ ...prev, githubUrl: e.target.value }))
                            }
                            placeholder="https://github.com/..."
                            className="w-full h-11 px-4 text-sm rounded-xl bg-[#F4F6F4] text-[#101B16] focus:outline-none focus:ring-2 focus:ring-[#101B16]/30 focus:bg-white transition-all"
                          />
                        </div>

                        <div>
                          <label
                            htmlFor="admin-member-portfolio"
                            className="flex items-center gap-1.5 text-xs font-bold text-[#101B16] mb-1.5"
                          >
                            <Globe className="w-3.5 h-3.5" aria-hidden="true" />
                            <span>Personal Portfolio URL</span>
                          </label>
                          <input
                            id="admin-member-portfolio"
                            type="url"
                            value={editor.portfolioUrl}
                            onChange={(e) =>
                              setEditor((prev) => ({
                                ...prev,
                                portfolioUrl: e.target.value,
                              }))
                            }
                            placeholder="https://..."
                            className="w-full h-11 px-4 text-sm rounded-xl bg-[#F4F6F4] text-[#101B16] focus:outline-none focus:ring-2 focus:ring-[#101B16]/30 focus:bg-white transition-all"
                          />
                        </div>
                      </div>

                      {/* Toggles */}
                      <div className="flex flex-wrap items-center gap-6 pt-2">
                        <label className="inline-flex items-center gap-2.5 text-xs font-bold text-[#101B16] cursor-pointer">
                          <input
                            type="checkbox"
                            checked={editor.isVisible}
                            onChange={(e) =>
                              setEditor((prev) => ({ ...prev, isVisible: e.target.checked }))
                            }
                            className="w-4 h-4 accent-[#101B16] rounded"
                          />
                          <span>Show member publicly</span>
                        </label>

                        <label className="inline-flex items-center gap-2.5 text-xs font-bold text-[#101B16] cursor-pointer">
                          <input
                            type="checkbox"
                            checked={editor.isFeatured}
                            onChange={(e) =>
                              setEditor((prev) => ({ ...prev, isFeatured: e.target.checked }))
                            }
                            className="w-4 h-4 accent-[#101B16] rounded"
                          />
                          <span>Subtle profile highlight</span>
                        </label>
                      </div>

                      {editorError && (
                        <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2">
                          <AlertCircle className="w-4 h-4 shrink-0" aria-hidden="true" />
                          <span>{editorError}</span>
                        </div>
                      )}

                      <div className="pt-4 border-t border-[#101B16]/10 flex items-center justify-end gap-3">
                        <button
                          type="button"
                          onClick={() => setViewMode('list')}
                          className="px-5 py-2.5 rounded-full bg-[#F4F6F4] hover:bg-[#e5eae5] text-xs font-bold text-[#101B16] cursor-pointer"
                        >
                          Cancel
                        </button>
                        <MagneticButton
                          type="submit"
                          disabled={savingMember}
                          className="px-6 py-2.5 rounded-full bg-[#101B16] hover:bg-[#1c2e26] disabled:opacity-60 text-[#B9F6CA] text-xs sm:text-sm font-bold cursor-pointer"
                        >
                          {savingMember
                            ? 'Saving...'
                            : editor.id
                            ? 'Save Profile Changes'
                            : 'Add Team Member'}
                        </MagneticButton>
                      </div>
                    </form>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
