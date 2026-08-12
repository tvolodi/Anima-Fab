/**
 * S02E2-local color additions.
 *
 * core/theme/colors.ts carries ep01's dramatic vocabulary (VERIFIED_BORDER,
 * WRONGLY_BLAMED, GAP_HIGHLIGHT) and S02E1's theme.ts adds its own EMPHASIS -
 * both encode narrative claims specific to their episodes (audited vs. not,
 * blame, the classification dots landing together). Reusing either here would
 * mislead anyone cross-referencing the palette, since this episode's accent
 * means something else: "the thing being extracted / the stable interface
 * line", reused consistently across every act so the eye learns to track it
 * (see script's "Visual spine" > Color). If a second episode wants the same
 * accent, promote it to core then - not before.
 */

export const EXTRACTED_ACCENT = "#5AA9E6";
