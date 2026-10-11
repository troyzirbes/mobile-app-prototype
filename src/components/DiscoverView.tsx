import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { demoUser } from '../data/mockData';
import { ENERGY_LIKE } from '../store/energy';
import { overlapScore } from '../store/matching';
import { discoverProfiles, photosRevealed } from '../store/demoState';
import { useAppStore } from '../store/useAppStore';
import type { MockProfile, SearchTrack, StyleCategory } from '../types/demo';
import { colors, radii, spacing } from '../theme';
import { ChallengeModal } from './ChallengeModal';
import { CoOpModal } from './CoOpModal';
import { NoteModal } from './NoteModal';
import { ProfileSummary } from './ProfileSummary';

const tracks: SearchTrack[] = ['Aesthetic', 'Commonalities', 'Activities', 'Random', 'Exploration'];
const stylesCategories: Array<StyleCategory | 'All'> = [
  'All',
  'Athletic',
  'Alternative',
  'Minimalist',
  'High-Fashion',
  'Outdoorsy',
];

const datePresets = [
  { label: 'Oct 17–20', startDate: '2026-10-17', endDate: '2026-10-20' },
  { label: 'Nov 2–9', startDate: '2026-11-02', endDate: '2026-11-09' },
  { label: 'May 2027', startDate: '2027-05-01', endDate: '2027-05-12' },
];

export function DiscoverView() {
  const data = useAppStore();
  const profiles = discoverProfiles(data);
  const [cursor, setCursor] = useState(0);
  const [mysteryOpen, setMysteryOpen] = useState(false);
  const [noteFor, setNoteFor] = useState<MockProfile | null>(null);
  const [coOpFor, setCoOpFor] = useState<MockProfile | null>(null);
  const [challengeFor, setChallengeFor] = useState<MockProfile | null>(null);
  const profile = profiles[cursor] ?? profiles[0] ?? null;
  const mystery = data.activeTrack === 'Random' && !mysteryOpen;
  const now = Date.now();

  return (
    <ScrollView contentContainerStyle={styles.content}>
      <Text style={styles.lead}>
        {data.isIncognito
          ? 'Incognito is on. People are not being shown a live profile of you.'
          : `${demoUser.name}, ${demoUser.age}. Paid demo, energy regenerates once a minute.`}
      </Text>
      <View style={styles.chips}>
        {tracks.map((track) => (
          <Pressable
            key={track}
            accessibilityRole="button"
            accessibilityState={{ selected: data.activeTrack === track }}
            onPress={() => {
              data.setTrack(track);
              setCursor(0);
              setMysteryOpen(false);
            }}
            style={[styles.chip, data.activeTrack === track && styles.chipOn]}
          >
            <Text style={[styles.chipText, data.activeTrack === track && styles.chipTextOn]}>{track}</Text>
          </Pressable>
        ))}
      </View>
      {data.activeTrack === 'Aesthetic' ? (
        <View style={styles.chips}>
          {stylesCategories.map((style) => (
            <Pressable
              key={style}
              accessibilityRole="button"
              onPress={() => {
                data.setAestheticStyle(style);
                setCursor(0);
              }}
              style={[styles.chip, data.aestheticStyle === style && styles.chipOn]}
            >
              <Text style={[styles.chipText, data.aestheticStyle === style && styles.chipTextOn]}>{style}</Text>
            </Pressable>
          ))}
        </View>
      ) : null}
      {data.activeTrack === 'Exploration' ? (
        <View style={styles.block}>
          <Text style={styles.help}>
            Travel dates stay separate from people who live here. Pick a window.
          </Text>
          <View style={styles.chips}>
            {datePresets.map((preset) => (
              <Pressable
                key={preset.label}
                accessibilityRole="button"
                onPress={() =>
                  data.setExplorerDateRange({ startDate: preset.startDate, endDate: preset.endDate })
                }
                style={styles.chip}
              >
                <Text style={styles.chipText}>{preset.label}</Text>
              </Pressable>
            ))}
          </View>
          <View style={styles.dates}>
            <TextInput
              value={data.explorerDateRange?.startDate ?? ''}
              onChangeText={(startDate) =>
                data.setExplorerDateRange({
                  startDate,
                  endDate: data.explorerDateRange?.endDate ?? null,
                })
              }
              placeholder="Start YYYY-MM-DD"
              placeholderTextColor={colors.muted}
              style={styles.input}
            />
            <TextInput
              value={data.explorerDateRange?.endDate ?? ''}
              onChangeText={(endDate) =>
                data.setExplorerDateRange({
                  startDate: data.explorerDateRange?.startDate ?? null,
                  endDate,
                })
              }
              placeholder="End YYYY-MM-DD"
              placeholderTextColor={colors.muted}
              style={styles.input}
            />
          </View>
        </View>
      ) : null}
      {data.activeTrack === 'Random' ? (
        <Pressable accessibilityRole="button" onPress={() => data.reshuffleRandom()} style={styles.link}>
          <Text style={styles.linkText}>Shuffle wildcards</Text>
        </Pressable>
      ) : null}
      {profile ? (
        <ProfileSummary
          profile={profile}
          hiddenPhoto={!photosRevealed(data, profile.id)}
          verified={(data.verifiedUntil[profile.id] ?? 0) > now}
          mystery={mystery}
          overlap={data.activeTrack === 'Commonalities' ? overlapScore(demoUser.interests, profile.interests) : null}
          showBounty={data.activeTrack === 'Activities'}
          onHeard={() => data.markVoiceHeard(profile.id)}
        >
          {mystery ? (
            <Pressable accessibilityRole="button" onPress={() => setMysteryOpen(true)} style={styles.primary}>
              <Text style={styles.primaryText}>Reveal wildcard</Text>
            </Pressable>
          ) : (
            <View style={styles.actions}>
              <Pressable
                accessibilityRole="button"
                onPress={() => data.sendLike(profile.id, null)}
                style={styles.primary}
              >
                <Text style={styles.primaryText}>Like · {ENERGY_LIKE}</Text>
              </Pressable>
              <Pressable accessibilityRole="button" onPress={() => setNoteFor(profile)} style={styles.secondary}>
                <Text style={styles.secondaryText}>Like + note · 30</Text>
              </Pressable>
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
              <Pressable
                accessibilityRole="button"
                onPress={() => setCursor((value) => (profiles.length === 0 ? 0 : (value + 1) % profiles.length))}
                style={styles.link}
              >
                <Text style={styles.linkText}>Skip for now</Text>
              </Pressable>
            </View>
          )}
        </ProfileSummary>
      ) : (
        <Text style={styles.empty}>Nobody in this track fits the mutual age and identity rules.</Text>
      )}
      <NoteModal
        name={noteFor?.name ?? null}
        onClose={() => setNoteFor(null)}
        onSend={(note) => {
          if (noteFor) {
            data.sendLike(noteFor.id, note);
          }
          setNoteFor(null);
        }}
      />
      <CoOpModal
        profile={coOpFor}
        onClose={() => setCoOpFor(null)}
        onComplete={(profileId) => data.markCoOpComplete(profileId)}
      />
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
  content: {
    padding: spacing.lg,
    gap: spacing.md,
    paddingBottom: spacing.xxl,
  },
  lead: {
    color: colors.muted,
    lineHeight: 20,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  chip: {
    borderRadius: radii.chip,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.card,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  chipOn: {
    backgroundColor: colors.ink,
    borderColor: colors.ink,
  },
  chipText: {
    color: colors.ink,
    fontWeight: '700',
    fontSize: 13,
  },
  chipTextOn: {
    color: colors.white,
  },
  block: {
    gap: spacing.sm,
  },
  help: {
    color: colors.ink,
  },
  dates: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.card,
    borderRadius: radii.stamp,
    padding: spacing.sm,
    color: colors.ink,
    userSelect: 'text',
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
  link: {
    alignItems: 'center',
    padding: spacing.sm,
  },
  linkText: {
    color: colors.muted,
    fontWeight: '700',
  },
  empty: {
    color: colors.ink,
    lineHeight: 21,
  },
});
