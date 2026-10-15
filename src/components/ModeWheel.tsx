import { useEffect, useMemo, useRef, useState } from 'react';
import { PanResponder, Pressable, StyleSheet, Text, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { searchTrackMeta } from '../navigation/tracks';
import { sketchCirclePath } from '../sketch';
import type { SearchTrack } from '../types/demo';
import { colors } from '../theme';
import { SketchFrame } from './SketchFrame';

const STAGE_W = 340;
const STAGE_H = 268;
const DISC = 136;
const RADIUS_X = 92;
const RADIUS_Y = 48;
const CENTER_X = STAGE_W / 2;
const CENTER_Y = 128;
const STEP = (Math.PI * 2) / searchTrackMeta.length;

function railPath(x: number, seed: number): string {
  const shift = (y: number, index: number) => x + Math.sin(y * 0.05 + seed + index) * 1.6;
  return `M ${shift(6, 1)} 6 Q ${shift(90, 2)} 90 ${shift(160, 3)} 160 T ${shift(STAGE_H - 8, 4)} ${STAGE_H - 8}`;
}

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
      <Svg width={STAGE_W} height={STAGE_H} style={styles.rails} pointerEvents="none">
        <Path d={railPath(16, 1)} stroke={colors.ink} strokeWidth={2} fill="none" />
        <Path d={railPath(STAGE_W - 16, 4)} stroke={colors.ink} strokeWidth={2} fill="none" />
      </Svg>
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
        return (
          <Pressable
            key={item.id}
            accessibilityRole="button"
            accessibilityLabel={item.id}
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
            <Svg width={DISC} height={DISC} pointerEvents="none">
              <Path
                d={sketchCirclePath(DISC, itemIndex + 3)}
                fill={colors.wheel}
                stroke={colors.ink}
                strokeWidth={1.75}
              />
            </Svg>
            <Text style={styles.icon}>{item.icon}</Text>
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
  },
  rails: {
    position: 'absolute',
    left: 0,
    top: 0,
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
  icon: {
    position: 'absolute',
    fontSize: 34,
  },
});
