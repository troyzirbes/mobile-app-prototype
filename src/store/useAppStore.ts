import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import type { DateRange, SearchTrack, StyleCategory, VibeStatus } from '../types/demo';
import {
  adjustEnergy,
  allowDM,
  appendMessage,
  beginChallenge,
  closeChat,
  createInitialDemo,
  disallowDM,
  fillAttentionGate,
  grantVerified,
  markCoOpComplete,
  markVoiceHeard,
  reciprocateLike,
  sendLike,
  setPaidMember,
  simulateIncomingLike,
  spendEnergy,
  withRegen,
  type DemoData,
} from './demoState';

const STORAGE_KEY = 'spark-local-demo';

type Actions = {
  refreshEnergy: () => void;
  spendEnergy: (amount: number) => boolean;
  reciprocateLike: (profileId: string) => void;
  allowDM: (profileId: string) => void;
  disallowDM: (profileId: string) => void;
  issueChallenge: (profileId: string) => Promise<boolean>;
  toggleIncognito: () => void;
  sendLike: (profileId: string, note: string | null) => boolean;
  grantVerified: (profileId: string) => void;
  markVoiceHeard: (profileId: string) => void;
  markCoOpComplete: (profileId: string) => void;
  toggleBlindAudition: () => void;
  setTrack: (track: SearchTrack) => void;
  setAestheticStyle: (style: StyleCategory | 'All') => void;
  setExplorerDateRange: (range: DateRange | null) => void;
  reshuffleRandom: () => void;
  setAttentionGate: (patch: Partial<DemoData['attentionGate']>) => void;
  setPaidMember: (isPaidMember: boolean) => void;
  setVibe: (text: string, hours: number, audience: VibeStatus['audience']) => void;
  clearVibe: () => void;
  clearStatus: () => void;
  sendChat: (chatId: string, text: string) => void;
  receiveNpcReply: (chatId: string) => void;
  closeChat: (chatId: string) => void;
  addEnergy: (delta: number) => void;
  simulateIncomingLike: () => void;
  fillAttentionGate: () => void;
  resetDemo: () => void;
};

export type AppState = DemoData & Actions;

function apply(step: { data: DemoData; message: string | null }): DemoData {
  return { ...step.data, statusMessage: step.message };
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      ...createInitialDemo(),
      refreshEnergy: () => set(withRegen(get(), Date.now())),
      spendEnergy: (amount) => {
        const step = spendEnergy(get(), amount, Date.now());
        set(step.ok ? step.data : apply(step));
        return step.ok;
      },
      reciprocateLike: (profileId) => set(apply(reciprocateLike(get(), profileId, Date.now()))),
      allowDM: (profileId) => set(apply(allowDM(get(), profileId, Date.now()))),
      disallowDM: (profileId) => set(apply(disallowDM(get(), profileId))),
      issueChallenge: async (profileId) => {
        const step = beginChallenge(get(), profileId, Date.now());
        set(apply(step));
        return step.ok;
      },
      toggleIncognito: () => set({ isIncognito: !get().isIncognito }),
      sendLike: (profileId, note) => {
        const step = sendLike(get(), profileId, note, Date.now());
        set(apply(step));
        return step.ok;
      },
      grantVerified: (profileId) => set(grantVerified(get(), profileId, Date.now())),
      markVoiceHeard: (profileId) => set(markVoiceHeard(get(), profileId)),
      markCoOpComplete: (profileId) => set(markCoOpComplete(get(), profileId)),
      toggleBlindAudition: () => set({ blindAudition: !get().blindAudition }),
      setTrack: (activeTrack) => set({ activeTrack }),
      setAestheticStyle: (aestheticStyle) => set({ aestheticStyle }),
      setExplorerDateRange: (explorerDateRange) => set({ explorerDateRange }),
      reshuffleRandom: () => set({ randomSalt: get().randomSalt + 1 }),
      setAttentionGate: (patch) =>
        set({ attentionGate: { ...get().attentionGate, ...patch } }),
      setPaidMember: (isPaidMember) => set(setPaidMember(get(), isPaidMember, Date.now())),
      setVibe: (text, hours, audience) =>
        set({
          vibe: {
            text: text.trim(),
            expiresAt: Date.now() + hours * 60 * 60 * 1000,
            audience,
          },
          statusMessage: audience === 'off' ? 'Vibe saved, and the map is off.' : 'Vibe is visible to the Learning Stage.',
        }),
      clearVibe: () => set({ vibe: null, statusMessage: 'Vibe cleared.' }),
      clearStatus: () => set({ statusMessage: null }),
      sendChat: (chatId, text) => {
        const trimmed = text.trim();
        if (!trimmed) {
          return;
        }
        set(appendMessage(get(), chatId, 'you', trimmed, Date.now()));
      },
      receiveNpcReply: (chatId) => {
        const chat = get().activeChats.find((item) => item.id === chatId);
        if (!chat) {
          return;
        }
        set(
          appendMessage(
            get(),
            chatId,
            'them',
            'I am still here. Want to pick a night that does not need a reservation?',
            Date.now(),
          ),
        );
      },
      closeChat: (chatId) => set(closeChat(get(), chatId)),
      addEnergy: (delta) => set(adjustEnergy(get(), delta, Date.now())),
      simulateIncomingLike: () => set(apply(simulateIncomingLike(get()))),
      fillAttentionGate: () => set(apply(fillAttentionGate(get(), Date.now()))),
      resetDemo: () => {
        set({ ...createInitialDemo(), statusMessage: 'Demo state restored.' });
        void useAppStore.persist.clearStorage();
      },
    }),
    {
      name: STORAGE_KEY,
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        energyTokens: state.energyTokens,
        lastRegenTimestamp: state.lastRegenTimestamp,
        isPaidMember: state.isPaidMember,
        isIncognito: state.isIncognito,
        attentionGate: state.attentionGate,
        activeTrack: state.activeTrack,
        aestheticStyle: state.aestheticStyle,
        explorerDateRange: state.explorerDateRange,
        randomSalt: state.randomSalt,
        lastChallengeIssuedTimestamp: state.lastChallengeIssuedTimestamp,
        incomingLikes: state.incomingLikes,
        learningStageQueue: state.learningStageQueue,
        activeChats: state.activeChats,
        verifiedUntil: state.verifiedUntil,
        revealedIds: state.revealedIds,
        blindAudition: state.blindAudition,
        voiceHeardIds: state.voiceHeardIds,
        coOpCompletedIds: state.coOpCompletedIds,
        vibe: state.vibe,
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.refreshEnergy();
        }
      },
    },
  ),
);
