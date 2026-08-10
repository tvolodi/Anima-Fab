import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { colors, type as typo } from "@anima/core";
import { Caption } from "../components/Caption";
import { at, s } from "../timing";

/**
 * Cold open - one grey box, then the title.
 *
 * Mirrors ep01's instinct (start on almost-nothing) without borrowing its
 * imagery: a single unstyled task box, no diagram around it yet. See script's
 * COLD OPEN section.
 */
export const ColdOpen: React.FC = () => {
  const frame = useCurrentFrame();

  const boxIn = interpolate(
    frame,
    [at("coldOpenBoxIn"), at("coldOpenBoxIn") + s(0.8)],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  const titleAt = at("titleCard");
  const titleOpacity = interpolate(
    frame,
    [titleAt, titleAt + s(0.6)],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  const boxFadesOut = interpolate(
    frame,
    [titleAt - s(0.3), titleAt],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  return (
    <AbsoluteFill
      style={{
        backgroundColor: colors.BG,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <svg
        width={300}
        height={120}
        style={{ overflow: "visible", opacity: boxIn * boxFadesOut }}
      >
        <rect
          x={4}
          y={4}
          width={292}
          height={112}
          rx={8}
          fill={colors.SPEAKER.neutral.fill}
          stroke={colors.SPEAKER.neutral.line}
          strokeWidth={2}
        />
        <text
          x={150}
          y={66}
          fill={colors.SPEAKER.neutral.text}
          fontFamily={typo.FONT_STACK}
          fontSize={22}
          fontWeight={500}
          textAnchor="middle"
        >
          Receive Order
        </text>
      </svg>

      <Caption
        text="What is this, exactly?"
        appearAt={at("coldOpenCaption")}
        holdFrames={s(4.5)}
        position="lowerThird"
      />

      <div
        style={{
          position: "absolute",
          textAlign: "center",
          opacity: titleOpacity,
        }}
      >
        <div
          style={{
            fontFamily: typo.FONT_STACK,
            fontSize: typo.SIZE.title,
            fontWeight: typo.WEIGHT.semibold,
            color: colors.SPEAKER.neutral.text,
          }}
        >
          What a Process Actually Is
        </div>
        <div
          style={{
            fontFamily: typo.FONT_STACK,
            fontSize: 24,
            fontWeight: 400,
            color: colors.SPEAKER.neutral.line,
            marginTop: 12,
            letterSpacing: "0.04em",
          }}
        >
          Ch. 1 — Foundations
        </div>
      </div>
    </AbsoluteFill>
  );
};
