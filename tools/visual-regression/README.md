# Visual regression

Pixel-diff checking for episode stills. No browser - Remotion's own CLI
already renders PNGs directly (`remotion still`); this tool's only job is
comparing a fresh render against a committed baseline with
[pixelmatch](https://github.com/mapbox/pixelmatch) (the same diff engine
Playwright uses internally for `toHaveScreenshot`, without the browser).

Built 2026-08-11 after a real bug (an origin box's boundary silently
vanishing once every subsystem had extracted, in `s02-ep02`) survived a
self-review pass and was only caught when the episode's owner watched the
finished render. A committed baseline + automatic diff catches that class of
regression on the very next change that touches the affected act - see
`CLAUDE.md`'s Builder role and the Movie Critic skill file.

## Usage

```bash
# First time for an episode, or after an intentional visual change:
node tools/visual-regression/check.mjs <episode> --update

# Normal check (exits 1 on any diff over threshold):
node tools/visual-regression/check.mjs <episode>

# Check a props variant (e.g. a second narration language) separately:
node tools/visual-regression/check.mjs <episode> --lang=en
node tools/visual-regression/check.mjs <episode> --lang=en --update

# Arbitrary props variant, not just --lang:
node tools/visual-regression/check.mjs <episode> --props='{"key":"val"}' --suffix=variant-name

# Tune sensitivity (rarely needed - see note below):
node tools/visual-regression/check.mjs <episode> --threshold=0.001
node tools/visual-regression/check.mjs <episode> --scale=1
```

Also available as `pnpm visual-check <episode> [flags]` from the repo root.

## What frames get checked

`snapshots.json` lists, per episode, a composition id and a set of
`{ frame, label }` entries. Pick frames at act boundaries and known-risky
beats - "everything just finished animating, is anything still visible" is
the exact shape of bug this caught. Add an episode's entry before running
`--update` for the first time; there's no auto-discovery, frame choice is a
judgement call (see the Builder skill file).

## The threshold

Default is **0.001%** of frame pixels - deliberately tight. The bug this tool
exists to catch only moved the diff from 0.000% to 0.002% of pixels (a thin,
low-opacity boundary line against a 1920x1080 frame) - a generic "0.5% is
normal image-noise" default would have missed it. Verified 2026-08-11 by
deliberately reintroducing that exact bug and confirming this default catches
it while an unchanged re-render stays at 0.000%.

If a specific episode has legitimately noisy pixels (e.g. anti-aliased
diagonal lines shifting by fractional pixels between renders on different
machines), loosen `--threshold` for that check rather than loosening the
tool's global default - the tight default is the point.

## Where things live

- `snapshots.json` - tracked in git, the spec of what to check.
- `baselines/<episode>/*.png` - tracked in git. These ARE the regression
  test; committing them is the point, same reasoning as `voice/manifest.json`
  being tracked while `voice/out/*.mp3` is gitignored (see `docs/VOICE.md`).
- `diffs/<episode>/*.png` - gitignored, scratch output on failure only
  (`*.diff.png` the visual diff, `*.new.png` the fresh render that didn't
  match). Not meant to persist - review then either fix the code or
  `--update` the baseline.

## Multiple variants (languages, prop-driven visual differences)

A baseline file is named `<composition>__f<frame>[__<suffix>].png`. Pass
`--lang=xx` as shorthand for `--props='{"lang":"xx"}' --suffix=xx`, or use
`--props`/`--suffix` directly for anything else. Each variant gets its own
baseline set under the same episode folder - `--update` only touches the
variant you're currently running.

## What this does NOT catch

Anything that requires actually watching or listening - delivery quality,
whether a diagram *reads* as tangled vs. confusing, audio pacing. This is a
pixel-exactness check on a fixed set of frames, nothing more. See the Movie
Critic skill file's "hard ceiling" section and `docs/PIPELINE.md`'s "what is
deliberately not automated."
