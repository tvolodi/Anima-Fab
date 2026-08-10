import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { ProcessView, colors, layout, type as typo } from "@anima/core";
import { Caption } from "../components/Caption";
import { reseller, act1ListLabels } from "../data/processes";
import { at, s } from "../timing";

/**
 * Act 1 - a process is not a list (concept: process-is-coordinated-not-a-list).
 *
 * The same four words first sit as an inert vertical list, then animate into
 * the reseller diagram's actual node positions. The transformation IS the
 * argument - nothing is added between the list and the diagram except
 * ordering and the gateway, so the snap has to read as "the same four things,
 * now coordinated" rather than a scene change.
 */

const laid = layout(reseller);
const DIAGRAM_SCALE = 0.72;

// The four labelled task nodes, in list order, mapped to their landing spots.
const LIST_NODE_IDS = ["r-receive-order", "r-send-invoice", "r-ship-products", "r-archive"];

export const Act1Coordination: React.FC = () => {
  const frame = useCurrentFrame();
  const local = frame - at("act1Start");

  const listIn = interpolate(local, [s(0), s(1.2)], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const snapStart = at("act1SnapToDiagram") - at("act1Start");
  const snapProgress = interpolate(local, [snapStart, snapStart + s(1.6)], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const easedSnap = easeInOut(snapProgress);

  // List items start stacked in the center; interpolate each toward its
  // diagram node position as snapProgress advances.
  const listCenter = { x: 960, y: 480 };
  const itemSpacing = 64;

  // Diagram wrapper is pinned at screen (0,0) with an explicit top/left, NOT
  // flex-centered - a scaled+translated absolutely-positioned div with no
  // intrinsic size does not center reliably under justify/align-items.
  // diagramTopLeft is where the diagram's (0,0) lands on screen, in SCREEN
  // pixels, so the diagram's visual center sits at (960, 460).
  const diagramTopLeft = {
    x: 960 - (laid.width * DIAGRAM_SCALE) / 2,
    y: 460 - (laid.height * DIAGRAM_SCALE) / 2,
  };

  const diagramOpacity = interpolate(local, [snapStart, snapStart + s(0.3)], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const holdCaptionAt = at("act1Caption2") - at("act1Start");

  return (
    <AbsoluteFill
      style={{
        backgroundColor: colors.BG,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {/* Plain list, boring on purpose - fades out as the snap takes over. */}
      <svg
        width={1920}
        height={1080}
        style={{ position: "absolute", overflow: "visible" }}
      >
        {act1ListLabels.map((label, i) => {
          const nodeId = LIST_NODE_IDS[i];
          const node = laid.nodes.find((n) => n.id === nodeId);
          const listX = listCenter.x - 140;
          const listY = listCenter.y - 1.5 * itemSpacing + i * itemSpacing;
          // Node centers are in unscaled diagram space; convert to screen
          // space using the same top-left + scale the wrapper div applies.
          const targetX = node
            ? diagramTopLeft.x + (node.x + node.w / 2) * DIAGRAM_SCALE - 140
            : listX;
          const targetY = node
            ? diagramTopLeft.y + (node.y + node.h / 2) * DIAGRAM_SCALE - 11
            : listY;

          const x = listX + (targetX - listX) * easedSnap;
          const y = listY + (targetY - listY) * easedSnap;
          const opacity = listIn * (1 - easedSnap * 0.0); // stays visible; diagram draws on top

          return (
            <text
              key={label}
              x={x}
              y={y}
              fill={colors.SPEAKER.neutral.text}
              fontFamily="monospace"
              fontSize={24}
              opacity={opacity * (1 - diagramOpacity)}
            >
              {label}
            </text>
          );
        })}
      </svg>

      {/* Reseller diagram fades in once the snap completes; full detail with gateway + arrows. */}
      <div
        style={{
          position: "absolute",
          top: diagramTopLeft.y,
          left: diagramTopLeft.x,
          transform: `scale(${DIAGRAM_SCALE})`,
          transformOrigin: "top left",
          opacity: diagramOpacity,
        }}
      >
        <ProcessView process={reseller} revealAll light={false} showVerified={false} />
      </div>

      <Caption
        text="A checklist. Is that a process?"
        appearAt={at("act1Caption1")}
        holdFrames={s(3)}
        position="lowerThird"
      />
      <Caption
        text="Coordination is the process. The tasks were always the easy part."
        appearAt={at("act1Caption2")}
        holdFrames={s(4)}
        position="lowerThird"
      />
    </AbsoluteFill>
  );
};

function easeInOut(t: number): number {
  return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
}
