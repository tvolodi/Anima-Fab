import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { colors, type as typo } from "@anima/core";
import { Caption } from "../components/Caption";
import { ProcessCard } from "../components/ProcessCard";
import { ProcessLandscape, landscapeBlockRect } from "../components/ProcessLandscape";
import { at, s } from "../timing";

/**
 * Act 3 - processes as black boxes. The connective beat's enlarged
 * "Operations" box resolves into Fig 2.14's landscape: five opaque blocks in
 * a chain plus After-Sales Service feeding back in. Product Development
 * pulls forward into a form-card reveal, then flips back opaque - the
 * closing is as important as the opening, per the script.
 */

const DEVELOPMENT_INDEX = 2; // Product Development's position in the chain

export const Act3ProcessLandscape: React.FC = () => {
  const frame = useCurrentFrame();

  const dockOpacity = interpolate(frame, [at("act3DockAnchors"), at("act3DockAnchors") + s(0.5)], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const zoomResolveT = interpolate(
    frame,
    [at("act3ZoomResolve"), at("act3ZoomResolve") + s(1.0)],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  const blocksInT = interpolate(frame, [at("act3LandscapeIn"), at("act3LandscapeIn") + s(2.0)], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const openT = interpolate(
    frame,
    [at("act3CardFlipIn"), at("act3CardFlipIn") + s(1.2), at("act3CardFlipBack"), at("act3CardFlipBack") + s(1.0)],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  const arrowsPulseT = interpolate(
    frame,
    [at("act3ArrowsPulse"), at("act3ArrowsPulse") + s(2.2)],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  const devRect = landscapeBlockRect(DEVELOPMENT_INDEX);
  const cardOpen = openT > 0.02;

  return (
    <AbsoluteFill style={{ backgroundColor: colors.BG }}>
      {/* Callback anchors, top-left: value-chain icon + knowledge-worker chain icon. */}
      <svg width={1920} height={1080} style={{ position: "absolute", overflow: "visible" }}>
        <g opacity={dockOpacity * 0.7}>
          <rect x={90} y={70} width={220} height={28} rx={4} fill={colors.SPEAKER.blue.fill} stroke={colors.SPEAKER.blue.line} strokeWidth={1} />
          <rect x={90} y={104} width={220} height={22} rx={4} fill={colors.SPEAKER.neutral.fill} stroke={colors.SPEAKER.neutral.line} strokeWidth={1} />
          <text x={200} y={58} fill={colors.SPEAKER.neutral.line} fontFamily={typo.FONT_STACK} fontSize={13} letterSpacing="0.06em" textAnchor="middle">
            VALUE CHAIN
          </text>
        </g>
        <g opacity={dockOpacity * 0.7}>
          <rect x={340} y={78} width={70} height={38} rx={6} fill={colors.SPEAKER.blue.fill} stroke={colors.SPEAKER.blue.line} strokeWidth={1} />
          <rect x={418} y={78} width={70} height={38} rx={6} fill={colors.SPEAKER.blue.fill} stroke={colors.SPEAKER.blue.line} strokeWidth={1} />
          <rect x={496} y={78} width={70} height={38} rx={6} fill={colors.SPEAKER.blue.fill} stroke={colors.SPEAKER.blue.line} strokeWidth={1} />
          <text x={433} y={58} fill={colors.SPEAKER.neutral.line} fontFamily={typo.FONT_STACK} fontSize={13} letterSpacing="0.06em" textAnchor="middle">
            KNOWLEDGE WORKER
          </text>
        </g>
      </svg>

      {/* The connective beat's box resolving down into one small opaque block. */}
      {zoomResolveT < 0.98 && (
        <svg width={1920} height={1080} style={{ position: "absolute", overflow: "visible" }}>
          <g opacity={1 - zoomResolveT}>
            <rect
              x={interpolate(zoomResolveT, [0, 1], [1920 / 2 - 450, devRect.x])}
              y={interpolate(zoomResolveT, [0, 1], [1080 / 2 - 240, devRect.y])}
              width={interpolate(zoomResolveT, [0, 1], [900, devRect.w])}
              height={interpolate(zoomResolveT, [0, 1], [480, devRect.h])}
              rx={14}
              fill={colors.SPEAKER.blue.fill}
              stroke={colors.SPEAKER.blue.line}
              strokeWidth={2.5}
            />
          </g>
        </svg>
      )}

      <div style={{ opacity: zoomResolveT }}>
        <ProcessLandscape
          blocksInT={blocksInT}
          hiddenBlockId={cardOpen ? "development" : undefined}
          arrowsPulseT={arrowsPulseT}
        />
      </div>

      {cardOpen && (
        <svg width={1920} height={1080} style={{ position: "absolute", overflow: "visible" }}>
          <ProcessCard
            fields={{
              name: "Product Development",
              manager: "Dr. Myers",
              scope: "Requirements → Rollout",
              inputs: ["Requirements Document", "Project Plan", "Budget Plan", "Prototypes"],
              supplierProcesses: ["Product Planning", "Innovation"],
              customerProcesses: ["Order Management", "After-Sales Service"],
            }}
            blockX={devRect.x}
            blockY={devRect.y}
            blockW={devRect.w}
            blockH={devRect.h}
            openT={openT}
          />
        </svg>
      )}

      <Caption
        text="Zoom back out. A company doesn't run on one function. It runs on a handful of processes — and each one stays a closed box."
        appearAt={at("act3Caption1")}
        holdFrames={s(3.0)}
      />
      <Caption
        text="None of these are opened up. What matters here is only what crosses the line between them."
        appearAt={at("act3Caption2")}
        holdFrames={s(2.8)}
      />
      <Caption
        text="This is as deep as the org level goes — a name, a manager, what comes in, what goes out."
        appearAt={at("act3Caption3")}
        holdFrames={s(3.0)}
      />
      <Caption
        text="Open it further, and you're describing one process's own internal work. Different question, different level."
        appearAt={at("act3Caption4")}
        holdFrames={s(3.0)}
      />
      <Caption
        text="What happens at these lines is what the business is actually judged on."
        appearAt={at("act3Caption5")}
        holdFrames={s(3.0)}
      />
    </AbsoluteFill>
  );
};
