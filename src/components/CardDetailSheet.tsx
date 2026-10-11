import { useEffect, useState } from 'react';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import {
  Image,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import type { DiscoveryCard } from '../data/mockDiscoveryData';
import { colors, radii, spacing } from '../theme';

const SHEET_SPRING = {
  damping: 22,
  stiffness: 220,
  mass: 0.8,
};

type Props = {
  card: DiscoveryCard | null;
  saved: boolean;
  onClose: () => void;
  onConnect: (card: DiscoveryCard) => void;
  onSave: (card: DiscoveryCard) => void;
};

export function CardDetailSheet({ card, saved, onClose, onConnect, onSave }: Props) {
  const { height: windowHeight } = useWindowDimensions();
  const sheetHeight = Math.min(760, Math.round(windowHeight * 0.86));
  const [presented, setPresented] = useState<DiscoveryCard | null>(card);
  const progress = useSharedValue(0);
  const dragY = useSharedValue(0);

  useEffect(() => {
    if (card) {
      setPresented(card);
      dragY.value = 0;
      progress.value = withSpring(1, SHEET_SPRING);
      return;
    }
    dragY.value = withTiming(0, { duration: 180 });
    progress.value = withTiming(0, { duration: 220 }, (finished) => {
      if (finished) {
        runOnJS(setPresented)(null);
      }
    });
  }, [card, dragY, progress]);

  const dismiss = Gesture.Pan()
    .activeOffsetY(8)
    .onUpdate((event) => {
      dragY.value = Math.max(0, event.translationY);
    })
    .onEnd((event) => {
      if (event.translationY > 90) {
        runOnJS(onClose)();
        return;
      }
      dragY.value = withSpring(0, SHEET_SPRING);
    });

  const backdropStyle = useAnimatedStyle(() => ({
    opacity: progress.value * 0.45,
  }));

  const sheetStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: (1 - progress.value) * sheetHeight + dragY.value }],
  }));

  if (!presented) {
    return null;
  }

  return (
    <Modal
      visible
      transparent
      animationType="none"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <View style={styles.root}>
        <Animated.View style={[styles.backdrop, backdropStyle]}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Close details"
            onPress={onClose}
            style={styles.backdropPress}
          />
        </Animated.View>
        <Animated.View style={[styles.sheet, { height: sheetHeight }, sheetStyle]}>
          <GestureDetector gesture={dismiss}>
            <View style={styles.handleHit}>
              <View style={styles.handle} />
            </View>
          </GestureDetector>
          <ScrollView
            style={styles.scroll}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            <Image
              source={{ uri: presented.imageUrl }}
              resizeMode="cover"
              style={styles.hero}
              accessible={false}
            />
            <View style={styles.body}>
              <View style={styles.titleRow}>
                <Text style={styles.title}>{presented.title}</Text>
                <View style={styles.score}>
                  <Text style={styles.scoreValue}>{presented.matchScore}%</Text>
                  <Text style={styles.scoreLabel}>match</Text>
                </View>
              </View>
              <Text style={styles.meta}>
                {presented.metadata.age} · {presented.metadata.occupation} ·{' '}
                {presented.metadata.neighborhood}
              </Text>
              <Text style={styles.distance}>{presented.metadata.distance}</Text>
              <View style={styles.tags}>
                {presented.tags.map((tag) => (
                  <View key={tag} style={styles.tag}>
                    <Text style={styles.tagText}>{tag}</Text>
                  </View>
                ))}
              </View>
              <Text style={styles.description}>{presented.metadata.description}</Text>
              <View style={styles.highlights}>
                {presented.metadata.highlights.map((highlight) => (
                  <View key={highlight} style={styles.highlight}>
                    <Text style={styles.highlightText}>{highlight}</Text>
                  </View>
                ))}
              </View>
            </View>
          </ScrollView>
          <View style={styles.actions}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={saved ? 'Saved' : 'Save'}
              onPress={() => onSave(presented)}
              style={({ pressed }) => [styles.save, pressed && styles.pressed]}
            >
              <Text style={styles.saveText}>{saved ? 'Saved' : 'Save'}</Text>
            </Pressable>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Connect"
              onPress={() => onConnect(presented)}
              style={({ pressed }) => [styles.connect, pressed && styles.connectPressed]}
            >
              <Text style={styles.connectText}>Connect</Text>
            </Pressable>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFill,
    backgroundColor: colors.ink,
  },
  backdropPress: {
    flex: 1,
  },
  sheet: {
    backgroundColor: colors.card,
    borderTopLeftRadius: radii.card,
    borderTopRightRadius: radii.card,
    overflow: 'hidden',
  },
  handleHit: {
    alignItems: 'center',
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
  },
  handle: {
    width: 42,
    height: 5,
    borderRadius: radii.chip,
    backgroundColor: colors.line,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: spacing.lg,
  },
  hero: {
    height: 280,
    marginHorizontal: spacing.lg,
    borderRadius: radii.card - 8,
    backgroundColor: colors.line,
  },
  body: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    gap: spacing.sm,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  title: {
    flex: 1,
    color: colors.ink,
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  score: {
    alignItems: 'center',
    backgroundColor: colors.chip,
    borderRadius: radii.stamp,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  scoreValue: {
    color: colors.coralDeep,
    fontSize: 20,
    fontWeight: '800',
  },
  scoreLabel: {
    color: colors.muted,
    fontSize: 12,
    fontWeight: '700',
  },
  meta: {
    color: colors.ink,
    fontSize: 15,
    fontWeight: '600',
  },
  distance: {
    color: colors.muted,
    fontSize: 14,
  },
  tags: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.xs,
  },
  tag: {
    backgroundColor: colors.chip,
    borderRadius: radii.chip,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs + 1,
  },
  tagText: {
    color: colors.ink,
    fontSize: 12,
    fontWeight: '700',
  },
  description: {
    marginTop: spacing.sm,
    color: colors.ink,
    fontSize: 16,
    lineHeight: 23,
  },
  highlights: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  highlight: {
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radii.chip,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs + 2,
  },
  highlightText: {
    color: colors.ink,
    fontSize: 13,
    fontWeight: '600',
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.md,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.line,
    backgroundColor: colors.card,
  },
  save: {
    flex: 1,
    borderWidth: 2,
    borderColor: colors.pass,
    borderRadius: radii.button,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md,
  },
  saveText: {
    color: colors.ink,
    fontSize: 16,
    fontWeight: '700',
  },
  connect: {
    flex: 1,
    backgroundColor: colors.coral,
    borderRadius: radii.button,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md,
  },
  connectPressed: {
    backgroundColor: colors.coralDeep,
  },
  connectText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '700',
  },
  pressed: {
    opacity: 0.75,
  },
});
