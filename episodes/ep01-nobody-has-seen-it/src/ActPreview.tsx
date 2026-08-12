import React from "react";
import { Sequence } from "remotion";

/**
 * Makes a standalone per-act composition scrubbable in Remotion Studio.
 *
 * Most act components read ABSOLUTE cue frames from timing.ts (e.g. "n22
 * fires at frame 2070"). That's correct for `Episode`, where frame 2070
 * really is that many frames into playback. But a standalone composition
 * like "Act3" starts its OWN timeline at local frame 0 - so scrubbing it
 * never reaches the frames the act's interpolations are keyed to unless the
 * composition is played all the way through, and frame 0 shows the act
 * "before it starts" rather than its actual first frame. Confirmed as a real
 * bug (not just the old comment's caveat) while chasing a rendering issue in
 * s02-ep01-introduction that turned out to be exactly this - see that
 * episode's ActPreview.tsx for the full story.
 *
 * Fix: wrap the act in a `Sequence` shifted back by `start`, so local frame
 * 0 in the Studio player maps to absolute frame `start` for everything
 * inside - the act sees the same frame numbers it would inside `Episode`.
 *
 * NOT needed for Act2Overlay - its ACT2.* constants in timing.ts are already
 * act2-local (`at("n14") - ACTS.act2.start`), so it already previews
 * correctly. Wrapping it here too would double-subtract the offset. Only
 * ColdOpen, Act1 (start = ACTS.olga.start, the first of its four sub-acts),
 * Act3, Act4, and Close need this.
 */
export const ActPreview: React.FC<{
  start: number;
  children: React.ReactNode;
}> = ({ start, children }) => (
  <Sequence from={-start} durationInFrames={Infinity} layout="none">
    {children}
  </Sequence>
);
