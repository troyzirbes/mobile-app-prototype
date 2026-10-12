import { Pressable, StyleSheet, Text, View } from 'react-native';
import { contextualNav } from '../navigation/contextualNav';
import { useAppStore } from '../store/useAppStore';
import { colors, fonts, radii, spacing } from '../theme';

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
            style={[styles.item, selected && styles.itemOn]}
          >
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
    backgroundColor: colors.card,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.sm,
    borderTopWidth: 2,
    borderTopColor: colors.inkLine,
    gap: spacing.xs,
  },
  item: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: spacing.xs,
    paddingVertical: spacing.sm,
    borderRadius: radii.chip,
  },
  itemOn: {
    backgroundColor: colors.chip,
  },
  label: {
    color: colors.muted,
    fontFamily: fonts.body,
    fontSize: 12,
    textAlign: 'center',
  },
  labelOn: {
    color: colors.coralDeep,
    fontFamily: fonts.bodyBold,
  },
});
