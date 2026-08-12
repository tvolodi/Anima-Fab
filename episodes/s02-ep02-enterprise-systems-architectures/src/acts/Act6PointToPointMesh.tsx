import React from "react";
import { AbsoluteFill } from "remotion";
import { colors } from "@anima/core";
import { Caption } from "../components/Caption";
import { CountUp } from "../components/CountUp";
import { MeshHub, allPairs } from "../components/MeshHub";
import { at, s } from "../timing";

/**
 * Act 6 - point-to-point: wiring it by hand. ERP/SCM/CRM plus three more
 * boxes (Inventory, Warehouse, HR App) - six systems, echoing the book's
 * N=6 example. Every pair gets wired directly; a count-up in the corner
 * ticks 1 -> 15 as lines land.
 */

const BOXES = [
  { label: "ERP" },
  { label: "SCM" },
  { label: "Inventory" },
  { label: "Warehouse" },
  { label: "HR App" },
  { label: "CRM" },
];

const totalPairs = allPairs(BOXES.length).length; // 15

export const Act6PointToPointMesh: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: colors.BG }}>
      <MeshHub
        boxes={BOXES}
        boxesInAt={at("act6SixBoxesIn")}
        mode="mesh"
        linesStartAt={at("act6LinesStart")}
        linesEndAt={at("act6LinesEnd")}
      />

      <CountUp
        from={0}
        to={totalPairs}
        startAt={at("act6LinesStart")}
        endAt={at("act6LinesEnd")}
        x={1620}
        y={100}
        suffix="wires"
      />

      <Caption text="Wire every pair directly." appearAt={at("act6Caption1")} holdFrames={s(2)} />
      <Caption
        text="Six systems. Fifteen wires. Every new system means more wires than the last one."
        appearAt={at("act6Caption2")}
        holdFrames={s(4)}
      />
    </AbsoluteFill>
  );
};
