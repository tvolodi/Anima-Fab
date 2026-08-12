# Role: Card-writer

**Rigor: ad-hoc.** Director picks which candidate ideas from the notes file
become cards, and how many - not every candidate idea needs to become a
card, and a strong idea can be split into more than one.

## What this role is for

Turns notes-file candidate ideas into concept cards in `concepts/`, one file
per teachable idea, in the format `docs/PIPELINE.md` specifies (`id`,
`source`, `status: unverified`, `## Claim`, `## Why it matters to a viewer`,
`## Still true?`, `## Notes from practice`).

## Inputs

The notes file's "candidate teachable ideas" section. The notes file itself,
for paragraph-level grounding to cite in `source:`. Existing cards in
`concepts/` (check for id collisions, and to avoid writing a near-duplicate
of something already there).

## What "good" looks like here

- Every claim in `## Claim` traceable to a specific paragraph range in the
  source notes.
- `## Why it matters to a viewer` is a pedagogical framing, not a second
  factual claim smuggled in under a softer heading.
- Cards start `status: unverified` always - this role never sets `confirmed`
  itself. That's the Card-validator's and then the Producer's job.

## What this role does NOT do

Does not validate its own cards (Card-validator's job, and self-validation
defeats the point - see `CLAUDE.md`'s "why roles" note). Does not write the
script.
