# The pipeline

Book chapter → notes → concept cards → script → episode → video.

Flowing left to right, with **exactly one mandatory stop**.

```
books/       source PDFs/EPUBs        (gitignored - copyrighted)
  ↓          Claude reads
notes/       ch03-....md              Claude generates
  ↓
concepts/    one card per idea        Claude generates
  ↓          ────── YOU APPROVE ──────  the gate
scripts/     ep-NN-....md             Claude generates from approved cards
  ↓
episodes/    Remotion project         Claude generates from script
  ↓
out/         ep-NN.mp4                you watch, you upload
```

## Why the gate is where it is

The gate sits at **concept cards**, before scripts, not after.

This is a direct consequence of the Olga correction. The first draft of episode 1
had Marina in accounting manually checking invoices against purchase orders - a
Western pain point that does not exist in CIS practice, where bookkeeping is
automated and tax enforcement makes it rigorous. That single correction changed
the episode's *argument*, not just its example: from "everyone is sloppy" to "the
audited parts work and the seams between them don't."

An automated pipeline would have produced a polished, plausible, subtly-wrong
episode and never known. The scripts *look* right either way - that is what makes
this failure mode dangerous rather than merely annoying.

So: the model can be the director. It cannot be the author. The gate exists to
make that structural rather than optional.

### The gate's checks are scoped per season, not universal

The Olga error was a **real-world/cross-cultural practice** error: S01 invents a
dramatized scenario, and inventing scenario detail can silently import assumptions
(often Western) that don't hold in the setting being portrayed. That risk is real
wherever a season **invents scenario**, and doesn't disappear just because a season
looks calmer or more academic.

It does not apply to a season with no invented scenario to get wrong. S02 is a
**book illustration** season - it dramatizes a textbook's own claims and examples,
not an invented office/scenario. Per the user (2026-08-11): "we are students who
take material as the best practice, no opposition." S02 cards are checked for
**fidelity to the source text** (does this claim what Weske actually says, no more,
no less, no distortion) - not for real-world accuracy, because the season isn't
asserting real-world accuracy independent of the book.

Concretely, the validator (see "Generate/validate review" below) asks a different
question depending on which season a card belongs to:

| Season | What's being validated | Failure mode being caught |
|---|---|---|
| S01 (dramatized) | Does this scenario detail hold in the real/cultural setting portrayed? | Olga-style: a plausible-sounding invented detail that's actually wrong for the setting. |
| S02 (book illustration) | Does this card state what the source chapter actually says? | Misreading or overreaching the text - claiming more than Weske claims, or distorting a definition. |

New seasons should get an explicit entry in this table before their first concept
card is generated, not inherit one by default - the two existing seasons already
look different enough (invented drama vs. textbook illustration) that "one gate for
everything" was the wrong model from the start.

## What is deliberately NOT automated

**Publishing.** Uploading to YouTube stays manual, permanently. It is
irreversible and public; there is no version of this pipeline where a script
pushes video to an audience without a human having watched it.

**Judging whether a claim is true in practice.** See `concepts/` below.

## Concept cards

The artifact between notes and scripts. One file per teachable idea:

```markdown
---
id: audited-parts-are-modelled
source: "Hammer & Champy 1993, ch.2"   # or wherever
status: unverified                      # unverified | confirmed | rejected | amended
---

## Claim
...one paragraph...

## Why it matters to a viewer
...

## Still true?
(empty until reviewed)

## Notes from practice
(this is where corrections live)
```

**A card cannot become a script while `status: unverified`.**

This is where corrections live permanently. The Olga fact -

> CIS accounting is rigorous because tax enforcement is brutal; the West's
> manual-reconciliation pain does not translate.

- becomes a card that constrains every future episode, instead of a thing that has
to be remembered and repeated. Ten or fifteen of those and the pipeline gets
meaningfully harder to fool.

## Steps that are CLI, not MCP

Fire-and-forget, no decisions in them:

| Step | Command |
|---|---|
| Render an episode | `pnpm ep01:render` |
| Render one act | `cd episodes/ep01-... && npx remotion render src/index.ts Act2Overlay out/act2.mp4` |
| TTS | script over the ElevenLabs API → `public/*.wav` (not built yet) |
| Mix | `ffmpeg` - vendored via `@remotion/compositor-win32-x64-msvc`, see README's Environment notes |
| Upload | manual, by you |

## The one step that IS MCP

`tools/preview-mcp` - renders a single frame to PNG so the model can *look* at it.

This exists because of a specific gap. The script says the Act 2 overlay "must be
genuinely ugly - if it composes nicely, the episode fails." That is not a
judgement the code can make. Without the preview tool the model writes that
component blind.

With it, the loop is: write component → render frame → look → adjust → look again.
That loop already paid for itself during setup - see docs/TODO.md, the overlay took
four visually-distinct attempts and the first three were wrong in ways that were
invisible from the code.
