import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { colors, spacing } from '../theme';
import { SketchArrow } from './SketchArrow';
import { SketchFrame } from './SketchFrame';

type Props = {
  value: string;
  onChangeText: (value: string) => void;
  align?: 'center' | 'start';
  labelInset?: number;
  open?: boolean;
  onToggle?: () => void;
};

export function SketchField({ value, onChangeText, align = 'center', labelInset = 0, open = true, onToggle }: Props) {
  const label = (
    <>
      <Text style={styles.or}>or type it out</Text>
      <SketchArrow direction={open ? 'down' : 'right'} size={20} />
    </>
  );
  return (
    <View style={styles.wrap}>
      {onToggle ? (
        <Pressable
          accessibilityRole="button"
          accessibilityState={{ expanded: open }}
          onPress={onToggle}
          style={[
            styles.promptRow,
            align === 'start' ? styles.promptStart : null,
            align === 'start' ? { marginLeft: labelInset } : null,
          ]}
        >
          {label}
        </Pressable>
      ) : (
        <View
          style={[
            styles.promptRow,
            align === 'start' ? styles.promptStart : null,
            align === 'start' ? { marginLeft: labelInset } : null,
          ]}
        >
          {label}
        </View>
      )}
      {open ? (
        <SketchFrame fill={colors.card} seed={6} style={styles.stretch} contentStyle={styles.inputPad}>
          <View style={styles.fieldRow}>
            <TextInput
              value={value}
              onChangeText={onChangeText}
              placeholder="illustrative AI prompt for display only"
              placeholderTextColor={colors.muted}
              style={styles.input}
            />
            <View accessible={false} style={styles.send}>
              <SketchArrow direction="right" size={26} />
            </View>
          </View>
        </SketchFrame>
      ) : null}
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
  promptStart: {
    alignSelf: 'stretch',
    justifyContent: 'flex-start',
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
    paddingLeft: spacing.xxl,
    paddingRight: spacing.xl,
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
    fontSize: 14,
    lineHeight: 20,
    paddingVertical: spacing.sm,
    userSelect: 'text',
  },
  send: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.muted,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
