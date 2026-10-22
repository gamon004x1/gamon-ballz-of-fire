import { stackGroups } from './home';

export const homepageCardKeys = [
  'about',
  'projects',
  'now',
  'stack',
  'activity',
  'notes',
  'blog',
  'lab',
  'credentials',
  'contact',
] as const;

export type HomepageCardKey = (typeof homepageCardKeys)[number];

export interface HomepageCardConfig {
  visible: boolean;
  eyebrow: string;
  title: string;
  description: string;
}

export interface HomepageAffiliation {
  name: string;
  relationship: string;
  logo: string;
  url?: string;
}

export type HomepageCredentialType =
  'certification' | 'digital_badge' | 'course' | 'training' | 'license';

export type HomepageCredentialSource =
  'credly' | 'linkedin' | 'issuer' | 'manual';

export interface HomepageCredential {
  id: string;
  title: string;
  issuer: string;
  type: HomepageCredentialType;
  image: string | null;
  verificationUrl: string | null;
  credentialId?: string | null;
  source: HomepageCredentialSource;
  sourceUrl: string | null;
  issuedAt: string | null;
  expiresAt: string | null;
  featured: boolean;
  visible: boolean;
  order: number;
}

export interface HomepageConfig {
  heroName: string;
  heroRoles: string[];
  portrait: string;
  aboutParagraphs: string[];
  affiliations: HomepageAffiliation[];
  /** Curated credential records used by the homepage and public archive. */
  credentials: HomepageCredential[];
  /** Retained for compatibility with settings and revisions saved before affiliations. */
  aboutMetadata: Array<{ label: string; value: string }>;
  projectLimit: number;
  noteLimit: number;
  blogLimit: number;
  labLimit: number;
  activityStatus: string;
  stackGroups: Array<{ title: string; items: string[] }>;
  cards: Record<HomepageCardKey, HomepageCardConfig>;
}

export const defaultHomepageConfig: HomepageConfig = {
  heroName: 'gamon ballz of fire🔥',
  heroRoles: [
    'Tokusatsu enthusiast.',
    'Collector of random things.',
    'Occasional creator.',
    'Internet wanderer.',
  ],
  portrait: '/images/gamon-elio-portrait.jpeg',
  aboutParagraphs: [
    "welcome to my little corner of the internet. i like tokusatsu, video games, anime, collecting things, and making stuff whenever i feel like it. you'll probably find a little bit of everything here.",
    'This is where I keep journal entries, ideas, favorite finds, and small creative experiments. I get a little carried away talking about the things I love.',
  ],
  affiliations: [],
  credentials: [],
  aboutMetadata: [
    { label: 'interests', value: 'tokusatsu  anime  games  collectibles' },
    { label: 'making', value: 'creative projects  little experiments' },
  ],
  projectLimit: 4,
  noteLimit: 3,
  blogLimit: 3,
  labLimit: 3,
  activityStatus: 'watching, collecting, and making things',
  stackGroups,
  cards: {
    about: {
      visible: true,
      eyebrow: 'About',
      title: 'A little about me and this place.',
      description: '',
    },
    projects: {
      visible: true,
      eyebrow: 'Featured Projects',
      title: 'Things I have been making.',
      description: '',
    },
    now: {
      visible: true,
      eyebrow: 'Now',
      title: 'What has my attention lately',
      description: '',
    },
    stack: {
      visible: true,
      eyebrow: 'Interests',
      title: 'Things I keep coming back to',
      description: '',
    },
    activity: {
      visible: false,
      eyebrow: 'GitHub Activity',
      title: 'Building in public',
      description: 'Public work, experiments, and project commits live here.',
    },
    notes: {
      visible: true,
      eyebrow: 'Featured Notes',
      title: 'Bits from my notebook',
      description: '',
    },
    blog: {
      visible: true,
      eyebrow: 'Journal',
      title: 'Longer thoughts from the journal',
      description: '',
    },
    lab: {
      visible: true,
      eyebrow: 'Featured Lab',
      title: 'Small experiments and odds and ends',
      description: '',
    },
    credentials: {
      visible: false,
      eyebrow: 'Credentials',
      title: 'Certifications & Badges',
      description: '',
    },
    contact: {
      visible: false,
      eyebrow: 'Contact',
      title: 'Find the project',
      description: 'The source for this little site lives on GitHub.',
    },
  },
};
