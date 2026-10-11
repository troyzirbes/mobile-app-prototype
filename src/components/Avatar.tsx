import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme';

type Props = {
  name: string;
  color: string;
  hidden: boolean;
  size?: number;
};

export function Avatar({ name, color, hidden, size = 72 }: Props) {
  return (
    <View
      style={[
        styles.circle,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: hidden ? colors.line : color,
        },
      ]}
    >
      <Text style={[styles.letter, { fontSize: size * 0.38 }]}>{hidden ? '?' : name.slice(0, 1)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  circle: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  letter: {
    color: colors.white,
    fontWeight: '800',
  },
});
