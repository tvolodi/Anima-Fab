import React from "react";
import { colors, type as typo } from "@anima/core";

/**
 * A labelled rounded rectangle - the base shape every act in this episode is
 * built from (the blob, the extracted OS/DBMS/GUI, the HR/Purchasing/ERP/SCM
 * boxes, the six mesh nodes). Kept as a plain SVG-fragment component (no own
 * <svg>) so callers can compose several inside one shared coordinate space.
 */
export const SystemBox: React.FC<{
  x: number;
  y: number;
  w: number;
  h: number;
  label: string;
  opacity?: number;
  stroke?: string;
  fill?: string;
  textColor?: string;
  fontSize?: number;
  strokeWidth?: number;
}> = ({
  x,
  y,
  w,
  h,
  label,
  opacity = 1,
  stroke = colors.SPEAKER.neutral.line,
  fill = colors.SPEAKER.neutral.fill,
  textColor = colors.SPEAKER.neutral.text,
  fontSize = 22,
  strokeWidth = 2,
}) => (
  <g opacity={opacity}>
    <rect
      x={x}
      y={y}
      width={w}
      height={h}
      rx={10}
      fill={fill}
      stroke={stroke}
      strokeWidth={strokeWidth}
    />
    <text
      x={x + w / 2}
      y={y + h / 2}
      fill={textColor}
      fontFamily={typo.FONT_STACK}
      fontSize={fontSize}
      fontWeight={500}
      textAnchor="middle"
      dominantBaseline="central"
    >
      {label}
    </text>
  </g>
);
