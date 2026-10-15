import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { colors, spacing } from '../theme';

const SQUARE = 72;

type Props = {
  options: string[];
  selected: string[];
  onToggle: (value: string) => void;
  emptySlots?: number;
};

export function ChoiceSquares({ options, selected, onToggle, emptySlots = 3 }: Props) {
  return (
    <ScrollView
      horizontal
      nestedScrollEnabled
      showsHorizontalScrollIndicator={false}
      style={styles.rail}
      contentContainerStyle={styles.railContent}
    >
      {options.map((option) => {
        const on = selected.includes(option);
        return (
          <Pressable
            key={option}
            accessibilityRole="button"
            accessibilityState={{ selected: on }}
            onPress={() => onToggle(option)}
            style={[styles.square, on && styles.squareOn]}
          >
            <Text style={styles.label}>{option}</Text>
          </Pressable>
        );
      })}
      {Array.from({ length: emptySlots }, (_, index) => (
        <View key={`empty-${index}`} accessibilityLabel="Empty choice" style={styles.square} />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  rail: {
    height: SQUARE,
    marginHorizontal: -spacing.lg,
  },
  railContent: {
    paddingHorizontal: spacing.lg,
    gap: spacing.sm,
    alignItems: 'center',
  },
  square: {
    width: SQUARE,
    height: SQUARE,
    backgroundColor: colors.info,
    borderRadius: 6,
    padding: spacing.xs,
    alignItems: 'center',
    justifyContent: 'center',
  },
  squareOn: {
    backgroundColor: colors.infoDeep,
  },
  label: {
    color: colors.white,
    fontWeight: '800',
    fontSize: 11,
    lineHeight: 14,
    textAlign: 'center',
  },
});
