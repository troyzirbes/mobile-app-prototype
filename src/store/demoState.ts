import { demoUser, getProfileById, mockProfiles, seededIncomingIds } from '../data/mockData';
import type { ActiveChat, AttentionGate, DateRange, MockProfile, SearchTrack, StyleCategory, VibeStatus } from '../types/demo';
import { applyRegen, DAY_MS, ENERGY_LIKE, ENERGY_NOTE, maxEnergy } from './energy';
import { filterProfilesForTrack, isMutualMatch } from './matching';

export type DemoData = {
  energyTokens: number;
  lastRegenTimestamp: number;
  isPaidMember: boolean;
  isIncognito: boolean;
  attentionGate: AttentionGate;
  activeTrack: SearchTrack;
  aestheticStyle: StyleCategory | 'All';
  explorerDateRange: DateRange | null;
  randomSalt: number;
  lastChallengeIssuedTimestamp: number | null;
  incomingLikes: MockProfile[];
  learningStageQueue: MockProfile[];
  activeChats: ActiveChat[];
  verifiedUntil: Record<string, number>;
  revealedIds: string[];
  blindAudition: boolean;
  voiceHeardIds: string[];
  coOpCompletedIds: string[];
  vibe: VibeStatus | null;
  statusMessage: string | null;
};

export type Step = {
  data: DemoData;
  message: string | null;
  ok: boolean;
};

function profilesByIds(ids: string[]): MockProfile[] {
  return ids.flatMap((id) => {
    const profile = getProfileById(id);
    return profile ? [profile] : [];
  });
}

export function createInitialDemo(now = Date.now()): DemoData {
  return {
    energyTokens: 80,
    lastRegenTimestamp: now,
    isPaidMember: true,
    isIncognito: false,
    attentionGate: {
      enabled: true,
      maxActiveChats: 2,
      autoToggleOnThreshold: true,
    },
    activeTrack: 'Commonalities',
    aestheticStyle: 'All',
    explorerDateRange: null,
    randomSalt: 1,
    lastChallengeIssuedTimestamp: null,
    incomingLikes: profilesByIds(seededIncomingIds),
    learningStageQueue: [],
    activeChats: [],
    verifiedUntil: {},
    revealedIds: [],
    blindAudition: false,
    voiceHeardIds: [],
    coOpCompletedIds: [],
    vibe: null,
    statusMessage: null,
  };
}

export function withRegen(data: DemoData, now: number): DemoData {
  const next = applyRegen(
    data.energyTokens,
    data.lastRegenTimestamp,
    now,
    data.isPaidMember,
  );
  return { ...data, ...next };
}

export function spendEnergy(data: DemoData, amount: number, now: number): Step {
  const refreshed = withRegen(data, now);
  if (refreshed.energyTokens < amount) {
    return {
      data: refreshed,
      ok: false,
      message: `You need ${amount} energy. You have ${refreshed.energyTokens}.`,
    };
  }
  return {
    data: { ...refreshed, energyTokens: refreshed.energyTokens - amount },
    ok: true,
    message: null,
  };
}

export function adjustEnergy(data: DemoData, delta: number, now: number): DemoData {
  const refreshed = withRegen(data, now);
  const cap = maxEnergy(refreshed.isPaidMember);
  return {
    ...refreshed,
    energyTokens: Math.max(0, Math.min(cap, refreshed.energyTokens + delta)),
  };
}

function withoutProfile(data: DemoData, profileId: string): Pick<
  DemoData,
  'incomingLikes' | 'learningStageQueue'
> {
  return {
    incomingLikes: data.incomingLikes.filter((profile) => profile.id !== profileId),
    learningStageQueue: data.learningStageQueue.filter((profile) => profile.id !== profileId),
  };
}

export function sendLike(data: DemoData, profileId: string, note: string | null, now: number): Step {
  const spent = spendEnergy(data, note ? ENERGY_NOTE : ENERGY_LIKE, now);
  if (!spent.ok) {
    return spent;
  }
  const profile = getProfileById(profileId);
  if (!profile) {
    return { data: spent.data, ok: false, message: 'That profile is not in the local deck.' };
  }
  const alreadyLearning = spent.data.learningStageQueue.some((item) => item.id === profileId);
  return {
    data: {
      ...spent.data,
      ...withoutProfile(spent.data, profileId),
      learningStageQueue: alreadyLearning
        ? spent.data.learningStageQueue
        : [...spent.data.learningStageQueue.filter((item) => item.id !== profileId), profile],
    },
    ok: true,
    message: note
      ? `Note sent to ${profile.name}. They liked you back into the Learning Stage, not a chat.`
      : `${profile.name} liked you back. Messaging stays closed until you allow it.`,
  };
}

export function reciprocateLike(data: DemoData, profileId: string, now: number): Step {
  const profile = data.incomingLikes.find((item) => item.id === profileId);
  if (!profile) {
    return { data, ok: false, message: 'That like is no longer waiting.' };
  }
  const spent = spendEnergy(data, ENERGY_LIKE, now);
  if (!spent.ok) {
    return spent;
  }
  return {
    data: {
      ...spent.data,
      incomingLikes: spent.data.incomingLikes.filter((item) => item.id !== profileId),
      learningStageQueue: [...spent.data.learningStageQueue, profile],
    },
    ok: true,
    message: `${profile.name} is in the Learning Stage. Direct messaging is still closed.`,
  };
}

export function disallowDM(data: DemoData, profileId: string): Step {
  const profile = data.learningStageQueue.find((item) => item.id === profileId);
  if (!profile) {
    return { data, ok: false, message: 'They are not in the Learning Stage.' };
  }
  return {
    data: {
      ...data,
      learningStageQueue: data.learningStageQueue.filter((item) => item.id !== profileId),
    },
    ok: true,
    message: `You and ${profile.name} are strangers again.`,
  };
}

function openChat(profile: MockProfile, now: number): ActiveChat {
  return {
    id: `chat-${profile.id}`,
    profile,
    messages: [
      {
        id: `m-${profile.id}-open`,
        from: 'them',
        text: `Glad you allowed this, Alex. I'm ${profile.name.split(' ')[0]}.`,
        at: now,
      },
    ],
  };
}

export function allowDM(data: DemoData, profileId: string, now: number): Step {
  const profile = data.learningStageQueue.find((item) => item.id === profileId);
  if (!profile) {
    return { data, ok: false, message: 'They are not in the Learning Stage.' };
  }
  const full =
    data.attentionGate.enabled &&
    data.activeChats.length >= data.attentionGate.maxActiveChats;
  if (full) {
    const incognito = data.attentionGate.autoToggleOnThreshold ? true : data.isIncognito;
    return {
      data: { ...data, isIncognito: incognito },
      ok: false,
      message: data.attentionGate.autoToggleOnThreshold
        ? 'The attention gate is full, so Incognito turned on. No chat opened.'
        : 'The attention gate is full. Close a chat before allowing another.',
    };
  }
  return {
    data: {
      ...data,
      learningStageQueue: data.learningStageQueue.filter((item) => item.id !== profileId),
      activeChats: [...data.activeChats, openChat(profile, now)],
    },
    ok: true,
    message: `Chat with ${profile.name} is open.`,
  };
}

export function closeChat(data: DemoData, chatId: string): DemoData {
  return {
    ...data,
    activeChats: data.activeChats.filter((chat) => chat.id !== chatId),
  };
}

export function appendMessage(
  data: DemoData,
  chatId: string,
  from: 'you' | 'them',
  text: string,
  now: number,
): DemoData {
  return {
    ...data,
    activeChats: data.activeChats.map((chat) =>
      chat.id === chatId
        ? {
            ...chat,
            messages: [
              ...chat.messages,
              { id: `m-${chatId}-${now}-${from}`, from, text, at: now },
            ],
          }
        : chat,
    ),
  };
}

export function beginChallenge(data: DemoData, profileId: string, now: number): Step {
  const last = data.lastChallengeIssuedTimestamp;
  if (last !== null && now - last < DAY_MS) {
    const hours = Math.max(1, Math.ceil((DAY_MS - (now - last)) / (60 * 60 * 1000)));
    return {
      data,
      ok: false,
      message: `One challenge every 24 hours. Next one is in about ${hours}h.`,
    };
  }
  const profile = getProfileById(profileId);
  return {
    data: { ...data, lastChallengeIssuedTimestamp: now },
    ok: true,
    message: `Challenge started for ${profile?.name ?? 'this profile'}.`,
  };
}

export function grantVerified(data: DemoData, profileId: string, now: number): DemoData {
  return {
    ...data,
    verifiedUntil: { ...data.verifiedUntil, [profileId]: now + DAY_MS },
    statusMessage: 'Recently Verified for 24 hours.',
  };
}

function rememberReveal(data: DemoData, profileId: string): DemoData {
  if (data.revealedIds.includes(profileId)) {
    return data;
  }
  return { ...data, revealedIds: [...data.revealedIds, profileId] };
}

export function markVoiceHeard(data: DemoData, profileId: string): DemoData {
  const voiceHeardIds = data.voiceHeardIds.includes(profileId)
    ? data.voiceHeardIds
    : [...data.voiceHeardIds, profileId];
  return rememberReveal({ ...data, voiceHeardIds }, profileId);
}

export function markCoOpComplete(data: DemoData, profileId: string): DemoData {
  const coOpCompletedIds = data.coOpCompletedIds.includes(profileId)
    ? data.coOpCompletedIds
    : [...data.coOpCompletedIds, profileId];
  return rememberReveal({ ...data, coOpCompletedIds }, profileId);
}

export function photosRevealed(data: DemoData, profileId: string): boolean {
  if (!data.blindAudition) {
    return true;
  }
  return (
    data.revealedIds.includes(profileId) ||
    data.voiceHeardIds.includes(profileId) ||
    data.coOpCompletedIds.includes(profileId)
  );
}

export function discoverProfiles(data: DemoData): MockProfile[] {
  const busy = [
    ...data.incomingLikes.map((profile) => profile.id),
    ...data.learningStageQueue.map((profile) => profile.id),
    ...data.activeChats.map((chat) => chat.profile.id),
  ];
  return filterProfilesForTrack(
    mockProfiles,
    demoUser,
    data.activeTrack,
    data.aestheticStyle,
    data.explorerDateRange,
    data.randomSalt,
    busy,
  );
}

export function simulateIncomingLike(data: DemoData): Step {
  const busy = new Set([
    ...data.incomingLikes.map((profile) => profile.id),
    ...data.learningStageQueue.map((profile) => profile.id),
    ...data.activeChats.map((chat) => chat.profile.id),
  ]);
  const profile = mockProfiles.find(
    (item) => isMutualMatch(demoUser, item) && !item.isExplorer && !busy.has(item.id),
  );
  if (!profile) {
    return { data, ok: false, message: 'No local profiles are left to like you.' };
  }
  return {
    data: { ...data, incomingLikes: [...data.incomingLikes, profile] },
    ok: true,
    message: `${profile.name} liked you. Reciprocating opens the Learning Stage, not a chat.`,
  };
}

export function fillAttentionGate(data: DemoData, now: number): Step {
  const chats = [...data.activeChats];
  const used = new Set(chats.map((chat) => chat.profile.id));
  const candidates = mockProfiles.filter(
    (profile) => isMutualMatch(demoUser, profile) && !profile.isExplorer && !used.has(profile.id),
  );
  for (const profile of candidates) {
    if (chats.length >= data.attentionGate.maxActiveChats) {
      break;
    }
    chats.push(openChat(profile, now));
    used.add(profile.id);
  }
  const full = chats.length >= data.attentionGate.maxActiveChats;
  const incognito = data.attentionGate.autoToggleOnThreshold && full ? true : data.isIncognito;
  return {
    data: {
      ...data,
      activeChats: chats,
      incomingLikes: data.incomingLikes.filter((profile) => !used.has(profile.id)),
      learningStageQueue: data.learningStageQueue.filter((profile) => !used.has(profile.id)),
      isIncognito: incognito,
    },
    ok: full,
    message: full
      ? 'Attention gate is full. Incognito is on, and new chats stay closed.'
      : 'Added demo chats, but the gate is not full yet.',
  };
}

export function setPaidMember(data: DemoData, isPaidMember: boolean, now: number): DemoData {
  const refreshed = withRegen({ ...data, isPaidMember }, now);
  return {
    ...refreshed,
    isPaidMember,
    energyTokens: Math.min(refreshed.energyTokens, maxEnergy(isPaidMember)),
  };
}

export function activeVibe(vibe: VibeStatus | null, now: number): VibeStatus | null {
  if (!vibe || vibe.audience === 'off' || vibe.expiresAt <= now) {
    return null;
  }
  return vibe;
}
