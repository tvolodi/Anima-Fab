import React from "react";
import { ProcessView } from "./Process";
import { isAbsent, type Telling } from "./types";

/**
 * Act 2: N tellings of the same process, composed in ONE coordinate space.
 *
 * The script is emphatic about this: "the overlay must be genuinely ugly. If
 * it composes nicely, the episode fails." So the misalignment is a real,
 * tunable parameter rather than an accident - `chaos` scales it, and `seed`
 * picks a variant. Dial these while looking at stills; do not hand-place.
 *
 * The gap in the middle is the hero of the act (it is where the new hire
 * waits), so the layout pushes tellings outward from centre rather than
 * stacking them concentrically.
 */

export interface OverlayProps {
  tellings: Telling[];
  /** 0 = perfectly aligned (wrong), 1 = the intended mess. */
  chaos?: number;
  seed?: number;
  revealAll?: boolean;
  light?: boolean;
  /** Per-telling opacity override, keyed by telling id. */
  opacities?: Record<string, number>;
  /** Highlight the empty middle region. */
  showGap?: boolean;
  gapColor?: string;
  /** Scale applied to the whole composed group. */
  scale?: number;
}

/** Deterministic PRNG - same seed must always give the same mess. */
function rng(seed: number) {
  let s = seed >>> 0 || 1;
  return () => {
    s ^= s << 13;
    s ^= s >>> 17;
    s ^= s << 5;
    return ((s >>> 0) % 10000) / 10000;
  };
}

export const Overlay: React.FC<OverlayProps> = ({
  tellings,
  chaos = 1,
  seed = 7,
  revealAll = true,
  light = false,
  opacities = {},
  showGap = false,
  gapColor = "#F2C14E",
  scale = 1,
}) => {
  const offsets = React.useMemo(() => {
    const rand = rng(seed);
    const n = tellings.length;

    /**
     * Structured misalignment, not random scatter.
     *
     * Learned by looking at rendered stills: pure random offsets slide these
     * wide horizontal diagrams around, and any two at similar heights read as
     * ONE long process - which destroys the act. The viewer must still see
     * three incompatible ACCOUNTS colliding.
     *
     * So each telling gets its own vertical band and its own angle, and the
     * seed only jitters within that structure. Bands are ordered outside-in
     * with the centre left clear, because the gap in the middle is where the
     * new hire waits and is the hero of the act.
     */
    const bands = [-1, 1, -0.45, 0.45, -1.5, 1.5];

    return tellings.map((t, i) => {
      const band = bands[i % bands.length] ?? 0;

      // Small tilt only. The real separation now comes from tellings having
      // DIFFERENT FLOW AXES (see FlowDirection) rather than from rotating
      // near-parallel strips, which never stopped them reading as one process.
      const tilt = (i % 2 === 0 ? -1 : 1) * (1.5 + rand() * 2) * chaos;

      // Horizontal stagger keeps start events from lining up into a column.
      const stagger = (i - (n - 1) / 2) * 150 * chaos + (rand() * 80 - 40) * chaos;

      // Bands are close enough that the tellings genuinely tangle. Separating
      // them cleanly (tried, looked wrong) reads as a tidy comparison slide -
      // three diagrams politely side by side. The act needs collision: arrows
      // crossing, boxes half-covering each other, while the eye can still pick
      // out three distinct accounts by colour.
      const dy = band * 118 * chaos + (rand() * 34 - 17) * chaos;

      return { id: t.id, dx: stagger, dy, rotate: tilt };
    });
  }, [tellings, chaos, seed]);

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        transform: `scale(${scale})`,
        transformOrigin: "center center",
      }}
    >
      {showGap && (
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            width: 300,
            height: 190,
            transform: "translate(-50%, -50%)",
            border: `2px dashed ${gapColor}`,
            borderRadius: 10,
            opacity: 0.85,
          }}
        />
      )}

      {tellings.map((t, i) => {
        if (isAbsent(t)) return null;
        const off = offsets[i] ?? { dx: 0, dy: 0, rotate: 0 };
        return (
          <div
            key={t.id}
            style={{
              position: "absolute",
              left: "50%",
              top: "50%",
              transform: `translate(-50%, -50%) translate(${off.dx}px, ${off.dy}px) rotate(${off.rotate ?? 0}deg)`,
            }}
          >
            <ProcessView
              process={t}
              revealAll={revealAll}
              light={light}
              opacity={opacities[t.id] ?? 0.85}
            />
          </div>
        );
      })}
    </div>
  );
};
