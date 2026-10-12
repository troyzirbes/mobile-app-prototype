import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { demoUser, mockProfiles } from '../data/mockData.ts';
import { filterProfilesForTrack, isMutualMatch, overlapScore, partnerChoice } from './matching.ts';

describe('isMutualMatch', () => {
  it('requires both ages and both identities to fit', () => {
    const visible = mockProfiles.filter((profile) => isMutualMatch(demoUser, profile));
    assert.ok(visible.length >= 10);
    assert.equal(visible.some((profile) => profile.id === 'mina-shah'), false);
    assert.equal(visible.some((profile) => profile.id === 'robert-hale'), false);
    assert.equal(visible.some((profile) => profile.id === 'casey-ng'), false);
    assert.ok(mockProfiles.every((profile) => profile.age >= 21));
  });
});

describe('filterProfilesForTrack', () => {
  it('keeps explorers off local tracks and locals off the travel track', () => {
    const local = filterProfilesForTrack(
      mockProfiles,
      demoUser,
      'Activities',
      'All',
      null,
      1,
      [],
    );
    assert.equal(local.some((profile) => profile.isExplorer), false);
    const away = filterProfilesForTrack(
      mockProfiles,
      demoUser,
      'Location',
      'All',
      { startDate: '2026-10-18', endDate: '2026-10-20' },
      1,
      [],
    );
    assert.deepEqual(away.map((profile) => profile.id), ['omar-haddad']);
    const unset = filterProfilesForTrack(
      mockProfiles,
      demoUser,
      'Location',
      'All',
      null,
      1,
      [],
    );
    assert.equal(unset.length, 0);
  });

  it('filters aesthetic tags and scores shared interests', () => {
    const athletic = filterProfilesForTrack(
      mockProfiles,
      demoUser,
      'Aesthetic',
      'Athletic',
      null,
      1,
      [],
    );
    assert.ok(athletic.every((profile) => profile.styleCategory === 'Athletic'));
    assert.ok(overlapScore(demoUser.interests, ['climbing', 'cooking']) > 0);
  });
});

describe('partnerChoice', () => {
  it('stays inside the option list', () => {
    const choice = partnerChoice('jordan-hale', 1, 3);
    assert.ok(choice >= 0 && choice < 3);
  });
});
