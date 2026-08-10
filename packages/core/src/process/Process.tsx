import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { layout, type LaidOutEdge, type LaidOutNode } from "./layout";
import type { Process } from "./types";
import {
  SPEAKER,
  SPEAKER_ON_LIGHT,
  VERIFIED_BORDER,
  VERIFIED_BORDER_WIDTH,
} from "../theme/colors";
import { FONT_STACK, SIZE, WEIGHT } from "../theme/type";

export interface ProcessViewProps {
  process: Process;
  /**
   * Frame at which each cue fires, keyed by cue name. Elements without a cue
   * are visible from frame 0. This is how "each box lands exactly on the word
   * that names it" gets expressed - the episode owns the timing, core owns
   * the drawing.
   */
  cues?: Record<string, number>;
  /** Reveal everything regardless of cues - useful for stills and layout work. */
  revealAll?: boolean;
  opacity?: number;
  light?: boolean;
  /** Draw the audited frame. Defaults to process.audited. */
  showVerified?: boolean;
  /** Act 3: this correct diagram is briefly blamed. */
  blamed?: boolean;
  /**
   * Per-node opacity multiplier, keyed by node id.
   *
   * Sergey's "Заявка" box dims to near-invisible on "если я знаю заранее" - the
   * request exists in his telling, but nobody ever sends it. That is a
   * dimming, not a removal: the box must stay faintly visible.
   */
  nodeOpacity?: Record<string, number>;
}

const APPEAR_FRAMES = 9;

export const ProcessView: React.FC<ProcessViewProps> = ({
  process,
  cues = {},
  revealAll = false,
  opacity = 1,
  light = false,
  showVerified,
  blamed = false,
  nodeOpacity,
}) => {
  const frame = useCurrentFrame();
  const laid = React.useMemo(() => layout(process), [process]);
  const palette = light ? SPEAKER_ON_LIGHT : SPEAKER;
  const c = palette[process.color];
  const verified = showVerified ?? process.audited;

  const appear = (cue: string | undefined): number => {
    if (revealAll || !cue) return 1;
    const at = cues[cue];
    if (at === undefined) return 1;
    return interpolate(frame, [at, at + APPEAR_FRAMES], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
  };

  const pad = 26;

  return (
    <svg
      width={laid.width + pad * 2}
      height={laid.height + pad * 2}
      viewBox={`${-pad} ${-pad} ${laid.width + pad * 2} ${laid.height + pad * 2}`}
      style={{ opacity, overflow: "visible" }}
    >
      <defs>
        <marker
          id={`arrow-${process.id}`}
          viewBox="0 0 10 10"
          refX="9"
          refY="5"
          markerWidth="6"
          markerHeight="6"
          orient="auto-start-reverse"
        >
          <path d="M 0 0 L 10 5 L 0 10 z" fill={c.line} />
        </marker>
      </defs>

      {verified && (
        <rect
          x={-pad + 4}
          y={-pad + 4}
          width={laid.width + pad * 2 - 8}
          height={laid.height + pad * 2 - 8}
          fill="none"
          stroke={blamed ? "#C4544F" : VERIFIED_BORDER}
          strokeWidth={VERIFIED_BORDER_WIDTH}
          strokeDasharray="2 6"
          opacity={blamed ? 1 : 0.5}
          rx={6}
        />
      )}

      {laid.edges.map((e, i) => (
        <EdgeShape
          key={`${e.from}-${e.to}-${i}`}
          edge={e}
          color={c.line}
          markerId={`arrow-${process.id}`}
          opacity={appear(e.cue)}
          labelColor={c.text}
        />
      ))}

      {laid.nodes.map((n) => (
        <NodeShape
          key={n.id}
          node={n}
          c={c}
          opacity={appear(n.cue) * (nodeOpacity?.[n.id] ?? 1)}
        />
      ))}
    </svg>
  );
};

const EdgeShape: React.FC<{
  edge: LaidOutEdge;
  color: string;
  markerId: string;
  opacity: number;
  labelColor: string;
}> = ({ edge, color, markerId, opacity, labelColor }) => {
  if (edge.points.length < 2) return null;
  const d = edge.points
    .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`)
    .join(" ");

  const mid = edge.points[Math.floor(edge.points.length / 2)];
  // A from-nowhere edge fades in from its origin: it should feel like it
  // arrived rather than was drawn.
  const dash = edge.fromNowhere ? "7 7" : undefined;

  return (
    <g opacity={opacity}>
      <path
        d={d}
        fill="none"
        stroke={color}
        strokeWidth={2}
        strokeDasharray={dash}
        markerEnd={edge.toNowhere ? undefined : `url(#${markerId})`}
        opacity={edge.toNowhere || edge.fromNowhere ? 0.75 : 1}
      />
      {edge.label && mid && (
        <text
          x={mid.x}
          y={mid.y - 10}
          fill={labelColor}
          fontFamily={FONT_STACK}
          fontSize={SIZE.edgeLabel}
          textAnchor="middle"
        >
          {edge.label}
        </text>
      )}
    </g>
  );
};

const NodeShape: React.FC<{
  node: LaidOutNode;
  c: { line: string; fill: string; text: string };
  opacity: number;
}> = ({ node, c, opacity }) => {
  const cx = node.x + node.w / 2;
  const cy = node.y + node.h / 2;

  if (node.kind === "start" || node.kind === "end") {
    const r = 30;
    return (
      <g opacity={opacity}>
        <circle
          cx={cx}
          cy={cy}
          r={r}
          fill={c.fill}
          stroke={c.line}
          strokeWidth={node.kind === "end" ? 4 : 2}
        />
        <Label node={node} c={c} y={cy + r + 26} />
      </g>
    );
  }

  if (node.kind === "gateway") {
    const s = 40;
    return (
      <g opacity={opacity}>
        <path
          d={`M ${cx} ${cy - s} L ${cx + s} ${cy} L ${cx} ${cy + s} L ${cx - s} ${cy} Z`}
          fill={c.fill}
          stroke={c.line}
          strokeWidth={2}
        />
        <Label node={node} c={c} y={cy + s + 26} />
      </g>
    );
  }

  return (
    <g opacity={opacity}>
      <rect
        x={node.x}
        y={node.y}
        width={node.w}
        height={node.h}
        rx={8}
        fill={c.fill}
        stroke={c.line}
        strokeWidth={2}
        strokeDasharray={node.kind === "dangling" ? "6 6" : undefined}
      />
      <WrappedLabel node={node} c={c} />
    </g>
  );
};

const Label: React.FC<{
  node: LaidOutNode;
  c: { text: string };
  y: number;
}> = ({ node, c, y }) => (
  <text
    x={node.x + node.w / 2}
    y={y}
    fill={c.text}
    fontFamily={FONT_STACK}
    fontSize={SIZE.nodeLabel}
    fontWeight={WEIGHT.medium}
    textAnchor="middle"
  >
    {node.label}
  </text>
);

/**
 * Two-line wrap that also shrinks to fit.
 *
 * Cyrillic labels here ("Личная карточка", "Трудовая книжка") are longer than
 * their English equivalents, so a fixed char threshold overflows the box. This
 * estimates width from an average glyph ratio and steps the font size down
 * until the longest line fits. Approximate by design - SVG has no measurement
 * available at render time without a DOM round-trip, and the labels are short.
 */
const CHAR_W_RATIO = 0.58; // avg advance width / font-size for this stack
const LABEL_PAD = 18;

const WrappedLabel: React.FC<{
  node: LaidOutNode;
  c: { text: string };
}> = ({ node, c }) => {
  const avail = node.w - LABEL_PAD * 2;

  const wrapAt = (size: number): string[] => {
    const maxChars = Math.max(6, Math.floor(avail / (size * CHAR_W_RATIO)));
    const words = node.label.split(" ");
    const lines: string[] = [];
    let current = "";
    for (const w of words) {
      if ((current + " " + w).trim().length > maxChars && current) {
        lines.push(current.trim());
        current = w;
      } else {
        current = (current + " " + w).trim();
      }
    }
    if (current) lines.push(current);
    return lines;
  };

  // Step down until it fits in two lines and within the box width.
  let size = SIZE.nodeLabel;
  let lines = wrapAt(size);
  while (size > 13) {
    const widest = Math.max(...lines.map((l) => l.length)) * size * CHAR_W_RATIO;
    if (lines.length <= 2 && widest <= avail) break;
    size -= 1;
    lines = wrapAt(size);
  }

  const lh = size * 1.22;
  const cx = node.x + node.w / 2;
  const startY = node.y + node.h / 2 - ((lines.length - 1) * lh) / 2 + size * 0.34;

  return (
    <>
      {lines.map((line, i) => (
        <text
          key={i}
          x={cx}
          y={startY + i * lh}
          fill={c.text}
          fontFamily={FONT_STACK}
          fontSize={size}
          fontWeight={WEIGHT.medium}
          textAnchor="middle"
        >
          {line}
        </text>
      ))}
    </>
  );
};
