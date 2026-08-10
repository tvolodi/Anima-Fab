import { pointAt, polylineLength } from "../process/layout";

export interface WalkLeg {
  points: Array<{ x: number; y: number }>;
  /** Frame at which this leg starts. */
  startFrame: number;
  /** How long the walk takes. */
  durationFrames: number;
  /** Frames to pause at the end of this leg before the next begins. */
  pauseFrames?: number;
}

export interface WalkState {
  x: number;
  y: number;
  heading: number;
  moving: boolean;
}

/**
 * Where is the token at `frame`, given a sequence of legs?
 *
 * Pauses are first-class because the script's most important token beat is a
 * stop: "reaches the edge of her diagram, and stops. Waits. Blinks."
 */
export function walkAt(legs: WalkLeg[], frame: number): WalkState {
  if (legs.length === 0) return { x: 0, y: 0, heading: 0, moving: false };

  const first = legs[0];
  if (!first) return { x: 0, y: 0, heading: 0, moving: false };

  if (frame < first.startFrame) {
    const p = pointAt(first.points, 0);
    return { ...p, heading: 0, moving: false };
  }

  for (const leg of legs) {
    const walkEnd = leg.startFrame + leg.durationFrames;
    const legEnd = walkEnd + (leg.pauseFrames ?? 0);
    if (frame > legEnd) continue;

    if (frame <= walkEnd) {
      const t =
        leg.durationFrames === 0
          ? 1
          : (frame - leg.startFrame) / leg.durationFrames;
      const eased = easeInOut(Math.max(0, Math.min(1, t)));
      const p = pointAt(leg.points, eased);
      const ahead = pointAt(leg.points, Math.min(1, eased + 0.02));
      return {
        ...p,
        heading: Math.atan2(ahead.y - p.y, ahead.x - p.x),
        moving: polylineLength(leg.points) > 0,
      };
    }

    // In the pause at the end of this leg.
    const p = pointAt(leg.points, 1);
    return { ...p, heading: 0, moving: false };
  }

  const last = legs[legs.length - 1];
  if (!last) return { x: 0, y: 0, heading: 0, moving: false };
  const p = pointAt(last.points, 1);
  return { ...p, heading: 0, moving: false };
}

function easeInOut(t: number): number {
  return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
}
