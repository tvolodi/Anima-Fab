import manifest from "../voice/manifest.json";

/**
 * Timing, derived from REAL narration durations.
 *
 * Every cue frame is computed from voice/manifest.json plus explicit gaps -
 * never hand-typed. Re-record a line, re-run synth, and the whole episode
 * re-times itself.
 *
 * The gaps are the important part. The script is emphatic that four silences
 * must survive the edit, and they are not in the manifest - line durations are
 * speech only. Packing lines end to end would destroy the episode.
 */

export const FPS = 30;
export const s = (seconds: number) => Math.round(seconds * FPS);

type LineId = keyof typeof manifest.lines;

const dur = (id: string): number => {
  const line = (manifest.lines as Record<string, { durationSeconds: number | null }>)[id];
  if (!line?.durationSeconds) {
    throw new Error(
      `No duration for line "${id}". Run: node tools/tts/synth.mjs ep01-nobody-has-seen-it`,
    );
  }
  return line.durationSeconds;
};

/**
 * Silence AFTER each line, in seconds.
 *
 * Default is a short breath. The four named silences from the script get much
 * more, and are marked so nobody trims them by accident.
 */
const BREATH = 0.45;

const GAP_AFTER: Record<string, number> = {
  // SILENCE 1 - the opening dot, before "Кто-то знает, как это происходит."
  n01: 2.2,
  n02: 1.0,
  n03: 1.4,

  // Act 1 - a beat after each testimony lands, so the diagrams can settle.
  o02: 1.6,
  n05: 1.2,
  s03: 1.2,
  n07: 1.2,
  // The 2019 line needs air after it or the joke has nowhere to sit.
  n09: 2.0,

  n10: 0.9,
  // SILENCE 2 - the empty fourth lane. The most important silence in the
  // episode. The script: "hold 2s on the emptiness". Do NOT trim.
  n11: 1.2,
  n12: 2.4,

  // SILENCE 3 - two full seconds on the mismatch, before "Здесь никто не врёт."
  n14: 2.4,
  n15: 1.2,
  n18: 1.0,
  n19: 0.8,
  n20: 1.8,

  // Act 3 - the token stalls and waits; the pauses carry the cost.
  n22: 1.0,
  n23: 0.9,
  n24: 1.0,
  n25: 1.4,
  // The new hire's line, then hold on him waiting.
  h01: 2.6,

  n26: 1.0,
  n27: 0.8,
  // SILENCE 4 - 1.5s on the half-drawn arrow at "а кто говорит айтишникам?"
  n28: 0.9,
  n29: 1.8,
  n30: 0.5,
  n31: 1.6,

  n32: 0.8,
};

/** Playback order. Ids must exist in the manifest. */
export const ORDER: string[] = [
  "n01", "n02", "n03",
  "n04", "o01", "o02", "n05",
  "n06", "s01", "s02", "s03", "n07",
  "n08", "d01", "n09",
  "n10", "n11", "n12",
  "n13", "n14", "n15", "n16", "n17", "n18", "n19", "n20",
  "n21", "n22", "n23", "n24", "n25", "h01",
  "n26", "n27", "n28", "n29", "n30", "n31",
  "n32", "n33",
];

export interface Cue {
  id: string;
  /** Frame the line starts on. */
  start: number;
  /** Frame the line stops speaking. */
  end: number;
  /** Frame the next line starts (end + gap). */
  next: number;
  durationFrames: number;
}

const built: Record<string, Cue> = {};
let cursor = 0;
for (const id of ORDER) {
  const d = s(dur(id));
  const gap = s(GAP_AFTER[id] ?? BREATH);
  built[id] = {
    id,
    start: cursor,
    end: cursor + d,
    next: cursor + d + gap,
    durationFrames: d,
  };
  cursor += d + gap;
}

export const CUE = built;
export const EPISODE_FRAMES = cursor;

/** Frame a line starts on. Use this instead of magic numbers. */
export const at = (id: string): number => {
  const c = CUE[id];
  if (!c) throw new Error(`Unknown line id "${id}"`);
  return c.start;
};

/** Frame a line finishes speaking. */
export const after = (id: string): number => {
  const c = CUE[id];
  if (!c) throw new Error(`Unknown line id "${id}"`);
  return c.end;
};

/** Act boundaries, derived from the first and last line of each act. */
const actOf = (id: string): string =>
  (manifest.lines as Record<string, { act: string }>)[id]?.act ?? "";

const actRange = (act: string) => {
  const ids = ORDER.filter((id) => actOf(id) === act);
  const first = ids[0];
  const last = ids[ids.length - 1];
  if (!first || !last) return { start: 0, end: 0, duration: 0 };
  const start = CUE[first]!.start;
  const end = CUE[last]!.next;
  return { start, end, duration: end - start };
};

export const ACTS = {
  coldOpen: actRange("cold-open"),
  olga: actRange("act1-olga"),
  sergey: actRange("act1-sergey"),
  director: actRange("act1-director"),
  fourth: actRange("act1-fourth"),
  act2: actRange("act2"),
  act3: actRange("act3"),
  act4: actRange("act4"),
  close: actRange("close"),
} as const;

/**
 * Act 2 cue names, kept as a named export so act components read the same way
 * they did before timing became manifest-driven.
 */
export const ACT2 = {
  DURATION: ACTS.act2.duration,
  FOUR_PEOPLE: at("n13") - ACTS.act2.start,
  OVERLAY_MOVE_START: at("n14") - ACTS.act2.start,
  SILENCE_START: after("n14") - ACTS.act2.start,
  NOBODY_LYING: at("n15") - ACTS.act2.start,
  OLGA_CLAUSE: at("n16") - ACTS.act2.start,
  SERGEY_CLAUSE: at("n16") - ACTS.act2.start + s(4),
  DIRECTOR_CLAUSE: at("n16") - ACTS.act2.start + s(8),
  MANAGER_CLAUSE: at("n17") - ACTS.act2.start,
  ALL_RIGHT: at("n18") - ACTS.act2.start,
  AUDITED_CLAUSE: at("n19") - ACTS.act2.start,
  GAP_REVEAL: at("n19") - ACTS.act2.start + s(4),
  THREE_DAYS: at("n20") - ACTS.act2.start,
} as const;
