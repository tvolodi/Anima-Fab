---
id: orchestration-vs-choreography
source: "Weske, Ch.1 Introduction, ¶55-77, reseller/buyer example (Figs 1.1-1.3)"
status: confirmed
---

## Claim

Two fundamentally different ways multiple activities get coordinated. **Orchestration**:
one process, one central controller (the book's analogy — a conductor centrally
controlling musicians in an orchestra) with full visibility and authority over the
ordering of activities. **Choreography**: multiple independent processes (the reseller's,
the buyer's), each run by a different organization, that only interact by sending and
receiving messages — no central controller exists. The book's analogy: dancers who
agree on a choreography beforehand, then each behaves autonomously in line with their
own part during the performance. Same underlying coordination problem, opposite control
structure.

## Why it matters to a viewer

Almost every real business interaction — buyer/seller, company/supplier, service/client
— is a choreography, not an orchestration, and the two demand different tools. You can
verify and control an orchestration completely because one party owns the whole thing.
A choreography can only be *agreed upon* in advance (contracts, protocols) and then
trusted to hold, because no party can see or control the other's internal process. This
sets up why later chapters need a separate notion of "compatibility" between processes
that don't share a controller — orchestration correctness and choreography correctness
are different problems.

## Still true?

(empty until reviewed)

## Notes from practice

(this is where corrections live)
