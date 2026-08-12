import React from "react";
import { Composition } from "remotion";
import { Episode } from "./Episode";
import { ActPreview } from "./ActPreview";
import { ColdOpen } from "./acts/ColdOpen";
import { Act1PullingOsOut } from "./acts/Act1PullingOsOut";
import { Act2DbmsAndGui } from "./acts/Act2DbmsAndGui";
import { Act3TheBlobGrowsBack } from "./acts/Act3TheBlobGrowsBack";
import { Act4Erp } from "./acts/Act4Erp";
import { Act5ScmCrmSiloAgain } from "./acts/Act5ScmCrmSiloAgain";
import { Act6PointToPointMesh } from "./acts/Act6PointToPointMesh";
import { Act7HubAndSpoke } from "./acts/Act7HubAndSpoke";
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
      component={() => <ActPreview start={ACTS.act1.start}><Act1PullingOsOut /></ActPreview>}
      durationInFrames={ACTS.act1.end - ACTS.act1.start}
      fps={FPS} width={W} height={H}
    />
    <Composition
      id="Act2"
      component={() => <ActPreview start={ACTS.act2.start}><Act2DbmsAndGui /></ActPreview>}
      durationInFrames={ACTS.act2.end - ACTS.act2.start}
      fps={FPS} width={W} height={H}
    />
    <Composition
      id="Act3"
      component={() => <ActPreview start={ACTS.act3.start}><Act3TheBlobGrowsBack /></ActPreview>}
      durationInFrames={ACTS.act3.end - ACTS.act3.start}
      fps={FPS} width={W} height={H}
    />
    <Composition
      id="Act4"
      component={() => <ActPreview start={ACTS.act4.start}><Act4Erp /></ActPreview>}
      durationInFrames={ACTS.act4.end - ACTS.act4.start}
      fps={FPS} width={W} height={H}
    />
    <Composition
      id="Act5"
      component={() => <ActPreview start={ACTS.act5.start}><Act5ScmCrmSiloAgain /></ActPreview>}
      durationInFrames={ACTS.act5.end - ACTS.act5.start}
      fps={FPS} width={W} height={H}
    />
    <Composition
      id="Act6"
      component={() => <ActPreview start={ACTS.act6.start}><Act6PointToPointMesh /></ActPreview>}
      durationInFrames={ACTS.act6.end - ACTS.act6.start}
      fps={FPS} width={W} height={H}
    />
    <Composition
      id="Act7"
      component={() => <ActPreview start={ACTS.act7.start}><Act7HubAndSpoke /></ActPreview>}
      durationInFrames={ACTS.act7.end - ACTS.act7.start}
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
