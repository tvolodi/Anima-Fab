import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { colors, type as typo, Token } from "@anima/core";
import { CONTEXT_RELOAD_ACCENT } from "../theme";

/**
 * Act 2's centerpiece and the episode's flagged highest build risk: a task
 * token moving through a chain of boxes, halting at each boundary for a
 * "context reload" (a context-readout bar that drains and refills with a
 * spinner pulse), then - after a pairwise box-merge - moving cleanly through
 * fewer, wider boxes without the reload beat.
 *
 * Three distinct behaviors stacked into one component, per the script's own
 * framing of the risk:
 *   1. Halt-and-reload: a token stops at each of 5 boundaries, its readout
 *      bar drains to zero then refills partway, before continuing.
 *   2. Pairwise box-merge: 6 narrow boxes visibly merge into 3 wide ones,
 *      each pair's labels briefly overlapping before settling on a new
 *      single label - not an instant swap.
 *   3. Clean-run contrast: a second token runs the merged chain briskly,
 *      mirroring the FIRST (factory-floor) token's easy pace, no reload.
 *
 * `mode` selects which sub-behavior is active; Act2 mounts multiple
 * instances of this component (or drives it through a wider `phase` prop) as
 * the act's single timeline moves through problem -> transition -> solution.
 */

export interface ChainBoxSpec {
  label: string;
}

const CHAIN_Y = 500;
const CHAIN_H = 130;
const NARROW_W = 190;
const WIDE_W = 380;
const GAP = 26;
const CHAIN_X0 = 210;

/** X position of narrow box `i` (0-indexed) in a 6-box chain. */
const narrowBoxX = (i: number) => CHAIN_X0 + i * (NARROW_W + GAP);

/** X position of wide box `i` (0-indexed) in a 3-box merged chain, centered
 * under the same overall span as the 6-box chain so the merge reads as a
 * literal pairwise collapse rather than a re-layout. */
const wideBoxX = (i: number) => CHAIN_X0 + i * (WIDE_W + GAP);

export const HandoverChain: React.FC<{
  /** Six labels for the narrow, pre-merge chain. */
  narrowLabels: string[];
  /** Three labels for the wide, post-merge chain (must be length 3). */
  wideLabels: string[];
  /** 0..1 - boxes fade in, left to right. */
  boxesInT: number;
  /** 0..1 - the FIRST (factory-floor) token's brisk, uninterrupted walk across all 6 boxes. Only meaningful before any relabel/halt beat. */
  briskWalkT: number;
  /** 0..1 - the SECOND token enters the narrow chain and walks to the first boundary, where it then halts (see haltIndex/reloadT). */
  modernWalkInT: number;
  /**
   * Which boundary (0-4) the token is currently halted+reloading at, or -1
   * if past all reload beats (heading to the final box) or before the first
   * one. Boundary i sits between narrow box i and narrow box i+1.
   */
  haltIndex: number;
  /** 0..1 within the CURRENT halt: readout drains (0->0.5) then refills partway (0.5->1). */
  reloadT: number;
  /** 0..1 - after all 5 reloads, the token's final leg into the last box. */
  finalLegT: number;
  /** 0..1 - pairwise merge: 6 narrow boxes -> 3 wide boxes, labels overlap then settle. */
  mergeT: number;
  /** 0..1 - "knowledge worker" badges fade onto the 3 wide boxes. */
  badgesInT: number;
  /** 0..1 - the clean token's brisk run through the merged 3-box chain. */
  cleanRunT: number;
}> = ({
  narrowLabels,
  wideLabels,
  boxesInT,
  briskWalkT,
  modernWalkInT,
  haltIndex,
  reloadT,
  finalLegT,
  mergeT,
  badgesInT,
  cleanRunT,
}) => {
  const frame = useCurrentFrame();
  const n = narrowLabels.length; // 6
  const m = wideLabels.length; // 3

  // Merge geometry: box pair (2i, 2i+1) of the narrow chain collapses into
  // wide box i. Narrow-chain total span and wide-chain total span differ, so
  // interpolate each wide box's rect FROM the midpoint of its source pair's
  // current rects TO its own resting position - this keeps the merge reading
  // as "these two boxes became one," not a teleport.
  const narrowRect = (i: number) => ({ x: narrowBoxX(i), y: CHAIN_Y, w: NARROW_W, h: CHAIN_H });
  const wideRect = (i: number) => ({ x: wideBoxX(i), y: CHAIN_Y, w: WIDE_W, h: CHAIN_H });

  const mergedBoxRect = (i: number) => {
    const left = narrowRect(2 * i);
    const right = narrowRect(2 * i + 1);
    const pairMidX = (left.x + right.x + right.w) / 2 - NARROW_W; // approx center of the pair
    const pairSpanW = right.x + right.w - left.x;
    const from = { x: left.x, y: CHAIN_Y, w: pairSpanW, h: CHAIN_H };
    const to = wideRect(i);
    return {
      x: interpolate(mergeT, [0, 1], [from.x, to.x]),
      y: CHAIN_Y,
      w: interpolate(mergeT, [0, 1], [from.w, to.w]),
      h: CHAIN_H,
      pairMidX,
    };
  };

  const showNarrow = mergeT < 0.999;
  const narrowOpacity = interpolate(mergeT, [0, 0.35], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const mergedOpacity = interpolate(mergeT, [0, 0.15], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // --- Token position (halt-and-reload phase, pre-merge) ---
  const tokenPos = (() => {
    if (modernWalkInT <= 0 && briskWalkT <= 0 && finalLegT <= 0) return null;

    if (briskWalkT > 0 && modernWalkInT <= 0) {
      // First (factory-floor) token: brisk, uninterrupted walk across all 6.
      const totalSpan = narrowBoxX(n - 1) + NARROW_W - narrowBoxX(0);
      const x = narrowBoxX(0) + briskWalkT * totalSpan;
      return { x, y: CHAIN_Y + CHAIN_H / 2, mood: "walking" as const };
    }

    // Second (modern) token: walks to boundary 0, then halts/reloads at each
    // boundary in turn, then a final leg into box 5.
    if (haltIndex >= 0 && haltIndex < n - 1) {
      const boundaryX = narrowBoxX(haltIndex) + NARROW_W + GAP / 2;
      return { x: boundaryX, y: CHAIN_Y + CHAIN_H / 2, mood: "stopped" as const, haltIndex };
    }
    if (finalLegT > 0) {
      const from = narrowBoxX(n - 2) + NARROW_W + GAP / 2;
      const to = narrowBoxX(n - 1) + NARROW_W / 2;
      const x = interpolate(finalLegT, [0, 1], [from, to], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      });
      return { x, y: CHAIN_Y + CHAIN_H / 2, mood: "walking" as const };
    }
    // Entering, before boundary 0.
    const x = interpolate(modernWalkInT, [0, 1], [narrowBoxX(0), narrowBoxX(0) + NARROW_W + GAP / 2], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
    return { x, y: CHAIN_Y + CHAIN_H / 2, mood: "walking" as const };
  })();

  // --- Clean token (post-merge) ---
  const cleanTokenX =
    cleanRunT > 0
      ? interpolate(cleanRunT, [0, 1], [wideBoxX(0), wideBoxX(m - 1) + WIDE_W])
      : null;

  return (
    <svg width={1920} height={1080} style={{ position: "absolute", overflow: "visible" }}>
      {/* Narrow (pre-merge) chain. */}
      {showNarrow && (
        <g opacity={narrowOpacity}>
          {narrowLabels.map((label, i) => {
            const boxIn = interpolate(boxesInT, [i / n, (i + 0.6) / n], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            });
            if (boxIn <= 0.001) return null;
            const r = narrowRect(i);
            const isMergingPair = Math.floor(i / 2);
            const pairFrom = mergedBoxRect(isMergingPair);
            const rx = mergeT > 0.001 ? interpolate(mergeT, [0, 0.5], [r.x, pairFrom.x + (i % 2) * (pairFrom.w / 2)]) : r.x;
            return (
              <g key={label} opacity={boxIn}>
                <rect
                  x={rx}
                  y={r.y}
                  width={r.w}
                  height={r.h}
                  rx={8}
                  fill={colors.SPEAKER.neutral.fill}
                  stroke={colors.SPEAKER.neutral.line}
                  strokeWidth={1.5}
                />
                <text
                  x={rx + r.w / 2}
                  y={r.y + r.h / 2}
                  fill={colors.SPEAKER.neutral.text}
                  fontFamily={typo.FONT_STACK}
                  fontSize={16}
                  fontWeight={500}
                  textAnchor="middle"
                  dominantBaseline="central"
                >
                  {label}
                </text>
              </g>
            );
          })}
        </g>
      )}

      {/* Merged (post-merge) wide chain - overlapping dual labels early in
          the merge, settling on the single new label. */}
      {mergeT > 0.001 &&
        wideLabels.map((label, i) => {
          const r = mergedBoxRect(i);
          const oldLabelA = narrowLabels[2 * i];
          const oldLabelB = narrowLabels[2 * i + 1];
          // Overlap window widened (was [0.15,0.55] -> [0.5,0.85], a bare
          // 0.05 handoff) so there is always a substantial stretch where
          // BOTH labels read clearly together ("Intake + Verify" fading
          // toward "Receive & Assess") rather than a dim gap where neither
          // is legible - caught in a still-frame check at mergeT~0.44, where
          // the old label was only ~28% opacity and effectively unreadable.
          const oldLabelOpacity = interpolate(mergeT, [0.1, 0.6], [1, 0], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });
          const newLabelOpacity = interpolate(mergeT, [0.4, 0.8], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });
          const badgeOpacity = interpolate(badgesInT, [0, 1], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });
          return (
            <g key={label} opacity={mergedOpacity}>
              <rect
                x={r.x}
                y={r.y}
                width={r.w}
                height={r.h}
                rx={10}
                fill={colors.SPEAKER.blue.fill}
                stroke={colors.SPEAKER.blue.line}
                strokeWidth={2}
              />
              {oldLabelOpacity > 0.01 && (
                <text
                  x={r.x + r.w / 2}
                  y={r.y + r.h / 2}
                  fill={colors.SPEAKER.blue.text}
                  fontFamily={typo.FONT_STACK}
                  fontSize={16}
                  fontWeight={500}
                  textAnchor="middle"
                  dominantBaseline="central"
                  opacity={oldLabelOpacity}
                >
                  {oldLabelA} + {oldLabelB}
                </text>
              )}
              {newLabelOpacity > 0.01 && (
                <text
                  x={r.x + r.w / 2}
                  y={r.y + r.h / 2}
                  fill={colors.SPEAKER.blue.text}
                  fontFamily={typo.FONT_STACK}
                  fontSize={19}
                  fontWeight={600}
                  textAnchor="middle"
                  dominantBaseline="central"
                  opacity={newLabelOpacity}
                >
                  {label}
                </text>
              )}
              {badgeOpacity > 0.01 && (
                <g opacity={badgeOpacity} transform={`translate(${r.x + r.w / 2}, ${r.y - 26})`}>
                  <rect x={-72} y={-16} width={144} height={28} rx={14} fill={colors.SPEAKER.green.fill} stroke={colors.SPEAKER.green.line} strokeWidth={1.5} />
                  <text
                    y={0}
                    fill={colors.SPEAKER.green.text}
                    fontFamily={typo.FONT_STACK}
                    fontSize={13}
                    fontWeight={600}
                    letterSpacing="0.03em"
                    textAnchor="middle"
                    dominantBaseline="central"
                  >
                    KNOWLEDGE WORKER
                  </text>
                </g>
              )}
            </g>
          );
        })}

      {/* Token: halt-and-reload phase (or brisk factory-floor walk). */}
      {tokenPos && showNarrow && (
        <g>
          <Token x={tokenPos.x} y={tokenPos.y} mood={tokenPos.mood} color={colors.TOKEN_BODY} />
          {/* Readout sits well clear of the box tops (CHAIN_Y), not just
              above the token - an initial -70 offset put it within 5px of
              the box edge, nearly overlapping in a still-frame check. */}
          {tokenPos.mood === "stopped" && reloadT > 0 && (
            <ContextReadout x={tokenPos.x} y={CHAIN_Y - 60} reloadT={reloadT} frame={frame} />
          )}
        </g>
      )}

      {/* Token: clean run through the merged chain. */}
      {cleanTokenX !== null && (
        <Token x={cleanTokenX} y={CHAIN_Y + CHAIN_H / 2} mood="walking" color={colors.TOKEN_BODY} />
      )}
    </svg>
  );
};

/**
 * The context-readout bar: drains to zero (0 -> 0.5 of reloadT), then a
 * spinner pulse plays, then refills partway (0.5 -> 1 of reloadT) - never
 * back to full, since the point is that reconstruction is real cost, not a
 * free reset. Deliberately a little labored to watch, per the script's
 * explicit "should look a little uncomfortable" note - the pause between
 * drain and refill is held, not eased through quickly.
 */
const ContextReadout: React.FC<{ x: number; y: number; reloadT: number; frame: number }> = ({
  x,
  y,
  reloadT,
  frame,
}) => {
  const barW = 130;
  const barH = 12;

  const fill = interpolate(
    reloadT,
    [0, 0.42, 0.5, 0.62, 1],
    [1, 0, 0, 0, 0.55],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  const spinnerOpacity = interpolate(reloadT, [0.4, 0.5, 0.62, 0.72], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const spinnerAngle = (frame * 14) % 360;

  return (
    <g transform={`translate(${x}, ${y})`}>
      <text
        y={-barH / 2 - 10}
        textAnchor="middle"
        fill={CONTEXT_RELOAD_ACCENT}
        fontFamily={typo.FONT_STACK}
        fontSize={12}
        fontWeight={600}
        letterSpacing="0.08em"
        opacity={0.85}
      >
        CONTEXT
      </text>
      <rect x={-barW / 2} y={-barH / 2} width={barW} height={barH} rx={barH / 2} fill="none" stroke={CONTEXT_RELOAD_ACCENT} strokeWidth={1.5} opacity={0.7} />
      <rect
        x={-barW / 2}
        y={-barH / 2}
        width={Math.max(0, barW * fill)}
        height={barH}
        rx={barH / 2}
        fill={CONTEXT_RELOAD_ACCENT}
      />
      {spinnerOpacity > 0.01 && (
        <g opacity={spinnerOpacity} transform={`translate(0, ${barH + 22}) rotate(${spinnerAngle})`}>
          <circle r={14} fill="none" stroke={CONTEXT_RELOAD_ACCENT} strokeWidth={2.5} strokeDasharray="14 52" strokeLinecap="round" />
        </g>
      )}
    </g>
  );
};
