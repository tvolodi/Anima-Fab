import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { colors, type as typo } from "@anima/core";

/**
 * One classification axis (script Act 6 / concept card
 * classification-axes-are-independent): a labelled track with two dots.
 *
 * The script's hard constraint: when a case's dots land, all three axes must
 * commit in the SAME beat, not one at a time - sequential landing reads as a
 * checklist again, undoing Act 1's whole point. This component only draws one
 * track; Act6 is responsible for firing all three AxisSlider instances off
 * the same `dotAt` frame.
 */

const TRACK_W = 900;

export interface AxisCase {
  label: string;
  /** 0 = left end of axis, 1 = right end. */
  position: number;
  color: "blue" | "green";
  dotAt: number;
}

export const AxisSlider: React.FC<{
  leftLabel: string;
  rightLabel: string;
  cases: AxisCase[];
  tracksInAt: number;
  y: number;
}> = ({ leftLabel, rightLabel, cases, tracksInAt, y }) => {
  const frame = useCurrentFrame();
  const trackOpacity = interpolate(frame, [tracksInAt, tracksInAt + 14], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div style={{ position: "absolute", top: y, left: "50%", transform: "translateX(-50%)" }}>
      <svg width={TRACK_W + 220} height={70} style={{ overflow: "visible" }}>
        <text
          x={0}
          y={12}
          fill={colors.SPEAKER.neutral.line}
          fontFamily={typo.FONT_STACK}
          fontSize={19}
          textAnchor="start"
          opacity={trackOpacity}
        >
          {leftLabel}
        </text>
        <text
          x={220 + TRACK_W}
          y={12}
          fill={colors.SPEAKER.neutral.line}
          fontFamily={typo.FONT_STACK}
          fontSize={19}
          textAnchor="end"
          opacity={trackOpacity}
        >
          {rightLabel}
        </text>
        <line
          x1={110}
          y1={4}
          x2={110 + TRACK_W}
          y2={4}
          stroke={colors.SPEAKER.neutral.line}
          strokeWidth={2}
          opacity={trackOpacity * 0.5}
        />

        {cases.map((c, i) => {
          const dropIn = interpolate(
            frame,
            [c.dotAt, c.dotAt + 9],
            [-26, 0],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
          );
          const dotOpacity = interpolate(frame, [c.dotAt, c.dotAt + 9], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });
          if (dotOpacity <= 0.001) return null;
          const cx = 110 + TRACK_W * c.position;
          const palette = colors.SPEAKER[c.color];
          return (
            <g key={i} opacity={dotOpacity} transform={`translate(0, ${dropIn})`}>
              <circle cx={cx} cy={4} r={11} fill={palette.fill} stroke={palette.line} strokeWidth={2.5} />
              <text
                x={cx}
                y={i === 0 ? -18 : 38}
                fill={palette.text}
                fontFamily={typo.FONT_STACK}
                fontSize={16}
                textAnchor="middle"
              >
                {c.label}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
};
