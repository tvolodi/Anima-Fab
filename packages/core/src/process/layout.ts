import type { Process, ProcessNode } from "./types";

export interface LaidOutNode extends ProcessNode {
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface LaidOutEdge {
  from: string;
  to: string;
  label?: string;
  cue?: string;
  fromNowhere?: boolean;
  toNowhere?: boolean;
  /** Polyline points in diagram space. */
  points: Array<{ x: number; y: number }>;
}

export interface LaidOutProcess {
  process: Process;
  nodes: LaidOutNode[];
  edges: LaidOutEdge[];
  width: number;
  height: number;
}

export const NODE_W = 190;
export const NODE_H = 78;
export const GAP_X = 68;
export const GAP_Y = 116;
/** How far a from-nowhere / to-nowhere edge extends past the diagram. */
export const NOWHERE_LEN = 130;

/**
 * Start/end circles (r=30) and gateway diamonds (half-width 40) are drawn
 * SMALLER than the NODE_W x NODE_H box they're centered in - see
 * `NodeShape` in Process.tsx. Edge routing used to exit/enter at the box
 * edge regardless of shape, which left a visible gap between the arrow and
 * the circle/diamond outline for every start, end, and gateway node.
 * These must match Process.tsx's NodeShape exactly, or the gap reopens.
 */
const CIRCLE_R = 30;
const GATEWAY_HALF = 40;

/**
 * Left-to-right layout with branches dropping to rows below.
 *
 * Deliberately simple: main path on row 0, anything reached from an
 * already-placed node that doesn't fit the chain goes to the next row.
 * Good enough for 2-7 box diagrams. If an episode needs real graph layout,
 * that's the moment to reach for elkjs - not before.
 */
export function layout(process: Process): LaidOutProcess {
  const placed = new Map<string, LaidOutNode>();
  const rowCursor: number[] = [];

  const outgoing = new Map<string, string[]>();
  for (const e of process.edges) {
    if (e.fromNowhere || e.toNowhere) continue;
    const list = outgoing.get(e.from) ?? [];
    list.push(e.to);
    outgoing.set(e.from, list);
  }

  const indegree = new Map<string, number>();
  for (const n of process.nodes) indegree.set(n.id, 0);
  for (const e of process.edges) {
    if (e.fromNowhere || e.toNowhere) continue;
    indegree.set(e.to, (indegree.get(e.to) ?? 0) + 1);
  }

  const roots = process.nodes.filter((n) => (indegree.get(n.id) ?? 0) === 0);
  const queue: Array<{ id: string; row: number }> = (
    roots.length > 0 ? roots : process.nodes.slice(0, 1)
  ).map((n) => ({ id: n.id, row: 0 }));

  const seen = new Set<string>();

  while (queue.length > 0) {
    const item = queue.shift();
    if (!item) break;
    const { id, row } = item;
    if (seen.has(id)) continue;
    seen.add(id);

    const node = process.nodes.find((n) => n.id === id);
    if (!node) continue;

    const col = rowCursor[row] ?? 0;
    rowCursor[row] = col + 1;

    // Direction decides which axis the chain advances along. "tb" runs the
    // chain downward and puts branches to the side - see FlowDirection.
    const dir = process.direction ?? "lr";
    let x: number;
    let y: number;
    if (dir === "tb") {
      x = row * (NODE_W + GAP_X);
      y = col * (NODE_H + GAP_Y);
    } else {
      x = col * (NODE_W + GAP_X);
      y = row * (NODE_H + GAP_Y);
    }

    placed.set(id, {
      ...node,
      x: node.at?.x ?? x,
      y: node.at?.y ?? y,
      w: NODE_W,
      h: NODE_H,
    });

    const children = outgoing.get(id) ?? [];
    children.forEach((childId, i) => {
      // First child continues the row; siblings drop to a new row (a branch).
      queue.push({ id: childId, row: i === 0 ? row : row + 1 });
    });
  }

  // Anything unreachable (disconnected fragments in someone's telling) still
  // gets placed - it is often the point.
  for (const n of process.nodes) {
    if (placed.has(n.id)) continue;
    const row = rowCursor.length;
    rowCursor[row] = 1;
    placed.set(n.id, {
      ...n,
      x: n.at?.x ?? 0,
      y: n.at?.y ?? row * (NODE_H + GAP_Y),
      w: NODE_W,
      h: NODE_H,
    });
  }

  const nodes = [...placed.values()];
  const edges = process.edges.map((e) =>
    routeEdge(e, placed, process.direction ?? "lr"),
  );

  const width = Math.max(...nodes.map((n) => n.x + n.w), NODE_W);
  const height = Math.max(...nodes.map((n) => n.y + n.h), NODE_H);

  return { process, nodes, edges, width, height };
}

function routeEdge(
  e: Process["edges"][number],
  placed: Map<string, LaidOutNode>,
  dir: "lr" | "tb" | "rl",
): LaidOutEdge {
  const base = {
    from: e.from,
    to: e.to,
    label: e.label,
    cue: e.cue,
    fromNowhere: e.fromNowhere,
    toNowhere: e.toNowhere,
  };

  const target = placed.get(e.to);
  const source = placed.get(e.from);
  const vertical = dir === "tb";

  /**
   * How far a node's visual boundary sits inset from its box edge, along the
   * flow axis - 0 for rectangles (task/dangling), which already draw at the
   * box edge. Must track NodeShape in Process.tsx.
   */
  const inset = (n: LaidOutNode): number => {
    if (n.kind === "start" || n.kind === "end") return n.w / 2 - CIRCLE_R;
    if (n.kind === "gateway") return n.w / 2 - GATEWAY_HALF;
    return 0;
  };

  /** Exit point of a node, along the flow axis. */
  const exit = (n: LaidOutNode) =>
    vertical
      ? { x: n.x + n.w / 2, y: n.y + n.h - inset(n) }
      : { x: n.x + n.w - inset(n), y: n.y + n.h / 2 };

  /** Entry point of a node, along the flow axis. */
  const enter = (n: LaidOutNode) =>
    vertical
      ? { x: n.x + n.w / 2, y: n.y + inset(n) }
      : { x: n.x + inset(n), y: n.y + n.h / 2 };

  if (e.fromNowhere && target) {
    // Arrives from off-frame. No source node - that is the meaning.
    const end = enter(target);
    const from = vertical
      ? { x: end.x, y: end.y - NOWHERE_LEN }
      : { x: end.x - NOWHERE_LEN, y: end.y };
    return { ...base, points: [from, end] };
  }

  if (e.toNowhere && source) {
    const start = exit(source);
    const to = vertical
      ? { x: start.x, y: start.y + NOWHERE_LEN }
      : { x: start.x + NOWHERE_LEN, y: start.y };
    return { ...base, points: [start, to] };
  }

  if (!source || !target) return { ...base, points: [] };

  const start = exit(source);
  const end = enter(target);

  // Straight along the flow axis; otherwise step through a midpoint.
  const offAxisDelta = vertical
    ? Math.abs(start.x - end.x)
    : Math.abs(start.y - end.y);
  if (offAxisDelta < 1) {
    return { ...base, points: [start, end] };
  }

  if (vertical) {
    const midY = start.y + (end.y - start.y) / 2;
    return {
      ...base,
      points: [start, { x: start.x, y: midY }, { x: end.x, y: midY }, end],
    };
  }
  const midX = start.x + (end.x - start.x) / 2;
  return {
    ...base,
    points: [start, { x: midX, y: start.y }, { x: midX, y: end.y }, end],
  };
}

/** Total length of a polyline - used to walk a token along it. */
export function polylineLength(points: Array<{ x: number; y: number }>): number {
  let total = 0;
  for (let i = 1; i < points.length; i++) {
    const a = points[i - 1];
    const b = points[i];
    if (!a || !b) continue;
    total += Math.hypot(b.x - a.x, b.y - a.y);
  }
  return total;
}

/** Point at distance `t` (0..1) along a polyline. */
export function pointAt(
  points: Array<{ x: number; y: number }>,
  t: number,
): { x: number; y: number } {
  if (points.length === 0) return { x: 0, y: 0 };
  const first = points[0];
  if (points.length === 1 || !first) return first ?? { x: 0, y: 0 };

  const total = polylineLength(points);
  if (total === 0) return first;

  let remaining = Math.max(0, Math.min(1, t)) * total;
  for (let i = 1; i < points.length; i++) {
    const a = points[i - 1];
    const b = points[i];
    if (!a || !b) continue;
    const seg = Math.hypot(b.x - a.x, b.y - a.y);
    if (remaining <= seg || i === points.length - 1) {
      const f = seg === 0 ? 0 : remaining / seg;
      return { x: a.x + (b.x - a.x) * f, y: a.y + (b.y - a.y) * f };
    }
    remaining -= seg;
  }
  return points[points.length - 1] ?? first;
}
