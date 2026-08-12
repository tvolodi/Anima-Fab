import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { colors } from "@anima/core";
import { Caption } from "../components/Caption";
import { SystemBoxToken } from "../components/SystemBoxToken";
import { at, s } from "../timing";

/**
 * Act 5 - and it happens again: SCM and CRM. The clean ERP box from Act 4
 * shrinks/moves left; two new boxes (each with their OWN token, independent
 * of ERP's) fade in beside it. The three tokens then desync on the exact
 * same timing curve as Act 3's desync beat - deliberately shot-for-shot,
 * per the script, so the repetition itself makes the card's argument.
 */

const BOX_W = 300;
const BOX_H = 150;
const ERP_START = { x: 760, y: 460, w: 400, h: 190 };
const ERP_TARGET = { x: 260, y: 460, w: 300, h: 150 };
const SCM_BOX = { x: 660, y: 460 };
const CRM_BOX = { x: 1060, y: 460 };

export const Act5ScmCrmSiloAgain: React.FC = () => {
  const frame = useCurrentFrame();

  const shrinkT = interpolate(frame, [at("act5ErpShrink"), at("act5ErpShrink") + s(1)], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const erpX = ERP_START.x + (ERP_TARGET.x - ERP_START.x) * shrinkT;
  const erpY = ERP_START.y + (ERP_START.y - ERP_TARGET.y) * 0; // y fixed
  const erpW = ERP_START.w + (ERP_TARGET.w - ERP_START.w) * shrinkT;
  const erpH = ERP_START.h + (ERP_TARGET.h - ERP_START.h) * shrinkT;

  const newBoxesIn = interpolate(frame, [at("act5NewBoxesIn"), at("act5NewBoxesIn") + s(1)], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const desyncAt = at("act5TokenDesync");
  const pulseOffsets = [0, s(0.35), s(0.7)];

  return (
    <AbsoluteFill style={{ backgroundColor: colors.BG }}>
      <svg width={1920} height={1080} style={{ position: "absolute", overflow: "visible" }}>
        <SystemBoxToken x={erpX} y={erpY} w={erpW} h={erpH} label="ERP" pulseAt={desyncAt + (pulseOffsets[0] ?? 0)} />
        <SystemBoxToken x={SCM_BOX.x} y={SCM_BOX.y} w={BOX_W} h={BOX_H} label="SCM" opacity={newBoxesIn} pulseAt={desyncAt + (pulseOffsets[1] ?? 0)} />
        <SystemBoxToken x={CRM_BOX.x} y={CRM_BOX.y} w={BOX_W} h={BOX_H} label="CRM" opacity={newBoxesIn} pulseAt={desyncAt + (pulseOffsets[2] ?? 0)} />
      </svg>

      <Caption text="Then new systems arrive. Different vendors." appearAt={at("act5Caption1")} holdFrames={s(2.5)} />
      <Caption text="The silo problem again. One level up." appearAt={at("act5Caption2")} holdFrames={s(3)} />
    </AbsoluteFill>
  );
};
