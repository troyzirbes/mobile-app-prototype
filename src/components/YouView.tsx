import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { demoUser } from '../data/mockData';
import { maxEnergy } from '../store/energy';
import { activeVibe } from '../store/demoState';
import { useAppStore } from '../store/useAppStore';
import { colors, radii, spacing } from '../theme';

export function YouView() {
  const data = useAppStore();
  const [vibeText, setVibeText] = useState('Looking for late-night boba');
  const cap = maxEnergy(data.isPaidMember);
  const vibe = activeVibe(data.vibe, Date.now());
  return (
    <ScrollView contentContainerStyle={styles.content}>
      <Text style={styles.title}>{demoUser.name}</Text>
      <Text style={styles.lead}>
        Demo profile, paid features unlocked. Nothing here is sent to a server.
      </Text>
      <View style={styles.card}>
        <Text style={styles.label}>
          Energy {data.energyTokens} / {cap}
        </Text>
        <Text style={styles.help}>Likes cost 10. A like with a note costs 30. One token returns each minute, paid or free.</Text>
        <Pressable
          accessibilityRole="button"
          onPress={() => data.setPaidMember(!data.isPaidMember)}
          style={styles.secondary}
        >
          <Text style={styles.secondaryText}>{data.isPaidMember ? 'Switch to free cap (100)' : 'Switch to paid cap (150)'}</Text>
        </Pressable>
      </View>
      <View style={styles.card}>
        <Text style={styles.label}>Attention gate</Text>
        <Text style={styles.help}>
          {data.attentionGate.enabled ? 'On' : 'Off'} · max {data.attentionGate.maxActiveChats} chats · auto Incognito{' '}
          {data.attentionGate.autoToggleOnThreshold ? 'on' : 'off'}
        </Text>
        <View style={styles.row}>
          <Pressable accessibilityRole="button" onPress={() => data.setAttentionGate({ enabled: !data.attentionGate.enabled })} style={styles.secondary}>
            <Text style={styles.secondaryText}>{data.attentionGate.enabled ? 'Disable cap' : 'Enable cap'}</Text>
          </Pressable>
          <Pressable
            accessibilityRole="button"
            onPress={() =>
              data.setAttentionGate({
                maxActiveChats: data.attentionGate.maxActiveChats === 2 ? 1 : 2,
              })
            }
            style={styles.secondary}
          >
            <Text style={styles.secondaryText}>Cap {data.attentionGate.maxActiveChats === 2 ? 1 : 2}</Text>
          </Pressable>
        </View>
      </View>
      <View style={styles.card}>
        <Text style={styles.label}>Privacy</Text>
        <Pressable accessibilityRole="button" onPress={() => data.toggleIncognito()} style={styles.secondary}>
          <Text style={styles.secondaryText}>{data.isIncognito ? 'Incognito is on' : 'Incognito is off'}</Text>
        </Pressable>
        <Pressable accessibilityRole="button" onPress={() => data.toggleBlindAudition()} style={styles.secondary}>
          <Text style={styles.secondaryText}>
            {data.blindAudition ? 'Blind audition is hiding photos' : 'Blind audition is off'}
          </Text>
        </Pressable>
      </View>
      <View style={styles.card}>
        <Text style={styles.label}>Vibe</Text>
        <Text style={styles.help}>{vibe ? `Live: ${vibe.text}` : 'No live vibe.'}</Text>
        <TextInput
          value={vibeText}
          onChangeText={setVibeText}
          placeholder="A status for the next few hours"
          placeholderTextColor={colors.muted}
          style={styles.input}
        />
        <View style={styles.row}>
          <Pressable accessibilityRole="button" onPress={() => data.setVibe(vibeText, 2, 'learning')} style={styles.primary}>
            <Text style={styles.primaryText}>2h · Learning Stage</Text>
          </Pressable>
          <Pressable accessibilityRole="button" onPress={() => data.setVibe(vibeText, 4, 'off')} style={styles.secondary}>
            <Text style={styles.secondaryText}>4h · map off</Text>
          </Pressable>
        </View>
        <Pressable accessibilityRole="button" onPress={() => data.clearVibe()}>
          <Text style={styles.quiet}>Clear vibe</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: spacing.lg,
    gap: spacing.md,
    paddingBottom: spacing.xxl,
  },
  title: {
    color: colors.ink,
    fontSize: 28,
    fontWeight: '800',
  },
  lead: {
    color: colors.muted,
    lineHeight: 20,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: radii.card,
    borderWidth: 1,
    borderColor: colors.line,
    padding: spacing.md,
    gap: spacing.sm,
  },
  label: {
    color: colors.ink,
    fontWeight: '800',
    fontSize: 16,
  },
  help: {
    color: colors.muted,
    lineHeight: 20,
  },
  row: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  primary: {
    flex: 1,
    backgroundColor: colors.coral,
    borderRadius: radii.button,
    alignItems: 'center',
    padding: spacing.md,
  },
  primaryText: {
    color: colors.white,
    fontWeight: '800',
    textAlign: 'center',
  },
  secondary: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radii.button,
    alignItems: 'center',
    padding: spacing.md,
  },
  secondaryText: {
    color: colors.ink,
    fontWeight: '700',
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radii.stamp,
    padding: spacing.md,
    color: colors.ink,
    userSelect: 'text',
  },
  quiet: {
    color: colors.muted,
    fontWeight: '700',
  },
});
