import { useEffect, useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { useAnimatedStyle, useSharedValue } from 'react-native-reanimated';
import Svg, { Circle } from 'react-native-svg';
import { layoutVenn, PORTRAIT, type Membership } from '../overlapLayout';
import type { MockProfile } from '../types/demo';
import { colors, spacing } from '../theme';
import { Avatar } from './Avatar';

type Props = {
  tags: string[];
  profiles: MockProfile[];
  matches: (profile: MockProfile, tag: string) => boolean;
  hidden: (profile: MockProfile) => boolean;
  onOpen: (profileId: string) => void;
};

const circleColors = [colors.info, colors.sun, colors.passStamp] as const;
const VIEW_CAP = 560;

export function OverlapMap({ tags, profiles, matches, hidden, onOpen }: Props) {
  const shown = tags.slice(0, 3);
  const [width, setWidth] = useState(0);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const scale = useSharedValue(1);
  const startX = useSharedValue(0);
  const startY = useSharedValue(0);
  const startScale = useSharedValue(1);
  const membershipKey = `${shown.join('|')}::${profiles.map((profile) => profile.id).join('|')}`;
  const layout = useMemo(() => {
    const members: Membership[] = profiles.map((profile) => ({
      id: profile.id,
      mask: shown.reduce((bits, tag, index) => (matches(profile, tag) ? bits | (1 << index) : bits), 0),
    }));
    return layoutVenn(shown.length, members.filter((member) => member.mask > 0));
  }, [membershipKey, matches, profiles, shown]);
  const edge = 18;
  const fit = width > 0 && layout.width > 0 ? (width + edge * 2) / layout.width : 1;
  const contentWidth = Math.max(layout.width * fit, 1);
  const contentHeight = Math.max(layout.height * fit, 1);
  const viewportHeight = Math.min(Math.max(contentHeight, 280), VIEW_CAP);

  useEffect(() => {
    translateX.value = (width - contentWidth) / 2;
    translateY.value = contentHeight > viewportHeight ? (viewportHeight - contentHeight) / 2 : 0;
    scale.value = 1;
  }, [contentHeight, contentWidth, membershipKey, scale, translateX, translateY, viewportHeight, width]);

  const animated = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }, { translateY: translateY.value }, { scale: scale.value }],
  }));

  const pan = Gesture.Pan()
    .minDistance(8)
    .onStart(() => {
      startX.value = translateX.value;
      startY.value = translateY.value;
    })
    .onUpdate((event) => {
      translateX.value = startX.value + event.translationX;
      translateY.value = startY.value + event.translationY;
    });

  const pinch = Gesture.Pinch()
    .onStart(() => {
      startScale.value = scale.value;
    })
    .onUpdate((event) => {
      const next = startScale.value * event.scale;
      scale.value = Math.min(3, Math.max(1, next));
    });

  const byId = new Map(profiles.map((profile) => [profile.id, profile]));

  return (
    <View
      accessibilityLabel="Overlap map. Drag to move and pinch to zoom."
      style={styles.bleed}
      onLayout={(event) => {
        const next = Math.round(event.nativeEvent.layout.width);
        setWidth((current) => (current === next ? current : next));
      }}
    >
      <View style={styles.legend}>
        {shown.map((tag, index) => (
          <View key={tag} style={styles.legendItem}>
            <View style={[styles.swatch, { backgroundColor: circleColors[index] ?? colors.info }]} />
            <Text style={styles.legendText}>{tag}</Text>
          </View>
        ))}
      </View>
      {width > 0 ? (
        <View style={[styles.viewport, { height: viewportHeight }]}>
          <GestureDetector gesture={Gesture.Simultaneous(pan, pinch)} touchAction="none">
            <Animated.View style={[{ width: contentWidth, height: contentHeight }, animated]}>
              <Svg width={contentWidth} height={contentHeight} style={StyleSheet.absoluteFill}>
                {layout.circles.map((circle) => (
                  <Circle
                    key={circle.index}
                    cx={circle.cx * fit}
                    cy={circle.cy * fit}
                    r={circle.r * fit}
                    fill={circleColors[circle.index] ?? colors.info}
                    fillOpacity={0.82}
                    stroke={circleColors[circle.index] ?? colors.info}
                    strokeWidth={3}
                  />
                ))}
              </Svg>
              {layout.markers.map((marker) => {
                const profile = byId.get(marker.id);
                if (!profile) {
                  return null;
                }
                return (
                  <Pressable
                    key={profile.id}
                    accessibilityRole="button"
                    accessibilityLabel={profile.name}
                    onPress={() => onOpen(profile.id)}
                    style={[styles.person, { left: marker.x * fit - PORTRAIT / 2, top: marker.y * fit - PORTRAIT / 2 }]}
                  >
                    <Avatar
                      name={profile.name}
                      profileId={profile.id}
                      color={profile.photos[0] ?? colors.pass}
                      hidden={hidden(profile)}
                      size={PORTRAIT}
                    />
                    <Text style={styles.name}>{profile.name.split(' ')[0]}</Text>
                  </Pressable>
                );
              })}
            </Animated.View>
          </GestureDetector>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  bleed: {
    marginHorizontal: -spacing.lg,
  },
  legend: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.sm,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  swatch: {
    width: 14,
    height: 14,
    borderRadius: 7,
  },
  legendText: {
    color: colors.ink,
    fontWeight: '800',
    fontSize: 13,
  },
  viewport: {
    overflow: 'hidden',
  },
  person: {
    position: 'absolute',
    width: PORTRAIT,
    alignItems: 'center',
    zIndex: 2,
  },
  name: {
    color: colors.white,
    fontSize: 11,
    fontWeight: '800',
    textAlign: 'center',
    textShadowColor: colors.ink,
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
});
