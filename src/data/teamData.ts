import { TeamMember } from '../types';

/**
 * Initial Team Roster for FSD Web Studio
 * Profile photos and social links remain editable placeholders until real details are added via Admin Dashboard.
 */
export const INITIAL_TEAM_MEMBERS: TeamMember[] = [
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
