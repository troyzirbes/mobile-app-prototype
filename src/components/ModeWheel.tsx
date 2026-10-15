import { useEffect, useMemo, useRef, useState } from 'react';
import { PanResponder, Pressable, StyleSheet, Text, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { searchTrackMeta } from '../navigation/tracks';
import { sketchCirclePath } from '../sketch';
import type { SearchTrack } from '../types/demo';
import { colors } from '../theme';
import { SketchFrame } from './SketchFrame';

const WHEEL = 300;
const DISC = 76;
const RADIUS = 96;
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

  return (
    <View style={styles.wrap}>
      <Pressable accessibilityRole="button" accessibilityLabel={`Open ${current.id}`} onPress={() => onOpen(current.id)}>
        <SketchFrame fill={colors.card} seed={11} contentStyle={styles.namePad}>
          <Text style={styles.name}>{current.id}</Text>
        </SketchFrame>
      </Pressable>
      <View style={styles.wheel} {...pan.panHandlers}>
        {searchTrackMeta.map((item, itemIndex) => {
          const theta = spin + itemIndex * STEP + Math.PI / 2;
          const left = WHEEL / 2 + Math.cos(theta) * RADIUS - DISC / 2;
          const top = WHEEL / 2 + Math.sin(theta) * RADIUS - DISC / 2;
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
              style={[styles.disc, { left, top, transform: [{ scale: selected ? 1.08 : 0.94 }] }]}
            >
              <Svg width={DISC} height={DISC} pointerEvents="none">
                <Path
                  d={sketchCirclePath(DISC, itemIndex + 3)}
                  fill={colors.olive}
                  stroke={colors.background}
                  strokeWidth={2.5}
                />
              </Svg>
              <Text style={styles.icon}>{item.icon}</Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
  },
  namePad: {
    paddingHorizontal: 18,
    paddingVertical: 8,
  },
  name: {
    color: colors.ink,
    fontWeight: '800',
    fontSize: 16,
  },
  wheel: {
    width: WHEEL,
    height: WHEEL,
    marginTop: -8,
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
    fontSize: 26,
  },
});
