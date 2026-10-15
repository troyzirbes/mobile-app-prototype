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
        <View style={styles.fieldRow}>
          <TextInput
            value={value}
            onChangeText={onChangeText}
            onSubmitEditing={onSubmit}
            placeholder="illustrative AI prompt for display only"
            placeholderTextColor={colors.muted}
            style={styles.input}
          />
          <Pressable accessibilityRole="button" accessibilityLabel="Send" onPress={onSubmit} style={styles.send}>
            <Svg width={18} height={18} viewBox="0 0 18 18">
              <Path d="M 3 9 L 15 9 M 10 4 L 15 9 L 10 14" stroke={colors.white} strokeWidth={2.2} fill="none" strokeLinecap="round" strokeLinejoin="round" />
            </Svg>
          </Pressable>
        </View>
      </SketchFrame>
      {hint ? <Text style={styles.hint}>{hint}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    gap: spacing.md,
    marginTop: spacing.xl,
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
    paddingLeft: spacing.lg,
    paddingRight: spacing.sm,
    paddingVertical: spacing.sm,
  },
  fieldRow: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  input: {
    flex: 1,
    color: colors.ink,
    fontSize: 16,
    lineHeight: 22,
    paddingVertical: spacing.sm,
    userSelect: 'text',
  },
  send: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.likeStamp,
    alignItems: 'center',
    justifyContent: 'center',
  },
  hint: {
    color: colors.muted,
    textAlign: 'center',
  },
});
