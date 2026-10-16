import { Pressable, StyleSheet, Text, type StyleProp, type ViewStyle } from 'react-native';
import { colors, spacing } from '../theme';
import { SketchFrame } from './SketchFrame';

type Props = {
  label: string;
  onPress: () => void;
  fill?: string;
  textColor?: string;
  seed?: number;
  block?: boolean;
};

export function SketchButton({
  label,
  onPress,
  fill = colors.likeStamp,
  textColor = colors.white,
  seed = 3,
  block = false,
}: Props) {
  const frameStyle: StyleProp<ViewStyle> = block ? styles.block : undefined;
  return (
    <Pressable accessibilityRole="button" onPress={onPress} style={frameStyle}>
      <SketchFrame fill={fill} seed={seed} style={frameStyle} contentStyle={styles.pad}>
        <Text style={[styles.label, block ? styles.center : null, { color: textColor }]}>{label}</Text>
      </SketchFrame>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  block: {
    alignSelf: 'stretch',
  },
  pad: {
    paddingLeft: spacing.lg,
    paddingRight: spacing.lg,
    paddingTop: spacing.sm,
    paddingBottom: spacing.sm,
  },
  label: {
    fontWeight: '800',
  },
  center: {
    textAlign: 'center',
  },
});
