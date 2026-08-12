# State of the workspace

What works, what is stubbed, what is known-wrong. Written 2026-08-09, updated 2026-08-12.

## Verified working

- pnpm workspace, 4 packages, `pnpm -r typecheck` clean
- `@anima/core`: process model, layout, ProcessView, Overlay, Token, walk, chrome
- Episode 1 registers 4 compositions; `remotion compositions` lists them
- Stills render. Cyrillic renders correctly (checked visually)
- Chrome headless shell downloaded and cached
- **S02E03 ("The Business Side of the Same Question") built, rendered, and
  Movie-Critiqued 2026-08-12.** `out/s02-ep03.mp4` + `-en.mp4` exist, typecheck
  clean, visual-regression baselines set for both languages. Runtime 3:43 vs.
  the script's 2:30-3:00 target - accepted deliberately (never truncate real
  narration, never compress Act 2's dramatized centerpiece). Same known
  EN/RU timing-master tradeoff as `s02-ep02` (cues derived from the Russian
  manifest only; English clips finish early within their Russian-sized slot) -
  not a regression, an inherited, documented convention. **Still needs the
  Producer's actual watch-through** - the Critic's stills-only pass cannot
  confirm audio delivery, the Act 1 dotted-arrow fade reads correctly at 12%
  opacity on a real screen, or whether the English pacing gap is noticeable
  in practice.

## Known-wrong, needs your eye

### 1. Act 2 is now SWIMLANES, and the free overlay is abandoned

**Resolved.** After five attempts the free-overlay approach was dropped entirely
in favour of `Lanes` - four stacked bands, one per speaker.

The failed attempts, kept because they explain why lanes are right:

1. **Random offsets, X-spread only** - everything landed in one horizontal band
   and read as ONE confusing diagram.
2. **Polar fan** - "radial rays from one point" (the user's words). Director
   separated, but Olga and Sergey drifted side by side into one long process.
3. **Structured bands, 205px apart** - overcorrected into a tidy comparison
   slide.
4. **Bands at 118px** - blue and green tangled, amber stayed separate.
5. **Crossed axes** (Sergey laid out top-to-bottom) - produced "a horrible
   cross".

The mistake running through all five: chasing visual *chaos*. The act does not
need chaos, it needs legible **mismatch** - the viewer must see the accounts
separately AND see that they do not line up. Lanes give that structurally, and
they are BPMN's own idiom, which makes them the honest way to draw it.

What lanes bought:
- The manager's **empty lane** is finally visible - the strongest image in the
  episode, and impossible to stage in a free overlay.
- The gap highlight now cuts **vertically through all lanes**, which is correct:
  the failure is a handoff between people, not a hole in one diagram.
- Mismatch is tunable via `align` (per-lane X offset) instead of a chaos seed.

Sergey's `direction: "tb"` was reverted - it existed only to fight the overlay.

Remaining tuning, minor: `gapAt` is 0.46; lane offsets are
`olgaX 0 / sergeyX 330 / directorX 120`. All exposed as composition props:

```
npx remotion still src/index.ts Act2Overlay ../../.preview/x.png \
  --frame=1030 --scale=0.45 --props='{"sergeyX":380,"gapAt":0.5}'
```

### 3. Timing values are placeholders - but real durations now exist

`episodes/*/src/timing.ts` is still derived from the script's target timings.
**Real per-line durations are now available** in `voice/manifest.json` (narration
totals 194.8s across 40 lines), so this can finally be derived rather than guessed.

Do NOT simply pack lines end to end. The script's most important beats are exact
silences - the empty fourth column, the two seconds on the overlay - and they are
not in the manifest. Build timing as `line duration + explicit gap`.

194.8s of narration plus the scripted silences lands around 3:20-3:30, which
matches the script's target. That is a good sign the script is the right length.

## Built and rendering

**The whole episode assembles: `Episode`, 6795 frames = 3:46.** Narration is
183.0s; the scripted silences add ~43s. All acts exist and render.

- **timing.ts is derived from `voice/manifest.json`**, not hand-typed. Re-record a
  line, re-run synth, and the visuals re-time themselves. Gaps are explicit in
  `GAP_AFTER`, with the four protected silences marked.
- **The manager's empty frame renders** - labelled `Руководитель`, containing
  nothing. Verified at frame 2620.
- Act 3's token walks Olga's lane and stalls **past the end of her diagram**, in
  open space. Stalling mid-diagram would read as Olga being slow, which is the
  wrong argument.
- Act 4 hard-cuts to white and «Кто сообщает ИТ» - the box in nobody's telling -
  lands after the question.

**Trap worth knowing:** act components read ABSOLUTE cue frames, so inside `Episode`
they must NOT be wrapped in `<Sequence>` (it rebases `useCurrentFrame()` to local
time) - use the local `Window` helper instead. This bug rendered the empty fourth
lane as a black frame and was invisible from the code.

**Related, since fixed:** the standalone per-act Studio compositions (`Act3`, `Act4`,
etc. in `Root.tsx`) are the opposite case - THERE a `Sequence` offset is exactly what's
needed, because scrubbing one from local frame 0 previously showed nothing correct
(every absolute-cue interpolation read frame numbers far outside its range and
clamped). Fixed via `src/ActPreview.tsx`, which wraps each standalone act in a
`Sequence` shifted back to that act's real start. `Act2Overlay` is the one exception -
its `ACT2.*` timing constants are already act2-local, so it's intentionally left
unwrapped. Same fix applied to s02-ep01-introduction, where it was first found.

## Not built yet
- **Audio: narration DONE, mix not built.** All 40 lines synthesised with
  `eleven_v3` including audio tags; 38/40 verify at 100% (the 2 exceptions are
  false alarms - see docs/VOICE.md). Durations measured, manifest written.
  **Nobody has listened to them yet** - that is the open decision, not a task.
  The **mix** itself is still unbuilt, but `ffmpeg` is available (vendored via
  `@remotion/compositor-win32-x64-msvc` - see README's Environment notes), so
  that's no longer the blocker.
- **Fonts are not pinned.** `theme/type.ts` uses a system stack. It renders
  correctly here but will differ on any other machine or render farm. Pin a
  webfont with full Cyrillic coverage (Inter or IBM Plex Sans) before the first
  real render.
- **`notes/`, `concepts/`, `books/`** directories - waiting on your chapter.

## Decisions still open

- **Russian TTS quality.** Olga and Sergey carry episode 1. Audition before
  committing to a tier: `node tools/tts/audition.mjs --role=olga --voices=...`.
  Fallback if they fail is two real people reading four lines each - the wife
  option for Olga specifically, since she is an HR auditor.
- **BPMN terminology in Russian** - шлюз / развилка / keep English? Episode 1 avoids
  notation entirely so nothing is locked in. Episode 2 cannot avoid it.
- **Token visual** - `Token.tsx` has never been rendered. It may need size and
  squash tuning once seen against a diagram.
