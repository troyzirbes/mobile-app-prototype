import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, radii, spacing } from '../theme';

type Props = {
  onPass: () => void;
  onLike: () => void;
};

export function ActionBar({ onPass, onLike }: Props) {
  return (
    <View style={styles.row}>
      <View style={styles.action}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Pass"
          onPress={onPass}
          style={({ pressed }) => [styles.passButton, pressed && styles.pressed]}
        >
          <Text style={styles.passIcon}>✕</Text>
        </Pressable>
        <Text style={styles.label}>Pass</Text>
      </View>
      <View style={styles.action}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Like"
          onPress={onLike}
          style={({ pressed }) => [styles.likeButton, pressed && styles.pressed]}
        >
          <Text style={styles.likeIcon}>♥</Text>
        </Pressable>
        <Text style={styles.label}>Like</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-start',
    gap: spacing.xxl + spacing.lg,
    paddingBottom: spacing.sm,
  },
  action: {
    alignItems: 'center',
    gap: spacing.sm,
  },
  passButton: {
    width: 72,
    height: 72,
    borderRadius: radii.button,
    borderWidth: 2,
    borderColor: colors.pass,
    backgroundColor: colors.card,
    alignItems: 'center',
    justifyContent: 'center',
  },
  likeButton: {
    width: 72,
    height: 72,
    borderRadius: radii.button,
    backgroundColor: colors.coral,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: {
    transform: [{ scale: 0.96 }],
    opacity: 0.9,
  },
  passIcon: {
    color: colors.pass,
    fontSize: 28,
    fontWeight: '600',
    lineHeight: 32,
  },
  likeIcon: {
    color: colors.white,
    fontSize: 30,
    lineHeight: 34,
  },
  label: {
    color: colors.ink,
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
});
