import {
  ProcessStep,
  SampleTestimonial,
  ServiceContactProfile,
  ServiceItem,
  WhyChooseUsItem,
} from '../types';

export const HERO_3D_IMAGE =
  '/src/assets/images/hero_forest_lime_3d_1795607201551.jpg';

export const STUDIO_IMAGES = {
  heroBackdrop: '/src/assets/images/hero_forest_lime_3d_1795607201551.jpg',
  heroMockupPreview: '/src/assets/images/hero_abstract_3d_web_1795605203405.jpg',
  aboutWorkspace: '/src/assets/images/about_studio_workspace_1795605206388.jpg',
  teamCollaboration: '/src/assets/images/studio_team_collaboration_1795692313362.jpg',
  ctaBackdrop: '/src/assets/images/cta_architectural_backdrop_1795692313261.jpg',
  portfolioCraft: '/src/assets/images/project_portfolio_minimal_1795607202030.jpg',
  discoveryStudio: '/src/assets/images/process_discovery_strategy_1795692312859.jpg',
  launchStudio: '/src/assets/images/process_launch_deployment_1795692312983.jpg',
  uiuxCraft: '/src/assets/images/service_uiux_design_1795692310972.jpg',
  responsiveCraft: '/src/assets/images/service_website_redesign_1795692312427.jpg',
};

export const SERVICES: ServiceItem[] = [
  {
    id: 'website-development',
    index: '01',
    title: 'Website Development',
    description:
      'Custom, responsive business websites engineered with clean code, fast load times, and clear paths to inquiry.',
    image: '/src/assets/images/portfolio_corporate_enterprise_1795605205814.jpg',
    iconName: 'Globe',
    deliverables: [
      'Responsive layouts across mobile, tablet, and desktop',
      'Clean semantic HTML and SEO-friendly page structure',
      'Easy content updates and contact form integration',
    ],
    idealFor: 'Small businesses, agencies, and international brands',
  },
  {
    id: 'ecommerce-development',
    index: '02',
    title: 'E-Commerce Development',
    description:
      'Modern online stores designed for effortless product discovery, mobile shopping, and smooth checkout experiences.',
    image: '/src/assets/images/portfolio_ecommerce_store_1795605205063.jpg',
    iconName: 'ShoppingBag',
    deliverables: [
      'Product catalog, category filtering, and shopping cart',
      'Secure payment gateway and order notification workflows',
      'Mobile-optimized product and checkout flows',
    ],
    idealFor: 'Retail brands, boutiques, and direct-to-consumer stores',
  },
  {
    id: 'ui-ux-design',
    index: '03',
    title: 'UI/UX Design',
    description:
      'Minimal, user-centered interface systems and prototypes that make complex digital products intuitive to use.',
    image: '/src/assets/images/service_uiux_design_1795692310972.jpg',
    iconName: 'Palette',
    deliverables: [
      'User flow mapping, wireframes, and visual hierarchy',
      'Accessible typography, spacing, and color systems',
      'Interactive prototypes ready for engineering handoff',
    ],
    idealFor: 'Startups, software teams, and brands launching new products',
  },
  {
    id: 'web-applications',
    index: '04',
    title: 'Web Applications',
    description:
      'Scalable custom web apps, client portals, and internal dashboards tailored to your specific operational workflows.',
    image: '/src/assets/images/portfolio_fintech_platform_1795605205058.jpg',
    iconName: 'Cpu',
    deliverables: [
      'Custom React and TypeScript application architecture',
      'User accounts, role permissions, and API integrations',
      'Clean state management and modular code structure',
    ],
    idealFor: 'Startups, SaaS founders, and growing service teams',
  },
  {
    id: 'landing-page-development',
    index: '05',
    title: 'Landing Page Development',
    description:
      'Focused, high-clarity landing pages built for marketing campaigns, product launches, and direct lead capture.',
    image: '/src/assets/images/portfolio_saas_landing_1795605206919.jpg',
    iconName: 'LayoutTemplate',
    deliverables: [
      'Conversion-focused section flow and clear CTAs',
      'Lightweight, fast-loading responsive implementation',
      'Direct WhatsApp and email lead routing',
    ],
    idealFor: 'Product launches, ad campaigns, and entrepreneurs',
  },
  {
    id: 'seo-optimization',
    index: '06',
    title: 'SEO & Optimization',
    description:
      'Technical SEO foundations, semantic structure, and Core Web Vitals tuning to improve search visibility and speed.',
    image: '/src/assets/images/service_seo_analytics_1795692311402.jpg',
    iconName: 'Search',
    deliverables: [
      'Metadata, OpenGraph, and Schema.org structured data',
      'Page speed improvements and asset optimization',
      'Clean heading hierarchy and crawlable URL structure',
    ],
    idealFor: 'Businesses looking to strengthen organic search presence',
  },
  {
    id: 'website-redesign',
    index: '07',
    title: 'Website Redesign',
    description:
      'Thoughtful modernization of outdated websites into crisp, mobile-ready platforms aligned with your current brand.',
    image: '/src/assets/images/service_website_redesign_1795692312427.jpg',
    iconName: 'RefreshCw',
    deliverables: [
      'UX review of existing pages and navigation bottlenecks',
      'Modern visual refresh with improved readability',
      'Careful content migration and redirect planning',
    ],
    idealFor: 'Established businesses outgrowing legacy websites',
  },
  {
    id: 'website-maintenance',
    index: '08',
    title: 'Website Maintenance',
    description:
      'Dependable ongoing updates, security checks, backups, and performance monitoring to keep your site running smoothly.',
    image: '/src/assets/images/service_maintenance_code_1795692311353.jpg',
    iconName: 'ShieldCheck',
    deliverables: [
      'Regular content, UI, and dependency updates',
      'Routine backups and uptime health checks',
      'Priority support for fixes and new sections',
    ],
    idealFor: 'Teams wanting reliable long-term technical support',
  },
];

export const PROCESS_STEPS: ProcessStep[] = [
  {
    number: '01',
    title: 'Discover',
    description:
      'We align on your business goals, target audience, content structure, and technical scope before any design begins.',
    output: 'Scope & Sitemap',
    image: '/src/assets/images/process_discovery_strategy_1795692312859.jpg',
  },
  {
    number: '02',
    title: 'Design',
    description:
      'We craft clean, minimalist layouts and responsive user journeys tailored to build trust and guide visitor action.',
    output: 'UI/UX Direction',
    image: '/src/assets/images/service_uiux_design_1795692310972.jpg',
  },
  {
    number: '03',
    title: 'Develop',
    description:
      'We engineer your website or web app with modern TypeScript, React, Tailwind CSS, and smooth motion interactions.',
    output: 'Responsive Build',
    image: '/src/assets/images/service_maintenance_code_1795692311353.jpg',
  },
  {
    number: '04',
    title: 'Launch',
    description:
      'We verify cross-device responsiveness, SEO metadata, and speed performance, then deploy cleanly with ongoing support.',
    output: 'Live Deployment',
    image: '/src/assets/images/process_launch_deployment_1795692312983.jpg',
  },
];

export const WHY_CHOOSE_US: WhyChooseUsItem[] = [
  {
    title: 'Modern design',
    description:
      'Minimalist typography, balanced whitespace, and intentional visual hierarchy that position your brand with authority.',
    image: '/src/assets/images/hero_abstract_3d_web_1795605203405.jpg',
    iconName: 'Sparkles',
  },
  {
    title: 'Mobile-first development',
    description:
      'Every interface is structured to feel effortless on smartphones, tablets, and wide desktop screens alike.',
    image: '/src/assets/images/service_website_redesign_1795692312427.jpg',
    iconName: 'Smartphone',
  },
  {
    title: 'Fast performance',
    description:
      'Lean codebases, optimized imagery, and zero unnecessary bloat so visitors never wait for pages to load.',
    image: '/src/assets/images/service_seo_analytics_1795692311402.jpg',
    iconName: 'Zap',
  },
  {
    title: 'Client-focused approach',
    description:
      'We measure every design and technical choice against how clearly it serves your customers and business objectives.',
    image: '/src/assets/images/studio_team_collaboration_1795692313362.jpg',
    iconName: 'Users',
  },
  {
    title: 'Reliable communication',
    description:
      'Direct updates, clear milestones, and quick WhatsApp and email responsiveness from kickoff through launch.',
    image: '/src/assets/images/about_studio_workspace_1795605206388.jpg',
    iconName: 'MessageSquare',
  },
  {
    title: 'Custom solutions',
    description:
      'No cookie-cutter templates—every website, storefront, and web application is built around your exact needs.',
    image: '/src/assets/images/portfolio_saas_landing_1795605206919.jpg',
    iconName: 'Sliders',
  },
];

export const SAMPLE_TESTIMONIALS: SampleTestimonial[] = [
  {
    id: 'sample-1',
    label: 'Sample Testimonial · Format Preview',
    quote:
      'FSD Web Studio translated our vision into a clean, fast website that makes it effortless for international clients to understand our services and reach out.',
    authorPlaceholder: 'Client Name (Sample)',
    rolePlaceholder: 'Founder, Business Website Client',
    projectCategory: 'Website Development',
    image: '/src/assets/images/project_business_corporate_1795607201341.jpg',
  },
  {
    id: 'sample-2',
    label: 'Sample Testimonial · Format Preview',
    quote:
      'Communication stayed clear from our first discovery call through launch day. Our mobile shopping experience feels modern, structured, and easy to manage.',
    authorPlaceholder: 'Client Name (Sample)',
    rolePlaceholder: 'Director, E-Commerce Brand',
    projectCategory: 'E-Commerce Development',
    image: '/src/assets/images/project_ecommerce_botanical_1795607200381.jpg',
  },
  {
    id: 'sample-3',
    label: 'Sample Testimonial · Format Preview',
    quote:
      'They listened carefully to our workflow needs and delivered a custom web application interface our team could adopt immediately without confusion.',
    authorPlaceholder: 'Client Name (Sample)',
    rolePlaceholder: 'Product Lead, SaaS Startup',
    projectCategory: 'Web Applications',
    image: '/src/assets/images/project_webapp_dashboard_1795607202327.jpg',
  },
];

export const ABOUT_CONTENT = {
  title: 'We turn ideas into digital reality.',
  whoWeAre:
    'FSD Web Studio is a modern web development and digital solutions agency partnering with small businesses, startups, entrepreneurs, and international clients. We combine sharp minimalist design with dependable front-end and full-stack engineering to create digital platforms built for lasting value.',
  mission:
    'Our mission is to help ambitious businesses establish a credible, fast, and conversion-ready presence online—replacing cluttered templates with clear, custom-engineered websites and digital products.',
  vision:
    'Our vision is to be the trusted long-term technical and design partner for growing brands worldwide, known for thoughtful craft, transparent communication, and measurable clarity.',
  whyWorkWithUs: [
    'Direct collaboration with the designers and engineers building your project.',
    'Clean, maintainable React and TypeScript codebases ready for future expansion.',
    'Balanced focus on visual polish, mobile usability, speed, and search readiness.',
    'Transparent scoping, realistic milestones, and ongoing support after launch.',
  ],
};

export const SERVICE_CONTACT_PROFILES: Record<string, ServiceContactProfile> = {
  'Website Development': {
    serviceTitle: 'Website Development',
    kicker: 'Website Development · Inquiry Brief',
    headline: 'Start Your Custom Website Project',
    subheadline:
      'Share your business goals, target pages, and timeline. We will prepare a clear scope and WhatsApp-ready brief.',
    formHeading: 'Website Development Inquiry',
    budgetOptions: ['$1,000 – $2,500', '$2,500 – $5,000', '$5,000 – $10,000', '$10,000+'],
    scopeTags: [
      'Responsive Company Website',
      'CMS & Blog Setup',
      'Technical SEO Structure',
      'Contact & WhatsApp Forms',
    ],
    descriptionPlaceholder:
      'Tell us about your business, key pages needed, and your ideal launch date...',
    whatsappPitch:
      'Prefer to discuss your website directly? Send your prepared brief or chat on WhatsApp.',
    includedHighlights: [
      'Custom responsive design across mobile, tablet, and desktop',
      'Clean semantic structure and fast loading performance',
      'Direct inquiry routing via email and WhatsApp',
    ],
  },
  'E-Commerce Development': {
    serviceTitle: 'E-Commerce Development',
    kicker: 'E-Commerce Development · Inquiry Brief',
    headline: 'Build Your Modern Online Store',
    subheadline:
      'Tell us about your products, payment preferences, and shipping regions so we can plan a smooth shopping experience.',
    formHeading: 'E-Commerce Store Inquiry',
    budgetOptions: ['$2,000 – $4,500', '$4,500 – $8,500', '$8,500 – $15,000', '$15,000+'],
    scopeTags: [
      'Product Catalog & Filters',
      'Mobile Cart & Checkout',
      'Payment Gateway Integration',
      'Order Notifications',
    ],
    descriptionPlaceholder:
      'Share what products you sell, estimated catalog size, and preferred payment methods...',
    whatsappPitch:
      'Planning an online store launch or migration? Message us directly on WhatsApp.',
    includedHighlights: [
      'Clean product showcase and category filtering',
      'Mobile-friendly checkout flow and payment setup',
      'Organized product management for your team',
    ],
  },
  'UI/UX Design': {
    serviceTitle: 'UI/UX Design',
    kicker: 'UI/UX Design · Inquiry Brief',
    headline: 'Design an Intuitive Digital Experience',
    subheadline:
      'From wireframes to complete interface systems, share what product or website you are designing.',
    formHeading: 'UI/UX Design Inquiry',
    budgetOptions: ['$1,000 – $2,000', '$2,000 – $4,500', '$4,500 – $8,000', '$8,000+'],
    scopeTags: [
      'Wireframes & User Flows',
      'High-Fidelity UI Screens',
      'Design System & Tokens',
      'Interactive Prototype',
    ],
    descriptionPlaceholder:
      'Describe your product idea, target users, and how many screens or flows you need designed...',
    whatsappPitch:
      'Have sketches or product notes ready? Share them with our design team on WhatsApp.',
    includedHighlights: [
      'Clear user journeys grounded in usability principles',
      'Consistent typography, spacing, and color system',
      'Developer-ready interface specifications',
    ],
  },
  'Web Applications': {
    serviceTitle: 'Web Applications',
    kicker: 'Web Applications · Inquiry Brief',
    headline: 'Architect a Custom Web Application',
    subheadline:
      'Outline your user roles, core workflows, and integrations to receive a structured technical roadmap.',
    formHeading: 'Web Application Inquiry',
    budgetOptions: ['$4,000 – $8,500', '$8,500 – $16,000', '$16,000 – $30,000', '$30,000+'],
    scopeTags: [
      'User Auth & Dashboards',
      'Custom Business Workflows',
      'API & Database Integration',
      'Admin & Reporting Views',
    ],
    descriptionPlaceholder:
      'Explain the problem your web application solves, key user types, and required features...',
    whatsappPitch:
      'Building a SaaS MVP or client portal? Talk through your technical requirements on WhatsApp.',
    includedHighlights: [
      'Modular React and TypeScript application architecture',
      'Clean data flows and responsive dashboard views',
      'Scalable foundation built for ongoing iteration',
    ],
  },
  'Landing Page Development': {
    serviceTitle: 'Landing Page Development',
    kicker: 'Landing Page Development · Inquiry Brief',
    headline: 'Launch a High-Clarity Campaign Landing Page',
    subheadline:
      'Built for product launches, ad campaigns, and lead generation with crisp hierarchy and fast loading.',
    formHeading: 'Landing Page Inquiry',
    budgetOptions: ['$600 – $1,200', '$1,200 – $2,500', '$2,500 – $4,500', '$4,500+'],
    scopeTags: [
      'Focused Conversion Layout',
      'Mobile-First Speed',
      'Lead Capture & WhatsApp CTA',
      'Analytics Ready',
    ],
    descriptionPlaceholder:
      'Describe your product or campaign offer, target audience, and launch timeline...',
    whatsappPitch:
      'Need a clean campaign landing page built quickly? Message us on WhatsApp.',
    includedHighlights: [
      'Clear above-the-fold messaging and primary CTA',
      'Fast, responsive build tested on mobile and desktop',
      'Ready for paid traffic or product announcements',
    ],
  },
  'SEO & Optimization': {
    serviceTitle: 'SEO & Optimization',
    kicker: 'SEO & Optimization · Inquiry Brief',
    headline: 'Improve Website Speed & Search Readiness',
    subheadline:
      'Share your current website link and goals so we can evaluate technical SEO, metadata, and performance.',
    formHeading: 'SEO & Optimization Inquiry',
    budgetOptions: ['$750 – $1,500', '$1,500 – $3,000', '$3,000 – $5,500', '$5,500+'],
    scopeTags: [
      'Technical SEO Audit',
      'Metadata & Schema.org',
      'Core Web Vitals Tuning',
      'On-Page Structure',
    ],
    descriptionPlaceholder:
      'Include your current website URL, target search regions, and performance goals...',
    whatsappPitch:
      'Send your website URL on WhatsApp for a quick technical review.',
    includedHighlights: [
      'Structured headings, metadata, and Schema.org setup',
      'Asset and code optimization for faster page loads',
      'Actionable visibility recommendations',
    ],
  },
  'Website Redesign': {
    serviceTitle: 'Website Redesign',
    kicker: 'Website Redesign · Inquiry Brief',
    headline: 'Modernize Your Existing Website',
    subheadline:
      'Upgrade an outdated layout into a clean, mobile-first digital presence without losing your existing brand equity.',
    formHeading: 'Website Redesign Inquiry',
    budgetOptions: ['$1,500 – $3,500', '$3,500 – $7,000', '$7,000 – $12,000', '$12,000+'],
    scopeTags: [
      'Modern UI Refresh',
      'Mobile Usability Fix',
      'Content & Redirect Planning',
      'Performance Upgrade',
    ],
    descriptionPlaceholder:
      'Share your current website link, what feels outdated, and what you want to improve...',
    whatsappPitch:
      'Share your current site link on WhatsApp to discuss a clean modernization plan.',
    includedHighlights: [
      'Complete visual and structural refresh',
      'Improved mobile navigation and readability',
      'Careful migration of existing pages and links',
    ],
  },
  'Website Maintenance': {
    serviceTitle: 'Website Maintenance',
    kicker: 'Website Maintenance · Inquiry Brief',
    headline: 'Ongoing Website Care & Technical Support',
    subheadline:
      'Keep your site secure, updated, and performing smoothly with reliable monthly engineering support.',
    formHeading: 'Website Maintenance Inquiry',
    budgetOptions: ['$200 / mo', '$450 / mo', '$900 / mo', '$1,500+ / mo'],
    scopeTags: [
      'Regular Updates & Fixes',
      'Backups & Security Checks',
      'Performance Monitoring',
      'New Page Additions',
    ],
    descriptionPlaceholder:
      'Share your website URL, platform or tech stack, and the level of monthly support needed...',
    whatsappPitch:
      'Need dependable ongoing website support or quick fixes? Chat with us on WhatsApp.',
    includedHighlights: [
      'Proactive updates and routine security checks',
      'Dependable turnaround for content and UI changes',
      'Direct communication with our development team',
    ],
  },
};
