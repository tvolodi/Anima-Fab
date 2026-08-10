---
id: lifecycle-is-a-loop-not-a-waterfall
source: "Weske, Ch.1 Introduction, ¶139-211 (Section 1.2), Fig 1.5"
status: confirmed
---

## Claim

The business process lifecycle has four phases — Design & Analysis, Configuration,
Enactment, Evaluation — plus a continuous Administration & Stakeholders band underneath
all of them. The book is explicit that the cyclical arrangement shows *logical*
dependency, not a mandated temporal order: phases commonly overlap, and evaluation
(via process mining / business activity monitoring on execution logs) feeds discoveries
back into Design & Analysis, closing the loop rather than terminating the process.

## Why it matters to a viewer

The single easiest way to misrepresent this chapter is to draw the lifecycle as a
straight left-to-right pipeline (design → build → run → done) — which is exactly the
waterfall mistake the book is defining itself against. The feedback edge (Evaluation →
Design & Analysis) is the point: a deployed process is never "finished," it keeps
generating logs, which keep getting mined, which keeps reshaping the model. Any
animation of this concept has to render the loop closing, or it teaches the opposite of
what the chapter says.

## Still true?

(empty until reviewed)

## Notes from practice

(this is where corrections live)
