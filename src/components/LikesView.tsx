import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { ENERGY_LIKE } from '../store/energy';
import { useAppStore } from '../store/useAppStore';
import { colors, radii, spacing } from '../theme';
import { Avatar } from './Avatar';

export function LikesView() {
  const incomingLikes = useAppStore((state) => state.incomingLikes);
  const reciprocateLike = useAppStore((state) => state.reciprocateLike);
  return (
    <ScrollView contentContainerStyle={styles.content}>
      <Text style={styles.lead}>
        These people already liked you. Liking back costs {ENERGY_LIKE} energy and opens the Learning Stage, not a chat.
      </Text>
      {incomingLikes.length === 0 ? (
        <Text style={styles.empty}>The incoming queue is empty. The demo panel can add a local like.</Text>
      ) : null}
      {incomingLikes.map((profile) => (
        <View key={profile.id} style={styles.card}>
          <Avatar name={profile.name} color={profile.photos[0] ?? colors.pass} hidden={false} size={56} />
          <View style={styles.meta}>
            <Text style={styles.name}>
              {profile.name}, {profile.age}
            </Text>
            <Text style={styles.rate}>{profile.responseRate}</Text>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={`Reciprocate ${profile.name}`}
              onPress={() => reciprocateLike(profile.id)}
              style={styles.button}
            >
              <Text style={styles.buttonText}>Reciprocate · {ENERGY_LIKE}</Text>
            </Pressable>
          </View>
        </View>
      ))}
    </ScrollView>
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
    flexDirection: 'row',
    gap: spacing.md,
    backgroundColor: colors.card,
    borderRadius: radii.card,
    borderWidth: 1,
    borderColor: colors.line,
    padding: spacing.md,
  },
  meta: {
    flex: 1,
    gap: spacing.sm,
  },
  name: {
    color: colors.ink,
    fontWeight: '800',
    fontSize: 18,
  },
  rate: {
    color: colors.coralDeep,
    fontWeight: '700',
    fontSize: 13,
  },
  button: {
    alignSelf: 'flex-start',
    backgroundColor: colors.coral,
    borderRadius: radii.button,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  buttonText: {
    color: colors.white,
    fontWeight: '800',
  },
});
