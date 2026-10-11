import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { maxEnergy } from '../store/energy';
import { useAppStore } from '../store/useAppStore';
import { colors, spacing } from '../theme';
import { ChatsView } from './ChatsView';
import { DemoControlPanel } from './DemoControlPanel';
import { DiscoverView } from './DiscoverView';
import { LearningView } from './LearningView';
import { LikesView } from './LikesView';
import { YouView } from './YouView';

type Tab = 'discover' | 'likes' | 'learning' | 'chats' | 'you';

const tabs: Array<{ id: Tab; label: string }> = [
  { id: 'discover', label: 'Discover' },
  { id: 'likes', label: 'Likes' },
  { id: 'learning', label: 'Learning' },
  { id: 'chats', label: 'Chats' },
  { id: 'you', label: 'You' },
];

export function AppShell() {
  const [tab, setTab] = useState<Tab>('discover');
  const energyTokens = useAppStore((state) => state.energyTokens);
  const isPaidMember = useAppStore((state) => state.isPaidMember);
  const statusMessage = useAppStore((state) => state.statusMessage);
  const likes = useAppStore((state) => state.incomingLikes.length);
  const learning = useAppStore((state) => state.learningStageQueue.length);
  const chats = useAppStore((state) => state.activeChats.length);

  useEffect(() => {
    useAppStore.getState().refreshEnergy();
    const timer = setInterval(() => useAppStore.getState().refreshEnergy(), 15000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    return useAppStore.subscribe((state, previous) => {
      if (!state.statusMessage || state.statusMessage === previous.statusMessage) {
        return;
      }
      const message = state.statusMessage;
      setTimeout(() => {
        if (useAppStore.getState().statusMessage === message) {
          useAppStore.getState().clearStatus();
        }
      }, 2600);
    });
  }, []);

  const counts: Partial<Record<Tab, number>> = {
    likes,
    learning,
    chats,
  };

  return (
    <View style={styles.frame}>
      <View style={styles.header}>
        <Text style={styles.brand}>Spark</Text>
        <Text style={styles.energy}>
          {energyTokens}/{maxEnergy(isPaidMember)}
        </Text>
      </View>
      {statusMessage ? (
        <View style={styles.notice}>
          <Text style={styles.noticeText}>{statusMessage}</Text>
        </View>
      ) : null}
      <View style={styles.body}>
        {tab === 'discover' ? <DiscoverView /> : null}
        {tab === 'likes' ? <LikesView /> : null}
        {tab === 'learning' ? <LearningView /> : null}
        {tab === 'chats' ? <ChatsView /> : null}
        {tab === 'you' ? <YouView /> : null}
      </View>
      <DemoControlPanel />
      <View style={styles.tabs}>
        {tabs.map((item) => {
          const selected = tab === item.id;
          const count = counts[item.id];
          return (
            <Pressable
              key={item.id}
              accessibilityRole="button"
              accessibilityState={{ selected }}
              onPress={() => setTab(item.id)}
              style={styles.tab}
            >
              <Text style={[styles.tabText, selected && styles.tabTextOn]}>
                {item.label}
                {count ? ` ${count}` : ''}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  frame: {
    flex: 1,
    minHeight: 0,
    width: '100%',
    maxWidth: 440,
    alignSelf: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
  },
  brand: {
    color: colors.ink,
    fontSize: 28,
    fontWeight: '800',
  },
  energy: {
    color: colors.coralDeep,
    fontWeight: '800',
    paddingBottom: 4,
  },
  notice: {
    marginHorizontal: spacing.lg,
    marginTop: spacing.sm,
    backgroundColor: colors.ink,
    borderRadius: 999,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  noticeText: {
    color: colors.white,
    fontWeight: '700',
    fontSize: 13,
  },
  body: {
    flex: 1,
    minHeight: 0,
  },
  tabs: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: colors.line,
    backgroundColor: colors.card,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: spacing.md,
  },
  tabText: {
    color: colors.muted,
    fontSize: 12,
    fontWeight: '700',
  },
  tabTextOn: {
    color: colors.ink,
  },
});
