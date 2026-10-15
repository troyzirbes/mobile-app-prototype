import type { ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import type { MockProfile } from '../types/demo';
import { colors, radii, spacing } from '../theme';
import { Avatar } from './Avatar';
import { VoiceNotes } from './VoiceNotes';

type Props = {
  profile: MockProfile;
  hiddenPhoto: boolean;
  verified: boolean;
  mystery: boolean;
  overlap: number | null;
  showBounty: boolean;
  onHeard: () => void;
  children?: ReactNode;
};

export function ProfileSummary({
  profile,
  hiddenPhoto,
  verified,
  mystery,
  overlap,
  showBounty,
  onHeard,
  children,
}: Props) {
  const name = mystery ? 'Wildcard' : `${profile.name}, ${profile.age}`;
  return (
    <View style={styles.card}>
      <View style={styles.top}>
        <Avatar name={profile.name} color={profile.photos[0] ?? colors.pass} hidden={hiddenPhoto || mystery} />
        <View style={styles.meta}>
          <Text style={styles.name}>{name}</Text>
          <Text style={styles.rate}>{profile.responseRate}</Text>
          <Text style={styles.style}>{(profile.styleCategories ?? [profile.styleCategory]).join(' · ')}</Text>
          {verified ? <Text style={styles.verified}>Recently Verified</Text> : null}
          {profile.vibe ? <Text style={styles.vibe}>{profile.vibe}</Text> : null}
        </View>
      </View>
      {overlap !== null ? <Text style={styles.overlap}>{overlap}% lifestyle overlap</Text> : null}
      {showBounty ? <Text style={styles.bounty}>Date bounty · {profile.bounty}</Text> : null}
      {profile.isExplorer && profile.explorerDates ? (
        <Text style={styles.explorer}>Visiting {profile.explorerDates}. Not a local resident.</Text>
      ) : null}
      {mystery ? (
        <Text style={styles.bio}>Their name stays hidden until you reveal this wildcard.</Text>
      ) : (
        <Text style={styles.bio}>{profile.bio}</Text>
      )}
      {hiddenPhoto && !mystery ? (
        <Text style={styles.hidden}>Photos stay hidden until a voice note or co-op scenario.</Text>
      ) : null}
      <VoiceNotes prompts={profile.audioPrompts} onHeard={onHeard} />
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: radii.card,
    borderWidth: 1,
    borderColor: colors.line,
    padding: spacing.lg,
    gap: spacing.md,
  },
  top: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  meta: {
    flex: 1,
    gap: 2,
  },
  name: {
    color: colors.ink,
    fontSize: 22,
    fontWeight: '800',
  },
  rate: {
    color: colors.coralDeep,
    fontSize: 13,
    fontWeight: '700',
  },
  style: {
    color: colors.muted,
    fontSize: 13,
  },
  verified: {
    alignSelf: 'flex-start',
    marginTop: spacing.xs,
    backgroundColor: colors.likeStamp,
    color: colors.white,
    overflow: 'hidden',
    borderRadius: radii.chip,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    fontSize: 12,
    fontWeight: '800',
  },
  vibe: {
    color: colors.ink,
    fontSize: 13,
    marginTop: spacing.xs,
  },
  overlap: {
    color: colors.ink,
    fontWeight: '700',
  },
  bounty: {
    color: colors.ink,
    fontWeight: '700',
  },
  explorer: {
    color: colors.pass,
    fontWeight: '700',
  },
  bio: {
    color: colors.ink,
    fontSize: 15,
    lineHeight: 21,
  },
  hidden: {
    color: colors.muted,
    fontSize: 13,
  },
});
