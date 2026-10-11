import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { activeVibe, photosRevealed } from '../store/demoState';
import { useAppStore } from '../store/useAppStore';
import type { MockProfile } from '../types/demo';
import { colors, radii, spacing } from '../theme';
import { CoOpModal } from './CoOpModal';
import { ProfileSummary } from './ProfileSummary';

export function LearningView() {
  const data = useAppStore();
  const [coOpFor, setCoOpFor] = useState<MockProfile | null>(null);
  const vibe = activeVibe(data.vibe, Date.now());
  return (
    <ScrollView contentContainerStyle={styles.content}>
      <Text style={styles.lead}>
        Voice notes and co-op scenarios happen here. Allow opens a chat. Disallow sets you both back to strangers.
      </Text>
      {vibe ? <Text style={styles.vibe}>Your vibe, visible only here: {vibe.text}</Text> : null}
      {data.learningStageQueue.length === 0 ? (
        <Text style={styles.empty}>Nobody is in the Learning Stage yet.</Text>
      ) : null}
      {data.learningStageQueue.map((profile) => (
        <ProfileSummary
          key={profile.id}
          profile={profile}
          hiddenPhoto={!photosRevealed(data, profile.id)}
          verified={(data.verifiedUntil[profile.id] ?? 0) > Date.now()}
          mystery={false}
          overlap={null}
          showBounty={false}
          onHeard={() => data.markVoiceHeard(profile.id)}
        >
          <View style={styles.actions}>
            <Pressable accessibilityRole="button" onPress={() => setCoOpFor(profile)} style={styles.secondary}>
              <Text style={styles.secondaryText}>Co-op scenario</Text>
            </Pressable>
            <Pressable accessibilityRole="button" onPress={() => data.allowDM(profile.id)} style={styles.primary}>
              <Text style={styles.primaryText}>Allow</Text>
            </Pressable>
            <Pressable accessibilityRole="button" onPress={() => data.disallowDM(profile.id)} style={styles.secondary}>
              <Text style={styles.secondaryText}>Disallow</Text>
            </Pressable>
          </View>
        </ProfileSummary>
      ))}
      <CoOpModal
        profile={coOpFor}
        onClose={() => setCoOpFor(null)}
        onComplete={(profileId) => data.markCoOpComplete(profileId)}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: spacing.lg,
    gap: spacing.md,
    paddingBottom: spacing.xxl,
  },
  lead: {
    color: colors.muted,
    lineHeight: 20,
  },
  vibe: {
    color: colors.ink,
    fontWeight: '700',
  },
  empty: {
    color: colors.ink,
  },
  actions: {
    gap: spacing.sm,
  },
  primary: {
    backgroundColor: colors.coral,
    borderRadius: radii.button,
    alignItems: 'center',
    padding: spacing.md,
  },
  primaryText: {
    color: colors.white,
    fontWeight: '800',
  },
  secondary: {
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radii.button,
    alignItems: 'center',
    padding: spacing.md,
  },
  secondaryText: {
    color: colors.ink,
    fontWeight: '700',
  },
});
