import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { colors, type as typo } from "@anima/core";
import { Caption } from "../components/Caption";
import { SystemBoxToken } from "../components/SystemBoxToken";
import { EXTRACTED_ACCENT } from "../theme";
import { at, s } from "../timing";

/**
 * Act 3 - the blob grows back, at enterprise scale. The Act 1-2 diagram
 * shrinks to a small inert anchor icon top-left (Act 4 calls back to it);
 * three department boxes fade in, each holding its own desynced "customer"
 * token - the pre-ERP silo mess, staged as the same "mess" shape as the
 * cold open's blob.
 */

const BOX_W = 300;
const BOX_H = 150;
const BOXES = [
  { label: "HR", x: 300, y: 460 },
  { label: "Purchasing", x: 810, y: 460 },
  { label: "Production", x: 1320, y: 460 },
];

export const Act3TheBlobGrowsBack: React.FC = () => {
  const frame = useCurrentFrame();

  const anchorDockT = interpolate(
    frame,
    [at("act3AnchorDock"), at("act3AnchorDock") + s(1)],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  const boxesIn = interpolate(frame, [at("act3BoxesIn"), at("act3BoxesIn") + s(1)], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const desyncAt = at("act3TokenDesync");
  // Each token pulses at a slightly different frame so the three visibly
  // do not move together - the desync IS the point of this beat.
  const pulseOffsets = [0, s(0.35), s(0.7)];

  const hrChangeAt = at("act3TokenChange");

  return (
    <AbsoluteFill style={{ backgroundColor: colors.BG }}>
      {/* Act 1-2 diagram, shrunk to an inert callback anchor, top-left. */}
      <div
        style={{
          position: "absolute",
          top: 40 + (1 - anchorDockT) * -40,
          left: 40,
          opacity: anchorDockT,
          transform: "scale(0.28)",
          transformOrigin: "top left",
        }}
      >
        <svg width={700} height={400} style={{ overflow: "visible" }}>
          <rect x={20} y={20} width={200} height={160} rx={10} fill={colors.SPEAKER.neutral.fill} stroke={colors.SPEAKER.neutral.line} strokeWidth={3} />
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
        {BOXES.map((b, i) => {
          const pulseAt = desyncAt + (pulseOffsets[i] ?? 0);
          const highlight = i === 0 ? EXTRACTED_ACCENT : undefined;
          return (
            <SystemBoxToken
              key={b.label}
              x={b.x}
              y={b.y}
              w={BOX_W}
              h={BOX_H}
              label={b.label}
              opacity={boxesIn}
              pulseAt={pulseAt}
              highlightColor={i === 0 ? EXTRACTED_ACCENT : undefined}
              tokenColor={i === 0 && frame >= hrChangeAt ? EXTRACTED_ACCENT : undefined}
            />
          );
        })}
      </svg>

      <Caption text="Different departments. Different copies of the same fact." appearAt={at("act3Caption1")} holdFrames={s(3)} />
      <Caption text="Change one, and the other two don't know." appearAt={at("act3Caption2")} holdFrames={s(3)} />
    </AbsoluteFill>
  );
};
