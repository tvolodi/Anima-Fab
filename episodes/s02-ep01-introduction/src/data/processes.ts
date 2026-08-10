import type { Process } from "@anima/core";

/**
 * The book's own running example (Weske Ch.1, Figs. 1.1-1.4), reused across
 * every act. See notes/ch01-introduction.md and scripts/s02-ep01-introduction.md.
 *
 * Per the source (P1 docx, para 41/45): the two parallel branches (Send
 * Invoice->Receive Payment, and Ship Products) both feed into an explicit
 * JOIN gateway before Archive Order - it is not Archive Order itself that
 * merges them. core's auto-layout (packages/core/src/process/layout.ts) has
 * no dedicated join-routing case, so all positions here are explicit `at`
 * overrides on a 2-row grid (row 0 = main/upper branch, row 1 = lower
 * branch) rather than left to the auto-layout, which produced tangled
 * routing when first tried (verified by rendering a still and finding the
 * join node placed mid-diagram).
 *
 * All row-0 nodes use `y: 0` regardless of kind (task/gateway/start/end) -
 * every LaidOutNode gets the same NODE_H-tall box and every shape (rect,
 * circle, diamond) is centered within its own box (see NodeShape in
 * Process.tsx), so equal `y` is what makes their visual centers align.
 * Giving gateways `y: 39` (an earlier version of this file did, to
 * "center" a smaller diamond in a wider row) actually shifted the
 * diamond's center 39px below the task row - same box height, so no
 * extra offset was ever needed.
 */

const ROW_H = 170;
const COL_W = 258;

export const reseller: Process = {
  id: "reseller",
  speaker: "Reseller",
  color: "blue",
  direction: "lr",
  audited: false,
  nodes: [
    { id: "r-start", kind: "start", label: "", at: { x: 0 * COL_W, y: 0 } },
    { id: "r-receive-order", kind: "task", label: "Receive Order", at: { x: 1 * COL_W, y: 0 } },
    { id: "r-split", kind: "gateway", label: "", at: { x: 2 * COL_W, y: 0 } },
    { id: "r-send-invoice", kind: "task", label: "Send Invoice", at: { x: 3 * COL_W, y: 0 } },
    { id: "r-receive-payment", kind: "task", label: "Receive Payment", at: { x: 4 * COL_W, y: 0 } },
    { id: "r-ship-products", kind: "task", label: "Ship Products", at: { x: 3 * COL_W, y: ROW_H } },
    { id: "r-join", kind: "gateway", label: "", at: { x: 5 * COL_W, y: 0 } },
    { id: "r-archive", kind: "task", label: "Archive Order", at: { x: 6 * COL_W, y: 0 } },
    { id: "r-end", kind: "end", label: "", at: { x: 7 * COL_W, y: 0 } },
  ],
  edges: [
    { from: "r-start", to: "r-receive-order" },
    { from: "r-receive-order", to: "r-split" },
    { from: "r-split", to: "r-send-invoice" },
    { from: "r-split", to: "r-ship-products" },
    { from: "r-send-invoice", to: "r-receive-payment" },
    { from: "r-receive-payment", to: "r-join" },
    { from: "r-ship-products", to: "r-join" },
    { from: "r-join", to: "r-archive" },
    { from: "r-archive", to: "r-end" },
  ],
};

/**
 * Reseller-A: same interaction with the buyer, sequential internals.
 * Ships only after payment clears (script Act 4 / concept card
 * realization-can-change-behind-a-stable-interface).
 */
export const resellerA: Process = {
  id: "reseller-a",
  speaker: "Reseller-A",
  color: "blue",
  direction: "lr",
  audited: false,
  nodes: [
    { id: "r-start", kind: "start", label: "", at: { x: 0 * COL_W, y: 0 } },
    { id: "r-receive-order", kind: "task", label: "Receive Order", at: { x: 1 * COL_W, y: 0 } },
    { id: "r-send-invoice", kind: "task", label: "Send Invoice", at: { x: 2 * COL_W, y: 0 } },
    { id: "r-receive-payment", kind: "task", label: "Receive Payment", at: { x: 3 * COL_W, y: 0 } },
    { id: "r-ship-products", kind: "task", label: "Ship Products", at: { x: 4 * COL_W, y: 0 } },
    { id: "r-archive", kind: "task", label: "Archive Order", at: { x: 5 * COL_W, y: 0 } },
    { id: "r-end", kind: "end", label: "", at: { x: 6 * COL_W, y: 0 } },
  ],
  edges: [
    { from: "r-start", to: "r-receive-order" },
    { from: "r-receive-order", to: "r-send-invoice" },
    { from: "r-send-invoice", to: "r-receive-payment" },
    { from: "r-receive-payment", to: "r-ship-products" },
    { from: "r-ship-products", to: "r-archive" },
    { from: "r-archive", to: "r-end" },
  ],
};

export const buyer: Process = {
  id: "buyer",
  speaker: "Buyer",
  color: "green",
  direction: "lr",
  audited: false,
  nodes: [
    { id: "b-start", kind: "start", label: "", at: { x: 0 * COL_W, y: 0 } },
    { id: "b-place-order", kind: "task", label: "Place Order", at: { x: 1 * COL_W, y: 0 } },
    { id: "b-split", kind: "gateway", label: "", at: { x: 2 * COL_W, y: 0 } },
    { id: "b-receive-invoice", kind: "task", label: "Receive Invoice", at: { x: 3 * COL_W, y: 0 } },
    { id: "b-settle-invoice", kind: "task", label: "Settle Invoice", at: { x: 4 * COL_W, y: 0 } },
    { id: "b-receive-products", kind: "task", label: "Receive Products", at: { x: 3 * COL_W, y: ROW_H } },
    { id: "b-join", kind: "gateway", label: "", at: { x: 5 * COL_W, y: 0 } },
    { id: "b-end", kind: "end", label: "", at: { x: 6 * COL_W, y: 0 } },
  ],
  edges: [
    { from: "b-start", to: "b-place-order" },
    { from: "b-place-order", to: "b-split" },
    { from: "b-split", to: "b-receive-invoice" },
    { from: "b-split", to: "b-receive-products" },
    { from: "b-receive-invoice", to: "b-settle-invoice" },
    { from: "b-settle-invoice", to: "b-join" },
    { from: "b-receive-products", to: "b-join" },
    { from: "b-join", to: "b-end" },
  ],
};

/**
 * Message flow between reseller and buyer (Fig 1.3's dotted arcs), expressed
 * as node-id pairs rather than core Process edges, since these cross between
 * two independently-laid-out diagrams - no single `layout()` call can route
 * them. Act 3 draws these itself.
 */
export interface MessageLink {
  from: string;
  to: string;
  label: string;
}

export const messageFlow: MessageLink[] = [
  { from: "b-place-order", to: "r-receive-order", label: "order" },
  { from: "r-send-invoice", to: "b-receive-invoice", label: "invoice" },
  { from: "b-settle-invoice", to: "r-receive-payment", label: "payment" },
  { from: "r-ship-products", to: "b-receive-products", label: "products" },
];

/** Just the four task labels, for Act 1's "is this a list or a process?" beat. */
export const act1ListLabels = [
  "Receive Order",
  "Send Invoice",
  "Ship Products",
  "Archive Order",
];
