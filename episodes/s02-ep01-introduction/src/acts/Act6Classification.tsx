import React from "react";
import { AbsoluteFill } from "remotion";
import { colors as coreColors } from "@anima/core";
import { AxisSlider } from "../components/AxisSlider";
import { Caption } from "../components/Caption";
import { at, s } from "../timing";

/**
 * Act 6 - classification axes are independent (concept:
 * classification-axes-are-independent).
 *
 * Two cases (the reseller order; a shipbuilding project) each land three dots
 * in the SAME beat across three tracks. Sequential landing would read as a
 * checklist again, undoing Act 1 - see AxisSlider.tsx.
 */

const dot1At = at("act6Dot1");
const dot2At = at("act6Dot2");

export const Act6Classification: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: coreColors.BG }}>
      <Caption text="So what kind of process is this?" appearAt={at("act6Caption1")} holdFrames={s(2.5)} position="center" />

      <AxisSlider
        leftLabel="Manual"
        rightLabel="Automated"
        tracksInAt={at("act6TracksIn")}
        y={380}
        cases={[
          { label: "Reseller order", position: 0.68, color: "blue", dotAt: dot1At },
          { label: "Shipbuilding project", position: 0.08, color: "green", dotAt: dot2At },
        ]}
      />
      <AxisSlider
        leftLabel="Rare"
        rightLabel="Repetitive"
        tracksInAt={at("act6TracksIn")}
        y={500}
        cases={[
          { label: "Reseller order", position: 0.85, color: "blue", dotAt: dot1At },
          { label: "Shipbuilding project", position: 0.05, color: "green", dotAt: dot2At },
        ]}
      />
      <AxisSlider
        leftLabel="Flexible"
        rightLabel="Structured"
        tracksInAt={at("act6TracksIn")}
        y={620}
        cases={[
          { label: "Reseller order", position: 0.72, color: "blue", dotAt: dot1At },
          { label: "Shipbuilding project", position: 0.15, color: "green", dotAt: dot2At },
        ]}
      />

      <Caption
        text="Not a category. A position — on every axis at once."
        appearAt={at("act6Caption2")}
        holdFrames={s(4)}
      />
    </AbsoluteFill>
  );
};
