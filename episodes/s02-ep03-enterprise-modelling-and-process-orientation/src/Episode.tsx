import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame, interpolate } from "remotion";
import { colors } from "@anima/core";
import { ColdOpen } from "./acts/ColdOpen";
import { Act1ValueChain } from "./acts/Act1ValueChain";
import { ConnectiveBeat } from "./acts/ConnectiveBeat";
import { Act2Handover } from "./acts/Act2Handover";
import { Act3ProcessLandscape } from "./acts/Act3ProcessLandscape";
import { Close } from "./acts/Close";
import { ACTS, CUE, ORDER, EPISODE_FRAMES, s } from "./timing";

export interface EpisodeProps {
  /** "ru" (default) or "en". Only the audio track changes - see note below. */
  lang?: "ru" | "en";
}

/**
 * The whole episode.
 *
 * Narration is one <Audio> per line, placed at its cue frame (see
 * timing.ts - cues are derived from voice/manifest.json, not hand-typed).
 *
 * TWO NARRATION TRACKS exist (Russian, the original/timing master; English,
 * matching ep02's precedent - on-screen text is English, so narration needed
 * an English option). Russian stays the TIMING MASTER: every cue frame in
 * timing.ts is derived from voice/manifest.json (Russian). English clips are
 * shorter per line and simply finish early within their Russian-sized slot
 * when selected - same deliberate simplification ep02 made.
 *
 * Music rotates by act group (3 segments per the script's suggestions, not
 * one bed for the whole runtime - see memory 's02-narration-and-music-
 * policy'). warm-pad-drone covers Cold Open + Act 1 (calm/static, unused
 * since ep01, fits the fixed value-chain diagram). mystic-minimal-loop
 * covers the Connective beat + Act 2 (reused from ep02's busiest-beats
 * track - its "productive unease" quality suggested for Act 2's reload
 * beats, per the script's Implementation Notes, flagged for Producer
 * approval rather than a new registry candidate). atmospheric-piano covers
 * Act 3 + Close (third episode reusing it - flagged in the script as a real
 * repeat worth explicit Producer sign-off, proceeding per the Director's
 * instruction not to block on it). piano-jam-mei is NOT used - explicitly
 * held back per standing note.
 *
 * All acts read ABSOLUTE cue frames from timing.ts, so - as in ep01 and
 * s02-ep02 - they are mounted via `Window`, NOT `<Sequence>` (Sequence
 * rebases useCurrentFrame() to local time, which breaks every absolute
 * cue). See docs/TODO.md's "Trap worth knowing" note.
 */
export const Episode: React.FC<EpisodeProps> = ({ lang = "ru" }) => {
  const voiceDir = lang === "en" ? "voice.en" : "voice";

  return (
    <AbsoluteFill style={{ backgroundColor: colors.BG }}>
      <MusicBed />

      {ORDER.map((id) => {
        const cue = CUE[id];
        if (!cue) return null;
        return (
          <Sequence key={id} from={cue.start} durationInFrames={cue.durationFrames} layout="none">
            <Audio src={staticFile(`${voiceDir}/${id}.mp3`)} />
          </Sequence>
        );
      })}

      <Window from={0} to={ACTS.coldOpen.end}>
        <ColdOpen />
      </Window>
      <Window from={ACTS.act1.start} to={ACTS.act1.end}>
        <Act1ValueChain />
      </Window>
      <Window from={ACTS.connective.start} to={ACTS.connective.end}>
        <ConnectiveBeat />
      </Window>
      <Window from={ACTS.act2.start} to={ACTS.act2.end}>
        <Act2Handover />
      </Window>
      <Window from={ACTS.act3.start} to={ACTS.act3.end}>
        <Act3ProcessLandscape />
      </Window>
      <Window from={ACTS.close.start} to={ACTS.close.end}>
        <Close />
      </Window>
    </AbsoluteFill>
  );
};

const Window: React.FC<{ from: number; to: number; children: React.ReactNode }> = ({
  from,
  to,
  children,
}) => {
  const frame = useCurrentFrame();
  if (frame < from || frame >= to) return null;
  return <>{children}</>;
};

const MUSIC_PEAK_VOLUME = 0.22;
const MUSIC_CROSSFADE = s(2.5);

interface MusicSegmentSpec {
  file: string;
  from: number;
  to: number;
}

const MUSIC_SEGMENTS: MusicSegmentSpec[] = [
  { file: "warm-pad-drone", from: 0, to: ACTS.connective.start },
  { file: "mystic-minimal-loop", from: ACTS.connective.start, to: ACTS.act3.start },
  { file: "atmospheric-piano", from: ACTS.act3.start, to: EPISODE_FRAMES },
];

const MusicBed: React.FC = () => (
  <>
    {MUSIC_SEGMENTS.map((seg) => (
      <MusicSegment key={seg.file} {...seg} />
    ))}
  </>
);

const MusicSegment: React.FC<MusicSegmentSpec> = ({ file, from, to }) => {
  const frame = useCurrentFrame();
  const duration = to - from;
  const volume = interpolate(
    frame,
    [from, from + MUSIC_CROSSFADE, to - MUSIC_CROSSFADE, to],
    [0, MUSIC_PEAK_VOLUME, MUSIC_PEAK_VOLUME, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  return (
    <Sequence from={from} durationInFrames={duration} layout="none">
      <Audio src={staticFile(`music/${file}.mp3`)} volume={volume} />
    </Sequence>
  );
};
