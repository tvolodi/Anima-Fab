import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { ProcessView, colors, layout } from "@anima/core";
import { LifecycleWheel } from "../components/LifecycleWheel";
import { Caption } from "../components/Caption";
import { reseller, buyer } from "../data/processes";
import { at, s } from "../timing";

/**
 * Act 5 - the lifecycle is a loop (concept: lifecycle-is-a-loop-not-a-waterfall).
 *
 * Both diagrams from earlier acts shrink and dock to the center, inert -
 * a visual reminder that everything so far (Acts 1-4) is what gets carried
 * around this cycle. See LifecycleWheel.tsx for why the closing arc must be
 * a separate, deliberate beat.
 */

const resellerLaid = layout(reseller);
const buyerLaid = layout(buyer);

export const Act5Lifecycle: React.FC = () => {
  const frame = useCurrentFrame();

  const dockProgress = interpolate(
    frame,
    [at("act5DiagramsDock"), at("act5DiagramsDock") + s(1.2)],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  const dockScale = interpolate(dockProgress, [0, 1], [0.62, 0.18]);
  const dockOpacity = interpolate(dockProgress, [0, 1], [1, 0.55]);

  return (
    <AbsoluteFill
      style={{
        backgroundColor: colors.BG,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          position: "absolute",
          transform: `translate(-70px, -14px) scale(${dockScale})`,
          opacity: dockOpacity,
        }}
      >
        <ProcessView process={reseller} revealAll />
      </div>
      <div
        style={{
          position: "absolute",
          transform: `translate(70px, 14px) scale(${dockScale})`,
          opacity: dockOpacity,
        }}
      >
        <ProcessView process={buyer} revealAll />
      </div>

      <LifecycleWheel
        nodesInAt={at("act5NodesIn")}
        arcAt={[at("act5Arc1"), at("act5Arc2"), at("act5Arc3")]}
        closingArcAt={at("act5ClosingArc")}
        pulseAt={at("act5RingPulse")}
      />

      <Caption
        text="It doesn't end at Enactment. What you learn goes back to the top."
        appearAt={at("act5Caption")}
        holdFrames={s(4.5)}
      />
    </AbsoluteFill>
  );
};
