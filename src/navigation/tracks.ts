import type { SearchTrack } from '../types/demo';

export type TrackMeta = {
  id: SearchTrack;
  line: string;
  detail: string;
};

export const searchTrackMeta: TrackMeta[] = [
  {
    id: 'Aesthetic',
    line: 'Who attracts you',
    detail: 'Style tags: Athletic, Alternative, Minimalist, High-Fashion, Outdoorsy.',
  },
  {
    id: 'Commonalities',
    line: 'Who intrigues you',
    detail: 'Overlap on hobbies and the interests already on your profile.',
  },
  {
    id: 'Activities',
    line: 'What fulfills you',
    detail: 'Date bounties: an outing someone is already willing to do.',
  },
  {
    id: 'Adventure',
    line: 'Low-stakes excitement',
    detail: 'An opt-in wildcard round. A chat still waits until you Allow DMs.',
  },
  {
    id: 'Location',
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
