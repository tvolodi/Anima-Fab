import React from "react";
import { Composition } from "remotion";
import { Episode } from "./Episode";
import { ActPreview } from "./ActPreview";
import { ColdOpen } from "./acts/ColdOpen";
import { Act1Testimonies } from "./acts/Act1Testimonies";
import { Act2Overlay } from "./acts/Act2Overlay";
import { Act3Cost } from "./acts/Act3Cost";
import { Act4Turn } from "./acts/Act4Turn";
import { Close } from "./acts/Close";
import { SingleTelling } from "./acts/SingleTelling";
import { ACTS, EPISODE_FRAMES, FPS } from "./timing";

const W = 1920;
const H = 1080;

/**
 * `Episode` is the deliverable. The per-act compositions exist so a single act
 * can be previewed or rendered in isolation.
 *
 * Most act components read ABSOLUTE frames from timing.ts, so they're wrapped
 * in `ActPreview` (local duration + a Sequence offset back to the act's real
 * start) so scrubbing from local frame 0 shows genuinely correct content -
 * see ActPreview.tsx. Act2Overlay is the one exception: its ACT2.* constants
 * in timing.ts are already act2-local, so it's left unwrapped - wrapping it
 * too would double-subtract the offset.
 */
export const RemotionRoot: React.FC = () => (
  <>
    <Composition
      id="Episode"
      component={Episode}
      durationInFrames={EPISODE_FRAMES}
      fps={FPS}
      width={W}
      height={H}
    />

    <Composition
      id="ColdOpen"
      component={() => <ActPreview start={0}><ColdOpen /></ActPreview>}
      durationInFrames={ACTS.coldOpen.end}
      fps={FPS}
      width={W}
      height={H}
    />

    <Composition
      id="Act1"
      component={() => <ActPreview start={ACTS.olga.start}><Act1Testimonies /></ActPreview>}
      durationInFrames={ACTS.fourth.end - ACTS.olga.start}
      fps={FPS}
      width={W}
      height={H}
    />

    {/* Not wrapped in ActPreview - already act2-local, see note above. */}
    <Composition
      id="Act2Overlay"
      component={Act2Overlay}
      durationInFrames={ACTS.act2.duration}
      fps={FPS}
      width={W}
      height={H}
      defaultProps={{
        olgaX: 0,
        sergeyX: 330,
        directorX: 120,
        gapAt: 0.46,
      }}
    />

    <Composition
      id="Act3"
      component={() => <ActPreview start={ACTS.act3.start}><Act3Cost /></ActPreview>}
      durationInFrames={ACTS.act3.end - ACTS.act3.start}
      fps={FPS}
      width={W}
      height={H}
    />

    <Composition
      id="Act4"
      component={() => <ActPreview start={ACTS.act4.start}><Act4Turn /></ActPreview>}
      durationInFrames={ACTS.act4.end - ACTS.act4.start}
      fps={FPS}
      width={W}
      height={H}
    />

    <Composition
      id="Close"
      component={() => <ActPreview start={ACTS.close.start}><Close /></ActPreview>}
      durationInFrames={ACTS.close.end - ACTS.close.start}
      fps={FPS}
      width={W}
      height={H}
    />

    {/* Single testimonies - useful for checking Olga reads as competent. */}
    {(["olga", "sergey", "director"] as const).map((which) => (
      <Composition
        key={which}
        id={which.charAt(0).toUpperCase() + which.slice(1)}
        component={SingleTelling}
        durationInFrames={FPS * 8}
        fps={FPS}
        width={W}
        height={H}
        defaultProps={{ which }}
      />
    ))}
  </>
);
