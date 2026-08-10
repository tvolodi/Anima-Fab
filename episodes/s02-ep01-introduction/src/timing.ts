/**
 * Timing, hand-authored.
 *
 * Unlike ep01, this episode has no narration track (see script's "Audio"
 * section - a deliberate scope decision, not a placeholder). There is no
 * voice/manifest.json to derive durations from, so cue frames are typed
 * directly from the script's beat timestamps. If a narration track is added
 * later, this file is what gets replaced by a manifest-driven version - the
 * cue NAMES should survive that migration even if the frame numbers don't.
 */

export const FPS = 30;
export const s = (seconds: number) => Math.round(seconds * FPS);

/** Every named beat in the script, in seconds from episode start. */
const BEAT_S = {
  // Cold open
  coldOpenBoxIn: 0.0,
  coldOpenCaption: 2.0,
  titleCard: 8.0,

  // Act 1 - a process is not a list
  act1Start: 10.0,
  act1ListIn: 10.0,
  act1Caption1: 16.0,
  act1SnapToDiagram: 20.0,
  act1Caption2: 28.0,
  act1Hold: 33.0,

  // Act 2 - model vs instance
  act2Start: 35.0,
  act2ModelLabel: 35.0,
  act2Token1Spawn: 39.0,
  act2Token1Walk: 41.0,
  act2Ghost1: 48.0,
  act2Token2: 50.0,
  act2Token3: 52.6,
  act2Token4: 54.6,
  act2Caption: 57.0,

  // Act 3 - orchestration vs choreography
  act3Start: 60.0,
  act3ResellerLabel: 60.0,
  act3Caption1: 64.0,
  act3ControllerPulse1: 65.5,
  act3BuyerIn: 69.0,
  act3Caption2: 76.0,
  act3ControllerPulse2: 78.0,
  act3MessagePulses: 83.0,
  act3Caption3: 90.0,

  // Act 4 - stable interface, changed internals
  act4Start: 95.0,
  act4Caption1: 98.0,
  act4Reflow: 100.0,
  act4Caption2: 106.0,
  act4BuyerBrighten: 112.0,
  act4Caption3: 117.0,

  // Act 5 - the lifecycle is a loop
  act5Start: 120.0,
  act5DiagramsDock: 120.0,
  act5NodesIn: 123.0,
  act5Arc1: 128.0,
  act5Arc2: 129.5,
  act5Arc3: 131.0,
  act5ArcPause: 132.4,
  act5ClosingArc: 134.0,
  act5Caption: 140.0,
  act5RingPulse: 145.0,

  // Act 6 - independent axes
  act6Start: 150.0,
  act6Caption1: 150.0,
  act6TracksIn: 153.0,
  act6Dot1: 158.0,
  act6Dot2: 164.0,
  act6Caption2: 169.0,
  act6Hold: 173.0,

  // Close
  closeStart: 175.0,
  closeDiagramIn: 175.0,
  closeCaption: 178.0,
  endCard: 180.0,
  episodeEnd: 183.0,
} as const;

export type BeatId = keyof typeof BEAT_S;

/** Frame at which a named beat fires. */
export const at = (id: BeatId): number => s(BEAT_S[id]);

export const EPISODE_FRAMES = s(BEAT_S.episodeEnd);

/** Absolute [start, end) frame ranges for each act - used by Episode.tsx windows. */
export const ACTS = {
  coldOpen: { start: at("coldOpenBoxIn"), end: at("act1Start") },
  act1: { start: at("act1Start"), end: at("act2Start") },
  act2: { start: at("act2Start"), end: at("act3Start") },
  act3: { start: at("act3Start"), end: at("act4Start") },
  act4: { start: at("act4Start"), end: at("act5Start") },
  act5: { start: at("act5Start"), end: at("act6Start") },
  act6: { start: at("act6Start"), end: at("closeStart") },
  close: { start: at("closeStart"), end: EPISODE_FRAMES },
} as const;
