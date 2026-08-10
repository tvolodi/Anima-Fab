# Chapter 1 — Introduction

**Source:** Weske, *Business Process Management: Concepts, Languages, Architectures*,
Part I / Chapter 1 ("Introduction"), supplied as `books/Part 1.docx` (gitignored -
copyrighted source material, not committed).
**Series slot:** S02 — theory season (as opposed to S01's dramatized-scenario format).

---

## What the chapter actually does

It is the textbook's scene-setter. No notation, no diagrams to *learn* — the diagrams
that appear (Figs. 1.1–1.7) are illustrative, not taught. The chapter has four jobs:

1. Motivate BPM as a discipline (why business admin *and* computer science both care).
2. Define its core vocabulary precisely (Definitions 1.1–1.4), using one running
   example — a reseller/buyer ordering process.
3. Walk the **business process lifecycle** (Design & Analysis → Configuration →
   Enactment → Evaluation, with Administration/Stakeholders as an ongoing side-band).
4. Classify business processes along independent axes (organizational/operational,
   intra- vs inter-org, automation degree, repetition, structuring) and preview the
   book's own three-part structure.

## Running example (used throughout, worth reusing in illustrations)

A reseller and a buyer, each running their own process:

- **Reseller:** Receive Order → {Send Invoice → Receive Payment} ‖ {Ship Products} →
  Archive Order. The two branches after the parallel split are concurrent.
- **Buyer:** Place Order → {Receive Invoice → Settle Invoice} ‖ {Receive Products} →
  done.
- The two processes only touch via **messages** (dotted arcs): order, invoice, payment,
  products. Neither process can see inside the other — this is the whole point of a
  choreography vs. an orchestration.
- A variant, **Reseller-A**, serializes the same work (ship only after payment clears) —
  used to show that internal realization can change without changing the
  externally-visible interaction.

## Vocabulary introduced (verbatim definitions, source ¶31/33/38/51)

- **Business process** (Def 1.1): a set of activities performed in coordination in an
  organizational/technical environment, jointly realizing a business goal. Enacted by a
  single organization; may interact with others.
- **Business process management** (Def 1.2): concepts, methods, techniques for design,
  administration, configuration, enactment, and analysis of business processes.
- **Business process management system** (Def 1.3): generic software driven by explicit
  process representations to coordinate enactment.
- **Business process model vs. instance** (Def 1.4): model = blueprint (activity models
  + execution constraints); instance = one concrete case. One-to-many.
- **Orchestration** vs. **choreography**: orchestration = one process, centrally
  controlled (conductor/orchestra analogy). Choreography = multiple processes
  interacting via messages only, no central controller (dance analogy — each dancer
  knows their own part, agreed in advance).

## The lifecycle (the chapter's organizing image, source ¶139–210, Fig 1.5)

A cycle, not a line — phases have logical dependencies, not a strict temporal order;
real work overlaps phases.

1. **Design & Analysis** — survey → identify/model processes → validate (workshops) →
   simulate → verify (e.g., freedom from deadlock).
2. **Configuration** — pick implementation platform, attach legacy systems, decide
   manual-policy vs. software-driven, test (integration/performance), deploy.
3. **Enactment** — runtime. The BPMS enforces ordering; monitoring shows live state
   (color convention: enabled=green, running=blue, completed=grey); execution produces
   log files.
4. **Evaluation** — mine those logs (process mining, business activity monitoring) to
   find bottlenecks/deficiencies, feeding back into Design & Analysis.
5. **Administration & Stakeholders** — not a phase in sequence, a continuous band
   underneath all four: repository management + 8 named roles (Chief Process Officer,
   Business Engineer, Process Designer, Process Participant, Knowledge Worker, Process
   Responsible, System Architect, Developer).

## Classification axes (independent, a process has a position on each)

- **Organizational vs. operational vs. implemented** — a strategy → goals → org.
  processes (textual, high-level) → operational processes (modelled, no
  implementation detail) → implemented processes (bound to a platform) pyramid
  (Fig 1.6).
- **Intraorganizational vs. choreography** — single org, no external interaction vs.
  multiple orgs coordinating by message only (contracts + interoperability become
  issues).
- **Degree of automation** — fully automated (e.g. airline e-ticketing) vs. mixed
  manual/automated (e.g. insurance claims) — key point: prescribing "what to do next"
  to knowledge workers tends to fail; systems that support rather than script them work
  better.
- **Degree of repetition** — high repetition (automate, it pays off) vs. low repetition
  / one-off ("collaborative business processes," e.g. large engineering projects,
  scientific experiments) where the goal shifts from efficiency to traceability/data
  lineage.
- **Degree of structuring** — fully structured ("production workflow," Leymann &
  Roller) vs. unstructured, where rigid control-flow becomes an obstacle for skilled
  knowledge workers and ad-hoc/case-handling approaches fit better.

## Goals of BPM, restated (source ¶277–286)

Understanding → communication → flexibility (the key *operational* goal) →
organizational knowledge repository → continuous improvement → narrowing the
business/software gap. These aren't a numbered list in the source but they build on
each other in that order.

## What this chapter is NOT

No notation is taught (BPMN appears only informally, "discussed in detail in Chapter
4"). No architecture, no algorithms, no correctness proofs. It's establishing shared
vocabulary and mental models the rest of the book (and presumably this book-adaptation
series) will build on.

## Candidate teachable ideas (raw list, to be turned into concept cards)

1. A business process is a *coordinated, goal-directed* set of activities — not just a
   list of tasks (the input/output framing from Hammer & Champy → Davenport → Def 1.1).
2. Model vs. instance is a blueprint/case distinction, not jargon for the same thing
   twice.
3. Orchestration vs. choreography — centralized control vs. agreed-upon independent
   behavior — same underlying process, two fundamentally different coordination
   mechanisms, and BPM has to reason about both.
4. Realization can change without changing the externally visible process (Reseller vs.
   Reseller-A) — decoupling of "what" from "how," a big deal for flexibility later in
   the book.
5. The lifecycle is a *cycle with a feedback loop* (Evaluation → Design & Analysis via
   process mining), not a waterfall — this is easy to accidentally draw as linear and
   would misrepresent the source.
6. Classification axes are independent dimensions, not a taxonomy tree — a process has
   a *position* on each axis simultaneously (e.g., a process can be low-automation AND
   highly repetitive).
