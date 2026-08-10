---
id: model-vs-instance
source: "Weske, Ch.1 Introduction, Def 1.4 (¶51), reseller ordering-process example (Fig 1.1)"
status: confirmed
---

## Claim

A business process *model* is the blueprint (activity models + execution constraints
between them). A business process *instance* is one concrete case running against that
blueprint. The relationship is one-to-many: one model, many instances. In the book's
example, the reseller's ordering diagram (Fig 1.1) is the model; each individual order
that comes in and gets processed through it is an instance.

## Why it matters to a viewer

This distinction sounds trivial stated abstractly but is where a lot of imprecise
BPM talk goes wrong — "the process broke" could mean the model is flawed (wrong for
every order) or one instance hit an edge case (wrong for this order only), and those
demand completely different fixes. It's also the concept [[process-is-coordinated-not-a-list]]
needs before it can be operationalized: you can't monitor, mine, or improve "a
process" in the abstract, only instances of a model, aggregated back up to judge the
model.

## Still true?

(empty until reviewed)

## Notes from practice

(this is where corrections live)
