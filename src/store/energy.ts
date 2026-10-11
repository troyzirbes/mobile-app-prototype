export const ENERGY_LIKE = 10;
export const ENERGY_NOTE = 30;
export const FREE_ENERGY_MAX = 100;
export const PAID_ENERGY_MAX = 150;
export const REGEN_INTERVAL_MS = 60_000;
export const DAY_MS = 24 * 60 * 60 * 1000;

export function maxEnergy(isPaidMember: boolean): number {
  return isPaidMember ? PAID_ENERGY_MAX : FREE_ENERGY_MAX;
}

export function applyRegen(
  energyTokens: number,
  lastRegenTimestamp: number,
  now: number,
  isPaidMember: boolean,
): { energyTokens: number; lastRegenTimestamp: number } {
  const cap = maxEnergy(isPaidMember);
  if (energyTokens >= cap || now <= lastRegenTimestamp) {
    return { energyTokens: Math.min(energyTokens, cap), lastRegenTimestamp };
  }
  const gained = Math.floor((now - lastRegenTimestamp) / REGEN_INTERVAL_MS);
  if (gained <= 0) {
    return { energyTokens, lastRegenTimestamp };
  }
  const next = Math.min(cap, energyTokens + gained);
  const used = (next - energyTokens) * REGEN_INTERVAL_MS;
  return { energyTokens: next, lastRegenTimestamp: lastRegenTimestamp + used };
}
