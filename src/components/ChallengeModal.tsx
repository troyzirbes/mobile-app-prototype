import { useEffect, useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, fonts, radii, spacing } from '../theme';

const SEQUENCE = ['Palm', 'Two fingers', 'Wave'] as const;
const LIMIT_SECONDS = 60;

type Props = {
  profileName: string | null;
  onClose: () => void;
  onPass: () => void;
};

export function ChallengeModal({ profileName, onClose, onPass }: Props) {
  const [index, setIndex] = useState(0);
  const [seconds, setSeconds] = useState(LIMIT_SECONDS);
  const [miss, setMiss] = useState(false);

  useEffect(() => {
    if (!profileName) {
      return;
    }
    setIndex(0);
    setSeconds(LIMIT_SECONDS);
    setMiss(false);
  }, [profileName]);

  useEffect(() => {
    if (!profileName || seconds <= 0) {
      return;
    }
    const timer = setTimeout(() => setSeconds((value) => value - 1), 1000);
    return () => clearTimeout(timer);
  }, [profileName, seconds]);

  if (!profileName) {
    return null;
  }

  const expired = seconds <= 0;

  return (
    <Modal visible transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <View style={styles.sheet}>
          <Text style={styles.kicker}>Challenge authenticity</Text>
          <Text style={styles.title}>{profileName}</Text>
          <Text style={styles.body}>
            Tap {SEQUENCE.join(', then ')}. You have {seconds}s. This uses today’s challenge.
          </Text>
          <View style={styles.row}>
            {SEQUENCE.map((label) => (
              <Pressable
                key={label}
                accessibilityRole="button"
                accessibilityLabel={label}
                disabled={expired}
                onPress={() => {
                  if (label !== SEQUENCE[index]) {
                    setIndex(0);
                    setMiss(true);
                    return;
                  }
                  const next = index + 1;
                  setMiss(false);
                  if (next >= SEQUENCE.length) {
                    onPass();
                    onClose();
                    return;
                  }
                  setIndex(next);
                }}
                style={styles.gesture}
              >
                <Text style={styles.gestureText}>{label}</Text>
              </Pressable>
            ))}
          </View>
          <Text style={styles.hint}>
            {expired ? 'Time is up. The 24-hour limit still applies.' : miss ? 'Sequence reset.' : `Next: ${SEQUENCE[index]}`}
          </Text>
          <Pressable accessibilityRole="button" onPress={onClose} style={styles.close}>
            <Text style={styles.closeText}>Close</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: colors.scrim,
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: colors.card,
    borderTopLeftRadius: radii.card,
    borderTopRightRadius: radii.card,
    padding: spacing.lg,
    gap: spacing.md,
  },
  kicker: {
    color: colors.muted,
    fontFamily: fonts.bodyBold,
    fontSize: 13,
  },
  title: {
    color: colors.ink,
    fontFamily: fonts.display,
    fontSize: 28,
  },
  body: {
    color: colors.ink,
    fontFamily: fonts.body,
    fontSize: 16,
    lineHeight: 22,
  },
  row: {
    gap: spacing.sm,
  },
  gesture: {
    backgroundColor: colors.ink,
    borderRadius: radii.button,
    padding: spacing.md,
    alignItems: 'center',
  },
  gestureText: {
    color: colors.white,
    fontFamily: fonts.bodyBold,
    fontSize: 16,
  },
  hint: {
    color: colors.coralDeep,
    fontFamily: fonts.bodyBold,
    fontSize: 15,
  },
  close: {
    alignItems: 'center',
    padding: spacing.md,
  },
  closeText: {
    color: colors.muted,
    fontFamily: fonts.bodyBold,
    fontSize: 15,
  },
});
