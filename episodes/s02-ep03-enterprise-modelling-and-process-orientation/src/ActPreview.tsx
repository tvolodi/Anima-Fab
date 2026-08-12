import React from "react";
import { Sequence } from "remotion";

/**
 * Makes a standalone per-act composition scrubbable in Remotion Studio.
 *
 * Every act component reads ABSOLUTE cue frames from timing.ts (e.g. "show
 * the merge at frame 2070"). That's correct for `Episode`, where frame 2070
 * really is 69s into playback. But a standalone `Act2` composition (used so
 * a single act can be previewed/rendered in isolation) starts its OWN
 * timeline at local frame 0 - so scrubbing it never reaches frame 2070
 * unless the composition is that long, and even then frame 0 shows the
 * act "before it starts", not its actual first frame.
 *
 * This was a real bug in both ep01 and s02-ep02, not just a footnote:
 * previewing an act directly in Studio showed content that looked wrong
 * because interpolations keyed to absolute cue frames were all reading frame
 * values far outside their intended range - most just clamped to their
 * start state.
 *
 * Fix: wrap the act in a `Sequence` shifted back by `start`, so local
 * frame 0 in the Studio player maps to absolute frame `start` for
 * everything inside - the act sees the same frame numbers it would inside
 * `Episode`, just starting the scrub bar at its own first frame instead of
 * frame 0 of the whole episode.
 */
export const ActPreview: React.FC<{
  start: number;
  children: React.ReactNode;
}> = ({ start, children }) => (
  <Sequence from={-start} durationInFrames={Infinity} layout="none">
    {children}
  </Sequence>
);
