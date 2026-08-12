import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { colors, type as typo } from "@anima/core";
import { MARGIN_ACCENT } from "../theme";

/**
 * Fig 2.11's shape: a horizontal band of primary-function boxes above a
 * wider band of support-function boxes, both feeding a Margin wedge at the
 * right edge. Fixed layout, not a flow diagram - nothing in @anima/core does
 * a two-row-plus-wedge static composition (per the script's Implementation
 * Notes: not a node/edge graph, so it should not be built on layout.ts).
 *
 * Parameterizable by box count per row so a future episode's value chain
 * isn't locked to this one's 5-primary/4-support shape.
 */

export interface ValueChainBandProps {
  primaryLabels: string[];
  supportLabels: string[];
  /** 0..1 - each box fades/slides in left to right as this rises. */
  primaryInT: number;
  /** 0..1 - primary boxes gain their fill color as this rises (settle into a connected band). */
  primaryFillT: number;
  /** 0..1 - support band fades in underneath. */
  supportInT: number;
  /** 0..1 - margin wedge + feed lines draw in. */
  marginInT: number;
  /** 0..1 - dotted, unresolved process arrows attempting to connect a few primary boxes. */
  dottedArrowsT: number;
  /** 0..1 - dotted arrows fade toward near-invisible (never fully gone). */
  dottedArrowsFadeT: number;
}

const STAGE_W = 1600;
const STAGE_X = (1920 - STAGE_W) / 2;
const PRIMARY_Y = 300;
const PRIMARY_H = 110;
const SUPPORT_Y = 500;
const SUPPORT_H = 110;
const GAP = 18;
const MARGIN_W = 130;

export const ValueChainBand: React.FC<ValueChainBandProps> = ({
  primaryLabels,
  supportLabels,
  primaryInT,
  primaryFillT,
  supportInT,
  marginInT,
  dottedArrowsT,
  dottedArrowsFadeT,
}) => {
  const bandW = STAGE_W - MARGIN_W - GAP;
  const primaryBoxW = (bandW - GAP * (primaryLabels.length - 1)) / primaryLabels.length;
  const supportBoxW = (bandW - GAP * (supportLabels.length - 1)) / supportLabels.length;

  const primaryBoxX = (i: number) => STAGE_X + i * (primaryBoxW + GAP);
  const supportBoxX = (i: number) => STAGE_X + i * (supportBoxW + GAP);

  const marginX = STAGE_X + bandW + GAP;
  const marginCenterY = PRIMARY_Y + (SUPPORT_Y + SUPPORT_H - PRIMARY_Y) / 2;

  return (
    <svg width={1920} height={1080} style={{ position: "absolute", overflow: "visible" }}>
      {/* Support band - underneath, wider register, fades in after primary settles. */}
      <g opacity={supportInT}>
        {supportLabels.map((label, i) => (
          <g key={label}>
            <rect
              x={supportBoxX(i)}
              y={SUPPORT_Y}
              width={supportBoxW}
              height={SUPPORT_H}
              rx={10}
              fill={colors.SPEAKER.neutral.fill}
              stroke={colors.SPEAKER.neutral.line}
              strokeWidth={1.5}
              opacity={0.85}
            />
            <text
              x={supportBoxX(i) + supportBoxW / 2}
              y={SUPPORT_Y + SUPPORT_H / 2}
              fill={colors.SPEAKER.neutral.text}
              fontFamily={typo.FONT_STACK}
              fontSize={16}
              fontWeight={500}
              textAnchor="middle"
              dominantBaseline="central"
            >
              {label}
            </text>
          </g>
        ))}
        <text
          x={STAGE_X}
          y={SUPPORT_Y - 16}
          fill={colors.SPEAKER.neutral.line}
          fontFamily={typo.FONT_STACK}
          fontSize={15}
          letterSpacing="0.08em"
          opacity={0.7}
        >
          SUPPORT FUNCTIONS
        </text>
      </g>

      {/* Primary band - draws in left to right, then gains a settled fill. */}
      {primaryLabels.map((label, i) => {
        const boxProgress = interpolate(
          primaryInT,
          [i / primaryLabels.length, (i + 0.6) / primaryLabels.length],
          [0, 1],
          { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
        );
        if (boxProgress <= 0.001) return null;
        const fill = interpolate(primaryFillT, [0, 1], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
        return (
          <g key={label} opacity={boxProgress}>
            <rect
              x={primaryBoxX(i)}
              y={PRIMARY_Y}
              width={primaryBoxW}
              height={PRIMARY_H}
              rx={10}
              fill={fill > 0.05 ? colors.SPEAKER.blue.fill : "none"}
              stroke={colors.SPEAKER.blue.line}
              strokeWidth={2}
            />
            <text
              x={primaryBoxX(i) + primaryBoxW / 2}
              y={PRIMARY_Y + PRIMARY_H / 2}
              fill={colors.SPEAKER.blue.text}
              fontFamily={typo.FONT_STACK}
              fontSize={18}
              fontWeight={500}
              textAnchor="middle"
              dominantBaseline="central"
            >
              {label}
            </text>
          </g>
        );
      })}
      <text
        x={STAGE_X}
        y={PRIMARY_Y - 16}
        fill={colors.SPEAKER.blue.line}
        fontFamily={typo.FONT_STACK}
        fontSize={15}
        letterSpacing="0.08em"
        opacity={primaryInT > 0.05 ? 0.85 : 0}
      >
        PRIMARY FUNCTIONS
      </text>

      {/* Margin wedge, fed by thin lines from both bands. */}
      <g opacity={marginInT}>
        <line
          x1={STAGE_X + bandW}
          y1={PRIMARY_Y + PRIMARY_H / 2}
          x2={marginX + 4}
          y2={marginCenterY}
          stroke={MARGIN_ACCENT}
          strokeWidth={2}
          opacity={0.6}
        />
        <line
          x1={STAGE_X + bandW}
          y1={SUPPORT_Y + SUPPORT_H / 2}
          x2={marginX + 4}
          y2={marginCenterY}
          stroke={MARGIN_ACCENT}
          strokeWidth={2}
          opacity={0.6}
        />
        <path
          d={`M ${marginX} ${PRIMARY_Y} L ${marginX + MARGIN_W} ${marginCenterY} L ${marginX} ${SUPPORT_Y + SUPPORT_H} Z`}
          fill={colors.SPEAKER.green.fill}
          stroke={MARGIN_ACCENT}
          strokeWidth={2.5}
        />
        <text
          x={marginX + MARGIN_W * 0.42}
          y={marginCenterY}
          fill={MARGIN_ACCENT}
          fontFamily={typo.FONT_STACK}
          fontSize={18}
          fontWeight={600}
          textAnchor="middle"
          dominantBaseline="central"
          transform={`rotate(90 ${marginX + MARGIN_W * 0.42} ${marginCenterY})`}
        >
          MARGIN
        </text>
      </g>

      {/* Dotted, unresolved process arrows - Inbound Logistics -> Operations,
          Operations -> Outbound Logistics. Deliberately stop partway and fade
          to faint rather than completing or fully vanishing. */}
      {primaryLabels.length >= 3 && (
        <g opacity={Math.max(0.12, 1 - dottedArrowsFadeT * 0.82)}>
          {[0, 1].map((i) => {
            const fromBox = primaryBoxX(i) + primaryBoxW;
            const toBoxFull = primaryBoxX(i + 1);
            const partial = interpolate(dottedArrowsT, [0, 1], [fromBox, fromBox + (toBoxFull - fromBox) * 0.62], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            });
            const y = PRIMARY_Y + PRIMARY_H / 2;
            const drawT = interpolate(dottedArrowsT, [0, 1], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            });
            if (drawT <= 0.001) return null;
            return (
              <line
                key={i}
                x1={fromBox}
                y1={y}
                x2={partial}
                y2={y}
                stroke={colors.SPEAKER.amber.line}
                strokeWidth={2}
                strokeDasharray="6 8"
                opacity={drawT}
              />
            );
          })}
        </g>
      )}
    </svg>
  );
};
