import { StyleSheet, Text, View } from 'react-native';
import { maxEnergy, nextRegenLabel } from '../store/energy';
import { useAppStore } from '../store/useAppStore';
import { colors, fonts, spacing } from '../theme';

export function EnergyPill() {
  const energyTokens = useAppStore((state) => state.energyTokens);
  const isPaidMember = useAppStore((state) => state.isPaidMember);
  const lastRegenTimestamp = useAppStore((state) => state.lastRegenTimestamp);
  const cap = maxEnergy(isPaidMember);
  return (
    <View style={styles.row}>
      <Text style={styles.energy}>
        ⚡ {energyTokens}/{cap}
      </Text>
      <Text style={styles.regen}>{nextRegenLabel(energyTokens, lastRegenTimestamp, Date.now(), isPaidMember)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    alignItems: 'flex-end',
    gap: spacing.xs,
  },
  energy: {
    color: colors.coralDeep,
    fontFamily: fonts.bodyBold,
    fontSize: 16,
  },
  regen: {
    color: colors.muted,
    fontFamily: fonts.body,
    fontSize: 12,
  },
});
