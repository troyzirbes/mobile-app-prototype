import { useState, type ReactNode } from 'react';
import { StyleSheet, View, type LayoutChangeEvent, type StyleProp, type ViewStyle } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { sketchRoundRectPath } from '../sketch';
import { colors } from '../theme';

type Props = {
  children: ReactNode;
  fill: string;
  stroke?: string;
  seed?: number;
  style?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<ViewStyle>;
};

export function SketchFrame({ children, fill, stroke = colors.ink, seed = 1, style, contentStyle }: Props) {
  const [size, setSize] = useState({ width: 0, height: 0 });
  const onLayout = (event: LayoutChangeEvent) => {
    const { width, height } = event.nativeEvent.layout;
    setSize((current) => (current.width === width && current.height === height ? current : { width, height }));
  };

  return (
    <View onLayout={onLayout} style={[styles.frame, style]}>
      {size.width > 0 && size.height > 0 ? (
        <Svg width={size.width} height={size.height} style={StyleSheet.absoluteFill} pointerEvents="none">
          <Path d={sketchRoundRectPath(size.width, size.height, seed)} fill={fill} stroke={stroke} strokeWidth={2} />
        </Svg>
      ) : null}
      <View style={[styles.content, contentStyle]}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  frame: {
    alignSelf: 'flex-start',
  },
  content: {
    padding: 12,
  },
});
