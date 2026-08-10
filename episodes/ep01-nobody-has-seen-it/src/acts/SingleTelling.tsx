import React from "react";
import { AbsoluteFill } from "remotion";
import { FitStage, ProcessView, SpeakerLabel, colors, layout } from "@anima/core";
import { director, olga, sergey } from "../data/tellings";

/**
 * One testimony, centred. Act 1 uses the same camera position and build
 * rhythm for all three - the sameness is what makes the overlay land, so this
 * component is deliberately shared rather than written per-speaker.
 */

const BY_ID = { olga, sergey, director };

/**
 * All testimonies render at ONE fixed scale, derived from the widest telling
 * (Olga's, 5 boxes). If each auto-fitted, the director's 2-box diagram would
 * balloon to fill the frame and the shots would no longer match - which would
 * quietly destroy the Act 2 payoff.
 */
const WIDEST = layout(olga);
const SHARED_SCALE = Math.min((1920 - 190 * 2) / WIDEST.width, 1.35);

const ROLES: Record<string, string | undefined> = {
  olga: "HR",
  sergey: "IT",
  director: undefined,
};

export const SingleTelling: React.FC<{ which: keyof typeof BY_ID }> = ({
  which,
}) => {
  const process = BY_ID[which];
  const laid = layout(process);

  return (
    <AbsoluteFill style={{ backgroundColor: colors.BG }}>
      <FitStage
        contentWidth={laid.width}
        contentHeight={laid.height}
        scale={SHARED_SCALE}
        offsetY={-40}
      >
        <ProcessView process={process} revealAll />
      </FitStage>
      <SpeakerLabel
        name={process.speaker}
        role={ROLES[which]}
        color={process.color}
      />
    </AbsoluteFill>
  );
};
