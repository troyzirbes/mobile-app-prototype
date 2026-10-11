import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { applyRegen, FREE_ENERGY_MAX, PAID_ENERGY_MAX, REGEN_INTERVAL_MS } from './energy.ts';

describe('applyRegen', () => {
  it('adds one token per minute and stops at the free cap', () => {
    const start = 1_000_000;
    const next = applyRegen(98, start, start + REGEN_INTERVAL_MS * 5, false);
    assert.equal(next.energyTokens, FREE_ENERGY_MAX);
  });

  it('uses the same speed and a higher cap for paid members', () => {
    const start = 1_000_000;
    const paid = applyRegen(100, start, start + REGEN_INTERVAL_MS * 10, true);
    const free = applyRegen(100, start, start + REGEN_INTERVAL_MS * 10, false);
    assert.equal(paid.energyTokens, 110);
    assert.equal(free.energyTokens, FREE_ENERGY_MAX);
    assert.equal(PAID_ENERGY_MAX, 150);
  });

  it('does not regenerate before a full minute', () => {
    const start = 5_000;
    const next = applyRegen(80, start, start + REGEN_INTERVAL_MS - 1, true);
    assert.equal(next.energyTokens, 80);
    assert.equal(next.lastRegenTimestamp, start);
  });
});
