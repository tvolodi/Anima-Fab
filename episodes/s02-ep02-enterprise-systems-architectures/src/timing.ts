import manifest from "../voice/manifest.json";

/**
 * Timing, derived from REAL narration durations (see ep01's timing.ts for
 * the base pattern). Every line's speech duration comes from
 * voice/manifest.json - never hand-typed - so re-recording a line and
 * re-running synth re-times the whole episode's line cues automatically.
 *
 * IMPORTANT, learned the hard way on this file's first draft: narration
 * total (75.0s across 17 lines) is NOT the episode length, the same lesson
 * docs/VOICE.md states for ep01 ("never by packing lines end to end"). This
 * episode is visual-first - extractions, merges, a 15-line mesh draw-in -
 * and those animations need room independent of how short the narration is.
 * The first draft here packed lines with small fixed gaps and produced a
 * 103s episode against a 195s/~3:15 script target - half the intended
 * length, with several acts shorter than their own internal animation.
 *
 * Fix: each act has a FIXED TARGET WIDTH (seconds), taken from the script's
 * original hand-typed act durations (the ones that produced a well-paced
 * 195s draft before narration existed). Narration lines are placed inside
 * that fixed width, anchored to when their caption should read - not used
 * to derive the width. Leftover width becomes a hold at the act's end.
 *
 * Every act-internal cue name below (act1Caption1, act2ExtractGui, ...) is
 * preserved from the original hand-typed draft so none of the act .tsx files
 * needed to change - only what frame each name resolves to.
 */

export const FPS = 30;
export const s = (seconds: number) => Math.round(seconds * FPS);

type LineId = keyof typeof manifest.lines;

const dur = (id: LineId): number => {
  const line = manifest.lines[id];
  if (!line?.durationSeconds) {
    throw new Error(
      `No duration for line "${id}". Run: node tools/tts/synth.mjs s02-ep02-enterprise-systems-architectures`,
    );
  }
  return line.durationSeconds;
};

/** Fixed act widths in seconds, carried over from the script's original hand-typed pacing. */
const ACT_WIDTH_S: Record<string, number> = {
  coldOpen: 12,
  act1: 20,
  act2: 26,
  act3: 27,
  act4: 25,
  act5: 25,
  act6: 25,
  act7: 25,
  close: 10,
};

interface Cue {
  id: LineId;
  start: number;
  end: number;
  durationFrames: number;
}

const CUE: Partial<Record<LineId, Cue>> = {};

/**
 * Places lines within [actStartFrame, actStartFrame + width), at the given
 * offsets (seconds from act start). Offsets come from the script's original
 * within-act beat timestamps, so relative pacing between narration and
 * on-screen action matches the hand-typed draft even though absolute frames
 * are now act-relative-plus-cursor rather than typed directly.
 */
const place = (id: LineId, actStartFrame: number, offsetS: number): number => {
  const start = actStartFrame + s(offsetS);
  const end = start + s(dur(id));
  CUE[id] = { id, start, end, durationFrames: end - start };
  return start;
};

// --- Cold open ---
const coldOpenStart = 0;
place("n01", coldOpenStart, 3.0);

// --- Act 1 ---
const act1Start = coldOpenStart + s(ACT_WIDTH_S.coldOpen!);
place("n02", act1Start, 4.0);
place("n03", act1Start, 10.5);

// --- Act 2 ---
const act2Start = act1Start + s(ACT_WIDTH_S.act1!);
place("n04", act2Start, 2.0);
place("n05", act2Start, 8.0);
place("n06", act2Start, 15.0);

// --- Act 3 ---
const act3Start = act2Start + s(ACT_WIDTH_S.act2!);
place("n07", act3Start, 8.0);
place("n08", act3Start, 17.0);

// --- Act 4 ---
const act4Start = act3Start + s(ACT_WIDTH_S.act3!);
place("n09", act4Start, 6.0);
place("n10", act4Start, 14.0);

// --- Act 5 ---
const act5Start = act4Start + s(ACT_WIDTH_S.act4!);
place("n11", act5Start, 3.0);
place("n12", act5Start, 13.0);

// --- Act 6 ---
// n14 (the count-up payoff line, 7.8s long) is placed so it finishes with
// a 3s hold before the act ends, rather than at a fixed offset like the
// other lines - its own length has to be subtracted from the act width, not
// just a flat trailing gap, or a long line overruns the act boundary.
const act6Start = act5Start + s(ACT_WIDTH_S.act5!);
const ACT6_TRAILING_HOLD_S = 3.0;
const act6LinesEndOffsetS = ACT_WIDTH_S.act6! - ACT6_TRAILING_HOLD_S - dur("n14");
place("n13", act6Start, 3.0);
place("n14", act6Start, act6LinesEndOffsetS);

// --- Act 7 ---
const act7Start = act6Start + s(ACT_WIDTH_S.act6!);
place("n15", act7Start, 4.0);
place("n16", act7Start, 12.0);

// --- Close ---
const closeStart = act7Start + s(ACT_WIDTH_S.act7!);
place("n17", closeStart, 2.5);

const CLOSE_HOLD_AFTER_LINE = s(2.0);
const END_CARD_LEAD = s(0.8);
const END_CARD_HOLD = s(3.0);
const episodeEnd = CUE.n17!.end + CLOSE_HOLD_AFTER_LINE + END_CARD_LEAD + END_CARD_HOLD;

/** Frame a line starts on. */
const at_ = (id: LineId): number => {
  const c = CUE[id];
  if (!c) throw new Error(`Unknown line id "${id}"`);
  return c.start;
};

/** Frame a line finishes speaking. */
const after = (id: LineId): number => {
  const c = CUE[id];
  if (!c) throw new Error(`Unknown line id "${id}"`);
  return c.end;
};

/** Every named beat the act components read, mapped onto real narration-derived frames. */
const BEAT_F: Record<string, number> = {
  // Cold open
  coldOpenBlobIn: 0,
  coldOpenCaption: at_("n01"),
  titleCard: after("n01") + s(0.6),

  // Act 1 - pulling the OS out
  act1BlobReturn: act1Start,
  act1Caption1: at_("n02"),
  act1Extract: after("n02") + s(0.2),
  act1Caption2: at_("n03"),
  act1Hold: after("n03"),

  // Act 2 - DBMS and GUI, same move twice
  act2Caption1: at_("n04"),
  act2ExtractDbms: after("n04") + s(0.2),
  act2DbmsAside: at_("n05") - s(0.5),
  act2Caption2: at_("n05"),
  act2ExtractGui: after("n05") + s(0.2),
  act2Caption3: at_("n06"),

  // Act 3 - the blob grows back, at a bigger scale
  act3AnchorDock: act3Start,
  act3BoxesIn: act3Start + s(1),
  act3Caption1: at_("n07"),
  act3TokenDesync: after("n07") + s(0.3),
  act3Caption2: at_("n08"),
  act3TokenChange: at_("n08") + s(0.5),

  // Act 4 - ERP: one extraction, enterprise scale
  act4Merge: act4Start,
  act4Caption1: at_("n09"),
  act4TokenPulse: after("n09") + s(0.3),
  act4Caption2: at_("n10"),
  act4AnchorHighlight: at_("n10"),

  // Act 5 - and it happens again: SCM and CRM
  act5ErpShrink: act5Start,
  act5Caption1: at_("n11"),
  act5NewBoxesIn: at_("n11") + s(0.5),
  act5TokenDesync: after("n11") + s(0.3),
  act5Caption2: at_("n12"),

  // Act 6 - point-to-point: wiring it by hand
  act6SixBoxesIn: act6Start,
  act6Caption1: at_("n13"),
  act6LinesStart: after("n13") + s(0.3),
  act6LinesEnd: at_("n14"),
  act6Caption2: at_("n14"),

  // Act 7 - hub-and-spoke: same coupling, relocated
  act7Retract: act7Start,
  act7Caption1: at_("n15"),
  act7RoutePulse: after("n15") + s(0.3),
  act7Caption2: at_("n16"),
  act7RulesTangle: at_("n16") + s(0.8),

  // Close
  closeDiagramIn: closeStart,
  closeCaption: at_("n17"),
  endCard: after("n17") + END_CARD_LEAD,
};

export type BeatId = keyof typeof BEAT_F;

/** Frame at which a named beat fires. */
export const at = (id: BeatId): number => {
  const f = BEAT_F[id];
  if (f === undefined) throw new Error(`Unknown beat "${id}"`);
  return f;
};

export const EPISODE_FRAMES = episodeEnd;

/** Playback order for narration <Audio> sequencing in Episode.tsx. */
export const ORDER: LineId[] = [
  "n01",
  "n02", "n03",
  "n04", "n05", "n06",
  "n07", "n08",
  "n09", "n10",
  "n11", "n12",
  "n13", "n14",
  "n15", "n16",
  "n17",
];

export { CUE };

/** Absolute [start, end) frame ranges for each act - used by Episode.tsx windows. */
export const ACTS = {
  coldOpen: { start: coldOpenStart, end: act1Start },
  act1: { start: act1Start, end: act2Start },
  act2: { start: act2Start, end: act3Start },
  act3: { start: act3Start, end: act4Start },
  act4: { start: act4Start, end: act5Start },
  act5: { start: act5Start, end: act6Start },
  act6: { start: act6Start, end: act7Start },
  act7: { start: act7Start, end: closeStart },
  close: { start: closeStart, end: EPISODE_FRAMES },
} as const;
