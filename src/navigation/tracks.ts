import type { SearchTrack } from '../types/demo';

export type TrackMeta = {
  id: SearchTrack;
  icon: string;
  line: string;
  detail: string;
};

export const searchTrackMeta: TrackMeta[] = [
  {
    id: 'Aesthetic',
    icon: '👠',
    line: 'Who attracts you',
    detail: 'Style tags: Athletic, Alternative, Minimalist, High-Fashion, Outdoorsy.',
  },
  {
    id: 'Commonalities',
    icon: '🧲',
    line: 'Who intrigues you',
    detail: 'Overlap on hobbies and the interests already on your profile.',
  },
  {
    id: 'Activities',
    icon: '🎤',
    line: 'What fulfills you',
    detail: 'Date bounties: an outing someone is already willing to do.',
  },
  {
    id: 'Adventure',
    icon: '🍀',
    line: 'Low-stakes excitement',
    detail: 'An opt-in wildcard round. A chat still waits until you Allow DMs.',
  },
  {
    id: 'Location',
    icon: '🌍',
    line: 'Now or later',
    detail: 'People who live here stay separate from visitors with travel dates.',
  },
];

export function matchTrack(text: string): SearchTrack | null {
  const value = text.trim().toLowerCase();
  if (!value) {
    return null;
  }
  const found = searchTrackMeta.find(
    (item) => item.id.toLowerCase() === value || item.id.toLowerCase().startsWith(value),
  );
  return found?.id ?? null;
}
