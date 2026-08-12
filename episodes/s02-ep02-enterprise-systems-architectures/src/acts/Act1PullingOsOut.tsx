import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { colors, type as typo } from "@anima/core";
import { Caption } from "../components/Caption";
import { ExtractionMotif } from "../components/ExtractionMotif";
import { at, s } from "../timing";

/**
 * Act 1 - pulling the OS out. Defines the extraction motif every later act
 * reuses: origin box shrinks/simplifies as a labelled rectangle peels off
 * and docks beside it on a single thin connector line.
 */

const BLOB_LINES_FULL = [
  [-60, -40, 40, -55], [30, -55, 62, 10], [62, 10, 10, 50], [10, 50, -55, 35],
  [-55, 35, -40, -20], [-40, -20, 15, -10], [15, -10, -10, 30], [-10, 30, 45, 25],
  [45, 25, 20, -35], [20, -35, -30, -45], [-30, -45, -5, 5], [-5, 5, 35, 5],
];

const ORIGIN = { x: 760, y: 420, w: 260, h: 220 };

export const Act1PullingOsOut: React.FC = () => {
  const frame = useCurrentFrame();

  const blobReturn = interpolate(
    frame,
    [at("act1BlobReturn"), at("act1BlobReturn") + s(0.8)],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  // A few scribble-lines vanish as the OS leaves, visually simplifying the blob.
  const shrinkT = interpolate(
    frame,
    [at("act1Extract"), at("act1Extract") + s(1.2)],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  const visibleLineCount = Math.round(
    BLOB_LINES_FULL.length - shrinkT * 4,
  );

  return (
    <AbsoluteFill style={{ backgroundColor: colors.BG }}>
      <svg width={1920} height={1080} style={{ position: "absolute", overflow: "visible" }}>
        <g opacity={blobReturn}>
          {/* Persistent boundary - without this, once every scribble-line
              extracts away (Act 2 empties the last one) nothing marks where
              "business logic" still lives. The scribble was never bounded on
              its own; this rect is the origin's actual container. */}
          <rect
            x={ORIGIN.x}
            y={ORIGIN.y}
            width={ORIGIN.w}
            height={ORIGIN.h}
            rx={10}
            fill="none"
            stroke={colors.SPEAKER.neutral.line}
            strokeWidth={1.5}
            opacity={0.35}
          />
          <text
            x={ORIGIN.x + ORIGIN.w / 2}
            y={ORIGIN.y - 22}
            fill={colors.SPEAKER.neutral.line}
            fontFamily={typo.FONT_STACK}
            fontSize={16}
            letterSpacing="0.05em"
            textAnchor="middle"
            opacity={0.75}
          >
            APPLICATION
          </text>
          <g transform={`translate(${ORIGIN.x + ORIGIN.w / 2}, ${ORIGIN.y + ORIGIN.h / 2})`}>
            {BLOB_LINES_FULL.slice(0, visibleLineCount).map(([x1, y1, x2, y2], i) => (
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
        </g>

        <ExtractionMotif
          origin={ORIGIN}
          originLabel=""
          extractedLabel="OS"
          dockSide="left"
          dockGap={130}
          direction="extract"
          progressAt={at("act1Extract")}
          progressFrames={s(1.6)}
          originOpacity={0}
        />
      </svg>

      <Caption
        text="Every application talked to the hardware itself."
        appearAt={at("act1Caption1")}
        holdFrames={s(2.5)}
      />
      <Caption
        text="One job, pulled out. One stable line back in."
        appearAt={at("act1Caption2")}
        holdFrames={s(3)}
      />
    </AbsoluteFill>
  );
};
