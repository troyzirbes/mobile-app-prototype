import { Pressable, StyleSheet, Text } from 'react-native';
import { colors } from '../theme';

type Props = {
  open: boolean;
  onPress: () => void;
};

export function InfoBubble({ open, onPress }: Props) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="More info"
      accessibilityState={{ expanded: open }}
      onPress={onPress}
      style={styles.bubble}
    >
      <Text style={styles.letter}>i</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  bubble: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: colors.info,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
  },
  letter: {
    color: colors.white,
    fontWeight: '800',
    fontSize: 13,
    lineHeight: 16,
  },
});
