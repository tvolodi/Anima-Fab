import React from "react";
import {
  AbsoluteFill,
  Audio,
  Sequence,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { colors } from "@anima/core";
import { ColdOpen } from "./acts/ColdOpen";
import { Act1Testimonies } from "./acts/Act1Testimonies";
import { Act2Overlay } from "./acts/Act2Overlay";
import { Act3Cost } from "./acts/Act3Cost";
import { Act4Turn } from "./acts/Act4Turn";
import { Close } from "./acts/Close";
import { ACTS, CUE, ORDER } from "./timing";

/**
 * The whole episode.
 *
 * Acts are absolutely positioned in one timeline rather than concatenated,
 * because every act component reads ABSOLUTE cue frames from timing.ts. That
 * keeps a single source of truth: re-record narration, re-run synth, and both
 * the visuals and the audio move together.
 *
 * Audio is one <Audio> per line, placed at its cue frame. The gaps between
 * them are the scripted silences and must not be closed.
 */

export const Episode: React.FC = () => (
  <AbsoluteFill style={{
    backgroundColor: colors.BG,
    translate: "-2px 0px"
  }}>
    {/* Narration - one clip per line, at its exact cue frame. */}
    {ORDER.map((id) => {
      const cue = CUE[id];
      if (!cue) return null;
      return (
        <Sequence
          key={id}
          from={cue.start}
          durationInFrames={cue.durationFrames}
          layout="none"
        >
          <Audio src={staticFile(`voice/${id}.mp3`)} />
        </Sequence>
      );
    })}

    {/* Visuals.
        NOT wrapped in <Sequence>: every act component reads ABSOLUTE cue
        frames from timing.ts, and Sequence rebases useCurrentFrame() to local
        time. Window just mounts/unmounts on the real timeline. */}
    <Window from={0} to={ACTS.coldOpen.end}>
      <ColdOpen />
    </Window>

    <Window from={ACTS.olga.start} to={ACTS.fourth.end}>
      <Act1Testimonies />
    </Window>

    <Window from={ACTS.act2.start} to={ACTS.act2.end}>
      <Act2Overlay />
    </Window>

    <Window from={ACTS.act3.start} to={ACTS.act3.end}>
      <Act3Cost />
    </Window>

    <Window from={ACTS.act4.start} to={ACTS.act4.end}>
      <Act4Turn />
    </Window>

    <Window from={ACTS.close.start} to={ACTS.close.end}>
      <Close />
    </Window>
  </AbsoluteFill>
);

/** Mount a child only within an absolute frame window. See note above. */
const Window: React.FC<{
  from: number;
  to: number;
  children: React.ReactNode;
}> = ({ from, to, children }) => {
  const frame = useCurrentFrame();
  if (frame < from || frame >= to) return null;
  return <>{children}</>;
};
