# Anima-Fab

Animated explainers for BPM, Business Analysis and Project Management.
Book chapter in, watchable episode out, with one human gate in the middle.

See [docs/PIPELINE.md](docs/PIPELINE.md) for how the pipeline works and why the
gate is where it is. See [docs/TODO.md](docs/TODO.md) for what currently works and
what is known-wrong.

## Layout

```
scripts/     episode scripts (.md) - narration + screen, written before code
packages/
  core/      @anima/core - process model, layout, renderer, token, theme
episodes/
  ep01-.../  one Remotion project per episode
tools/
  preview-mcp/  MCP server: render a frame, look at it
  tts/          ElevenLabs synthesis + voice auditions
docs/
books/       source material (gitignored)
```

**The boundary:** if it names Olga, Sergey, or an act, it lives in the episode.
If it answers "how do we draw a process?", it lives in core. No `<OlgaTestimony/>`
in core, ever.

## Running it

```bash
pnpm install

# Remotion Studio for episode 1
pnpm ep01

# typecheck everything
pnpm typecheck

# render a single act
cd episodes/ep01-nobody-has-seen-it
npx remotion render src/index.ts Act2Overlay out/act2.mp4
```

Compositions currently registered: `Act2Overlay`, `Olga`, `Sergey`, `Director`.

## The preview MCP server

Lets Claude render a frame and actually look at it - needed for judgements the
code cannot make ("is this overlay convincingly ugly?").

Register it once:

```bash
claude mcp add anima-preview -- node "c:/Users/tvolo/dev/ai-dala/Anima-Fab/tools/preview-mcp/src/server.js"
```

Then restart Claude Code. Three tools become available: `list_episodes`,
`list_compositions`, `render_frame`.

`render_frame` takes `props`, so overlay variants can be swept without editing
code:

```json
{ "episode": "ep01-nobody-has-seen-it", "composition": "Act2Overlay",
  "frame": 200, "props": { "seed": 12, "chaos": 1.3 } }
```

Renders take 10-60s. Prefer a few well-chosen frames over sweeps.

## Voice

TTS via ElevenLabs — see [docs/VOICE.md](docs/VOICE.md). Put the key in `.env`:

```
ELEVENLABS_API_KEY=sk_...
```

**Audition before committing to a tier.** Olga and Sergey carry episode 1 and are
exactly the deliveries TTS tends to flatten:

```bash
node tools/tts/audition.mjs --list
node tools/tts/audition.mjs --role=olga --voices=id1,id2,id3
node tools/tts/synth.mjs ep01-nobody-has-seen-it --dry-run
```

Whole episode is 40 lines / 2413 characters. Synthesis is cached by content hash,
so editing three lines re-bills three lines.

## Environment notes

- Node 24, pnpm 10 - verified working
- `esbuild` needs its postinstall to run; allowed via `onlyBuiltDependencies` in
  `pnpm-workspace.yaml`
- **Relative imports must NOT use `.js` extensions.** Remotion's webpack resolver
  does not handle them and fails with a confusing "Field 'browser' doesn't contain
  a valid alias configuration" error.
- **No standalone `ffmpeg` install, but one is vendored** by
  `@remotion/compositor-win32-x64-msvc` (pulled in via `@remotion/renderer`) at
  `node_modules/.pnpm/@remotion+compositor-win32-x64-msvc@<version>/node_modules/@remotion/compositor-win32-x64-msvc/ffmpeg.exe`.
  It has a restricted filter set (no `afade` - use `volume` for level changes) but
  covers muxing, encoding, and basic audio filtering. Used for the audio mix stage
  and for muxing music/SFX comparison clips - see `tools/tts/`.
