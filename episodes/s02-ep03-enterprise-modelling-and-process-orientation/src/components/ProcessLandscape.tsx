import React from "react";
import { interpolate } from "remotion";
import { colors, type as typo } from "@anima/core";

/**
 * Fig 2.14's shape: five opaque blocks in a left-to-right chain (Innovation
 * -> Product Planning -> Product Development -> Marketing -> Order
 * Management), plus a sixth (After-Sales Service) sitting below with a
 * feedback arrow into Order Management's upstream side.
 *
 * Per the script's Implementation Notes, @anima/core's `layout()` is tuned
 * for BPMN node/edge graphs (start/task/gateway/end shapes, a row-cursor
 * chain-plus-branch algorithm) and isn't a natural fit for six fixed opaque
 * rectangular blocks with one feedback edge - hand-placed positions here are
 * less trouble than adapting layout.ts for a shape it wasn't designed for,
 * per the script's own reasoning. Small, fixed scope (six blocks, not
 * N-scalable) makes this a reasonable one-off.
 */

export interface LandscapeBlock {
  id: string;
  label: string;
}

const CHAIN_Y = 460;
const CHAIN_H = 130;
const CHAIN_W = 230;
const CHAIN_GAP = 90;
const CHAIN_X0 = 210;

const FEEDBACK_Y = 700;
const FEEDBACK_W = 260;
const FEEDBACK_H = 120;

export const LANDSCAPE_CHAIN: LandscapeBlock[] = [
  { id: "innovation", label: "Innovation" },
  { id: "planning", label: "Product Planning" },
  { id: "development", label: "Product Development" },
  { id: "marketing", label: "Marketing" },
  { id: "orders", label: "Order Management" },
];

export const LANDSCAPE_FEEDBACK: LandscapeBlock = { id: "afterSales", label: "After-Sales Service" };

export const landscapeBlockRect = (index: number) => ({
  x: CHAIN_X0 + index * (CHAIN_W + CHAIN_GAP),
  y: CHAIN_Y,
  w: CHAIN_W,
  h: CHAIN_H,
});

export const landscapeFeedbackRect = () => {
  const ordersRect = landscapeBlockRect(LANDSCAPE_CHAIN.length - 1);
  return {
    x: ordersRect.x - (FEEDBACK_W - CHAIN_W) / 2,
    y: FEEDBACK_Y,
    w: FEEDBACK_W,
    h: FEEDBACK_H,
  };
};

export const ProcessLandscape: React.FC<{
  /** 0..1 - blocks and solid dependency arrows draw in. */
  blocksInT: number;
  /** 0..1 - dims a specific block (by id) when its ProcessCard reveal is pulling it forward. */
  hiddenBlockId?: string;
  /** 0..1 - dependency arrows pulse once, in sequence, left to right then feedback last. */
  arrowsPulseT: number;
}> = ({ blocksInT, hiddenBlockId, arrowsPulseT }) => {
  const n = LANDSCAPE_CHAIN.length;

  const pulseWindow = (i: number, total: number) => {
    const lo = i / total;
    const hi = (i + 0.6) / total;
    return interpolate(arrowsPulseT, [lo, hi], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
  };

  return (
    <svg width={1920} height={1080} style={{ position: "absolute", overflow: "visible" }}>
      {/* Solid dependency arrows between chain blocks - fully connected,
          unlike Act 1's deliberately-unresolved dotted attempt. */}
      <g opacity={blocksInT}>
        {LANDSCAPE_CHAIN.slice(0, -1).map((block, i) => {
          const from = landscapeBlockRect(i);
          const to = landscapeBlockRect(i + 1);
          const pulse = pulseWindow(i, n);
          const x1 = from.x + from.w;
          const x2 = to.x;
          const y = from.y + from.h / 2;
          return (
            <g key={`edge-${block.id}`}>
              <line
                x1={x1}
                y1={y}
                x2={x2}
                y2={y}
                stroke={colors.SPEAKER.neutral.line}
                strokeWidth={2}
                opacity={0.6}
                markerEnd="url(#landscapeArrow)"
              />
              <line
                x1={x1}
                y1={y}
                x2={x2}
                y2={y}
                stroke={colors.SPEAKER.amber.line}
                strokeWidth={3.5}
                opacity={pulse > 0.05 && pulse < 0.98 ? 0.9 : 0}
              />
            </g>
          );
        })}

        {/* Feedback arrow: After-Sales Service -> back into Order
            Management's upstream side (script: "feeding back into Order
            Management's upstream side"). Routed as a polyline under the
            chain, entering Order Management from below-left rather than
            straight up, so it reads as feeding the same node the chain
            already flows toward rather than crossing through it. */}
        {(() => {
          const orders = landscapeBlockRect(n - 1);
          const fb = landscapeFeedbackRect();
          const startX = fb.x + fb.w / 2;
          const startY = fb.y;
          const midY = (fb.y + orders.y + orders.h) / 2 + 30;
          const endX = orders.x + orders.w * 0.28;
          const endY = orders.y + orders.h;
          const pulse = pulseWindow(n, n + 1);
          return (
            <g>
              <polyline
                points={`${startX},${startY} ${startX},${midY} ${endX},${midY} ${endX},${endY}`}
                fill="none"
                stroke={colors.SPEAKER.neutral.line}
                strokeWidth={2}
                opacity={0.55}
                markerEnd="url(#landscapeArrow)"
              />
              <polyline
                points={`${startX},${startY} ${startX},${midY} ${endX},${midY} ${endX},${endY}`}
                fill="none"
                stroke={colors.SPEAKER.amber.line}
                strokeWidth={3.5}
                opacity={pulse > 0.05 && pulse < 0.98 ? 0.9 : 0}
              />
            </g>
          );
        })()}
      </g>

      <defs>
        <marker id="landscapeArrow" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto">
          <path d="M0,0 L8,3 L0,6 Z" fill={colors.SPEAKER.neutral.line} opacity={0.7} />
        </marker>
      </defs>

      {/* Chain blocks, opaque. */}
      <g opacity={blocksInT}>
        {LANDSCAPE_CHAIN.map((block, i) => {
          const r = landscapeBlockRect(i);
          const dim = hiddenBlockId === block.id ? 0 : 1;
          return (
            <g key={block.id} opacity={dim}>
              <rect
                x={r.x}
                y={r.y}
                width={r.w}
                height={r.h}
                rx={10}
                fill={colors.SPEAKER.neutral.fill}
                stroke={colors.SPEAKER.neutral.line}
                strokeWidth={2}
              />
              <text
                x={r.x + r.w / 2}
                y={r.y + r.h / 2}
                fill={colors.SPEAKER.neutral.text}
                fontFamily={typo.FONT_STACK}
                fontSize={19}
                fontWeight={500}
                textAnchor="middle"
                dominantBaseline="central"
              >
                {block.label}
              </text>
            </g>
          );
        })}

        {/* After-Sales Service, below the chain. */}
        {(() => {
          const r = landscapeFeedbackRect();
          return (
            <g>
              <rect
                x={r.x}
                y={r.y}
                width={r.w}
                height={r.h}
                rx={10}
                fill={colors.SPEAKER.neutral.fill}
                stroke={colors.SPEAKER.neutral.line}
                strokeWidth={2}
              />
              <text
                x={r.x + r.w / 2}
                y={r.y + r.h / 2}
                fill={colors.SPEAKER.neutral.text}
                fontFamily={typo.FONT_STACK}
                fontSize={19}
                fontWeight={500}
                textAnchor="middle"
                dominantBaseline="central"
              >
                {LANDSCAPE_FEEDBACK.label}
              </text>
            </g>
          );
        })()}
      </g>
    </svg>
  );
};
