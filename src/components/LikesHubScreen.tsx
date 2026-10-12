import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useAppStore } from '../store/useAppStore';
import type { MockProfile } from '../types/demo';
import { colors, drawn, fonts, radii, shadow, spacing } from '../theme';
import { Avatar } from './Avatar';
import { ChatsView } from './ChatsView';
import { CoOpModal } from './CoOpModal';
import { VoiceNotes } from './VoiceNotes';

const speedQuestions = [
  'A Sunday you would repeat',
  'The evening starts with',
  'The night ends',
];

const neverStatements = ['Skipped a reservation', 'Danced in a kitchen', 'Left a show early'];

export function LikesHubScreen() {
  const data = useAppStore();
  const [coOpFor, setCoOpFor] = useState<MockProfile | null>(null);
  const [speedFor, setSpeedFor] = useState<string | null>(null);
  const [speedStep, setSpeedStep] = useState(0);
  const [neverFor, setNeverFor] = useState<string | null>(null);
  const [neverStep, setNeverStep] = useState(0);
  const [partnerLine, setPartnerLine] = useState('');
  const tab = data.activeLikesTab;

  return (
    <View style={styles.frame}>
      <Text style={styles.lead}>
        {tab === 'Interested'
          ? 'People who liked you. Reciprocate is free and opens Exploring, not a chat.'
          : tab === 'Exploring'
            ? 'You both opted in. Questions, a game, voice, or a co-op scene happen before Allow.'
            : 'Chats you allowed. Close one to free a slot on the attention gate.'}
      </Text>
      {tab === 'Connections' ? (
        <ChatsView />
      ) : (
        <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
          {tab === 'Interested' && data.incomingLikes.length === 0 ? (
            <Text style={styles.empty}>Nobody is waiting. Simulate Like can add a local profile.</Text>
          ) : null}
          {tab === 'Interested'
            ? data.incomingLikes.map((profile) => (
                <View key={profile.id} style={styles.card}>
                  <Avatar name={profile.name} profileId={profile.id} color={profile.photos[0] ?? colors.pass} hidden={false} size={72} />
                  <View style={styles.meta}>
                    <Text style={styles.name}>
                      {profile.name}, {profile.age}
                    </Text>
                    <Text style={styles.rate}>{profile.responseRate}</Text>
                    <View style={styles.row}>
                      <Pressable accessibilityRole="button" onPress={() => data.passIncoming(profile.id)} style={styles.secondary}>
                        <Text style={styles.secondaryText}>Pass</Text>
                      </Pressable>
                      <Pressable accessibilityRole="button" onPress={() => data.reciprocateLike(profile.id)} style={styles.primary}>
                        <Text style={styles.primaryText}>Reciprocate · 0</Text>
                      </Pressable>
                    </View>
                  </View>
                </View>
              ))
            : null}
          {tab === 'Exploring' && data.learningStageQueue.length === 0 ? (
            <Text style={styles.empty}>Exploring is empty. Reciprocate a like, or send one from a search track.</Text>
          ) : null}
          {tab === 'Exploring'
            ? data.learningStageQueue.map((profile) => (
                <View key={profile.id} style={styles.block}>
                  <Text style={styles.name}>
                    {profile.name}, {profile.age}
                  </Text>
                  {data.connectionIntents[profile.id] ? (
                    <Text style={styles.rate}>Intent · {data.connectionIntents[profile.id]}</Text>
                  ) : null}
                  <Text style={styles.body}>{profile.bio}</Text>
                  <View style={styles.row}>
                    <Pressable
                      accessibilityRole="button"
                      onPress={() => {
                        setSpeedFor(profile.id);
                        setSpeedStep(0);
                        setPartnerLine('');
                      }}
                      style={styles.secondary}
                    >
                      <Text style={styles.secondaryText}>Speed questions</Text>
                    </Pressable>
                    <Pressable
                      accessibilityRole="button"
                      onPress={() => {
                        setNeverFor(profile.id);
                        setNeverStep(0);
                        setPartnerLine('');
                      }}
                      style={styles.secondary}
                    >
                      <Text style={styles.secondaryText}>Never have I ever</Text>
                    </Pressable>
                    <Pressable accessibilityRole="button" onPress={() => setCoOpFor(profile)} style={styles.secondary}>
                      <Text style={styles.secondaryText}>Co-op</Text>
                    </Pressable>
                  </View>
                  <VoiceNotes prompts={profile.audioPrompts} onHeard={() => data.markVoiceHeard(profile.id)} />
                  {speedFor === profile.id ? (
                    <View style={styles.panel}>
                      <Text style={styles.body}>
                        {speedStep < speedQuestions.length
                          ? speedQuestions[speedStep]
                          : 'Round complete. You can Allow or try something else.'}
                      </Text>
                      {partnerLine ? <Text style={styles.rate}>{partnerLine}</Text> : null}
                      {speedStep < speedQuestions.length ? (
                        <Pressable
                          accessibilityRole="button"
                          onPress={() => {
                            setPartnerLine(`${profile.name.split(' ')[0]} is thinking…`);
                            setTimeout(() => {
                              setPartnerLine(`${profile.name.split(' ')[0]} picked a nearby option.`);
                              setSpeedStep((value) => value + 1);
                            }, 2000);
                          }}
                          style={styles.secondary}
                        >
                          <Text style={styles.secondaryText}>My answer</Text>
                        </Pressable>
                      ) : null}
                    </View>
                  ) : null}
                  {neverFor === profile.id ? (
                    <View style={styles.panel}>
                      <Text style={styles.body}>
                        {neverStep < neverStatements.length
                          ? `Never have I ever: ${neverStatements[neverStep]}`
                          : 'Game over. Same choice as Allow is still yours.'}
                      </Text>
                      {partnerLine ? <Text style={styles.rate}>{partnerLine}</Text> : null}
                      {neverStep < neverStatements.length ? (
                        <View style={styles.row}>
                          {['I have', 'I have not'].map((choice) => (
                            <Pressable
                              key={choice}
                              accessibilityRole="button"
                              onPress={() => {
                                setPartnerLine(`${profile.name.split(' ')[0]} is thinking…`);
                                setTimeout(() => {
                                  const theirs = (profile.name.length + neverStep) % 2 === 0 ? 'I have' : 'I have not';
                                  setPartnerLine(`${profile.name.split(' ')[0]}: ${theirs}. You: ${choice}.`);
                                  setNeverStep((value) => value + 1);
                                }, 2000);
                              }}
                              style={styles.secondary}
                            >
                              <Text style={styles.secondaryText}>{choice}</Text>
                            </Pressable>
                          ))}
                        </View>
                      ) : null}
                    </View>
                  ) : null}
                  <View style={styles.row}>
                    <Pressable accessibilityRole="button" onPress={() => data.allowDM(profile.id)} style={styles.primary}>
                      <Text style={styles.primaryText}>Allow DMs</Text>
                    </Pressable>
                    <Pressable accessibilityRole="button" onPress={() => data.disallowDM(profile.id)} style={styles.secondary}>
                      <Text style={styles.secondaryText}>Disallow</Text>
                    </Pressable>
                  </View>
                </View>
              ))
            : null}
        </ScrollView>
      )}
      <CoOpModal profile={coOpFor} onClose={() => setCoOpFor(null)} onComplete={(profileId) => data.markCoOpComplete(profileId)} />
    </View>
  );
}

const styles = StyleSheet.create({
  frame: {
    flex: 1,
    minHeight: 0,
  },
  screen: {
    flex: 1,
  },
  lead: {
    color: colors.muted,
    fontFamily: fonts.body,
    fontSize: 15,
    lineHeight: 22,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
  },
  content: {
    padding: spacing.lg,
    gap: spacing.md,
    paddingBottom: spacing.xxl,
  },
  empty: {
    color: colors.ink,
    fontFamily: fonts.body,
    fontSize: 16,
    lineHeight: 22,
  },
  card: {
    flexDirection: 'row',
    gap: spacing.md,
    backgroundColor: colors.card,
    borderRadius: radii.card,
    padding: spacing.md,
    ...drawn,
    ...shadow,
  },
  meta: {
    flex: 1,
    gap: spacing.sm,
  },
  block: {
    backgroundColor: colors.card,
    borderRadius: radii.card,
    padding: spacing.md,
    gap: spacing.sm,
    ...drawn,
    ...shadow,
  },
  name: {
    color: colors.ink,
    fontFamily: fonts.display,
    fontSize: 24,
  },
  rate: {
    color: colors.coralDeep,
    fontFamily: fonts.bodyBold,
  },
  body: {
    color: colors.ink,
    fontFamily: fonts.body,
    fontSize: 15,
    lineHeight: 22,
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  primary: {
    backgroundColor: colors.coral,
    borderRadius: radii.button,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  primaryText: {
    color: colors.card,
    fontFamily: fonts.bodyBold,
  },
  secondary: {
    ...drawn,
    backgroundColor: colors.card,
    borderRadius: radii.button,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  secondaryText: {
    color: colors.ink,
    fontFamily: fonts.bodyBold,
  },
  panel: {
    gap: spacing.sm,
    backgroundColor: colors.chip,
    borderRadius: radii.stamp,
    padding: spacing.md,
  },
});
