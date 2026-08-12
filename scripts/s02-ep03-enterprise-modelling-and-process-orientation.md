# S02 Episode 3 — "The Business Side of the Same Question"

**Series:** BPM, honestly — S02, theory season
**Source:** [notes/ch02-enterprise-modelling-and-process-orientation.md](../notes/ch02-enterprise-modelling-and-process-orientation.md),
covering the Weske Ch.2 section "Enterprise Modelling and Process Orientation" (Value
Chains + Organizational Business Processes only — the B2B subsection is not dramatized,
see "Why this episode is a fork, not a sequel" below). Concept cards, all confirmed:
[[value-chain-is-functions-not-processes]], [[coarse-grained-work-needs-knowledge-workers]],
[[org-processes-are-black-boxes]]
**Gate note:** per `docs/PIPELINE.md`, a card cannot become a script while
`status: unverified`. All three cards above are `status: confirmed`. Cleared to build.
**Register:** same as ep1/ep2 — no cast, no invented drama, captions/narration carry
meaning, not characters.
**Audio — narration:** this episode gets narration, per project policy from ep02 onward.
Single neutral documentary-style narrator voice (not a character voice — preserves the
"no cast" rule of the season). Budget TTS lines the way ep02 did: write `voice/lines.json`
(and, per ep02's precedent, an English track `voice/lines.en.json` if the on-screen text
is English — it is, throughout this season), synthesize, then derive `timing.ts` from
`voice/manifest.json` durations. **Do not hand-pack line durations** — see Implementation
notes for the specific ep02 lesson this repeats.
**Audio — music:** multiple tracks, rotating across the episode (not one static bed),
following ep02's actual precedent. See Implementation notes for the specific
track-per-act suggestion, flagged for Producer approval.
**Runtime target:** ~2:30–3:00 (three cards, similar scope to ep02's three; this section
is lighter on invented visual geometry than ep02 was, so aim for the shorter end of that
window rather than ep02's 3:15).
**Production cost:** medium — one new layout-heavy component (value chain rows), one new
"black box" card component, and one genuinely dramatized sequence (the Taylorism
handover-cost argument) that carries the episode's emotional core. See Implementation
notes for the full new-vs-reuse breakdown and the flagged highest-risk piece.

---

## Why this episode is a fork, not a sequel

Ep02 ended on "every fix so far has moved WHERE the coupling lives" — a good hook, and
it would be tempting to open this episode answering it. **Resist that.** The source is
explicit (¶2 of the notes file, quoting Weske almost directly): value chains and process
orientation are the *second* of "two major factors" that fuelled BPM, and this one comes
from business administration, not software architecture. The two factors are named as a
conjunction, not a causal chain — parallel tributaries into the same river, not sequential
steps in one argument. Forcing this into "one more row in ep02's separation-of-concerns
table" would misrepresent what the source actually claims, which is precisely the
S02-season failure mode the card-validator gate exists to catch (fidelity to the text, not
narrative convenience).

So the honest open is a **fork**, not a continuation: same destination (BPM), different
road. That also means this episode does not get ep02's gift of a single throughline motif
reused at every scale (ep02 had "extraction, at every scale" for free, because the source
itself repeats that move four times). This chapter's own internal throughline is
different and sharper in a different way: **Taylorism's fine-grained decomposition worked
for simple industrial work and breaks for modern information-heavy work, because of
handover cost.** That's a critique of over-decomposition, not a celebration of layering —
almost the opposite shape of ep02's argument. The episode's honest difficulty isn't "no
single diagram survives the whole runtime" (true, but same as ep02) — it's that the three
cards don't chain causally the way ep01's six lenses or ep02's four extractions did. Card
1 (value chains) ends on an explicit gap Porter leaves open; card 2 (Taylorism) is a
self-contained problem/solution; card 3 (black-box processes) answers card 1's gap but
needs card 2's "knowledge worker" vocabulary to land. The connective tissue has to be
built by the script, not inherited from the source's own repetition — see the visual
spine below for how.

## Visual spine

Three visual ideas, one per card, bridged by two short connective beats rather than one
motif reused throughout (unlike ep02, forcing a single reused shape here would misrepresent
a source that doesn't repeat itself that way).

- **Card 1 (value chain):** Fig 2.11's actual shape — a horizontal band of **primary
  function** boxes (Inbound Logistics → Operations → Outbound Logistics → Marketing and
  Sales → Services) sitting above a second band of **support function** boxes (Firm
  Infrastructure, HR, Technology Management, Procurement) that stretch underneath all of
  them, with a **Margin** wedge at the right edge both bands feed into. This is a fixed
  layout, not a flow diagram — no tokens walking it. The act ends by visibly opening a
  gap in the diagram: process arrows are implied (dotted, unresolved) crossing the
  function boxes, then fade before completing — "the shape is here, the connecting lines
  are not yet."
- **Connective beat (bridge to card 2):** the unresolved dotted lines from card 1 don't
  return until card 3. Instead, a hard cut zooms into a single function box (Operations)
  and holds — "zoom into any one of these boxes, and here's what's actually inside."
  This motivates why the episode now goes small (into how work itself is organized)
  before it goes back to the big picture (card 3's landscape).
- **Card 2 (Taylorism/handover cost):** a task token moving through a chain of small,
  narrow boxes, each labelled with a narrow specialism — visibly stopping at each
  boundary for a "context reload" beat (a small spinner/loading pulse on the token
  itself, plus a brief on-screen context readout that empties and has to refill) — then,
  after the resolution, the same task moving through far fewer, wider boxes labelled
  "knowledge worker," passing straight through without the reload beat. This is the
  episode's dramatized centerpiece; see its own act section below for the
  problem/solution screen-time treatment.
- **Card 3 (black-box processes):** the "zoomed into Operations" frame from the
  connective beat pulls back out, but this time resolves into Fig 2.14's shape — a small
  number of opaque, labelled blocks (Innovation → Product Planning → Product Development
  → Marketing → Order Management, with After-Sales Service feeding back in) connected by
  dependency arrows, each block explicitly NOT opened up. One block (Product Development)
  gets pulled forward and shown as a forms-based card (name, manager, inputs, outputs,
  supplier/customer processes) — the Fig 2.13 detail — before being pushed back into its
  place in the landscape, opaque again.
- **Color:** neutral/grey chrome, matching ep01/ep02's register — no blame-color, no
  audited-border (S01 vocabulary, doesn't belong here). One accent color for "margin" /
  value-creation in card 1 (suggest a new token, e.g. `MARGIN_ACCENT`, distinct from
  ep02's `EXTRACTED_ACCENT` since it marks a different concept — outcome, not
  interface). A second, distinct accent for the "context reload" cost in card 2 (a
  visibly effortful, slightly discordant color — this is the one moment in the episode
  that should look a little uncomfortable to watch, on purpose).

---

## Act-by-act

### COLD OPEN — 0:00–0:12

| Beat | Screen |
|---|---|
| 0:00 | Black. |
| 0:03 | A single word fades in, center, plain: "BPM." Nothing else. |
| 0:06 | Narration + caption: *"Last time, this came from software. It also comes from somewhere else."* |
| 0:10 | Cut to title card: **"The Business Side of the Same Question"** / sub: *Ch. 2 — Enterprise Modelling and Process Orientation*. |

Sets up the fork framing immediately, without leaning on ep02's specific vocabulary
(no "coupling," no "extraction") — this episode earns its own terms.

---

### ACT 1 — A value chain is what a company actually does (0:12–0:50)

**Concept:** [[value-chain-is-functions-not-processes]]

| Beat | Screen |
|---|---|
| 0:12 | Narration: *"Every company can be drawn as a set of functions — the jobs it has to do to create value."* A horizontal row of five boxes draws in left to right: Inbound Logistics, Operations, Outbound Logistics, Marketing and Sales, Services — plain labels, no color yet. |
| 0:19 | Narration: *"These are the functions that build the product and get it to a customer — the primary work."* The five boxes get a light fill, settling as a single connected band. |
| 0:25 | A second, wider band fades in underneath, spanning the full width: four boxes — Firm Infrastructure, Human Resource Management, Technology Management, Procurement. Narration: *"Underneath, the functions that make the first row possible, without building the product themselves."* |
| 0:32 | A wedge shape draws in at the right edge, fed by thin lines from both bands. Label: "Margin." Narration: *"What's left over, once both rows have done their work — the difference between what it cost and what it earned."* |
| 0:38 | Hold on the complete two-band diagram — this is Fig 2.11's shape, now fully drawn. |
| 0:41 | Narration: *"This is a value chain. It says what a company does. It does not yet say how the work actually moves."* As this line lands, faint dotted arrows begin drawing between a few of the primary-function boxes — Inbound Logistics toward Operations, Operations toward Outbound Logistics — attempting to connect them. |
| 0:46 | The dotted arrows stop partway, unresolved, and fade to near-invisible (not gone — just faint) rather than completing or vanishing entirely. Narration: *"That gap is exactly where this chapter is headed."* |

Visual idea: the diagram is complete and satisfying at 0:38, then the act deliberately
reopens it as incomplete at 0:41 — the dotted, unfinished arrows are the visual form of
"Porter's model stops here," a setup with its payoff explicitly deferred to Act 3, not
resolved within this act.

---

### CONNECTIVE BEAT — Zooming into one box (0:50–1:00)

**Concept:** none directly (bridge beat; see [[value-chain-is-functions-not-processes]]
for what it's leaving behind).

| Beat | Screen |
|---|---|
| 0:50 | Hard cut. The full value-chain diagram shrinks to a small icon, docks top-left (a callback anchor, in the same spirit as ep02's docked Act 1–2 icon). |
| 0:53 | The "Operations" box from Act 1 alone flies to center frame and enlarges, filling most of the screen — plain, unlabeled interior, waiting. Narration: *"Say this box is where the actual work happens. What does 'work' look like, up close?"* |
| 0:58 | Hold on the empty, enlarged box — deliberately inert, a held question, not yet answered. |

Visual idea: this is the hinge the episode needs since the source itself doesn't supply
one — going from "the big picture has a gap" to "let's look at how work is organized" is
the script's own connective move, kept short and honest about being a transition rather
than dressed up as something the book itself says.

---

### ACT 2 — The cost of handing work off (1:00–1:55)

**Concept:** [[coarse-grained-work-needs-knowledge-workers]]

This act gets the problem/solution treatment in full — the problem is named while the
camera holds on the problem state, and the resolution is narrated during the
transformation itself, not captioned afterward over a diagram that's already changed.

| Beat | Screen |
|---|---|
| 1:00 | Inside the enlarged "Operations" box from the connective beat, a chain of six narrow boxes fades in left to right, each barely wider than its label: "Receive," "Inspect," "Log," "Route," "Check," "Release." Narration: *"Break work into small, specialized pieces — one worker, one narrow task each. This is Taylorism. It built the industrial revolution."* |
| 1:07 | A token enters the chain at "Receive," moves through it briskly — no pauses, no readout — narration continuing: *"On a factory floor, that worked. Each step was simple. A worker didn't need to know what happened before — just do the one thing in front of them."* |
| 1:15 | Hard cut: the same six-box chain, now relabeled for modern work — "Intake," "Verify," "Assess," "Approve," "Notify," "Archive." A token enters at "Intake." Narration holds, naming the problem plainly: *"Modern work doesn't stay this simple. Each step here needs to know the whole case, not just its own task."* |
| 1:22 | The token reaches the boundary between "Intake" and "Verify" and **stops** — a visible halt, not a glide-through. A small on-screen readout beside the token empties out (context bar drains to zero), then a brief spinner/reload pulse plays before it refills partway. This "context reload" beat repeats, visibly, at every single boundary through "Assess," "Approve," "Notify" — five reloads total, each one slightly labored, deliberately a little uncomfortable to watch. **Hold here — do not rush this beat or cut away early.** Narration, landing during this exact sequence, names the mechanism without softening it: *"Every handoff, someone has to reconstruct the context from nothing. That reconstruction — not the task itself — is what actually costs time."* |
| 1:35 | The token finally reaches "Archive," visibly late, readout depleted. Full hold, one beat, on the tired, six-box, five-reload chain — this is the problem state, given its own uninterrupted screen time, no resolution visible yet. |
| 1:39 | **Transition begins.** Narration starts the resolution *as the transformation happens*, not after: *"Combine the small steps back into fewer, wider ones —"* — and exactly as this is spoken, the six narrow boxes visibly merge, pairwise, into three wider boxes: "Intake+Verify" briefly shows both labels overlapping before settling on a new single label "Receive & Assess"; the same merge happens for the remaining two pairs, landing on "Decide" and "Close." |
| 1:45 | Narration continues, still during motion, not after it's settled: *"— and give them to people who understand the whole case, not just one narrow piece of it."* As this lands, a small badge fades onto each of the three new wide boxes: "knowledge worker" (a direct callback to Chapter 1's knowledge-worker material — one line, not dwelt on). |
| 1:49 | A new token enters "Receive & Assess," moves through all three wide boxes without stopping — no drained readout, no reload pulse, briskly and cleanly, mirroring the factory-floor token's easy pace from 1:07. |
| 1:53 | Hold on the clean three-box chain, token having completed its run. No further caption needed — the contrast with 1:35's tired six-box hold is the point. |

Visual idea: the problem (1:15–1:38) and the resolution (1:39–1:53) are two distinct,
separately-held camera states connected by a transformation the narration rides through
in real time — this is the direct application of the
`feedback_problem-solution-needs-own-screen-time` lesson: no caption is allowed to sit
over a moving merge as its only explanation; the narration carries the resolution while
the merge is actually happening on screen, and the problem state gets its own uncut hold
first so it registers as a state, not a flash.

---

### ACT 3 — Processes as black boxes (1:55–2:35)

**Concept:** [[org-processes-are-black-boxes]]

| Beat | Screen |
|---|---|
| 1:55 | Hard cut. The three-box "knowledge worker" chain from Act 2 shrinks to a small icon, docks near the Act 1 value-chain icon (both callback anchors now visible together, top-left). |
| 1:59 | The enlarged, empty "Operations" box from the connective beat reappears, then itself shrinks and resolves into one small opaque block among several — the value-chain gap from Act 1 is about to get its answer. Narration: *"Zoom back out. A company doesn't run on one function. It runs on a handful of processes — and each one stays a closed box."* |
| 2:05 | A landscape of five opaque blocks draws in: Innovation Process → Product Planning → Product Development → Marketing → Order Management, left to right, connected by solid dependency arrows (not dotted, unlike Act 1's unresolved lines — these fully connect). A sixth block, After-Sales Service, sits below, with an arrow feeding back into Order Management's upstream side. Narration: *"None of these are opened up. What matters here is only what crosses the line between them."* |
| 2:14 | The "Product Development" block pulls forward, enlarges, and flips to reveal a forms-based card: Manager: Dr. Myers · Scope: Requirements → Rollout · Inputs: Requirements Document, Project Plan, Budget Plan, Prototypes · Supplier processes: Product Planning, Innovation · Customer processes: Order Management, After-Sales Service. Narration: *"This is as deep as the org level goes — a name, a manager, what comes in, what goes out. Not a flowchart of how the work happens inside."* |
| 2:24 | The card flips back and the block returns to its opaque position in the landscape, indistinguishable again from its neighbors. Narration: *"Open it further, and you're no longer describing the company — you're describing one process's own internal work. Different question, different level."* |
| 2:29 | The dependency arrows between all six blocks pulse once, in sequence, left to right then the feedback arrow last — narration: *"What happens at these lines is, more than almost anything inside the boxes, what the business is actually judged on."* |
| 2:33 | Hold on the full landscape, arrows settled, all blocks opaque. |

Visual idea: the "flip to reveal, then flip back to opaque" beat is the whole argument
made physical — the viewer gets exactly one look inside exactly one box, long enough to
see it's a form and not a diagram, then watches it deliberately close again. Don't let
Product Development stay open past 2:24; the closing is as important as the opening.

---

### CLOSE — 2:35–2:50

**Concept:** none directly — connective/summary only.

| Beat | Screen |
|---|---|
| 2:35 | Cut to black. All three callback icons — value chain, knowledge-worker chain, process landscape — fade up together, small, arranged left to right. |
| 2:40 | Narration: *"A shape for what the company does. A reason the work has to be grouped coarser than Taylor would have grouped it. And a boundary around each process that stays deliberately closed."* |
| 2:45 | Narration: *"Different road than last time. Same destination."* |
| 2:48 | Fade to black. End card: series mark, "Next: business processes that cross company lines" (deliberately non-specific — the B2B subsection and its Chapter 5 forward-pointer are not yet a confirmed card for this pipeline; do not promise Chapter 5 content). |

---

## Implementation notes for the episode build

- **Reuse from `@anima/core` as-is:** `Token` (for Act 2's task-token — its `mood` states,
  particularly `"waiting"`/`"frantic"`, are worth checking against the "stopped at a
  boundary, context draining" beat before writing new token logic), `FitStage`,
  `theme/type` (`FONT_STACK`/`SIZE`/`WEIGHT`), `theme/colors` base tokens (`BG`,
  `TOKEN_BODY`, `TOKEN_EYE`). Same caption-chrome question both prior episodes faced —
  check whether either episode already extracted a reusable narrated-caption component
  before building a third one from scratch.
- **Do NOT reuse `ProcessView`/`Process`/`Lanes` as designed.** These carry real S01
  semantics baked in — `audited`/`showVerified` (the "verified" border), `blamed`
  (`WRONGLY_BLAMED`), the `SPEAKER` palette keyed to named speakers, `SpeakerLabel`. None
  of that applies here: this episode has no audited/unaudited distinction and no
  speakers. The underlying `layout()` function and `LaidOutNode`/`LaidOutEdge` shapes
  (from `packages/core/src/process/layout.ts`) are closer to generically useful for Act
  3's process-landscape diagram (opaque blocks + dependency arrows is structurally a
  node/edge graph), but `layout()` is tuned for BPMN-style start/task/gateway/end shapes,
  not opaque rectangular blocks with a feedback edge — evaluate whether it's a genuine
  fit or whether Act 3 needs its own simpler layout (five-plus-one blocks is small enough
  that a hand-placed layout may just be less trouble than adapting `layout()`'s
  row-cursor logic for a shape it wasn't designed for). Decide this before building, the
  way ep02 explicitly reasoned through the same question for its own diagrams.
- **New components needed:**
  1. **Value-chain band component** (Act 1) — two stacked horizontal rows of boxes (5
     primary, 4 support) plus a margin wedge fed from both. Nothing in `@anima/core` does
     this fixed two-row-plus-wedge layout; it is not a node/edge graph (no arrows between
     the boxes within the chain itself, only the deliberately-unresolved dotted attempt at
     the act's end) so it should NOT be built on top of `layout.ts`. Build as its own
     static-position component, parameterizable by box count per row in case a future
     episode needs a different value chain.
  2. **Black-box process card component** (Act 3) — the Fig 2.13 forms shape: name,
     manager, scope, inputs, outputs, supplier/customer processes, with a flip/enlarge
     transition in and a flip-back transition out. Should be built so it can dock into a
     landscape diagram afterward (matches the note in the task brief that this component
     may be reused later if a future episode revisits the process-landscape idea at the
     operational level).
  3. **Handover/context-reload beat** (Act 2) — the highest build risk in this episode,
     flagged explicitly: a token that visibly halts at a chain boundary, a context-readout
     bar that drains and refills with a spinner/reload pulse, repeated identically five
     times in the six-box chain, THEN a merge animation that turns six narrow boxes into
     three wide ones while a token runs clean through the result. This is three distinct
     new animation behaviors stacked into one act (halt-and-reload, pairwise box-merge,
     clean-run contrast) and it is also the act explicitly required to carry its
     problem/solution weight without leaning on a caption-over-motion shortcut — prototype
     and preview-render this act first, before locking any other act's timing, the way
     ep02 flagged its mesh/hub component as the thing to de-risk early.
  4. **Process-landscape connector** (Act 3, if `layout.ts` is judged not a fit per above)
     — five-plus-one opaque blocks with directional dependency arrows including one
     feedback arrow (After-Sales Service back into Order Management). Smaller in scope
     than ep02's mesh/hub component (six blocks fixed, not N-scalable), but still new
     geometry if not built on `layout.ts`.
- **Sequencing trap (same as both prior episodes, restated so it isn't rediscovered):**
  act components read ABSOLUTE cue frames, so inside `Episode` they must mount via the
  local `Window` helper, not `<Sequence>` — `<Sequence>` rebases `useCurrentFrame()` to
  local time and will silently break any act that reads an absolute cue frame (this
  previously rendered as an unexplained black frame in ep01; see docs/TODO.md's "Trap
  worth knowing" note for the full history). Standalone per-act Studio compositions are
  the opposite case and DO want a `Sequence` offset via `ActPreview.tsx`, following both
  prior episodes' pattern.
- **Timing — derive from `voice/manifest.json`, do not hand-pack.** This repeats ep02's
  own documented lesson (see `episodes/s02-ep02-enterprise-systems-architectures/src/timing.ts`'s
  header comment): narration total duration is NOT the episode length. Ep02's first draft
  packed lines end-to-end and produced a 103s render against a 195s target — roughly half
  the intended length, with animations (its mesh draw-in) shorter than they needed to be.
  The fix ep02 landed on: give each act a **fixed target width in seconds** (from the
  original hand-typed pacing draft, i.e. this script's act timestamps above), place
  narration lines inside that fixed width anchored to when their caption should read, and
  let leftover width become a hold — not the other way around. Follow the same pattern
  here: this script's act timestamps (Cold Open 12s, Act 1 38s, Connective 10s, Act 2 55s,
  Act 3 40s, Close 15s ≈ 170s ≈ 2:50) are the fixed act widths to carry into `timing.ts`,
  not a estimate to be overridden by whatever the synthesized narration happens to total.
  Act 2 in particular has five identical context-reload sub-beats plus a merge animation
  that all need to fit inside its width regardless of how short the narration for that
  act turns out to be — budget its width generously rather than shrinking it to match
  narration length.
- **FPS/resolution:** 1920×1080, 30fps, matching both prior episodes.
- **Music track suggestions (flagged for Producer approval, not decided):** per
  `tools/sound-library/registry.json`, `warm-pad-drone` (tags: calm/ambient/minimal/
  no-percussion/analytical/understated) has been unused since ep01 and its mood fits
  Act 1's fixed, static value-chain diagram well — suggest it for Cold Open + Act 1. For
  Act 2, the episode's one deliberately uncomfortable stretch, none of the currently
  registered tracks are tagged for tension/discomfort — either reuse ep02's
  `mystic-minimal-loop` (its "slightly more forward-moving" quality, used for ep02's
  busiest beats, may read as productive unease here too) or flag this as a candidate for
  a new registry entry if the Producer wants something that actually underscores the
  reload beats rather than just staying out of their way. For Act 3 and the Close, suggest
  `atmospheric-piano` (calm/analytical, matches the landscape diagram's settled, wide-shot
  quality) — this would be the third episode to use it, which is not yet forbidden by
  policy but is a real repeat and worth the Producer's explicit sign-off rather than
  assuming it's fine. **Do not assign `piano-jam-mei`** — it's explicitly held back per
  standing note ("too rich to compete with dull BPM material"); nothing about this episode
  changes that, so this script does not override the hold.

---

## Card → act cross-reference (for review)

| Card | Acts driven | If this card is rejected/amended... |
|---|---|---|
| [[value-chain-is-functions-not-processes]] | Act 1, and the Connective Beat's framing (which exists only to bridge out of Act 1's unresolved gap) | ...the episode loses its opening argument and the unresolved-dotted-arrows setup in Act 1 needs to go; the Connective Beat's "zoom into one box" framing would also need rework since it exists specifically to leave Act 1's gap open rather than closed. |
| [[coarse-grained-work-needs-knowledge-workers]] | Act 2 (entirely) | ...Act 2 is this episode's dramatized centerpiece and its problem/solution structure is built directly from this card's mechanism (handover cost) and resolution (knowledge workers); rejection or amendment here means re-timing the episode's single longest act, not a small edit. |
| [[org-processes-are-black-boxes]] | Act 3 (entirely), and it's the payoff Act 1 explicitly defers to | ...Act 3 both loses its own content and stops resolving Act 1's setup, so the episode would end without closing its own opening question — check whether Act 1 needs a different, self-contained ending instead of a deferred one. |
