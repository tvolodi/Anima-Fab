# Where assets actually live

Referenced from `.gitignore`'s comments - this is the map. The pattern throughout: a
small, tracked JSON/text artifact describing an asset (ID, text, license, timing) plus
the actual binary regenerated from it on demand and never committed. Binaries in git
history bloat clones forever and can't be diffed; the source-of-truth artifacts can.

## Narration (per episode)

| What | Tracked | Gitignored |
|---|---|---|
| Script text + voice settings | `episodes/*/voice/lines.json` | — |
| Durations, frame counts, hashes | `episodes/*/voice/manifest.json` | — |
| Synthesised audio | — | `episodes/*/voice/out/` |
| Copy Remotion actually serves | — | `episodes/*/public/voice/` |

Regenerate: `node tools/tts/synth.mjs <episode>` (caches by content hash - see
`docs/VOICE.md`), then `pnpm <episode>:voice` to sync into `public/`.

## Music / SFX (cross-episode)

| What | Tracked | Gitignored |
|---|---|---|
| Catalogue: source ID, license, mood tags | `tools/sound-library/registry.json` | — |
| Cached audio | — | `assets/sound-library/{music,sfx}/*.mp3` |
| Copy Remotion actually serves | — | `episodes/*/public/{music,sfx}/` |

Regenerate: `node tools/sound-library/sync.mjs`, then each episode's own `sound` npm
script (see `episodes/s02-ep01-introduction/package.json`) to sync into `public/`.
Full workflow: `tools/sound-library/README.md`.

## Exploratory / throwaway audio

`tools/tts/sfx-out/` - anything generated while auditioning candidates (ElevenLabs
probes, Freesound downloads not yet decided into the registry). Gitignored, not
meant to survive - once a candidate wins, `add.mjs` copies it into the sound library
properly; everything else in this folder can be deleted at will.

## Source book material

`books/*.docx` / `books/*.pdf` - copyrighted chapter excerpts supplied for the
notes -> concept cards -> script pipeline (see `docs/PIPELINE.md`). Gitignored,
always. What gets committed instead is the *derived* work: `notes/*.md` and
`concepts/*.md`, which quote the source only in short attributed fragments embedded
in original analysis - never bulk reproduction.

## Rendered output

`out/*.mp4` - final renders. Gitignored; regenerate with each episode's `render`
script. These are the actual deliverable, uploaded to YouTube manually (see
`docs/PIPELINE.md`'s "What is deliberately NOT automated").

## Preview stills / comparison clips

`.preview/` - transient output from `remotion still`/`remotion render` used to
eyeball a frame or A/B two audio candidates against picture. Gitignored,
regenerate at will, safe to delete anytime between sessions.
