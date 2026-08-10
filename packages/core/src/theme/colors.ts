import type { ColorKey } from "../process/types";

/**
 * The series palette.
 *
 * Dark ground throughout except Act 4, which cuts to white - the only warm
 * moment in episode 1. Speaker colours must stay distinguishable when overlaid
 * at partial opacity, which is why they are spaced around the wheel rather
 * than being a pleasant analogous set.
 */

export const BG = "#0E1116";
export const BG_WARM = "#FAF7F2";

export const SPEAKER: Record<ColorKey, { line: string; fill: string; text: string }> = {
  blue: { line: "#5AA9E6", fill: "#12263A", text: "#DCEBF7" },
  amber: { line: "#E0A458", fill: "#33240F", text: "#F7E9D6" },
  green: { line: "#6BBF73", fill: "#132A18", text: "#DFF0E2" },
  neutral: { line: "#C8CDD4", fill: "#1A1F26", text: "#EEF1F4" },
};

/** On the white Act 4 ground. */
export const SPEAKER_ON_LIGHT: Record<ColorKey, { line: string; fill: string; text: string }> = {
  blue: { line: "#2E6FA3", fill: "#E4EFF8", text: "#16334A" },
  amber: { line: "#A56E22", fill: "#FBF0DF", text: "#4A3410" },
  green: { line: "#3D7F45", fill: "#E6F2E8", text: "#1D3A21" },
  neutral: { line: "#4A525C", fill: "#EFF1F3", text: "#20262D" },
};

/**
 * The "this part is audited" frame.
 *
 * Olga's diagram gets it; Sergey's does not. The absence should be noticeable
 * if you are looking and invisible if you are not - so keep this subtle.
 * If it reads as decoration, it is too strong.
 */
export const VERIFIED_BORDER = "#7E8896";
export const VERIFIED_BORDER_WIDTH = 1.5;

/** Act 3: the correct diagram briefly blamed for someone else's failure. */
export const WRONGLY_BLAMED = "#C4544F";

/** Act 2: the empty region between diagrams, where the new hire waits. */
export const GAP_HIGHLIGHT = "#F2C14E";

export const DIM = 0.22;
export const TOKEN_BODY = "#F4F6F8";
export const TOKEN_EYE = "#0E1116";
