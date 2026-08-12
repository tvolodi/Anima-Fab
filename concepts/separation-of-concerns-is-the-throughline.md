---
id: separation-of-concerns-is-the-throughline
source: "Weske, Ch.2 §2.1, ¶4-8 (Dijkstra/Parnas framing) and ¶12-55 (OS/DBMS/GUI extraction)"
status: confirmed
---

## Claim

The chapter opens by naming its organizing principle explicitly: separation
of concerns (Dijkstra) — packaging related functionality into a subsystem
with a clear, stable interface — which enables both reuse and, more
importantly for this book, **response to change** (information hiding,
Parnas): a subsystem can be modified or swapped without touching the rest of
the system, as long as its interface stays stable. Every subsequent
"generation" in the chapter — OS extracted from applications, DBMS extracted
from applications, GUI extracted from applications, and later ERP, then EAI —
is the *same move* applied at a larger scale: pull a concern out, give it a
stable interface, let the rest of the system stop caring about its internals.

## Why it matters to a viewer

Without naming this up front, the chapter reads as a list of four unrelated
historical facts (OS, DBMS, GUI, ERP) instead of one idea applied
recursively. Once a viewer sees "extract a concern into a subsystem with a
stable interface" as the single move, they can predict the shape of every
later section — including the ones not in this source chunk (workflow
management as the *next* extraction, this time of the process itself). It's
the connective tissue that keeps the episode from feeling like a trivia
timeline.

## Still true?

(empty until reviewed)

## Notes from practice

(this is where corrections live)
