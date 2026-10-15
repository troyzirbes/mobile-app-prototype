import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { demoUser, getProfileById } from '../data/mockData';
import { ENERGY_LIKE, ENERGY_NOTE } from '../store/energy';
import { photosRevealed } from '../store/demoState';
import { overlapScore } from '../store/matching';
import { useAppStore } from '../store/useAppStore';
import type { MockProfile } from '../types/demo';
import { colors, radii, spacing } from '../theme';
import { Avatar } from './Avatar';
import { ChallengeModal } from './ChallengeModal';
import { CoOpModal } from './CoOpModal';
import { NoteModal } from './NoteModal';
import { VoiceNotes } from './VoiceNotes';

export function PersonScreen() {
  const data = useAppStore();
  const profile = data.viewingProfileId ? getProfileById(data.viewingProfileId) : undefined;
  const [noteOpen, setNoteOpen] = useState(false);
  const [coOpFor, setCoOpFor] = useState<MockProfile | null>(null);
  const [challengeFor, setChallengeFor] = useState<MockProfile | null>(null);
  if (!profile) {
    return null;
  }
  const shared = profile.interests.filter((interest) => demoUser.interests.includes(interest));
  const hidden = !photosRevealed(data, profile.id);
  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <View style={styles.top}>
        <Pressable accessibilityRole="button" onPress={() => data.closePerson()}>
          <Text style={styles.close}>Close</Text>
        </Pressable>
      </View>
      <View style={styles.hero}>
        <Avatar
          name={profile.name}
          profileId={profile.id}
          color={profile.photos[0] ?? colors.pass}
          hidden={hidden}
          size={220}
        />
      </View>
      <Text style={styles.name}>
        {profile.name}, {profile.age}
      </Text>
      <Text style={styles.rate}>{profile.responseRate}</Text>
      <Text style={styles.body}>{profile.bio}</Text>
      {shared.length > 0 ? <Text style={styles.body}>In common: {shared.join(', ')}</Text> : null}
      <Text style={styles.body}>{overlapScore(demoUser.interests, profile.interests)}% lifestyle overlap</Text>
      {profile.bounty ? <Text style={styles.body}>Date bounty · {profile.bounty}</Text> : null}
      {profile.isExplorer ? <Text style={styles.body}>Visiting {profile.explorerDates}. Not a local resident.</Text> : null}
      {hidden ? <Text style={styles.body}>Photos stay hidden until a voice note or co-op scenario.</Text> : null}
      {(data.verifiedUntil[profile.id] ?? 0) > Date.now() ? <Text style={styles.verified}>Recently Verified</Text> : null}
      <VoiceNotes prompts={profile.audioPrompts} onHeard={() => data.markVoiceHeard(profile.id)} />
      <View style={styles.actions}>
        <Pressable accessibilityRole="button" onPress={() => data.goTo('Home')} style={styles.action}>
          <Text style={styles.actionText}>Home</Text>
        </Pressable>
        <Pressable
          accessibilityRole="button"
          onPress={() => {
            if (data.sendLike(profile.id, null)) {
              data.closePerson();
            }
          }}
          style={styles.action}
        >
          <Text style={styles.actionText}>Like · {ENERGY_LIKE}</Text>
        </Pressable>
        <Pressable accessibilityRole="button" onPress={() => setNoteOpen(true)} style={styles.action}>
          <Text style={styles.actionText}>Intro · {ENERGY_NOTE}</Text>
        </Pressable>
        <Pressable accessibilityRole="button" onPress={() => data.skipProfile(profile.id)} style={styles.action}>
          <Text style={styles.actionText}>Skip 30 days</Text>
        </Pressable>
        <Pressable accessibilityRole="button" onPress={() => data.blockProfile(profile.id)} style={styles.action}>
          <Text style={styles.actionText}>Block</Text>
        </Pressable>
      </View>
      <Pressable accessibilityRole="button" onPress={() => setCoOpFor(profile)} style={styles.secondary}>
        <Text style={styles.secondaryText}>Co-op scenario</Text>
      </Pressable>
      <Pressable
        accessibilityRole="button"
        onPress={() => {
          void data.issueChallenge(profile.id).then((ok) => {
            if (ok) {
              setChallengeFor(profile);
            }
          });
        }}
        style={styles.secondary}
      >
        <Text style={styles.secondaryText}>Challenge authenticity</Text>
      </Pressable>
      <NoteModal
        name={noteOpen ? profile.name : null}
        onClose={() => setNoteOpen(false)}
        onSend={(note) => {
          if (data.sendLike(profile.id, note)) {
            data.closePerson();
          }
          setNoteOpen(false);
        }}
      />
      <CoOpModal profile={coOpFor} onClose={() => setCoOpFor(null)} onComplete={(profileId) => data.markCoOpComplete(profileId)} />
      <ChallengeModal
        profileName={challengeFor?.name ?? null}
        onClose={() => setChallengeFor(null)}
        onPass={() => {
          if (challengeFor) {
            data.grantVerified(challengeFor.id);
          }
        }}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  content: {
    padding: spacing.lg,
    gap: spacing.sm,
    paddingBottom: spacing.xxl,
  },
  top: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  close: {
    color: colors.ink,
    fontWeight: '800',
  },
  hero: {
    alignItems: 'center',
  },
  name: {
    color: colors.ink,
    fontSize: 24,
    fontWeight: '800',
  },
  rate: {
    color: colors.coralDeep,
    fontWeight: '700',
  },
  body: {
    color: colors.ink,
    lineHeight: 20,
  },
  verified: {
    color: colors.likeStamp,
    fontWeight: '800',
  },
  actions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  action: {
    borderWidth: 2,
    borderColor: colors.ink,
    backgroundColor: colors.card,
    borderRadius: radii.button,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  actionText: {
    color: colors.ink,
    fontWeight: '800',
    fontSize: 12,
  },
  secondary: {
    borderWidth: 2,
    borderColor: colors.ink,
    borderRadius: radii.button,
    alignItems: 'center',
    padding: spacing.md,
  },
  secondaryText: {
    color: colors.ink,
    fontWeight: '700',
  },
});
