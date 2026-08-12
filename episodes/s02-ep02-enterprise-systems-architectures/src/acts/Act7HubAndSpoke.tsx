import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { colors, type as typo } from "@anima/core";
import { Caption } from "../components/Caption";
import { MeshHub, meshBoxPosition } from "../components/MeshHub";
import { EXTRACTED_ACCENT } from "../theme";
import { at, s } from "../timing";

/**
 * Act 7 - hub-and-spoke: same coupling, relocated. The Act 6 mesh's 15 lines
 * retract into 6 spokes running to a new central hub. Includes the beat the
 * script explicitly says not to cut even under time pressure: the hub's
 * interior briefly shows a tangle of small squiggly "rules" lines, echoing
 * Act 6's crossed-wire mess but now contained inside one box - without this,
 * the act would read as "hub-and-spoke = solved", which
 * hub-and-spoke-relocates-coupling explicitly says is not the claim.
 */

const BOXES = [
  { label: "ERP" },
  { label: "SCM" },
  { label: "Inventory" },
  { label: "Warehouse" },
  { label: "HR App" },
  { label: "CRM" },
];
const SCM_INDEX = 1;
const CRM_INDEX = 5;
// Must match MeshHub's own CENTER - kept as a separate constant here (rather
// than exported from MeshHub) since only this act needs it, for the route
// pulse's hub waypoint.
const CENTER = { x: 960, y: 500 };

export const Act7HubAndSpoke: React.FC = () => {
  const frame = useCurrentFrame();

  const scmPos = meshBoxPosition(SCM_INDEX, BOXES.length);
  const crmPos = meshBoxPosition(CRM_INDEX, BOXES.length);

  const routeAt = at("act7RoutePulse");
  const routeT = interpolate(frame, [routeAt, routeAt + s(1.6)], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  // Two-leg journey: SCM -> hub for the first half, hub -> CRM for the second.
  const leg1T = interpolate(routeT, [0, 0.5], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const leg2T = interpolate(routeT, [0.5, 1], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const pulsePos = routeT < 0.5
    ? { x: scmPos.x + (CENTER.x - scmPos.x) * leg1T, y: scmPos.y + (CENTER.y - scmPos.y) * leg1T }
    : { x: CENTER.x + (crmPos.x - CENTER.x) * leg2T, y: CENTER.y + (crmPos.y - CENTER.y) * leg2T };
  const pulseOpacity = interpolate(routeT, [0, 0.05, 0.95, 1], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const tangleAt = at("act7RulesTangle");
  const tangleOpacity = interpolate(frame, [tangleAt, tangleAt + s(0.4)], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const RULES_TANGLE = [
    [-24, -16, 16, -22], [16, -22, 21, 4], [21, 4, -8, 20], [-8, 20, -22, -4],
    [-22, -4, 4, -8], [4, -8, -12, 12], [-12, 12, 18, 16],
  ];

  return (
    <AbsoluteFill style={{ backgroundColor: colors.BG }}>
      <MeshHub
        boxes={BOXES}
        boxesInAt={0}
        mode="hub"
        retractAt={at("act7Retract")}
        retractFrames={s(1.6)}
        hubLabel="HUB"
        hubLabelOpacity={1 - tangleOpacity}
      />

      <svg width={1920} height={1080} style={{ position: "absolute", overflow: "visible" }}>
        <circle cx={pulsePos.x} cy={pulsePos.y} r={9} fill={EXTRACTED_ACCENT} opacity={pulseOpacity} />

        <g transform={`translate(${CENTER.x}, ${CENTER.y})`} opacity={tangleOpacity}>
          {RULES_TANGLE.map(([x1, y1, x2, y2], i) => (
            <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={colors.SPEAKER.amber.line} strokeWidth={2} strokeLinecap="round" opacity={0.9} />
          ))}
        </g>
      </svg>

      <Caption text="Same six systems. One shared hub instead." appearAt={at("act7Caption1")} holdFrames={s(3)} />
      <Caption text="The dependency didn't vanish. It moved into the hub." appearAt={at("act7Caption2")} holdFrames={s(3.5)} />
    </AbsoluteFill>
  );
};
