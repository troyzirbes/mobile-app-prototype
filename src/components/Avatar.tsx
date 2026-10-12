import { createAvatar } from '@dicebear/core';
import { personas } from '@dicebear/collection';
import { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SvgXml } from 'react-native-svg';
import { colors } from '../theme';

type Props = {
  name: string;
  color: string;
  hidden: boolean;
  size?: number;
};

export function Avatar({ name, color, hidden, size = 72 }: Props) {
  const xml = useMemo(() => createAvatar(personas, { seed: name }).toString(), [name]);
  if (hidden) {
    return (
      <View
        style={[
          styles.circle,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            backgroundColor: color,
          },
        ]}
      >
        <Text style={[styles.letter, { fontSize: size * 0.38 }]}>?</Text>
      </View>
    );
  }
  return (
    <View style={[styles.frame, { width: size, height: size, borderRadius: size / 2 }]}>
      <SvgXml xml={xml} width={size} height={size} />
    </View>
  );
}

const styles = StyleSheet.create({
  frame: {
    overflow: 'hidden',
    backgroundColor: colors.chip,
  },
  circle: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  letter: {
    color: colors.white,
    fontWeight: '800',
  },
});
