import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { demoUser } from '../data/mockData';
import { useAppStore } from '../store/useAppStore';
import { colors, fonts, radii, shadow, spacing } from '../theme';

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
      <View style={styles.card}>
        <Text style={styles.title}>Demo dating app to compliment case study</Text>
        <Text style={styles.body}>
          {demoUser.name} is already on this phone. Paid features are unlocked. There is no account to create.
        </Text>
      </View>
      <Pressable accessibilityRole="button" onPress={() => goTo('Home')} style={styles.button}>
        <Text style={styles.buttonText}>Let's go!</Text>
      </Pressable>
      <View style={styles.card}>
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
  kicker: {
    color: colors.ink,
    fontFamily: fonts.display,
    fontSize: 40,
    textAlign: 'center',
    marginTop: spacing.sm,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: radii.card,
    padding: spacing.lg,
    gap: spacing.sm,
    ...shadow,
  },
  title: {
    color: colors.ink,
    fontFamily: fonts.display,
    fontSize: 28,
    lineHeight: 34,
  },
  heading: {
    color: colors.ink,
    fontFamily: fonts.display,
    fontSize: 20,
    marginTop: spacing.sm,
  },
  body: {
    color: colors.muted,
    fontFamily: fonts.body,
    fontSize: 16,
    lineHeight: 22,
  },
  item: {
    color: colors.ink,
    fontFamily: fonts.body,
    fontSize: 16,
    lineHeight: 24,
  },
  button: {
    alignSelf: 'center',
    backgroundColor: colors.coral,
    borderRadius: radii.button,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    ...shadow,
  },
  buttonText: {
    color: colors.card,
    fontFamily: fonts.bodyBold,
    fontSize: 18,
  },
});
