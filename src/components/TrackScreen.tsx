import { useState } from 'react';
import { ScrollView, StyleSheet, Text } from 'react-native';
import { demoUser } from '../data/mockData';
import { searchTrackMeta } from '../navigation/tracks';
import { discoverProfiles, photosRevealed } from '../store/demoState';
import { useAppStore } from '../store/useAppStore';
import type { MockProfile, SearchTrack, StyleCategory } from '../types/demo';
import { colors, spacing } from '../theme';
import { ChoiceSquares } from './ChoiceSquares';
import { DrawerToggle } from './DrawerToggle';
import { OverlapMap } from './OverlapMap';
import { ScreenHeading } from './ScreenHeading';
import { SketchField } from './SketchField';
import { WheelIcon } from './WheelIcon';

const MAX_CIRCLES = 3;
const circleTones = [colors.infoDeep, colors.sun, colors.passStamp];

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
  const [promptOpen, setPromptOpen] = useState(true);
  const [titleInset, setTitleInset] = useState(0);
  const track = data.activeScreen;
  if (track !== 'Aesthetic' && track !== 'Commonalities' && track !== 'Activities') {
    return null;
  }
  const meta = searchTrackMeta.find((item) => item.id === track);
  const pool =
    selected.length === 0
      ? []
      : discoverProfiles(data).filter((profile) => {
          const tagFit = selected.some((tag) => matchesTag(profile, tag, track));
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
      <ScreenHeading
        title={`${meta?.line ?? track},\n${demoUser.name}?`}
        detail={meta?.detail ?? ''}
        mark={<WheelIcon track={track} size={32} />}
        onTitleInset={setTitleInset}
      />
      <DrawerToggle
        label={track === 'Aesthetic' ? 'Aesthetics' : 'Filters'}
        open={filtersOpen}
        onPress={() => setFiltersOpen((value) => !value)}
        arrowSide="end"
        inset={titleInset}
      />
      {filtersOpen ? (
        <ChoiceSquares
          options={chipsFor(track)}
          selected={selected}
          tones={circleTones}
          maxSelected={MAX_CIRCLES}
          onToggle={(chip) => {
            if (selected.includes(chip)) {
              const next = selected.filter((item) => item !== chip);
              setSelected(next);
              if (next.length === 0) {
                setPromptOpen(true);
              }
              return;
            }
            if (selected.length >= MAX_CIRCLES) {
              return;
            }
            setSelected([...selected, chip]);
            setPromptOpen(false);
          }}
        />
      ) : null}
      <SketchField
        value={typed}
        onChangeText={setTyped}
        align="start"
        labelInset={titleInset}
        open={promptOpen}
        onToggle={() => setPromptOpen((value) => !value)}
      />
      {selected.length === 0 ? null : pool.length === 0 ? (
        <Text style={styles.help}>Nobody in this track fits those filters and the mutual age and identity rules.</Text>
      ) : (
        <OverlapMap
          tags={selected}
          profiles={pool}
          matches={(profile, tag) => matchesTag(profile, tag, track)}
          hidden={(profile) => !photosRevealed(data, profile.id)}
          onOpen={data.openPerson}
        />
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
  help: {
    color: colors.muted,
    lineHeight: 20,
  },
});
