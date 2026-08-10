import React from "react";
import { Composition } from "remotion";
import { Episode } from "./Episode";
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
 * can be previewed or rendered in isolation - they read ABSOLUTE frames from
 * timing.ts, so previewing one still needs the whole timeline mounted. Use
 * Episode plus a frame number for anything timing-sensitive.
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
      component={ColdOpen}
      durationInFrames={ACTS.coldOpen.end}
      fps={FPS}
      width={W}
      height={H}
    />

    <Composition
      id="Act1"
      component={Act1Testimonies}
      durationInFrames={ACTS.fourth.end}
      fps={FPS}
      width={W}
      height={H}
    />

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
      component={Act3Cost}
      durationInFrames={ACTS.act3.end}
      fps={FPS}
      width={W}
      height={H}
    />

    <Composition
      id="Act4"
      component={Act4Turn}
      durationInFrames={ACTS.act4.end}
      fps={FPS}
      width={W}
      height={H}
    />

    <Composition
      id="Close"
      component={Close}
      durationInFrames={ACTS.close.end}
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
