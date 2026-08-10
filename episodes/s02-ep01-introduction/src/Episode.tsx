import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { colors } from "@anima/core";
import { ColdOpen } from "./acts/ColdOpen";
import { Act1Coordination } from "./acts/Act1Coordination";
import { Act2ModelInstance } from "./acts/Act2ModelInstance";
import { Act3Orchestration } from "./acts/Act3Orchestration";
import { Act4StableInterface } from "./acts/Act4StableInterface";
import { Act5Lifecycle } from "./acts/Act5Lifecycle";
import { Act6Classification } from "./acts/Act6Classification";
import { Close } from "./acts/Close";
import { ACTS } from "./timing";

/**
 * The whole episode. Silent - see script's "Audio" section. All six acts
 * read ABSOLUTE cue frames from timing.ts, so - as in ep01 - they are mounted
 * via `Window`, NOT `<Sequence>` (Sequence rebases useCurrentFrame() to local
 * time, which breaks every absolute cue). See docs/TODO.md's "Trap worth
 * knowing" note from ep01 - the same trap applies here.
 */
export const Episode: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: colors.BG }}>
    <Window from={0} to={ACTS.act1.start}>
      <ColdOpen />
    </Window>

    <Window from={ACTS.act1.start} to={ACTS.act1.end}>
      <Act1Coordination />
    </Window>

    <Window from={ACTS.act2.start} to={ACTS.act2.end}>
      <Act2ModelInstance />
    </Window>

    <Window from={ACTS.act3.start} to={ACTS.act3.end}>
      <Act3Orchestration />
    </Window>

    <Window from={ACTS.act4.start} to={ACTS.act4.end}>
      <Act4StableInterface />
    </Window>

    <Window from={ACTS.act5.start} to={ACTS.act5.end}>
      <Act5Lifecycle />
    </Window>

    <Window from={ACTS.act6.start} to={ACTS.act6.end}>
      <Act6Classification />
    </Window>

    <Window from={ACTS.close.start} to={ACTS.close.end}>
      <Close />
    </Window>
  </AbsoluteFill>
);

const Window: React.FC<{ from: number; to: number; children: React.ReactNode }> = ({
  from,
  to,
  children,
}) => {
  const frame = useCurrentFrame();
  if (frame < from || frame >= to) return null;
  return <>{children}</>;
};
