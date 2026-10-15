import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useAppStore } from '../store/useAppStore';
import { colors, spacing } from '../theme';
import { SketchButton } from './SketchButton';

const controls = [
  { label: '+20 Energy', run: (store: ReturnType<typeof useAppStore.getState>) => store.addEnergy(20) },
  { label: '−20 Energy', run: (store: ReturnType<typeof useAppStore.getState>) => store.addEnergy(-20) },
  { label: 'Simulate Like', run: (store: ReturnType<typeof useAppStore.getState>) => store.simulateIncomingLike() },
  { label: 'Reset State', run: (store: ReturnType<typeof useAppStore.getState>) => store.resetDemo() },
] as const;

export function DemoControlPanel() {
  const energyTokens = useAppStore((state) => state.energyTokens);
  const screen = useAppStore((state) => state.activeScreen);
  const likesTab = useAppStore((state) => state.activeLikesTab);
  const viewingProfileId = useAppStore((state) => state.viewingProfileId);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [screen, likesTab, viewingProfileId]);

  return (
    <View style={styles.panel}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Demo Controls"
        accessibilityState={{ expanded: open }}
        onPress={() => setOpen((value) => !value)}
        style={styles.toggle}
      >
        <Text style={styles.title}>Demo Controls</Text>
        <Text style={styles.title}>{open ? '–' : '+'}</Text>
      </Pressable>
      {open ? (
        <View style={styles.body}>
          <Text style={styles.energy}>{energyTokens} energy</Text>
          <View style={styles.row}>
            {controls.map((control, index) => (
              <SketchButton
                key={control.label}
                label={control.label}
                seed={index + 2}
                fill={colors.card}
                textColor={colors.ink}
                onPress={() => control.run(useAppStore.getState())}
              />
            ))}
          </View>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  panel: {
    borderTopWidth: 2,
    borderTopColor: colors.ink,
    backgroundColor: colors.background,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  toggle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    color: colors.ink,
    fontSize: 13,
    fontWeight: '800',
  },
  body: {
    gap: spacing.sm,
    paddingTop: spacing.sm,
  },
  energy: {
    color: colors.muted,
    fontWeight: '700',
    fontSize: 12,
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
});
