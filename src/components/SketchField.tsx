import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { colors, spacing } from '../theme';
import { SketchFrame } from './SketchFrame';

type Props = {
  value: string;
  onChangeText: (value: string) => void;
  onSubmit: () => void;
  hint?: string;
};

export function SketchField({ value, onChangeText, onSubmit, hint }: Props) {
  return (
    <View style={styles.wrap}>
      <View style={styles.promptRow}>
        <Text style={styles.or}>or type it out</Text>
        <Svg width={16} height={16} viewBox="0 0 16 16">
          <Path d="M 3 5 Q 8 12 13 5" stroke={colors.ink} strokeWidth={2.2} fill="none" strokeLinecap="round" />
        </Svg>
      </View>
      <SketchFrame fill={colors.card} seed={6} style={styles.stretch} contentStyle={styles.inputPad}>
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder="illustrative AI prompt for display only"
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
  promptRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
  },
  or: {
    color: colors.ink,
    fontWeight: '700',
    fontSize: 15,
    lineHeight: 22,
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
