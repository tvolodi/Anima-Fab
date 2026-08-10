import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { ProcessView, colors, layout, type as typo } from "@anima/core";
import { Caption } from "../components/Caption";
import { reseller, buyer, messageFlow } from "../data/processes";
import { at, s } from "../timing";

/**
 * Act 3 - orchestration vs. choreography (concept: orchestration-vs-choreography).
 *
 * The centerpiece. First: one diagram, one controller-box around the WHOLE
 * thing (orchestration - a single owner sees and controls everything inside
 * it). Then: a second diagram appears, and the controller-box splits into TWO
 * separate boxes, one per diagram, with only dotted message-pulses crossing
 * the gap between them (choreography - no shared controller, only agreed-upon
 * signals). The controller-box's split from one-box to two-box is the whole
 * argument; give it room to read clearly.
 */

const resellerLaid = layout(reseller);
const buyerLaid = layout(buyer);

const RESELLER_POS = { x: 210, y: 200 };
const BUYER_POS = { x: 210, y: 620 };
const SCALE = 0.66;

const nodeAbsolute = (
  base: { x: number; y: number },
  laid: typeof resellerLaid,
  id: string,
) => {
  const n = laid.nodes.find((n) => n.id === id);
  if (!n) return { x: 0, y: 0 };
  return {
    x: base.x + (n.x + n.w / 2) * SCALE,
    y: base.y + (n.y + n.h / 2) * SCALE,
  };
};

export const Act3Orchestration: React.FC = () => {
  const frame = useCurrentFrame();

  const resellerLabelOpacity = interpolate(
    frame,
    [at("act3ResellerLabel"), at("act3ResellerLabel") + s(0.5)],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  // Single controller-box around the reseller alone, before the buyer appears.
  const singleBoxPulse = interpolate(
    frame,
    [
      at("act3ControllerPulse1"),
      at("act3ControllerPulse1") + s(0.5),
      at("act3ControllerPulse1") + s(1.6),
      at("act3ControllerPulse1") + s(2.1),
    ],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  const buyerIn = interpolate(
    frame,
    [at("act3BuyerIn"), at("act3BuyerIn") + s(0.8)],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  // Two SEPARATE controller-boxes once the buyer is present - no shared box.
  const twoBoxesOpacity = interpolate(
    frame,
    [at("act3ControllerPulse2"), at("act3ControllerPulse2") + s(0.5)],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  // Box bounds hug the diagram itself (ProcessView's own SVG already has a
  // 26px internal pad, so PAD here is just the extra breathing room outside
  // that). LABEL_H accounts for the "RESELLER"/"BUYER" line + its
  // marginBottom sitting above the diagram inside the same positioned div -
  // the box must start above the label, not above the diagram, or it would
  // clip the label.
  const PAD = 24;
  const LABEL_H = 20 * 1.2 + 10; // font-size * line-height + marginBottom

  const resellerBoxBounds = {
    x: RESELLER_POS.x - PAD,
    y: RESELLER_POS.y - LABEL_H - PAD,
    w: resellerLaid.width * SCALE + PAD * 2,
    h: LABEL_H + resellerLaid.height * SCALE + PAD * 2,
  };
  const buyerBoxBounds = {
    x: BUYER_POS.x - PAD,
    y: BUYER_POS.y - LABEL_H - PAD,
    w: buyerLaid.width * SCALE + PAD * 2,
    h: LABEL_H + buyerLaid.height * SCALE + PAD * 2,
  };

  const messagePulseStart = at("act3MessagePulses");
  const PULSE_GAP = s(1.3);

  return (
    <AbsoluteFill style={{ backgroundColor: colors.BG }}>
      <div
        style={{
          position: "absolute",
          transform: `translate(${RESELLER_POS.x}px, ${RESELLER_POS.y}px) scale(${SCALE})`,
        }}
      >
        <div style={{ fontFamily: typo.FONT_STACK, fontSize: 20, letterSpacing: "0.08em", color: colors.SPEAKER.blue.line, opacity: resellerLabelOpacity, marginBottom: 10 }}>
          RESELLER
        </div>
        <ProcessView process={reseller} revealAll />
      </div>

      <div
        style={{
          position: "absolute",
          transform: `translate(${BUYER_POS.x}px, ${BUYER_POS.y}px) scale(${SCALE})`,
          opacity: buyerIn,
        }}
      >
        <div style={{ fontFamily: typo.FONT_STACK, fontSize: 20, letterSpacing: "0.08em", color: colors.SPEAKER.green.line, marginBottom: 10 }}>
          BUYER
        </div>
        <ProcessView process={buyer} revealAll />
      </div>

      {/* Controller box(es). */}
      <svg width={1920} height={1080} style={{ position: "absolute", overflow: "visible" }}>
        {/* Single box around reseller only - shown before buyer appears. */}
        <rect
          x={resellerBoxBounds.x}
          y={resellerBoxBounds.y}
          width={resellerBoxBounds.w}
          height={resellerBoxBounds.h}
          fill="none"
          stroke={colors.SPEAKER.neutral.line}
          strokeWidth={2.5}
          strokeDasharray="6 6"
          rx={10}
          opacity={singleBoxPulse * (1 - twoBoxesOpacity)}
        />

        {/* Two separate boxes once the buyer is present. */}
        <rect
          x={resellerBoxBounds.x}
          y={resellerBoxBounds.y}
          width={resellerBoxBounds.w}
          height={resellerBoxBounds.h}
          fill="none"
          stroke={colors.SPEAKER.blue.line}
          strokeWidth={2}
          strokeDasharray="6 6"
          rx={10}
          opacity={twoBoxesOpacity * 0.7}
        />
        <rect
          x={buyerBoxBounds.x}
          y={buyerBoxBounds.y}
          width={buyerBoxBounds.w}
          height={buyerBoxBounds.h}
          fill="none"
          stroke={colors.SPEAKER.green.line}
          strokeWidth={2}
          strokeDasharray="6 6"
          rx={10}
          opacity={twoBoxesOpacity * 0.7}
        />

        {/* Message flow: dotted arcs with a travelling pulse, relay-style. */}
        {messageFlow.map((link, i) => {
          const from = link.from.startsWith("b-")
            ? nodeAbsolute(BUYER_POS, buyerLaid, link.from)
            : nodeAbsolute(RESELLER_POS, resellerLaid, link.from);
          const to = link.to.startsWith("b-")
            ? nodeAbsolute(BUYER_POS, buyerLaid, link.to)
            : nodeAbsolute(RESELLER_POS, resellerLaid, link.to);

          const pulseStart = messagePulseStart + i * PULSE_GAP;
          const pulseT = interpolate(frame, [pulseStart, pulseStart + s(0.9)], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });
          const lineOpacity = interpolate(frame, [pulseStart - s(0.2), pulseStart], [0, 0.5], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });
          const px = from.x + (to.x - from.x) * pulseT;
          const py = from.y + (to.y - from.y) * pulseT;

          return (
            <g key={link.label}>
              <line
                x1={from.x}
                y1={from.y}
                x2={to.x}
                y2={to.y}
                stroke={colors.SPEAKER.neutral.line}
                strokeWidth={1.5}
                strokeDasharray="3 6"
                opacity={lineOpacity}
              />
              {pulseT > 0 && pulseT < 1 && (
                <circle cx={px} cy={py} r={7} fill={colors.TOKEN_BODY} opacity={0.9} />
              )}
            </g>
          );
        })}
      </svg>

      <Caption
        text="One process. One owner — sees and controls everything inside it."
        appearAt={at("act3Caption1")}
        holdFrames={s(4)}
      />
      <Caption
        text="Two processes. Two owners. Neither sees inside the other."
        appearAt={at("act3Caption2")}
        holdFrames={s(4.5)}
      />
      <Caption text="No conductor. Just agreed-upon signals." appearAt={at("act3Caption3")} holdFrames={s(4)} />
    </AbsoluteFill>
  );
};
