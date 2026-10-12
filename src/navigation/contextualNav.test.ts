import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { contextualNav } from './contextualNav.ts';

describe('contextualNav', () => {
  it('gives the home bar three destinations', () => {
    assert.deepEqual(
      contextualNav('Home').map((item) => item.label),
      ['Profile', 'Likes & Connections', 'App Info'],
    );
  });

  it('omits the active discovery track', () => {
    const labels = contextualNav('Aesthetic').map((item) => item.label);
    assert.equal(labels.includes('Aesthetic'), false);
    assert.deepEqual(labels, ['Home', 'Commonalities', 'Activities', 'Adventure', 'Location']);
  });

  it('uses the likes bar on profile and the likes hub', () => {
    assert.deepEqual(
      contextualNav('LikesHub').map((item) => item.label),
      ['Home', 'Interested', 'Exploring', 'Connections'],
    );
    assert.deepEqual(contextualNav('Profile'), contextualNav('LikesHub'));
  });

  it('hides the bar on the intro', () => {
    assert.deepEqual(contextualNav('Intro'), []);
  });
});
