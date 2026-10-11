import { LinearGradient } from 'expo-linear-gradient';
import { Animated, Image, StyleSheet, Text, View } from 'react-native';
import { colors, radii, spacing } from '../theme';
import type { Profile } from '../types/profile';

type Opacity = Animated.AnimatedInterpolation<number>;

type Props = {
  profile: Profile;
  width: number;
  height: number;
  likeOpacity?: Opacity;
  passOpacity?: Opacity;
};

export function ProfileCard({
  profile,
  width,
  height,
  likeOpacity,
  passOpacity,
}: Props) {
  return (
    <View
      accessible
      accessibilityLabel={`${profile.name}, ${profile.age}. ${profile.occupation} in ${profile.neighborhood}. ${profile.bio}`}
      style={[styles.card, { width, height }]}
    >
      <View style={styles.photoWrap}>
        <View pointerEvents="none" style={styles.photo}>
          <Image
            source={profile.photo}
            resizeMode="cover"
            style={styles.photo}
            accessible={false}
          />
        </View>
        <LinearGradient
          colors={[colors.scrimClear, colors.scrim]}
          style={styles.scrim}
        />
        <View style={styles.identity} pointerEvents="none">
          <Text style={styles.name}>
            {profile.name}, {profile.age}
          </Text>
          <Text style={styles.meta}>
            {profile.occupation} · {profile.neighborhood}
          </Text>
        </View>
        {likeOpacity ? (
          <Animated.View
            pointerEvents="none"
            style={[styles.stamp, styles.likeStamp, { opacity: likeOpacity }]}
          >
            <Text style={styles.likeStampText}>LIKE</Text>
          </Animated.View>
        ) : null}
        {passOpacity ? (
          <Animated.View
            pointerEvents="none"
            style={[styles.stamp, styles.passStamp, { opacity: passOpacity }]}
          >
            <Text style={styles.passStampText}>NOPE</Text>
          </Animated.View>
        ) : null}
      </View>
      <View style={styles.body}>
        <Text style={styles.bio}>{profile.bio}</Text>
        <View style={styles.chips}>
          {profile.interests.map((interest) => (
            <View key={interest} style={styles.chip}>
              <Text style={styles.chipText}>{interest}</Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
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
  photoWrap: {
    flex: 1,
    backgroundColor: colors.line,
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
    height: 140,
  },
  identity: {
    position: 'absolute',
    left: spacing.lg,
    right: spacing.lg,
    bottom: spacing.lg,
  },
  name: {
    color: colors.white,
    fontSize: 28,
    fontWeight: '700',
    letterSpacing: -0.4,
  },
  meta: {
    marginTop: spacing.xs,
    color: colors.white,
    fontSize: 15,
    opacity: 0.92,
  },
  body: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.lg,
    gap: spacing.md,
    backgroundColor: colors.card,
  },
  bio: {
    color: colors.ink,
    fontSize: 15,
    lineHeight: 21,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  chip: {
    backgroundColor: colors.chip,
    borderRadius: radii.chip,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs + 2,
  },
  chipText: {
    color: colors.ink,
    fontSize: 13,
    fontWeight: '600',
  },
  stamp: {
    position: 'absolute',
    top: 28,
    borderWidth: 4,
    borderRadius: radii.stamp,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  likeStamp: {
    left: 20,
    borderColor: colors.likeStamp,
    transform: [{ rotate: '-16deg' }],
  },
  passStamp: {
    right: 20,
    borderColor: colors.passStamp,
    transform: [{ rotate: '16deg' }],
  },
  likeStampText: {
    color: colors.likeStamp,
    fontSize: 32,
    fontWeight: '800',
    letterSpacing: 2,
  },
  passStampText: {
    color: colors.passStamp,
    fontSize: 32,
    fontWeight: '800',
    letterSpacing: 2,
  },
});
