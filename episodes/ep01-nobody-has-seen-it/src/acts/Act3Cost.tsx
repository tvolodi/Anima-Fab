import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { Lanes, Token, colors, walkAt, type WalkLeg } from "@anima/core";
import { director, manager, olga, sergey } from "../data/tellings";
import { at, after, s } from "../timing";

/**
 * Act 3 - the cost.
 *
 * The lanes stay on screen, dimmed, and a token walks Olga's lane confidently,
 * reaches the end of her paperwork, and STOPS - because nothing connects her
 * lane to Sergey's. It waits there, blinking, for the rest of the act.
 *
 * That stall is the whole argument made visible: the process does not fail
 * inside anybody's lane, it fails in the space between them.
 */

const LANE_H = 215;
const LANE_GAP = 18;
const WIDTH = 1620;
const SCALE = 0.92;

/**
 * Where the token walks, in Lanes-local coordinates.
 *
 * It stalls PAST the end of Olga's diagram, not inside it. Her lane is done -
 * the documents are filed, correctly and on time. The failure is that nothing
 * carries the token onward to Sergey's lane, so it stops in open space and
 * waits there. Stalling mid-diagram would read as Olga being slow, which is
 * exactly the wrong argument.
 */
const OLGA_LANE_Y = LANE_H / 2;
const WALK_START_X = 230;
const WALK_STALL_X = 1180;

export const Act3Cost: React.FC = () => {
  const frame = useCurrentFrame();

  // Olga's diagram is briefly outlined red on "будто кадры тормозят" - from
  // outside this looks like HR being slow. It was never her fault, so the red
  // fades out again.
  const blameStart = at("n24") + s(4.5);
  const blamed = interpolate(
    frame,
    [blameStart, blameStart + s(0.6), blameStart + s(3.2), blameStart + s(4.2)],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  // The token: walks in on n22, stalls at the lane boundary, waits forever.
  const legs: WalkLeg[] = [
    {
      points: [
        { x: WALK_START_X, y: OLGA_LANE_Y },
        { x: WALK_STALL_X, y: OLGA_LANE_Y },
      ],
      startFrame: at("n22"),
      durationFrames: s(2.6),
      // Waits for the rest of the act. This is the point.
      pauseFrames: s(60),
    },
  ];

  const tokenVisible = frame >= at("n22") - s(0.5);
  const walk = walkAt(legs, frame);

  // Everything dims as the narration turns to what it costs.
  const dim = interpolate(frame, [at("n21"), at("n21") + s(1.2)], [1, 0.45], {
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
      <div style={{ position: "relative", opacity: dim }}>
        <Lanes
          tellings={[olga, sergey, director, manager]}
          align={{ olga: 0, sergey: 330, director: 120 }}
          laneHeight={LANE_H}
          laneGap={LANE_GAP}
          width={WIDTH}
          scale={SCALE}
          blamed={{ olga: blamed > 0.01 }}
        />
      </div>

      {/* The token rides above the dimmed lanes at full opacity - it is the
          only thing the viewer should be watching. */}
      {tokenVisible && (
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            transform: `translate(-50%, -50%) scale(${SCALE})`,
          }}
        >
          <svg
            width={WIDTH}
            height={4 * LANE_H + 3 * LANE_GAP}
            style={{ overflow: "visible" }}
          >
            <Token
              x={walk.x}
              y={walk.y}
              r={26}
              mood={walk.moving ? "walking" : "waiting"}
              heading={walk.heading}
            />
          </svg>
        </div>
      )}
    </AbsoluteFill>
  );
};
