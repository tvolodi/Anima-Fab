---
id: each-fix-recreates-the-problem-one-level-up
source: "Weske, Ch.2 §2.1, ¶56-81 (ERP vs. siloed SCM/CRM), Figs 2.2-2.4"
status: confirmed
---

## Claim

Enterprise Resource Planning systems solved the data-silo problem *within* an
organization by reimplementing every departmental application on one shared,
centralized database — one copy of "customer," not five. But once new
best-of-breed systems (SCM, CRM), often from different vendors, entered the
market around 2000, the exact same silo problem reappeared **one level up**:
now it's ERP vs. SCM vs. CRM, each with its own database, redundantly storing
the same logical entity (a customer address is the book's running example).
The fix that worked for generation N recreates the same shape of problem for
generation N+1 — it doesn't make the problem disappear, it moves the boundary
outward.

## Why it matters to a viewer

This is the chapter's real argument, and it's easy to flatten into "here are
four systems, in order" trivia if the repetition isn't staged deliberately.
Seeing the *same* silo shape recur — first between HR/purchasing/production,
then between ERP/SCM/CRM — is what makes the later move to hub-and-spoke EAI,
and eventually to workflow management as an explicit process layer, feel
inevitable rather than arbitrary. It also sets up the emotional beat Weske
uses to make the abstraction land: a call-center agent who can only see half
a customer's status, and a customer who ends up feeling badly served because
of an architecture decision they'll never know about.

## Still true?

(empty until reviewed)

## Notes from practice

(this is where corrections live)
