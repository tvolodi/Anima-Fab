import React from "react";
import { Composition } from "remotion";
import { Episode } from "./Episode";
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

    <Composition id="ColdOpen" component={ColdOpen} durationInFrames={ACTS.act1.start} fps={FPS} width={W} height={H} />
    <Composition id="Act1" component={Act1Coordination} durationInFrames={ACTS.act1.end} fps={FPS} width={W} height={H} />
    <Composition id="Act2" component={Act2ModelInstance} durationInFrames={ACTS.act2.end} fps={FPS} width={W} height={H} />
    <Composition id="Act3" component={Act3Orchestration} durationInFrames={ACTS.act3.end} fps={FPS} width={W} height={H} />
    <Composition id="Act4" component={Act4StableInterface} durationInFrames={ACTS.act4.end} fps={FPS} width={W} height={H} />
    <Composition id="Act5" component={Act5Lifecycle} durationInFrames={ACTS.act5.end} fps={FPS} width={W} height={H} />
    <Composition id="Act6" component={Act6Classification} durationInFrames={ACTS.act6.end} fps={FPS} width={W} height={H} />
    <Composition id="Close" component={Close} durationInFrames={EPISODE_FRAMES} fps={FPS} width={W} height={H} />
  </>
);
