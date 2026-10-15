import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { colors, spacing } from '../theme';
import { SketchFrame } from './SketchFrame';

type Props = {
  value: string;
  onChangeText: (value: string) => void;
  onSubmit: () => void;
  placeholder: string;
  hint?: string;
};

export function SketchField({ value, onChangeText, onSubmit, placeholder, hint }: Props) {
  return (
    <View style={styles.wrap}>
      <Text style={styles.or}>illustrative AI prompt for display only</Text>
      <SketchFrame fill={colors.card} seed={6} style={styles.stretch} contentStyle={styles.inputPad}>
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors.muted}
          style={styles.input}
        />
      </SketchFrame>
      {hint ? <Text style={styles.hint}>{hint}</Text> : null}
      <Pressable accessibilityRole="button" onPress={onSubmit}>
        <SketchFrame fill={colors.likeStamp} seed={9} contentStyle={styles.buttonPad}>
          <Text style={styles.buttonText}>Update</Text>
        </SketchFrame>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    gap: spacing.md,
  },
  or: {
    alignSelf: 'stretch',
    color: colors.ink,
    fontWeight: '700',
    fontSize: 15,
    lineHeight: 22,
    paddingHorizontal: spacing.sm,
    textAlign: 'center',
  },
  stretch: {
    alignSelf: 'stretch',
  },
  inputPad: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
  },
  input: {
    color: colors.ink,
    fontSize: 16,
    lineHeight: 22,
    padding: 0,
    userSelect: 'text',
  },
  hint: {
    color: colors.muted,
    textAlign: 'center',
  },
  buttonPad: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
  },
  buttonText: {
    color: colors.white,
    fontWeight: '800',
  },
});
