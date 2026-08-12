import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame, interpolate } from "remotion";
import { colors } from "@anima/core";
import { ColdOpen } from "./acts/ColdOpen";
import { Act1PullingOsOut } from "./acts/Act1PullingOsOut";
import { Act2DbmsAndGui } from "./acts/Act2DbmsAndGui";
import { Act3TheBlobGrowsBack } from "./acts/Act3TheBlobGrowsBack";
import { Act4Erp } from "./acts/Act4Erp";
import { Act5ScmCrmSiloAgain } from "./acts/Act5ScmCrmSiloAgain";
import { Act6PointToPointMesh } from "./acts/Act6PointToPointMesh";
import { Act7HubAndSpoke } from "./acts/Act7HubAndSpoke";
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
 * TWO NARRATION TRACKS exist (Russian, the original; English, added
 * 2026-08-11 per user request - on-screen text is English, so narration
 * needed an English option too). Russian stays the TIMING MASTER: every cue
 * frame in timing.ts is derived from voice/manifest.json (Russian), and that
 * does not change based on `lang`. English clips are shorter per line (52s
 * vs 75s total) and simply finish early within their Russian-sized slot when
 * selected - a deliberate simplification, not a bug. Re-deriving timing per
 * language was considered and rejected as unnecessary scope for now.
 *
 * Music rotates by act group (3 segments, not one bed for the whole runtime -
 * see memory 's02-narration-and-music-policy': "the same music during 5
 * minutes become a hum"). Segment boundaries align to act boundaries and
 * crossfade rather than hard-cut. Tracks chosen by ear 2026-08-11: calm piano
 * for the extraction acts, a jazzier piano for the silo/ERP acts, a more
 * forward-moving loop for the mesh/hub acts (the episode's busiest stretch).
 *
 * All nine acts read ABSOLUTE cue frames from timing.ts, so - as in ep01 and
 * S02E1 - they are mounted via `Window`, NOT `<Sequence>` (Sequence rebases
 * useCurrentFrame() to local time, which breaks every absolute cue). See
 * docs/TODO.md's "Trap worth knowing" note.
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

      <Window from={0} to={ACTS.act1.start}>
        <ColdOpen />
      </Window>
      <Window from={ACTS.act1.start} to={ACTS.act1.end}>
        <Act1PullingOsOut />
      </Window>
      <Window from={ACTS.act2.start} to={ACTS.act2.end}>
        <Act2DbmsAndGui />
      </Window>
      <Window from={ACTS.act3.start} to={ACTS.act3.end}>
        <Act3TheBlobGrowsBack />
      </Window>
      <Window from={ACTS.act4.start} to={ACTS.act4.end}>
        <Act4Erp />
      </Window>
      <Window from={ACTS.act5.start} to={ACTS.act5.end}>
        <Act5ScmCrmSiloAgain />
      </Window>
      <Window from={ACTS.act6.start} to={ACTS.act6.end}>
        <Act6PointToPointMesh />
      </Window>
      <Window from={ACTS.act7.start} to={ACTS.act7.end}>
        <Act7HubAndSpoke />
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

const MUSIC_PEAK_VOLUME = 0.22; // quieter than ep01's 0.35 - this episode also has narration on top
const MUSIC_CROSSFADE = s(2.5);

interface MusicSegmentSpec {
  file: string;
  from: number;
  to: number;
}

const MUSIC_SEGMENTS: MusicSegmentSpec[] = [
  { file: "atmospheric-piano", from: 0, to: ACTS.act3.start },
  { file: "jazzy-ambient-piano", from: ACTS.act3.start, to: ACTS.act6.start },
  { file: "mystic-minimal-loop", from: ACTS.act6.start, to: EPISODE_FRAMES },
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
