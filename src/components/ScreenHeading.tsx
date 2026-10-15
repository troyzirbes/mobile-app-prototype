import { useRef, useState, type ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, spacing } from '../theme';
import { InfoBubble } from './InfoBubble';

type Props = {
  title: string;
  detail: string;
  mark?: ReactNode;
  onTitleInset?: (inset: number) => void;
};

export function ScreenHeading({ title, detail, mark, onTitleInset }: Props) {
  const [open, setOpen] = useState(false);
  const [inset, setInset] = useState(0);
  const wrapRef = useRef<View>(null);
  const titleRef = useRef<Text>(null);

  const report = () => {
    const wrap = wrapRef.current;
    const titleNode = titleRef.current;
    if (!mark || !wrap || !titleNode) {
      return;
    }
    titleNode.measureLayout(
      wrap,
      (x) => {
        const next = Math.round(x);
        setInset((current) => (current === next ? current : next));
        onTitleInset?.(next);
      },
      () => undefined,
    );
  };

  return (
    <View ref={wrapRef} style={styles.wrap} onLayout={report}>
      <View style={[styles.row, mark ? styles.rowMarked : null]}>
        {mark}
        <Text ref={titleRef} onLayout={report} style={[styles.title, mark ? styles.titleStart : null]}>
          {title}
        </Text>
        <InfoBubble open={open} onPress={() => setOpen((value) => !value)} />
      </View>
      {open ? (
        <Text style={[styles.detail, mark ? styles.detailStart : null, mark ? { marginLeft: inset } : null]}>{detail}</Text>
      ) : null}
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
  rowMarked: {
    alignItems: 'center',
    justifyContent: 'center',
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
    flexShrink: 0,
    flexGrow: 0,
    textAlign: 'left',
  },
  detail: {
    color: colors.muted,
    lineHeight: 20,
    textAlign: 'center',
  },
  detailStart: {
    textAlign: 'left',
  },
});
