import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { colors, type as typo } from "@anima/core";
import { Caption } from "../components/Caption";
import { at, s } from "../timing";

/**
 * Cold open - a single word, "BPM.", fades in center on black, then the
 * title card. Deliberately spare per the script: no diagram yet, just the
 * fork-framing line ("last time this came from software, it also comes from
 * somewhere else") setting up that this episode is a different road, not a
 * continuation of ep02's vocabulary.
 */

export const ColdOpen: React.FC = () => {
  const frame = useCurrentFrame();

  const wordOpacity = interpolate(
    frame,
    [at("coldOpenWordIn") + s(0.5), at("coldOpenWordIn") + s(1.3)],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  const titleAt = at("titleCard");
  const titleOpacity = interpolate(frame, [titleAt, titleAt + s(0.6)], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const restFadesOut = interpolate(frame, [titleAt - s(0.3), titleAt], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: colors.BG,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          position: "absolute",
          fontFamily: typo.FONT_STACK,
          fontSize: 64,
          fontWeight: 600,
          color: colors.SPEAKER.neutral.text,
          letterSpacing: "0.02em",
          opacity: wordOpacity * restFadesOut,
        }}
      >
        BPM.
      </div>

      <Caption
        text="Last time, this came from software. It also comes from somewhere else."
        appearAt={at("coldOpenCaption")}
        holdFrames={s(2.2)}
        position="lowerThird"
      />

      <div style={{ position: "absolute", textAlign: "center", opacity: titleOpacity }}>
        <div
          style={{
            fontFamily: typo.FONT_STACK,
            fontSize: typo.SIZE.title,
            fontWeight: typo.WEIGHT.semibold,
            color: colors.SPEAKER.neutral.text,
          }}
        >
          The Business Side of the Same Question
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
          Ch. 2 — Enterprise Modelling and Process Orientation
        </div>
      </div>
    </AbsoluteFill>
  );
};
