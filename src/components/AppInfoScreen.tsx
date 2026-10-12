import { Pressable, ScrollView, StyleSheet, Text } from 'react-native';
import { useAppStore } from '../store/useAppStore';
import { colors, radii, spacing } from '../theme';

export function AppInfoScreen() {
  const goTo = useAppStore((state) => state.goTo);
  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <Text style={styles.title}>App info</Text>
      <Text style={styles.body}>
        This demo supports five search styles, energy for likes you send, a free reciprocate into Exploring, and Allow before a chat.
      </Text>
      <Text style={styles.body}>
        Conduct: block and skip stay on this device. There is no report sent to a trust-and-safety team, because there is no server.
      </Text>
      <Text style={styles.body}>
        Support is this screen. Registration, login, SMS, payments, photo upload, and a live map are not part of the case study.
      </Text>
      <Pressable accessibilityRole="button" onPress={() => goTo('Intro')} style={styles.button}>
        <Text style={styles.buttonText}>Revisit the intro</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  content: {
    padding: spacing.lg,
    gap: spacing.md,
  },
  title: {
    color: colors.ink,
    fontSize: 28,
    fontWeight: '800',
  },
  body: {
    color: colors.ink,
    lineHeight: 22,
  },
  button: {
    alignSelf: 'flex-start',
    backgroundColor: colors.ink,
    borderRadius: radii.button,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  buttonText: {
    color: colors.white,
    fontWeight: '800',
  },
});
