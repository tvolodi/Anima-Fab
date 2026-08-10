import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { FitStage, ProcessView, colors, layout, type as typo } from "@anima/core";
import { resolved } from "../data/resolved";
import { at, s } from "../timing";

const LAID = layout(resolved);

/**
 * Close - the finished diagram holds, and the series title appears for the
 * first time in the whole episode.
 */
export const Close: React.FC = () => {
  const frame = useCurrentFrame();

  const titleIn = interpolate(frame, [at("n32"), at("n32") + s(1.2)], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ backgroundColor: colors.BG_WARM }}>
      <FitStage
        contentWidth={LAID.width}
        contentHeight={LAID.height}
        scale={Math.min((1920 - 240 * 2) / LAID.width, 1.15)}
        offsetY={-20}
      >
        <ProcessView process={resolved} revealAll light />
      </FitStage>

      <div
        style={{
          position: "absolute",
          left: 96,
          bottom: 76,
          opacity: titleIn,
          fontFamily: typo.FONT_STACK,
          fontSize: typo.SIZE.speakerRole,
          fontWeight: typo.WEIGHT.semibold,
          letterSpacing: typo.TRACKING.wide,
          textTransform: "uppercase",
          color: "#4A525C",
        }}
      >
        BPM, честно
      </div>
    </AbsoluteFill>
  );
};
