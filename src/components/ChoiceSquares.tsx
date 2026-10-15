import { useEffect, useRef } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { colors, spacing } from '../theme';

const CHIP_W = 112;
const CHIP_H = 40;
const STAGGER = 48;
const OVERHANG = 36;
const START = STAGGER + OVERHANG;
const ROW_MIN = 600;

type Props = {
  options: string[];
  selected: string[];
  onToggle: (value: string) => void;
  emptySlots?: number;
  tones?: string[];
  maxSelected?: number;
};

type Item = { key: string; label: string | null };

export function ChoiceSquares({ options, selected, onToggle, emptySlots = 3, tones, maxSelected }: Props) {
  const scroller = useRef<ScrollView>(null);
  const items: Item[] = [
    ...options.map((label) => ({ key: label, label })),
    ...Array.from({ length: emptySlots }, (_, index) => ({ key: `empty-${index}`, label: null })),
  ];
  const top = padRow(
    items.filter((_, index) => index % 2 === 0),
    'top',
  );
  const bottom = padRow(
    items.filter((_, index) => index % 2 === 1),
    'bottom',
  );

  useEffect(() => {
    scroller.current?.scrollTo({ x: START, animated: false });
  }, [top.length, bottom.length]);

  return (
    <ScrollView
      ref={scroller}
      horizontal
      nestedScrollEnabled
      showsHorizontalScrollIndicator={false}
      style={styles.rail}
      contentContainerStyle={styles.railContent}
      contentOffset={{ x: START, y: 0 }}
    >
      <View style={styles.stack}>
        <View style={[styles.row, styles.rowTop]}>{renderChips(top, selected, onToggle, tones, maxSelected)}</View>
        <View style={styles.row}>{renderChips(bottom, selected, onToggle, tones, maxSelected)}</View>
      </View>
    </ScrollView>
  );
}

function padRow(items: Item[], side: 'top' | 'bottom'): Item[] {
  const next = [...items];
  let extra = 0;
  while (rowWidth(next.length) < ROW_MIN) {
    next.push({ key: `${side}-pad-${extra}`, label: null });
    extra += 1;
  }
  return next;
}

function rowWidth(count: number): number {
  if (count <= 0) {
    return 0;
  }
  return count * CHIP_W + (count - 1) * spacing.sm;
}

function renderChips(
  items: Item[],
  selected: string[],
  onToggle: (value: string) => void,
  tones: string[] | undefined,
  maxSelected: number | undefined,
) {
  const full = maxSelected !== undefined && selected.length >= maxSelected;
  return items.map((item) => {
    const label = item.label;
    if (!label) {
      return <View key={item.key} accessibilityLabel="Empty choice" style={styles.chip} />;
    }
    const rank = selected.indexOf(label);
    const on = rank >= 0;
    const locked = full && !on;
    const background = on ? (tones?.[rank] ?? colors.infoDeep) : colors.info;
    const text = background === colors.sun ? colors.ink : colors.white;
    return (
      <Pressable
        key={item.key}
        accessibilityRole="button"
        accessibilityState={{ selected: on, disabled: locked }}
        onPress={() => {
          if (locked) {
            return;
          }
          onToggle(label);
        }}
        style={[styles.chip, { backgroundColor: background }, locked ? styles.locked : null]}
      >
        <Text style={[styles.label, { color: text }]} numberOfLines={1}>
          {label}
        </Text>
      </Pressable>
    );
  });
}

const styles = StyleSheet.create({
  rail: {
    height: CHIP_H * 2 + spacing.sm,
    marginHorizontal: -spacing.lg,
  },
  railContent: {
    paddingRight: spacing.xxl,
  },
  stack: {
    gap: spacing.sm,
  },
  row: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  rowTop: {
    marginLeft: STAGGER,
  },
  chip: {
    width: CHIP_W,
    height: CHIP_H,
    backgroundColor: colors.info,
    borderRadius: 6,
    paddingHorizontal: spacing.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  locked: {
    opacity: 0.4,
  },
  label: {
    color: colors.white,
    fontWeight: '800',
    fontSize: 13,
    lineHeight: 16,
    textAlign: 'center',
  },
});
