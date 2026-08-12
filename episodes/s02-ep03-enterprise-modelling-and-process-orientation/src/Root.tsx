import React from "react";
import { Composition } from "remotion";
import { Episode } from "./Episode";
import { ActPreview } from "./ActPreview";
import { ColdOpen } from "./acts/ColdOpen";
import { Act1ValueChain } from "./acts/Act1ValueChain";
import { ConnectiveBeat } from "./acts/ConnectiveBeat";
import { Act2Handover } from "./acts/Act2Handover";
import { Act3ProcessLandscape } from "./acts/Act3ProcessLandscape";
import { Close } from "./acts/Close";
import { ACTS, EPISODE_FRAMES, FPS } from "./timing";

const W = 1920;
const H = 1080;

/**
 * `Episode` is the deliverable. Per-act compositions exist so a single act
 * can be previewed/rendered in isolation - like both prior episodes, they
 * read ABSOLUTE frames from timing.ts, so previewing one still needs the
 * whole timeline mounted conceptually; use Episode plus a frame number for
 * anything timing-sensitive across act boundaries.
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
      defaultProps={{ lang: "ru" }}
    />

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
      component={() => <ActPreview start={ACTS.act1.start}><Act1ValueChain /></ActPreview>}
      durationInFrames={ACTS.act1.end - ACTS.act1.start}
      fps={FPS} width={W} height={H}
    />
    <Composition
      id="Connective"
      component={() => <ActPreview start={ACTS.connective.start}><ConnectiveBeat /></ActPreview>}
      durationInFrames={ACTS.connective.end - ACTS.connective.start}
      fps={FPS} width={W} height={H}
    />
    <Composition
      id="Act2"
      component={() => <ActPreview start={ACTS.act2.start}><Act2Handover /></ActPreview>}
      durationInFrames={ACTS.act2.end - ACTS.act2.start}
      fps={FPS} width={W} height={H}
    />
    <Composition
      id="Act3"
      component={() => <ActPreview start={ACTS.act3.start}><Act3ProcessLandscape /></ActPreview>}
      durationInFrames={ACTS.act3.end - ACTS.act3.start}
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
