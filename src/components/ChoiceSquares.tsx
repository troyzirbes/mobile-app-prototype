import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, spacing } from '../theme';

type Props = {
  options: string[];
  selected: string[];
  onToggle: (value: string) => void;
  emptySlots?: number;
};

export function ChoiceSquares({ options, selected, onToggle, emptySlots = 3 }: Props) {
  return (
    <View style={styles.grid}>
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
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  square: {
    width: '31%',
    aspectRatio: 1,
    backgroundColor: colors.info,
    borderRadius: 6,
    padding: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  squareOn: {
    backgroundColor: colors.infoDeep,
  },
  label: {
    color: colors.white,
    fontWeight: '800',
    fontSize: 13,
    lineHeight: 18,
    textAlign: 'center',
  },
});
