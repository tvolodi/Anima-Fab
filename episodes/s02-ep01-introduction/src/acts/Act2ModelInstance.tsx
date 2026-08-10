import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { ProcessView, Token, colors, layout, type as typo } from "@anima/core";
import { Caption } from "../components/Caption";
import { reseller } from "../data/processes";
import { forkWalkAt, type ForkSpec } from "../components/forkWalk";
import { at, s } from "../timing";

/**
 * Act 2 - model vs. instance (concept: model-vs-instance).
 *
 * One token walks the reseller diagram - forking at the parallel gateway,
 * merging at the join - then peels into a small "instance #N" ghost in a
 * growing stack. Repeated faster each time. The stack growing IS the
 * one-to-many point; no need to state the definition.
 */

const laid = layout(reseller);
const DIAGRAM_SCALE = 0.62;
const DIAGRAM_POS = { x: 210, y: 160 };

const nodeCenter = (id: string) => {
  const n = laid.nodes.find((n) => n.id === id);
  if (!n) return { x: 0, y: 0 };
  return { x: n.x + n.w / 2, y: n.y + n.h / 2 };
};

const buildFork = (startFrame: number, walkSeconds: number): ForkSpec => {
  const toSplit = [nodeCenter("r-start"), nodeCenter("r-receive-order"), nodeCenter("r-split")];
  const branchA = [nodeCenter("r-split"), nodeCenter("r-send-invoice"), nodeCenter("r-receive-payment"), nodeCenter("r-join")];
  const branchB = [nodeCenter("r-split"), nodeCenter("r-ship-products"), nodeCenter("r-join")];
  const merged = [nodeCenter("r-join"), nodeCenter("r-archive"), nodeCenter("r-end")];

  const trunkDur = s(walkSeconds * 0.4);
  const branchDur = s(walkSeconds * 0.4);
  const mergedDur = s(walkSeconds * 0.2);

  return {
    trunk: { points: toSplit, startFrame, durationFrames: trunkDur },
    branchA: { points: branchA, startFrame: startFrame + trunkDur, durationFrames: branchDur },
    branchB: { points: branchB, startFrame: startFrame + trunkDur, durationFrames: branchDur },
    merged: {
      points: merged,
      startFrame: startFrame + trunkDur + branchDur,
      durationFrames: mergedDur,
    },
  };
};

/** Instance run configs: spawn frame, walk duration (gets faster each run), stack slot. */
const RUNS = [
  { spawnAt: "act2Token1Walk" as const, seconds: 5.5, slot: 0 },
  { spawnAt: "act2Token2" as const, seconds: 2.4, slot: 1 },
  { spawnAt: "act2Token3" as const, seconds: 1.6, slot: 2 },
  { spawnAt: "act2Token4" as const, seconds: 1.2, slot: 3 },
];

export const Act2ModelInstance: React.FC = () => {
  const frame = useCurrentFrame();

  const modelLabelOpacity = interpolate(
    frame,
    [at("act2ModelLabel"), at("act2ModelLabel") + s(0.5)],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  return (
    <AbsoluteFill style={{ backgroundColor: colors.BG }}>
      <div
        style={{
          position: "absolute",
          transform: `translate(${DIAGRAM_POS.x}px, ${DIAGRAM_POS.y}px) scale(${DIAGRAM_SCALE})`,
        }}
      >
        <div
          style={{
            fontFamily: typo.FONT_STACK,
            fontSize: 20,
            letterSpacing: "0.08em",
            color: colors.SPEAKER.blue.line,
            opacity: modelLabelOpacity,
            marginBottom: 10,
          }}
        >
          MODEL
        </div>
        <div style={{ position: "relative" }}>
        <ProcessView process={reseller} revealAll />

        {/* Tokens ride in the same coordinate space as the diagram - this
            wrapper is `position: relative` and holds ONLY the diagram, so the
            token overlay's `top/left:-30` is relative to the diagram itself,
            not to the "MODEL" label stacked above it. */}
        <svg
          width={laid.width + 52}
          height={laid.height + 52}
          style={{ position: "absolute", top: -26, left: -26, overflow: "visible" }}
        >
          {RUNS.map((run, i) => {
            const startFrame = at(run.spawnAt);
            const fork = buildFork(startFrame, run.seconds);
            const w = forkWalkAt(fork, frame);
            const visible = frame >= startFrame - s(0.3) && frame < startFrame + s(run.seconds) + s(0.5);
            if (!visible) return null;

            if (w.single) {
              return (
                <Token key={i} x={w.single.x} y={w.single.y} r={16} heading={w.single.heading} mood={w.single.moving ? "walking" : "waiting"} />
              );
            }
            if (w.forked) {
              return (
                <React.Fragment key={i}>
                  <Token x={w.forked[0].x} y={w.forked[0].y} r={16} heading={w.forked[0].heading} mood="walking" />
                  <Token x={w.forked[1].x} y={w.forked[1].y} r={16} heading={w.forked[1].heading} mood="walking" />
                </React.Fragment>
              );
            }
            return null;
          })}
        </svg>
        </div>
      </div>

      {/* Receding instance stack, bottom-right. */}
      <div style={{ position: "absolute", right: 90, bottom: 90 }}>
        <div
          style={{
            fontFamily: typo.FONT_STACK,
            fontSize: 20,
            letterSpacing: "0.08em",
            color: colors.SPEAKER.neutral.line,
            textAlign: "right",
            marginBottom: 14,
            opacity: interpolate(frame, [at("act2Ghost1"), at("act2Ghost1") + s(0.5)], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
          }}
        >
          INSTANCES
        </div>
        <svg width={360} height={280} style={{ overflow: "visible" }}>
          {RUNS.map((run, i) => {
            const startFrame = at(run.spawnAt);
            const finishFrame = startFrame + s(run.seconds);
            const ghostOpacity = interpolate(
              frame,
              [finishFrame, finishFrame + s(0.4)],
              [0, 0.85],
              { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
            );
            if (ghostOpacity <= 0.01) return null;
            const gx = 40 + (i % 2) * 160;
            const gy = 20 + Math.floor(i / 2) * 110;
            return (
              <g key={i} opacity={ghostOpacity}>
                <rect x={gx} y={gy} width={130} height={80} rx={6} fill={colors.SPEAKER.blue.fill} stroke={colors.SPEAKER.blue.line} strokeWidth={1.5} opacity={0.6} />
                <text x={gx + 65} y={gy + 46} fill={colors.SPEAKER.blue.text} fontFamily={typo.FONT_STACK} fontSize={16} textAnchor="middle">
                  {`#${i + 1}`}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      <Caption text="One blueprint. Many cases." appearAt={at("act2Caption")} holdFrames={s(3.5)} />
    </AbsoluteFill>
  );
};
