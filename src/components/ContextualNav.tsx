import { Pressable, StyleSheet, Text, View } from 'react-native';
import { contextualNav } from '../navigation/contextualNav';
import { useAppStore } from '../store/useAppStore';
import { colors, spacing } from '../theme';

export function ContextualNav() {
  const screen = useAppStore((state) => state.activeScreen);
  const likesTab = useAppStore((state) => state.activeLikesTab);
  const goTo = useAppStore((state) => state.goTo);
  const items = contextualNav(screen);
  if (items.length === 0) {
    return null;
  }
  return (
    <View style={styles.bar}>
      {items.map((item) => {
        const selected =
          (item.screen === 'AppInfo' && screen === 'AppInfo') ||
          (item.screen === 'Profile' && screen === 'Profile') ||
          (item.likesTab !== undefined && screen === 'LikesHub' && item.likesTab === likesTab);
        return (
          <Pressable
            key={item.label}
            accessibilityRole="button"
            accessibilityState={{ selected }}
            onPress={() => goTo(item.screen, item.likesTab)}
            style={styles.item}
          >
            <View style={[styles.diamond, selected && styles.diamondOn]} />
            <Text style={[styles.label, selected && styles.labelOn]}>{item.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: colors.line,
    backgroundColor: colors.card,
    paddingVertical: spacing.sm,
  },
  item: {
    flex: 1,
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: 2,
  },
  diamond: {
    width: 10,
    height: 10,
    borderWidth: 1.5,
    borderColor: colors.coralDeep,
    transform: [{ rotate: '45deg' }],
  },
  diamondOn: {
    backgroundColor: colors.coralDeep,
  },
  label: {
    color: colors.muted,
    fontSize: 10,
    fontWeight: '700',
    textAlign: 'center',
  },
  labelOn: {
    color: colors.ink,
  },
});
