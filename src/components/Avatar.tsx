import { Image, StyleSheet, Text, View } from 'react-native';
import { portraits } from '../data/portraits';
import { colors, fonts, shadow } from '../theme';

type Props = {
  name: string;
  color: string;
  hidden: boolean;
  size?: number;
  profileId?: string;
  shape?: 'round' | 'card';
};

export function Avatar({ name, color, hidden, size = 72, profileId, shape = 'round' }: Props) {
  const portrait = profileId ? portraits[profileId] : undefined;
  const card = shape === 'card';
  const height = card ? Math.round(size * 1.28) : size;
  const radius = card ? 22 : size / 2;
  if (hidden || portrait === undefined) {
    return (
      <View
        style={[
          styles.circle,
          shadow,
          {
            width: size,
            height,
            borderRadius: radius,
            backgroundColor: hidden ? colors.chip : color,
          },
        ]}
      >
        <Text style={[styles.letter, { fontSize: size * 0.34 }]}>{hidden ? '?' : name.slice(0, 1)}</Text>
      </View>
    );
  }
  return (
    <View style={[styles.frame, shadow, { width: size, height, borderRadius: radius }]}>
      <Image source={portrait} style={{ width: size, height }} resizeMode="cover" />
    </View>
  );
}

const styles = StyleSheet.create({
  frame: {
    overflow: 'hidden',
    backgroundColor: colors.chip,
    borderWidth: 3,
    borderColor: colors.inkLine,
  },
  circle: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: colors.inkLine,
  },
  letter: {
    color: colors.ink,
    fontFamily: fonts.display,
  },
});
