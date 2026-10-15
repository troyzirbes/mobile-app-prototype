import { Image, StyleSheet, View } from 'react-native';

const SOURCE_WIDTH = 30;
const SOURCE_HEIGHT = 65;

type Props = {
  direction: 'down' | 'right';
  size?: number;
};

export function SketchArrow({ direction, size = 22 }: Props) {
  const height = size;
  const width = (size * SOURCE_WIDTH) / SOURCE_HEIGHT;
  const boxWidth = direction === 'right' ? height : width;
  const boxHeight = direction === 'right' ? width : height;

  return (
    <View style={[styles.box, { width: boxWidth, height: boxHeight }]}>
      <Image
        source={require('../../assets/sketch-arrow.png')}
        accessible={false}
        style={{
          width,
          height,
          transform: [{ rotate: direction === 'right' ? '-90deg' : '0deg' }],
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
