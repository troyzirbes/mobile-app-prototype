import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { demoUser } from '../data/mockData';
import { searchTrackMeta } from '../navigation/tracks';
import { discoverProfiles, photosRevealed } from '../store/demoState';
import { overlapScore } from '../store/matching';
import { useAppStore } from '../store/useAppStore';
import type { MockProfile, SearchTrack, StyleCategory } from '../types/demo';
import { colors, spacing } from '../theme';
import { Avatar } from './Avatar';
import { ChoiceSquares } from './ChoiceSquares';
import { DrawerToggle } from './DrawerToggle';
import { OverlapMap } from './OverlapMap';
import { ScreenHeading } from './ScreenHeading';
import { SketchField } from './SketchField';

const styleChips: StyleCategory[] = ['Athletic', 'Alternative', 'Minimalist', 'High-Fashion', 'Outdoorsy'];
const interestChips = ['climbing', 'cooking', 'live music', 'night markets', 'museums'];

function chipsFor(track: SearchTrack): string[] {
  return track === 'Aesthetic' ? styleChips : interestChips;
}

function matchesTag(profile: MockProfile, tag: string, track: SearchTrack): boolean {
  if (track === 'Aesthetic') {
    return profile.styleCategory === tag;
  }
  if (track === 'Activities') {
    return profile.interests.includes(tag) || profile.bounty.toLowerCase().includes(tag);
  }
  return profile.interests.includes(tag);
}

export function TrackScreen() {
  const data = useAppStore();
  const [selected, setSelected] = useState<string[]>([]);
  const [typed, setTyped] = useState('');
  const [filtersOpen, setFiltersOpen] = useState(true);
  const track = data.activeScreen;
  if (track !== 'Aesthetic' && track !== 'Commonalities' && track !== 'Activities') {
    return null;
  }
  const meta = searchTrackMeta.find((item) => item.id === track);
  const pool = discoverProfiles(data).filter((profile) => {
    const tagFit = selected.length === 0 || selected.some((tag) => matchesTag(profile, tag, track));
    const query = typed.trim().toLowerCase();
    const textFit =
      query.length === 0 ||
      profile.name.toLowerCase().includes(query) ||
      profile.bio.toLowerCase().includes(query) ||
      profile.styleCategory.toLowerCase().includes(query) ||
      profile.interests.some((interest) => interest.includes(query)) ||
      profile.bounty.toLowerCase().includes(query);
    return tagFit && textFit;
  });

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <ScreenHeading title={`${meta?.line ?? track}, ${demoUser.name}?`} detail={meta?.detail ?? ''} />
      <DrawerToggle
        label={track === 'Aesthetic' ? 'Aesthetics' : 'Filters'}
        open={filtersOpen}
        onPress={() => setFiltersOpen((value) => !value)}
      />
      {filtersOpen ? (
        <ChoiceSquares
          options={chipsFor(track)}
          selected={selected}
          onToggle={(chip) =>
            setSelected((current) =>
              current.includes(chip) ? current.filter((item) => item !== chip) : [...current, chip],
            )
          }
        />
      ) : null}
      <SketchField value={typed} onChangeText={setTyped} />
      {pool.length === 0 ? (
          <Text style={styles.help}>Nobody in this track fits those filters and the mutual age and identity rules.</Text>
        ) : track !== 'Aesthetic' && selected.length >= 2 ? (
          <OverlapMap
            tags={selected}
            profiles={pool}
            matches={(profile, tag) => matchesTag(profile, tag, track)}
            hidden={(profile) => !photosRevealed(data, profile.id)}
            onOpen={data.openPerson}
          />
        ) : (
          <View style={styles.grid}>
            {pool.map((profile) => (
              <Pressable
                key={profile.id}
                accessibilityRole="button"
                onPress={() => data.openPerson(profile.id)}
                style={styles.cell}
              >
                <Avatar
                  name={profile.name}
                  profileId={profile.id}
                  color={profile.photos[0] ?? colors.pass}
                  hidden={!photosRevealed(data, profile.id)}
                  size={72}
                />
                <Text style={styles.name}>{profile.name.split(' ')[0]}</Text>
                <Text style={styles.meta}>
                  {track === 'Commonalities'
                    ? `${overlapScore(demoUser.interests, profile.interests)}% overlap`
                    : track === 'Activities'
                      ? profile.bounty
                      : profile.styleCategory}
                </Text>
              </Pressable>
            ))}
          </View>
        )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  content: {
    padding: spacing.lg,
    gap: spacing.md,
    paddingBottom: spacing.xxl,
  },
  top: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
  },
  prompt: {
    flex: 1,
    color: colors.ink,
    fontSize: 22,
    fontWeight: '800',
    lineHeight: 28,
  },
  info: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1,
    borderColor: colors.muted,
    color: colors.muted,
    textAlign: 'center',
    fontWeight: '800',
    overflow: 'hidden',
  },
  help: {
    color: colors.muted,
    lineHeight: 20,
  },
  label: {
    color: colors.ink,
    fontWeight: '800',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  cell: {
    width: '30%',
    alignItems: 'center',
    gap: spacing.xs,
  },
  name: {
    color: colors.ink,
    fontWeight: '800',
    fontSize: 13,
  },
  meta: {
    color: colors.muted,
    fontSize: 11,
    textAlign: 'center',
  },
});
