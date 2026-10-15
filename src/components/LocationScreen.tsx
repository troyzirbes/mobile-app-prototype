import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { demoUser } from '../data/mockData';
import { discoverProfiles, photosRevealed } from '../store/demoState';
import { useAppStore } from '../store/useAppStore';
import { colors, radii, spacing } from '../theme';
import { Avatar } from './Avatar';
import { DrawerToggle } from './DrawerToggle';
import { ScreenHeading } from './ScreenHeading';

const datePresets = [
  { label: 'Oct 17–20', startDate: '2026-10-17', endDate: '2026-10-20' },
  { label: 'Nov 2–9', startDate: '2026-11-02', endDate: '2026-11-09' },
  { label: 'May 2027', startDate: '2027-05-01', endDate: '2027-05-12' },
];

export function LocationScreen() {
  const data = useAppStore();
  const [panel, setPanel] = useState<'none' | 'status' | 'filters'>('none');
  const [draft, setDraft] = useState(data.locationStatus);
  const locals = discoverProfiles({ ...data, activeTrack: 'Commonalities' }).filter((profile) => !profile.isExplorer);
  const travelers = discoverProfiles({ ...data, activeTrack: 'Location' });

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <ScreenHeading
        title={`Looking for now or later, ${demoUser.name}?`}
        detail="Residents stay on the map. Visitors appear only in the explorer row, and only inside a date window."
      />
      {data.locationStatus ? <Text style={styles.status}>{data.locationStatus}</Text> : null}
      <View style={styles.actions}>
        <DrawerToggle
          label="Add a status"
          open={panel === 'status'}
          onPress={() => setPanel(panel === 'status' ? 'none' : 'status')}
        />
        <DrawerToggle
          label="Filters"
          open={panel === 'filters'}
          onPress={() => setPanel(panel === 'filters' ? 'none' : 'filters')}
        />
      </View>
      {panel === 'status' ? (
        <View style={styles.card}>
          <Pressable accessibilityRole="button" onPress={() => data.setSafety({ locationEnabled: false })}>
            <Text style={styles.item}>No location</Text>
          </Pressable>
          <Pressable accessibilityRole="button" onPress={() => data.setSafety({ locationEnabled: true })}>
            <Text style={styles.item}>Current approximate location</Text>
          </Pressable>
          <TextInput
            value={draft}
            onChangeText={setDraft}
            placeholder="Coffee at 5th street bakery?"
            placeholderTextColor={colors.muted}
            style={styles.input}
          />
          <Pressable
            accessibilityRole="button"
            onPress={() => {
              data.setLocationStatus(draft.trim());
              setPanel('none');
            }}
            style={styles.button}
          >
            <Text style={styles.buttonText}>Submit</Text>
          </Pressable>
        </View>
      ) : null}
      {panel === 'filters' ? (
        <View style={styles.card}>
          <Pressable accessibilityRole="button" onPress={() => data.setLocationLocalOnly(!data.locationLocalOnly)}>
            <Text style={styles.item}>{data.locationLocalOnly ? 'Local only is on' : 'Local and exploring'}</Text>
          </Pressable>
          <Text style={styles.help}>Visitor dates</Text>
          <View style={styles.row}>
            {datePresets.map((preset) => (
              <Pressable
                key={preset.label}
                accessibilityRole="button"
                onPress={() => data.setExplorerDateRange({ startDate: preset.startDate, endDate: preset.endDate })}
                style={styles.chip}
              >
                <Text style={styles.chipText}>{preset.label}</Text>
              </Pressable>
            ))}
          </View>
        </View>
      ) : null}
      <View style={styles.map}>
        {data.locationEnabled ? (
          locals.slice(0, 4).map((profile, index) => (
            <Pressable
              key={profile.id}
              accessibilityRole="button"
              onPress={() => data.openPerson(profile.id)}
              style={[styles.pin, { left: 24 + (index % 2) * 140, top: 24 + Math.floor(index / 2) * 90 }]}
            >
              <Avatar
                name={profile.name}
                profileId={profile.id}
                color={profile.photos[0] ?? colors.pass}
                hidden={!photosRevealed(data, profile.id)}
                size={44}
              />
              <Text style={styles.pinName}>{profile.name.split(' ')[0]}</Text>
            </Pressable>
          ))
        ) : (
          <Text style={styles.help}>No location</Text>
        )}
      </View>
      {data.locationLocalOnly ? null : (
        <View style={styles.card}>
          <Text style={styles.heading}>Explorers</Text>
          <Text style={styles.help}>Not local residents. They show up only for the dates they are here.</Text>
          {travelers.length === 0 ? (
            <Text style={styles.help}>Pick a date window that overlaps a visit.</Text>
          ) : (
            <View style={styles.row}>
              {travelers.map((profile) => (
                <Pressable key={profile.id} accessibilityRole="button" onPress={() => data.openPerson(profile.id)} style={styles.explorer}>
                  <Avatar
                    name={profile.name}
                    profileId={profile.id}
                    color={profile.photos[0] ?? colors.pass}
                    hidden={!photosRevealed(data, profile.id)}
                    size={52}
                  />
                  <Text style={styles.pinName}>{profile.name.split(' ')[0]}</Text>
                  <Text style={styles.help}>{profile.explorerDates}</Text>
                </Pressable>
              ))}
            </View>
          )}
        </View>
      )}
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
    fontSize: 22,
    fontWeight: '800',
    lineHeight: 28,
  },
  info: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1,
    borderColor: colors.muted,
    color: colors.muted,
    textAlign: 'center',
    fontWeight: '800',
    overflow: 'hidden',
  },
  help: {
    color: colors.muted,
    lineHeight: 20,
  },
  status: {
    color: colors.ink,
    fontWeight: '800',
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.lg,
  },
  link: {
    color: colors.coralDeep,
    fontWeight: '800',
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: radii.card,
    borderWidth: 1,
    borderColor: colors.line,
    padding: spacing.lg,
    gap: spacing.sm,
  },
  item: {
    color: colors.ink,
    fontWeight: '700',
  },
  input: {
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radii.stamp,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    color: colors.ink,
    fontSize: 16,
    lineHeight: 22,
    userSelect: 'text',
  },
  button: {
    alignSelf: 'flex-start',
    backgroundColor: colors.likeStamp,
    borderRadius: radii.button,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
  },
  buttonText: {
    color: colors.white,
    fontWeight: '800',
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  chip: {
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radii.chip,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  chipText: {
    color: colors.ink,
    fontWeight: '700',
  },
  map: {
    height: 220,
    borderRadius: radii.card,
    backgroundColor: colors.chip,
    borderWidth: 2,
    borderColor: colors.ink,
    overflow: 'hidden',
  },
  pin: {
    position: 'absolute',
    alignItems: 'center',
    width: 72,
  },
  pinName: {
    color: colors.ink,
    fontSize: 12,
    fontWeight: '700',
  },
  heading: {
    color: colors.ink,
    fontWeight: '800',
  },
  explorer: {
    width: 88,
    alignItems: 'center',
  },
});
