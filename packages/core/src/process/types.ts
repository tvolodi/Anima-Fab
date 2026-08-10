/**
 * The process model.
 *
 * Deliberately NOT full BPMN. This is the subset an explainer video needs:
 * enough structure to lay out and animate, not enough to execute.
 * Resist adding elements until an episode actually needs them.
 */

export type NodeKind =
  | "start"
  | "task"
  | "gateway"
  | "end"
  /** A node that exists in someone's telling but connects to nothing real. */
  | "dangling";

export interface ProcessNode {
  id: string;
  kind: NodeKind;
  label: string;
  /**
   * Narration cue name. The act component maps cue -> frame, so the script's
   * "each box lands exactly on the word that names it" is expressible.
   */
  cue?: string;
  /** Manual layout override; otherwise the auto-layout decides. */
  at?: { x: number; y: number };
}

export interface ProcessEdge {
  from: string;
  to: string;
  label?: string;
  cue?: string;
  /**
   * An edge that arrives from outside the diagram with no source.
   * Sergey's "nobody sends the request - I find out when he's at the desk".
   * `from` is ignored when this is set.
   */
  fromNowhere?: boolean;
  /** An edge that leads off the diagram and stops. Pavel's arrow to nothing. */
  toNowhere?: boolean;
}

/**
 * Which way a telling runs.
 *
 * Not decoration. In the Act 2 overlay every telling laid out left-to-right
 * produces near-parallel strips, and two strips at similar heights read as ONE
 * long process rather than two conflicting accounts. Giving tellings different
 * primary axes is what makes them collide legibly.
 *
 * Also true to life: people do not all draw a process the same way round.
 */
export type FlowDirection = "lr" | "tb" | "rl";

export interface Process {
  id: string;
  /** Whose telling this is. Shown as the lower-third label. */
  speaker: string;
  /** Palette key - see theme/colors.ts */
  color: ColorKey;
  /** Layout axis. Defaults to "lr". */
  direction?: FlowDirection;
  /**
   * Whether this part of the org is externally audited.
   *
   * This is the series' central visual claim: audited processes are written
   * down and correct; unaudited ones are improvised. Renders as a thin
   * "verified" border. See docs/SERIES.md.
   */
  audited: boolean;
  nodes: ProcessNode[];
  edges: ProcessEdge[];
}

export type ColorKey = "blue" | "amber" | "green" | "neutral";

/**
 * A speaker who has no process at all.
 *
 * Episode 1's manager: a labelled empty frame, held for two seconds.
 * Modelled explicitly rather than as an empty Process so that layout and
 * overlay code can't accidentally draw something in it.
 */
export interface AbsentProcess {
  id: string;
  speaker: string;
  absent: true;
}

export type Telling = Process | AbsentProcess;

export const isAbsent = (t: Telling): t is AbsentProcess =>
  (t as AbsentProcess).absent === true;
