import { localTones } from '../audio/localTone';
import type { DemoUser, MockProfile } from '../types/demo';

export const demoUser: DemoUser = {
  id: 'demo-user',
  name: 'Alex',
  age: 29,
  identity: 'woman',
  seeking: ['man'],
  ageRange: { min: 26, max: 40 },
  interests: ['night markets', 'climbing', 'cooking', 'live music'],
};

type Draft = Omit<MockProfile, 'audioPrompts' | 'coOpScenario' | 'photos'> & {
  tone: 0 | 1 | 2;
  color: string;
};

function prompts(name: string, tone: 0 | 1 | 2): MockProfile['audioPrompts'] {
  return [
    {
      promptText: 'A Sunday I would repeat',
      audioUrl: localTones[tone],
    },
    {
      promptText: `What ${name.split(' ')[0]} plays too loud`,
      audioUrl: localTones[(tone + 1) % localTones.length],
    },
  ];
}

function scenario(city: string): MockProfile['coOpScenario'] {
  return {
    scenarioTitle: `Saturday in ${city}`,
    prompts: [
      {
        question: 'The evening starts with',
        options: ['A walk', 'A kitchen', 'A ticketed show'],
      },
      {
        question: 'Hunger hits. You choose',
        options: ['Dumplings', 'Tacos', 'Something grilled'],
      },
      {
        question: 'The night ends',
        options: ['One more stop', 'Home by ten', 'A long way home'],
      },
    ],
  };
}

const drafts: Draft[] = [
  {
    id: 'jordan-hale',
    name: 'Jordan Hale',
    age: 31,
    identity: 'man',
    seeking: ['woman'],
    ageRange: { min: 26, max: 38 },
    styleCategory: 'Athletic',
    responseRate: '95% reply rate within 1 hour',
    interests: ['climbing', 'cooking', 'live music'],
    bounty: 'Dawn hike, then breakfast',
    isExplorer: false,
    bio: 'Sous chef who trains for short races and keeps Sundays unscheduled.',
    tone: 0,
    color: '#C44734',
    vibe: 'Looking for late-night boba',
  },
  {
    id: 'noa-kealoha',
    name: 'Noa Kealoha',
    age: 31,
    identity: 'man',
    seeking: ['woman'],
    ageRange: { min: 26, max: 38 },
    styleCategory: 'Outdoorsy',
    responseRate: '94% reply rate within 2 hours',
    interests: ['cooking', 'night markets'],
    bounty: 'A beach afternoon and grilled fish',
    isExplorer: false,
    bio: 'Short Pacific islander who waves at every boat and still cooks enough for whoever stays.',
    tone: 2,
    color: '#1F8A4C',
    vibe: 'On the beach until the light goes',
  },
  {
    id: 'andre-brooks',
    name: 'Andre Brooks',
    age: 33,
    identity: 'man',
    seeking: ['woman'],
    ageRange: { min: 27, max: 40 },
    styleCategory: 'Minimalist',
    responseRate: '88% reply rate within 3 hours',
    interests: ['cooking', 'museums'],
    bounty: 'Gallery late, then a quiet bar',
    isExplorer: false,
    bio: 'Architect who sketches bakeries for fun and answers messages before noon.',
    tone: 1,
    color: '#3F4A50',
  },
  {
    id: 'sam-ellis',
    name: 'Sam Ellis',
    age: 30,
    identity: 'man',
    seeking: ['woman'],
    ageRange: { min: 25, max: 36 },
    styleCategory: 'Outdoorsy',
    responseRate: '91% reply rate within 2 hours',
    interests: ['climbing', 'night markets'],
    bounty: 'River path and a thermos',
    isExplorer: false,
    bio: 'Field producer who would rather walk somewhere than reserve a table.',
    tone: 2,
    color: '#1F8A4C',
    vibe: 'Free after 8, near the river',
  },
  {
    id: 'chris-lang',
    name: 'Chris Lang',
    age: 32,
    identity: 'man',
    seeking: ['woman'],
    ageRange: { min: 26, max: 39 },
    styleCategory: 'Alternative',
    responseRate: '84% reply rate within 4 hours',
    interests: ['live music', 'night markets'],
    bounty: 'A band neither of you has seen',
    isExplorer: false,
    bio: 'Record-store buyer with strong opinions and a soft spot for weeknights.',
    tone: 0,
    color: '#78716C',
  },
  {
    id: 'nico-alvarez',
    name: 'Nico Alvarez',
    age: 28,
    identity: 'man',
    seeking: ['woman'],
    ageRange: { min: 24, max: 34 },
    styleCategory: 'High-Fashion',
    responseRate: '97% reply rate within 1 hour',
    interests: ['cooking', 'live music'],
    bounty: 'A tasting menu you split',
    isExplorer: false,
    bio: 'Stylist who will plan the outfit and let you plan the restaurant.',
    tone: 1,
    color: '#E25B45',
  },
  {
    id: 'theo-park',
    name: 'Theo Park',
    age: 26,
    identity: 'man',
    seeking: ['woman'],
    ageRange: { min: 24, max: 33 },
    styleCategory: 'High-Fashion',
    responseRate: '86% reply rate within 5 hours',
    interests: ['museums', 'live music'],
    bounty: 'A matinee and a long coffee',
    isExplorer: false,
    bio: 'Editor who reads on the train and texts back when the chapter ends.',
    tone: 0,
    color: '#1C1917',
  },
  {
    id: 'miles-grant',
    name: 'Miles Grant',
    age: 38,
    identity: 'man',
    seeking: ['woman'],
    ageRange: { min: 29, max: 42 },
    styleCategory: 'Athletic',
    responseRate: '80% reply rate within 1 day',
    interests: ['climbing', 'cooking', 'night markets'],
    bounty: 'A morning market run',
    isExplorer: false,
    bio: 'Product lead who guards his evenings and spends them cooking for people.',
    tone: 1,
    color: '#3F4A50',
  },
  {
    id: 'ben-okonkwo',
    name: 'Ben Okonkwo',
    age: 34,
    identity: 'man',
    seeking: ['woman'],
    ageRange: { min: 28, max: 40 },
    styleCategory: 'Alternative',
    responseRate: '87% reply rate within 4 hours',
    interests: ['live music', 'climbing'],
    bounty: 'A show, then a very late slice',
    isExplorer: true,
    explorerDates: 'May 1–12',
    explorerWindow: { startDate: '2027-05-01', endDate: '2027-05-12' },
    bio: 'Musician on a spring tour stop. His dates are the only window he is here.',
    tone: 2,
    color: '#E25B45',
  },
];

export const mockProfiles: MockProfile[] = drafts.map((draft) => ({
  id: draft.id,
  name: draft.name,
  age: draft.age,
  identity: draft.identity,
  seeking: draft.seeking,
  ageRange: draft.ageRange,
  styleCategory: draft.styleCategory,
  responseRate: draft.responseRate,
  interests: draft.interests,
  bounty: draft.bounty,
  isExplorer: draft.isExplorer,
  explorerDates: draft.explorerDates,
  explorerWindow: draft.explorerWindow,
  bio: draft.bio,
  vibe: draft.vibe,
  photos: [draft.color],
  audioPrompts: prompts(draft.name, draft.tone),
  coOpScenario: scenario(draft.isExplorer ? 'a city he is visiting' : 'this neighborhood'),
}));

export function getProfileById(id: string): MockProfile | undefined {
  return mockProfiles.find((profile) => profile.id === id);
}

export const seededIncomingIds = ['jordan-hale', 'andre-brooks'];
