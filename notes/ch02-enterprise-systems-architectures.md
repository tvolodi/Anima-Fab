# Chapter 2, §2.1 — Evolution of Enterprise Systems Architectures

**Source:** Weske, *Business Process Management: Concepts, Languages, Architectures*,
Chapter 2 ("Evolution of Enterprise Systems Architectures"), §2.1 only, supplied as
`books/Weske-BPM-Part 2.1.docx` (gitignored - copyrighted source material, not
committed).
**Series slot:** S02 — theory season.
**Coverage note:** this docx contains §2.1 only. The section ends on an explicit
forward pointer to workflow management (§2.2, "identifies process specifications as
first-class citizens") and a second pointer to enterprise modelling / process
orientation — neither is in this file. Treat this as a partial chapter; do not build a
full "Chapter 2" episode until the rest arrives.

---

## What the section actually does

It's a history lesson with one argument running underneath: **each generation of
enterprise software solved yesterday's coupling problem by introducing a new shared
layer, and each new layer created a new coupling problem one level up.** The section
walks four generations to make that pattern impossible to miss, then stops right
before the punchline (workflow management treats *process* as its own explicit,
first-class layer — same move, one level higher).

Structurally it has two halves:

1. **Traditional Application Development** (¶12–55, Fig 2.1) — the OS → DBMS → GUI
   layering, told as a separation-of-concerns story.
2. **Enterprise Applications and their Integration** (¶56–253, Figs 2.2–2.8) — ERP as
   the first integration move, then EAI's two architectures (point-to-point,
   hub-and-spoke), told as a coupling/decoupling story with a concrete example
   (CRM/SCM/ERP needing to share a customer's address).

## The organizing principle (stated up front, ¶4–8)

**Separation of concerns** (Dijkstra) — "focusing one's attention upon some aspect" —
applied to software means: identify related functionality, package it in a subsystem
with a clear interface. Two payoffs, both load-bearing for everything that follows:

- **Reuse** at coarse granularity — well-specified subsystems get used by many
  applications.
- **Response to change** (**information hiding**, Parnas) — a subsystem can be
  modified or swapped *without touching the rest of the system*, provided its
  interface stays stable.

The chapter's real subject is response to change. Every generation below is graded on
that axis, not on features.

**Definition 2.1** — a software architecture is a structure organizing a system's
software elements and resources into subsystems, with defined responsibilities and
relationships. It specifies subsystems' *externally visible* behavior, not their
internals.

## Generation 1: Traditional Application Development (¶12–55, Fig 2.1)

Told as three sequential extractions, each one pulling a concern out of the
application and into its own layer:

1. **No layers (pre-OS).** Applications coded straight to hardware (assembler).
   Porting to new hardware meant near-total redevelopment. Basic functionality
   (storage access, memory management) was reinvented per application.
2. **Operating system extracted.** OS provides a stable programming interface to
   hardware; hardware changes are absorbed by a new driver, not a rewrite of every
   application.
3. **Database management system extracted.** Before DBMS: each application managed
   its own persistence, so application data structures and stored data structures
   were tightly linked — a change to one forced a change to the other. Two named
   problems this caused: (a) duplicated storage/retrieval implementation effort per
   app, (b) **data inconsistency** when multiple apps redundantly store related data.
   DBMS (relational, after hierarchical/network models) fixes this via **physical data
   independence** (storage structure can change without touching the app) and
   **logical data independence** (logical schema can change without touching the
   app). SQL, transactions, security bundled in.
4. **GUI extracted.** Pre-GUI, textual interfaces demanded heavy user training —
   tolerable when users were narrow specialists. As applications broadened and users
   became **knowledge workers** (large skill sets, choosing among tasks rather than
   following a script), textual interfaces stopped being adequate. GUI separates
   interaction from business logic and becomes its own reusable layer.

Fig 2.1's stacked-boxes picture (Application / DBMS / OS, then + GUI, across
1970→1990) is explicitly flagged by the text as **simplified** — applications don't
only go through the DBMS, they also call the OS directly. Worth preserving that caveat
if the diagram is dramatized; a clean strict stack would overstate the book's own
claim.

## Generation 2: ERP (¶65–73, Figs 2.2–2.3)

**Setup problem (¶56–64, Fig 2.2):** as enterprises grew, they accumulated one
application per function (HR, purchasing, production planning...), each with its own
local data store. The same logical entity (e.g. a customer address) ends up stored
redundantly across systems, linked only by ad hoc identifiers (contract ID, employee
ID). Any change has to be manually propagated to every copy — complex, error-prone,
and the direct cause of the inconsistent-data / dissatisfied-customer failure mode.

**ERP's move:** don't integrate the siloed systems — **reimplement them on one shared,
centralized database.** One integrated DB; application modules (HR, financials,
manufacturing...) sit on top of it. This *solves* the redundant-data problem by
construction, because there's only one copy. Accessed via a two-tier client-server
architecture (client → application server → database server, Fig 2.3).

## Generation 3: New best-of-breed systems break ERP's solution again (¶74–81, Fig 2.4)

Around 2000, new demands (supply chain dynamics, customer relationship management)
spawned dedicated **SCM** and **CRM** systems, usually from different vendors than the
ERP. Each hosts its own database. Result: **the exact same redundant-data problem ERP
just solved, one level up** — now between ERP/SCM/CRM instead of between HR/purchasing/
production. Worked example carried through the rest of the section: a **customer
address**, needed by both ERP and CRM, changing in one but not (yet, atomically) the
other.

This is named explicitly: **siloed applications** — physically networked, not
logically integrated. The human cost is dramatized concretely: a call-center agent
can only see what their own system holds, so they under-serve a customer whose full
status is split across ERP and CRM. **The user becomes the manual integration layer**
— slow and error-prone.

Unlike generation 2, reimplementing everything into one more mega-database is called
out as **no longer feasible** — the systems are too complex. The only remaining move
is to integrate rather than replace. That forces a new kind of middleware: **enterprise
application integration (EAI)**.

## Generation 4: EAI — two architectures, one axis of comparison (¶123–253, Figs 2.5–2.8)

Two named heterogeneity problems any integration has to solve first (¶125–128):
- **Syntactic**: same logical field, different type/name (`CAddr` vs `StreetAdrC`).
- **Semantic**: same field name, different meaning (does `Price` include VAT?).

Both architectures below are graded on the same question the whole chapter keeps
asking: **when the application landscape changes, how much has to be reprogrammed?**

### Point-to-point (¶130–164, Figs 2.5–2.6)

Every pair of systems that needs to talk gets a direct, hard-wired link. Named cost:
the **N×N problem** — links scale as N(N−1)/2 for N systems (worked with N=6 → 15
links in the text). Even **message-oriented middleware** (guaranteed delivery via
message queues) doesn't fix the underlying issue, because **the sender still has to
name the receiver** in the message — the point-to-point coupling is still there,
just wrapped in a more reliable transport. Consequence called out explicitly: process
logic ends up **hardwired inside the integration application's code**, with no
explicit, communicable, changeable process model — an echo of the pre-OS "logic
buried in one giant program" problem from Generation 1, now at the process level.

### Hub-and-spoke (¶165–246, Figs 2.7–2.8)

A central hub; every application (spoke) connects only to the hub, not to each other.
**Senders don't need to know receivers** — the hub's rules (evaluated centrally)
route messages, so N systems need only N connections, not N². **Adapters** hide each
system's native heterogeneity from the hub. **Message brokers** add declarative
routing rules and **publish/subscribe**: apps publish messages or subscribe to
message types without knowing who's on the other end. Response to change improves
concretely: a changed relationship between two systems is a **rule edit at the hub**,
not a **reprogram at N endpoints**.

**Named drawback, not glossed over (¶248–251):** the hub accumulates real application
logic inside its rule sets, and rules can develop **complex, hard-to-predict
interdependencies** — changing one rule can have unintended effects elsewhere. Root
cause named directly: EAI has **no proper conceptual/process model underneath it** —
it's still fundamentally programming and low-level adapter/broker configuration,
just centralized. Data integration still leans on data-mapping tools presupposing an
(often implicit, undocumented) **global data model**. Process integration still
leaves the actual process — the ordering/partial-order of activities toward a
business goal — **buried in broker rules** rather than represented explicitly.

## The pattern across all four generations (this is the thing to visualize)

| Generation | New shared layer | What it decoupled | New problem one level up |
|---|---|---|---|
| 1. OS | hardware access | app ↔ hardware | data management still per-app |
| 1. DBMS | persistence | app ↔ storage structure | — (solved for a single app) |
| 1. GUI | interaction | business logic ↔ UI | — |
| 2. ERP | one shared DB | app ↔ app (same org) | new best-of-breed systems outside ERP |
| 4. Hub-and-spoke EAI | central broker | app ↔ app (cross-system) | process logic still buried in broker rules |

Every row fixes coupling by adding **one more explicit, shared layer with a stable
interface** — and every fix's blind spot becomes next generation's problem. The
section's cliffhanger (§2.2, not in this file) is the logical next row: make the
**process itself** an explicit, first-class, shared layer — which is exactly workflow
management / BPM's move. Worth landing the episode on that "one more row" beat rather
than treating hub-and-spoke as a resting point.

## Candidate teachable ideas (raw list, to be turned into concept cards)

1. **Separation of concerns → information hiding is the throughline**, not a history
   trivia fact — every generation in the chapter is a re-application of the same move
   (extract a concern into its own layer with a stable interface), and the chapter
   wants the reader to *see* the repetition, not just learn four facts.
2. **Each integration fix creates the next generation's problem, one level up** — ERP
   solves intra-org data silos by centralizing; that same centralization move stops
   working once independently-vendored SCM/CRM systems appear, recreating the silo
   problem between systems instead of within one. This is the chapter's central
   argument and the strongest visual candidate (a repeating "fix → new gap" motif).
3. **The N×N problem is what makes point-to-point integration structurally, not just
   annoyingly, unscalable** — concrete and countable (15 links for 6 systems),
   good for an on-screen count-up.
4. **Hub-and-spoke doesn't eliminate coupling, it relocates and declares it** — the
   dependency between two systems still exists, it just moves from "code inside each
   application" to "a rule inside the hub," which is why it's editable without
   reprogramming endpoints. Important nuance: this is framed as an improvement, not a
   cure — the hub itself can grow into a tangle of interdependent rules.
5. **Physical vs. logical data independence** (DBMS) is the same "stable interface,
   changeable implementation" idea the whole chapter reuses later for hub-and-spoke —
   worth explicitly calling back to, since Weske doesn't name the callback but the
   structure repeats.
6. **The missing piece EAI never had: an explicit process model.** Point-to-point
   buries process logic in integration-application code; hub-and-spoke buries it in
   broker rules. Both leave "what is the actual sequence of steps toward the business
   goal" implicit and hard to communicate — this is the direct setup for workflow
   management in §2.2, and probably belongs at the very end of the episode as the
   open thread rather than a resolved idea.
