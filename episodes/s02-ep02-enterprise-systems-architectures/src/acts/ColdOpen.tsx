import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { colors, type as typo } from "@anima/core";
import { Caption } from "../components/Caption";
import { at, s } from "../timing";

/**
 * Cold open - a single dense, scribbly blob, deliberately illegible ("too
 * much in one place"). This exact blob shape returns at the top of Act 1
 * labelled "Application" and is what Act 1's extraction peels off of.
 */

const SCRIBBLE_SEED = [
  [-60, -40, 40, -55], [30, -55, 62, 10], [62, 10, 10, 50], [10, 50, -55, 35],
  [-55, 35, -40, -20], [-40, -20, 15, -10], [15, -10, -10, 30], [-10, 30, 45, 25],
  [45, 25, 20, -35], [20, -35, -30, -45], [-30, -45, -5, 5], [-5, 5, 35, 5],
];

export const ColdOpen: React.FC = () => {
  const frame = useCurrentFrame();

  const blobIn = interpolate(
    frame,
    [at("coldOpenBlobIn"), at("coldOpenBlobIn") + s(1.2)],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  const titleAt = at("titleCard");
  const titleOpacity = interpolate(frame, [titleAt, titleAt + s(0.6)], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const restFadesOut = interpolate(frame, [titleAt - s(0.3), titleAt], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: colors.BG,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <svg width={400} height={300} style={{ overflow: "visible", opacity: blobIn * restFadesOut }}>
        <g transform="translate(200, 150)">
          {SCRIBBLE_SEED.map(([x1, y1, x2, y2], i) => (
            <line
              key={i}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke={colors.SPEAKER.neutral.line}
              strokeWidth={3}
              strokeLinecap="round"
              opacity={0.85}
            />
          ))}
        </g>
      </svg>

      <Caption
        text="Everything used to live in one place."
        appearAt={at("coldOpenCaption")}
        holdFrames={s(2)}
        position="lowerThird"
      />

      <div style={{ position: "absolute", textAlign: "center", opacity: titleOpacity }}>
        <div
          style={{
            fontFamily: typo.FONT_STACK,
            fontSize: typo.SIZE.title,
            fontWeight: typo.WEIGHT.semibold,
            color: colors.SPEAKER.neutral.text,
          }}
        >
          The Same Fix, One Level Up
        </div>
        <div
          style={{
            fontFamily: typo.FONT_STACK,
            fontSize: 24,
            fontWeight: 400,
            color: colors.SPEAKER.neutral.line,
            marginTop: 12,
            letterSpacing: "0.04em",
          }}
        >
          Ch. 2 — Evolution of Enterprise Systems Architectures
        </div>
      </div>
    </AbsoluteFill>
  );
};
