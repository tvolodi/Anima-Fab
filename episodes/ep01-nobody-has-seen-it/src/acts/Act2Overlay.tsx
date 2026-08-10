import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { Lanes, colors } from "@anima/core";
import { director, manager, olga, sergey } from "../data/tellings";
import { ACT2 } from "../timing";

/**
 * Act 2 - four tellings as swimlanes.
 *
 * The free overlay was tried four times and abandoned; see docs/TODO.md. The
 * act does not need visual chaos, it needs legible MISMATCH: the viewer must
 * see three accounts and see that they do not line up.
 *
 * `align` is where the argument lives. Each lane is nudged horizontally so
 * that steps which ought to correspond do not sit above one another - Sergey's
 * work should begin where Olga's does, and visibly does not.
 */

export interface Act2Props {
  /** Horizontal lane offsets. Tune these while looking at stills. */
  olgaX?: number;
  sergeyX?: number;
  directorX?: number;
  /** Where the missing handoff sits, as a fraction of width. */
  gapAt?: number;
}

export const Act2Overlay: React.FC<Act2Props> = ({
  olgaX = 0,
  sergeyX = 330,
  directorX = 120,
  // Sits between the end of Olga's paperwork and the start of Sergey's work -
  // the handoff nobody owns.
  gapAt = 0.46,
}) => {
  const frame = useCurrentFrame();

  const pulse = (at: number) =>
    interpolate(frame, [at - 4, at, at + 20, at + 26], [0.55, 1, 1, 0.55], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });

  const gapVisible = frame >= ACT2.GAP_REVEAL;

  // "That space is where the new guy sits for three days." - everything dims
  // except the gap.
  const dim = interpolate(
    frame,
    [ACT2.THREE_DAYS, ACT2.THREE_DAYS + 14],
    [1, 0.4],
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
      <div style={{ opacity: dim }}>
        <Lanes
          tellings={[olga, sergey, director, manager]}
          align={{ olga: olgaX, sergey: sergeyX, director: directorX }}
          opacities={{
            olga: pulse(ACT2.OLGA_CLAUSE),
            sergey: pulse(ACT2.SERGEY_CLAUSE),
            director: pulse(ACT2.DIRECTOR_CLAUSE),
            manager: pulse(ACT2.MANAGER_CLAUSE),
          }}
          laneHeight={215}
          width={1620}
          scale={0.92}
          gapAt={gapVisible ? gapAt : undefined}
          gapColor={colors.GAP_HIGHLIGHT}
        />
      </div>
    </AbsoluteFill>
  );
};
