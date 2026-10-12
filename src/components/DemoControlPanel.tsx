import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useAppStore } from '../store/useAppStore';
import { colors, fonts, radii, spacing } from '../theme';

const controls = [
  { label: '+20 Energy', run: (store: ReturnType<typeof useAppStore.getState>) => store.addEnergy(20) },
  { label: '−20 Energy', run: (store: ReturnType<typeof useAppStore.getState>) => store.addEnergy(-20) },
  { label: 'Simulate Like', run: (store: ReturnType<typeof useAppStore.getState>) => store.simulateIncomingLike() },
  { label: 'Reset State', run: (store: ReturnType<typeof useAppStore.getState>) => store.resetDemo() },
] as const;

export function DemoControlPanel() {
  const energyTokens = useAppStore((state) => state.energyTokens);
  return (
    <View style={styles.panel}>
      <Text style={styles.title}>Demo controls · {energyTokens} energy</Text>
      <View style={styles.row}>
        {controls.map((control) => (
          <Pressable
            key={control.label}
            accessibilityRole="button"
            accessibilityLabel={control.label}
            onPress={() => control.run(useAppStore.getState())}
            style={styles.button}
          >
            <Text style={styles.buttonText}>{control.label}</Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  panel: {
    backgroundColor: colors.night,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    paddingBottom: spacing.md,
    gap: spacing.sm,
    borderTopWidth: 3,
    borderTopColor: colors.gold,
  },
  title: {
    color: colors.chip,
    fontFamily: fonts.body,
    fontSize: 13,
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  button: {
    backgroundColor: colors.coral,
    borderRadius: radii.chip,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  buttonText: {
    color: colors.card,
    fontFamily: fonts.bodyBold,
    fontSize: 13,
  },
});
