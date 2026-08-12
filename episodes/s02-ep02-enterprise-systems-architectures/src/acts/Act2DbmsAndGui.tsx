import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { colors, type as typo } from "@anima/core";
import { Caption } from "../components/Caption";
import { ExtractionMotif } from "../components/ExtractionMotif";
import { at, s } from "../timing";

/**
 * Act 2 - DBMS and GUI, same move twice. Picks up the blob+OS state Act 1
 * ended on (OS already docked left) and runs the extraction motif twice
 * more, faster and more telegraphed - "same move, three times" per the
 * script, rather than re-explaining the motif.
 */

const BLOB_LINES_FULL = [
  [-60, -40, 40, -55], [30, -55, 62, 10], [62, 10, 10, 50], [10, 50, -55, 35],
  [-55, 35, -40, -20], [-40, -20, 15, -10], [15, -10, -10, 30], [-10, 30, 45, 25],
  [45, 25, 20, -35], [20, -35, -30, -45], [-30, -45, -5, 5], [-5, 5, 35, 5],
];
// Act 1 already removed 4 lines when OS left; Act 2 removes 4 more per extraction.
const AFTER_OS = BLOB_LINES_FULL.slice(0, BLOB_LINES_FULL.length - 4);

const ORIGIN = { x: 760, y: 420, w: 260, h: 220 };
const OS_BOX = { x: ORIGIN.x - 130 - 100, y: ORIGIN.y + ORIGIN.h / 2 - 55, w: 200, h: 110 };

export const Act2DbmsAndGui: React.FC = () => {
  const frame = useCurrentFrame();

  const dbmsShrinkT = interpolate(
    frame,
    [at("act2ExtractDbms"), at("act2ExtractDbms") + s(1.2)],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  const guiShrinkT = interpolate(
    frame,
    [at("act2ExtractGui"), at("act2ExtractGui") + s(1.2)],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  const visibleLineCount = Math.round(
    AFTER_OS.length - dbmsShrinkT * 4 - guiShrinkT * 4,
  );

  const finalLabelOpacity = interpolate(
    frame,
    [at("act2ExtractGui") + s(1.6), at("act2ExtractGui") + s(2.2)],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  // Brief aside: two tiny alternate internal layouts flash behind the DBMS
  // box while its outer boundary stays fixed (physical/logical independence).
  const asideAt = at("act2DbmsAside");
  const asideOpacity = interpolate(
    frame,
    [asideAt, asideAt + s(0.3), asideAt + s(1.6), asideAt + s(1.9)],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  const asideFlip = Math.floor((frame - asideAt) / 12) % 2;

  const dbmsDock = { x: ORIGIN.x, y: ORIGIN.y + ORIGIN.h + 130 };
  const guiDock = { x: ORIGIN.x + ORIGIN.w + 130 + 100, y: ORIGIN.y + ORIGIN.h / 2 - 55 };

  return (
    <AbsoluteFill style={{ backgroundColor: colors.BG }}>
      <svg width={1920} height={1080} style={{ position: "absolute", overflow: "visible" }}>
        {/* OS box + connector, carried over from Act 1's end state. */}
        <line
          x1={ORIGIN.x}
          y1={ORIGIN.y + ORIGIN.h / 2}
          x2={OS_BOX.x + OS_BOX.w}
          y2={OS_BOX.y + OS_BOX.h / 2}
          stroke={colors.SPEAKER.blue.line}
          strokeWidth={2.5}
        />
        <rect x={OS_BOX.x} y={OS_BOX.y} width={OS_BOX.w} height={OS_BOX.h} rx={10} fill={colors.SPEAKER.blue.fill} stroke={colors.SPEAKER.blue.line} strokeWidth={2.5} />
        <text x={OS_BOX.x + OS_BOX.w / 2} y={OS_BOX.y + OS_BOX.h / 2} fill={colors.SPEAKER.blue.text} fontFamily={typo.FONT_STACK} fontSize={20} fontWeight={600} textAnchor="middle" dominantBaseline="central">
          OS
        </text>

        {/* Persistent boundary, carried over from Act 1 - without it, once
            both DBMS and GUI extract (visibleLineCount hits 0) nothing marks
            where "business logic" still lives; the scribble was never its
            own container. */}
        <rect
          x={ORIGIN.x}
          y={ORIGIN.y}
          width={ORIGIN.w}
          height={ORIGIN.h}
          rx={10}
          fill="none"
          stroke={colors.SPEAKER.neutral.line}
          strokeWidth={1.5}
          opacity={0.35}
        />
        <text
          x={ORIGIN.x + ORIGIN.w / 2}
          y={ORIGIN.y - 22}
          fill={colors.SPEAKER.neutral.line}
          fontFamily={typo.FONT_STACK}
          fontSize={16}
          letterSpacing="0.05em"
          textAnchor="middle"
          opacity={1 - finalLabelOpacity}
        >
          APPLICATION
        </text>
        <text
          x={ORIGIN.x + ORIGIN.w / 2}
          y={ORIGIN.y - 22}
          fill={colors.SPEAKER.neutral.line}
          fontFamily={typo.FONT_STACK}
          fontSize={16}
          letterSpacing="0.05em"
          textAnchor="middle"
          opacity={finalLabelOpacity}
        >
          BUSINESS LOGIC
        </text>
        <g transform={`translate(${ORIGIN.x + ORIGIN.w / 2}, ${ORIGIN.y + ORIGIN.h / 2})`}>
          {AFTER_OS.slice(0, visibleLineCount).map(([x1, y1, x2, y2], i) => (
            <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={colors.SPEAKER.neutral.line} strokeWidth={3} strokeLinecap="round" opacity={0.85} />
          ))}
        </g>

        <ExtractionMotif
          origin={ORIGIN}
          originLabel=""
          extractedLabel="DBMS"
          dockSide="bottom"
          dockGap={130}
          direction="extract"
          progressAt={at("act2ExtractDbms")}
          progressFrames={s(1.6)}
          originOpacity={0}
        />
        <ExtractionMotif
          origin={ORIGIN}
          originLabel=""
          extractedLabel="GUI"
          dockSide="right"
          dockGap={130}
          direction="extract"
          progressAt={at("act2ExtractGui")}
          progressFrames={s(1.6)}
          originOpacity={0}
        />

        {/* Aside: two tiny alternate internal layouts flashing behind the fixed DBMS boundary. */}
        <g opacity={asideOpacity} transform={`translate(${dbmsDock.x}, ${dbmsDock.y + 70})`}>
          {asideFlip === 0 ? (
            <g>
              <rect x={-70} y={-18} width={44} height={36} fill="none" stroke={colors.SPEAKER.amber.line} strokeWidth={1.5} />
              <rect x={-18} y={-18} width={44} height={36} fill="none" stroke={colors.SPEAKER.amber.line} strokeWidth={1.5} />
              <rect x={34} y={-18} width={44} height={36} fill="none" stroke={colors.SPEAKER.amber.line} strokeWidth={1.5} />
            </g>
          ) : (
            <g>
              <rect x={-70} y={-24} width={148} height={20} fill="none" stroke={colors.SPEAKER.amber.line} strokeWidth={1.5} />
              <rect x={-70} y={0} width={148} height={20} fill="none" stroke={colors.SPEAKER.amber.line} strokeWidth={1.5} />
            </g>
          )}
        </g>
      </svg>

      <Caption text="Then: where does the data live?" appearAt={at("act2Caption1")} holdFrames={s(2.5)} />
      <Caption text="Then: how does a person actually use it?" appearAt={at("act2Caption2")} holdFrames={s(2.5)} />
      <Caption
        text="Same move, three times. Pull out a concern, keep one stable line back."
        appearAt={at("act2Caption3")}
        holdFrames={s(2.8)}
      />
    </AbsoluteFill>
  );
};
