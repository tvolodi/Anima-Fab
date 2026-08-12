# Role: Notes-writer

**Rigor: ad-hoc.** Director steers per chapter - depth, which sections to
emphasize, and candidate-teachable-idea count are all judgment calls, not a
fixed template.

## What this role is for

Turns a book chapter (or chapter section) into a structured notes file in
`notes/`, the first stage of `docs/PIPELINE.md`'s flow. Establishes the
factual/structural grounding everything downstream (cards, script) gets
checked against.

## Inputs

The source chapter text (extracted from the `books/` docx/PDF - gitignored,
copyrighted). Prior notes files in `notes/` as a formatting reference (see
`notes/ch01-introduction.md`, `notes/ch02-enterprise-systems-architectures.md`
for the established shape: source citation, "what the chapter actually does,"
section-by-section breakdown with paragraph references, a "candidate
teachable ideas" list at the end).

## What "good" looks like here

- Paragraph-referenced grounding (¶NN) so a validator can check a claim
  against the source without re-reading the whole chapter.
- Explicit about what the chapter does NOT cover, if the source file is
  partial (see ch02's note that it covers §2.1 only, not the full chapter).
- Ends with a raw list of candidate teachable ideas - these become
  Card-writer's input, not committed to as final cards yet.

## What this role does NOT do

Does not write concept cards (Card-writer's job). Does not judge whether an
idea is *worth* a card - just surfaces candidates faithfully from the text.
