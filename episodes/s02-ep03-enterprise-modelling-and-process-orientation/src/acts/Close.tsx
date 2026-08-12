import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { colors, type as typo } from "@anima/core";
import { Caption } from "../components/Caption";
import { at, s } from "../timing";

/**
 * Close - the three callback icons (value chain, knowledge-worker chain,
 * process landscape) fade up together, small, left to right. Ends on a
 * deliberately non-specific forward pointer - the B2B subsection / Chapter 5
 * material is not a confirmed card, so the end card does not promise it.
 */

export const Close: React.FC = () => {
  const frame = useCurrentFrame();

  const iconsIn = interpolate(frame, [at("closeIconsIn"), at("closeIconsIn") + s(1.0)], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const endCardOpacity = interpolate(frame, [at("endCard"), at("endCard") + s(0.7)], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const restFadesOut = interpolate(frame, [at("endCard") - s(0.3), at("endCard")], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const iconY = 480;

  return (
    <AbsoluteFill style={{ backgroundColor: colors.BG, justifyContent: "center", alignItems: "center" }}>
      <svg width={1920} height={1080} style={{ position: "absolute", overflow: "visible", opacity: iconsIn * restFadesOut }}>
        {/* Value chain icon. */}
        <g transform="translate(650, 0)">
          <rect x={0} y={iconY} width={180} height={26} rx={4} fill={colors.SPEAKER.blue.fill} stroke={colors.SPEAKER.blue.line} strokeWidth={1.5} />
          <rect x={0} y={iconY + 32} width={180} height={20} rx={4} fill={colors.SPEAKER.neutral.fill} stroke={colors.SPEAKER.neutral.line} strokeWidth={1.5} />
          <text x={90} y={iconY - 16} fill={colors.SPEAKER.neutral.line} fontFamily={typo.FONT_STACK} fontSize={14} letterSpacing="0.05em" textAnchor="middle">
            VALUE CHAIN
          </text>
        </g>

        {/* Knowledge-worker chain icon. */}
        <g transform="translate(890, 0)">
          {[0, 1, 2].map((i) => (
            <rect key={i} x={i * 62} y={iconY} width={54} height={52} rx={6} fill={colors.SPEAKER.blue.fill} stroke={colors.SPEAKER.blue.line} strokeWidth={1.5} />
          ))}
          <text x={90} y={iconY - 16} fill={colors.SPEAKER.neutral.line} fontFamily={typo.FONT_STACK} fontSize={14} letterSpacing="0.05em" textAnchor="middle">
            KNOWLEDGE WORKER
          </text>
        </g>

        {/* Process landscape icon. */}
        <g transform="translate(1130, 0)">
          {[0, 1, 2, 3, 4].map((i) => (
            <rect key={i} x={i * 42} y={iconY + 10} width={34} height={34} rx={5} fill={colors.SPEAKER.neutral.fill} stroke={colors.SPEAKER.neutral.line} strokeWidth={1.5} />
          ))}
          <text x={90} y={iconY - 16} fill={colors.SPEAKER.neutral.line} fontFamily={typo.FONT_STACK} fontSize={14} letterSpacing="0.05em" textAnchor="middle">
            PROCESS LANDSCAPE
          </text>
        </g>
      </svg>

      <div style={{ opacity: restFadesOut }}>
        <Caption
          text="A shape for what the company does. A reason to group work coarser than Taylor would have. A boundary around each process that stays deliberately closed."
          appearAt={at("closeCaption1")}
          holdFrames={s(3.0)}
          size="large"
        />
        <Caption
          text="Different road than last time. Same destination."
          appearAt={at("closeCaption2")}
          holdFrames={s(2.5)}
          size="large"
        />
      </div>

      <div style={{ position: "absolute", textAlign: "center", opacity: endCardOpacity }}>
        <div style={{ fontFamily: typo.FONT_STACK, fontSize: 30, fontWeight: 600, color: colors.SPEAKER.neutral.text, letterSpacing: "0.02em" }}>
          BPM, honestly
        </div>
        <div style={{ fontFamily: typo.FONT_STACK, fontSize: 20, fontWeight: 400, color: colors.SPEAKER.neutral.line, marginTop: 14 }}>
          Next: business processes that cross company lines
        </div>
      </div>
    </AbsoluteFill>
  );
};
