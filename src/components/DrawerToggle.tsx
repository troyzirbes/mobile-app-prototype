import { Pressable, StyleSheet, Text } from 'react-native';
import { colors, spacing } from '../theme';
import { SketchArrow } from './SketchArrow';

type Props = {
  label: string;
  open: boolean;
  onPress: () => void;
};

export function DrawerToggle({ label, open, onPress }: Props) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ expanded: open }}
      onPress={onPress}
      style={styles.row}
    >
      <SketchArrow direction={open ? 'down' : 'right'} />
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
