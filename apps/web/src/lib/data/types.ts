import type {
  Compensation,
  Currency,
  Opportunity,
  PostKind,
  ProjectStage,
  ReputationEventKind,
  Track,
} from '@hackerland/core';

export interface ExperienceBadge {
  label: string;
  tone: Track | 'neutral';
}

export interface PersonRef {
  handle: string;
  name: string;
  avatarUrl?: string;
  headline?: string;
  badges: ExperienceBadge[];
}

export interface OpenRole {
  id: string;
  title: string;
  track: Track;
  skills: string[];
  description: string;
  compensation: Compensation;
}

export interface Resource {
  name: string;
  qty: number;
  spec?: string;
  cost?: number;
  currency?: Currency;
  status: 'funded' | 'sourcing' | 'needs-funding';
}

export interface ProjectSummary {
  slug: string;
  title: string;
  summary: string;
  tracks: Track[];
  stage: ProjectStage;
  licence: string;
  squad: PersonRef[];
  squadSize: number;
  openRoleCount: number;
  funding?: {
    goal: number;
    raised: number;
    currency: Currency;
  };
  updatedAt: string;
}

export interface ProjectDetail extends ProjectSummary {
  body: string;
  leads: (PersonRef & { role: string; bio: string; skills: string[] })[];
  openRoles: OpenRole[];
  resources: Resource[];
  updates: FeedPost[];
  milestone: {
    current: number;
    total: number;
    label: string;
    next: string;
  };
}

export interface FeedPost {
  id: string;
  kind: PostKind;
  author: PersonRef;
  coAuthors?: PersonRef[];
  project?: {
    slug: string;
    title: string;
  };
  title: string;
  body: string;
  tags: string[];
  createdAt: string;
  reactions: number;
  comments: number;
  progress?: {
    current: number;
    total: number;
    label: string;
  };
  code?: {
    filename: string;
    language: string;
    source: string;
  };
  acceptedAnswer?: {
    author: PersonRef;
    body: string;
    code?: {
      filename: string;
      language: string;
      source: string;
    };
  };
  squadCall?: {
    openRoles: OpenRole[];
    funding?: ProjectSummary['funding'];
  };
}

export type OpportunityView = Opportunity & {
  id: string;
  projectSlug?: string;
};

export interface RoadmapModule {
  title: string;
  provider: string;
  hours: number;
  free: boolean;
  certified: boolean;
  url?: string;
}

export interface RoadmapStage {
  title: string;
  status: 'done' | 'active' | 'locked';
  modules: RoadmapModule[];
}

export interface RoadmapView {
  slug: string;
  title: string;
  track: Track;
  level: 'beginner' | 'intermediate' | 'advanced';
  summary: string;
  hours: number;
  learners: number;
  stages: RoadmapStage[];
}

export interface ProfileView {
  handle: string;
  name: string;
  headline: string;
  bio: string;
  location: string;
  avatarUrl?: string;
  tracks: Track[];
  skills: string[];
  badges: ExperienceBadge[];
  links: { label: string; url: string }[];
  reputation: number;
  stats: {
    projects: number;
    endorsements: number;
    contributions: number;
    earned: { amount: number; currency: Currency };
  };
  projects: ProjectSummary[];
  mentorships: (PersonRef & { relation: 'mentor' | 'mentee'; project?: string })[];
  credentials: { title: string; issuer: string }[];
  endorsements: { author: PersonRef; quote: string }[];
  recentReputation: {
    kind: ReputationEventKind;
    points: number;
    label: string;
    at: string;
  }[];
}

export interface PlatformStats {
  members: number;
  projects: number;
  openOpportunities: number;
  rewardsPool: {
    amount: number;
    currency: Currency;
  };
}

export type LabNodeType = 'atl' | 'fablab' | 'college' | 'incubator';

export interface LabEquipment {
  name: string;
  model?: string;
  count: number;
  status: 'available' | 'in-use' | 'maintenance';
}

export interface LabNodeView {
  id: string;
  slug: string;
  name: string;
  type: LabNodeType;
  institution: string;
  location: {
    city: string;
    state: string;
    pincode: string;
  };
  tools: string[];
  equipmentList: LabEquipment[];
  isVerified: boolean;
  contact: {
    name: string;
    role: string;
    email: string;
  };
  benchServiceUrl?: string;
  createdAt?: string;
}

