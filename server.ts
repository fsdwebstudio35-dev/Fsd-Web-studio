import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv';
import express, { NextFunction, Request, Response } from 'express';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = Number(process.env.PORT || 3000);
const IS_PRODUCTION = process.env.NODE_ENV === 'production';

const DATA_DIR = path.resolve(__dirname, 'data');
const TEAM_FILE = path.resolve(DATA_DIR, 'team.json');
const PROJECTS_FILE = path.resolve(DATA_DIR, 'projects.json');
const ADMIN_AUTH_FILE = path.resolve(DATA_DIR, 'admin-auth.json');

const SESSION_SECRET =
  process.env.SESSION_SECRET?.trim() || crypto.randomBytes(32).toString('hex');
const TOKEN_TTL_MS = 8 * 60 * 60 * 1000; // 8 hours

interface AdminAuthRecord {
  salt: string;
  hash: string;
  claimedAt: string;
}

interface TokenPayload {
  sub: 'admin';
  jti: string;
  iat: number;
  exp: number;
}

const revokedTokenIds = new Set<string>();
const failedLoginAttempts = new Map<string, { count: number; resetAt: number }>();

interface TeamMemberRecord {
  id: string;
  fullName: string;
  jobTitle: string;
  specialty?: string;
  bio: string;
  skills: string[];
  photoUrl?: string;
  linkedinUrl?: string;
  githubUrl?: string;
  portfolioUrl?: string;
  secondaryUrl?: string;
  secondaryType?: 'github' | 'portfolio';
  isFeatured?: boolean;
  isVisible?: boolean;
}

type PortfolioCategory =
  | 'E-Commerce'
  | 'Business Websites'
  | 'Portfolio Websites'
  | 'Web Applications';

interface ProjectRecord {
  id: string;
  title: string;
  category: PortfolioCategory;
  thumbnail: string;
  description: string;
  overview: string;
  highlights: string[];
  techStack: string[];
  liveDemoUrl: string;
  previewHeadline: string;
  previewSubheadline: string;
  isSample?: boolean;
}

const VALID_PROJECT_CATEGORIES: PortfolioCategory[] = [
  'E-Commerce',
  'Business Websites',
  'Portfolio Websites',
  'Web Applications',
];

const INITIAL_TEAM_MEMBERS: TeamMemberRecord[] = [
  {
    id: 'member-m-abdullah',
    fullName: 'M. Abdullah',
    jobTitle: 'Web Developer',
    specialty: 'Website Development, Frontend Development, Modern UI Design',
    bio: 'Passionate web developer creating modern, responsive and professional digital experiences that help businesses grow.',
    skills: [
      'Website Development',
      'Frontend Development',
      'Modern UI Design',
      'React & TypeScript',
      'Responsive UI',
    ],
    isFeatured: true,
    isVisible: true,
  },
  {
    id: 'member-m-zain',
    fullName: 'M. Zain',
    jobTitle: 'Founder & CEO',
    specialty: 'Studio Direction & Client Strategy',
    bio: 'Directs studio vision, client partnerships, and long-term digital strategy across all web and product engagements.',
    skills: ['Digital Strategy', 'Client Partnerships', 'Product Direction'],
    isVisible: true,
  },
  {
    id: 'member-m-asad',
    fullName: 'M. Asad',
    jobTitle: 'Frontend Developer',
    specialty: 'Interactive Interfaces & Performance',
    bio: 'Builds responsive, accessible React and TypeScript interfaces with smooth motion interactions and fast rendering.',
    skills: ['Frontend Engineering', 'React', 'Responsive Layouts'],
    isVisible: true,
  },
  {
    id: 'member-mushahid-hussain',
    fullName: 'Mushahid Hussain',
    jobTitle: 'UI/UX Designer & Backend Developer',
    specialty: 'Interface Systems & Server Architecture',
    bio: 'Shapes intuitive user interfaces and engineers reliable backend APIs, databases, and scalable application logic.',
    skills: ['UI/UX Design', 'Backend APIs', 'System Architecture'],
    isVisible: true,
  },
  {
    id: 'member-all-team-seo',
    fullName: 'All Team',
    jobTitle: 'SEO Specialist',
    specialty: 'Technical SEO & Search Visibility',
    bio: 'Optimizes technical search structure, metadata, Core Web Vitals, and organic visibility for client websites.',
    skills: ['Technical SEO', 'Core Web Vitals', 'Search Optimization'],
    isVisible: true,
  },
  {
    id: 'member-m-ahtasham',
    fullName: 'M. Ahtasham',
    jobTitle: 'Digital Marketing Specialist',
    specialty: 'Growth Campaigns & Conversion Funnels',
    bio: 'Aligns landing pages, campaign messaging, and conversion funnels to turn digital traffic into measurable business growth.',
    skills: ['Digital Marketing', 'Conversion Funnels', 'Campaign Strategy'],
    isVisible: true,
  },
];

const INITIAL_PROJECTS: ProjectRecord[] = [
  {
    id: 'aurelia-botanical-store',
    title: 'Aurélia Home Storefront',
    category: 'E-Commerce',
    thumbnail: '/src/assets/images/project_ecommerce_botanical_1795607200381.jpg',
    description:
      'Minimalist online storefront built for clean product discovery, fast mobile browsing, and streamlined checkout.',
    overview:
      'Designed and developed as a modern direct-to-consumer shopping experience prioritizing uncluttered product photography, instant category filtering, and an effortless cart workflow.',
    highlights: [
      'Responsive catalog grid across mobile, tablet, and desktop',
      'Clean product variant selection and persistent cart drawer',
      'Semantic product metadata and structured markup for search',
    ],
    techStack: ['React', 'TypeScript', 'Tailwind CSS', 'E-Commerce'],
    liveDemoUrl: '',
    previewHeadline: 'Elevated essentials for modern living.',
    previewSubheadline:
      'Explore curated homeware collections with instant filtering and mobile-ready checkout.',
    isSample: true,
  },
  {
    id: 'veridian-strategy-group',
    title: 'Veridian Strategy Corporate Site',
    category: 'Business Websites',
    thumbnail: '/src/assets/images/project_business_corporate_1795607201341.jpg',
    description:
      'Authoritative corporate advisory website designed to clarify complex consulting services and capture client inquiries.',
    overview:
      'Built to give a growing B2B consultancy a credible digital headquarters with clear service architecture, leadership overview, and a frictionless consultation intake.',
    highlights: [
      'Structured multi-page navigation with fast page transitions',
      'Clear service breakdown and dedicated consultation workflow',
      'SEO-ready heading hierarchy and clean performance profile',
    ],
    techStack: ['React', 'TypeScript', 'Tailwind CSS', 'Motion'],
    liveDemoUrl: '',
    previewHeadline: 'Strategic solutions for growing enterprises.',
    previewSubheadline:
      'Advisory clarity, structured service pages, and direct consultation scheduling.',
    isSample: true,
  },
  {
    id: 'architectural-dialogues',
    title: 'Architectural Dialogues Showcase',
    category: 'Portfolio Websites',
    thumbnail: '/src/assets/images/project_portfolio_minimal_1795607202030.jpg',
    description:
      'Editorial portfolio website crafted to spotlight visual case studies with bold typography and distraction-free galleries.',
    overview:
      'Created for creative studios and independent architects needing a calm, museum-grade digital portfolio where high-resolution imagery takes center stage.',
    highlights: [
      'Responsive media-first gallery layout with clean grid balance',
      'Interactive project detail views with fast image loading',
      'Minimalist navigation tailored for client and press reviews',
    ],
    techStack: ['React', 'TypeScript', 'Tailwind CSS', '3D Motion'],
    liveDemoUrl: '',
    previewHeadline: 'Spatial craft and curated architectural works.',
    previewSubheadline:
      'A minimal visual archive engineered for effortless browsing on every screen.',
    isSample: true,
  },
  {
    id: 'evergreen-analytics-app',
    title: 'Evergreen Analytics Workspace',
    category: 'Web Applications',
    thumbnail: '/src/assets/images/project_webapp_dashboard_1795607202327.jpg',
    description:
      'Custom web application interface for tracking team metrics, revenue cohorts, and operational reporting in one workspace.',
    overview:
      'Engineered as a scalable SaaS dashboard architecture featuring clear data hierarchy, role-aware navigation, and responsive chart panels.',
    highlights: [
      'Modular dashboard layout with crisp tabular figures',
      'Accessible forest and mint green visual contrast system',
      'Reusable UI component architecture built for rapid scaling',
    ],
    techStack: ['React', 'TypeScript', 'Tailwind CSS', 'REST API'],
    liveDemoUrl: '',
    previewHeadline: 'Unified operational intelligence in real time.',
    previewSubheadline:
      'Monitor active cohorts, revenue trends, and team workflows from one clean console.',
    isSample: true,
  },
];

function ensureDataDir(): void {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

function normalizeTeamMember(raw: Partial<TeamMemberRecord>): TeamMemberRecord {
  let githubUrl = sanitizeSafeHttpUrl(raw.githubUrl);
  let portfolioUrl = sanitizeSafeHttpUrl(raw.portfolioUrl);

  if (!githubUrl && raw.secondaryType !== 'portfolio' && raw.secondaryUrl) {
    githubUrl = sanitizeSafeHttpUrl(raw.secondaryUrl);
  }
  if (!portfolioUrl && raw.secondaryType === 'portfolio' && raw.secondaryUrl) {
    portfolioUrl = sanitizeSafeHttpUrl(raw.secondaryUrl);
  }

  return {
    id: typeof raw.id === 'string' && raw.id ? raw.id : `member-${crypto.randomUUID()}`,
    fullName: typeof raw.fullName === 'string' ? raw.fullName : 'Team Member',
    jobTitle: typeof raw.jobTitle === 'string' ? raw.jobTitle : 'Specialist',
    specialty: typeof raw.specialty === 'string' && raw.specialty.trim() ? raw.specialty.trim() : undefined,
    bio: typeof raw.bio === 'string' ? raw.bio : '',
    skills: Array.isArray(raw.skills)
      ? raw.skills.filter((s): s is string => typeof s === 'string' && s.trim().length > 0)
      : [],
    photoUrl: sanitizePhotoUrl(raw.photoUrl),
    linkedinUrl: sanitizeSafeHttpUrl(raw.linkedinUrl),
    githubUrl,
    portfolioUrl,
    isFeatured: Boolean(raw.isFeatured),
    isVisible: raw.isVisible !== false,
  };
}

function readTeamRecords(): TeamMemberRecord[] {
  ensureDataDir();
  if (!fs.existsSync(TEAM_FILE)) {
    fs.writeFileSync(TEAM_FILE, JSON.stringify(INITIAL_TEAM_MEMBERS, null, 2), 'utf8');
    return INITIAL_TEAM_MEMBERS;
  }
  try {
    const raw = fs.readFileSync(TEAM_FILE, 'utf8');
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return INITIAL_TEAM_MEMBERS;
    return parsed.map((item) => normalizeTeamMember(item as Partial<TeamMemberRecord>));
  } catch {
    return INITIAL_TEAM_MEMBERS;
  }
}

function writeTeamRecords(members: TeamMemberRecord[]): void {
  ensureDataDir();
  fs.writeFileSync(TEAM_FILE, JSON.stringify(members, null, 2), 'utf8');
}

function getVisibleTeamMembers(members: TeamMemberRecord[]): TeamMemberRecord[] {
  return members.filter((m) => m.isVisible !== false);
}

function readProjectRecords(): ProjectRecord[] {
  ensureDataDir();
  if (!fs.existsSync(PROJECTS_FILE)) {
    fs.writeFileSync(PROJECTS_FILE, JSON.stringify(INITIAL_PROJECTS, null, 2), 'utf8');
    return INITIAL_PROJECTS;
  }
  try {
    const raw = fs.readFileSync(PROJECTS_FILE, 'utf8');
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : INITIAL_PROJECTS;
  } catch {
    return INITIAL_PROJECTS;
  }
}

function writeProjectRecords(projects: ProjectRecord[]): void {
  ensureDataDir();
  fs.writeFileSync(PROJECTS_FILE, JSON.stringify(projects, null, 2), 'utf8');
}

function readAdminAuthRecord(): AdminAuthRecord | null {
  ensureDataDir();
  if (!fs.existsSync(ADMIN_AUTH_FILE)) return null;
  try {
    const raw = fs.readFileSync(ADMIN_AUTH_FILE, 'utf8');
    const parsed = JSON.parse(raw) as Partial<AdminAuthRecord>;
    if (typeof parsed.salt === 'string' && typeof parsed.hash === 'string') {
      return {
        salt: parsed.salt,
        hash: parsed.hash,
        claimedAt: typeof parsed.claimedAt === 'string' ? parsed.claimedAt : new Date().toISOString(),
      };
    }
    return null;
  } catch {
    return null;
  }
}

function hashPasscodeWithSalt(passcode: string, salt: string): Buffer {
  return crypto.scryptSync(passcode, salt, 64);
}

function timingSafeCompareStrings(a: string, b: string): boolean {
  const hashA = crypto.createHash('sha256').update(a).digest();
  const hashB = crypto.createHash('sha256').update(b).digest();
  return crypto.timingSafeEqual(hashA, hashB);
}

function signAdminToken(): string {
  const now = Date.now();
  const payload: TokenPayload = {
    sub: 'admin',
    jti: crypto.randomUUID(),
    iat: now,
    exp: now + TOKEN_TTL_MS,
  };
  const encoded = Buffer.from(JSON.stringify(payload), 'utf8').toString('base64url');
  const sig = crypto
    .createHmac('sha256', SESSION_SECRET)
    .update(encoded)
    .digest('base64url');
  return `${encoded}.${sig}`;
}

function verifyAdminTokenFromHeader(authHeader?: string): TokenPayload | null {
  if (!authHeader || !authHeader.startsWith('Bearer ')) return null;
  const token = authHeader.slice(7).trim();
  const parts = token.split('.');
  if (parts.length !== 2) return null;
  const [encoded, providedSig] = parts;
  if (!encoded || !providedSig) return null;

  const expectedSig = crypto
    .createHmac('sha256', SESSION_SECRET)
    .update(encoded)
    .digest('base64url');

  const bufProvided = Buffer.from(providedSig, 'utf8');
  const bufExpected = Buffer.from(expectedSig, 'utf8');
  if (bufProvided.length !== bufExpected.length) return null;
  if (!crypto.timingSafeEqual(bufProvided, bufExpected)) return null;

  try {
    const parsed = JSON.parse(
      Buffer.from(encoded, 'base64url').toString('utf8')
    ) as TokenPayload;
    if (
      parsed.sub !== 'admin' ||
      typeof parsed.jti !== 'string' ||
      typeof parsed.exp !== 'number'
    ) {
      return null;
    }
    if (Date.now() > parsed.exp) return null;
    if (revokedTokenIds.has(parsed.jti)) return null;
    return parsed;
  } catch {
    return null;
  }
}

function requireAdmin(req: Request, res: Response, next: NextFunction): void {
  const payload = verifyAdminTokenFromHeader(req.headers.authorization);
  if (!payload) {
    res.status(401).json({ error: 'Admin authentication required.' });
    return;
  }
  next();
}

function sanitizeSafeHttpUrl(raw: unknown): string | undefined {
  if (typeof raw !== 'string') return undefined;
  const trimmed = raw.trim();
  if (!trimmed) return undefined;
  const withProto = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
  try {
    const parsed = new URL(withProto);
    if (parsed.protocol === 'http:' || parsed.protocol === 'https:') {
      return parsed.toString();
    }
    return undefined;
  } catch {
    return undefined;
  }
}

function sanitizePhotoUrl(raw: unknown): string | undefined {
  if (typeof raw !== 'string') return undefined;
  const trimmed = raw.trim();
  if (!trimmed) return undefined;
  if (/^data:image\/(png|jpeg|jpg|webp|gif);base64,[A-Za-z0-9+/=]+$/.test(trimmed)) {
    if (trimmed.length <= 3_500_000) {
      return trimmed;
    }
  }
  return undefined;
}

function sanitizeProjectThumbnail(raw: unknown): string {
  const dataUri = sanitizePhotoUrl(raw);
  if (dataUri) return dataUri;
  if (typeof raw === 'string') {
    const trimmed = raw.trim();
    if (trimmed.startsWith('/src/assets/') || trimmed.startsWith('/assets/')) {
      return trimmed;
    }
    const httpUrl = sanitizeSafeHttpUrl(trimmed);
    if (httpUrl) return httpUrl;
  }
  return '/src/assets/images/project_business_corporate_1795607201341.jpg';
}

function validateMemberInput(body: unknown): {
  error?: string;
  member?: Omit<TeamMemberRecord, 'id'>;
} {
  if (!body || typeof body !== 'object') {
    return { error: 'Invalid request body.' };
  }
  const data = body as Record<string, unknown>;
  const fullName = typeof data.fullName === 'string' ? data.fullName.trim() : '';
  const jobTitle = typeof data.jobTitle === 'string' ? data.jobTitle.trim() : '';
  const specialty =
    typeof data.specialty === 'string' ? data.specialty.trim().slice(0, 120) : '';
  const bio = typeof data.bio === 'string' ? data.bio.trim() : '';

  if (fullName.length < 2 || fullName.length > 80) {
    return { error: 'Full name must be between 2 and 80 characters.' };
  }
  if (jobTitle.length < 2 || jobTitle.length > 80) {
    return { error: 'Job title must be between 2 and 80 characters.' };
  }
  if (bio.length < 10 || bio.length > 450) {
    return { error: 'Bio must be between 10 and 450 characters.' };
  }

  const skills = Array.isArray(data.skills)
    ? data.skills
        .filter((s): s is string => typeof s === 'string' && s.trim().length > 0)
        .map((s) => s.trim().slice(0, 40))
        .slice(0, 10)
    : [];

  return {
    member: {
      fullName,
      jobTitle,
      specialty: specialty || undefined,
      bio,
      skills,
      photoUrl: sanitizePhotoUrl(data.photoUrl),
      linkedinUrl: sanitizeSafeHttpUrl(data.linkedinUrl),
      githubUrl: sanitizeSafeHttpUrl(data.githubUrl),
      portfolioUrl: sanitizeSafeHttpUrl(data.portfolioUrl),
      isFeatured: Boolean(data.isFeatured),
      isVisible: data.isVisible !== false,
    },
  };
}

function validateProjectInput(body: unknown): {
  error?: string;
  project?: Omit<ProjectRecord, 'id'>;
} {
  if (!body || typeof body !== 'object') {
    return { error: 'Invalid request body.' };
  }
  const data = body as Record<string, unknown>;
  const title = typeof data.title === 'string' ? data.title.trim() : '';
  const description = typeof data.description === 'string' ? data.description.trim() : '';
  const rawCategory = typeof data.category === 'string' ? data.category.trim() : '';

  if (title.length < 2 || title.length > 100) {
    return { error: 'Project name must be between 2 and 100 characters.' };
  }
  if (description.length < 10 || description.length > 500) {
    return { error: 'Description must be between 10 and 500 characters.' };
  }
  if (!VALID_PROJECT_CATEGORIES.includes(rawCategory as PortfolioCategory)) {
    return { error: 'Please select a valid project category.' };
  }

  const rawLiveUrl = typeof data.liveDemoUrl === 'string' ? data.liveDemoUrl.trim() : '';
  let liveDemoUrl = '';
  if (rawLiveUrl.length > 0) {
    const safe = sanitizeSafeHttpUrl(rawLiveUrl);
    if (!safe) {
      return { error: 'Please enter a valid http:// or https:// website URL.' };
    }
    liveDemoUrl = safe;
  }

  const techStack = Array.isArray(data.techStack)
    ? data.techStack
        .filter((t): t is string => typeof t === 'string' && t.trim().length > 0)
        .map((t) => t.trim().slice(0, 32))
        .slice(0, 8)
    : [];

  const overview =
    typeof data.overview === 'string' && data.overview.trim().length >= 10
      ? data.overview.trim().slice(0, 800)
      : description;

  const highlights = Array.isArray(data.highlights)
    ? data.highlights
        .filter((h): h is string => typeof h === 'string' && h.trim().length > 0)
        .map((h) => h.trim().slice(0, 140))
        .slice(0, 6)
    : ['Responsive layout across desktop, tablet, and mobile', 'Clean custom engineering'];

  const previewHeadline =
    typeof data.previewHeadline === 'string' && data.previewHeadline.trim()
      ? data.previewHeadline.trim().slice(0, 120)
      : title;

  const previewSubheadline =
    typeof data.previewSubheadline === 'string' && data.previewSubheadline.trim()
      ? data.previewSubheadline.trim().slice(0, 220)
      : description;

  return {
    project: {
      title,
      category: rawCategory as PortfolioCategory,
      thumbnail: sanitizeProjectThumbnail(data.thumbnail),
      description,
      overview,
      highlights,
      techStack: techStack.length > 0 ? techStack : ['React', 'TypeScript'],
      liveDemoUrl,
      previewHeadline,
      previewSubheadline,
      isSample: Boolean(data.isSample),
    },
  };
}

async function startServer() {
  const app = express();
  app.use(express.json({ limit: '5mb' }));

  // Admin auth endpoints (server-side verification + first-run claim when env passcode unset)
  app.get('/api/admin/status', (req, res) => {
    const envConfigured = Boolean(process.env.ADMIN_PASSCODE?.trim());
    const claimed = Boolean(readAdminAuthRecord());
    const authenticated = Boolean(verifyAdminTokenFromHeader(req.headers.authorization));
    res.json({ envConfigured, claimed, authenticated });
  });

  app.post('/api/admin/claim', (req, res) => {
    const envPasscode = process.env.ADMIN_PASSCODE?.trim();
    if (envPasscode) {
      res.status(403).json({
        error: 'Admin passcode is configured via environment secret. Sign in directly.',
      });
      return;
    }

    ensureDataDir();
    if (fs.existsSync(ADMIN_AUTH_FILE) && readAdminAuthRecord()) {
      res.status(403).json({
        error: 'Admin access has already been claimed. Please sign in with your passcode.',
      });
      return;
    }

    const passcode = typeof req.body?.passcode === 'string' ? req.body.passcode : '';
    if (passcode.length < 8 || passcode.length > 128) {
      res.status(400).json({
        error: 'Passcode must be between 8 and 128 characters.',
      });
      return;
    }

    const salt = crypto.randomBytes(16).toString('hex');
    const hash = hashPasscodeWithSalt(passcode, salt).toString('hex');
    const record: AdminAuthRecord = {
      salt,
      hash,
      claimedAt: new Date().toISOString(),
    };

    try {
      fs.writeFileSync(ADMIN_AUTH_FILE, JSON.stringify(record, null, 2), {
        encoding: 'utf8',
        flag: 'wx',
      });
    } catch {
      res.status(409).json({
        error: 'Admin access was already claimed. Please sign in.',
      });
      return;
    }

    const token = signAdminToken();
    res.status(201).json({ token });
  });

  app.post('/api/admin/login', (req, res) => {
    const clientIp = req.ip || 'unknown';
    const now = Date.now();
    const record = failedLoginAttempts.get(clientIp);
    if (record && record.resetAt > now && record.count >= 6) {
      res.status(429).json({
        error: 'Too many failed attempts. Please wait a minute and try again.',
      });
      return;
    }

    const passcode = typeof req.body?.passcode === 'string' ? req.body.passcode : '';
    if (!passcode) {
      res.status(400).json({ error: 'Please enter the admin passcode.' });
      return;
    }

    const envPasscode = process.env.ADMIN_PASSCODE?.trim();
    let valid = false;

    if (envPasscode) {
      valid = timingSafeCompareStrings(passcode, envPasscode);
    } else {
      const stored = readAdminAuthRecord();
      if (!stored) {
        res.status(409).json({
          error: 'No admin passcode configured yet. Set up your admin passcode first.',
        });
        return;
      }
      const computed = hashPasscodeWithSalt(passcode, stored.salt);
      const expected = Buffer.from(stored.hash, 'hex');
      if (computed.length === expected.length) {
        valid = crypto.timingSafeEqual(computed, expected);
      }
    }

    if (!valid) {
      const nextCount = record && record.resetAt > now ? record.count + 1 : 1;
      failedLoginAttempts.set(clientIp, {
        count: nextCount,
        resetAt: now + 60_000,
      });
      res.status(401).json({ error: 'Invalid admin passcode.' });
      return;
    }

    failedLoginAttempts.delete(clientIp);
    const token = signAdminToken();
    res.json({ token });
  });

  app.post('/api/admin/logout', (req, res) => {
    const payload = verifyAdminTokenFromHeader(req.headers.authorization);
    if (payload) {
      revokedTokenIds.add(payload.jti);
    }
    res.json({ ok: true });
  });

  // Public team read (only visible members)
  app.get('/api/team', (_req, res) => {
    const all = readTeamRecords();
    res.json({ members: getVisibleTeamMembers(all) });
  });

  // Admin full team read (includes hidden profiles)
  app.get('/api/admin/team', requireAdmin, (_req, res) => {
    const all = readTeamRecords();
    res.json({ members: all, visibleMembers: getVisibleTeamMembers(all) });
  });

  app.post('/api/team', requireAdmin, (req, res) => {
    const { error, member } = validateMemberInput(req.body);
    if (error || !member) {
      res.status(400).json({ error: error || 'Invalid member data.' });
      return;
    }

    const existing = readTeamRecords();
    const created: TeamMemberRecord = {
      id: `member-${crypto.randomUUID()}`,
      ...member,
    };
    const next = [...existing, created];
    writeTeamRecords(next);
    res.status(201).json({
      member: created,
      members: next,
      visibleMembers: getVisibleTeamMembers(next),
    });
  });

  app.put('/api/team/reorder', requireAdmin, (req, res) => {
    const orderedIds = req.body?.orderedIds;
    if (!Array.isArray(orderedIds) || orderedIds.some((id) => typeof id !== 'string')) {
      res.status(400).json({ error: 'Invalid member order list.' });
      return;
    }

    const existing = readTeamRecords();
    const byId = new Map(existing.map((m) => [m.id, m]));
    const next: TeamMemberRecord[] = [];
    const seen = new Set<string>();

    for (const id of orderedIds) {
      const found = byId.get(id);
      if (found && !seen.has(id)) {
        next.push(found);
        seen.add(id);
      }
    }
    for (const member of existing) {
      if (!seen.has(member.id)) {
        next.push(member);
      }
    }

    writeTeamRecords(next);
    res.json({ members: next, visibleMembers: getVisibleTeamMembers(next) });
  });

  app.put('/api/team/:id', requireAdmin, (req, res) => {
    const id = req.params.id;
    const { error, member } = validateMemberInput(req.body);
    if (error || !member) {
      res.status(400).json({ error: error || 'Invalid member data.' });
      return;
    }

    const existing = readTeamRecords();
    const index = existing.findIndex((m) => m.id === id);
    if (index === -1) {
      res.status(404).json({ error: 'Team member not found.' });
      return;
    }

    const updated: TeamMemberRecord = { id, ...member };
    const next = existing.map((m) => (m.id === id ? updated : m));
    writeTeamRecords(next);
    res.json({
      member: updated,
      members: next,
      visibleMembers: getVisibleTeamMembers(next),
    });
  });

  app.patch('/api/team/:id/visibility', requireAdmin, (req, res) => {
    const id = req.params.id;
    const existing = readTeamRecords();
    const target = existing.find((m) => m.id === id);
    if (!target) {
      res.status(404).json({ error: 'Team member not found.' });
      return;
    }

    const isVisible =
      typeof req.body?.isVisible === 'boolean'
        ? req.body.isVisible
        : target.isVisible === false;

    const updated: TeamMemberRecord = { ...target, isVisible };
    const next = existing.map((m) => (m.id === id ? updated : m));
    writeTeamRecords(next);
    res.json({
      member: updated,
      members: next,
      visibleMembers: getVisibleTeamMembers(next),
    });
  });

  app.delete('/api/team/:id', requireAdmin, (req, res) => {
    const id = req.params.id;
    const existing = readTeamRecords();
    const next = existing.filter((m) => m.id !== id);
    if (next.length === existing.length) {
      res.status(404).json({ error: 'Team member not found.' });
      return;
    }
    writeTeamRecords(next);
    res.json({ members: next, visibleMembers: getVisibleTeamMembers(next) });
  });

  app.post('/api/team/reset', requireAdmin, (_req, res) => {
    writeTeamRecords(INITIAL_TEAM_MEMBERS);
    res.json({
      members: INITIAL_TEAM_MEMBERS,
      visibleMembers: getVisibleTeamMembers(INITIAL_TEAM_MEMBERS),
    });
  });

  // Portfolio project endpoints
  app.get('/api/projects', (_req, res) => {
    const projects = readProjectRecords();
    res.json({ projects });
  });

  app.post('/api/projects', (req, res) => {
    const { error, project } = validateProjectInput(req.body);
    if (error || !project) {
      res.status(400).json({ error: error || 'Invalid project data.' });
      return;
    }

    const existing = readProjectRecords();
    const created: ProjectRecord = {
      id: `project-${crypto.randomUUID()}`,
      ...project,
      isSample: false,
    };
    const next = [created, ...existing];
    writeProjectRecords(next);
    res.status(201).json({ project: created, projects: next });
  });

  app.put('/api/projects/:id', (req, res) => {
    const id = req.params.id;
    const { error, project } = validateProjectInput(req.body);
    if (error || !project) {
      res.status(400).json({ error: error || 'Invalid project data.' });
      return;
    }

    const existing = readProjectRecords();
    const index = existing.findIndex((p) => p.id === id);
    if (index === -1) {
      res.status(404).json({ error: 'Project not found.' });
      return;
    }

    const updated: ProjectRecord = {
      id,
      ...project,
      isSample:
        Boolean(req.body?.isSample) &&
        Boolean(existing[index].isSample) &&
        !project.liveDemoUrl
          ? true
          : false,
    };
    const next = existing.map((p) => (p.id === id ? updated : p));
    writeProjectRecords(next);
    res.json({ project: updated, projects: next });
  });

  app.delete('/api/projects/:id', (req, res) => {
    const id = req.params.id;
    const existing = readProjectRecords();
    const next = existing.filter((p) => p.id !== id);
    if (next.length === existing.length) {
      res.status(404).json({ error: 'Project not found.' });
      return;
    }
    writeProjectRecords(next);
    res.json({ projects: next });
  });

  app.post('/api/projects/reset', (_req, res) => {
    writeProjectRecords(INITIAL_PROJECTS);
    res.json({ projects: INITIAL_PROJECTS });
  });

  if (!IS_PRODUCTION) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distDir = path.resolve(__dirname, 'dist');
    app.use(express.static(distDir));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(distDir, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`FSD Web Studio server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
