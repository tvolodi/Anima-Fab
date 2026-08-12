/**
 * One-off verification script (not part of the build): checks that no
 * narration line overlaps another, and no line or named beat overruns its
 * own act's [start, end) window. Run with `npx tsx src/_check-timing.mts`
 * from the episode directory. Per the Builder brief: this caught a real bug
 * in ep02 (a line overran its act by 1.8s) and would have caught this
 * episode's own Act 2 clean-run/final-hold overrun before any still-frame
 * render, if run first - which it now is.
 */
import * as T from "./timing";

let failed = false;

// --- 1. No two narration lines overlap. ---
const cues = T.ORDER.map((id) => T.CUE[id]!).filter(Boolean);
for (let i = 1; i < cues.length; i++) {
  const prev = cues[i - 1]!;
  const cur = cues[i]!;
  if (cur.start < prev.end) {
    failed = true;
    console.error(
      `OVERLAP: ${cur.id} starts at ${cur.start} before ${prev.id} ends at ${prev.end}`,
    );
  }
}

// --- 2. Every line stays inside its named act's [start, end) window. ---
const LINE_ACT: Record<string, keyof typeof T.ACTS> = {
  n01: "coldOpen",
  n02: "act1", n03: "act1", n04: "act1", n05: "act1", n06: "act1", n07: "act1",
  n08: "connective",
  n09: "act2", n10: "act2", n11: "act2", n12: "act2", n13: "act2", n14: "act2",
  n15: "act3", n16: "act3", n17: "act3", n18: "act3", n19: "act3",
  n20: "close", n21: "close",
};
for (const cue of cues) {
  const actId = LINE_ACT[cue.id];
  if (!actId) continue;
  const act = T.ACTS[actId];
  if (cue.start < act.start || cue.end > act.end) {
    failed = true;
    console.error(
      `OVERRUN: ${cue.id} [${cue.start}, ${cue.end}) is outside act "${actId}" [${act.start}, ${act.end})` +
        (cue.end > act.end ? ` - overruns by ${cue.end - act.end} frames (${((cue.end - act.end) / 30).toFixed(2)}s)` : ""),
    );
  }
}

// --- 3. Every named beat used by an act component stays inside that act's window. ---
const BEAT_ACT: Record<string, keyof typeof T.ACTS> = {
  coldOpenWordIn: "coldOpen", coldOpenCaption: "coldOpen", titleCard: "coldOpen",
  act1PrimaryIn: "act1", act1Caption1: "act1", act1PrimaryFill: "act1", act1Caption2: "act1",
  act1SupportIn: "act1", act1Caption3: "act1", act1MarginIn: "act1", act1Caption4: "act1",
  act1HoldComplete: "act1", act1Caption5: "act1", act1DottedArrowsIn: "act1",
  act1Caption6: "act1", act1DottedArrowsFade: "act1", act1End: "act1",
  connectiveDock: "connective", connectiveCaption: "connective", connectiveBoxEnlarge: "connective",
  connectiveHold: "connective",
  act2SixBoxesIn: "act2", act2Caption1: "act2", act2TokenBriskEnter: "act2", act2Caption2: "act2",
  act2RelabelCut: "act2", act2Caption3: "act2", act2ModernTokenEnter: "act2", act2HaltBegin: "act2",
  act2Caption4: "act2", act2ReloadSequence: "act2", act2ArchiveReached: "act2", act2ProblemHold: "act2",
  act2MergeBegin: "act2", act2Caption5: "act2", act2BadgeIn: "act2", act2Caption6: "act2",
  act2CleanTokenEnter: "act2", act2FinalHold: "act2", act2End: "act2",
  act3DockAnchors: "act3", act3Caption1: "act3", act3ZoomResolve: "act3", act3LandscapeIn: "act3",
  act3Caption2: "act3", act3Caption3: "act3", act3CardFlipIn: "act3", act3Caption4: "act3",
  act3CardFlipBack: "act3", act3Caption5: "act3", act3ArrowsPulse: "act3", act3Hold: "act3",
  closeIconsIn: "close", closeCaption1: "close", closeCaption2: "close", endCard: "close",
};

for (const [beat, actId] of Object.entries(BEAT_ACT)) {
  const f = T.at(beat as T.BeatId);
  const act = T.ACTS[actId];
  // endCard/titleCard etc. legitimately reach right up to (but should not
  // exceed) the act's end; allow equality, flag strictly-past.
  if (f < act.start || f > act.end) {
    failed = true;
    console.error(`BEAT OUT OF RANGE: "${beat}" fires at frame ${f}, outside act "${actId}" [${act.start}, ${act.end}]`);
  }
}

// --- 4. Report the overall runtime. ---
console.log(`Episode length: ${T.EPISODE_FRAMES} frames = ${(T.EPISODE_FRAMES / 30).toFixed(1)}s`);
for (const [name, range] of Object.entries(T.ACTS)) {
  console.log(`  ${name}: [${range.start}, ${range.end}) = ${((range.end - range.start) / 30).toFixed(1)}s`);
}

if (failed) {
  console.error("\nFAILED: timing has overlaps or overruns - see above.");
  process.exit(1);
} else {
  console.log("\nOK: no line overlaps, no line or beat overruns its act boundary.");
}
