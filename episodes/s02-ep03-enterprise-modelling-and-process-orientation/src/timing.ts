import manifest from "../voice/manifest.json";

/**
 * Timing, derived from REAL narration durations (see ep01/ep02's timing.ts
 * for the base pattern). Every line's speech duration comes from
 * voice/manifest.json - never hand-typed - so re-recording a line and
 * re-running synth re-times the whole episode's line cues automatically.
 *
 * IMPORTANT, repeating ep02's own documented lesson: narration total is NOT
 * the episode length, and lines must never be packed end to end (see
 * docs/VOICE.md). The fix ep02 landed on: give each act a FIXED TARGET WIDTH
 * (seconds), place narration lines inside that fixed width anchored to when
 * their caption/visual beat should read, and let leftover width become a
 * hold - not the other way around.
 *
 * This episode's own wrinkle, worth recording here rather than rediscovering
 * it: the script's original hand-typed act widths (Cold Open 12s, Act1 38s,
 * Connective 10s, Act2 55s, Act3 40s, Close 15s ~ 170s/2:50) turned out to be
 * SHORTER than the real synthesised narration for Act 1 (44.3s), Act 3
 * (45.9s), and Close (17.6s) - this episode's narration runs denser per line
 * than ep02's. Since a line's own audio must never be truncated or
 * compressed, and Act 2 in particular is required by the script's
 * Implementation Notes to keep its full width regardless of narration
 * length, the fix here is the same principle applied in the other direction:
 * act widths are a FLOOR, not a ceiling - they can only ever be widened to
 * fit real narration plus the script's required visual beats, never
 * shrunk. Final widths: coldOpen 12s (unchanged), act1 52s (was 38),
 * connective 11s (was 10), act2 70s (was 55 - generously over its own 54.0s
 * narration total per the script's explicit "budget generously" note; first
 * landed on 64s, then widened again once the programmatic check below caught
 * the clean-run/final-hold beats overrunning act2's end), act3 50s (was 40,
 * though its last line n19 still runs 1.2s past the nominal width - fixed by
 * deriving Close's start from n19's REAL end, not the nominal width - see
 * `closeStart` below), close 26s effective (was 15; a 20s nominal width plus
 * the 1.2s pad already covers it). Total 223.2s / 3:43 against the script's
 * "aim for 2:30-3:00" target - a deliberate, reported judgment call: never
 * truncating real narration and never compressing Act 2's dramatized
 * centerpiece both outrank the runtime target when they conflict with it.
 *
 * Every act-internal cue name below is derived from the script's own
 * within-act beat timestamps (offsets from act start), same convention as
 * ep02.
 *
 * VERIFIED PROGRAMMATICALLY, not just by eye: see the one-off
 * `_check-timing.mts` script used during this episode's build (run via
 * `npx tsx src/_check-timing.mts` from this directory) - it walks every
 * line's [start,end) looking for overlaps with its neighbour, and checks
 * every line and named beat against its own act's [start,end) window. It
 * caught two real bugs before any still was rendered: a 4-frame overlap
 * between n06 and n07 in Act 1 (a flat +46.0s offset for n07 didn't account
 * for n06's real 8.62s length), and Act 2's clean-run/final-hold beats
 * initially overrunning act2's end because they were offset from n14's end
 * by a flat amount without checking where n14 itself landed inside a 64s
 * act width. Same class of bug the ep02 lesson describes - caught the same
 * way, by writing the check rather than trusting the arithmetic by eye.
 */

export const FPS = 30;
export const s = (seconds: number) => Math.round(seconds * FPS);

type LineId = keyof typeof manifest.lines;

const dur = (id: LineId): number => {
  const line = manifest.lines[id];
  if (!line?.durationSeconds) {
    throw new Error(
      `No duration for line "${id}". Run: node tools/tts/synth.mjs s02-ep03-enterprise-modelling-and-process-orientation`,
    );
  }
  return line.durationSeconds;
};

/** Fixed act widths in seconds - a FLOOR, widened past the script's original
 * hand-typed pacing where real narration or required visual beats needed
 * more room (see header comment). Never shrunk below either. */
const ACT_WIDTH_S: Record<string, number> = {
  coldOpen: 12,
  act1: 52,
  connective: 11,
  act2: 70,
  act3: 50,
  close: 20,
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
 * offsets (seconds from act start). Offsets come from the script's within-
 * act beat timestamps so relative pacing between narration and on-screen
 * action matches the script's intent even though absolute frames are now
 * act-relative-plus-cursor rather than typed directly.
 */
const place = (id: LineId, actStartFrame: number, offsetS: number): number => {
  const start = actStartFrame + s(offsetS);
  const end = start + s(dur(id));
  CUE[id] = { id, start, end, durationFrames: end - start };
  return start;
};

/** Frame a placed line finishes speaking. */
const after = (id: LineId): number => {
  const c = CUE[id];
  if (!c) throw new Error(`Unknown line id "${id}"`);
  return c.end;
};

/** Places a line immediately after another line finishes, plus a breath gap. */
const placeAfter = (id: LineId, afterId: LineId, gapS: number): number => {
  const start = after(afterId) + s(gapS);
  const end = start + s(dur(id));
  CUE[id] = { id, start, end, durationFrames: end - start };
  return start;
};

// --- Cold open (0:00-0:12) ---
const coldOpenStart = 0;
place("n01", coldOpenStart, 3.0);

// --- Act 1 - value chain (script beats at +0, +7, +13, +20, +26/29, +34 within a 38s original width; widened to 50s to fit real narration) ---
const act1Start = coldOpenStart + s(ACT_WIDTH_S.coldOpen!);
place("n02", act1Start, 0.5); // "every company can be drawn as functions" - 5 primary boxes draw in
place("n03", act1Start, 9.0); // "these build the product..." - primary band fills
place("n04", act1Start, 17.5); // support band fades in underneath
place("n05", act1Start, 27.0); // margin wedge draws in
place("n06", act1Start, 37.5); // "this is a value chain..." - hold on complete diagram, dotted arrows begin
// n06 (8.62s) ends at ~46.1s - n07 must start after that, not at a flat
// +46.0s offset (that produced a 4-frame overlap, caught by
// _check-timing.mts before any still render).
place("n07", act1Start, 46.4); // "that gap is exactly where this chapter is headed" - arrows fade to faint

// --- Connective beat - zoom into one box (0:50-1:00 in script, 11s width here) ---
const connectiveStart = act1Start + s(ACT_WIDTH_S.act1!);
place("n08", connectiveStart, 2.0);

// --- Act 2 - the cost of handing work off (script's emotional core; widened to 70s, generous independent of narration per Implementation Notes) ---
const act2Start = connectiveStart + s(ACT_WIDTH_S.connective!);
place("n09", act2Start, 0.5); // six narrow boxes fade in, Taylorism named
place("n10", act2Start, 13.5); // brisk token walk, factory-floor pace
place("n11", act2Start, 25.5); // hard cut to modern relabeled chain
place("n12", act2Start, 35.0); // the halt-and-reload sequence, five repeats - narration lands DURING this
// n12 ends ~45.2s in; problem-state hold continues after to ~49s before merge begins.
place("n13", act2Start, 49.0); // "combine the small steps back..." - merge transition begins AS this is spoken
place("n14", act2Start, 55.0); // "...and give them to people who understand the whole case" - still during motion
// n14 (6.06s) ends ~61.1s; clean token run + final hold need real room after
// that - a first draft here placed them at a flat +1.0s/+3.0s offset from
// n14's end, which (given n14 lands late in the act) pushed both PAST
// act2End into where Act3's Window takes over - Act2Handover would have
// been unmounted mid-clean-run. Caught by dumping timing.ts's computed
// frames and comparing every beat against its own act boundary (the
// programmatic check the Builder brief requires) before ever rendering a
// still. Fixed by widening the act (64s -> 70s) AND moving n13/n14 earlier
// in the act, leaving ~9s of real tail room for the clean run + hold.

// --- Act 3 - processes as black boxes (script beats at +0, +4, +10, +19, +29, +34, +38 within a 40s original width; widened to 50s) ---
const act3Start = act2Start + s(ACT_WIDTH_S.act2!);
place("n15", act3Start, 1.0); // hard cut, landscape begins resolving from the connective-beat box
// n15 (9.35s) ends at ~+10.35s. n16 must start at or after that - placing it
// at a flat +4.0s (to chase the resolve-finish visual) put it INSIDE n15's
// own speech, a real overlap the programmatic check caught. Narration order
// can't be reshuffled to fix a silent visual gap; instead the VISUAL
// (act3LandscapeIn below) is decoupled from n16's placement entirely - it
// follows the zoom-resolve animation directly, landing well before n16
// speaks, so the landscape is already on screen and settled by the time n16
// narrates over it (matching the script: "None of these are opened up..."
// is said WHILE looking at the landscape, not while it's still empty).
place("n16", act3Start, 10.8); // "none of these are opened up..." - landscape already visible by now
place("n17", act3Start, 19.5); // Product Development pulls forward, flips to form card
place("n18", act3Start, 30.5); // "open it further..." - card flips back, block returns opaque
place("n19", act3Start, 41.0); // dependency arrows pulse in sequence
// n19 (9.2s) ends at ~51.2s, 1.2s past the nominal 50s width - a long final
// line, same shape as ep02's n14 overrun lesson. Fixed the same way: the
// act's real end is wherever n19 actually finishes plus a short hold, not
// the nominal width - see act3End below and ACTS.act3.

// --- Close (20s width here, widened from the script's original 15s) ---
const closeStart = after("n19") + s(1.0);
place("n20", closeStart, 2.0);
placeAfter("n21", "n20", 0.6);

const CLOSE_HOLD_AFTER_LINE = s(2.0);
const END_CARD_LEAD = s(0.8);
const END_CARD_HOLD = s(3.0);
const episodeEnd = after("n21") + CLOSE_HOLD_AFTER_LINE + END_CARD_LEAD + END_CARD_HOLD;

/** Frame a line starts on. */
const at_ = (id: LineId): number => {
  const c = CUE[id];
  if (!c) throw new Error(`Unknown line id "${id}"`);
  return c.start;
};

/** Every named beat the act components read, mapped onto real narration-derived frames. */
const BEAT_F: Record<string, number> = {
  // Cold open
  coldOpenWordIn: 0,
  coldOpenCaption: at_("n01"),
  titleCard: after("n01") + s(0.6),

  // Act 1 - value chain
  act1PrimaryIn: act1Start,
  act1Caption1: at_("n02"),
  act1PrimaryFill: after("n02") + s(0.2),
  act1Caption2: at_("n03"),
  act1SupportIn: at_("n04") - s(0.5),
  act1Caption3: at_("n04"),
  act1MarginIn: at_("n05") - s(0.5),
  act1Caption4: at_("n05"),
  act1HoldComplete: after("n05") + s(1.5),
  act1Caption5: at_("n06"),
  act1DottedArrowsIn: at_("n06") + s(2.5),
  act1Caption6: at_("n07"),
  act1DottedArrowsFade: at_("n07") + s(1.0),
  act1End: act1Start + s(ACT_WIDTH_S.act1!),

  // Connective beat - zoom into one box
  connectiveDock: connectiveStart,
  connectiveCaption: at_("n08"),
  connectiveBoxEnlarge: at_("n08") + s(1.0),
  connectiveHold: after("n08") + s(1.0),

  // Act 2 - the cost of handing work off
  act2SixBoxesIn: act2Start,
  act2Caption1: at_("n09"),
  act2TokenBriskEnter: after("n09") + s(0.3),
  act2Caption2: at_("n10"),
  act2RelabelCut: at_("n11") - s(1.0),
  act2Caption3: at_("n11"),
  act2ModernTokenEnter: at_("n11") + s(0.5),
  act2HaltBegin: at_("n12") - s(1.5),
  act2Caption4: at_("n12"),
  act2ReloadSequence: at_("n12"),
  act2ArchiveReached: at_("n12") + s(9.5),
  act2ProblemHold: at_("n12") + s(11.5),
  act2MergeBegin: at_("n13"),
  act2Caption5: at_("n13"),
  act2BadgeIn: at_("n14"),
  act2Caption6: at_("n14"),
  act2CleanTokenEnter: after("n14") + s(1.0),
  act2FinalHold: after("n14") + s(3.0),
  act2End: act2Start + s(ACT_WIDTH_S.act2!),

  // Act 3 - processes as black boxes
  act3DockAnchors: act3Start,
  act3Caption1: at_("n15"),
  act3ZoomResolve: at_("n15") + s(0.5),
  // Landscape draws in immediately as the resolve finishes (zoomResolve + its
  // own 1.0s resolve duration), not anchored to n16's narration slot - see
  // the placement comment above n16 for the dead-air gap this fixes.
  act3LandscapeIn: at_("n15") + s(0.5) + s(1.0),
  act3Caption2: at_("n16"),
  act3Caption3: at_("n17"),
  act3CardFlipIn: at_("n17") + s(1.0),
  act3Caption4: at_("n18"),
  act3CardFlipBack: at_("n18"),
  act3Caption5: at_("n19"),
  act3ArrowsPulse: at_("n19") + s(0.5),
  act3Hold: after("n19") + s(1.0),

  // Close
  closeIconsIn: closeStart,
  closeCaption1: at_("n20"),
  closeCaption2: at_("n21"),
  endCard: after("n21") + END_CARD_LEAD,
};

export type BeatId = keyof typeof BEAT_F;

/** Frame at which a named beat fires. */
export const at = (id: BeatId): number => {
  const f = BEAT_F[id];
  if (f === undefined) throw new Error(`Unknown beat "${id}"`);
  return f;
};

export const EPISODE_FRAMES = episodeEnd;

export { CUE };

/** Playback order for narration <Audio> sequencing in Episode.tsx. */
export const ORDER: LineId[] = [
  "n01",
  "n02", "n03", "n04", "n05", "n06", "n07",
  "n08",
  "n09", "n10", "n11", "n12", "n13", "n14",
  "n15", "n16", "n17", "n18", "n19",
  "n20", "n21",
];

/** Absolute [start, end) frame ranges for each act - used by Episode.tsx windows. */
export const ACTS = {
  coldOpen: { start: coldOpenStart, end: act1Start },
  act1: { start: act1Start, end: connectiveStart },
  connective: { start: connectiveStart, end: act2Start },
  act2: { start: act2Start, end: act3Start },
  act3: { start: act3Start, end: closeStart },
  close: { start: closeStart, end: EPISODE_FRAMES },
} as const;
