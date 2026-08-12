# S02 Episode 2 — "The Same Fix, One Level Up"

**Series:** BPM, honestly — S02, theory season
**Source:** [notes/ch02-enterprise-systems-architectures.md](../notes/ch02-enterprise-systems-architectures.md),
covering Ch.2 §2.1 only. Concept cards, **all confirmed 2026-08-11** via the
generate/validate loop (S02 rule: source-fidelity check only, per
`docs/PIPELINE.md`'s per-season gate table — no real-world/cross-cultural check applies
to this season):
[[separation-of-concerns-is-the-throughline]], [[each-fix-recreates-the-problem-one-level-up]],
[[hub-and-spoke-relocates-coupling]]
**Gate note:** per `docs/PIPELINE.md`, a card cannot become a script while
`status: unverified`. All three cards above passed independent validation with one
cosmetic wording fix (no factual issues) — see validator report in session history.
Cleared to build.
**Register:** same as ep1 — no cast, no invented drama, captions carry meaning. Chapter
2 §2.1 is architecture history, which risks reading as a dry timeline; the countermeasure
is treating the *repetition* (same fix, new scale) as the plot, not the four systems as
trivia.
**Runtime target:** ~2:45–3:15 (slightly longer than ep1 — three architectures plus the
N×N beat need more room than six short concept jumps did)
**Production cost:** medium — reuses `ProcessView`/layout/`Token`/`Lanes` for parts of
this, but needs at least two genuinely new components (a "layer stack" and a
node-mesh/hub diagram) that don't exist anywhere in `@anima/core` yet. See Implementation
notes.

---

## Why this chapter is a harder build than Ch.1

Chapter 1 had one running example (reseller/buyer) pushed through six lenses. Chapter
2 §2.1 has **no single diagram that survives the whole episode** — Fig 2.1 (OS/DBMS/GUI
stack), Fig 2.2–2.3 (siloed apps → ERP), and Fig 2.5–2.8 (point-to-point → hub-and-spoke)
are visually unrelated in the book. The connective tissue is conceptual (separation of
concerns, applied four times), not a shared picture. So this script invents **one visual
motif — a labelled box being extracted from a bigger box and given its own connector —
and reuses that motif at every scale**, rather than reusing one diagram. That motif IS
[[separation-of-concerns-is-the-throughline]] made visible, and it's what stands in for
ep1's reseller/buyer thread.

## Visual spine

A single abstraction: **"stuff piled together" → "one piece pulled out, given a boundary
and a labelled connector" → repeat, one level up.** Concretely:

- **Acts 1–2 (the extraction motif):** a messy blob of code labelled "Application" sheds
  a clean rectangle labelled "OS", then "DBMS", then "GUI" — each extraction leaves the
  blob smaller and the rectangle docked to its side with a thin connecting line (the
  "stable interface").
- **Acts 3–4 (the same motif, at enterprise scale):** boxes labelled "HR" / "Purchasing"
  / "Production" each holding their own little "customer" token: they get redrawn
  swallowed into one big "ERP" box (one shared token). Then new boxes ("SCM", "CRM")
  appear OUTSIDE the ERP box, each again holding their own "customer" token — visually
  rhyming with the pre-ERP mess from Act 3.
- **Acts 5–6 (integration, two ways):** the same SCM/ERP/CRM boxes get connected first by
  a tangle of direct lines (point-to-point), then redrawn with all lines instead running
  to one central hub.
- **Color:** neutral/grey palette throughout, same register as ep1 (no blame-color, no
  audited-border — those are S01's vocabulary). One accent color, reused consistently for
  "the thing being extracted / the stable interface line" across every act, so the eye
  learns to track it. Suggest introducing a new token, `EXTRACTED_ACCENT`, rather than
  reusing ep1's `GAP_HIGHLIGHT` (different meaning, would mislead anyone cross-referencing
  the palette).

---

## Act-by-act

### COLD OPEN — 0:00–0:12

| Beat | Screen |
|---|---|
| 0:00 | Black. |
| 0:03 | A single dense, scribbly grey blob fades in, center, no label — deliberately illegible, "too much in one place." |
| 0:07 | Caption: *"Everything used to live in one place."* |
| 0:10 | Cut to title card: **"The Same Fix, One Level Up"** / sub: *Ch. 2 — Evolution of Enterprise Systems Architectures*. |

---

### ACT 1 — Pulling the OS out (0:12–0:32)

**Concept:** [[separation-of-concerns-is-the-throughline]]

| Beat | Screen |
|---|---|
| 0:12 | The cold-open blob returns, now labelled faintly "Application" in its center. |
| 0:16 | Caption: *"Every application talked to the hardware itself."* |
| 0:19 | A clean rectangle peels off the blob's left edge, slides out, snaps into place beside it, connected by a single thin line. Label fades in on the rectangle: "OS". The blob visibly shrinks/simplifies as the rectangle leaves it (a few scribble-lines vanish from the blob). |
| 0:26 | Caption: *"One job, pulled out. One stable line back in."* |
| 0:29 | Hold: blob + OS rectangle + connector, quiet beat. |

Visual idea: this act defines the motif everything else reuses — extraction leaves the
origin *smaller and cleaner*, and the connector is drawn as a deliberately thin, stable
line (contrast with the tangled multi-line mess Act 5 will show later).

---

### ACT 2 — DBMS and GUI, same move twice (0:32–0:58)

**Concept:** [[separation-of-concerns-is-the-throughline]]

| Beat | Screen |
|---|---|
| 0:32 | Same blob+OS from Act 1. Caption: *"Then: where does the data live?"* |
| 0:36 | Second rectangle peels off, docks below the blob, connector line, label "DBMS" fades in. Blob shrinks again. |
| 0:41 | Small aside beat: the DBMS rectangle briefly shows two tiny alternate internal layouts flashing behind it (suggesting swappable storage) while its outer boundary and connector stay fixed — this is the visual claim for physical/logical data independence, kept brief since it's a supporting detail, not this act's main point. |
| 0:46 | Caption: *"Then: how does a person actually use it?"* |
| 0:49 | Third rectangle peels off, docks to the right, connector line, label "GUI" fades in. Blob is now small, plain, labelled just "business logic". |
| 0:55 | Caption: *"Same move, three times. Pull out a concern, keep one stable line back."* |

Visual idea: deliberately fast/telegraphed compared to Act 1 — having established the
motif once, running it twice more quickly earns the "same move" line rather than
re-explaining it.

---

### ACT 3 — The blob grows back, at a bigger scale (0:58–1:25)

**Concept:** [[each-fix-recreates-the-problem-one-level-up]]

| Beat | Screen |
|---|---|
| 0:58 | Hard cut. The Act 1–2 diagram shrinks to a small icon, docks to top-left corner, stays visible but inert (a callback anchor, not the focus anymore). |
| 1:02 | Three boxes fade in, spread across frame: "HR", "Purchasing", "Production" — each a clean rectangle, each independently holding a small labelled token: "customer". |
| 1:08 | Caption: *"Different departments. Different copies of the same fact."* |
| 1:12 | The three "customer" tokens each pulse once, independently, out of sync with each other — visually asserting they are NOT the same object, just three objects that happen to share a label. |
| 1:17 | Caption: *"Change one, and the other two don't know."* One token (HR's) changes color briefly; the other two stay unchanged — a visible, small inconsistency. |
| 1:22 | Hold on the three-box mess. |

Visual idea: this is the pre-ERP silo problem, staged as the SAME "mess before
extraction" shape as the cold open's blob — the viewer should feel "wait, didn't we just
fix this?"

---

### ACT 4 — ERP: one extraction, enterprise scale (1:25–1:50)

**Concept:** [[each-fix-recreates-the-problem-one-level-up]]

| Beat | Screen |
|---|---|
| 1:25 | The three boxes from Act 3 slide together and merge into one large rectangle, label "ERP" fades in. The three separate "customer" tokens merge into ONE token, centered inside the ERP box. |
| 1:33 | Caption: *"One shared database. One copy of the truth."* |
| 1:37 | The single customer token pulses once, cleanly — no desync this time. |
| 1:41 | Caption: *"The same move as the OS. Just bigger."* The small Act 1–2 icon (still docked top-left) briefly highlights in sync with this line, drawing the explicit callback. |
| 1:47 | Hold on the clean, single ERP box. |

Visual idea: the merge-into-one-token beat is the direct visual payoff of Act 3's
desync beat — same token, now synchronized, inside one boundary.

---

### ACT 5 — And it happens again: SCM and CRM (1:50–2:15)

**Concept:** [[each-fix-recreates-the-problem-one-level-up]]

| Beat | Screen |
|---|---|
| 1:50 | The clean ERP box from Act 4 shrinks slightly, moves to center-left. |
| 1:54 | Caption: *"Then new systems arrive. Different vendors."* |
| 1:57 | Two new boxes fade in beside it: "SCM", "CRM" — each, like Act 3's departments, holding their OWN "customer" token, independent of ERP's. |
| 2:03 | The three tokens (ERP's, SCM's, CRM's) each pulse independently, out of sync — the exact same desync beat as Act 3, deliberately reused shot-for-shot. |
| 2:09 | Caption: *"The silo problem again. One level up."* |
| 2:13 | Hold on ERP/SCM/CRM, three boxes, three ungsynced tokens — this is the episode's central image; give it a clean, static beat, no competing motion. |

Visual idea: reusing Act 3's exact desync animation (same timing curve, same pulse
style) on the ERP/SCM/CRM trio is the whole argument of
[[each-fix-recreates-the-problem-one-level-up]] made wordless — a viewer who noticed the
repetition doesn't need the caption, the caption is there for the viewer who didn't.

---

### ACT 6 — Point-to-point: wiring it by hand (2:15–2:40)

**Concept:** [[hub-and-spoke-relocates-coupling]]

| Beat | Screen |
|---|---|
| 2:15 | ERP/SCM/CRM trio from Act 5, now joined by three more small boxes fading in around them: "Inventory", "Warehouse", "HR App" — six boxes total, echoing the book's N=6 example. |
| 2:19 | Caption: *"Wire every pair directly."* |
| 2:22 | Direct lines draw in one at a time, connecting every pair — fast, almost mechanical, each new line landing with a small tick. A running count-up number appears in a corner, incrementing with each line: 1, 2, 3... up to 15. |
| 2:31 | Caption, once the count finishes: *"Six systems. Fifteen wires. Every new system means more wires than the last one."* |
| 2:36 | Hold on the tangled mesh — deliberately visually unpleasant, lines crossing everywhere, echoing the cold open's illegible blob. |

Visual idea: the count-up is the single most concrete, countable beat in the episode —
let it be satisfying/alarming on its own, don't over-caption it while it's running.

---

### ACT 7 — Hub-and-spoke: same coupling, relocated (2:40–3:05)

**Concept:** [[hub-and-spoke-relocates-coupling]]

| Beat | Screen |
|---|---|
| 2:40 | The tangled mesh from Act 6 doesn't disappear — instead, all 15 lines visibly retract and redraw as 6 lines, each running from one box to a new central hub shape that fades in at the center. |
| 2:46 | Caption: *"Same six systems. One shared hub instead."* |
| 2:50 | One of the spoke boxes (SCM) briefly changes its "customer" data value; instead of a direct line to CRM, a small pulse travels SCM → hub → CRM, visibly routing through the center rather than directly. |
| 2:55 | Caption: *"The dependency didn't vanish. It moved into the hub."* |
| 2:59 | The hub's interior briefly shows a tangle of small squiggly "rules" lines inside its own boundary — deliberately echoing Act 6's crossed-wire mess, but now contained INSIDE one box instead of spread across six. |
| 3:03 | Hold. |

Visual idea: the rules-tangle-inside-the-hub beat is the load-bearing nuance from
[[hub-and-spoke-relocates-coupling]] — without it, the act reads as "hub-and-spoke =
solved," which the card explicitly says is not the chapter's claim. Do not cut this beat
even under time pressure.

---

### CLOSE — 3:05–3:15

**Concept:** none directly — this act deliberately does NOT claim a card, since it's
setting up material (§2.2, workflow management) that has no confirmed source yet.

| Beat | Screen |
|---|---|
| 3:05 | Cut to black. The hub-and-spoke diagram fades back up, small, center. |
| 3:08 | Caption: *"Every fix so far has moved WHERE the coupling lives. None of them made the process itself visible."* |
| 3:12 | Fade to black. End card: series mark, "Next: Ch. 2 §2.2 — Workflow Management" (deliberately marked as upcoming, not promised with specifics — §2.2 hasn't been read yet). |

---

## Implementation notes for the episode build

- **Reuse from `@anima/core` as-is:** `Token` (for the "customer" tokens throughout —
  its pulse/mood states should cover the desync beats in Acts 3/5 without modification),
  `FitStage`, `SpeakerLabel`-style caption chrome if it generalizes (check against S02E1's
  decision to build a separate caption component instead — likely the same call applies
  here), `theme/type`.
- **Do NOT reuse:** `ProcessView`/`layout`/`walkAt` as designed — those model BPMN-style
  node-and-edge process diagrams (activities, gateways, sequence flow). Nothing in this
  episode is a process diagram; every visual is boxes-representing-systems with tokens
  representing shared data, and line-connectors representing interfaces/coupling. Reusing
  `ProcessView` here would be reaching for the wrong abstraction just because it exists.
- **New components needed (none of these exist yet in `@anima/core` or either episode's
  `src/acts/`):**
  1. **Extraction motif component** (Acts 1–2, reused conceptually in Act 4) — a
     "blob shrinks, rectangle peels off and docks with a connector line" animation.
     This is the episode's single most-reused visual and worth building as a real,
     parameterized component (origin box, extracted label, dock side) rather than
     one-off code per act, since it fires 4+ times (OS, DBMS, GUI, and the ERP merge
     is close to its inverse).
  2. **System-box-with-token component** (Acts 3–5) — a labelled rectangle holding a
     small token whose pulse can be synced or desynced against sibling tokens. Could
     plausibly wrap `Token` from core rather than reinvent it — check whether `Token`'s
     existing mood/pulse API is flexible enough before writing a new one.
  3. **Mesh/hub connector component** (Acts 6–7) — draws N boxes, then either (a) all
     pairwise direct lines with a count-up, or (b) all lines retracting into one central
     hub. This is genuinely new geometry (nothing in `layout.ts` does all-pairs or
     hub-and-spoke routing) and is this episode's biggest build risk — prototype and
     preview-render it early, before committing to the Act 6/7 timing.
  4. **Count-up number chrome** (Act 6) — small, likely trivial (an interpolated integer
     in a text node), but confirm it reads clearly against the mesh animation before
     locking timing.
- **Sequencing trap to watch for:** same as both existing episodes — if acts read
  absolute cue frames, mount via the local `Window` helper, not `<Sequence>`. See
  docs/TODO.md's "Trap worth knowing" note. Apply from the start this time rather than
  discovering it after a black-frame bug, as happened in ep01.
- **Timing:** hand-authored `timing.ts`, no voice manifest (same silent-episode decision
  as S02E1). Given three architectures instead of six short concept jumps, expect Acts
  6–7 (the count-up and hub reveal) to need the most iteration — they're this episode's
  emotional peak, analogous to ep1's Act 3 (orchestration vs. choreography) getting the
  most screen time.
- **FPS/resolution:** 1920×1080, 30fps, matching both prior episodes.

---

## Card → act cross-reference (for review)

| Card | Acts driven | If this card is rejected/amended... |
|---|---|---|
| [[separation-of-concerns-is-the-throughline]] | Cold Open, 1, 2 (and the Act 4 callback beat) | ...the extraction motif itself loses its justification — this is the deepest dependency in the script, re-review the whole visual spine, not just these acts. |
| [[each-fix-recreates-the-problem-one-level-up]] | 3, 4, 5 | ...cut the Act 3/5 shot-for-shot desync callback (the episode's structural spine) and reconsider whether ERP deserves its own act at all. |
| [[hub-and-spoke-relocates-coupling]] | 6, 7 | ...Act 7 in particular needs rework — its whole point is the "coupling relocated, not removed" nuance; without the card, hub-and-spoke could get simplified to a plain win, which would need different beats. |
