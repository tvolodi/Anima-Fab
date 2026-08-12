---
id: org-processes-are-black-boxes
source: "Weske, Ch.2, 'Enterprise Modelling and Process Orientation' section, ¶86, ¶124-145, ¶182-183"
status: confirmed
---

## Claim

An enterprise should have no more than about a dozen organizational business
processes (¶86). Each one is described from the outside as a **black box**:
name, responsible manager, scope, inputs, outputs, and its supplier and
customer processes (the worked "Product Development Process" example) —
*not* decomposed into activities with execution constraints. ¶143 makes this
a deliberate abstraction-level choice, not an oversight: Definition 1.1/1.4's
"activities with execution constraints" from Chapter 1 does not yet apply at
this level; that finer-grained decomposition belongs to a lower level of
abstraction, operational business processes. What matters at the
organizational level instead is the *interfaces* between these black-box
processes — shown as dependency arrows in the process landscape diagram (Fig
2.14, e.g. Innovation Process → Product Planning → Product Development →
Marketing → Order Management, with After-Sales Service feeding problem
solutions back in). ¶145 states plainly that unclear interfaces cause
inefficiency, and ¶183 goes further: a company's externally visible behaviour
at exactly these interfaces is, in the source's own words, "to a large extent
responsible for the commercial success of the company."

## Why it matters to a viewer

This is a "don't look inside yet" beat that mirrors how a viewer should
actually read an org-level process diagram: the boxes are opaque on purpose,
and that's not a simplification to be annoyed by, it's the correct level of
detail for the question being asked at that level. It also relocates where
the drama is — not inside any single process, but at the handoffs between
them, which is a satisfying inversion for a viewer expecting the "interesting
part" to be internal mechanics. And it's a clean callback opportunity to
Chapter 1's process definition, made explicit by the source itself rather
than invented for the script.

## Still true?

(empty until reviewed)

## Notes from practice

(this is where corrections live)
