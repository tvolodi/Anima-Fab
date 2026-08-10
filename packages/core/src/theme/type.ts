/**
 * Typography.
 *
 * IMPORTANT: every font used must have full Cyrillic coverage. Labels are
 * "Ольга - HR", boxes are "Приказ о приёме". A font that silently falls back
 * for Cyrillic will look broken in a way that is easy to miss in preview and
 * obvious in the finished video.
 *
 * Safe choices with good Cyrillic: Inter, IBM Plex Sans, PT Sans, Fira Sans,
 * Roboto, Noto Sans. Avoid anything whose Cyrillic is an afterthought.
 *
 * Not yet wired to @remotion/google-fonts - the stack below relies on system
 * fonts, which renders consistently on this machine but NOT necessarily on a
 * render farm. Before the first real render, pin a webfont. See docs/TODO.md.
 */

export const FONT_STACK =
  '"Inter", "IBM Plex Sans", "Segoe UI", "PT Sans", system-ui, sans-serif';

export const SIZE = {
  nodeLabel: 22,
  edgeLabel: 17,
  speakerLabel: 34,
  speakerRole: 22,
  annotation: 19,
  title: 56,
} as const;

export const WEIGHT = {
  regular: 400,
  medium: 500,
  semibold: 600,
} as const;

export const TRACKING = {
  tight: "-0.01em",
  normal: "0",
  wide: "0.06em",
} as const;
