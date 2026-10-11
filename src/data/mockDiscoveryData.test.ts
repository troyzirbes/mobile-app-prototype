import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  discoveryCards,
  filterCardsByTag,
  getCardById,
} from './mockDiscoveryData.ts';

describe('discovery cards', () => {
  it('ships a full deck of adult profiles', () => {
    assert.ok(discoveryCards.length >= 8 && discoveryCards.length <= 10);
    for (const card of discoveryCards) {
      assert.ok(card.imageUrl.startsWith('https://'));
      assert.ok(card.matchScore >= 0 && card.matchScore <= 100);
      assert.ok(card.metadata.age >= 21);
      assert.ok(card.tags.length > 0);
    }
  });
});

describe('getCardById', () => {
  it('returns the matching card', () => {
    const card = getCardById('lena-ortiz');
    assert.equal(card?.title, 'Lena Ortiz');
    assert.deepEqual(card?.tags, ['Trending', 'Curated']);
  });

  it('returns undefined for an unknown id', () => {
    assert.equal(getCardById('missing'), undefined);
  });
});

describe('filterCardsByTag', () => {
  it('keeps cards that carry the tag', () => {
    const trending = filterCardsByTag('Trending');
    const curated = filterCardsByTag('Curated');
    assert.ok(trending.length > 0);
    assert.ok(curated.length > 0);
    assert.ok(trending.every((card) => card.tags.includes('Trending')));
    assert.ok(curated.every((card) => card.tags.includes('Curated')));
    assert.ok(trending.some((card) => card.id === 'lena-ortiz'));
    assert.ok(curated.some((card) => card.id === 'lena-ortiz'));
    assert.equal(
      trending.some((card) => card.id === 'jordan-hale'),
      false,
    );
  });
});
