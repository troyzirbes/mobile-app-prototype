import { useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { ENERGY_NOTE } from '../store/energy';
import { colors, radii, spacing } from '../theme';

type Props = {
  name: string | null;
  onClose: () => void;
  onSend: (note: string) => void;
};

export function NoteModal({ name, onClose, onSend }: Props) {
  const [note, setNote] = useState('');
  if (!name) {
    return null;
  }
  return (
    <Modal visible transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <View style={styles.sheet}>
          <Text style={styles.title}>Note for {name}</Text>
          <Text style={styles.body}>This costs {ENERGY_NOTE} energy. A reply still opens the Learning Stage, not a chat.</Text>
          <TextInput
            value={note}
            onChangeText={setNote}
            placeholder="One specific thing you noticed"
            placeholderTextColor={colors.muted}
            style={styles.input}
          />
          <View style={styles.row}>
            <Pressable accessibilityRole="button" onPress={onClose} style={styles.secondary}>
              <Text style={styles.secondaryText}>Cancel</Text>
            </Pressable>
            <Pressable
              accessibilityRole="button"
              onPress={() => {
                const trimmed = note.trim();
                if (!trimmed) {
                  return;
                }
                onSend(trimmed);
                setNote('');
              }}
              style={styles.primary}
            >
              <Text style={styles.primaryText}>Send note</Text>
            </Pressable>
          </View>
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
  title: {
    color: colors.ink,
    fontSize: 22,
    fontWeight: '800',
  },
  body: {
    color: colors.muted,
    lineHeight: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radii.stamp,
    padding: spacing.md,
    color: colors.ink,
    userSelect: 'text',
  },
  row: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  secondary: {
    flex: 1,
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: radii.button,
    borderWidth: 1,
    borderColor: colors.line,
  },
  secondaryText: {
    fontWeight: '700',
    color: colors.ink,
  },
  primary: {
    flex: 1,
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: radii.button,
    backgroundColor: colors.coral,
  },
  primaryText: {
    fontWeight: '800',
    color: colors.white,
  },
});
