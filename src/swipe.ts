export const SWIPE_DISTANCE = 120;

/** PanResponder reports vx in roughly pixels per millisecond. */
export const SWIPE_VELOCITY = 0.7;

export type SwipeDecision = 'like' | 'pass' | 'cancel';

export type CommittedSwipe = Exclude<SwipeDecision, 'cancel'>;

/**
 * A fast flick wins over where the card is resting.
 * Otherwise the card has to travel past the distance threshold.
 */
export function decideSwipe(dx: number, vx: number): SwipeDecision {
  if (vx >= SWIPE_VELOCITY) {
    return 'like';
  }
  if (vx <= -SWIPE_VELOCITY) {
    return 'pass';
  }
  if (dx >= SWIPE_DISTANCE) {
    return 'like';
  }
  if (dx <= -SWIPE_DISTANCE) {
    return 'pass';
  }
  return 'cancel';
}
