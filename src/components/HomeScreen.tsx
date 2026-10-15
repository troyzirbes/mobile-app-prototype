import { useState } from 'react';
import { ScrollView, StyleSheet, Text } from 'react-native';
import { demoUser } from '../data/mockData';
import { matchTrack, searchTrackMeta } from '../navigation/tracks';
import { useAppStore } from '../store/useAppStore';
import { colors, spacing } from '../theme';
import { ModeWheel } from './ModeWheel';
import { ScreenHeading } from './ScreenHeading';
import { SketchField } from './SketchField';

export function HomeScreen() {
  const goTo = useAppStore((state) => state.goTo);
  const accountPaused = useAppStore((state) => state.accountPaused);
  const [index, setIndex] = useState(0);
  const [typed, setTyped] = useState('');
  const [hint, setHint] = useState('');
  const current = searchTrackMeta[index] ?? searchTrackMeta[0];
  if (!current) {
    return null;
  }

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <ScreenHeading
        title={`How do you want to explore today, ${demoUser.name}?`}
        detail={current.detail}
      />
      {accountPaused ? <Text style={styles.help}>Discovery is paused. Profile can turn it back on.</Text> : null}
      <ModeWheel index={index} onChange={setIndex} onOpen={goTo} />
      <SketchField
        value={typed}
        onChangeText={setTyped}
        hint={hint}
        onSubmit={() => {
          const track = matchTrack(typed);
          if (!track) {
            setHint('Type one of the five styles, then Send.');
            return;
          }
          setHint('');
          goTo(track);
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
    gap: spacing.md,
    paddingBottom: spacing.xxl,
  },
  help: {
    color: colors.muted,
    lineHeight: 20,
    textAlign: 'center',
  },
});
