# Role: Builder

**Rigor: ad-hoc**, but self-verifies via required stills before reporting
done - that verification step is not optional even though the rest of the
approach is at Director/Builder discretion.

## What this role is for

Turns a finished script into a working Remotion episode: scaffold, timing,
components, acts, wiring.

## Inputs

The script (`scripts/*.md`) in full, including its Implementation Notes
section. A sibling episode's source as a structural template (copy the
`ActPreview`/`Window`/timing.ts pattern rather than reinventing it - see any
existing `episodes/*/src/` for the convention). Narration manifest(s) if they
exist yet (`voice/manifest*.json`) - timing should derive from real durations
plus explicit gaps, never hand-typed without deriving from something, and
never packed narration-end-to-end (see `docs/VOICE.md`'s "narration total is
NOT the episode length" lesson - hit twice now, once on ep01 and again on
`s02-ep02`'s first timing draft).

## What "good" looks like here

- Typecheck clean (`pnpm --filter <episode> typecheck`) before reporting
  done.
- Still-frame renders at the highest-build-risk beats (per the script's
  Implementation Notes) - actually look at them, don't just confirm the
  render didn't error.
- Absolute-cue acts mounted via `Window`, never `<Sequence>`, inside
  `Episode.tsx` - see `docs/TODO.md`'s "Trap worth knowing." Standalone
  per-act Studio compositions DO need `Sequence` wrapping via `ActPreview` -
  the trap runs the other direction in that context, don't flip the fix.
- If timing is narration-derived: verify programmatically that no line
  overlaps another or overruns its act boundary - don't just trust the math
  by eye. This caught a real bug in `s02-ep02` (a long line overran its act
  by 1.8s) that would have been invisible without a written check.
- **Once an episode has a first working build, establish visual-regression
  baselines** before considering the build done:
  `node tools/visual-regression/check.mjs <episode> --update` (add a
  `snapshots.json` entry first if the episode doesn't have one - see
  `tools/visual-regression/README.md`). On every later change to that
  episode, run `node tools/visual-regression/check.mjs <episode>` (no
  `--update`) before reporting done - it catches exactly the class of bug a
  single manually-inspected still misses, like a boundary silently going to
  0 opacity in code nobody happened to render a still of afterward. If a
  language/props variant exists, check it too
  (`--lang=en`) - baselines are per-variant.

## What this role does NOT do

Self-review from the Builder's own stills is real but insufficient - it did
not catch the missing problem/solution framing or the cross-language pacing
mismatch in `s02-ep02`, both structural issues invisible from a single still.
That's what the Movie Critic role and the Producer's own watch-through are
for. Don't present a Builder self-check as equivalent to either.
