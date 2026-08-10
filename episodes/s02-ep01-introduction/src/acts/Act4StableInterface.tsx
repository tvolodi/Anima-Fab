import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { ProcessView, colors, layout, type as typo } from "@anima/core";
import { Caption } from "../components/Caption";
import { reseller, resellerA, buyer } from "../data/processes";
import { at, s } from "../timing";

/**
 * Act 4 - realization can change behind a stable interface (concept:
 * realization-can-change-behind-a-stable-interface).
 *
 * The buyer diagram does not move or change for the entire act - its
 * stillness while the reseller reorganizes internally (parallel -> strict
 * sequential, ship-only-after-payment) IS the argument. Do not animate the
 * buyer side except the dim/brighten at the very start/end.
 */

const resellerLaid = layout(reseller);
const resellerALaid = layout(resellerA);
const buyerLaid = layout(buyer);

const SCALE = 0.62;
// Stacked vertically, not side by side - both diagrams are ~6 columns wide
// at this scale (~1080px), so side by side overflows the 1920 frame. Vertical
// stacking also reads better here: reseller (top) visibly changes shape while
// buyer (bottom) sits static beneath it.
const RESELLER_POS = { x: 960 - (resellerLaid.width * SCALE) / 2, y: 220 };
const BUYER_POS = { x: 960 - (buyerLaid.width * SCALE) / 2, y: 620 };

export const Act4StableInterface: React.FC = () => {
  const frame = useCurrentFrame();

  const buyerDim = interpolate(
    frame,
    [at("act4Start"), at("act4Start") + s(0.6), at("act4BuyerBrighten"), at("act4BuyerBrighten") + s(0.8)],
    [1, 0.2, 0.2, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  // Crossfade + reflow: reseller fades out, reseller-A fades in, over ~1.5s.
  const reflowStart = at("act4Reflow");
  const reflow = interpolate(frame, [reflowStart, reflowStart + s(1.5)], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Payment-before-ship emphasis pulse on Reseller-A's Ship Products node.
  const shipNode = resellerALaid.nodes.find((n) => n.id === "r-ship-products");
  const pulseStart = reflowStart + s(2.5);
  const shipPulse = interpolate(
    frame,
    [pulseStart, pulseStart + s(0.3), pulseStart + s(0.9), pulseStart + s(1.2)],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  return (
    <AbsoluteFill style={{ backgroundColor: colors.BG }}>
      <div
        style={{
          position: "absolute",
          top: RESELLER_POS.y,
          left: RESELLER_POS.x,
          transform: `scale(${SCALE})`,
          transformOrigin: "top left",
        }}
      >
        <div style={{ position: "relative", opacity: 1 - reflow }}>
          <ProcessView process={reseller} revealAll />
        </div>
        <div style={{ position: "absolute", top: 0, left: 0, opacity: reflow }}>
          <ProcessView process={resellerA} revealAll />
          {shipNode && (
            <svg
              width={resellerALaid.width}
              height={resellerALaid.height}
              style={{ position: "absolute", top: 0, left: 0, overflow: "visible", pointerEvents: "none" }}
            >
              <rect
                x={shipNode.x - 6}
                y={shipNode.y - 6}
                width={shipNode.w + 12}
                height={shipNode.h + 12}
                rx={12}
                fill="none"
                stroke={colors.SPEAKER.blue.line}
                strokeWidth={4}
                opacity={shipPulse}
              />
            </svg>
          )}
        </div>
        <div
          style={{
            fontFamily: typo.FONT_STACK,
            fontSize: 20,
            letterSpacing: "0.08em",
            color: colors.SPEAKER.blue.line,
            marginTop: resellerLaid.height + 22,
          }}
        >
          {reflow < 0.5 ? "RESELLER" : "RESELLER-A"}
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          top: BUYER_POS.y,
          left: BUYER_POS.x,
          transform: `scale(${SCALE})`,
          transformOrigin: "top left",
          opacity: buyerDim,
        }}
      >
        <ProcessView process={buyer} revealAll />
        <div style={{ fontFamily: typo.FONT_STACK, fontSize: 20, letterSpacing: "0.08em", color: colors.SPEAKER.green.line, marginTop: buyerLaid.height + 22 }}>
          BUYER
        </div>
      </div>

      <Caption text="Reseller-A does it differently." appearAt={at("act4Caption1")} holdFrames={s(3)} />
      <Caption text="Ship only after payment clears." appearAt={at("act4Caption2")} holdFrames={s(4)} />
      <Caption text="The buyer can't tell the difference. That's the point." appearAt={at("act4Caption3")} holdFrames={s(4.5)} />
    </AbsoluteFill>
  );
};
