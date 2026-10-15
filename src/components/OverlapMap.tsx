import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { MockProfile } from '../types/demo';
import { colors, spacing } from '../theme';
import { Avatar } from './Avatar';

type Props = {
  tags: string[];
  profiles: MockProfile[];
  matches: (profile: MockProfile, tag: string) => boolean;
  hidden: (profile: MockProfile) => boolean;
  onOpen: (profileId: string) => void;
};

const spots = [
  { left: 24, top: 36 },
  { left: 150, top: 36 },
  { left: 86, top: 120 },
];

export function OverlapMap({ tags, profiles, matches, hidden, onOpen }: Props) {
  const shown = tags.slice(0, 3);
  return (
    <View style={styles.board}>
      {shown.map((tag, index) => (
        <View
          key={tag}
          style={[
            styles.circle,
            { left: spots[index]?.left ?? 24, top: spots[index]?.top ?? 36 },
          ]}
        >
          <Text style={styles.tag}>{tag}</Text>
        </View>
      ))}
      <View style={styles.people}>
        {profiles.slice(0, 8).map((profile, index) => (
          <Pressable
            key={profile.id}
            accessibilityRole="button"
            onPress={() => onOpen(profile.id)}
            style={[styles.person, { left: 40 + (index % 4) * 72, top: 70 + Math.floor(index / 4) * 78 }]}
          >
            <Avatar
              name={profile.name}
              profileId={profile.id}
              color={profile.photos[0] ?? colors.pass}
              hidden={hidden(profile)}
              size={48}
            />
            <Text style={styles.name}>{profile.name.split(' ')[0]}</Text>
            <Text style={styles.meta}>
              {shown.filter((tag) => matches(profile, tag)).join(' · ')}
            </Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  board: {
    height: 280,
    borderRadius: 28,
    backgroundColor: colors.chip,
    overflow: 'hidden',
  },
  circle: {
    position: 'absolute',
    width: 150,
    height: 150,
    borderRadius: 75,
    borderWidth: 2,
    borderColor: colors.coral,
    backgroundColor: 'rgba(226, 91, 69, 0.12)',
    alignItems: 'center',
    paddingTop: spacing.sm,
  },
  tag: {
    color: colors.ink,
    fontWeight: '800',
    fontSize: 12,
  },
  people: {
    ...StyleSheet.absoluteFill,
  },
  person: {
    position: 'absolute',
    width: 68,
    alignItems: 'center',
  },
  name: {
    color: colors.ink,
    fontSize: 11,
    fontWeight: '700',
  },
  meta: {
    color: colors.muted,
    fontSize: 9,
    textAlign: 'center',
  },
});
