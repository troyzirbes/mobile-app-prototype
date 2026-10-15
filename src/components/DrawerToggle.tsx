import { Pressable, StyleSheet, Text } from 'react-native';
import { colors, spacing } from '../theme';
import { SketchArrow } from './SketchArrow';

type Props = {
  label: string;
  open: boolean;
  onPress: () => void;
  arrowSide?: 'start' | 'end';
  inset?: number;
};

export function DrawerToggle({ label, open, onPress, arrowSide = 'start', inset = 0 }: Props) {
  const arrow = <SketchArrow direction={open ? 'down' : 'right'} />;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ expanded: open }}
      onPress={onPress}
      style={[styles.row, inset > 0 ? { marginLeft: inset } : null]}
    >
      {arrowSide === 'start' ? arrow : null}
      <Text style={styles.label}>{label}</Text>
      {arrowSide === 'end' ? arrow : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: spacing.sm,
    paddingVertical: spacing.xs,
  },
  label: {
    color: colors.ink,
    fontWeight: '800',
    fontSize: 16,
  },
});
