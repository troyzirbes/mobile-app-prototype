import { Pressable, StyleSheet, Text, View } from 'react-native';
import { demoUser, getProfileById, seededIncomingIds } from '../data/mockData';
import { PAID_ENERGY_MAX } from '../store/energy';
import { useAppStore } from '../store/useAppStore';
import { colors, radii, spacing } from '../theme';

const waitingNames = seededIncomingIds
  .map((id) => getProfileById(id)?.name)
  .filter((name): name is string => Boolean(name))
  .join(' and ');

export function FirstDownloadCard() {
  const visible = useAppStore((state) => state.showFirstDownload);
  const dismissFirstDownload = useAppStore((state) => state.dismissFirstDownload);
  if (!visible) {
    return null;
  }
  return (
    <View style={styles.card}>
      <Text style={styles.kicker}>First download</Text>
      <Text style={styles.body}>
        {demoUser.name}, {demoUser.age}, is already on this phone. Paid features are unlocked. This case study has no account to create.
      </Text>
      <Text style={styles.body}>
        {waitingNames} liked you. The Learning Stage is empty, and there are no chats. Energy starts at 80 of {PAID_ENERGY_MAX}.
      </Text>
      <Text style={styles.body}>
        Liking someone back costs 10 and opens the Learning Stage. A chat opens only after Allow.
      </Text>
      <Pressable accessibilityRole="button" onPress={dismissFirstDownload} style={styles.button}>
        <Text style={styles.buttonText}>Start from here</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: spacing.lg,
    marginTop: spacing.sm,
    backgroundColor: colors.card,
    borderRadius: radii.stamp,
    borderWidth: 1,
    borderColor: colors.line,
    padding: spacing.md,
    gap: spacing.sm,
  },
  kicker: {
    color: colors.coralDeep,
    fontWeight: '800',
    fontSize: 13,
  },
  body: {
    color: colors.ink,
    lineHeight: 20,
    fontSize: 14,
  },
  button: {
    alignSelf: 'flex-start',
    backgroundColor: colors.ink,
    borderRadius: radii.button,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  buttonText: {
    color: colors.white,
    fontWeight: '800',
  },
});
