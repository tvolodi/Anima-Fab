---
id: hub-and-spoke-relocates-coupling
source: "Weske, Ch.2 §2.1, ¶130-251 (point-to-point vs. hub-and-spoke EAI), Figs 2.5-2.8"
status: confirmed
---

## Claim

Point-to-point integration wires every pair of systems directly, which scales
as N×N (the book counts 15 links for 6 systems) and, worse, hardwires the
*sender's knowledge of the receiver* into each application's code — so any
change in the landscape means reprogramming interfaces. Hub-and-spoke
integration (via a message broker) doesn't remove that coupling, it
**relocates and declares it**: senders don't need to name a receiver, a
central hub evaluates declarative rules and routes the message. A changed
relationship between two systems becomes a rule edit at the hub instead of a
code change at N endpoints. But the coupling — the fact that these systems
depend on each other's data and behavior — hasn't gone away; it's now
concentrated in the hub's rule set, which can itself grow into a tangle of
interdependent rules that are hard to reason about.

## Why it matters to a viewer

It's tempting to present hub-and-spoke as "the fix" and stop there, but Weske
explicitly doesn't — the section names the hub's own failure mode (rule
interdependencies with unintended effects) and traces it to a root cause:
EAI, even centralized, still has **no explicit process model** underneath it.
It's programming and configuration, just consolidated. That's the setup for
the chapter's real destination (not in this source file, but the section
ends pointing at it): workflow management, which makes the *process itself*
— not just the message routing — an explicit, first-class, inspectable
artifact. Landing on "hub-and-spoke is strictly better and done" would blunt
that setup.

## Still true?

(empty until reviewed)

## Notes from practice

(this is where corrections live)
