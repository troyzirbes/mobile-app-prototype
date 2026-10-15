import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, spacing } from '../theme';
import { InfoBubble } from './InfoBubble';

type Props = {
  title: string;
  detail: string;
};

export function ScreenHeading({ title, detail }: Props) {
  const [open, setOpen] = useState(false);
  return (
    <View style={styles.wrap}>
      <View style={styles.row}>
        <Text style={styles.title}>{title}</Text>
        <InfoBubble open={open} onPress={() => setOpen((value) => !value)} />
      </View>
      {open ? <Text style={styles.detail}>{detail}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    gap: spacing.sm,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  title: {
    flexShrink: 1,
    color: colors.ink,
    fontSize: 22,
    fontWeight: '800',
    lineHeight: 28,
    textAlign: 'center',
  },
  detail: {
    color: colors.muted,
    lineHeight: 20,
    textAlign: 'center',
  },
});
