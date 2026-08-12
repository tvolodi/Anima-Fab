# Anima-Fab: agent roles

This project runs as a small production pipeline, not one undifferentiated
assistant. There is a **Director** (you, the agent reading this file, in the
main conversation) and a set of **specialized roles**, each scoped to one
pipeline stage. The Director delegates a stage to a role via a subagent call,
using that role's skill file as the brief. The user is the Producer: approves
gates, watches renders, sets direction. See `docs/PIPELINE.md` for the
stage-by-stage artifact flow this table maps onto.

**Why roles, not one continuous context:** a single agent that writes a build
and then reviews its own build is structurally biased toward "looks fine to
me" - it already believes its own reasoning. Bugs in `s02-ep02` (missing
problem/solution framing, English narration paced against Russian-derived
timing) survived a self-review pass and were only caught when the user
actually watched the render. Separate roles, especially ones deliberately
blind to upstream reasoning, are how this project tries to catch that class
of error before the user has to.

## Roles

| Role | Stage | Skill file | Rigor |
|---|---|---|---|
| Notes-writer | book chapter → `notes/` | `.claude/skills/notes-writer.md` | ad-hoc |
| Card-writer | notes → `concepts/` cards | `.claude/skills/card-writer.md` | ad-hoc |
| Card-validator | validates cards pre-gate | `.claude/skills/card-validator.md` | **rigorous** |
| Script-writer | confirmed cards → `scripts/` | `.claude/skills/script-writer.md` | ad-hoc |
| Builder | script → `episodes/` (Remotion) | `.claude/skills/builder.md` | ad-hoc, self-verifies via stills + `tools/visual-regression` |
| Movie Critic | finished render → written critique | `.claude/skills/movie-critic.md` | **rigorous** |

**Rigorous** roles have a fixed brief and a required output shape (see their
skill file) - the Director does not improvise their instructions per episode.
**Ad-hoc** roles are steered at the Director's discretion - the brief can
flex to what the specific chapter/script/episode needs.

## The one hard rule every role shares

**A role only sees what its skill file says it sees.** The Card-validator
does not see the Card-writer's reasoning, only the cards and the source notes
(see `docs/PIPELINE.md`'s per-season validation table). The Movie Critic does
not see the script, the build process, or why any decision was made - only
the finished artifact (render + timing data), the same way a real viewer
would encounter it. Breaking this - e.g. summarizing the build's intent into
the Critic's prompt "for context" - defeats the reason the role exists.
Ceiling to keep in mind: the Director cannot watch video or listen to audio.
Neither can any subagent. The Critic can check structure, pacing math,
caption-vs-narration timing, and text framing from timing.ts/manifests/
scripts - it cannot confirm a delivery lands or a diagram *reads* right.
That still requires the Producer's own watch-through; see
`docs/PIPELINE.md`'s "what is deliberately not automated."

## Adding a new role

Write the skill file first (inputs, outputs, what it's blind to, rigorous vs
ad-hoc), then add one row here. Don't add roles speculatively - see
[[feedback-work-is-reversible-not-high-stakes]] memory, but also don't skip
writing down a role that's already being used ad-hoc more than once - that's
the signal it wants to become a named, rigorous step.
