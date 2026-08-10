import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { colors, type as typo } from "@anima/core";
import { EMPHASIS } from "../theme";

/**
 * The business process lifecycle (script Act 5 / concept card
 * lifecycle-is-a-loop-not-a-waterfall).
 *
 * Four phases at N/E/S/W, drawn as three sequential arcs first (Design->
 * Configuration->Enactment->Evaluation), matching the naive "it's a pipeline"
 * reading. THEN a fourth, visually distinct arc closes Evaluation back to
 * Design. That closing arc is the entire point of the act - if the ring were
 * drawn whole from frame 1, the loop would never register as a discovery. Do
 * not "simplify" this into one static circle.
 *
 * A fifth, always-on outer ring represents Administration & Stakeholders,
 * which the book explicitly treats as a continuous band rather than a step in
 * the sequence.
 */

const PHASES = [
  { id: "design", label: "Design & Analysis", angle: -90 },
  { id: "config", label: "Configuration", angle: 0 },
  { id: "enact", label: "Enactment", angle: 90 },
  { id: "evaluate", label: "Evaluation", angle: 180 },
] as const;

const R = 240;
const OUTER_R = R + 74;
const CENTER = { x: R + 90, y: R + 90 };

const polar = (angleDeg: number, radius: number) => {
  const a = (angleDeg * Math.PI) / 180;
  return { x: CENTER.x + Math.cos(a) * radius, y: CENTER.y + Math.sin(a) * radius };
};

/** SVG arc path between two angles (degrees) along the phase ring, going clockwise. */
const arcPath = (fromDeg: number, toDeg: number, radius: number): string => {
  let end = toDeg;
  while (end <= fromDeg) end += 360;
  const from = polar(fromDeg, radius);
  const to = polar(end, radius);
  const largeArc = end - fromDeg > 180 ? 1 : 0;
  return `M ${from.x} ${from.y} A ${radius} ${radius} 0 ${largeArc} 1 ${to.x} ${to.y}`;
};

const ARC_GAP = 8; // degrees trimmed off each end so arcs don't touch the node dots

export const LifecycleWheel: React.FC<{
  /** Frame at which node dots + labels appear. */
  nodesInAt: number;
  /** Frame at which each sequential arc (design->config, config->enact, enact->evaluate) starts drawing. */
  arcAt: [number, number, number];
  /** Frame at which the closing evaluate->design arc starts drawing. */
  closingArcAt: number;
  /** Frame at which the full ring does one gentle pulse. */
  pulseAt?: number;
  opacity?: number;
}> = ({ nodesInAt, arcAt, closingArcAt, pulseAt, opacity = 1 }) => {
  const frame = useCurrentFrame();
  const ARC_DRAW_FRAMES = 18;

  const nodesOpacity = interpolate(frame, [nodesInAt, nodesInAt + 14], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const sequentialArcs = [
    { from: PHASES[0].angle, to: PHASES[1].angle, startAt: arcAt[0] },
    { from: PHASES[1].angle, to: PHASES[2].angle, startAt: arcAt[1] },
    { from: PHASES[2].angle, to: PHASES[3].angle, startAt: arcAt[2] },
  ];

  const pulse =
    pulseAt !== undefined
      ? interpolate(
          frame,
          [pulseAt, pulseAt + 20, pulseAt + 40],
          [1, 1.035, 1],
          { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
        )
      : 1;

  const closingProgress = interpolate(
    frame,
    [closingArcAt, closingArcAt + ARC_DRAW_FRAMES],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  return (
    <svg
      width={CENTER.x * 2}
      height={CENTER.y * 2}
      style={{ overflow: "visible", opacity, transform: `scale(${pulse})` }}
    >
      {/* Administration & Stakeholders - always-on outer ring, not a phase. */}
      <circle
        cx={CENTER.x}
        cy={CENTER.y}
        r={OUTER_R}
        fill="none"
        stroke={colors.SPEAKER.neutral.line}
        strokeWidth={1.5}
        strokeDasharray="2 8"
        opacity={0.35 * nodesOpacity}
      />
      <text
        x={CENTER.x}
        y={CENTER.y - OUTER_R - 18}
        fill={colors.SPEAKER.neutral.line}
        fontFamily={typo.FONT_STACK}
        fontSize={17}
        letterSpacing="0.06em"
        textAnchor="middle"
        opacity={0.6 * nodesOpacity}
      >
        ADMINISTRATION &amp; STAKEHOLDERS
      </text>

      {/* Sequential arcs: Design -> Config -> Enact -> Evaluate. */}
      {sequentialArcs.map((arc, i) => {
        const progress = interpolate(
          frame,
          [arc.startAt, arc.startAt + ARC_DRAW_FRAMES],
          [0, 1],
          { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
        );
        if (progress <= 0) return null;
        const sweepEnd = arc.to < arc.from ? arc.to + 360 : arc.to;
        const animatedTo =
          arc.from + (sweepEnd - arc.from - ARC_GAP * 2) * progress + ARC_GAP;
        return (
          <path
            key={i}
            d={arcPath(arc.from + ARC_GAP, animatedTo, R)}
            fill="none"
            stroke={colors.SPEAKER.blue.line}
            strokeWidth={4}
            strokeLinecap="round"
          />
        );
      })}

      {/* The closing arc: Evaluation -> back to Design. Visually distinct -
          thicker, warmer color - because this is the one edge that makes the
          shape a LOOP instead of a pipeline. */}
      {closingProgress > 0 && (
        <path
          d={arcPath(
            PHASES[3].angle + ARC_GAP,
            PHASES[3].angle +
              ARC_GAP +
              (360 - PHASES[3].angle - ARC_GAP * 2) * closingProgress,
            R,
          )}
          fill="none"
          stroke={EMPHASIS}
          strokeWidth={6}
          strokeLinecap="round"
        />
      )}

      {/* Phase nodes. */}
      {PHASES.map((p) => {
        const pos = polar(p.angle, R);
        const labelPos = polar(p.angle, R + 46);
        return (
          <g key={p.id} opacity={nodesOpacity}>
            <circle cx={pos.x} cy={pos.y} r={14} fill={colors.SPEAKER.blue.fill} stroke={colors.SPEAKER.blue.line} strokeWidth={2.5} />
            <text
              x={labelPos.x}
              y={labelPos.y}
              fill={colors.SPEAKER.neutral.text}
              fontFamily={typo.FONT_STACK}
              fontSize={22}
              fontWeight={500}
              textAnchor="middle"
              dominantBaseline="middle"
            >
              {p.label}
            </text>
          </g>
        );
      })}
    </svg>
  );
};
