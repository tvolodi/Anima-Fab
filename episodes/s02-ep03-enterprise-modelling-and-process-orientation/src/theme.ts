/**
 * S02E3-local color additions.
 *
 * core/theme/colors.ts carries ep01's dramatic vocabulary (VERIFIED_BORDER,
 * WRONGLY_BLAMED, GAP_HIGHLIGHT) and ep02's theme.ts adds EXTRACTED_ACCENT
 * ("the thing being extracted / the stable interface line"). Neither fits
 * here - this episode has no audited/blamed distinction and nothing is being
 * extracted-with-a-stable-interface the way ep02's OS/DBMS/GUI motif worked.
 * Two new episode-local tokens, per the script's "Visual spine" > Color:
 *
 * - MARGIN_ACCENT marks Act 1's margin wedge - "outcome, not interface", a
 *   distinct concept from ep02's accent, so it gets its own name rather than
 *   reusing EXTRACTED_ACCENT for a different meaning.
 * - CONTEXT_RELOAD_ACCENT marks Act 2's handover-cost discomfort: the one
 *   moment in the episode meant to look a little uncomfortable to watch, on
 *   purpose (script's own words). A warmer, slightly desaturated red-amber -
 *   distinct from both MARGIN_ACCENT and the neutral/blue palette so the eye
 *   reads it as "something costing effort" rather than just another accent.
 */

export const MARGIN_ACCENT = "#6BBF73";
export const CONTEXT_RELOAD_ACCENT = "#C97B5A";
