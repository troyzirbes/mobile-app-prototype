export const PORTRAIT = 48;
export const MARKER = 76;

export type Membership = {
  id: string;
  mask: number;
};

export type CircleLayout = {
  index: number;
  cx: number;
  cy: number;
  r: number;
};

export type MarkerLayout = {
  id: string;
  x: number;
  y: number;
};

export type VennLayout = {
  circles: CircleLayout[];
  markers: MarkerLayout[];
  width: number;
  height: number;
};

const MAX_ATTEMPTS = 24;

export function layoutVenn(circleCount: number, members: Membership[]): VennLayout {
  const count = Math.max(0, Math.min(3, circleCount));
  const placedMembers = members.filter((member) => member.mask > 0 && member.mask < 1 << count);
  if (count === 0) {
    return { circles: [], markers: [], width: 0, height: 0 };
  }

  let circles = initialCircles(count, placedMembers);
  let markers: MarkerLayout[] = [];
  for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt += 1) {
    const placed = placeMarkers(circles, placedMembers);
    if (placed) {
      markers = placed;
      break;
    }
    circles = grow(circles, tightestMask(circles, placedMembers));
  }
  if (markers.length !== placedMembers.length) {
    markers = placeMarkers(circles, placedMembers) ?? fallbackMarkers(circles, placedMembers);
  }
  return normalize(circles, markers);
}

function initialCircles(count: number, members: Membership[]): CircleLayout[] {
  const radii = Array.from({ length: count }, (_, index) => radiusFor(population(members, index)));
  if (count === 1) {
    return [{ index: 0, cx: 0, cy: 0, r: radii[0] ?? radiusFor(0) }];
  }
  if (count === 2) {
    const distance = pairDistance(radii[0] ?? 0, radii[1] ?? 0, shared(members, 0b011), only(members, 0b001), only(members, 0b010));
    return [
      { index: 0, cx: -distance / 2, cy: 0, r: radii[0] ?? radiusFor(0) },
      { index: 1, cx: distance / 2, cy: 0, r: radii[1] ?? radiusFor(0) },
    ];
  }
  const d01 = pairDistance(radii[0] ?? 0, radii[1] ?? 0, shared(members, 0b011), only(members, 0b001), only(members, 0b010));
  const d02 = pairDistance(radii[0] ?? 0, radii[2] ?? 0, shared(members, 0b101), only(members, 0b001), only(members, 0b100));
  const d12 = pairDistance(radii[1] ?? 0, radii[2] ?? 0, shared(members, 0b110), only(members, 0b010), only(members, 0b100));
  const third = thirdCenter(d01, d02, d12);
  return [
    { index: 0, cx: 0, cy: 0, r: radii[0] ?? radiusFor(0) },
    { index: 1, cx: d01, cy: 0, r: radii[1] ?? radiusFor(0) },
    { index: 2, cx: third.x, cy: third.y, r: radii[2] ?? radiusFor(0) },
  ];
}

function radiusFor(count: number): number {
  const area = Math.max(count, 1) * MARKER * MARKER * 1.7;
  return Math.max(MARKER * 1.2, Math.sqrt(area / Math.PI) + PORTRAIT);
}

function population(members: Membership[], index: number): number {
  const bit = 1 << index;
  return members.filter((member) => (member.mask & bit) !== 0).length;
}

function shared(members: Membership[], mask: number): number {
  return members.filter((member) => (member.mask & mask) === mask).length;
}

function only(members: Membership[], mask: number): number {
  return members.filter((member) => member.mask === mask).length;
}

function pairDistance(radiusA: number, radiusB: number, intersection: number, exclusiveA: number, exclusiveB: number): number {
  const smaller = Math.min(radiusA, radiusB);
  if (intersection === 0) {
    return radiusA + radiusB - smaller * 0.12;
  }
  const weight = intersection / Math.max(1, intersection + exclusiveA + exclusiveB);
  const depth = smaller * (0.26 + 0.22 * Math.min(1, weight * 3));
  const exclusiveRoom = (exclusiveA > 0 ? PORTRAIT : 0) + (exclusiveB > 0 ? PORTRAIT : 0);
  return Math.max(Math.abs(radiusA - radiusB) + exclusiveRoom, radiusA + radiusB - depth);
}

function thirdCenter(d01: number, d02: number, d12: number): { x: number; y: number } {
  const base = Math.max(d01, 1);
  const x = (d02 * d02 - d12 * d12 + base * base) / (2 * base);
  const ySquared = d02 * d02 - x * x;
  return { x, y: Math.sqrt(Math.max(ySquared, base * 0.2)) };
}

function placeMarkers(circles: CircleLayout[], members: Membership[]): MarkerLayout[] | null {
  const placed: MarkerLayout[] = [];
  const regions = groupRegions(members);
  for (const region of regions) {
    const spots = candidates(circles, region.mask);
    for (const member of region.members) {
      const spot = nearestOpen(spots, seed(circles, region.mask), placed);
      if (!spot) {
        return null;
      }
      placed.push({ id: member.id, x: spot.x, y: spot.y });
    }
  }
  return placed;
}

function groupRegions(members: Membership[]): { mask: number; members: Membership[] }[] {
  const groups = new Map<number, Membership[]>();
  members.forEach((member) => {
    const list = groups.get(member.mask) ?? [];
    list.push(member);
    groups.set(member.mask, list);
  });
  return [...groups.entries()]
    .map(([mask, list]) => ({ mask, members: list }))
    .sort((left, right) => bitCount(right.mask) - bitCount(left.mask) || left.members.length - right.members.length);
}

function bitCount(mask: number): number {
  let count = 0;
  let rest = mask;
  while (rest > 0) {
    count += rest & 1;
    rest >>= 1;
  }
  return count;
}

function candidates(circles: CircleLayout[], mask: number): { x: number; y: number }[] {
  const bounds = boundsOf(circles);
  const spots: { x: number; y: number }[] = [];
  for (let x = bounds.minX; x <= bounds.maxX; x += 8) {
    for (let y = bounds.minY; y <= bounds.maxY; y += 8) {
      if (inRegion(x, y, circles, mask)) {
        spots.push({ x, y });
      }
    }
  }
  return spots;
}

function boundsOf(circles: CircleLayout[]): { minX: number; minY: number; maxX: number; maxY: number } {
  return circles.reduce(
    (bounds, circle) => ({
      minX: Math.min(bounds.minX, circle.cx - circle.r),
      minY: Math.min(bounds.minY, circle.cy - circle.r),
      maxX: Math.max(bounds.maxX, circle.cx + circle.r),
      maxY: Math.max(bounds.maxY, circle.cy + circle.r),
    }),
    { minX: Infinity, minY: Infinity, maxX: -Infinity, maxY: -Infinity },
  );
}

function seed(circles: CircleLayout[], mask: number): { x: number; y: number } {
  const chosen = circles.filter((_, index) => (mask & (1 << index)) !== 0);
  if (chosen.length === 0) {
    return { x: 0, y: 0 };
  }
  return {
    x: chosen.reduce((sum, circle) => sum + circle.cx, 0) / chosen.length,
    y: chosen.reduce((sum, circle) => sum + circle.cy, 0) / chosen.length,
  };
}

function nearestOpen(
  spots: { x: number; y: number }[],
  origin: { x: number; y: number },
  placed: MarkerLayout[],
): { x: number; y: number } | null {
  const open = spots.filter((spot) => clearOf(spot, placed, MARKER));
  if (open.length === 0) {
    return null;
  }
  return open.reduce((best, spot) => (distance(spot, origin) < distance(best, origin) ? spot : best));
}

function clearOf(spot: { x: number; y: number }, others: { x: number; y: number }[], gap: number): boolean {
  return others.every((other) => distance(spot, other) >= gap);
}

function distance(left: { x: number; y: number }, right: { x: number; y: number }): number {
  return Math.hypot(left.x - right.x, left.y - right.y);
}

export function inRegion(x: number, y: number, circles: CircleLayout[], mask: number): boolean {
  return circles.every((circle, index) => {
    const inside = Math.hypot(x - circle.cx, y - circle.cy) + PORTRAIT / 2 + 16 <= circle.r;
    const outside = Math.hypot(x - circle.cx, y - circle.cy) - PORTRAIT / 2 >= circle.r;
    const should = (mask & (1 << index)) !== 0;
    return should ? inside : outside;
  });
}

function tightestMask(circles: CircleLayout[], members: Membership[]): number {
  const regions = groupRegions(members);
  const missing = regions
    .filter((region) => candidates(circles, region.mask).length < region.members.length)
    .sort((left, right) => bitCount(left.mask) - bitCount(right.mask));
  return missing[0]?.mask ?? regions[0]?.mask ?? 1;
}

function grow(circles: CircleLayout[], mask: number): CircleLayout[] {
  const next = circles.map((circle) => ({ ...circle }));
  const indexes = next.map((_, index) => index).filter((index) => (mask & (1 << index)) !== 0);
  if (indexes.length >= 2) {
    const origin = {
      x: indexes.reduce((sum, index) => sum + (next[index]?.cx ?? 0), 0) / indexes.length,
      y: indexes.reduce((sum, index) => sum + (next[index]?.cy ?? 0), 0) / indexes.length,
    };
    indexes.forEach((index) => {
      const circle = next[index];
      if (!circle) {
        return;
      }
      circle.cx += (origin.x - circle.cx) * 0.08;
      circle.cy += (origin.y - circle.cy) * 0.08;
      circle.r *= 1.1;
    });
    return next;
  }
  const index = indexes[0] ?? 0;
  const circle = next[index];
  if (!circle) {
    return next;
  }
  circle.r *= 1.12;
  const others = next.filter((_, item) => item !== index);
  if (others.length > 0) {
    const origin = {
      x: others.reduce((sum, item) => sum + item.cx, 0) / others.length,
      y: others.reduce((sum, item) => sum + item.cy, 0) / others.length,
    };
    const dx = circle.cx - origin.x;
    const dy = circle.cy - origin.y;
    const length = Math.hypot(dx, dy) || 1;
    circle.cx += (dx / length) * circle.r * 0.1;
    circle.cy += (dy / length) * circle.r * 0.1;
  }
  return next;
}

function fallbackMarkers(circles: CircleLayout[], members: Membership[]): MarkerLayout[] {
  return members.map((member, index) => {
    const origin = seed(circles, member.mask);
    const angle = index * 0.9;
    return {
      id: member.id,
      x: origin.x + Math.cos(angle) * 8,
      y: origin.y + Math.sin(angle) * 8,
    };
  });
}

function normalize(circles: CircleLayout[], markers: MarkerLayout[]): VennLayout {
  const bounds = boundsOf(circles);
  const pad = 8;
  const shiftX = pad - bounds.minX;
  const shiftY = pad - bounds.minY;
  return {
    circles: circles.map((circle) => ({ ...circle, cx: circle.cx + shiftX, cy: circle.cy + shiftY })),
    markers: markers.map((marker) => ({ ...marker, x: marker.x + shiftX, y: marker.y + shiftY })),
    width: bounds.maxX - bounds.minX + pad * 2,
    height: bounds.maxY - bounds.minY + pad * 2,
  };
}
