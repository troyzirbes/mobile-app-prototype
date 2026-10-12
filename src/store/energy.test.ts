import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { applyRegen, FREE_ENERGY_MAX, PAID_ENERGY_MAX, REGEN_INTERVAL_MS } from './energy.ts';

describe('applyRegen', () => {
  it('adds one token per 30 minutes and stops at the demo cap', () => {
    const start = 1_000_000;
    const next = applyRegen(98, start, start + REGEN_INTERVAL_MS * 5, true);
    assert.equal(next.energyTokens, PAID_ENERGY_MAX);
    assert.equal(PAID_ENERGY_MAX, FREE_ENERGY_MAX);
    assert.equal(REGEN_INTERVAL_MS, 30 * 60 * 1000);
  });

  it('does not regenerate before a full interval', () => {
    const start = 5_000;
    const next = applyRegen(80, start, start + REGEN_INTERVAL_MS - 1, true);
    assert.equal(next.energyTokens, 80);
    assert.equal(next.lastRegenTimestamp, start);
  });
});
