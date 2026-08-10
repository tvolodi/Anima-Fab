import React from "react";
import { ProcessView } from "./Process";
import { isAbsent, type Telling } from "./types";
import { layout } from "./layout";
import { SPEAKER, SPEAKER_ON_LIGHT } from "../theme/colors";
import { FONT_STACK, SIZE, TRACKING, WEIGHT } from "../theme/type";

/**
 * Swimlanes: N tellings as stacked horizontal bands, one per speaker.
 *
 * This REPLACES the free-overlay approach for Act 2. Overlaying the tellings in
 * one coordinate space was tried four times and every version failed the same
 * way - without structure the diagrams either merged into one long process or
 * collided into an unreadable cross. (See docs/TODO.md for the four attempts.)
 *
 * Lanes fix it because the mess becomes LEGIBLE. The viewer can see three
 * separate accounts AND see that they do not line up - which is the actual
 * argument of the act. Chaos was never the point; mismatch was.
 *
 * It is also BPMN's own idiom, which makes it the honest way to draw this.
 *
 * The argument lives in `align`: each lane is offset horizontally so that
 * steps which OUGHT to correspond do not sit above one another. The gaps
 * between lanes are where handoffs fail - and where the new hire waits.
 */

export interface LanesProps {
  tellings: Telling[];
  /** Horizontal offset per lane, keyed by telling id. Pixels, pre-scale. */
  align?: Record<string, number>;
  /** Per-telling opacity, keyed by id. */
  opacities?: Record<string, number>;
  laneHeight?: number;
  laneGap?: number;
  width?: number;
  light?: boolean;
  revealAll?: boolean;
  showLaneLabels?: boolean;
  showLaneRules?: boolean;
  /**
   * Highlight the vertical band where a handoff should happen but nothing
   * connects the lanes. Given as a fraction of width (0..1).
   */
  gapAt?: number;
  gapWidth?: number;
  gapColor?: string;
  scale?: number;
  /**
   * Act 3: outline a telling in red because it is being blamed from outside.
   * Only meaningful for an audited telling - the point is that the CORRECT
   * diagram takes the blame.
   */
  blamed?: Record<string, boolean>;
}

export const Lanes: React.FC<LanesProps> = ({
  tellings,
  align = {},
  opacities = {},
  laneHeight = 240,
  laneGap = 18,
  width = 1580,
  light = false,
  revealAll = true,
  showLaneLabels = true,
  showLaneRules = true,
  gapAt,
  gapWidth = 150,
  gapColor = "#F2C14E",
  scale = 1,
  blamed = {},
}) => {
  const palette = light ? SPEAKER_ON_LIGHT : SPEAKER;
  const totalHeight =
    tellings.length * laneHeight + (tellings.length - 1) * laneGap;

  return (
    <div
      style={{
        position: "relative",
        width,
        height: totalHeight,
        transform: `scale(${scale})`,
        transformOrigin: "center center",
      }}
    >
      {gapAt !== undefined && (
        <div
          style={{
            position: "absolute",
            left: gapAt * width - gapWidth / 2,
            top: -10,
            width: gapWidth,
            height: totalHeight + 20,
            border: `2px dashed ${gapColor}`,
            borderRadius: 8,
            opacity: 0.9,
            pointerEvents: "none",
          }}
        />
      )}

      {tellings.map((t, i) => {
        const top = i * (laneHeight + laneGap);
        const speaker = isAbsent(t) ? t.speaker : t.speaker;
        const colorKey = isAbsent(t) ? "neutral" : t.color;
        const c = palette[colorKey];
        const dx = align[t.id] ?? 0;

        return (
          <div
            key={t.id}
            style={{
              position: "absolute",
              left: 0,
              top,
              width,
              height: laneHeight,
              opacity: opacities[t.id] ?? 1,
            }}
          >
            {showLaneRules && (
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  borderTop: `1px solid ${c.line}`,
                  borderBottom:
                    i === tellings.length - 1 ? `1px solid ${c.line}` : "none",
                  opacity: 0.18,
                }}
              />
            )}

            {showLaneLabels && (
              <div
                style={{
                  position: "absolute",
                  left: 0,
                  top: 0,
                  bottom: 0,
                  width: 150,
                  display: "flex",
                  alignItems: "center",
                  paddingLeft: 14,
                  fontFamily: FONT_STACK,
                  fontSize: SIZE.speakerRole,
                  fontWeight: WEIGHT.semibold,
                  letterSpacing: TRACKING.wide,
                  color: c.line,
                  borderRight: `1px solid ${c.line}`,
                  opacity: isAbsent(t) ? 0.45 : 0.85,
                }}
              >
                {speaker}
              </div>
            )}

            {/* An absent telling draws NOTHING inside its lane. The empty lane
                is the manager - see AbsentProcess. Do not put a placeholder
                here; the emptiness is the image. */}
            {!isAbsent(t) && (
              <LaneContent
                telling={t}
                dx={dx}
                laneHeight={laneHeight}
                light={light}
                revealAll={revealAll}
                blamed={blamed[t.id] ?? false}
              />
            )}
          </div>
        );
      })}
    </div>
  );
};

const LANE_LABEL_W = 150;
const LANE_PAD_LEFT = 30;

const LaneContent: React.FC<{
  telling: Extract<Telling, { nodes: unknown }>;
  dx: number;
  laneHeight: number;
  light: boolean;
  revealAll: boolean;
  blamed?: boolean;
}> = ({ telling, dx, laneHeight, light, revealAll, blamed = false }) => {
  const laid = React.useMemo(() => layout(telling), [telling]);
  // Fit the diagram to the lane height, never enlarging past 1:1.
  const fit = Math.min(1, (laneHeight - 70) / Math.max(laid.height, 1));

  return (
    <div
      style={{
        position: "absolute",
        left: LANE_LABEL_W + LANE_PAD_LEFT + dx,
        top: "50%",
        transform: `translateY(-50%) scale(${fit})`,
        transformOrigin: "left center",
      }}
    >
      <ProcessView
        process={telling}
        revealAll={revealAll}
        light={light}
        blamed={blamed}
      />
    </div>
  );
};
