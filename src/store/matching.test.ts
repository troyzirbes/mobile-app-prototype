import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { demoUser, mockProfiles } from '../data/mockData.ts';
import { filterProfilesForTrack, isMutualMatch, overlapScore, partnerChoice } from './matching.ts';

describe('isMutualMatch', () => {
  it('requires both ages and both identities to fit', () => {
    const visible = mockProfiles.filter((profile) => isMutualMatch(demoUser, profile));
    assert.deepEqual(
      visible.map((profile) => profile.id).sort(),
      [
        'andre-brooks',
        'ben-okonkwo',
        'chris-lang',
        'jordan-hale',
        'miles-grant',
        'nico-alvarez',
        'noa-kealoha',
        'sam-ellis',
        'theo-park',
      ],
    );
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
      { startDate: '2027-05-02', endDate: '2027-05-10' },
      1,
      [],
    );
    assert.deepEqual(away.map((profile) => profile.id), ['ben-okonkwo']);
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
