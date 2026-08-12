import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { Token, colors, type as typo } from "@anima/core";

/**
 * A labelled system box (HR / Purchasing / ERP / SCM / CRM...) holding one
 * `Token` from @anima/core, used as-is per the script's Implementation
 * notes ("Token's existing mood/pulse API is flexible enough" - checked
 * against Token.tsx: "waiting" mood breathes on its own sine curve keyed off
 * useCurrentFrame(), so two Tokens with no shared phase offset already read
 * as desynced, and nothing extra was needed to fake that).
 *
 * `pulseAt` triggers a one-shot scale pulse (Acts 3/5's desync beat, Act 4's
 * clean single-pulse payoff) on top of Token's own idle animation.
 */
export const SystemBoxToken: React.FC<{
  x: number;
  y: number;
  w: number;
  h: number;
  label: string;
  tokenLabel?: string;
  opacity?: number;
  pulseAt?: number;
  tokenColor?: string;
  highlightColor?: string;
}> = ({
  x,
  y,
  w,
  h,
  label,
  tokenLabel = "customer",
  opacity = 1,
  pulseAt,
  tokenColor,
  highlightColor,
}) => {
  const frame = useCurrentFrame();
  const cx = x + w / 2;
  const tokenY = y + h / 2 - 8;

  const pulseScale =
    pulseAt !== undefined
      ? interpolate(
          frame,
          [pulseAt, pulseAt + 8, pulseAt + 18],
          [1, 1.45, 1],
          { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
        )
      : 1;

  const colorFlash =
    pulseAt !== undefined && highlightColor
      ? interpolate(frame, [pulseAt, pulseAt + 8, pulseAt + 24], [0, 1, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        })
      : 0;

  return (
    <g opacity={opacity}>
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        rx={10}
        fill={colors.SPEAKER.neutral.fill}
        stroke={colors.SPEAKER.neutral.line}
        strokeWidth={2}
      />
      <text
        x={cx}
        y={y + 26}
        fill={colors.SPEAKER.neutral.text}
        fontFamily={typo.FONT_STACK}
        fontSize={20}
        fontWeight={500}
        textAnchor="middle"
      >
        {label}
      </text>

      <g transform={`translate(${cx}, ${tokenY}) scale(${pulseScale}) translate(${-cx}, ${-tokenY})`}>
        <Token x={cx} y={tokenY} r={16} mood="waiting" color={tokenColor} />
      </g>
      {colorFlash > 0 && (
        <circle
          cx={cx}
          cy={tokenY}
          r={16}
          fill="none"
          stroke={highlightColor}
          strokeWidth={3}
          opacity={colorFlash}
        />
      )}

      <text
        x={cx}
        y={tokenY + 34}
        fill={colors.SPEAKER.neutral.line}
        fontFamily={typo.FONT_STACK}
        fontSize={14}
        textAnchor="middle"
      >
        {tokenLabel}
      </text>
    </g>
  );
};
