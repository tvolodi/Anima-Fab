# Voice

TTS via ElevenLabs. No human recording in the pipeline for now.

## The order to do this in

**1. Put the key in `.env`** at the repo root (gitignored):

```
ELEVENLABS_API_KEY=sk_...
```

Any reasonable spelling works (`elevenlab_api_key`, `ELEVEN_LABS_API_KEY`, ...) -
the loader normalises anything containing "eleven" and "key".

**Account status as of 2026-08-09:** key verified working, 21 voices available -
but **all 21 are the default English stock voices** (`language=en`). The
multilingual model speaks Russian with them, and word accuracy round-trips at
100%, but the timbre was designed around English phonetics. Browse the Voice
Library for Russian-native voices and add them to the account before deciding.

**2. Audition BEFORE committing to a tier.**

```bash
node tools/tts/audition.mjs --list
```

Lists voices on the account. The Voice Library on the website has far more -
browse there, filter for Russian or multilingual, add the ones you like to the
account, then re-run `--list`.

Then audition the two that matter:

```bash
node tools/tts/audition.mjs --role=olga   --voices=id1,id2,id3
node tools/tts/audition.mjs --role=sergey --voices=id1,id2,id3
```

Output lands in `voice-auditions/<role>/`. Listen to all candidates back to back.

**3. Paste the winners** into `episodes/ep01-nobody-has-seen-it/voice/lines.json`
under `speakers.<role>.voiceId`.

**4. Synthesise:**

```bash
node tools/tts/synth.mjs ep01-nobody-has-seen-it --dry-run   # check first
node tools/tts/synth.mjs ep01-nobody-has-seen-it
```

## Why audition Olga and Sergey specifically

They carry the episode, and they are exactly the deliveries TTS tends to flatten.

The audition lines are chosen to be **hard, not representative** - each is a place
where a flat read kills the moment:

| Role | What to listen for |
|---|---|
| **olga** | Competent and slightly defensive. A person used to being blamed for delays that are not hers. Must NOT sound like a bureaucrat joke or a customer-service robot. The repetition must build, not flatten. |
| **sergey** | Tired, not angry. Resignation, not complaint. If he sounds irritated, the audience sides against him and the act breaks. |
| **narrator** | Completely flat on the 2019 line - the biggest laugh in the episode, and it dies if the voice "performs" it. |
| **hire** | Genuinely uncertain, not comic. Emotional close of the episode. |

If Olga and Sergey both fail across several voices, that is a real signal - the
fallback is two people reading four lines each, not a better prompt.

## Round-trip verification (what STT can and cannot do)

```bash
node tools/tts/verify.mjs ep01-nobody-has-seen-it
node tools/tts/verify.mjs --file=voice-auditions/olga/<id>.mp3 --expect="текст"
```

Sends synthesised audio back through ElevenLabs Scribe and compares the
transcript to the text we asked for.

**What this catches:** pronunciation and normalisation defects - swallowed words,
misread numerals, wrong stress that changes the word. Mechanical, and worth
running over a full episode.

**What this cannot catch:** delivery. Transcription returns words, and the words
were the input. Whether Olga sounds defensive-but-competent or like a
call-centre robot is precisely what STT discards. Use it as a defect filter,
never as an approval gate.

### Number folding

The lines file spells numbers out ("в две тысячи девятнадцатом") to control TTS
pronunciation, but Scribe transcribes them back as digits ("в 2019-м"). The
comparator folds Russian number words into digits so these compare equal -
otherwise every number in every episode would be flagged and the report would
become noise to be ignored.

Verified working: the 2019 line scores 100% against both narrator candidates, and
a deliberately wrong expectation ("двенадцатом", "давно на пенсии") correctly
drops to 63.6% with a precise word diff.

## Cast (Russian-native, locale=ru-RU)

| Role | Voice | ID | Stability |
|---|---|---|---|
| narrator | Marina - Soft, Clear and Warm | `ymDCYd8puC7gYjxIamPt` | **0.85** |
| olga | Larisa Actrisa - Confident and Clear | `AB9XsbSA4eLG12t2myjN` | 0.65 |
| sergey | Egor - Natural, Soothing, Relatable | `qJBO8ZmKp4te7NTtYgzz` | 0.45 |
| director | VASKO - Deep, Warm and Pleasant | `Vl27Cllkuw8BhyPqus2n` | 0.5 |
| hire | Arcadays - Warm, Light and Natural | `s0phbFBBp708ZeIy8oGx` | 0.8 |

**Sergey is provisional** - Egor vs Denis (`0BcDz9UPwL3MpsnTeUlO`) is undecided.
Auditions for all three of his lines are in `voice-auditions/ru/sergey/`.

The narrator's 0.85 is deliberate and load-bearing. Marina's own label is "Soft,
Clear and **Warm**", and warmth is exactly what the narrator must not have. High
stability suppresses expressiveness; it is doing the work that `[flatly]` failed
to do.

### Full-episode results (2026-08-09, eleven_v3)

**38 of 40 lines at 100%.** Two flagged, both false alarms - worth knowing so the
same reports do not get misread later:

| Line | Score | What happened |
|---|---|---|
| n06 | 50% | Written "Сергей. Айти." phonetically; Scribe transcribed "Сергей, IT". Spelling difference, not a defect. Score is low because it is a 4-word line - one word is 25%. |
| n32 | 83% | Dropped preposition "в" in the transcript. Probably STT, not TTS. |

**Both need listening to confirm** - which is the point. The tool narrows 40 lines
to 2 candidates; it cannot close them.

Short lines are inherently noisy in this metric. Treat anything under ~6 words as
advisory.

### Model / API notes

- STT uses `scribe_v2`. `scribe_v1` is **deprecated**.
- Audio tags are stripped from **both sides** before comparison, so `[sigh]` in
  the source and `[вздох]` in the transcript both drop out.

One trap worth knowing if you extend this: JavaScript's `\w` is ASCII-only, so
`/^девятнадцат\w*$/` silently never matches `девятнадцатом`. Use explicit
`[а-яё]` classes.

## Model choice: eleven_v3 and audio tags

**`eleven_v3` is the default**, and the reason is audio tags.

Tags are bracketed delivery direction inside the text - `[flatly]`, `[sigh]`,
`[resigned tone]`, `[defensive]`, `[hesitates]`, `[pauses]`. The model consumes
them as direction rather than reading them aloud.

This matters more than it first appears. The script's production notes -
"deliver the 2019 line completely flat", "tired, not angry" - stop being notes
to a human performer and become part of the input. The direction ships with the
line.

Verified on Russian (2026-08-09):

- Tags are **not spoken**. Round-tripped through Scribe: `[flatly] Чек-лист
  есть...` transcribes as `Чек-лист есть...` with no bracket text.
- Non-verbal tags produce **real audio**. `[sigh]` on Sergey's line came back
  from Scribe as `[вздох]` - it heard an actual sigh, not a word.
- Full episode: 40/40 lines synthesised, 2573 characters.

Tags currently in use, per the script's delivery notes:

| Line | Tag | Why |
|---|---|---|
| n09 (2019 line) | `[flatly]` `[deadpan]` | biggest laugh in the episode; dies if performed |
| o02 (Olga's штраф) | `[firm]` `[defensive]` | competent, used to being blamed |
| s02 / s03 (Sergey) | `[flatly]` / `[sigh]` `[resigned tone]` | tired, not angry |
| d01 (Director) | `[confident]` | never checked, totally sure |
| h01 (new hire) | `[hesitates]` `[quietly]` | uncertain, not comic |
| n11 / n18 | `[pauses]` | the scripted silences |

### What the first listening round taught us (2026-08-09)

Four hard lines were judged by ear. Three landed, two failed, and the two
failures point the same direction:

| Line | Target | Result |
|---|---|---|
| o02 Olga | competent | ✅ competent |
| s03 Sergey | tired | ✅ tired |
| n09 narrator | flat | ❌ **amused** |
| h01 new hire | uncertain | ❌ **comic** |

Winners from the fix sweep:

- **n09 → `[matter-of-fact]` at stability 0.9** (beat `[flatly]`, `[deadpan]`,
  `[monotone]`, and no-tags)
- **h01 → NO TAGS at all**, stability 0.8 (beat `[uncertain]`, `[quietly]`,
  `[softly]`, `[nervous]`, and the original `[hesitates]`)

**The lesson: tags tell the model to ACT. When you want restraint, understate
the tag or drop it entirely, and raise stability instead.**

`[flatly]` and `[deadpan]` are instructions to *perform* flatness, and the model
performs them - which reads as knowing amusement. `[matter-of-fact]` describes a
stance rather than a performance, and it worked. `[hesitates]` produced comic
timing, a beat before a punchline; removing every tag let the words carry it.

Apply this whenever a line must land small or dry. Reach for tags when a line
needs visible emotion (Sergey's `[sigh]`, the director's `[confident]`), not when
it needs the absence of it.

**Fallback:** `eleven_multilingual_v2` has no tag support and **will read tags
aloud**. If falling back, strip them first.

`eleven_monolingual_v1` is English-only and produces garbage on Russian.
`eleven_turbo_v2_5` is deprecated.

## Cost

Whole episode: **40 lines, 2413 characters.** ElevenLabs bills per character, so
one full episode fits comfortably in a starter allowance.

Synthesis is **cached by content hash** (text + voice + settings + model), so
editing three lines re-bills three lines, not forty. `--force` overrides,
`--only=o01,s02` targets specific lines.

## What synth.mjs produces

- `voice/out/<id>.mp3` - one file per line (gitignored)
- `voice/manifest.json` - **tracked in git**, holds measured durations per line

The manifest is the point. `timing.ts` is currently placeholder values derived from
the script's target timings; real durations replace them once narration exists.

Duration is measured by parsing MP3 frame headers directly - no ffmpeg dependency,
since ffmpeg is not installed on this machine.

## The thing the manifest cannot tell you

Narration total excludes the **silences**, which the script is emphatic about:

1. After the opening dot, before "Кто-то знает, как это происходит."
2. Two seconds on the empty fourth column - the most important one.
3. Two full seconds on the overlay mess, before "Здесь никто не врёт."
4. 1.5s on the half-drawn arrow at "«Подождите… а кто говорит айтишникам?»"

Sum of line durations is NOT the episode length. Build timing from
`line duration + explicit gap`, never by packing lines end to end.

## Russian text notes

Numbers are written out in the lines file ("в две тысячи девятнадцатом" rather than
"в 2019") because TTS reads digits inconsistently across languages. Keep doing this.

Em-dashes and ellipses are load-bearing for pacing - "Простите… а мне куда?" needs
that pause. Do not normalise them away.
