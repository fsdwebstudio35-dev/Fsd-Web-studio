import { PortfolioProject } from '../types';

/**
 * Starter Sample Projects
 * Clearly marked with `isSample: true` and without invented external URLs.
 * Add or edit your real client projects directly in the Portfolio Manager UI or here.
 */
export const PORTFOLIO_PROJECTS: PortfolioProject[] = [
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
