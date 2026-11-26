export type PageId = 'home' | 'about' | 'team' | 'services' | 'portfolio' | 'contact';

export interface TeamMember {
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

export type PortfolioCategory =
  | 'E-Commerce'
  | 'Business Websites'
  | 'Portfolio Websites'
  | 'Web Applications';

export interface ServiceItem {
  id: string;
  index: string;
  title: string;
  description: string;
  image?: string;
  iconName:
    | 'Globe'
    | 'ShoppingBag'
    | 'Palette'
    | 'Cpu'
    | 'LayoutTemplate'
    | 'Search'
    | 'RefreshCw'
    | 'ShieldCheck';
  deliverables: string[];
  idealFor: string;
}

export interface PortfolioProject {
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

export interface ProcessStep {
  number: string;
  title: string;
  description: string;
  output: string;
  image?: string;
}

export interface WhyChooseUsItem {
  title: string;
  description: string;
  image?: string;
  iconName:
    | 'Sparkles'
    | 'Smartphone'
    | 'Zap'
    | 'Users'
    | 'MessageSquare'
    | 'Sliders';
}

export interface SampleTestimonial {
  id: string;
  label: string;
  quote: string;
  authorPlaceholder: string;
  rolePlaceholder: string;
  projectCategory: string;
  image?: string;
}

export interface ServiceContactProfile {
  serviceTitle: string;
  kicker: string;
  headline: string;
  subheadline: string;
  formHeading: string;
  budgetOptions: string[];
  scopeTags: string[];
  descriptionPlaceholder: string;
  whatsappPitch: string;
  includedHighlights: string[];
}
