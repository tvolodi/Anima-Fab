import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import {
  EmptyFrame,
  FitStage,
  ProcessView,
  SpeakerLabel,
  colors,
  layout,
  type Process,
} from "@anima/core";
import { director, olga, sergey } from "../data/tellings";
import { ACTS, at, after, s } from "../timing";

/**
 * Act 1 - four testimonies.
 *
 * The script is emphatic that all three drawn testimonies use the SAME camera
 * position, the SAME diagram style and the SAME build rhythm. The sameness is
 * what makes the Act 2 mismatch land, so they share one component and one
 * fixed scale rather than each auto-fitting.
 *
 * The fourth testimony draws nothing at all.
 */

/** One shared scale, from the widest telling, so shots match exactly. */
const WIDEST = layout(olga);
const SHARED_SCALE = Math.min((1920 - 190 * 2) / WIDEST.width, 1.3);

/** Boxes land ON the word that names them - cue -> absolute frame. */
const cuesFor = (which: "olga" | "sergey" | "director"): Record<string, number> => {
  if (which === "olga") {
    // o01 lists the documents in order; spread the boxes across the line.
    const start = at("o01");
    const step = s(1.9);
    return {
      olga_start: start,
      olga_prikaz: start + step,
      olga_podpis: start + step * 2,
      olga_kartochka: start + step * 3,
      olga_knizhka: start + step * 4,
    };
  }
  if (which === "sergey") {
    const start = at("s01");
    const step = s(1.5);
    return {
      sergey_zayavka: start,
      sergey_account: start + step,
      sergey_mail: start + step * 2,
      sergey_dostup: start + step * 3,
      sergey_noutbuk: start + step * 4,
      // "Заявку никто не присылает" - the arrow from nowhere arrives on s03.
      sergey_nowhere: at("s03") + s(1.2),
    };
  }
  return {
    dir_novyi: at("d01"),
    dir_hr: at("d01") + s(2.2),
  };
};

const Testimony: React.FC<{
  process: Process;
  which: "olga" | "sergey" | "director";
  role?: string;
  labelAt: number;
}> = ({ process, which, role, labelAt }) => {
  const frame = useCurrentFrame();
  const laid = layout(process);

  // Sergey's "Заявка" box dims to near-invisible on "Если я знаю заранее" -
  // the request exists in his telling, but nobody ever sends it.
  const zayavkaDim =
    which === "sergey"
      ? interpolate(frame, [at("s02"), after("s02")], [1, 0.18], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        })
      : 1;

  return (
    <AbsoluteFill style={{ backgroundColor: colors.BG }}>
      <FitStage
        contentWidth={laid.width}
        contentHeight={laid.height}
        scale={SHARED_SCALE}
        offsetY={-40}
      >
        <ProcessView
          process={process}
          cues={cuesFor(which)}
          nodeOpacity={which === "sergey" ? { zayavka: zayavkaDim } : undefined}
        />
      </FitStage>
      <SpeakerLabel
        name={process.speaker}
        role={role}
        color={process.color}
        appearAt={labelAt}
      />
    </AbsoluteFill>
  );
};

/** The manager: a labelled lane with nothing in it. Draws no diagram, ever. */
const FourthTestimony: React.FC = () => {
  const frame = useCurrentFrame();
  // "Есть четвёртый." - the frame appears, and stays empty.
  const appear = at("n11");
  const o = interpolate(frame, [appear, appear + 14], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ backgroundColor: colors.BG }}>
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
        <div style={{ opacity: o }}>
          <EmptyFrame width={1180} height={330} appearAt={appear} />
        </div>
      </AbsoluteFill>
      <SpeakerLabel
        name="Руководитель"
        color="neutral"
        appearAt={at("n12")}
      />
    </AbsoluteFill>
  );
};

/**
 * Mount a child only within an absolute frame window.
 *
 * Deliberately NOT <Sequence>: Sequence rebases useCurrentFrame() to local
 * time, but every component here reads ABSOLUTE cue frames from timing.ts.
 * Nesting them in a Sequence made all cues fire at the wrong time - the empty
 * fourth lane rendered as a black frame because its appearAt never arrived.
 */
const Window: React.FC<{
  from: number;
  to: number;
  children: React.ReactNode;
}> = ({ from, to, children }) => {
  const frame = useCurrentFrame();
  if (frame < from || frame >= to) return null;
  return <>{children}</>;
};

export const Act1Testimonies: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: colors.BG }}>
    <Window from={ACTS.olga.start} to={ACTS.olga.end}>
      <Testimony process={olga} which="olga" role="HR" labelAt={at("n04")} />
    </Window>

    <Window from={ACTS.sergey.start} to={ACTS.sergey.end}>
      <Testimony process={sergey} which="sergey" role="IT" labelAt={at("n06")} />
    </Window>

    <Window from={ACTS.director.start} to={ACTS.director.end}>
      <Testimony process={director} which="director" labelAt={at("n08")} />
    </Window>

    <Window from={ACTS.fourth.start} to={ACTS.fourth.end}>
      <FourthTestimony />
    </Window>
  </AbsoluteFill>
);
