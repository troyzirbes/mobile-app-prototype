import { useEffect, useState } from 'react';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, {
  Extrapolation,
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  type SharedValue,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import type { DiscoveryCard } from '../data/mockDiscoveryData';
import { colors, radii, spacing } from '../theme';

export const SWIPE_THRESHOLD = 120;

const EXIT_SPRING = {
  damping: 18,
  stiffness: 160,
  mass: 0.7,
  overshootClamping: true,
};

const RETURN_SPRING = {
  damping: 14,
  stiffness: 180,
  mass: 0.6,
};

type Props = {
  cards: DiscoveryCard[];
  width: number;
  height: number;
  exitDistance: number;
  onSwipeRight: (card: DiscoveryCard) => void;
  onSwipeLeft: (card: DiscoveryCard) => void;
  onPressCard: (card: DiscoveryCard) => void;
};

export function CardDeck({
  cards,
  width,
  height,
  exitDistance,
  onSwipeRight,
  onSwipeLeft,
  onPressCard,
}: Props) {
  const [index, setIndex] = useState(0);
  const listKey = cards.map((card) => card.id).join('|');

  useEffect(() => {
    setIndex(0);
  }, [listKey]);

  const current = cards[index];
  const upcoming = cards.slice(index + 1, index + 3);

  const commit = (card: DiscoveryCard, direction: 'right' | 'left') => {
    if (direction === 'right') {
      onSwipeRight(card);
    } else {
      onSwipeLeft(card);
    }
    setIndex((value) => value + 1);
  };

  if (!current) {
    return (
      <View style={[styles.empty, { width, minHeight: height * 0.7 }]}>
        <Text style={styles.emptyTitle}>You're all caught up</Text>
        <Text style={styles.emptyBody}>
          Every card in this stack has been saved or skipped.
        </Text>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Review the deck again"
          onPress={() => setIndex(0)}
          style={({ pressed }) => [styles.restart, pressed && styles.restartPressed]}
        >
          <Text style={styles.restartText}>Review the deck again</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={{ width, height }}>
      {upcoming
        .slice()
        .reverse()
        .map((card, reversedIndex) => {
          const depth = upcoming.length - reversedIndex;
          return (
            <View
              key={card.id}
              pointerEvents="none"
              style={[
                styles.stacked,
                {
                  transform: [
                    { scale: depth === 1 ? 0.95 : 0.9 },
                    { translateY: depth === 1 ? 16 : 30 },
                  ],
                },
              ]}
            >
              <CardFace card={card} width={width} height={height} />
            </View>
          );
        })}
      <SwipeableCard
        key={current.id}
        card={current}
        width={width}
        height={height}
        exitDistance={exitDistance}
        onCommit={commit}
        onPress={onPressCard}
      />
    </View>
  );
}

type SwipeableCardProps = {
  card: DiscoveryCard;
  width: number;
  height: number;
  exitDistance: number;
  onCommit: (card: DiscoveryCard, direction: 'right' | 'left') => void;
  onPress: (card: DiscoveryCard) => void;
};

function SwipeableCard({
  card,
  width,
  height,
  exitDistance,
  onCommit,
  onPress,
}: SwipeableCardProps) {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);

  const release = (direction: 'right' | 'left') => {
    onCommit(card, direction);
  };

  const open = () => {
    onPress(card);
  };

  const pan = Gesture.Pan()
    .activeOffsetX([-12, 12])
    .failOffsetY([-28, 28])
    .onUpdate((event) => {
      translateX.value = event.translationX;
      translateY.value = event.translationY * 0.15;
    })
    .onEnd((event) => {
      const pastRight = event.translationX > SWIPE_THRESHOLD;
      const pastLeft = event.translationX < -SWIPE_THRESHOLD;
      if (pastRight || pastLeft) {
        const direction = pastRight ? 'right' : 'left';
        const destination = pastRight ? exitDistance : -exitDistance;
        translateX.value = withSpring(
          destination,
          { ...EXIT_SPRING, velocity: event.velocityX },
          (finished) => {
            if (finished) {
              runOnJS(release)(direction);
            }
          },
        );
        return;
      }
      translateX.value = withSpring(0, RETURN_SPRING);
      translateY.value = withSpring(0, RETURN_SPRING);
    });

  const tap = Gesture.Tap()
    .maxDistance(14)
    .onEnd((_event, success) => {
      if (success) {
        runOnJS(open)();
      }
    });

  const gesture = Gesture.Exclusive(pan, tap);

  const cardStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      {
        rotate: `${interpolate(
          translateX.value,
          [-SWIPE_THRESHOLD * 2, 0, SWIPE_THRESHOLD * 2],
          [-12, 0, 12],
          Extrapolation.CLAMP,
        )}deg`,
      },
    ],
  }));

  return (
    <GestureDetector gesture={gesture}>
      <Animated.View style={[styles.front, cardStyle]}>
        <CardFace
          card={card}
          width={width}
          height={height}
          translateX={translateX}
        />
      </Animated.View>
    </GestureDetector>
  );
}

type CardFaceProps = {
  card: DiscoveryCard;
  width: number;
  height: number;
  translateX?: SharedValue<number>;
};

function CardFace({ card, width, height, translateX }: CardFaceProps) {
  const saveStyle = useAnimatedStyle(() => ({
    opacity: translateX
      ? interpolate(
          translateX.value,
          [20, SWIPE_THRESHOLD],
          [0, 1],
          Extrapolation.CLAMP,
        )
      : 0,
  }));
  const skipStyle = useAnimatedStyle(() => ({
    opacity: translateX
      ? interpolate(
          translateX.value,
          [-SWIPE_THRESHOLD, -20],
          [1, 0],
          Extrapolation.CLAMP,
        )
      : 0,
  }));

  return (
    <View
      accessible
      accessibilityLabel={`${card.title}. ${card.matchScore} percent match. ${card.summary}`}
      style={[styles.card, { width, height }]}
    >
      <View pointerEvents="none" style={styles.photo}>
        <Image
          source={{ uri: card.imageUrl }}
          resizeMode="cover"
          style={styles.photo}
          accessible={false}
        />
      </View>
      <LinearGradient
        pointerEvents="none"
        colors={[colors.scrimClear, colors.scrim]}
        style={styles.scrim}
      />
      <View pointerEvents="none" style={styles.tags}>
        {card.tags.map((tag) => (
          <View key={tag} style={styles.tag}>
            <Text style={styles.tagText}>{tag}</Text>
          </View>
        ))}
      </View>
      <Animated.View pointerEvents="none" style={[styles.badge, styles.saveBadge, saveStyle]}>
        <Text style={styles.saveBadgeText}>SAVE</Text>
      </Animated.View>
      <Animated.View pointerEvents="none" style={[styles.badge, styles.skipBadge, skipStyle]}>
        <Text style={styles.skipBadgeText}>SKIP</Text>
      </Animated.View>
      <View pointerEvents="none" style={styles.identity}>
        <View style={styles.scorePill}>
          <Text style={styles.scoreText}>{card.matchScore}% match</Text>
        </View>
        <Text style={styles.title}>{card.title}</Text>
        <Text style={styles.summary} numberOfLines={2}>
          {card.summary}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  front: {
    zIndex: 2,
    cursor: 'pointer',
  },
  stacked: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: radii.card,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.line,
    shadowColor: colors.ink,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.12,
    shadowRadius: 18,
    elevation: 6,
    userSelect: 'none',
  },
  photo: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  },
  scrim: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 180,
  },
  tags: {
    position: 'absolute',
    top: spacing.lg,
    left: spacing.lg,
    flexDirection: 'row',
    gap: spacing.sm,
  },
  tag: {
    backgroundColor: colors.white,
    borderRadius: radii.chip,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs + 1,
  },
  tagText: {
    color: colors.ink,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  badge: {
    position: 'absolute',
    top: 28,
    borderWidth: 4,
    borderRadius: radii.stamp,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  saveBadge: {
    left: 20,
    borderColor: colors.likeStamp,
    transform: [{ rotate: '-16deg' }],
  },
  skipBadge: {
    right: 20,
    borderColor: colors.passStamp,
    transform: [{ rotate: '16deg' }],
  },
  saveBadgeText: {
    color: colors.likeStamp,
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: 2,
  },
  skipBadgeText: {
    color: colors.passStamp,
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: 2,
  },
  identity: {
    position: 'absolute',
    left: spacing.lg,
    right: spacing.lg,
    bottom: spacing.lg,
    gap: spacing.sm,
  },
  scorePill: {
    alignSelf: 'flex-start',
    backgroundColor: colors.coral,
    borderRadius: radii.chip,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs + 1,
  },
  scoreText: {
    color: colors.white,
    fontSize: 13,
    fontWeight: '700',
  },
  title: {
    color: colors.white,
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: -0.4,
  },
  summary: {
    color: colors.white,
    fontSize: 15,
    lineHeight: 21,
  },
  empty: {
    backgroundColor: colors.card,
    borderRadius: radii.card,
    borderWidth: 1,
    borderColor: colors.line,
    padding: spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.md,
  },
  emptyTitle: {
    color: colors.ink,
    fontSize: 26,
    fontWeight: '800',
    letterSpacing: -0.4,
    textAlign: 'center',
  },
  emptyBody: {
    color: colors.muted,
    fontSize: 16,
    lineHeight: 22,
    textAlign: 'center',
  },
  restart: {
    marginTop: spacing.sm,
    backgroundColor: colors.coral,
    borderRadius: radii.button,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
  },
  restartPressed: {
    backgroundColor: colors.coralDeep,
  },
  restartText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '700',
  },
});
