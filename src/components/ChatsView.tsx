import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useAppStore } from '../store/useAppStore';
import { colors, radii, spacing } from '../theme';

export function ChatsView() {
  const chats = useAppStore((state) => state.activeChats);
  const sendChat = useAppStore((state) => state.sendChat);
  const receiveNpcReply = useAppStore((state) => state.receiveNpcReply);
  const closeChat = useAppStore((state) => state.closeChat);
  const [openId, setOpenId] = useState<string | null>(null);
  const [draft, setDraft] = useState('');
  const open = chats.find((chat) => chat.id === openId) ?? null;

  if (!open) {
    return (
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.lead}>
          A chat opens when you tap Allow in the Learning Stage. The demo gate can also fill this list.
        </Text>
        {chats.length === 0 ? <Text style={styles.empty}>No active chats.</Text> : null}
        {chats.map((chat) => (
          <Pressable
            key={chat.id}
            accessibilityRole="button"
            onPress={() => setOpenId(chat.id)}
            style={styles.card}
          >
            <Text style={styles.name}>{chat.profile.name}</Text>
            <Text style={styles.preview} numberOfLines={1}>
              {chat.messages[chat.messages.length - 1]?.text}
            </Text>
          </Pressable>
        ))}
      </ScrollView>
    );
  }

  return (
    <View style={styles.thread}>
      <View style={styles.threadHeader}>
        <Pressable accessibilityRole="button" onPress={() => setOpenId(null)}>
          <Text style={styles.back}>Back</Text>
        </Pressable>
        <Text style={styles.name}>{open.profile.name}</Text>
        <Pressable accessibilityRole="button" onPress={() => closeChat(open.id)}>
          <Text style={styles.back}>Close</Text>
        </Pressable>
      </View>
      <ScrollView contentContainerStyle={styles.messages}>
        {open.messages.map((message) => (
          <View
            key={message.id}
            style={[styles.bubble, message.from === 'you' ? styles.mine : styles.theirs]}
          >
            <Text style={message.from === 'you' ? styles.mineText : styles.theirsText}>{message.text}</Text>
          </View>
        ))}
      </ScrollView>
      <View style={styles.composer}>
        <TextInput
          value={draft}
          onChangeText={setDraft}
          placeholder="Message"
          placeholderTextColor={colors.muted}
          style={styles.input}
        />
        <Pressable
          accessibilityRole="button"
          onPress={() => {
            const text = draft.trim();
            if (!text) {
              return;
            }
            sendChat(open.id, text);
            setDraft('');
            setTimeout(() => receiveNpcReply(open.id), 700);
          }}
          style={styles.send}
        >
          <Text style={styles.sendText}>Send</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: spacing.lg,
    gap: spacing.md,
  },
  lead: {
    color: colors.muted,
    lineHeight: 20,
  },
  empty: {
    color: colors.ink,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: radii.card,
    borderWidth: 1,
    borderColor: colors.line,
    padding: spacing.md,
    gap: spacing.xs,
  },
  name: {
    color: colors.ink,
    fontWeight: '800',
    fontSize: 18,
  },
  preview: {
    color: colors.muted,
  },
  thread: {
    flex: 1,
  },
  threadHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.lg,
  },
  back: {
    color: colors.coralDeep,
    fontWeight: '700',
  },
  messages: {
    padding: spacing.lg,
    gap: spacing.sm,
  },
  bubble: {
    maxWidth: '80%',
    borderRadius: radii.stamp,
    padding: spacing.md,
  },
  mine: {
    alignSelf: 'flex-end',
    backgroundColor: colors.coral,
  },
  theirs: {
    alignSelf: 'flex-start',
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.line,
  },
  mineText: {
    color: colors.white,
  },
  theirsText: {
    color: colors.ink,
  },
  composer: {
    flexDirection: 'row',
    gap: spacing.sm,
    padding: spacing.md,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.card,
    borderRadius: radii.button,
    paddingHorizontal: spacing.md,
    color: colors.ink,
    userSelect: 'text',
  },
  send: {
    backgroundColor: colors.ink,
    borderRadius: radii.button,
    paddingHorizontal: spacing.md,
    justifyContent: 'center',
  },
  sendText: {
    color: colors.white,
    fontWeight: '800',
  },
});
