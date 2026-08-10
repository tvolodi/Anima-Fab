import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { FitStage, ProcessView, colors, layout } from "@anima/core";
import { resolved } from "../data/resolved";
import { at, s } from "../timing";

/**
 * Act 4 - the turn.
 *
 * Cuts to white. This is the only warm moment in the episode, and the contrast
 * with three acts of dark ground is doing most of the work - so the cut must be
 * hard, not a fade.
 *
 * The diagram draws itself, then STOPS mid-way. One arrow hangs unfinished
 * while the narrator asks "а кто говорит айтишникам?", and only then completes
 * into a box that was in nobody's telling.
 */

const LAID = layout(resolved);

export const Act4Turn: React.FC = () => {
  const frame = useCurrentFrame();

  // Hard cut to white on "Решение — не в программе."
  const white = frame >= at("n26") ? 1 : 0;

  const drawStart = at("n28");
  const step = s(1.35);

  // The build stalls before `r_missing`. The half-drawn arrow hangs for the
  // length of the question, then the missing box lands.
  const cues: Record<string, number> = {
    r1: drawStart,
    r2: drawStart + step,
    // Nothing between here and the question - this is the stall.
    r_missing: at("n29") + s(1.6),
    r3: at("n29") + s(1.6) + step,
    r4: at("n29") + s(1.6) + step * 2,
    r5: at("n29") + s(1.6) + step * 3,
  };

  // Icon flicker on "нотация, инструменты, репозиторий, комитет" - almost
  // subliminal, half a second each.
  const iconStart = at("n30") + s(2.2);
  const icons = ["◇", "▤", "🗀", "▦"];
  const iconIndex = Math.floor((frame - iconStart) / s(0.5));
  const showIcons = iconIndex >= 0 && iconIndex < icons.length;

  const iconOpacity = showIcons
    ? interpolate(
        (frame - iconStart) % s(0.5),
        [0, s(0.12), s(0.38), s(0.5)],
        [0, 0.5, 0.5, 0],
        { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
      )
    : 0;

  return (
    <AbsoluteFill
      style={{ backgroundColor: white ? colors.BG_WARM : colors.BG }}
    >
      <FitStage
        contentWidth={LAID.width}
        contentHeight={LAID.height}
        scale={Math.min((1920 - 240 * 2) / LAID.width, 1.15)}
        offsetY={-20}
      >
        <ProcessView process={resolved} cues={cues} light />
      </FitStage>

      {showIcons && (
        <AbsoluteFill
          style={{
            justifyContent: "flex-end",
            alignItems: "center",
            paddingBottom: 150,
            opacity: iconOpacity,
            fontSize: 120,
            color: "#20262D",
            pointerEvents: "none",
          }}
        >
          {icons[iconIndex]}
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};
