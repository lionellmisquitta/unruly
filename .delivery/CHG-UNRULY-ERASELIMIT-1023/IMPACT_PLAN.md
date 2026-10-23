# ERASERLIMIT1 — preserve completed preview at capacity
Base bbe3f624250ce7b747394f278171432a66949da9. User reports pen-button erase preview reverting during a long pass.
Confirmed source: sweep replays all segments against active.base; model rejects >2000 sweeps, >200000 comparisons or partial precision exhaustion. Catch unconditionally cancels the active gesture.
Allowed: app.js eraser controller, controller model regression, delivery records and three continuation docs. Prohibited: model limits, storage schema, renderer, graph, gallery branch and published workflow.
Change: when only capacity is exhausted, stop admitting sweeps, retain the last successful preview, and commit it on normal release as one Undo step. Genuine cancellation and noncapacity errors still roll back.
Checks: execute real sweep/finish functions against injected capacity failure, 2000-sample boundary, pointer cancellation and noncapacity errors; existing model eraser regressions. Browser device events remain unverified locally.
Rollback: revert scoped controller commit. Publication requires exact-source cumulative verification and release pin/cache preparation; this candidate is not published.
