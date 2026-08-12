import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { colors, type as typo } from "@anima/core";
import { Caption } from "../components/Caption";
import { MeshHub } from "../components/MeshHub";
import { at, s } from "../timing";

const BOXES = [
  { label: "ERP" },
  { label: "SCM" },
  { label: "Inventory" },
  { label: "Warehouse" },
  { label: "HR App" },
  { label: "CRM" },
];

export const Close: React.FC = () => {
  const frame = useCurrentFrame();

  const diagramIn = interpolate(frame, [at("closeDiagramIn"), at("closeDiagramIn") + s(1)], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const endCardOpacity = interpolate(frame, [at("endCard"), at("endCard") + s(0.7)], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const restFadesOut = interpolate(frame, [at("endCard") - s(0.3), at("endCard")], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ backgroundColor: colors.BG, justifyContent: "center", alignItems: "center" }}>
      {/* Explicit full-frame size on the wrapper, not just position:absolute -
          MeshHub's <svg> is itself absolutely positioned with no intrinsic
          size of its own, so without this the wrapper collapses to zero size
          under justifyContent/alignItems:center and the scale() transform
          scales from the wrong origin, pushing the diagram off-center. Same
          "absolutely-positioned div with no intrinsic size" trap noted in
          ep01's Act1Coordination.tsx. */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: 1920,
          height: 1080,
          transform: "scale(0.45)",
          transformOrigin: "center center",
          opacity: diagramIn * restFadesOut,
        }}
      >
        <MeshHub boxes={BOXES} boxesInAt={0} mode="hub" retractAt={0} retractFrames={1} hubLabel="HUB" />
      </div>

      <div style={{ opacity: restFadesOut }}>
        <Caption
          text="Every fix so far has moved WHERE the coupling lives. None of them made the process itself visible."
          appearAt={at("closeCaption")}
          holdFrames={s(3)}
          size="large"
        />
      </div>

      <div style={{ position: "absolute", textAlign: "center", opacity: endCardOpacity }}>
        <div style={{ fontFamily: typo.FONT_STACK, fontSize: 30, fontWeight: 600, color: colors.SPEAKER.neutral.text, letterSpacing: "0.02em" }}>
          BPM, honestly
        </div>
        <div style={{ fontFamily: typo.FONT_STACK, fontSize: 20, fontWeight: 400, color: colors.SPEAKER.neutral.line, marginTop: 14 }}>
          Next: Ch. 2 §2.2 — Workflow Management
        </div>
      </div>
    </AbsoluteFill>
  );
};
