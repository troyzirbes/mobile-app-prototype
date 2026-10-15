function jitter(seed: number, index: number, amount: number): number {
  const raw = Math.sin(seed * 12.9898 + index * 78.233) * 43758.5453;
  return (raw - Math.floor(raw) - 0.5) * 2 * amount;
}

function smoothClosed(points: Array<[number, number]>): string {
  const first = points[0];
  const last = points[points.length - 1];
  if (!first || !last) {
    return '';
  }
  const startX = (last[0] + first[0]) / 2;
  const startY = (last[1] + first[1]) / 2;
  let path = `M ${startX.toFixed(2)} ${startY.toFixed(2)}`;
  for (let index = 0; index < points.length; index += 1) {
    const current = points[index];
    const next = points[(index + 1) % points.length];
    if (!current || !next) {
      continue;
    }
    const midX = (current[0] + next[0]) / 2;
    const midY = (current[1] + next[1]) / 2;
    path += ` Q ${current[0].toFixed(2)} ${current[1].toFixed(2)} ${midX.toFixed(2)} ${midY.toFixed(2)}`;
  }
  return `${path} Z`;
}

function pointOnRoundRect(
  left: number,
  top: number,
  right: number,
  bottom: number,
  radius: number,
  progress: number,
): [number, number] {
  const straightX = Math.max(right - left - radius * 2, 0);
  const straightY = Math.max(bottom - top - radius * 2, 0);
  const arc = (Math.PI * radius) / 2;
  const perimeter = straightX * 2 + straightY * 2 + arc * 4;
  let distance = progress * perimeter;
  const take = (length: number): number | null => {
    if (distance <= length) {
      const local = distance;
      distance = -1;
      return local;
    }
    distance -= length;
    return null;
  };
  const topEdge = take(straightX);
  if (topEdge !== null) {
    return [left + radius + topEdge, top];
  }
  const topRight = take(arc);
  if (topRight !== null) {
    const angle = -Math.PI / 2 + (topRight / Math.max(arc, 0.001)) * (Math.PI / 2);
    return [right - radius + Math.cos(angle) * radius, top + radius + Math.sin(angle) * radius];
  }
  const rightEdge = take(straightY);
  if (rightEdge !== null) {
    return [right, top + radius + rightEdge];
  }
  const bottomRight = take(arc);
  if (bottomRight !== null) {
    const angle = (bottomRight / Math.max(arc, 0.001)) * (Math.PI / 2);
    return [right - radius + Math.cos(angle) * radius, bottom - radius + Math.sin(angle) * radius];
  }
  const bottomEdge = take(straightX);
  if (bottomEdge !== null) {
    return [right - radius - bottomEdge, bottom];
  }
  const bottomLeft = take(arc);
  if (bottomLeft !== null) {
    const angle = Math.PI / 2 + (bottomLeft / Math.max(arc, 0.001)) * (Math.PI / 2);
    return [left + radius + Math.cos(angle) * radius, bottom - radius + Math.sin(angle) * radius];
  }
  const leftEdge = take(straightY);
  if (leftEdge !== null) {
    return [left, bottom - radius - leftEdge];
  }
  const topLeft = take(arc);
  if (topLeft !== null) {
    const angle = Math.PI + (topLeft / Math.max(arc, 0.001)) * (Math.PI / 2);
    return [left + radius + Math.cos(angle) * radius, top + radius + Math.sin(angle) * radius];
  }
  return [left + radius, top];
}

export function sketchCirclePath(size: number, seed: number): string {
  const count = 14;
  const center = size / 2;
  const radius = size / 2 - 3;
  const points: Array<[number, number]> = [];
  for (let index = 0; index < count; index += 1) {
    const theta = (index / count) * Math.PI * 2;
    const wobble = radius + jitter(seed, index, radius * 0.05);
    points.push([center + Math.cos(theta) * wobble, center + Math.sin(theta) * wobble]);
  }
  return smoothClosed(points);
}

export function sketchRoundRectPath(width: number, height: number, seed: number): string {
  const inset = 2;
  const left = inset;
  const top = inset;
  const right = Math.max(left + 8, width - inset);
  const bottom = Math.max(top + 8, height - inset);
  const radius = Math.min(18, (right - left) / 3, (bottom - top) / 3);
  const points: Array<[number, number]> = [];
  for (let index = 0; index < 20; index += 1) {
    const point = pointOnRoundRect(left, top, right, bottom, radius, index / 20);
    points.push([point[0] + jitter(seed, index, 1.35), point[1] + jitter(seed, index + 17, 1.35)]);
  }
  return smoothClosed(points);
}
