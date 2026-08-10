import { pointAt, polylineLength, type WalkLeg, type WalkState } from "@anima/core";

/**
 * Token fork/merge across a parallel gateway (script Act 2).
 *
 * core's `walkAt` (packages/core/src/token/walk.ts) drives one token along one
 * linear sequence of legs - it has no notion of a token splitting into two at
 * a gateway and recombining at a join. The reseller diagram's parallel split
 * needs exactly that, so this is new logic built ON TOP of core's existing
 * `WalkLeg`/`pointAt` primitives rather than a change to shared walk code -
 * only one episode needs fork/merge so far. Promote to core if a second
 * episode wants the same pattern.
 */

export interface ForkSpec {
  /** Points from the split node up to (not including) the fork point - walked by ONE token. */
  trunk: WalkLeg;
  /** Two branches, walked by two separate tokens after the trunk completes. */
  branchA: WalkLeg;
  branchB: WalkLeg;
  /** Points from the join node onward - walked by ONE token again, after both branches finish. */
  merged: WalkLeg;
}

export interface ForkWalkState {
  /** Single token before the split and after the join. Null while forked. */
  single: WalkState | null;
  /** Two tokens while forked. Null before the split or after the join. */
  forked: [WalkState, WalkState] | null;
}

const legEnd = (leg: WalkLeg) => leg.startFrame + leg.durationFrames + (leg.pauseFrames ?? 0);

const stateOnLeg = (leg: WalkLeg, frame: number): WalkState => {
  if (frame < leg.startFrame) {
    const p = pointAt(leg.points, 0);
    return { ...p, heading: 0, moving: false };
  }
  const walkEnd = leg.startFrame + leg.durationFrames;
  if (frame <= walkEnd) {
    const t = leg.durationFrames === 0 ? 1 : (frame - leg.startFrame) / leg.durationFrames;
    const eased = easeInOut(Math.max(0, Math.min(1, t)));
    const p = pointAt(leg.points, eased);
    const ahead = pointAt(leg.points, Math.min(1, eased + 0.02));
    return {
      ...p,
      heading: Math.atan2(ahead.y - p.y, ahead.x - p.x),
      moving: polylineLength(leg.points) > 0,
    };
  }
  const p = pointAt(leg.points, 1);
  return { ...p, heading: 0, moving: false };
};

function easeInOut(t: number): number {
  return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
}

export function forkWalkAt(fork: ForkSpec, frame: number): ForkWalkState {
  const trunkEnd = legEnd(fork.trunk);
  const branchesEnd = Math.max(legEnd(fork.branchA), legEnd(fork.branchB));

  if (frame < trunkEnd) {
    return { single: stateOnLeg(fork.trunk, frame), forked: null };
  }
  if (frame < branchesEnd) {
    return {
      single: null,
      forked: [stateOnLeg(fork.branchA, frame), stateOnLeg(fork.branchB, frame)],
    };
  }
  return { single: stateOnLeg(fork.merged, frame), forked: null };
}
