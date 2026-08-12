import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { colors, type as typo } from "@anima/core";
import { EXTRACTED_ACCENT } from "../theme";

/**
 * Acts 6-7's shared geometry: N boxes on a circle, then either (a) every
 * pairwise line drawn directly (point-to-point) or (b) every line retracted
 * into spokes running to one central hub.
 *
 * Nothing in @anima/core/process/layout.ts does all-pairs or hub-and-spoke
 * routing (it lays out BPMN node/edge graphs, not a complete graph on a
 * ring) - this is new geometry, per the script's Implementation notes
 * flagging it as the episode's biggest build risk.
 *
 * Boxes sit on a circle so every one of the N*(N-1)/2 chords is a distinct,
 * separated line - no two pairwise lines overlap the way they would if
 * boxes sat on a grid or a single row. For N=6 that's the 15 lines the
 * script's Act 6 count-up counts to. Order matters for legibility: boxes are
 * placed in circle order so only true "long diagonals" cross near the
 * center, keeping the ring's outer chords readable even before they
 * retract.
 */

export interface MeshBox {
  label: string;
}

const RADIUS = 320;
const BOX_W = 220;
const BOX_H = 90;
// y sits above true screen-center: the bottom box's lower edge (CENTER.y +
// RADIUS + BOX_H/2) must clear the lower-third Caption band (bottom:140,
// i.e. starting around y=930) with margin, or captions and the Warehouse/CRM
// box collide - a real overlap caught in an Act 7 still-frame check.
const CENTER = { x: 960, y: 500 };
const HUB_R = 65;

export const meshBoxPosition = (index: number, total: number) => {
  // Start at the top (-90deg) and go clockwise so the six boxes read
  // top, upper-right, lower-right, bottom, lower-left, upper-left.
  const angle = -Math.PI / 2 + (index / total) * Math.PI * 2;
  return {
    x: CENTER.x + Math.cos(angle) * RADIUS,
    y: CENTER.y + Math.sin(angle) * RADIUS,
    angle,
  };
};

/** All pairwise index combinations, in a stable draw order (nearest neighbors first, then the longer diagonals) so the count-up feels like it's filling the ring before crossing it. */
export const allPairs = (n: number): Array<[number, number]> => {
  const pairs: Array<[number, number]> = [];
  for (let gap = 1; gap <= Math.floor(n / 2); gap++) {
    for (let i = 0; i < n; i++) {
      const j = (i + gap) % n;
      if (gap === n / 2 && j < i) continue; // avoid duplicate opposite-pair when n is even
      const pair: [number, number] = i < j ? [i, j] : [j, i];
      if (!pairs.some(([a, b]) => a === pair[0] && b === pair[1])) {
        pairs.push(pair);
      }
    }
  }
  return pairs;
};

export const MeshHub: React.FC<{
  boxes: MeshBox[];
  boxesInAt: number;
  mode: "mesh" | "hub";
  /** Mesh mode: frame each successive line lands (used with lineIndex driving opacity externally is possible, but simplest is linesStart+linesEnd window). */
  linesStartAt?: number;
  linesEndAt?: number;
  /** Hub mode: when spokes finish retracting from the full mesh. */
  retractAt?: number;
  retractFrames?: number;
  hubLabel?: string;
  /** Lets a caller (Act 7's rules-tangle beat) dim the "HUB" text so an
   * inner tangle drawn at the same center doesn't overlap the label. */
  hubLabelOpacity?: number;
}> = ({
  boxes,
  boxesInAt,
  mode,
  linesStartAt = 0,
  linesEndAt = 0,
  retractAt = 0,
  retractFrames = 40,
  hubLabel = "HUB",
  hubLabelOpacity = 1,
}) => {
  const frame = useCurrentFrame();
  const n = boxes.length;
  const positions = boxes.map((_, i) => meshBoxPosition(i, n));
  const pairs = allPairs(n);

  const boxesOpacity = interpolate(frame, [boxesInAt, boxesInAt + 20], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const linesProgress =
    mode === "mesh"
      ? interpolate(frame, [linesStartAt, linesEndAt], [0, pairs.length], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        })
      : pairs.length;

  const retractT =
    mode === "hub"
      ? interpolate(frame, [retractAt, retractAt + retractFrames], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        })
      : 0;

  const hubOpacity =
    mode === "hub"
      ? interpolate(frame, [retractAt, retractAt + retractFrames * 0.6], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        })
      : 0;

  return (
    <svg width={1920} height={1080} style={{ position: "absolute", overflow: "visible" }}>
      {mode === "mesh" &&
        pairs.map(([a, b], i) => {
          const on = linesProgress >= i + 1;
          if (!on) return null;
          const justLanded = linesProgress < i + 1.3;
          const pa = positions[a]!;
          const pb = positions[b]!;
          return (
            <line
              key={`${a}-${b}`}
              x1={pa.x}
              y1={pa.y}
              x2={pb.x}
              y2={pb.y}
              stroke={EXTRACTED_ACCENT}
              strokeWidth={justLanded ? 3 : 1.6}
              opacity={justLanded ? 0.95 : 0.55}
            />
          );
        })}

      {mode === "hub" &&
        pairs.map(([a, b], i) => {
          const pa = positions[a]!;
          const pb = positions[b]!;
          const x1 = pa.x + (CENTER.x - pa.x) * 0; // stays anchored at box
          const y1 = pa.y + (CENTER.y - pa.y) * 0;
          const x2 = pb.x + (CENTER.x - pb.x) * retractT;
          const y2 = pb.y + (CENTER.y - pb.y) * retractT;
          const opacity = interpolate(retractT, [0, 0.85, 1], [0.55, 0.35, 0], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });
          if (opacity <= 0.001) return null;
          return (
            <line
              key={`retract-${a}-${b}`}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke={EXTRACTED_ACCENT}
              strokeWidth={1.4}
              opacity={opacity}
            />
          );
        })}

      {mode === "hub" &&
        positions.map((p, i) => {
          const spokeOpacity = interpolate(retractT, [0.1, 0.5], [0, 0.85], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });
          return (
            <line
              key={`spoke-${i}`}
              x1={p.x}
              y1={p.y}
              x2={CENTER.x}
              y2={CENTER.y}
              stroke={EXTRACTED_ACCENT}
              strokeWidth={2.5}
              opacity={spokeOpacity}
            />
          );
        })}

      {mode === "hub" && (
        <g opacity={hubOpacity}>
          <circle cx={CENTER.x} cy={CENTER.y} r={HUB_R} fill={colors.SPEAKER.blue.fill} stroke={EXTRACTED_ACCENT} strokeWidth={3} />
          <text
            x={CENTER.x}
            y={CENTER.y}
            fill={colors.SPEAKER.blue.text}
            fontFamily={typo.FONT_STACK}
            fontSize={18}
            fontWeight={600}
            textAnchor="middle"
            dominantBaseline="central"
            opacity={hubLabelOpacity}
          >
            {hubLabel}
          </text>
        </g>
      )}

      <g opacity={boxesOpacity}>
        {positions.map((p, i) => (
          <g key={i}>
            <rect
              x={p.x - BOX_W / 2}
              y={p.y - BOX_H / 2}
              width={BOX_W}
              height={BOX_H}
              rx={10}
              fill={colors.SPEAKER.neutral.fill}
              stroke={colors.SPEAKER.neutral.line}
              strokeWidth={2}
            />
            <text
              x={p.x}
              y={p.y}
              fill={colors.SPEAKER.neutral.text}
              fontFamily={typo.FONT_STACK}
              fontSize={20}
              fontWeight={500}
              textAnchor="middle"
              dominantBaseline="central"
            >
              {boxes[i]!.label}
            </text>
          </g>
        ))}
      </g>
    </svg>
  );
};
