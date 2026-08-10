import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { ProcessView, colors, layout, type as typo } from "@anima/core";
import { Caption } from "../components/Caption";
import { reseller } from "../data/processes";
import { at, s } from "../timing";

const laid = layout(reseller);

export const Close: React.FC = () => {
  const frame = useCurrentFrame();

  const diagramIn = interpolate(
    frame,
    [at("closeDiagramIn"), at("closeDiagramIn") + s(1)],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  const endCardOpacity = interpolate(
    frame,
    [at("endCard"), at("endCard") + s(0.7)],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  const restFadesOut = interpolate(
    frame,
    [at("endCard") - s(0.3), at("endCard")],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  return (
    <AbsoluteFill
      style={{
        backgroundColor: colors.BG,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          position: "absolute",
          transform: "scale(0.55)",
          opacity: diagramIn * restFadesOut,
        }}
      >
        <ProcessView process={reseller} revealAll />
      </div>

      <div style={{ opacity: restFadesOut }}>
        <Caption
          text="A process is what coordination looks like, once you draw it."
          appearAt={at("closeCaption")}
          holdFrames={s(3)}
          position="lowerThird"
        />
      </div>

      <div style={{ position: "absolute", textAlign: "center", opacity: endCardOpacity }}>
        <div style={{ fontFamily: typo.FONT_STACK, fontSize: 30, fontWeight: 600, color: colors.SPEAKER.neutral.text, letterSpacing: "0.02em" }}>
          BPM, honestly
        </div>
        <div style={{ fontFamily: typo.FONT_STACK, fontSize: 20, fontWeight: 400, color: colors.SPEAKER.neutral.line, marginTop: 14 }}>
          Next: Ch. 2 — Evolution of Enterprise Systems Architectures
        </div>
      </div>
    </AbsoluteFill>
  );
};
