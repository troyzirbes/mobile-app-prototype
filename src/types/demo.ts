export type StyleCategory =
  | 'Athletic'
  | 'Alternative'
  | 'Minimalist'
  | 'High-Fashion'
  | 'Outdoorsy';

export type Identity = 'woman' | 'man' | 'nonbinary';

export type SearchTrack =
  | 'Aesthetic'
  | 'Commonalities'
  | 'Activities'
  | 'Random'
  | 'Exploration';

export type AudioPrompt = {
  promptText: string;
  audioUrl: string;
};

export type CoOpPrompt = {
  question: string;
  options: string[];
};

export type MockProfile = {
  id: string;
  name: string;
  age: number;
  identity: Identity;
  seeking: Identity[];
  ageRange: { min: number; max: number };
  styleCategory: StyleCategory;
  responseRate: string;
  interests: string[];
  bounty: string;
  isExplorer: boolean;
  explorerDates?: string;
  explorerWindow?: { startDate: string; endDate: string };
  bio: string;
  audioPrompts: AudioPrompt[];
  coOpScenario: {
    scenarioTitle: string;
    prompts: CoOpPrompt[];
  };
  photos: string[];
  vibe?: string;
};

export type ChatMessage = {
  id: string;
  from: 'you' | 'them';
  text: string;
  at: number;
};

export type ActiveChat = {
  id: string;
  profile: MockProfile;
  messages: ChatMessage[];
};

export type VibeStatus = {
  text: string;
  expiresAt: number;
  audience: 'off' | 'learning';
};

export type AttentionGate = {
  enabled: boolean;
  maxActiveChats: number;
  autoToggleOnThreshold: boolean;
};

export type DateRange = {
  startDate: string | null;
  endDate: string | null;
};

export type DemoUser = {
  id: string;
  name: string;
  age: number;
  identity: Identity;
  seeking: Identity[];
  ageRange: { min: number; max: number };
  interests: string[];
};
