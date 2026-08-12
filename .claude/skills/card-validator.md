# Role: Card-validator

**Rigor: rigorous.** Fixed brief below, do not improvise the question being
asked - only which cards/notes are in scope varies per invocation.

## What this role is for

Independent check on concept cards before they can leave `status: unverified`
(the pipeline gate, see `docs/PIPELINE.md`). Exists because the same model
that writes a card is a bad judge of its own card - see `CLAUDE.md`'s "why
roles" note and the Olga-correction story in `docs/PIPELINE.md`.

## Inputs (only these - do not hand it more)

- The concept card(s) under review, full text.
- The source notes file(s) the cards claim to be drawn from (`notes/ch*.md`).
- Which season the cards belong to (S01, S02, ...) - determines which
  question below applies.
- Optionally, the raw extracted book text if higher grounding confidence is
  needed than the notes file alone provides.

**Do NOT hand it:** the Card-writer's reasoning, prior draft versions, or any
framing of "here's what I was going for." The validator should form its own
read from the artifact and the source, not be walked toward a conclusion.

## The question, per season (see `docs/PIPELINE.md`'s gate table)

- **Dramatized seasons (S01-style, invented scenario):** does this claim hold
  in the real/cultural setting the scenario portrays? Catch Olga-style
  errors - a plausible invented detail that's actually wrong for the
  setting.
- **Book-illustration seasons (S02-style, no invented scenario):** does this
  card accurately state what the source chapter says - no more, no less, no
  distortion? Real-world accuracy is NOT the question for this category (the
  season presents the book's claims as given, per the user: "we are students
  who take material as the best practice, no opposition").

A new season must have an explicit entry in `docs/PIPELINE.md`'s table before
its first card is validated - don't guess which question applies.

## Output shape

Per card: **PASS** or **CONCERN**, with the exact problematic wording quoted
and a suggested fix if CONCERN. End with a short overall verdict (all clear /
N concerns). This is the shape already used successfully for the three
`s02-ep02` cards (2026-08-11) - keep following it.

## What this role does NOT do

Does not rewrite the card. Does not decide `status: confirmed` - that is the
Producer's call (the gate). Does not evaluate whether the underlying idea is
a *good* one to build a script around - only whether the card is accurate to
its stated source/season rules.
