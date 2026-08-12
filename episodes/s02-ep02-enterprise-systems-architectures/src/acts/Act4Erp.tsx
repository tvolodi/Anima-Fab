import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { Token, colors, type as typo } from "@anima/core";
import { Caption } from "../components/Caption";
import { EXTRACTED_ACCENT } from "../theme";
import { at, s } from "../timing";

/**
 * Act 4 - ERP: one extraction, enterprise scale. Act 3's three boxes slide
 * together and merge into one "ERP" box; their three desynced tokens merge
 * into one token that pulses clean - the direct visual payoff of Act 3's
 * desync beat, and the extraction motif's inverse (three origins fold into
 * one destination instead of one origin shedding a piece).
 */

const BOX_W = 300;
const BOX_H = 150;
const START = [
  { label: "HR", x: 300, y: 460 },
  { label: "Purchasing", x: 810, y: 460 },
  { label: "Production", x: 1320, y: 460 },
];
const ERP_BOX = { x: 760, y: 460, w: 400, h: 190 };
const ERP_CENTER = { x: ERP_BOX.x + ERP_BOX.w / 2, y: ERP_BOX.y + ERP_BOX.h / 2 };

export const Act4Erp: React.FC = () => {
  const frame = useCurrentFrame();

  const mergeT = interpolate(frame, [at("act4Merge"), at("act4Merge") + s(1.4)], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const boxFadeOut = interpolate(mergeT, [0.75, 1], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const erpFadeIn = interpolate(mergeT, [0.6, 1], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const erpLabelOpacity = interpolate(frame, [at("act4Merge") + s(1.6), at("act4Merge") + s(2.1)], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const pulseAt = at("act4TokenPulse");
  const cleanPulse = interpolate(frame, [pulseAt, pulseAt + 8, pulseAt + 20], [1, 1.4, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const anchorHighlight = interpolate(
    frame,
    [at("act4AnchorHighlight"), at("act4AnchorHighlight") + s(0.3), at("act4AnchorHighlight") + s(1.2), at("act4AnchorHighlight") + s(1.5)],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  return (
    <AbsoluteFill style={{ backgroundColor: colors.BG }}>
      {/* Persistent Act 1-2 anchor, top-left, briefly highlighted for the callback. */}
      <div style={{ position: "absolute", top: 40, left: 40, transform: "scale(0.28)", transformOrigin: "top left" }}>
        <svg width={700} height={400} style={{ overflow: "visible" }}>
          <rect
            x={20}
            y={20}
            width={200}
            height={160}
            rx={10}
            fill={colors.SPEAKER.neutral.fill}
            stroke={anchorHighlight > 0 ? EXTRACTED_ACCENT : colors.SPEAKER.neutral.line}
            strokeWidth={anchorHighlight > 0 ? 3 + anchorHighlight * 4 : 3}
          />
          <text x={120} y={100} fill={colors.SPEAKER.neutral.text} fontFamily={typo.FONT_STACK} fontSize={26} textAnchor="middle">
            logic
          </text>
          {[
            { dx: -140, dy: 0, label: "OS" },
            { dx: 0, dy: 180, label: "DBMS" },
            { dx: 260, dy: 0, label: "GUI" },
          ].map((d) => (
            <g key={d.label}>
              <line x1={120} y1={100} x2={120 + d.dx} y2={100 + d.dy} stroke={EXTRACTED_ACCENT} strokeWidth={4} />
              <rect x={120 + d.dx - 60} y={100 + d.dy - 40} width={120} height={80} rx={8} fill={colors.SPEAKER.blue.fill} stroke={EXTRACTED_ACCENT} strokeWidth={3} />
              <text x={120 + d.dx} y={100 + d.dy} fill={colors.SPEAKER.blue.text} fontFamily={typo.FONT_STACK} fontSize={24} textAnchor="middle" dominantBaseline="central">
                {d.label}
              </text>
            </g>
          ))}
        </svg>
      </div>

      <svg width={1920} height={1080} style={{ position: "absolute", overflow: "visible" }}>
        <g opacity={boxFadeOut}>
          {START.map((b) => {
            const cx = b.x + BOX_W / 2 + (ERP_CENTER.x - (b.x + BOX_W / 2)) * mergeT;
            const cy = b.y + BOX_H / 2 + (ERP_CENTER.y - (b.y + BOX_H / 2)) * mergeT;
            const scale = 1 - mergeT * 0.35;
            const w = BOX_W * scale;
            const h = BOX_H * scale;
            return (
              <g key={b.label}>
                <rect x={cx - w / 2} y={cy - h / 2} width={w} height={h} rx={10} fill={colors.SPEAKER.neutral.fill} stroke={colors.SPEAKER.neutral.line} strokeWidth={2} />
                <text x={cx} y={cy - h / 2 + 26} fill={colors.SPEAKER.neutral.text} fontFamily={typo.FONT_STACK} fontSize={18} textAnchor="middle">
                  {b.label}
                </text>
                <Token x={cx} y={cy + 10} r={14} mood="waiting" />
              </g>
            );
          })}
        </g>

        <g opacity={erpFadeIn}>
          <rect x={ERP_BOX.x} y={ERP_BOX.y} width={ERP_BOX.w} height={ERP_BOX.h} rx={12} fill={colors.SPEAKER.blue.fill} stroke={EXTRACTED_ACCENT} strokeWidth={3} />
          <text x={ERP_CENTER.x} y={ERP_BOX.y + 34} fill={colors.SPEAKER.blue.text} fontFamily={typo.FONT_STACK} fontSize={24} fontWeight={600} textAnchor="middle" opacity={erpLabelOpacity}>
            ERP
          </text>
          <g transform={`translate(${ERP_CENTER.x}, ${ERP_CENTER.y + 20}) scale(${cleanPulse}) translate(${-ERP_CENTER.x}, ${-(ERP_CENTER.y + 20)})`}>
            <Token x={ERP_CENTER.x} y={ERP_CENTER.y + 20} r={20} mood="waiting" />
          </g>
          <text x={ERP_CENTER.x} y={ERP_CENTER.y + 60} fill={colors.SPEAKER.neutral.line} fontFamily={typo.FONT_STACK} fontSize={14} textAnchor="middle">
            customer
          </text>
        </g>
      </svg>

      <Caption text="One shared database. One copy of the truth." appearAt={at("act4Caption1")} holdFrames={s(3)} />
      <Caption text="The same move as the OS. Just bigger." appearAt={at("act4Caption2")} holdFrames={s(4)} />
    </AbsoluteFill>
  );
};
