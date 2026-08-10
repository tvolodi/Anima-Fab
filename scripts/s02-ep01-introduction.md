# S02 Episode 1 — "What a Process Actually Is"

**Series:** BPM, honestly — S02, theory season
**Source:** [notes/ch01-introduction.md](../notes/ch01-introduction.md), concept cards (all confirmed):
[[process-is-coordinated-not-a-list]], [[model-vs-instance]],
[[orchestration-vs-choreography]], [[realization-can-change-behind-a-stable-interface]],
[[lifecycle-is-a-loop-not-a-waterfall]], [[classification-axes-are-independent]]
**Register:** no dramatized scenario, no cast. This is the book talking, not a story about
people. That's a real constraint, not a shortcut — see "Why no drama" below.
**Audio:** none. Silent, self-paced motion piece — on-screen text carries the meaning
instead of narration. (Decision recorded 2026-08-10: TTS pipeline stays out of scope for
this episode; timing is hand-authored in `timing.ts`, not derived from a voice manifest.)
**Runtime target:** ~2:30–3:00
**Production cost:** low-medium — reuses `@anima/core` (ProcessView, layout, Token) almost
entirely as-is; one new component (a phase-wheel for the lifecycle) is the only real build.

---

## Why no drama, and why that's harder, not easier

Episode 1 had Olga, Sergey, and a fraud the audience could feel. Chapter 1 has no
organizational villain — it's the book defining its own vocabulary. Inventing a CIS
office-politics hook here would be the exact failure mode the pipeline's gate exists to
catch: a polished, plausible thing that isn't actually what the source says. So this
episode carries its weight through **one concrete running example** (the book's own:
a reseller and a buyer trading an order) pushed through six different lenses, rather than
through character. The difficulty is keeping six abstract ideas from blurring into a
wall of boxes-and-arrows — each act needs one unmistakable visual idea, not a diagram
dump.

## Visual spine

The reseller/buyer ordering process (book Figs. 1.1–1.4) recurs in every act, redrawn or
re-lit to make each act's point. Introduce it once, in full, in Act 1 — after that, acts
can show fragments of it.

```
Reseller:  (start) → Receive Order → [+ split] → Send Invoice → Receive Payment ─┐
                                    ↳ Ship Products ─────────────────────────────┴→ [+ join] → Archive Order → (end)

Buyer:     (start) → Place Order → [+ split] → Receive Invoice → Settle Invoice ─┐
                                  ↳ Receive Products ─────────────────────────────┴→ (end)

Message flow (dotted): Place Order → Receive Order · Send Invoice → Receive Invoice
                        · Settle Invoice → Receive Payment · Ship Products → Receive Products
```

Reseller = **blue**. Buyer = **green**. Neutral/grey for chrome, captions, and the
lifecycle wheel. No "audited" borders, no blame color — those are ep01's dramatic
vocabulary (see `packages/core/src/theme/colors.ts`) and don't belong here; this episode
reads as calm and structural, not as an indictment of anyone.

---

## Act-by-act

### COLD OPEN — 0:00–0:10

| Beat | Screen |
|---|---|
| 0:00 | Black. |
| 0:02 | A single grey box fades in, center, label: "Receive Order." Nothing else. |
| 0:05 | Caption fades in below, small: *"What is this, exactly?"* |
| 0:08 | Cut to title card: **"What a Process Actually Is"** / sub: *Ch. 1 — Foundations*. |

Mirrors ep01's cold open instinct (start on almost-nothing) without borrowing its imagery.

---

### ACT 1 — A process is not a list (0:10–0:35)

**Concept:** [[process-is-coordinated-not-a-list]]

| Beat | Screen |
|---|---|
| 0:10 | Four words drop in as a plain vertical list, left-aligned, monospace-ish, unstyled: "Receive Order" / "Send Invoice" / "Ship Products" / "Archive Order". Deliberately boring. |
| 0:16 | Caption: *"A checklist. Is that a process?"* List sits inert for a beat — no answer yet. |
| 0:20 | The four items animate off their list positions and snap into the reseller diagram's node positions (ProcessView layout) — arrows draw in, the parallel-split gateway appears last, diamond shape popping in with a small emphasis-scale. |
| 0:28 | Caption: *"Coordination is the process. The tasks were always the easy part."* |
| 0:33 | Hold on the completed reseller diagram, full-bleed-ish, centered. |

Visual idea: the *same four words* — nothing added — become a process only once ordering
and concurrency are drawn. The transformation IS the argument; no voiceover needed to
carry it.

---

### ACT 2 — Model vs. instance (0:35–1:00)

**Concept:** [[model-vs-instance]]

| Beat | Screen |
|---|---|
| 0:35 | Reseller diagram from Act 1 shrinks and moves to upper-left, label fades in above it: "MODEL". |
| 0:39 | A Token (the dot-with-eyes from `@anima/core`) spawns at the diagram's start node. |
| 0:41 | Token walks the diagram via `walkAt`/`WalkLeg` — full traversal including the parallel split (token forks into two, each walks one branch, they merge back into one at the join — see Implementation notes). |
| 0:48 | As the token completes its walk, a small numbered ghost copy of the diagram peels off into a receding stack at bottom-right — "instance #1". |
| 0:50 | Second token spawns, walks again, faster. Another ghost peels into the stack — "#2". A third, faster still — "#3", "#4"... stack visibly growing. |
| 0:57 | Caption: *"One blueprint. Many cases."* Label under the stack: "INSTANCES". |

Visual idea: repetition itself demonstrates one-to-many — no need to state the definition,
just run it enough times that the stack becomes the punchline.

---

### ACT 3 — Orchestration vs. choreography (1:00–1:35)

**Concept:** [[orchestration-vs-choreography]]

| Beat | Screen |
|---|---|
| 1:00 | Cut. Reseller diagram (blue) alone, centered, full detail, labelled "RESELLER" above it. |
| 1:04 | Caption: *"One process. One owner — sees and controls everything inside it."* A faint bounding box briefly pulses around the WHOLE diagram (the "one controller" reading), then fades. |
| 1:09 | Buyer diagram (green) fades in to the right — book's Fig 1.3 layout, message-flow dotted arcs connecting Place Order→Receive Order, Send Invoice→Receive Invoice, etc. Both diagrams simultaneously visible for the first time. |
| 1:16 | Caption: *"Two processes. Two owners. Neither sees inside the other."* A faint bounding box pulses around EACH diagram separately (not around both) — visually asserting there is no shared controller. |
| 1:23 | The dotted message arcs animate: small pulse traveling along each dotted arc in sequence (order → invoice → payment → products), left to right, like a relay — this is the ONLY connective tissue between the two boxes. |
| 1:30 | Caption: *"No conductor. Just agreed-upon signals."* |

Visual idea: literally show "inside" vs. "between" — solid diagrams with a controller-box
around ONE thing (orchestration) vs. two separate controller-boxes with only dotted
message-pulses crossing the gap (choreography). This is the episode's centerpiece; give it
the most screen time.

---

### ACT 4 — Same interaction, different insides (1:35–2:00)

**Concept:** [[realization-can-change-behind-a-stable-interface]]

| Beat | Screen |
|---|---|
| 1:35 | Reseller diagram from Act 3, message arcs to Buyer still faintly visible at the edge of frame (Buyer diagram dims to ~20% opacity, stays put as a reference). |
| 1:38 | Caption: *"Reseller-A does it differently."* |
| 1:40 | Reseller diagram morphs in place: the parallel-split gateway slides closed/removed, nodes re-flow into a strict sequential chain (Receive Order → Send Invoice → Receive Payment → Ship Products → Archive), using a crossfade + reflow rather than a hard cut, ~1.5s. |
| 1:46 | Caption: *"Ship only after payment clears."* Small non-diagram detail: the Ship Products node gets a brief highlight-pulse right as Receive Payment completes ahead of it, visually enforcing the new dependency. |
| 1:52 | The dimmed Buyer diagram brightens back to full opacity, unchanged, message arcs re-pulse exactly as in Act 3. |
| 1:57 | Caption: *"The buyer can't tell the difference. That's the point."* |

Visual idea: the buyer diagram literally does not move or change during this act — its
stillness while the reseller's internals visibly reorganize IS the argument.

---

### ACT 5 — The lifecycle is a loop (2:00–2:30)

**Concept:** [[lifecycle-is-a-loop-not-a-waterfall]]

| Beat | Screen |
|---|---|
| 2:00 | Hard cut. Both process diagrams shrink to small icons and dock to the center of frame, inert. |
| 2:03 | Four labelled nodes fade in around them in a circle (not a line): "Design & Analysis" (top), "Configuration" (right), "Enactment" (bottom), "Evaluation" (left). A fifth, fainter ring labelled "Administration & Stakeholders" encircles all four, always-on, not part of the sequence. |
| 2:08 | A short arc-arrow draws from Design&Analysis → Configuration → Enactment → Evaluation, clockwise, each arc drawing in as its predecessor completes (~0.6s per arc). |
| 2:14 | On reaching Evaluation, pause 0.4s — then the CLOSING arc draws: Evaluation → back to Design & Analysis, completing the circle. This arc gets a distinct visual treatment (thicker stroke, or a small "loops back" glyph) — it is the one non-obvious edge and the whole point of the act. |
| 2:20 | Caption: *"It doesn't end at Enactment. What you learn goes back to the top."* |
| 2:25 | The full ring pulses once, gently, all the way around — a "breathing" loop, then holds. |

Visual idea: draw the sequential arcs first (matches naive intuition) then explicitly draw
the feedback arc as a separate, deliberate beat — so the loop-closing reads as a discovery,
not just a shape that was always there.

**This is the one hard constraint from the concept card:** if the diagram is drawn as a
closed circle from frame 1, the loop never registers as a *point* — it has to be built
stroke-by-stroke, sequential-first, feedback-arc-second.

---

### ACT 6 — Independent axes, not a taxonomy (2:30–2:55)

**Concept:** [[classification-axes-are-independent]]

| Beat | Screen |
|---|---|
| 2:30 | Cut to a blank frame. Caption: *"So what kind of process is this?"* |
| 2:33 | Three horizontal slider tracks fade in, stacked vertically, each labelled at its ends: "Manual ←→ Automated" / "Rare ←→ Repetitive" / "Flexible ←→ Structured". Each starts with its marker mid-track, neutral. |
| 2:38 | A small labelled dot ("Reseller order") flies in and settles onto a position on all three tracks simultaneously (e.g., mid-automated, high-repetitive, fairly-structured) — three markers land within the same ~0.3s beat, not sequentially, to sell "at once" rather than "one at a time". |
| 2:44 | Second dot ("Shipbuilding project") flies in, settles at the opposite extremes on all three (manual, rare, unstructured) simultaneously. |
| 2:49 | Caption: *"Not a category. A position — on every axis at once."* |
| 2:53 | Hold. Both dot-sets sit on their tracks, visibly far apart, no further motion. |

Visual idea: the SAME simultaneity trick as the dot-landing — if markers land one axis at a
time, it reads as a checklist again (undoing Act 1's whole point). All three must commit
in the same beat.

---

### CLOSE — 2:55–3:00

| Beat | Screen |
|---|---|
| 2:55 | Cut to black. Reseller diagram (Act 1's completed version) fades up, small, centered, one more time. |
| 2:58 | Caption: *"A process is what coordination looks like, once you draw it."* |
| 3:00 | Fade to black. End card: series mark, "Next: Ch. 2 — Evolution of Enterprise Systems Architectures". |

---

## Implementation notes for the episode build

- **Reuse from `@anima/core` as-is:** `ProcessView`, `layout`/`pointAt`/`polylineLength`,
  `Token`, `walkAt`/`WalkLeg`, `FONT_STACK`/`SIZE`/`WEIGHT` from theme/type. These are
  already generic — no ep01-specific assumptions leak in.
- **Do NOT reuse:** `VERIFIED_BORDER`, `WRONGLY_BLAMED`, `GAP_HIGHLIGHT`, `SpeakerLabel`,
  `EmptyFrame` — these carry ep01's specific dramatic claims (audited vs. unaudited,
  blame, the absent manager) and have no meaning here. If S02 needs its own semantic
  color later (e.g., "this is the model" vs "this is an instance"), add it as a new,
  separately-named token in `theme/colors.ts` rather than repurposing these.
- **New, genuinely episode-specific components needed:**
  1. A **caption/lower-third text component** for on-screen captions (this episode has no
     speaker, so `SpeakerLabel` doesn't fit — needs a simpler centered/lower-third caption
     with fade in/out, probably belongs in the episode's own `src/` since it's specific to
     the silent-caption format, not to the drawing primitives in core).
  2. A **lifecycle wheel** component (Act 5) — four arced segments around a circle plus one
     outer ring, with per-arc reveal driven by frame. Nothing in core does radial layout;
     build this in the episode's `src/acts/` unless a second S02 episode will want it too,
     in which case promote it to core after this one is validated.
  3. A **slider/axis** component (Act 6) — three horizontal tracks with animated marker
     dots. Also episode-local for now.
  4. **Token forking/merging at a gateway** (Act 2) — `walkAt` handles a single linear
     path; the reseller diagram's parallel split needs two tokens walking two legs
     simultaneously from a shared start point, then merging into one at the join. This is
     new logic, built from the existing `WalkLeg`/`pointAt` primitives, not a `core` change
     — keep it in the episode until a second episode needs the same fork/merge pattern.
- **Layout limitation to work around:** `packages/core/src/process/layout.ts`'s
  auto-layout does linear/branching layout but has no explicit "join" (multiple edges
  converging back to one node don't get special routing — see `routeEdge`, which handles
  one source/one target per edge but not visually cleaning up a converge point). The
  reseller diagram's Archive Order node has two incoming edges (from Receive Payment and
  from Ship Products). Check this renders acceptably before Act 1; if the auto-routed
  edges cross awkwardly, use `ProcessNode.at` manual overrides for the join node and its
  neighbors rather than changing shared layout code for one episode.
- **Timing:** hand-authored in `episodes/s02-ep01-introduction/src/timing.ts`, following
  ep01's *shape* (named cue constants, explicit gaps) but with seconds typed directly
  instead of derived from `voice/manifest.json` — there is no manifest for this episode.
- **FPS/resolution:** match ep01 — 1920×1080, 30fps — for consistency across the series.
