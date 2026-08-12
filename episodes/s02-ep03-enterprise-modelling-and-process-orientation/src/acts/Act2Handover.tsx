import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { colors } from "@anima/core";
import { Caption } from "../components/Caption";
import { HandoverChain } from "../components/HandoverChain";
import { at, s } from "../timing";

/**
 * Act 2 - the cost of handing work off. The episode's dramatized centerpiece
 * and flagged highest build risk. Two chains share one timeline:
 *
 * Phase A (factory floor, Taylorism intro): 6 narrow boxes, a token walks
 * through briskly, no pauses - "on a factory floor, that worked."
 *
 * Phase B (modern work, the problem): hard cut to the same 6 boxes
 * relabeled. A second token halts at each of 5 boundaries for a visible
 * context-reload beat. This is held, not rushed - the script is explicit
 * that the problem state gets its own uninterrupted screen time before any
 * resolution appears.
 *
 * Phase C (the merge, the resolution): narration rides the transformation in
 * real time as 6 narrow boxes merge pairwise into 3 wide ones, each getting
 * a "knowledge worker" badge. A clean token then runs the merged chain
 * briskly, mirroring phase A's easy pace - the contrast IS the argument, no
 * further caption needed.
 */

const FACTORY_LABELS = ["Receive", "Inspect", "Log", "Route", "Check", "Release"];
const MODERN_LABELS = ["Intake", "Verify", "Assess", "Approve", "Notify", "Archive"];
const WIDE_LABELS = ["Receive & Assess", "Decide", "Close"];

// Five reload boundaries, evenly spaced across the narration window that
/* carries them (n12, ~10.2s) - see timing.ts's act2ReloadSequence/
   act2ArchiveReached beats. Each reload: brief walk to the boundary, drain,
   hold, refill-partway, continue - deliberately a little labored per the
   script's "should look a little uncomfortable" note. */
const RELOAD_COUNT = 5;

export const Act2Handover: React.FC = () => {
  const frame = useCurrentFrame();

  // --- Phase A: factory-floor chain + brisk token ---
  const phaseABoxesInT = interpolate(frame, [at("act2SixBoxesIn"), at("act2SixBoxesIn") + s(1.5)], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const briskWalkT = interpolate(
    frame,
    [at("act2TokenBriskEnter"), at("act2RelabelCut") - s(0.3)],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  const phaseAOpacity = interpolate(frame, [at("act2RelabelCut") - s(0.15), at("act2RelabelCut")], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // --- Phase B: modern chain, halt-and-reload ---
  const phaseBBoxesInT = interpolate(frame, [at("act2RelabelCut"), at("act2RelabelCut") + s(0.6)], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const modernWalkInT = interpolate(
    frame,
    [at("act2ModernTokenEnter"), at("act2HaltBegin")],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  const reloadStart = at("act2ReloadSequence");
  const reloadEnd = at("act2ArchiveReached"); // 5 reloads share this window
  const reloadWindowFrames = Math.max(1, reloadEnd - reloadStart);
  const perReload = reloadWindowFrames / RELOAD_COUNT;

  let haltIndex = -1;
  let reloadT = 0;
  if (frame >= reloadStart && frame < reloadEnd) {
    const idx = Math.min(RELOAD_COUNT - 1, Math.floor((frame - reloadStart) / perReload));
    haltIndex = idx;
    reloadT = ((frame - reloadStart) % perReload) / perReload;
  }

  const finalLegT = interpolate(
    frame,
    [reloadEnd, at("act2MergeBegin") - s(1.0)],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  // --- Phase C: merge + badges + clean run ---
  const mergeT = interpolate(frame, [at("act2MergeBegin"), at("act2BadgeIn")], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const badgesInT = interpolate(frame, [at("act2BadgeIn"), at("act2BadgeIn") + s(1.0)], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const cleanRunT = interpolate(
    frame,
    [at("act2CleanTokenEnter"), at("act2FinalHold")],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  const showPhaseA = frame < at("act2RelabelCut");
  const boxesInT = showPhaseA ? phaseABoxesInT : phaseBBoxesInT;
  const labels = showPhaseA ? FACTORY_LABELS : MODERN_LABELS;

  return (
    <AbsoluteFill style={{ backgroundColor: colors.BG }}>
      <div style={{ opacity: showPhaseA ? phaseAOpacity : 1, position: "absolute", inset: 0 }}>
        <HandoverChain
          narrowLabels={labels}
          wideLabels={WIDE_LABELS}
          boxesInT={boxesInT}
          briskWalkT={showPhaseA ? briskWalkT : 0}
          modernWalkInT={showPhaseA ? 0 : modernWalkInT}
          haltIndex={showPhaseA ? -1 : haltIndex}
          reloadT={reloadT}
          finalLegT={showPhaseA ? 0 : finalLegT}
          mergeT={showPhaseA ? 0 : mergeT}
          badgesInT={showPhaseA ? 0 : badgesInT}
          cleanRunT={showPhaseA ? 0 : cleanRunT}
        />
      </div>

      <Caption
        text="Break work into small, specialized pieces — one worker, one narrow task each. This is Taylorism. It built the industrial revolution."
        appearAt={at("act2Caption1")}
        holdFrames={s(3.0)}
      />
      <Caption
        text="On a factory floor, that worked. A worker didn't need to know what happened before — just do the one thing in front of them."
        appearAt={at("act2Caption2")}
        holdFrames={s(3.0)}
      />
      <Caption
        text="Modern work doesn't stay this simple. Each step here needs to know the whole case, not just its own task."
        appearAt={at("act2Caption3")}
        holdFrames={s(3.0)}
      />
      <Caption
        text="Every handoff, someone has to reconstruct the context from nothing. That reconstruction — not the task itself — is what actually costs time."
        appearAt={at("act2Caption4")}
        holdFrames={s(4.0)}
      />
      <Caption
        text="Combine the small steps back into fewer, wider ones —"
        appearAt={at("act2Caption5")}
        holdFrames={s(2.2)}
      />
      <Caption
        text="— and give them to people who understand the whole case, not just one narrow piece of it."
        appearAt={at("act2Caption6")}
        holdFrames={s(3.5)}
      />
    </AbsoluteFill>
  );
};
