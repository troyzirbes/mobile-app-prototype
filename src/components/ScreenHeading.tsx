import { useState, type ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, spacing } from '../theme';
import { InfoBubble } from './InfoBubble';

type Props = {
  title: string;
  detail: string;
  mark?: ReactNode;
};

export function ScreenHeading({ title, detail, mark }: Props) {
  const [open, setOpen] = useState(false);
  return (
    <View style={styles.wrap}>
      <View style={[styles.row, mark ? styles.rowStart : null]}>
        {mark}
        <Text style={[styles.title, mark ? styles.titleStart : null]}>{title}</Text>
        <InfoBubble open={open} onPress={() => setOpen((value) => !value)} />
      </View>
      {open ? <Text style={[styles.detail, mark ? styles.titleStart : null]}>{detail}</Text> : null}
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
  rowStart: {
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  title: {
    flexShrink: 1,
    color: colors.ink,
    fontSize: 22,
    fontWeight: '800',
    lineHeight: 28,
    textAlign: 'center',
  },
  titleStart: {
    textAlign: 'left',
  },
  detail: {
    color: colors.muted,
    lineHeight: 20,
    textAlign: 'center',
  },
});
