import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { colors, type as typo } from "@anima/core";

/**
 * Act 6's running wire count, 1 -> 15. Kept separate from MeshHub since it's
 * pure chrome (a number in a corner) with no geometry of its own - MeshHub
 * only needs to expose the frame window the lines draw across, which this
 * reads independently so the two stay in sync without coupling.
 */
export const CountUp: React.FC<{
  from: number;
  to: number;
  startAt: number;
  endAt: number;
  x: number;
  y: number;
  suffix?: string;
}> = ({ from, to, startAt, endAt, x, y, suffix = "wires" }) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [startAt, startAt + 10], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const raw = interpolate(frame, [startAt, endAt], [from, to], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const value = Math.round(raw);

  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        opacity,
        fontFamily: typo.FONT_STACK,
        textAlign: "right",
      }}
    >
      <div style={{ fontSize: 56, fontWeight: 600, color: colors.TOKEN_BODY, fontVariantNumeric: "tabular-nums" }}>
        {value}
      </div>
      <div style={{ fontSize: 18, color: colors.SPEAKER.neutral.line, letterSpacing: "0.08em", marginTop: 2 }}>
        {suffix.toUpperCase()}
      </div>
    </div>
  );
};
