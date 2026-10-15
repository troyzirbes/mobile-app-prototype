import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { MARKER, PORTRAIT, inRegion, layoutVenn, type CircleLayout, type Membership } from './overlapLayout.ts';

function separated(markers: { x: number; y: number }[]): boolean {
  return markers.every((marker, index) =>
    markers.every((other, otherIndex) => otherIndex === index || Math.hypot(marker.x - other.x, marker.y - other.y) >= MARKER - 1),
  );
}

function placedCorrectly(markers: { id: string; x: number; y: number }[], members: Membership[], circles: CircleLayout[]): boolean {
  return markers.every((marker) => {
    const member = members.find((item) => item.id === marker.id);
    return member ? inRegion(marker.x, marker.y, circles, member.mask) : false;
  });
}

describe('layoutVenn', () => {
  it('fits several portraits inside one blue circle', () => {
    const members = ['a', 'b', 'c', 'd'].map((id) => ({ id, mask: 1 }));
    const layout = layoutVenn(1, members);
    assert.equal(layout.circles.length, 1);
    assert.equal(layout.markers.length, 4);
    assert.ok(placedCorrectly(layout.markers, members, layout.circles));
    assert.ok(separated(layout.markers));
    const solo = layoutVenn(1, [{ id: 'only', mask: 1 }]);
    const many = layout.circles[0];
    const one = solo.circles[0];
    assert.ok(many && one && many.r > one.r);
  });

  it('keeps exclusive portraits out of the other circle and shared portraits in both', () => {
    const members: Membership[] = [
      { id: 'only-a', mask: 0b001 },
      { id: 'only-a-2', mask: 0b001 },
      { id: 'only-b', mask: 0b010 },
      { id: 'both', mask: 0b011 },
    ];
    const layout = layoutVenn(2, members);
    assert.equal(layout.circles.length, 2);
    assert.ok(placedCorrectly(layout.markers, members, layout.circles));
    assert.ok(separated(layout.markers));
    const shared = layout.markers.find((marker) => marker.id === 'both');
    assert.ok(shared);
    assert.ok(Math.hypot(shared.x - (layout.circles[0]?.cx ?? 0), shared.y - (layout.circles[0]?.cy ?? 0)) + PORTRAIT / 2 <= (layout.circles[0]?.r ?? 0));
    assert.ok(Math.hypot(shared.x - (layout.circles[1]?.cx ?? 0), shared.y - (layout.circles[1]?.cy ?? 0)) + PORTRAIT / 2 <= (layout.circles[1]?.r ?? 0));
  });

  it('fits a three-circle overlap, including someone in all three', () => {
    const members: Membership[] = [
      { id: 'a', mask: 0b001 },
      { id: 'b', mask: 0b010 },
      { id: 'c', mask: 0b100 },
      { id: 'ab', mask: 0b011 },
      { id: 'ac', mask: 0b101 },
      { id: 'bc', mask: 0b110 },
      { id: 'abc', mask: 0b111 },
    ];
    const layout = layoutVenn(3, members);
    assert.equal(layout.circles.length, 3);
    assert.equal(layout.markers.length, 7);
    assert.ok(placedCorrectly(layout.markers, members, layout.circles));
    assert.ok(separated(layout.markers));
  });

  it('fits the commonalities mix of single, pair, and triple memberships', () => {
    const members: Membership[] = [
      { id: 'sam', mask: 0b001 },
      { id: 'noa', mask: 0b010 },
      { id: 'andre', mask: 0b010 },
      { id: 'chris', mask: 0b100 },
      { id: 'theo', mask: 0b100 },
      { id: 'miles', mask: 0b011 },
      { id: 'nico', mask: 0b110 },
      { id: 'jordan', mask: 0b111 },
    ];
    const layout = layoutVenn(3, members);
    assert.equal(layout.markers.length, members.length);
    assert.ok(placedCorrectly(layout.markers, members, layout.circles));
    assert.ok(separated(layout.markers));
    assert.ok(layout.width > 0 && layout.height > 0);
  });

  it('still separates portraits when the circles do not share anyone', () => {
    const members: Membership[] = [
      { id: 'athletic-1', mask: 0b001 },
      { id: 'athletic-2', mask: 0b001 },
      { id: 'outdoors-1', mask: 0b010 },
      { id: 'outdoors-2', mask: 0b010 },
    ];
    const layout = layoutVenn(2, members);
    assert.ok(placedCorrectly(layout.markers, members, layout.circles));
    assert.ok(separated(layout.markers));
  });
});
