# Sound library

A curated, cross-episode catalogue of music and SFX, so picking sound for a new
episode is a search, not a re-audition. Built after S02E01's ElevenLabs-vs-Freesound
comparison (2026-08-10) — Freesound won on mood fit (EL's generated candidate read as
too dramatic for the calm, no-cast "theory season" register), and the natural next
question was "how do we not redo that comparison every episode."

## How it's organized

- **`registry.json`** — the catalogue. Tracked in git. One entry per chosen track/SFX:
  Freesound source ID, license, mood tags, local cache path, which episodes use it.
- **`assets/sound-library/{music,sfx}/*.mp3`** — the actual audio files. **Gitignored**
  (same reasoning as `episodes/*/voice/out/` — binaries don't belong in git history).
  Regenerate from the registry with `sync.mjs`, which re-fetches from Freesound using
  the stored source ID.

This mirrors the narration pipeline's `voice/lines.json` + `voice/manifest.json` +
gitignored `voice/out/` split: text/metadata survive in git, audio is cheaply
regenerable and doesn't bloat the repo.

## Workflow

**Using an existing track:**

```bash
node tools/sound-library/search.mjs calm ambient
node tools/sound-library/search.mjs --kind=sfx click
```

Read-only, instant, no API calls. If something fits, reference its `file` path
directly from the episode (see "Wiring into an episode" below).

**Nothing fits — need something new:**

```bash
# Search Freesound directly (not the registry) for candidates
node tools/tts/freesound.mjs --search="soft mechanical click"

# Fetched one, like it? Decide it into the registry:
node tools/sound-library/add.mjs --id=12345 --name=soft-click \
  --kind=sfx --tags=ui,click,short --notes="for box-appear beats"
```

`add.mjs` fetches the preview mp3, measures its real duration, and writes the
registry entry in one step — no separate "now update the JSON" step to forget.

**After a fresh clone** (the mp3s aren't in git):

```bash
node tools/sound-library/sync.mjs
```

Re-fetches anything registry.json references but that isn't on disk. `--force`
re-fetches everything, e.g. if Freesound's preview encode ever changes.

## Wiring into an episode

Episodes don't call the registry at runtime — Remotion needs files in the episode's
own `public/`. The pattern (matching ep01's `voice/out/` → `public/voice/` sync
script in `package.json`):

1. Copy the needed file(s) from `assets/sound-library/` into the episode's `public/`
   (add an npm script per-episode, same shape as ep01's `"voice"` script).
2. Reference it in `Episode.tsx` with `<Audio src={staticFile("music/warm-pad-drone.mp3")} />`.
3. Trim/fade/level in the component itself (Remotion's `<Audio>` supports
   `startFrom`/`endAt`/`volume` props) rather than pre-editing the cached file — keeps
   the library entry reusable as-is across episodes that want different trims.

## Licensing

Every entry records `license` (full URL) and `licenseShort` (CC0 / CC-BY / etc).
**CC0 needs no attribution. CC-BY does** — if a CC-BY track ships in a published
episode, the attribution has to go in the video description. Check `licenseShort`
before picking a track for real use, not just for a comparison test.

`search.mjs` and `tools/tts/freesound.mjs` both default to CC0/CC-BY only (see
TOOLS.md's licensing section) — pass `--any-license` on the raw Freesound search to
see everything, but don't `add.mjs` anything with a more restrictive license without
checking it actually clears commercial YouTube use first.
