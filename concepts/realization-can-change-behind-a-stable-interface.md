---
id: realization-can-change-behind-a-stable-interface
source: "Weske, Ch.1 Introduction, ¶132-135, Reseller vs. Reseller-A (Fig 1.4)"
status: confirmed
---

## Claim

The book runs the same buyer against two different resellers. The original reseller
ships products and sends the invoice *concurrently*. Reseller-A does the same steps but
*sequentially*, and specifically refuses to ship until payment is received — a real
business rule (fraud protection) that changes internal execution. From the buyer's
side, the interaction (the choreography — see [[orchestration-vs-choreography]]) looks
compatible either way; only the internal timing changes, and Reseller-A's process
simply takes longer because less can run concurrently.

## Why it matters to a viewer

This is the concrete proof that "process" and "implementation" are separable layers —
an organization can redesign how it does something internally (reorder steps, add a
business rule, change systems) without breaking anything for the outside world, as
long as the externally visible message exchange stays the same. That separation is
what later makes flexibility and incremental improvement possible instead of every
internal change being a renegotiation with every partner.

## Still true?

(empty until reviewed)

## Notes from practice

(this is where corrections live)
