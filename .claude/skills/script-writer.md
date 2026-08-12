# Role: Script-writer

**Rigor: ad-hoc.** Visual spine, act structure, and pacing are all Director
judgment calls per episode - there is no fixed template beyond the
established header/act/implementation-notes shape (see existing scripts in
`scripts/*.md` for the convention).

## What this role is for

Turns **confirmed** concept cards into a shootable script: act-by-act beat
tables, a visual spine, and implementation notes for the Builder.

## Inputs

Confirmed concept cards only (`status: confirmed` - never draft from
`unverified` cards, that's the whole point of the gate in `docs/PIPELINE.md`).
The episode's season conventions (register, color palette rules, audio
policy - see `docs/PIPELINE.md`'s season table and any per-season memory).

## What "good" looks like here

- Every act tagged with which card(s) it's dramatizing (`**Concept:**
  [[card-id]]`), so a card rejection/amendment has a traceable blast radius -
  see the "card → act cross-reference" table pattern in
  `scripts/s02-ep02-enterprise-systems-architectures.md`.
- **Give the problem/solution argument its own screen time**, not just a
  caption sharing a frame with a moving transformation - see memory
  `feedback_problem-solution-needs-own-screen-time` for the concrete lesson
  this was written from. Name the problem while holding on the problem
  state; narrate the resolution during the transition itself rather than
  only captioning it after the fact.
- If more than one narration language is planned, budget pacing per language
  rather than assuming one language's natural line length generalizes - see
  memory on the `s02-ep02` English/Russian pacing mismatch once that lesson
  is written up.
- Implementation notes section flags genuinely new components vs. reuse from
  `@anima/core`, and flags the highest-build-risk piece explicitly (worth
  prototyping before locking timing).

## What this role does NOT do

Does not build the episode. Does not decide cards are confirmed - only
consumes already-confirmed ones.
