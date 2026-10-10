import { forwardRef, useImperativeHandle, useRef } from 'react';
import { Animated, PanResponder, StyleSheet } from 'react-native';
import { ProfileCard } from './ProfileCard';
import { decideSwipe, SWIPE_DISTANCE, type CommittedSwipe } from '../swipe';
import type { Profile } from '../types/profile';

const EXIT_MS = 240;

export type SwipeCardHandle = {
  swipe: (decision: CommittedSwipe) => void;
};

type Props = {
  profile: Profile;
  width: number;
  height: number;
  exitDistance: number;
  onSwiped: (decision: CommittedSwipe) => void;
};

export const SwipeCard = forwardRef<SwipeCardHandle, Props>(function SwipeCard(
  { profile, width, height, exitDistance, onSwiped },
  ref,
) {
  const pan = useRef(new Animated.ValueXY()).current;
  const locked = useRef(false);
  const onSwipedRef = useRef(onSwiped);
  onSwipedRef.current = onSwiped;

  const fly = (decision: CommittedSwipe) => {
    if (locked.current) {
      return;
    }
    locked.current = true;
    const direction = decision === 'like' ? 1 : -1;
    pan.stopAnimation();
    Animated.timing(pan, {
      toValue: { x: direction * exitDistance, y: 36 },
      duration: EXIT_MS,
      useNativeDriver: false,
    }).start(({ finished }) => {
      if (finished) {
        onSwipedRef.current(decision);
        return;
      }
      locked.current = false;
    });
  };

  const flyRef = useRef(fly);
  flyRef.current = fly;

  useImperativeHandle(ref, () => ({
    swipe: (decision) => {
      flyRef.current(decision);
    },
  }));

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => !locked.current,
      onMoveShouldSetPanResponder: (_, gesture) =>
        !locked.current &&
        (Math.abs(gesture.dx) > 4 || Math.abs(gesture.dy) > 4),
      onPanResponderTerminationRequest: () => false,
      onPanResponderMove: (_, gesture) => {
        pan.setValue({ x: gesture.dx, y: gesture.dy });
      },
      onPanResponderRelease: (_, gesture) => {
        const decision = decideSwipe(gesture.dx, gesture.vx);
        if (decision === 'cancel') {
          Animated.spring(pan, {
            toValue: { x: 0, y: 0 },
            friction: 6,
            tension: 80,
            useNativeDriver: false,
          }).start();
          return;
        }
        flyRef.current(decision);
      },
      onPanResponderTerminate: () => {
        Animated.spring(pan, {
          toValue: { x: 0, y: 0 },
          friction: 6,
          useNativeDriver: false,
        }).start();
      },
    }),
  ).current;

  const rotate = pan.x.interpolate({
    inputRange: [-SWIPE_DISTANCE * 2, 0, SWIPE_DISTANCE * 2],
    outputRange: ['-12deg', '0deg', '12deg'],
    extrapolate: 'clamp',
  });

  const likeOpacity = pan.x.interpolate({
    inputRange: [0, SWIPE_DISTANCE],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  const passOpacity = pan.x.interpolate({
    inputRange: [-SWIPE_DISTANCE, 0],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  return (
    <Animated.View
      style={[
        styles.front,
        {
          transform: [
            { translateX: pan.x },
            { translateY: pan.y },
            { rotate },
          ],
        },
      ]}
      {...panResponder.panHandlers}
    >
      <ProfileCard
        profile={profile}
        width={width}
        height={height}
        likeOpacity={likeOpacity}
        passOpacity={passOpacity}
      />
    </Animated.View>
  );
});

const styles = StyleSheet.create({
  front: {
    zIndex: 2,
    cursor: 'pointer',
  },
});
