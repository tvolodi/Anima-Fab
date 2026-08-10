import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { TOKEN_BODY, TOKEN_EYE } from "../theme/colors";

/**
 * The token.
 *
 * A dot with two eyes. Deliberately NOT a person: it must stay abstract enough
 * that duplication at a parallel gateway, merging, and dying at a terminate
 * event all stay readable. The moment it grows arms and a face, viewers read
 * it as an employee and splitting it becomes confusing.
 *
 * Squash-and-stretch plus blinking carries essentially all the personality
 * needed. Resist adding more.
 */

export type TokenMood = "walking" | "waiting" | "frantic" | "stopped";

export interface TokenProps {
  x: number;
  y: number;
  r?: number;
  mood?: TokenMood;
  /** Direction of travel, radians. Drives squash and eye-look. */
  heading?: number;
  opacity?: number;
  color?: string;
}

export const Token: React.FC<TokenProps> = ({
  x,
  y,
  r = 19,
  mood = "walking",
  heading = 0,
  opacity = 1,
  color = TOKEN_BODY,
}) => {
  const frame = useCurrentFrame();

  const bob =
    mood === "walking"
      ? Math.sin(frame * 0.34) * 2.4
      : mood === "frantic"
        ? Math.sin(frame * 0.95) * 4.5
        : 0;

  const squash =
    mood === "walking"
      ? 1 + Math.sin(frame * 0.68) * 0.05
      : mood === "frantic"
        ? 1 + Math.sin(frame * 1.4) * 0.11
        : mood === "waiting"
          ? 1 + Math.sin(frame * 0.09) * 0.018 // slow breathing
          : 1;

  // Blink: a quick close every ~2.6s, faster and more anxious when waiting.
  const blinkPeriod = mood === "waiting" ? 58 : 78;
  const inBlink = frame % blinkPeriod;
  const eyeOpen = inBlink < 4 ? interpolate(inBlink, [0, 2, 4], [1, 0.06, 1]) : 1;

  // Waiting tokens glance around; walking tokens look where they are going.
  const glance =
    mood === "waiting" ? Math.sin(frame * 0.055) * 3.2 : Math.cos(heading) * 3.4;

  const eyeDx = r * 0.36;
  const eyeR = r * 0.19;

  return (
    <g transform={`translate(${x}, ${y + bob})`} opacity={opacity}>
      <ellipse
        cx={0}
        cy={0}
        rx={r / squash}
        ry={r * squash}
        fill={color}
      />
      <ellipse
        cx={-eyeDx + glance}
        cy={-r * 0.1}
        rx={eyeR}
        ry={eyeR * eyeOpen}
        fill={TOKEN_EYE}
      />
      <ellipse
        cx={eyeDx + glance}
        cy={-r * 0.1}
        rx={eyeR}
        ry={eyeR * eyeOpen}
        fill={TOKEN_EYE}
      />
    </g>
  );
};
