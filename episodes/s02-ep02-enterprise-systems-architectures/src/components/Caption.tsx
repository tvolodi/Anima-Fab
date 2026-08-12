import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { colors, type as typo } from "@anima/core";

/**
 * On-screen caption, lower-third by default.
 *
 * This episode has no narrator and no speaker (see script's "Register"
 * section) so SpeakerLabel from core doesn't fit - that component is built
 * for "who is talking", and nobody is. This is the substitute: a plain
 * centered line that fades in, holds, and fades out, carrying the meaning
 * captions carry in ep01's narration.
 */
export const Caption: React.FC<{
  text: string;
  appearAt: number;
  holdFrames?: number;
  fadeOutFrames?: number;
  position?: "lowerThird" | "center";
  size?: "normal" | "large";
}> = ({
  text,
  appearAt,
  holdFrames = 90,
  fadeOutFrames = 12,
  position = "lowerThird",
  size = "normal",
}) => {
  const frame = useCurrentFrame();
  const fadeInFrames = 12;
  const fadeOutStart = appearAt + fadeInFrames + holdFrames;

  const opacity = interpolate(
    frame,
    [
      appearAt,
      appearAt + fadeInFrames,
      fadeOutStart,
      fadeOutStart + fadeOutFrames,
    ],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  if (opacity <= 0.001) return null;

  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        bottom: position === "lowerThird" ? 140 : undefined,
        top: position === "center" ? "50%" : undefined,
        transform: position === "center" ? "translateY(-50%)" : undefined,
        display: "flex",
        justifyContent: "center",
        opacity,
        pointerEvents: "none",
      }}
    >
      <div
        style={{
          fontFamily: typo.FONT_STACK,
          fontSize: size === "large" ? 42 : 30,
          fontWeight: 500,
          color: colors.TOKEN_BODY,
          letterSpacing: "-0.01em",
          textAlign: "center",
          maxWidth: 1200,
          padding: "0 32px",
        }}
      >
        {text}
      </div>
    </div>
  );
};
