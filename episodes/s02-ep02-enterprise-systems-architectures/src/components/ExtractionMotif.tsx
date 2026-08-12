import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { colors, type as typo } from "@anima/core";
import { EXTRACTED_ACCENT } from "../theme";

/**
 * The episode's core visual: a labelled rectangle separates from an origin
 * box and docks beside it, joined by a single thin connector line - the
 * "stable interface" (script's Visual spine). Fires in Acts 1-2 (OS, DBMS,
 * GUI) and reverses in Act 4 (ERP merge).
 *
 * `direction: "extract"` animates origin -> docked box + connector, growing
 * out. `direction: "merge"` animates the reverse: a box that starts already
 * docked collapses back into the origin (used for the Act 4 ERP beat, where
 * three sibling boxes fold into one). One component covers both because the
 * geometry - a box sliding along the dock axis, connector line stretching
 * with it - is identical in both directions; only the interpolation range
 * flips.
 *
 * The box's start-of-extraction position is pinned just outside the origin's
 * own edge (not the origin's center) - starting at the center and animating
 * outward made the box visibly overlap/clip through the origin box for the
 * first third of the animation, which read as broken in a still-frame check.
 */

export type DockSide = "left" | "right" | "top" | "bottom";

const axisSign = (side: DockSide): { x: number; y: number } => {
  switch (side) {
    case "left":
      return { x: -1, y: 0 };
    case "right":
      return { x: 1, y: 0 };
    case "top":
      return { x: 0, y: -1 };
    case "bottom":
      return { x: 0, y: 1 };
  }
};

export const ExtractionMotif: React.FC<{
  origin: { x: number; y: number; w: number; h: number };
  originLabel: string;
  extractedLabel: string;
  extractedSize?: { w: number; h: number };
  dockSide: DockSide;
  dockGap?: number;
  direction: "extract" | "merge";
  progressAt: number;
  progressFrames?: number;
  labelDelayFrames?: number;
  originOpacity?: number;
}> = ({
  origin,
  originLabel,
  extractedLabel,
  extractedSize = { w: 200, h: 110 },
  dockSide,
  dockGap = 130,
  direction,
  progressAt,
  progressFrames = 36,
  labelDelayFrames = 10,
  originOpacity = 1,
}) => {
  const frame = useCurrentFrame();

  const rawProgress = interpolate(
    frame,
    [progressAt, progressAt + progressFrames],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  // extract: 0 = just outside origin, 1 = fully docked.
  // merge: 0 = fully docked (start state), 1 = folded back to just outside origin.
  const dockedT = direction === "extract" ? rawProgress : 1 - rawProgress;

  const originCenter = { x: origin.x + origin.w / 2, y: origin.y + origin.h / 2 };
  const sign = axisSign(dockSide);
  const isHorizontal = dockSide === "left" || dockSide === "right";

  const boxW = extractedSize.w;
  const boxH = extractedSize.h;

  // Distance from origin CENTER to the box center, along the dock axis.
  // "near" = box just touching the origin's edge (box's inner edge flush
  // with origin's edge); "far" = fully docked at dockGap beyond that.
  const halfOriginAxis = isHorizontal ? origin.w / 2 : origin.h / 2;
  const halfBoxAxis = isHorizontal ? boxW / 2 : boxH / 2;
  const nearDist = halfOriginAxis + halfBoxAxis;
  const farDist = halfOriginAxis + dockGap + halfBoxAxis;
  const dist = nearDist + (farDist - nearDist) * dockedT;

  const boxCenter = {
    x: originCenter.x + sign.x * dist,
    y: originCenter.y + sign.y * dist,
  };

  const connectorOpacity = interpolate(dockedT, [0, 0.12], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const boxOpacity = interpolate(dockedT, [0, 0.1], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const labelOpacity = interpolate(
    frame,
    [progressAt + labelDelayFrames, progressAt + labelDelayFrames + 14],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  // Connector runs from the origin's edge (on the dock side) to the box's near edge.
  const originEdge = {
    x: originCenter.x + sign.x * halfOriginAxis,
    y: originCenter.y + sign.y * halfOriginAxis,
  };
  const boxEdge = {
    x: boxCenter.x - sign.x * halfBoxAxis,
    y: boxCenter.y - sign.y * halfBoxAxis,
  };

  return (
    <g>
      <g opacity={originOpacity}>
        <rect
          x={origin.x}
          y={origin.y}
          width={origin.w}
          height={origin.h}
          rx={10}
          fill={colors.SPEAKER.neutral.fill}
          stroke={colors.SPEAKER.neutral.line}
          strokeWidth={2}
        />
        <text
          x={originCenter.x}
          y={originCenter.y}
          fill={colors.SPEAKER.neutral.text}
          fontFamily={typo.FONT_STACK}
          fontSize={20}
          fontWeight={500}
          textAnchor="middle"
          dominantBaseline="central"
        >
          {originLabel}
        </text>
      </g>

      <line
        x1={originEdge.x}
        y1={originEdge.y}
        x2={boxEdge.x}
        y2={boxEdge.y}
        stroke={EXTRACTED_ACCENT}
        strokeWidth={2.5}
        opacity={connectorOpacity}
      />

      <g opacity={boxOpacity}>
        <rect
          x={boxCenter.x - boxW / 2}
          y={boxCenter.y - boxH / 2}
          width={boxW}
          height={boxH}
          rx={10}
          fill={colors.SPEAKER.blue.fill}
          stroke={EXTRACTED_ACCENT}
          strokeWidth={2.5}
        />
        <text
          x={boxCenter.x}
          y={boxCenter.y}
          fill={colors.SPEAKER.blue.text}
          fontFamily={typo.FONT_STACK}
          fontSize={20}
          fontWeight={600}
          textAnchor="middle"
          dominantBaseline="central"
          opacity={labelOpacity}
        >
          {extractedLabel}
        </text>
      </g>
    </g>
  );
};
