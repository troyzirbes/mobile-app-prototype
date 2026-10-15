import { createAvatar } from '@dicebear/core';
import { personas } from '@dicebear/collection';
import { useMemo } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { SvgXml } from 'react-native-svg';
import { portraits } from '../data/portraits';
import { colors } from '../theme';

type Props = {
  name: string;
  color: string;
  hidden: boolean;
  size?: number;
  profileId?: string;
};

export function Avatar({ name, color, hidden, size = 72, profileId }: Props) {
  const xml = useMemo(() => createAvatar(personas, { seed: name }).toString(), [name]);
  const portrait = profileId ? portraits[profileId] : undefined;
  if (hidden || portrait === undefined) {
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
  return (
    <View style={[styles.frame, { width: size, height: size, borderRadius: size / 2 }]}>
      <Image source={portrait} style={{ width: size, height: size }} resizeMode="cover" />
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
