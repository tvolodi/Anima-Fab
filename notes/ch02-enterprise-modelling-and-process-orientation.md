# Chapter 2 — Enterprise Modelling and Process Orientation

**Source:** Weske, *Business Process Management: Concepts, Languages, Architectures*,
Chapter 2, the section titled "Enterprise Modelling and Process Orientation," supplied
as `books/Weske-BPM-Part 2.3.docx` (gitignored - copyrighted source material, not
committed). This section immediately follows "Enterprise Application Integration"
(covered in `notes/ch02-enterprise-systems-architectures.md`) - that file's own
coverage note flags this as the outstanding "second pointer to enterprise modelling /
process orientation." The docx's Word-paste section numbering does not reflect the
book's actual numbering, so this file does not assert a §2.x label - it is described by
title/position only.
**Series slot:** S02 — theory season.
**Coverage note:** this docx covers three subsections - Value Chains, Organizational
Business Processes, and Business-to-Business Processes - and ends on an explicit
forward pointer to Chapter 5 for the formal treatment of B2B process behaviour (¶219).
It does **not** reach workflow management. Per the prior notes file, workflow
management (§2.2 in Weske's own numbering) was already the outstanding cliffhanger
before this section was written up, and it remains outstanding after it - this section
is business-administration background running in parallel to that thread, not a
continuation of it. Treat this as still a partial Chapter 2; workflow management itself
has not yet arrived in any supplied source file.

---

## What the section actually does

¶2 is the load-bearing sentence and is worth reading literally before summarizing
anything else: *"In addition to developments in software architecture, business
administration also contributed to the rise of business process management. There were
two major factors that fuelled workflow management and business process
management."* The prior section (`ch02-enterprise-systems-architectures.md`) *is* the
first factor - the software-architecture lineage (OS → DBMS → GUI → ERP → EAI, a
coupling/decoupling story). This section is explicitly framed as the **second**,
independent factor: value chains (a way to functionally break down and account for a
company's activities) and process orientation (a way to organize those activities). The
two factors are parallel tributaries into the same river, not sequential steps in one
argument - the source itself names them as "two major factors," conjunction not
causation.

This matters for how a script would connect this episode to the previous one: this is
**not** "one more row" in the separation-of-concerns/coupling table the EAI section
built. It's a different discipline's origin story for the same destination (BPM). The
throughline concept from the prior section - each fix creates the next problem one
level up - does not obviously carry over here. If anything, this section's internal
throughline is different: **Taylorism's fine-grained functional decomposition, which
worked for industrial-era manufacturing, breaks down for modern information-heavy work
because of handover cost** - a critique of over-decomposition rather than a celebration
of layering. It is fair to note a family resemblance (both sections care about the
right *granularity* to draw a boundary at - value chains decompose into business
functions, layers decompose into subsystems), but the mechanism and the moral are not
the same, and the notes should not force a false parallel the source doesn't draw.

Structurally the section has three parts, of uneven weight:

1. **Value Chains** (¶4–77, Figs 2.9–2.11) — Porter's model: value systems, functional
   decomposition, primary vs. support business functions.
2. **Organizational Business Processes** (¶78–183, Figs 2.12–2.14) — process
   orientation's critique of Taylorism, the organizational-level BPM picture, and
   forms-based / landscape-diagram descriptions of top-level processes.
3. **Business-to-Business Processes** (¶184–219, Figs 2.15–2.16) — value systems
   realized as interacting processes across company boundaries, ending on a forward
   pointer to Chapter 5.

## Part 1: Value Chains (¶4–77, Figs 2.9–2.11)

**Origin and purpose (¶4–6):** value chains are Michael Porter's approach, from
business administration, to organize a company's work toward its business goals.
Quoted directly (¶6): "the configuration of each activity embodies the way that
activity is performed..." and "gaining and sustaining competitive advantage depends on
understanding not only a firm's value chain but how the firm fits in the overall value
system."

**Value system (¶7):** companies cooperate to fulfil business goals, so their value
chains relate to each other; the ecology of cooperating enterprises' value chains is
called a **value system**. Each value system consists of multiple value chains, one per
enterprise.

**Internal structure and functional decomposition (¶8–9):** a value chain has a rich
internal structure represented as a set of coarse-grained **business functions** (e.g.
order management, human resources), which can be broken down into finer-grained
functional units - a hierarchy of business functions at different granularity. This
breakdown process is **functional decomposition**, described as important for capturing
and managing complexity (example given: order management → obtain/store an order, check
an order).

**Fig 2.9 - value system (¶10–12, 33–34):** enterprise E (a manufacturer) at the
centre, cooperating with suppliers S1/S2 (raw material, incoming) and buyers B1–B3 via
channel companies C1–C3 (outgoing). ¶11 notes the diagram is always drawn centred on
"the enterprise under consideration" - if channel C1 were the subject, C1 would be
centred instead, with E as an incoming value chain. ¶12 is an explicit caveat worth
preserving: the left-to-right arrangement of value chains does **not** imply a formal
ordering of business functions - it's a loose communicative convention, not a process
model. ¶33–34 sharpen this: even though goods/information flow is drawn left-to-right,
the *interaction* that realizes a specific exchange (e.g. E ordering raw material from
S1) can originate in the opposite direction, from E to the supplier. Fig 2.10 (not
detailed further in the extracted text beyond this mention) enriches a subset of Fig
2.9 with directional interaction arrows to show this.

**Fig 2.11 - internal structure of a value chain (¶36–64):** Porter's term "activity"
is replaced with "business function" in this book for terminological consistency with
BPM. Functions split into two kinds:

- **Primary functions** (contribute directly to competitive advantage): Inbound
  Logistics, Operations, Outbound Logistics, Marketing and Sales, Services - defined
  one by one in ¶65–74 (Inbound Logistics = supplier identification, contract
  negotiation, incoming goods/information management; Operations = producing the
  value-add product itself; Outbound Logistics = distributing manufactured products to
  warehouses/distribution centres; Marketing and Sales = market positioning and selling,
  e.g. running a campaign; Services = post-sale contact, problem handling, and feeding
  customer information back into future product development).
- **Support functions** (create the environment that lets primary functions run
  efficiently, ¶63): Firm Infrastructure, Human Resource Management, Technology
  Management, Procurement.
- **Margin** (¶64): the difference between resources invested and revenue generated -
  every function, primary or support, must contribute to it.

**Where Porter's model stops short, and why this book goes further (¶75–77):** explicit
and important - "Porter explains very well the functional decomposition of business
functions, he does not identify the role of processes, although processes fit very well
into the value chain approach" (¶75). The rest of the chapter's job (starting with Part
2 below) is to fill that gap: relate the business functions identified by a value chain
to *business processes*. ¶76 adds a granularity discipline: the granularity of business
processes should track the goals of the business function they support, so the
resulting picture of "the work the company does" is complete rather than arbitrarily
grained. ¶77 explicitly scopes the book out of Porter's broader business-administration
literature ("due to the technical scope of this book, these extensions... are not
discussed in detail") - value systems are presented as *context* for BPM's
business-administration lineage, not as a topic the book develops further itself.

## Part 2: Organizational Business Processes (¶78–183, Figs 2.12–2.14)

**Origin (¶79–81):** early-1990s process orientation, credited explicitly to Hammer &
Champy's *Reengineering the Corporation* (already introduced in Chapter 1 per ¶80's
back-reference). Business process reengineering (BPR)'s core claim: a company's
products/services are delivered *through* business processes, so radically redesigning
those processes - not the functional units that perform pieces of them - is "the road
to success."

**The Taylorism critique (¶82–85) - the section's sharpest argument:**

- Taylorism (Frederick Taylor): organize work by breaking it into small-granularity
  tasks performed by highly specialized workers. ¶82 credits it as genuinely successful
  historically - it "fuelled the industrial revolution."
- ¶83 explains *why* it worked in early manufacturing: assembly required few steps, so
  handovers between specialized workers didn't introduce delay, and tasks were simple
  enough that a worker needed no context about prior steps.
- ¶84 is the pivot: applying the same fine-grained functional breakdown to **modern**
  organizations fails, because modern process steps are interrelated and require
  **context information on the complete case**. Each handover now forces the receiving
  worker to acquire that context, and this handover cost is named as the central
  problem: "the functional breakdown of work in fine-granular pieces that proved
  effective in early manufacturing proves inefficient in modern business organizations
  that mainly process information."
- ¶85's resolution: combine small units of work into larger-granularity units to reduce
  handovers - but this requires **knowledge workers**, workers with broad skills and a
  broad understanding of their work's ultimate goal, not narrow specialists. (This
  directly echoes Chapter 1's knowledge-worker material per the ch01 notes file -
  worth flagging as a callback, not a new idea, if a script wants to use it.)

**Organizational-level characterization (¶86):** process orientation leads to
describing a company's operations via business processes, typically informal / plain
English at the top level. Named constraint: an enterprise should have **no more than
about a dozen** organizational business processes. Caution flagged directly in the
source: these are often drawn with the same symbols as value systems, but the two live
at different abstraction levels and shouldn't be conflated.

**Fig 2.12 - organizational-level BPM structure (¶87–91, 137–139):** the organizational
business processes sit at the centre, shaped by:

- **Business strategy** (¶87) - target markets, strategic opportunities, overall goals.
- **Information systems** (¶88–90) - drawn in the lower part of the figure, described
  as a resource/asset that knowledge workers use to perform larger-granularity process
  activities; the text notes some business processes are only possible *because of*
  information system support (a dependency, not just a convenience).
- **Stakeholders** (¶91) - external partners, customers, and personnel; influence runs
  in both directions (stakeholders shape processes, processes affect stakeholders).
- **Management, Organization, Controlling, Optimization** (¶137–139) - four ongoing
  activities surrounding the processes: management/organization cover identifying
  processes, assigning roles/responsible persons (including, optionally, installing a
  Chief Process Officer), and rollout; controlling measures key performance indicators
  (response time, throughput, error rate, cost savings named as examples) against
  business goals; optimization uses that measurement to find and fix shortcomings,
  feeding back into improvement.

**Sample organizational business processes for a manufacturing company (¶124–125):**
innovation process, product planning process, product development process, purchase
order process, service process.

**Fig 2.13 - forms-based description (¶126–136, 140–143):** organizational business
processes are described **as a black box** - textual/forms-based, not as an activity
graph. The worked example, "Product Development Process": responsible manager (Dr.
Myers), scope ("From: Requirements, To: Rollout"), type (Development Project), inputs
(Requirements Document, Project Plan, Budget Plan, Prototypes), supplier processes
(Product Planning Process, Innovation Process), results (an integrated, tested,
documented product), and customer processes (Order Management Process, After-Sales
Service Process). ¶143 makes an important definitional point: at this level of
abstraction, a business process is treated as a black box, so **Definition 1.1's
"activities with execution constraints" does not yet apply** - that granularity of
description only fits at the lower, *operational* business process level. This is
worth preserving precisely, since it's a direct link back to Chapter 1's Def 1.1/1.4
vocabulary and a caution against over-claiming what an organizational-level description
actually specifies.

**Fig 2.14 - process landscape diagram (¶144–145, 182–183):** shows organizational
business processes as blocks with dependency arrows between them (information transfer
or physical-goods transfer). The example landscape: Innovation Process → (prototype) →
Product Planning → (product innovation specification) → Product Development → (product
innovation) → Marketing → (customer order) → Order Management → (shipping); After-Sales
Service Process handles customer problems → problem solutions, feeding back in.
Stakeholders (e.g. customers, market) are drawn into the landscape too. ¶145 flags why
this matters practically: the *interfaces* between organizational business processes
need careful design, because unclear interfaces cause inefficiency - and these
interfaces get broken down further into the interfaces of the operational business
processes that actually realize each organizational one. ¶183: a company's externally
visible behaviour, specified at exactly these interfaces, is "to a large extent
responsible for the commercial success of the company" - interfaces aren't incidental,
they're where the business actually meets its environment.

## Part 3: Business-to-Business Processes (¶184–219, Figs 2.15–2.16)

**Motivation (¶185):** the business case for interacting business processes comes
directly from value systems (Part 1) - value systems represent collaboration between
multiple companies' value chains, and those high-level collaborations are *realized* by
interacting business processes, one process per company, in a B2B scenario.

**Worked example (¶186–218, Figs 2.15–2.16):** a Buyer, a Reseller (detailed as
"Reseller-B"), a Manufacturer, and a Payment Org. Fig 2.15 shows the value-system-level
picture; Fig 2.16 details it into actual process interactions. Per ¶194, **Reseller-B
acts as a virtual/intermediary company**: it forwards the buyer's payment information to
the Payment Org and forwards the product request to the Manufacturer, who then ships
products directly to the Buyer. The activity labels recovered from the figure fragments
(Place Order/Invoice/Product Request, Send Order, Receive Invoice, Send Invoice, Receive
Products, Send Products) sketch each party's side of this - consistent with, and a more
elaborate B2B version of, Chapter 1's Reseller/Buyer running example. ¶194 explicitly
notes the correspondence: each value chain in the Fig 2.15 value system has a matching
participant in the Fig 2.16 B2B collaboration, detailing that value chain's internal
structure and contribution.

**The open problem (¶195–196) — this is the section's real payoff and its forward
pointer:** how do we know a B2B process assembled from existing business processes
actually meets its requirements? Structural criteria are named as an example concern
(absence of deadlock). The problem is sharpened immediately: **internal business
processes are a valuable enterprise asset, so companies generally do not want to expose
them to the outside world** (¶196).

**Consequence, stated directly (¶219):** because internal processes stay private,
"the properties of the overall business-to-business collaboration cannot be based on
the actual detailed local processes run by the enterprises, but rather on the
**externally visible behaviour** and the associated models to represent it." The
section explicitly defers the formal treatment: "There are different approaches to
tackle this problem, some of which are discussed in Chapter 5." This is a genuine
forward pointer, not a topic this section develops - consistent with how the prior
notes file treats its own forward pointers, this file does the same and does not build
out Chapter 5 material.

Worth flagging as a thematic echo, not a claimed source connection: "reason about
externally visible behaviour, not internals" is the same shape of idea as
orchestration-vs-choreography from Chapter 1 and as "specifies subsystems' externally
visible behavior, not their internals" (Definition 2.1, from the EAI section). The
source does not draw this connection explicitly in this section - it belongs to the
notes-writer's synthesis, not to Weske's own text - so any script built on it should
treat it as a connective observation, not a quoted claim.

## What this section does NOT cover / forward pointers

- **Workflow management** is still not reached. Per the prior notes file, the EAI
  section ended pointing at workflow management (as "process specifications as
  first-class citizens") as its unresolved cliffhanger. This section runs in parallel
  as the *second* contributing factor (business administration) rather than continuing
  that cliffhanger - so after both sections, workflow management itself remains
  entirely outside the supplied source material. Do not build a workflow-management
  episode from either notes file.
- **Formal B2B process behaviour / interaction correctness** (deadlock freedom, etc.)
  is explicitly deferred to Chapter 5 (¶195, ¶219). Not covered here beyond naming the
  problem.
- **Extensions to Porter's value chain model** are explicitly scoped out by the source
  itself (¶77) as outside "the technical scope of this book."
- Fig 2.10 (interaction arrows enriching a subset of Fig 2.9) is referenced (¶35) but
  its content is not independently detailed in the extracted text beyond what ¶33–34
  already describe.

## Candidate teachable ideas (raw list, to be turned into concept cards)

1. **Two independent origins for BPM, not one lineage** — this section (business
   administration: value chains + process orientation) and the EAI section (software
   architecture: coupling/decoupling through OS→DBMS→GUI→ERP→EAI) are named explicitly
   in ¶2 as "two major factors" that separately fuelled workflow management and BPM.
   A script connecting these two episodes should frame it as two rivers converging, not
   as a continuation of the same argument.
2. **Value chain vs. value system** — a value chain belongs to one enterprise; a value
   system is the ecology of multiple related enterprises' value chains cooperating
   toward each other's business goals. Easy to blur; the distinction is precise in the
   source (¶7).
3. **Value system diagrams have no formal ordering semantics** — the left-to-right
   arrangement (Fig 2.9) communicates an overall impression, not a process model;
   actual interactions can run opposite to the drawn flow (¶12, ¶33–34). A good
   "don't over-read this diagram" caution, structurally similar to the EAI section's
   caveat about Fig 2.1 being simplified.
4. **Primary vs. support business functions, plus Margin** — primary functions
   (Inbound Logistics, Operations, Outbound Logistics, Marketing & Sales, Services)
   directly build competitive advantage; support functions (Firm Infrastructure, HR,
   Technology, Procurement) create the environment that lets primary functions run
   efficiently; Margin is what's left over. Fig 2.11's layout is a strong visual
   candidate.
5. **Porter maps functions but not processes — this book's whole added move is
   supplying that missing layer** (¶75–76). A clean "here's the gap, here's what fills
   it" beat.
6. **The Taylorism critique** (¶82–85) — fine-grained functional decomposition worked
   for early manufacturing (simple tasks, no context needed between handovers) and
   fails for modern information-heavy work (each handover now requires context on the
   whole case). The fix is coarser-grained work units run by knowledge workers with
   broad understanding, not narrow specialists. This is the section's strongest,
   most self-contained argument and probably the best single candidate for an episode's
   emotional/logical core — it has a clear villain (naive fine-grained decomposition),
   a clear mechanism (handover cost), and a clear resolution (knowledge workers +
   coarser process granularity).
7. **A dozen-or-so organizational business processes, described as black boxes, not
   activity graphs** (¶86, ¶140–143) — an organization deliberately does NOT decompose
   its top-level processes into activities; that granularity is reserved for
   operational business processes. Directly ties back to Definition 1.1/1.4 from
   Chapter 1 ("this definition is appropriate at a lower level of abstraction," ¶143) —
   good opportunity for a callback beat.
8. **Fig 2.12's four surrounding forces** (business strategy, information systems,
   stakeholders, and the management/organization/controlling/optimization band) as the
   shape of "what an organization-level BPM practice actually consists of," beyond just
   the processes themselves.
9. **Interfaces between organizational business processes are where commercial success
   actually lives** (¶145, ¶183) — unclear interfaces cause inefficiency; externally
   visible behaviour at those interfaces is explicitly called out as largely
   responsible for a company's commercial success. Sets up the B2B section's payoff
   naturally.
10. **B2B collaboration must be judged by externally visible behaviour, not private
    internal process detail** (¶195–196, ¶219) — companies won't expose internal
    processes, so B2B correctness properties have to be specified over behaviour models,
    not the real underlying implementation. A thematic (not source-stated) echo of
    orchestration/choreography (Ch. 1) and Definition 2.1's externally-visible-behaviour
    framing (EAI section) — flagged as a notes-writer synthesis, to be verified/decided
    by later roles rather than asserted as the book's own claim.
11. **Reseller-B as an intermediary/virtual company** (¶194) — a concrete, reusable B2B
    topology (Buyer / Reseller-B / Manufacturer / Payment Org) that extends Chapter 1's
    simpler Reseller/Buyer example into a multi-party setting.
