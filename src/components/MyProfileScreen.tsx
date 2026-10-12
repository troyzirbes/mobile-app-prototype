import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { demoUser } from '../data/mockData';
import { useAppStore } from '../store/useAppStore';
import { colors, drawn, fonts, radii, spacing } from '../theme';
import { Avatar } from './Avatar';

export function MyProfileScreen() {
  const data = useAppStore();
  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <Text style={styles.title}>My Profile</Text>
      <Text style={styles.lead}>
        {demoUser.name}, {demoUser.age}. Edits stay on this device.
      </Text>
      <View style={styles.row}>
        <Avatar name={demoUser.name} color={colors.coralDeep} hidden={false} size={72} />
        <Avatar name={`${demoUser.name} 2`} color={colors.pass} hidden={false} size={72} />
      </View>
      <Text style={styles.label}>Profile details</Text>
      <TextInput
        value={data.profileBio}
        onChangeText={data.setProfileBio}
        multiline
        style={styles.input}
      />
      <Text style={styles.label}>Voice intro</Text>
      <Pressable accessibilityRole="button" onPress={() => data.saveVoiceIntro()} style={styles.secondary}>
        <Text style={styles.secondaryText}>{data.voiceIntroSaved ? 'Voice intro saved on this device' : 'Record'}</Text>
      </Pressable>
      <Text style={styles.label}>Safety and comfort</Text>
      <Toggle label={data.adventureEnabled ? 'Adventure is on' : 'Adventure is off'} onPress={() => data.setSafety({ adventureEnabled: !data.adventureEnabled })} />
      <Toggle label={data.locationEnabled ? 'Location is on' : 'Location is off'} onPress={() => data.setSafety({ locationEnabled: !data.locationEnabled })} />
      <View style={styles.stepper}>
        <Text style={styles.secondaryText}>Max daily likes {data.maxDailyLikes}</Text>
        <Pressable accessibilityRole="button" onPress={() => data.setSafety({ maxDailyLikes: Math.max(1, data.maxDailyLikes - 1) })} style={styles.step}>
          <Text style={styles.secondaryText}>−</Text>
        </Pressable>
        <Pressable accessibilityRole="button" onPress={() => data.setSafety({ maxDailyLikes: Math.min(40, data.maxDailyLikes + 1) })} style={styles.step}>
          <Text style={styles.secondaryText}>+</Text>
        </Pressable>
      </View>
      <Toggle
        label={data.likePlusExploration ? 'Like + Exploring is on' : 'Like + Exploring is off'}
        onPress={() => data.setSafety({ likePlusExploration: !data.likePlusExploration })}
      />
      <Toggle
        label={data.directContact ? 'Direct contact is on' : 'Direct contact is off'}
        onPress={() => data.setSafety({ directContact: !data.directContact })}
      />
      <Toggle label={data.blindAudition ? 'Blind audition is hiding photos' : 'Blind audition is off'} onPress={() => data.toggleBlindAudition()} />
      <Toggle label={data.isIncognito ? 'Incognito is on' : 'Incognito is off'} onPress={() => data.toggleIncognito()} />
      <Toggle
        label={data.attentionGate.enabled ? `Chat cap ${data.attentionGate.maxActiveChats} is on` : 'Chat cap is off'}
        onPress={() => data.setAttentionGate({ enabled: !data.attentionGate.enabled })}
      />
      <Pressable
        accessibilityRole="button"
        onPress={() => data.setAttentionGate({ maxActiveChats: data.attentionGate.maxActiveChats === 2 ? 1 : 2 })}
        style={styles.secondary}
      >
        <Text style={styles.secondaryText}>Cap {data.attentionGate.maxActiveChats === 2 ? 1 : 2}</Text>
      </Pressable>
      <Pressable accessibilityRole="button" onPress={() => data.setSafety({ accountPaused: !data.accountPaused })} style={styles.danger}>
        <Text style={styles.dangerText}>{data.accountPaused ? 'Resume discovery' : 'Pause account'}</Text>
      </Pressable>
      <Pressable accessibilityRole="button" onPress={() => data.resetDemo()} style={styles.danger}>
        <Text style={styles.dangerText}>Delete account</Text>
      </Pressable>
      <Text style={styles.help}>Delete clears this device and returns to the intro. There is no account on a server.</Text>
    </ScrollView>
  );
}

function Toggle({ label, onPress }: { label: string; onPress: () => void }) {
  return (
    <Pressable accessibilityRole="button" onPress={onPress} style={styles.secondary}>
      <Text style={styles.secondaryText}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  content: {
    padding: spacing.lg,
    gap: spacing.sm,
    paddingBottom: spacing.xxl,
  },
  title: {
    color: colors.ink,
    fontFamily: fonts.display,
    fontSize: 36,
  },
  lead: {
    color: colors.muted,
    fontFamily: fonts.body,
    fontSize: 16,
    lineHeight: 22,
  },
  label: {
    color: colors.ink,
    fontFamily: fonts.display,
    fontSize: 22,
    marginTop: spacing.sm,
  },
  row: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  input: {
    minHeight: 80,
    backgroundColor: colors.card,
    borderRadius: radii.stamp,
    padding: spacing.md,
    color: colors.ink,
    fontFamily: fonts.body,
    fontSize: 16,
    userSelect: 'text',
    ...drawn,
  },
  secondary: {
    ...drawn,
    backgroundColor: colors.card,
    borderRadius: radii.button,
    padding: spacing.md,
  },
  secondaryText: {
    color: colors.ink,
    fontFamily: fonts.bodyBold,
    fontSize: 15,
  },
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  step: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.card,
    ...drawn,
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
  help: {
    color: colors.muted,
    fontFamily: fonts.body,
    fontSize: 15,
    lineHeight: 22,
  },
});
