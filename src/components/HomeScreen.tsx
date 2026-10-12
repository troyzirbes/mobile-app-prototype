import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { demoUser } from '../data/mockData';
import { matchTrack, searchTrackMeta } from '../navigation/tracks';
import { useAppStore } from '../store/useAppStore';
import { colors, radii, spacing } from '../theme';
import { EnergyPill } from './EnergyPill';

export function HomeScreen() {
  const goTo = useAppStore((state) => state.goTo);
  const accountPaused = useAppStore((state) => state.accountPaused);
  const [index, setIndex] = useState(0);
  const [typed, setTyped] = useState('');
  const [hint, setHint] = useState('');
  const [info, setInfo] = useState(false);
  const count = searchTrackMeta.length;
  const current = searchTrackMeta[index] ?? searchTrackMeta[0];
  const left = searchTrackMeta[(index + count - 1) % count];
  const right = searchTrackMeta[(index + 1) % count];
  if (!current || !left || !right) {
    return null;
  }

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <View style={styles.top}>
        <Text style={styles.prompt}>
          How do you want to explore today, {demoUser.name}?
        </Text>
        <Pressable accessibilityRole="button" onPress={() => setInfo((value) => !value)}>
          <Text style={styles.info}>i</Text>
        </Pressable>
        <EnergyPill />
      </View>
      {info ? <Text style={styles.help}>{current.detail}</Text> : null}
      {accountPaused ? (
        <Text style={styles.help}>Discovery is paused. Profile can turn it back on.</Text>
      ) : null}
      <View style={styles.carousel}>
        <Pressable accessibilityRole="button" onPress={() => setIndex((value) => (value + count - 1) % count)} style={styles.side}>
          <Text style={styles.sideIcon}>{left.icon}</Text>
          <Text style={styles.sideLabel}>{left.id}</Text>
        </Pressable>
        <Pressable accessibilityRole="button" onPress={() => goTo(current.id)} style={styles.front}>
          <Text style={styles.frontIcon}>{current.icon}</Text>
          <Text style={styles.frontLabel}>{current.id}</Text>
        </Pressable>
        <Pressable accessibilityRole="button" onPress={() => setIndex((value) => (value + 1) % count)} style={styles.side}>
          <Text style={styles.sideIcon}>{right.icon}</Text>
          <Text style={styles.sideLabel}>{right.id}</Text>
        </Pressable>
      </View>
      <Text style={styles.or}>or type it out</Text>
      <TextInput
        value={typed}
        onChangeText={setTyped}
        placeholder="Aesthetic, Location…"
        placeholderTextColor={colors.muted}
        style={styles.input}
      />
      {hint ? <Text style={styles.help}>{hint}</Text> : null}
      <Pressable
        accessibilityRole="button"
        onPress={() => {
          const track = matchTrack(typed);
          if (!track) {
            setHint('Type one of the five styles, then Update.');
            return;
          }
          setHint('');
          goTo(track);
        }}
        style={styles.button}
      >
        <Text style={styles.buttonText}>Update</Text>
      </Pressable>
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
  carousel: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    minHeight: 180,
  },
  side: {
    width: 84,
    height: 84,
    borderRadius: 42,
    backgroundColor: colors.chip,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.line,
  },
  sideIcon: {
    fontSize: 22,
  },
  sideLabel: {
    color: colors.muted,
    fontSize: 10,
    fontWeight: '700',
  },
  front: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: colors.card,
    borderWidth: 2,
    borderColor: colors.ink,
    alignItems: 'center',
    justifyContent: 'center',
  },
  frontIcon: {
    fontSize: 36,
  },
  frontLabel: {
    color: colors.ink,
    fontWeight: '800',
    fontSize: 16,
  },
  or: {
    textAlign: 'center',
    color: colors.muted,
    fontWeight: '700',
  },
  input: {
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.card,
    borderRadius: radii.stamp,
    padding: spacing.md,
    color: colors.ink,
    userSelect: 'text',
  },
  button: {
    alignSelf: 'center',
    backgroundColor: colors.likeStamp,
    borderRadius: radii.button,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
  },
  buttonText: {
    color: colors.white,
    fontWeight: '800',
  },
});
