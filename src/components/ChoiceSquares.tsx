import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { colors, spacing } from '../theme';

const CHIP_W = 124;
const CHIP_H = 40;

type Props = {
  options: string[];
  selected: string[];
  onToggle: (value: string) => void;
  emptySlots?: number;
};

export function ChoiceSquares({ options, selected, onToggle, emptySlots = 3 }: Props) {
  const count = options.length + emptySlots;
  const columns = Math.ceil(count / 2);
  const gridWidth = columns * CHIP_W + Math.max(0, columns - 1) * spacing.sm;

  return (
    <ScrollView
      horizontal
      nestedScrollEnabled
      showsHorizontalScrollIndicator={false}
      style={styles.rail}
      contentContainerStyle={styles.railContent}
    >
      <View style={[styles.grid, { width: gridWidth }]}>
        {options.map((option) => {
          const on = selected.includes(option);
          return (
            <Pressable
              key={option}
              accessibilityRole="button"
              accessibilityState={{ selected: on }}
              onPress={() => onToggle(option)}
              style={[styles.chip, on && styles.chipOn]}
            >
              <Text style={styles.label} numberOfLines={1}>
                {option}
              </Text>
            </Pressable>
          );
        })}
        {Array.from({ length: emptySlots }, (_, index) => (
          <View key={`empty-${index}`} accessibilityLabel="Empty choice" style={styles.chip} />
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  rail: {
    height: CHIP_H * 2 + spacing.sm,
    marginHorizontal: -spacing.lg,
  },
  railContent: {
    paddingHorizontal: spacing.lg,
  },
  grid: {
    height: CHIP_H * 2 + spacing.sm,
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignContent: 'flex-start',
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
