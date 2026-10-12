import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import type { AudioPrompt } from '../types/demo';
import { colors, fonts, radii, spacing } from '../theme';

type Props = {
  prompts: AudioPrompt[];
  onHeard: () => void;
};

function playLocal(url: string) {
  if (Platform.OS !== 'web' || typeof Audio === 'undefined') {
    return;
  }
  const audio = new Audio(url);
  void audio.play();
}

export function VoiceNotes({ prompts, onHeard }: Props) {
  return (
    <View style={styles.list}>
      {prompts.map((prompt) => (
        <Pressable
          key={prompt.promptText}
          accessibilityRole="button"
          accessibilityLabel={`Play voice note: ${prompt.promptText}`}
          onPress={() => {
            playLocal(prompt.audioUrl);
            onHeard();
          }}
          style={styles.row}
        >
          <Text style={styles.play}>Play</Text>
          <Text style={styles.prompt}>{prompt.promptText}</Text>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  list: {
    gap: spacing.sm,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.chip,
    borderRadius: radii.stamp,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  play: {
    color: colors.coralDeep,
    fontFamily: fonts.bodyBold,
    fontSize: 13,
  },
  prompt: {
    flex: 1,
    color: colors.ink,
    fontFamily: fonts.body,
    fontSize: 15,
  },
});
