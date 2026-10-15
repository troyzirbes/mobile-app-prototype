import type { DateRange, DemoUser, MockProfile, SearchTrack, StyleCategory } from '../types/demo';

export function isAdult(age: number): boolean {
  return age >= 21;
}

export function isMutualMatch(user: DemoUser, profile: MockProfile): boolean {
  if (!isAdult(user.age) || !isAdult(profile.age)) {
    return false;
  }
  const agesFit =
    profile.age >= user.ageRange.min &&
    profile.age <= user.ageRange.max &&
    user.age >= profile.ageRange.min &&
    user.age <= profile.ageRange.max;
  const identitiesFit =
    profile.seeking.includes(user.identity) && user.seeking.includes(profile.identity);
  return agesFit && identitiesFit;
}

export function rangesOverlap(userRange: DateRange | null, profile: MockProfile): boolean {
  if (!profile.explorerWindow || !userRange?.startDate || !userRange.endDate) {
    return false;
  }
  const { startDate, endDate } = profile.explorerWindow;
  return userRange.startDate <= endDate && startDate <= userRange.endDate;
}

export function overlapScore(userInterests: string[], profileInterests: string[]): number {
  const universe = new Set([...userInterests, ...profileInterests]);
  if (universe.size === 0) {
    return 0;
  }
  const shared = profileInterests.filter((interest) => userInterests.includes(interest)).length;
  return Math.round((shared / universe.size) * 100);
}

export function hashString(value: string): number {
  let hash = 0;
  for (const char of value) {
    hash = (hash * 33 + char.charCodeAt(0)) >>> 0;
  }
  return hash;
}

export function seededOrder<T extends { id: string }>(items: T[], salt: number): T[] {
  return [...items].sort(
    (left, right) => hashString(`${salt}:${left.id}`) - hashString(`${salt}:${right.id}`),
  );
}

export function partnerChoice(profileId: string, questionIndex: number, optionCount: number): number {
  if (optionCount <= 0) {
    return 0;
  }
  return hashString(`${profileId}:${questionIndex}`) % optionCount;
}

export function profileStyles(profile: MockProfile): StyleCategory[] {
  const styles = profile.styleCategories ?? [profile.styleCategory];
  return styles.includes(profile.styleCategory) ? styles : [profile.styleCategory, ...styles];
}

export function filterProfilesForTrack(
  profiles: MockProfile[],
  user: DemoUser,
  track: SearchTrack,
  aestheticStyle: StyleCategory | 'All',
  explorerDateRange: DateRange | null,
  randomSalt: number,
  busyIds: string[],
): MockProfile[] {
  const busy = new Set(busyIds);
  let pool = profiles.filter(
    (profile) => isMutualMatch(user, profile) && !busy.has(profile.id),
  );
  if (track === 'Location') {
    pool = pool.filter(
      (profile) => profile.isExplorer && rangesOverlap(explorerDateRange, profile),
    );
  } else {
    pool = pool.filter((profile) => !profile.isExplorer);
  }
  if (track === 'Aesthetic' && aestheticStyle !== 'All') {
    pool = pool.filter((profile) => profileStyles(profile).includes(aestheticStyle));
  }
  if (track === 'Adventure') {
    return seededOrder(pool, randomSalt);
  }
  if (track === 'Commonalities') {
    return [...pool].sort(
      (left, right) =>
        overlapScore(user.interests, right.interests) -
        overlapScore(user.interests, left.interests),
    );
  }
  return pool;
}
