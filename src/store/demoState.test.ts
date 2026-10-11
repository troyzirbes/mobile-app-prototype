import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  allowDM,
  beginChallenge,
  createInitialDemo,
  disallowDM,
  fillAttentionGate,
  reciprocateLike,
  sendLike,
} from './demoState.ts';
import { DAY_MS, ENERGY_LIKE, ENERGY_NOTE } from './energy.ts';

const now = 1_700_000_000_000;

describe('learning stage', () => {
  it('moves a reciprocated like into learning and keeps messaging closed', () => {
    const initial = createInitialDemo(now);
    const incoming = initial.incomingLikes[0];
    assert.ok(incoming);
    const step = reciprocateLike(initial, incoming.id, now);
    assert.equal(step.ok, true);
    assert.equal(step.data.energyTokens, initial.energyTokens - ENERGY_LIKE);
    assert.equal(step.data.activeChats.length, 0);
    assert.equal(step.data.learningStageQueue[0]?.id, incoming.id);
    assert.equal(
      step.data.incomingLikes.some((profile) => profile.id === incoming.id),
      false,
    );
  });

  it('spends more energy for a note and still does not open a chat', () => {
    const initial = createInitialDemo(now);
    const step = sendLike(initial, 'sam-ellis', 'Sunday noodles?', now);
    assert.equal(step.ok, true);
    assert.equal(step.data.energyTokens, initial.energyTokens - ENERGY_NOTE);
    assert.equal(step.data.activeChats.length, 0);
    assert.equal(step.data.learningStageQueue.some((profile) => profile.id === 'sam-ellis'), true);
  });

  it('allows a chat only from the learning stage', () => {
    const initial = createInitialDemo(now);
    const liked = reciprocateLike(initial, 'jordan-hale', now);
    const opened = allowDM(liked.data, 'jordan-hale', now);
    assert.equal(opened.ok, true);
    assert.equal(opened.data.activeChats.length, 1);
    assert.equal(opened.data.learningStageQueue.length, 0);
  });

  it('disallow resets two people to strangers', () => {
    const initial = createInitialDemo(now);
    const liked = reciprocateLike(initial, 'andre-brooks', now);
    const cleared = disallowDM(liked.data, 'andre-brooks');
    assert.equal(cleared.ok, true);
    assert.equal(cleared.data.learningStageQueue.length, 0);
    assert.equal(cleared.data.activeChats.length, 0);
  });
});

describe('attention gate and challenges', () => {
  it('fills the chat cap and turns incognito on', () => {
    const initial = createInitialDemo(now);
    const filled = fillAttentionGate(initial, now);
    assert.equal(filled.data.activeChats.length, initial.attentionGate.maxActiveChats);
    assert.equal(filled.data.isIncognito, true);
    const blocked = allowDM(
      {
        ...filled.data,
        learningStageQueue: initial.incomingLikes,
      },
      'jordan-hale',
      now,
    );
    assert.equal(blocked.ok, false);
    assert.equal(blocked.data.activeChats.length, filled.data.activeChats.length);
  });

  it('refuses a second challenge inside 24 hours', () => {
    const initial = createInitialDemo(now);
    const first = beginChallenge(initial, 'sam-ellis', now);
    assert.equal(first.ok, true);
    const second = beginChallenge(first.data, 'evan-cho', now + DAY_MS - 1);
    assert.equal(second.ok, false);
    const later = beginChallenge(first.data, 'evan-cho', now + DAY_MS);
    assert.equal(later.ok, true);
  });
});
