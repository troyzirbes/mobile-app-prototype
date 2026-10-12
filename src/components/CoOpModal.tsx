import { useEffect, useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import type { MockProfile } from '../types/demo';
import { partnerChoice } from '../store/matching';
import { colors, drawn, fonts, radii, spacing } from '../theme';

const THINKING_MS = 2000;

type Props = {
  profile: MockProfile | null;
  onClose: () => void;
  onComplete: (profileId: string) => void;
};

export function CoOpModal({ profile, onClose, onComplete }: Props) {
  const [step, setStep] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [partner, setPartner] = useState<number | null>(null);

  useEffect(() => {
    setStep(0);
    setPicked(null);
    setPartner(null);
  }, [profile?.id]);

  useEffect(() => {
    if (picked === null || !profile) {
      return;
    }
    const prompt = profile.coOpScenario.prompts[step];
    if (!prompt) {
      return;
    }
    const timer = setTimeout(() => {
      setPartner(partnerChoice(profile.id, step, prompt.options.length));
    }, THINKING_MS);
    return () => clearTimeout(timer);
  }, [picked, profile, step]);

  if (!profile) {
    return null;
  }
  const prompts = profile.coOpScenario.prompts;
  const prompt = prompts[step];
  if (!prompt) {
    return null;
  }
  const finished = partner !== null;

  return (
    <Modal visible transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <View style={styles.sheet}>
          <Text style={styles.kicker}>{profile.coOpScenario.scenarioTitle}</Text>
          <Text style={styles.question}>{prompt.question}</Text>
          <Text style={styles.count}>
            {step + 1} of {prompts.length}
          </Text>
          {prompt.options.map((option, index) => {
            const selected = picked === index;
            const theirs = finished && partner === index;
            return (
              <Pressable
                key={option}
                accessibilityRole="button"
                disabled={picked !== null}
                onPress={() => setPicked(index)}
                style={[styles.option, selected && styles.optionSelected, theirs && styles.optionTheirs]}
              >
                <Text style={styles.optionText}>
                  {option}
                  {theirs ? ' · their pick' : ''}
                  {selected ? ' · yours' : ''}
                </Text>
              </Pressable>
            );
          })}
          <Text style={styles.wait}>
            {picked === null
              ? 'Pick one. Their answer arrives after a short pause.'
              : finished
                ? partner === picked
                  ? 'You matched this one.'
                  : 'Different picks. That is still useful.'
                : 'They are thinking…'}
          </Text>
          <View style={styles.row}>
            <Pressable accessibilityRole="button" onPress={onClose} style={styles.secondary}>
              <Text style={styles.secondaryText}>Close</Text>
            </Pressable>
            {finished ? (
              <Pressable
                accessibilityRole="button"
                onPress={() => {
                  if (step + 1 >= prompts.length) {
                    onComplete(profile.id);
                    onClose();
                    return;
                  }
                  setStep((value) => value + 1);
                  setPicked(null);
                  setPartner(null);
                }}
                style={styles.primary}
              >
                <Text style={styles.primaryText}>{step + 1 >= prompts.length ? 'Finish' : 'Next'}</Text>
              </Pressable>
            ) : null}
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
    gap: spacing.sm,
  },
  kicker: {
    color: colors.muted,
    fontFamily: fonts.bodyBold,
    fontSize: 13,
  },
  question: {
    color: colors.ink,
    fontFamily: fonts.display,
    fontSize: 26,
  },
  count: {
    color: colors.muted,
    fontFamily: fonts.body,
    fontSize: 14,
  },
  option: {
    ...drawn,
    borderRadius: radii.stamp,
    padding: spacing.md,
    backgroundColor: colors.card,
  },
  optionSelected: {
    borderColor: colors.ink,
  },
  optionTheirs: {
    backgroundColor: colors.chip,
  },
  optionText: {
    color: colors.ink,
    fontFamily: fonts.bodyBold,
    fontSize: 15,
  },
  wait: {
    color: colors.muted,
    fontFamily: fonts.body,
    fontSize: 14,
    minHeight: 20,
  },
  row: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  secondary: {
    flex: 1,
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: radii.button,
    backgroundColor: colors.card,
    ...drawn,
  },
  secondaryText: {
    color: colors.ink,
    fontFamily: fonts.bodyBold,
    fontSize: 15,
  },
  primary: {
    flex: 1,
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: radii.button,
    backgroundColor: colors.coral,
  },
  primaryText: {
    color: colors.white,
    fontFamily: fonts.bodyBold,
    fontSize: 15,
  },
});
