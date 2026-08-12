import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { colors, type as typo } from "@anima/core";
import { Caption } from "../components/Caption";
import { at, s } from "../timing";

/**
 * Connective beat - zooming into one box. The full value-chain diagram
 * shrinks to a small docked icon (top-left), then the "Operations" box
 * alone flies to center and enlarges, empty and waiting. Short and honest
 * about being a transition, per the script - not dressed up as something
 * the source itself says.
 */

const DOCK_X = 90;
const DOCK_Y = 70;
const DOCK_W = 220;
const DOCK_H = 90;

export const ConnectiveBeat: React.FC = () => {
  const frame = useCurrentFrame();

  const dockT = interpolate(frame, [at("connectiveDock"), at("connectiveDock") + s(0.8)], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const enlargeT = interpolate(
    frame,
    [at("connectiveBoxEnlarge"), at("connectiveBoxEnlarge") + s(1.2)],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  const boxW = interpolate(enlargeT, [0, 1], [180, 900]);
  const boxH = interpolate(enlargeT, [0, 1], [90, 480]);
  const boxX = 1920 / 2 - boxW / 2;
  const boxY = 1080 / 2 - boxH / 2;

  return (
    <AbsoluteFill style={{ backgroundColor: colors.BG }}>
      {/* Docked value-chain callback icon, top-left. */}
      <svg width={1920} height={1080} style={{ position: "absolute", overflow: "visible" }}>
        <g opacity={dockT * 0.7}>
          <rect x={DOCK_X} y={DOCK_Y} width={DOCK_W} height={28} rx={4} fill={colors.SPEAKER.blue.fill} stroke={colors.SPEAKER.blue.line} strokeWidth={1} />
          <rect x={DOCK_X} y={DOCK_Y + 34} width={DOCK_W} height={22} rx={4} fill={colors.SPEAKER.neutral.fill} stroke={colors.SPEAKER.neutral.line} strokeWidth={1} />
          <text x={DOCK_X + DOCK_W / 2} y={DOCK_Y - 12} fill={colors.SPEAKER.neutral.line} fontFamily={typo.FONT_STACK} fontSize={13} letterSpacing="0.06em" textAnchor="middle">
            VALUE CHAIN
          </text>
        </g>

        {/* Operations box, enlarging to center, empty interior. */}
        <rect
          x={boxX}
          y={boxY}
          width={boxW}
          height={boxH}
          rx={14}
          fill={colors.SPEAKER.blue.fill}
          stroke={colors.SPEAKER.blue.line}
          strokeWidth={2.5}
        />
        <text
          x={boxX + boxW / 2}
          y={boxY + 44}
          fill={colors.SPEAKER.blue.text}
          fontFamily={typo.FONT_STACK}
          fontSize={interpolate(enlargeT, [0, 1], [18, 26])}
          fontWeight={600}
          textAnchor="middle"
        >
          OPERATIONS
        </text>
      </svg>

      <Caption
        text="Say this box is where the actual work happens. What does work look like, up close?"
        appearAt={at("connectiveCaption")}
        holdFrames={s(2.5)}
      />
    </AbsoluteFill>
  );
};
