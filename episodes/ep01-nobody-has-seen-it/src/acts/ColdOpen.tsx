import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { colors } from "@anima/core";
import { at, after, s } from "../timing";

/**
 * Cold open - one dot, and a lot of silence.
 *
 * The script: no text on screen, no title card. "The dot alone, with the
 * silence, buys you attention for the next twenty seconds." The two-second
 * hold after the dot appears is the first of the four protected silences.
 *
 * "Давайте спросим троих" is a deliberate lie - the dot splits into THREE,
 * and there turn out to be four. Nobody notices until Act 1 ends.
 */
export const ColdOpen: React.FC = () => {
  const frame = useCurrentFrame();

  const dotIn = interpolate(frame, [at("n01"), at("n01") + s(1.4)], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Very slight breathing - the dot is alive, but barely.
  const breathe = 1 + Math.sin(frame * 0.055) * 0.035;

  // Splits into three on "Давайте спросим троих".
  const split = interpolate(
    frame,
    [at("n03"), after("n03") + s(0.8)],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  const spread = split * 300;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: colors.BG,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <svg width={1200} height={400} style={{ overflow: "visible" }}>
        {[-1, 0, 1].map((i) => (
          <circle
            key={i}
            cx={600 + i * spread}
            cy={200}
            r={26 * breathe}
            fill={colors.TOKEN_BODY}
            opacity={i === 0 ? dotIn : dotIn * split}
          />
        ))}
      </svg>
    </AbsoluteFill>
  );
};
