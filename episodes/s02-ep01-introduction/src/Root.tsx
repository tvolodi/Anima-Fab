import React from "react";
import { Composition } from "remotion";
import { Episode } from "./Episode";
import { ActPreview } from "./ActPreview";
import { ColdOpen } from "./acts/ColdOpen";
import { Act1Coordination } from "./acts/Act1Coordination";
import { Act2ModelInstance } from "./acts/Act2ModelInstance";
import { Act3Orchestration } from "./acts/Act3Orchestration";
import { Act4StableInterface } from "./acts/Act4StableInterface";
import { Act5Lifecycle } from "./acts/Act5Lifecycle";
import { Act6Classification } from "./acts/Act6Classification";
import { Close } from "./acts/Close";
import { ACTS, EPISODE_FRAMES, FPS } from "./timing";

const W = 1920;
const H = 1080;

/**
 * `Episode` is the deliverable. Per-act compositions exist so a single act
 * can be previewed/rendered in isolation - like ep01, they read ABSOLUTE
 * frames from timing.ts, so previewing one still needs the whole timeline
 * mounted conceptually; use Episode plus a frame number for anything
 * timing-sensitive across act boundaries.
 */
export const RemotionRoot: React.FC = () => (
  <>
    <Composition id="Episode" component={Episode} durationInFrames={EPISODE_FRAMES} fps={FPS} width={W} height={H} />

    {/* Per-act compositions: local duration (end - start), wrapped in
        ActPreview so scrubbing from local frame 0 shows the act's REAL
        first frame instead of frame 0 of the whole episode. Without this,
        every interpolation keyed to an absolute cue frame reads a frame
        number far outside its intended range - see ActPreview.tsx. */}
    <Composition
      id="ColdOpen"
      component={() => <ActPreview start={ACTS.coldOpen.start}><ColdOpen /></ActPreview>}
      durationInFrames={ACTS.coldOpen.end - ACTS.coldOpen.start}
      fps={FPS} width={W} height={H}
    />
    <Composition
      id="Act1"
      component={() => <ActPreview start={ACTS.act1.start}><Act1Coordination /></ActPreview>}
      durationInFrames={ACTS.act1.end - ACTS.act1.start}
      fps={FPS} width={W} height={H}
    />
    <Composition
      id="Act2"
      component={() => <ActPreview start={ACTS.act2.start}><Act2ModelInstance /></ActPreview>}
      durationInFrames={ACTS.act2.end - ACTS.act2.start}
      fps={FPS} width={W} height={H}
    />
    <Composition
      id="Act3"
      component={() => <ActPreview start={ACTS.act3.start}><Act3Orchestration /></ActPreview>}
      durationInFrames={ACTS.act3.end - ACTS.act3.start}
      fps={FPS} width={W} height={H}
    />
    <Composition
      id="Act4"
      component={() => <ActPreview start={ACTS.act4.start}><Act4StableInterface /></ActPreview>}
      durationInFrames={ACTS.act4.end - ACTS.act4.start}
      fps={FPS} width={W} height={H}
    />
    <Composition
      id="Act5"
      component={() => <ActPreview start={ACTS.act5.start}><Act5Lifecycle /></ActPreview>}
      durationInFrames={ACTS.act5.end - ACTS.act5.start}
      fps={FPS} width={W} height={H}
    />
    <Composition
      id="Act6"
      component={() => <ActPreview start={ACTS.act6.start}><Act6Classification /></ActPreview>}
      durationInFrames={ACTS.act6.end - ACTS.act6.start}
      fps={FPS} width={W} height={H}
    />
    <Composition
      id="Close"
      component={() => <ActPreview start={ACTS.close.start}><Close /></ActPreview>}
      durationInFrames={ACTS.close.end - ACTS.close.start}
      fps={FPS} width={W} height={H}
    />
  </>
);
