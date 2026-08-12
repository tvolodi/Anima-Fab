import React from "react";
import { interpolate } from "remotion";
import { colors, type as typo } from "@anima/core";

/**
 * The Fig 2.13 forms shape: an opaque block that pulls forward, enlarges,
 * and flips to reveal a name/manager/scope/inputs/outputs/supplier-customer
 * card - then flips back to opaque. Built to dock into a landscape diagram
 * (ProcessLandscape) both before and after, per the script's note that this
 * may be reused if a future episode revisits the process-landscape idea at
 * the operational level.
 *
 * `openT` drives the whole beat: 0 = fully opaque block at its landscape
 * position/size, 1 = fully open card at center-stage. The card closes back
 * to opaque by driving openT back down - the closing is as important as the
 * opening (script's own note), so this is symmetric, not a one-way reveal.
 */

export interface ProcessCardFields {
  name: string;
  manager: string;
  scope: string;
  inputs: string[];
  supplierProcesses: string[];
  customerProcesses: string[];
}

export const ProcessCard: React.FC<{
  fields: ProcessCardFields;
  /** Block's position/size when opaque (docked in the landscape). */
  blockX: number;
  blockY: number;
  blockW: number;
  blockH: number;
  /** 0 (opaque block) -> 1 (open card, center stage). */
  openT: number;
}> = ({ fields, blockX, blockY, blockW, blockH, openT }) => {
  const cardW = 720;
  const cardH = 460;
  const cardX = 1920 / 2 - cardW / 2;
  const cardY = 1080 / 2 - cardH / 2;

  const x = interpolate(openT, [0, 1], [blockX, cardX]);
  const y = interpolate(openT, [0, 1], [blockY, cardY]);
  const w = interpolate(openT, [0, 1], [blockW, cardW]);
  const h = interpolate(openT, [0, 1], [blockH, cardH]);

  // Interior form content only readable once mostly open.
  const contentOpacity = interpolate(openT, [0.72, 1], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const blockLabelOpacity = interpolate(openT, [0, 0.25], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const rows: Array<[string, string]> = [
    ["Manager", fields.manager],
    ["Scope", fields.scope],
    ["Inputs", fields.inputs.join(", ")],
    ["Supplier processes", fields.supplierProcesses.join(", ")],
    ["Customer processes", fields.customerProcesses.join(", ")],
  ];

  return (
    <g>
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        rx={interpolate(openT, [0, 1], [10, 16])}
        fill={colors.SPEAKER.neutral.fill}
        stroke={colors.SPEAKER.neutral.line}
        strokeWidth={interpolate(openT, [0, 1], [2, 2.5])}
      />

      {/* Opaque-block label, visible only while mostly closed. */}
      <text
        x={x + w / 2}
        y={y + h / 2}
        fill={colors.SPEAKER.neutral.text}
        fontFamily={typo.FONT_STACK}
        fontSize={20}
        fontWeight={500}
        textAnchor="middle"
        dominantBaseline="central"
        opacity={blockLabelOpacity}
      >
        {fields.name}
      </text>

      {/* Open-card content, only visible once mostly open. */}
      <g opacity={contentOpacity}>
        <text
          x={x + 40}
          y={y + 52}
          fill={colors.SPEAKER.neutral.text}
          fontFamily={typo.FONT_STACK}
          fontSize={26}
          fontWeight={600}
          dominantBaseline="hanging"
        >
          {fields.name}
        </text>
        {rows.map(([label, value], i) => (
          <g key={label} transform={`translate(${x + 40}, ${y + 100 + i * 66})`}>
            <text
              fill={colors.SPEAKER.neutral.line}
              fontFamily={typo.FONT_STACK}
              fontSize={14}
              letterSpacing="0.06em"
              dominantBaseline="hanging"
            >
              {label.toUpperCase()}
            </text>
            <text
              y={26}
              fill={colors.SPEAKER.neutral.text}
              fontFamily={typo.FONT_STACK}
              fontSize={19}
              dominantBaseline="hanging"
              style={{ maxWidth: cardW - 80 }}
            >
              {value}
            </text>
          </g>
        ))}
      </g>
    </g>
  );
};
