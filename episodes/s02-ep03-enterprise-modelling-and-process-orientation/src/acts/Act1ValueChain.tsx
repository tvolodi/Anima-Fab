import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { colors } from "@anima/core";
import { Caption } from "../components/Caption";
import { ValueChainBand } from "../components/ValueChainBand";
import { at, s } from "../timing";

/**
 * Act 1 - a value chain is what a company actually does. Fig 2.11's shape:
 * 5 primary-function boxes above 4 support-function boxes, feeding a Margin
 * wedge. Ends by opening a gap - dotted, unresolved process arrows that fade
 * to faint rather than completing, the setup Act 3 pays off.
 */

const PRIMARY = ["Inbound Logistics", "Operations", "Outbound Logistics", "Marketing and Sales", "Services"];
const SUPPORT = ["Firm Infrastructure", "Human Resource Mgmt", "Technology Management", "Procurement"];

export const Act1ValueChain: React.FC = () => {
  const frame = useCurrentFrame();

  const primaryInT = interpolate(frame, [at("act1PrimaryIn"), at("act1PrimaryIn") + s(3.5)], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const primaryFillT = interpolate(frame, [at("act1PrimaryFill"), at("act1PrimaryFill") + s(1.5)], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const supportInT = interpolate(frame, [at("act1SupportIn"), at("act1SupportIn") + s(1.5)], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const marginInT = interpolate(frame, [at("act1MarginIn"), at("act1MarginIn") + s(1.5)], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const dottedArrowsT = interpolate(
    frame,
    [at("act1DottedArrowsIn"), at("act1DottedArrowsIn") + s(2.0)],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  const dottedArrowsFadeT = interpolate(
    frame,
    [at("act1DottedArrowsFade"), at("act1DottedArrowsFade") + s(1.5)],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  return (
    <AbsoluteFill style={{ backgroundColor: colors.BG }}>
      <ValueChainBand
        primaryLabels={PRIMARY}
        supportLabels={SUPPORT}
        primaryInT={primaryInT}
        primaryFillT={primaryFillT}
        supportInT={supportInT}
        marginInT={marginInT}
        dottedArrowsT={dottedArrowsT}
        dottedArrowsFadeT={dottedArrowsFadeT}
      />

      <Caption
        text="Every company can be drawn as a set of functions — the jobs it has to do to create value."
        appearAt={at("act1Caption1")}
        holdFrames={s(2.5)}
      />
      <Caption
        text="These build the product and get it to a customer — the primary work."
        appearAt={at("act1Caption2")}
        holdFrames={s(2.5)}
      />
      <Caption
        text="Underneath, the functions that make the first row possible, without building the product themselves."
        appearAt={at("act1Caption3")}
        holdFrames={s(2.8)}
      />
      <Caption
        text="What's left over once both rows have done their work — the difference between what it cost and what it earned."
        appearAt={at("act1Caption4")}
        holdFrames={s(3.0)}
      />
      <Caption
        text="This is a value chain. It says what a company does. It does not yet say how the work actually moves."
        appearAt={at("act1Caption5")}
        holdFrames={s(3.0)}
      />
      <Caption
        text="That gap is exactly where this chapter is headed."
        appearAt={at("act1Caption6")}
        holdFrames={s(2.5)}
      />
    </AbsoluteFill>
  );
};
