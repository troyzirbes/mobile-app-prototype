import { useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { demoUser } from '../data/mockData';
import { discoverProfiles } from '../store/demoState';
import { useAppStore } from '../store/useAppStore';
import type { ConnectIntent, MockProfile } from '../types/demo';
import { colors, drawn, fonts, radii, shadow, spacing } from '../theme';
import { EnergyPill } from './EnergyPill';

const prompts = [
  'What is a plan that stays easy to leave?',
  'What would you do with an extra hour tonight?',
  'Which part of a night out do you skip on purpose?',
];

const rules = [
  'One prompt, then you choose whether to continue.',
  'Chat, Dates, and IRL Friends save an intent in Exploring.',
  'A direct message opens only after Allow.',
  'Thanks, but no further action leaves you strangers.',
];

export function AdventureScreen() {
  const data = useAppStore();
  const [phase, setPhase] = useState<'rules' | 'prompt' | 'decision'>('rules');
  const [round, setRound] = useState(0);
  const [answer, setAnswer] = useState('');
  const [seconds, setSeconds] = useState(20);
  const [person, setPerson] = useState<MockProfile | null>(null);
  const [info, setInfo] = useState(false);

  useEffect(() => {
    if (phase !== 'prompt' || seconds <= 0) {
      return;
    }
    const timer = setTimeout(() => setSeconds((value) => value - 1), 1000);
    return () => clearTimeout(timer);
  }, [phase, seconds]);

  useEffect(() => {
    if (phase === 'prompt' && seconds <= 0) {
      setPhase('decision');
    }
  }, [phase, seconds]);

  const start = (nextRound = round) => {
    const pool = discoverProfiles(data);
    const next = pool[nextRound % Math.max(pool.length, 1)] ?? null;
    setPerson(next);
    setAnswer('');
    setSeconds(20);
    setPhase(next ? 'prompt' : 'rules');
  };

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <View style={styles.top}>
        <Text style={styles.prompt}>🍀 Looking for low-stakes excitement, {demoUser.name}?</Text>
        <Pressable accessibilityRole="button" onPress={() => setInfo((value) => !value)}>
          <Text style={styles.info}>i</Text>
        </Pressable>
        <EnergyPill />
      </View>
      {info ? (
        <Text style={styles.help}>Adventure is the wildcard track. It stays opt-in, and it does not open a chat by itself.</Text>
      ) : null}
      {!data.adventureEnabled ? (
        <Pressable accessibilityRole="button" onPress={() => data.setSafety({ adventureEnabled: true })} style={styles.button}>
          <Text style={styles.buttonText}>Turn Adventure on</Text>
        </Pressable>
      ) : null}
      {data.adventureEnabled && phase === 'rules' ? (
        <View style={styles.card}>
          <Text style={styles.heading}>Rules of engagement</Text>
          {rules.map((rule) => (
            <Text key={rule} style={styles.item}>
              - {rule}
            </Text>
          ))}
          <Pressable accessibilityRole="button" onPress={() => start()} style={styles.button}>
            <Text style={styles.buttonText}>Let's go!</Text>
          </Pressable>
        </View>
      ) : null}
      {data.adventureEnabled && phase === 'prompt' && person ? (
        <View style={styles.card}>
          <Text style={styles.heading}>Let's have a kiki, {demoUser.name}!</Text>
          <Text style={styles.body}>{prompts[round % prompts.length]}</Text>
          <Text style={styles.timer}>{seconds > 0 ? `${seconds}s left` : "Time's almost up"}</Text>
          <TextInput
            value={answer}
            onChangeText={setAnswer}
            placeholder="Answer"
            placeholderTextColor={colors.muted}
            style={styles.input}
          />
          <Pressable
            accessibilityRole="button"
            onPress={() => setPhase('decision')}
            style={styles.button}
          >
            <Text style={styles.buttonText}>Submit</Text>
          </Pressable>
        </View>
      ) : null}
      {data.adventureEnabled && phase === 'decision' && person ? (
        <View style={styles.card}>
          <Text style={styles.heading}>What do you think, {demoUser.name}?</Text>
          <Text style={styles.body}>Do you want to continue with {person.name}?</Text>
          <View style={styles.row}>
            <Pressable
              accessibilityRole="button"
              onPress={() => {
                const nextRound = round + 1;
                setRound(nextRound);
                start(nextRound);
              }}
              style={styles.secondary}
            >
              <Text style={styles.secondaryText}>Propose Another Round</Text>
            </Pressable>
            <Pressable
              accessibilityRole="button"
              onPress={() => {
                setPerson(null);
                setPhase('rules');
              }}
              style={styles.secondary}
            >
              <Text style={styles.secondaryText}>Thanks, but no further action</Text>
            </Pressable>
          </View>
          <Text style={styles.heading}>Or connect with intent</Text>
          <View style={styles.row}>
            {(['Chat', 'Dates', 'IRL Friends'] as ConnectIntent[]).map((intent) => (
              <Pressable
                key={intent}
                accessibilityRole="button"
                onPress={() => data.connectWithIntent(person.id, intent)}
                style={styles.secondary}
              >
                <Text style={styles.secondaryText}>{intent}</Text>
              </Pressable>
            ))}
          </View>
          <Pressable accessibilityRole="button" onPress={() => data.blockProfile(person.id)} style={styles.danger}>
            <Text style={styles.dangerText}>Report & Block</Text>
          </Pressable>
        </View>
      ) : null}
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
    paddingBottom: spacing.xxl,
  },
  top: {
    flexDirection: 'row',
    gap: spacing.sm,
    alignItems: 'flex-start',
  },
  prompt: {
    flex: 1,
    color: colors.ink,
    fontFamily: fonts.display,
    fontSize: 30,
    lineHeight: 34,
  },
  info: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: colors.inkLine,
    color: colors.ink,
    fontFamily: fonts.bodyBold,
    textAlign: 'center',
    overflow: 'hidden',
    lineHeight: 20,
  },
  help: {
    color: colors.muted,
    fontFamily: fonts.body,
    fontSize: 15,
    lineHeight: 22,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: radii.card,
    padding: spacing.lg,
    gap: spacing.sm,
    ...drawn,
    ...shadow,
  },
  heading: {
    color: colors.ink,
    fontFamily: fonts.display,
    fontSize: 22,
  },
  body: {
    color: colors.ink,
    fontFamily: fonts.body,
    fontSize: 16,
    lineHeight: 22,
  },
  item: {
    color: colors.ink,
    fontFamily: fonts.body,
    fontSize: 16,
    lineHeight: 22,
  },
  timer: {
    color: colors.coralDeep,
    fontFamily: fonts.bodyBold,
    fontSize: 16,
  },
  input: {
    backgroundColor: colors.card,
    borderRadius: radii.stamp,
    padding: spacing.md,
    color: colors.ink,
    fontFamily: fonts.body,
    fontSize: 16,
    userSelect: 'text',
    ...drawn,
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  button: {
    alignSelf: 'flex-start',
    backgroundColor: colors.coral,
    borderRadius: radii.button,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  buttonText: {
    color: colors.white,
    fontFamily: fonts.bodyBold,
    fontSize: 16,
  },
  secondary: {
    ...drawn,
    borderRadius: radii.button,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.card,
  },
  secondaryText: {
    color: colors.ink,
    fontFamily: fonts.bodyBold,
    fontSize: 15,
  },
  danger: {
    backgroundColor: colors.passStamp,
    borderRadius: radii.button,
    alignItems: 'center',
    padding: spacing.md,
  },
  dangerText: {
    color: colors.white,
    fontFamily: fonts.bodyBold,
    fontSize: 16,
  },
});
