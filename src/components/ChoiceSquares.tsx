import { useEffect, useRef } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { colors, spacing } from '../theme';

const CHIP_W = 112;
const CHIP_H = 40;
const STAGGER = 44;
const START = 72;

type Props = {
  options: string[];
  selected: string[];
  onToggle: (value: string) => void;
  emptySlots?: number;
};

type Item = { key: string; label: string | null };

export function ChoiceSquares({ options, selected, onToggle, emptySlots = 3 }: Props) {
  const scroller = useRef<ScrollView>(null);
  const items: Item[] = [
    ...options.map((label) => ({ key: label, label })),
    ...Array.from({ length: emptySlots }, (_, index) => ({ key: `empty-${index}`, label: null })),
  ];
  const top = items.filter((_, index) => index % 2 === 0);
  const bottom = items.filter((_, index) => index % 2 === 1);

  useEffect(() => {
    scroller.current?.scrollTo({ x: START, animated: false });
  }, [items.length]);

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
        <View style={[styles.row, { marginLeft: STAGGER }]}>{renderChips(top, selected, onToggle)}</View>
        <View style={styles.row}>{renderChips(bottom, selected, onToggle)}</View>
      </View>
    </ScrollView>
  );
}

function renderChips(items: Item[], selected: string[], onToggle: (value: string) => void) {
  return items.map((item) => {
    const label = item.label;
    if (!label) {
      return <View key={item.key} accessibilityLabel="Empty choice" style={styles.chip} />;
    }
    const on = selected.includes(label);
    return (
      <Pressable
        key={item.key}
        accessibilityRole="button"
        accessibilityState={{ selected: on }}
        onPress={() => onToggle(label)}
        style={[styles.chip, on && styles.chipOn]}
      >
        <Text style={styles.label} numberOfLines={1}>
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
    paddingRight: spacing.lg,
  },
  stack: {
    gap: spacing.sm,
  },
  row: {
    flexDirection: 'row',
    gap: spacing.sm,
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
  chipOn: {
    backgroundColor: colors.infoDeep,
  },
  label: {
    color: colors.white,
    fontWeight: '800',
    fontSize: 13,
    lineHeight: 16,
    textAlign: 'center',
  },
});
