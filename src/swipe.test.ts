import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { formatLikedNames } from './copy.ts';
import { decideSwipe, SWIPE_DISTANCE, SWIPE_VELOCITY } from './swipe.ts';

describe('decideSwipe', () => {
  it('likes a card dragged past the distance threshold', () => {
    assert.equal(decideSwipe(SWIPE_DISTANCE, 0), 'like');
    assert.equal(decideSwipe(SWIPE_DISTANCE + 40, 0.1), 'like');
  });

  it('passes a card dragged past the distance threshold', () => {
    assert.equal(decideSwipe(-SWIPE_DISTANCE, 0), 'pass');
    assert.equal(decideSwipe(-SWIPE_DISTANCE - 40, -0.1), 'pass');
  });

  it('cancels a short drag', () => {
    assert.equal(decideSwipe(0, 0), 'cancel');
    assert.equal(decideSwipe(SWIPE_DISTANCE - 1, 0), 'cancel');
    assert.equal(decideSwipe(-SWIPE_DISTANCE + 1, 0), 'cancel');
  });

  it('lets a flick decide before distance', () => {
    assert.equal(decideSwipe(12, SWIPE_VELOCITY), 'like');
    assert.equal(decideSwipe(-12, -SWIPE_VELOCITY), 'pass');
    assert.equal(decideSwipe(SWIPE_DISTANCE + 80, -SWIPE_VELOCITY), 'pass');
    assert.equal(decideSwipe(-SWIPE_DISTANCE - 80, SWIPE_VELOCITY), 'like');
  });
});

describe('formatLikedNames', () => {
  it('describes an empty like list', () => {
    assert.equal(
      formatLikedNames([]),
      'You passed on everyone in this deck.',
    );
  });

  it('lists one, two, and many likes', () => {
    assert.equal(formatLikedNames(['Maya Alvarez']), 'You liked Maya Alvarez.');
    assert.equal(
      formatLikedNames(['Maya Alvarez', 'Jordan Hale']),
      'You liked Maya Alvarez and Jordan Hale.',
    );
    assert.equal(
      formatLikedNames(['Maya Alvarez', 'Jordan Hale', 'Mina Park']),
      'You liked Maya Alvarez, Jordan Hale, and Mina Park.',
    );
  });
});
