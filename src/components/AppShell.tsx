import { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useAppStore } from '../store/useAppStore';
import { colors, spacing } from '../theme';
import { AdventureScreen } from './AdventureScreen';
import { AppInfoScreen } from './AppInfoScreen';
import { ContextualNav } from './ContextualNav';
import { DemoControlPanel } from './DemoControlPanel';
import { HomeScreen } from './HomeScreen';
import { IntroScreen } from './IntroScreen';
import { LikesHubScreen } from './LikesHubScreen';
import { LocationScreen } from './LocationScreen';
import { MyProfileScreen } from './MyProfileScreen';
import { PersonScreen } from './PersonScreen';
import { TrackScreen } from './TrackScreen';

export function AppShell() {
  const screen = useAppStore((state) => state.activeScreen);
  const viewingProfileId = useAppStore((state) => state.viewingProfileId);
  const statusMessage = useAppStore((state) => state.statusMessage);

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

  const body = viewingProfileId ? (
    <PersonScreen />
  ) : screen === 'Intro' ? (
    <IntroScreen />
  ) : screen === 'Home' ? (
    <HomeScreen />
  ) : screen === 'Adventure' ? (
    <AdventureScreen />
  ) : screen === 'Location' ? (
    <LocationScreen />
  ) : screen === 'Profile' ? (
    <MyProfileScreen />
  ) : screen === 'LikesHub' ? (
    <LikesHubScreen />
  ) : screen === 'AppInfo' ? (
    <AppInfoScreen />
  ) : (
    <TrackScreen />
  );

  return (
    <View style={styles.frame}>
      {statusMessage ? (
        <View style={styles.notice}>
          <Text style={styles.noticeText}>{statusMessage}</Text>
        </View>
      ) : null}
      <View style={styles.body}>{body}</View>
      <ContextualNav />
      <DemoControlPanel />
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
});
