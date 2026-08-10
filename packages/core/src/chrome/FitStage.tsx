import React from "react";

/**
 * Scales its child to fill the frame with a margin, and centres it.
 *
 * Without this, a 5-box diagram and a 2-box diagram render at wildly different
 * apparent sizes - the director's short telling would look tiny next to
 * Olga's. Act 1 depends on all three testimonies having the SAME camera
 * position and apparent scale, because the sameness is what makes the Act 2
 * overlay land.
 *
 * Pass a fixed `scale` to opt out of auto-fitting when several shots must
 * share one scale.
 */
export const FitStage: React.FC<{
  contentWidth: number;
  contentHeight: number;
  frameWidth?: number;
  frameHeight?: number;
  margin?: number;
  maxScale?: number;
  scale?: number;
  offsetY?: number;
  children: React.ReactNode;
}> = ({
  contentWidth,
  contentHeight,
  frameWidth = 1920,
  frameHeight = 1080,
  margin = 190,
  maxScale = 2.4,
  scale,
  offsetY = 0,
  children,
}) => {
  const fit = Math.min(
    (frameWidth - margin * 2) / Math.max(contentWidth, 1),
    (frameHeight - margin * 2) / Math.max(contentHeight, 1),
  );
  const s = scale ?? Math.min(fit, maxScale);

  return (
    <div
      style={{
        position: "absolute",
        left: "50%",
        top: "50%",
        transform: `translate(-50%, -50%) translateY(${offsetY}px) scale(${s})`,
        transformOrigin: "center center",
      }}
    >
      {children}
    </div>
  );
};
