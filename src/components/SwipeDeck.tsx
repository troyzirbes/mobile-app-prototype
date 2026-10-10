import { useEffect, useRef, useState } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import { ActionBar } from './ActionBar';
import { ProfileCard } from './ProfileCard';
import { SwipeCard, type SwipeCardHandle } from './SwipeCard';
import { formatLikedNames } from '../copy';
import { colors, radii, spacing } from '../theme';
import type { Profile } from '../types/profile';
import type { CommittedSwipe } from '../swipe';

type Props = {
  profiles: Profile[];
};

export function SwipeDeck({ profiles }: Props) {
  const { width: windowWidth, height: windowHeight } = useWindowDimensions();
  const frameWidth = Math.min(windowWidth, 440);
  const cardWidth = frameWidth - spacing.lg * 2;
  const cardHeight = Math.min(560, Math.max(380, windowHeight - 230));
  const exitDistance = Math.max(windowWidth, frameWidth) + 80;

  const [index, setIndex] = useState(0);
  const [likes, setLikes] = useState<string[]>([]);
  const [notice, setNotice] = useState<string | null>(null);
  const cardRef = useRef<SwipeCardHandle>(null);
  const indexRef = useRef(index);
  const profilesRef = useRef(profiles);
  indexRef.current = index;
  profilesRef.current = profiles;

  const current = profiles[index];
  const upcoming = profiles.slice(index + 1, index + 3);
  const remaining = Math.max(profiles.length - index, 0);

  useEffect(() => {
    if (!notice) {
      return;
    }
    const timer = setTimeout(() => setNotice(null), 2200);
    return () => clearTimeout(timer);
  }, [notice]);

  const handleSwiped = (decision: CommittedSwipe) => {
    const profile = profilesRef.current[indexRef.current];
    if (!profile) {
      return;
    }
    if (decision === 'like') {
      setLikes((prev) => [...prev, profile.name]);
      setNotice(`Liked ${profile.name}`);
    } else {
      setNotice(`Passed on ${profile.name}`);
    }
    setIndex((value) => value + 1);
  };

  const restart = () => {
    setLikes([]);
    setNotice(null);
    setIndex(0);
  };

  return (
    <View style={[styles.frame, { width: frameWidth }]}>
      <View style={styles.header}>
        <View style={styles.titleBlock}>
          <Text style={styles.brand}>Spark</Text>
          <Text style={styles.subtitle}>Drag right to like, left to pass</Text>
        </View>
        <Text style={styles.count}>{remaining} left</Text>
      </View>

      <View style={styles.noticeSlot}>
        {notice ? (
          <View accessibilityLiveRegion="polite" style={styles.notice}>
            <Text style={styles.noticeText}>{notice}</Text>
          </View>
        ) : null}
      </View>

      <View style={[styles.stage, { minHeight: cardHeight + spacing.xl }]}>
        {current ? (
          <View style={{ width: cardWidth, height: cardHeight }}>
            {upcoming
              .slice()
              .reverse()
              .map((profile, reversedIndex) => {
                const depth = upcoming.length - reversedIndex;
                return (
                  <View
                    key={profile.id}
                    pointerEvents="none"
                    style={[
                      styles.stacked,
                      {
                        transform: [
                          { scale: depth === 1 ? 0.94 : 0.88 },
                          { translateY: depth === 1 ? 22 : 40 },
                        ],
                      },
                    ]}
                  >
                    <ProfileCard
                      profile={profile}
                      width={cardWidth}
                      height={cardHeight}
                    />
                  </View>
                );
              })}
            <SwipeCard
              key={current.id}
              ref={cardRef}
              profile={current}
              width={cardWidth}
              height={cardHeight}
              exitDistance={exitDistance}
              onSwiped={handleSwiped}
            />
          </View>
        ) : (
          <View style={[styles.empty, { width: cardWidth, minHeight: cardHeight * 0.72 }]}>
            <Text style={styles.emptyTitle}>You're all caught up</Text>
            <Text style={styles.emptyBody}>{formatLikedNames(likes)}</Text>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Review the deck again"
              onPress={restart}
              style={({ pressed }) => [
                styles.restart,
                pressed && styles.restartPressed,
              ]}
            >
              <Text style={styles.restartText}>Review the deck again</Text>
            </Pressable>
          </View>
        )}
      </View>

      {current ? (
        <ActionBar
          onPass={() => cardRef.current?.swipe('pass')}
          onLike={() => cardRef.current?.swipe('like')}
        />
      ) : (
        <View style={styles.actionSpacer} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  frame: {
    flex: 1,
    alignSelf: 'center',
    paddingHorizontal: spacing.lg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    paddingTop: spacing.sm,
  },
  titleBlock: {
    flexShrink: 1,
    paddingRight: spacing.md,
  },
  brand: {
    color: colors.ink,
    fontSize: 32,
    fontWeight: '800',
    letterSpacing: -0.8,
  },
  subtitle: {
    marginTop: 2,
    color: colors.muted,
    fontSize: 14,
  },
  count: {
    color: colors.coralDeep,
    fontSize: 14,
    fontWeight: '700',
    paddingBottom: 2,
  },
  noticeSlot: {
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notice: {
    backgroundColor: colors.ink,
    borderRadius: radii.chip,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs + 2,
  },
  noticeText: {
    color: colors.white,
    fontSize: 13,
    fontWeight: '600',
  },
  stage: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stacked: {
    position: 'absolute',
    top: 0,
    left: 0,
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
  actionSpacer: {
    height: 96,
  },
});
