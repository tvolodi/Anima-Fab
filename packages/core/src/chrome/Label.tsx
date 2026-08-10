import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { SPEAKER } from "../theme/colors";
import { FONT_STACK, SIZE, TRACKING, WEIGHT } from "../theme/type";
import type { ColorKey } from "../process/types";

/** Lower-third speaker label: "Ольга" / "HR". Minimal by design. */
export const SpeakerLabel: React.FC<{
  name: string;
  role?: string;
  color?: ColorKey;
  appearAt?: number;
  x?: number;
  y?: number;
}> = ({ name, role, color = "neutral", appearAt = 0, x = 96, y = 880 }) => {
  const frame = useCurrentFrame();
  const o = interpolate(frame, [appearAt, appearAt + 10], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const c = SPEAKER[color];

  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        opacity: o,
        fontFamily: FONT_STACK,
      }}
    >
      <div
        style={{
          fontSize: SIZE.speakerLabel,
          fontWeight: WEIGHT.semibold,
          color: c.text,
          letterSpacing: TRACKING.tight,
        }}
      >
        {name}
      </div>
      {role && (
        <div
          style={{
            fontSize: SIZE.speakerRole,
            fontWeight: WEIGHT.regular,
            color: c.line,
            letterSpacing: TRACKING.wide,
            textTransform: "uppercase",
            marginTop: 4,
          }}
        >
          {role}
        </div>
      )}
    </div>
  );
};

/**
 * The manager's column in episode 1: a labelled frame with nothing in it.
 *
 * The script is explicit - "Do not draw anything in the fourth column. The
 * empty frame is the single strongest image in the episode. Every instinct
 * will say to put something there. Don't."
 *
 * This component exists so that instinct has nowhere to act. It takes no
 * children.
 */
export const EmptyFrame: React.FC<{
  width: number;
  height: number;
  appearAt?: number;
}> = ({ width, height, appearAt = 0 }) => {
  const frame = useCurrentFrame();
  const o = interpolate(frame, [appearAt, appearAt + 14], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <svg width={width} height={height} style={{ opacity: o * 0.42 }}>
      <rect
        x={1}
        y={1}
        width={width - 2}
        height={height - 2}
        fill="none"
        stroke={SPEAKER.neutral.line}
        strokeWidth={1.5}
        strokeDasharray="3 9"
        rx={8}
      />
    </svg>
  );
};
