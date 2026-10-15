import { useEffect, useMemo, useRef, useState } from 'react';
import { PanResponder, Pressable, StyleSheet, Text, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { searchTrackMeta } from '../navigation/tracks';
import { sketchCirclePath } from '../sketch';
import type { SearchTrack } from '../types/demo';
import { colors, spacing } from '../theme';
import { SketchFrame } from './SketchFrame';
import { WheelIcon } from './WheelIcon';

const STAGE_W = 340;
const STAGE_H = 304;
const DISC = 136;
const RADIUS_X = 108;
const RADIUS_Y = 60;
const CENTER_X = STAGE_W / 2;
const CENTER_Y = 150;
const STEP = (Math.PI * 2) / searchTrackMeta.length;

type Props = {
  index: number;
  onChange: (index: number) => void;
  onOpen: (track: SearchTrack) => void;
};

export function ModeWheel({ index, onChange, onOpen }: Props) {
  const count = searchTrackMeta.length;
  const current = searchTrackMeta[index] ?? searchTrackMeta[0];
  const angleRef = useRef(0);
  const [angle, setAngle] = useState(0);
  const [drag, setDrag] = useState(0);

  useEffect(() => {
    const from = angleRef.current;
    let to = -index * STEP;
    while (to - from > Math.PI) {
      to -= Math.PI * 2;
    }
    while (from - to > Math.PI) {
      to += Math.PI * 2;
    }
    const start = globalThis.performance.now();
    let frame = 0;
    const tick = (now: number) => {
      const progress = Math.min(1, (now - start) / 420);
      const eased = 1 - (1 - progress) ** 3;
      const next = from + (to - from) * eased;
      angleRef.current = next;
      setAngle(next);
      if (progress < 1) {
        frame = requestAnimationFrame(tick);
      }
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [index]);

  const pan = useMemo(
    () =>
      PanResponder.create({
        onMoveShouldSetPanResponder: (_event, gesture) =>
          Math.abs(gesture.dx) > 12 && Math.abs(gesture.dx) > Math.abs(gesture.dy),
        onPanResponderMove: (_event, gesture) => {
          setDrag(Math.max(-80, Math.min(80, gesture.dx)));
        },
        onPanResponderRelease: (_event, gesture) => {
          setDrag(0);
          if (gesture.dx > 28) {
            onChange((index + count - 1) % count);
          } else if (gesture.dx < -28) {
            onChange((index + 1) % count);
          }
        },
        onPanResponderTerminate: () => setDrag(0),
      }),
    [count, index, onChange],
  );

  if (!current) {
    return null;
  }

  const spin = angle + (drag / 80) * STEP;

  const placed = searchTrackMeta
    .map((item, itemIndex) => {
      const theta = spin + itemIndex * STEP;
      const depth = Math.cos(theta);
      return {
        item,
        itemIndex,
        depth,
        x: CENTER_X + Math.sin(theta) * RADIUS_X,
        y: CENTER_Y + depth * RADIUS_Y,
        scale: 0.84 + ((depth + 1) / 2) * 0.16,
      };
    })
    .sort((left, right) => left.depth - right.depth);

  return (
    <View style={styles.stage} {...pan.panHandlers}>
      <View style={styles.nameSlot}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`Open ${current.id}`}
          onPress={() => onOpen(current.id)}
          style={styles.namePress}
        >
          <SketchFrame fill={colors.card} seed={11} style={styles.nameFrame} contentStyle={styles.namePad}>
            <Text style={styles.name}>{current.id}</Text>
          </SketchFrame>
        </Pressable>
      </View>
      {placed.map(({ item, itemIndex, depth, x, y, scale }) => {
        const selected = itemIndex === index;
        const front = selected && drag === 0 && depth > 0.9;
        const pad = front ? 8 : 0;
        return (
          <Pressable
            key={item.id}
            accessibilityRole="button"
            accessibilityLabel={front ? `Open ${item.id}` : item.id}
            accessibilityState={{ selected }}
            onPress={() => {
              if (selected) {
                onOpen(item.id);
                return;
              }
              onChange(itemIndex);
            }}
            style={[
              styles.disc,
              {
                left: x - DISC / 2,
                top: y - DISC / 2,
                zIndex: Math.round((depth + 1) * 20) + 1,
                transform: [{ scale }],
              },
            ]}
          >
            <Svg
              width={DISC + pad * 2}
              height={DISC + pad * 2}
              viewBox={`${-pad} ${-pad} ${DISC + pad * 2} ${DISC + pad * 2}`}
              pointerEvents="none"
              style={{ position: 'absolute', left: -pad, top: -pad }}
            >
              {front ? (
                <Path
                  d={sketchCirclePath(DISC, itemIndex + 3)}
                  fill="none"
                  stroke={colors.likeStamp}
                  strokeWidth={10}
                />
              ) : null}
              <Path
                d={sketchCirclePath(DISC, itemIndex + 3)}
                fill={colors.wheel}
                stroke={colors.ink}
                strokeWidth={1.75}
              />
            </Svg>
            <View style={styles.iconSlot} pointerEvents="none">
              <WheelIcon track={item.id} />
            </View>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  stage: {
    width: STAGE_W,
    height: STAGE_H,
    alignSelf: 'center',
    marginTop: spacing.xxl,
  },
  nameSlot: {
    position: 'absolute',
    top: 0,
    left: 10,
    right: 10,
    zIndex: 30,
  },
  namePress: {
    alignSelf: 'stretch',
  },
  nameFrame: {
    alignSelf: 'stretch',
  },
  namePad: {
    paddingHorizontal: 18,
    paddingVertical: 12,
  },
  name: {
    color: colors.ink,
    fontWeight: '800',
    fontSize: 22,
    textAlign: 'center',
  },
  disc: {
    position: 'absolute',
    width: DISC,
    height: DISC,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconSlot: {
    zIndex: 2,
  },
});
