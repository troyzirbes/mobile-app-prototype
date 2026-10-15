import { Pressable, StyleSheet, Text } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { colors, spacing } from '../theme';

type Props = {
  label: string;
  open: boolean;
  onPress: () => void;
};

export function DrawerToggle({ label, open, onPress }: Props) {
  const direction = open ? 'M 3 7 Q 9 14 15 7' : 'M 6 3 Q 13 9 6 15';
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ expanded: open }}
      onPress={onPress}
      style={styles.row}
    >
      <Svg width={18} height={18} viewBox="0 0 18 18">
        <Path d={direction} stroke={colors.ink} strokeWidth={2.4} fill="none" strokeLinecap="round" />
      </Svg>
      <Text style={styles.label}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.xs,
  },
  label: {
    color: colors.ink,
    fontWeight: '800',
    fontSize: 16,
  },
});
