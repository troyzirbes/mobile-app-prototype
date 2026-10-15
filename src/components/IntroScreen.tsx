import { View, ScrollView, StyleSheet, Text } from 'react-native';
import { demoUser } from '../data/mockData';
import { useAppStore } from '../store/useAppStore';
import { colors, spacing } from '../theme';
import { SketchButton } from './SketchButton';
import { SketchFrame } from './SketchFrame';

const included = [
  'Five ways to look: Aesthetic, Commonalities, Activities, Adventure, and Location.',
  'A like you send costs 10 energy. A like with a note costs 30. A like you receive is free to reciprocate.',
  'Exploring comes before a chat: speed questions, a mini game, voice notes, and a co-op scene.',
  'Allow opens a conversation. Disallow sets you both back to strangers.',
  'A chat cap, blind audition, and a once-a-day authenticity check.',
];

const leftOut = [
  'Registration, login, and SMS.',
  'Real people, and anything sent off this device.',
  'Payments, photo upload, and a live map.',
];

export function IntroScreen() {
  const goTo = useAppStore((state) => state.goTo);
  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <Text style={styles.kicker}>Demo Intro</Text>
      <SketchFrame fill={colors.card} seed={2} style={styles.stretch}>
        <Text style={styles.title}>Demo dating app to compliment case study</Text>
        <Text style={styles.body}>
          {demoUser.name} is already on this phone. Paid features are unlocked. There is no account to create.
        </Text>
      </SketchFrame>
      <SketchFrame fill={colors.card} seed={4} style={styles.stretch}>
        <View style={styles.stack}>
          <Text style={styles.heading}>Here's what it does support:</Text>
          {included.map((item) => (
            <Text key={item} style={styles.item}>
              - {item}
            </Text>
          ))}
          <Text style={styles.heading}>Left out of this demo:</Text>
          {leftOut.map((item) => (
            <Text key={item} style={styles.item}>
              - {item}
            </Text>
          ))}
        </View>
      </SketchFrame>
      <SketchButton label="Let's go!" seed={7} onPress={() => goTo('Home')} />
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
    alignItems: 'center',
  },
  stretch: {
    alignSelf: 'stretch',
  },
  stack: {
    gap: spacing.sm,
  },
  kicker: {
    color: colors.ink,
    fontSize: 28,
    fontWeight: '800',
    textAlign: 'center',
  },
  title: {
    color: colors.ink,
    fontSize: 22,
    fontWeight: '800',
    lineHeight: 28,
  },
  heading: {
    color: colors.ink,
    fontWeight: '800',
    marginTop: spacing.sm,
  },
  body: {
    color: colors.muted,
    lineHeight: 20,
    marginTop: spacing.sm,
  },
  item: {
    color: colors.ink,
    lineHeight: 20,
  },
});
