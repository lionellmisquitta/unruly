# Independent WB1 scoped readiness review

Reviewed2026-10-04. Inputs: WORKSPACE_BATCH_CONTRACT.md and the user's explicit next-batch authorization reported by parent. Separate Gatekeeper role; no code, builds, tests, deployment, model subprocesses or additional agents. Review is proportional to this quarantined vector workspace; no broad interview/gate rescore.

## Disposition

**WB1 scope is coherent and CONDITIONALLY READY for quarantined implementation after the three boundedness corrections below. Until those exact contract corrections are recorded, no new application/test implementation is authorized by this review.** Once corrected, the named three internal slices may execute as this single reviewed batch with independent QA and one human review; no repeated paid review is needed merely to verify the specified document changes. A substantive scope change requires review.

Production/main/release authorization remainsfalse. G14 remains open.0/14 product checkpoint closures. Existing WEB-F1 repair1/1 and P0a2 history stay untouched; the distinct newly authorized feature batch has its own explicitly capped **2 diagnosed Builder repair/retests and <=3 branch CI attempts**, each<=10min. Zero external paid CLI/API calls. No cap reset by relabeling another failed execution.

## Three concrete corrections before code

1. **Partial erase precision:** current adaptive spacing can increase arbitrarily when a long path exceeds20000 samples; it can miss a thin swept region while reporting successful erasure. Preserve the stated maximum sampling step `min(2,radius/2)` and cancel the entire gesture if maintaining that bound would exceed the sampling/resource budget, or use bounded analytic segment/capsule clipping. Never silently widen sampling and call the result precise partial erasure. State finite numeric cut/interpolation tolerance and confirm fragments do not reconnect across the erased gap.
2. **Intersection work bound:**100000 retained points plus self/other-stroke crossing enumeration can require unbounded quadratic work on the UI thread. Add a named maximum comparison/work budget or bounded spatial index plus a checked cancellation/step budget. Budget exhaustion must restore original gesture snapshot and show explicit limit, not partially mutate the document or silently skip boundaries. The test plan must exercise exhaustion and prove no committed side effect/history/save.
3. **Measured render/history bounds:** 'fail severe stalls' is not testable. Adopt numeric thresholds for the specified synthetic workload/viewport/DPR, explicitly labelled prototype budgets rather than native feel certification, and specify a bounded history-memory policy in addition to max100 snapshots.100 snapshots of an8MiB board can retain roughly800MiB serialized data before object/canvas overhead. Limit accumulated serialized bytes/point counts and cap oldest snapshots while retaining current state and documenting undo-depth reduction. Include actual surface dimensions/count, benchmark p50/p95/max, undo eviction and save responsiveness evidence. Failure cannot be waved through by claiming a storage cap already bounds practical memory.

These corrections concern safety/performance of already selected behavior, not new features or user interview questions. Ordinary numeric defaults can be chosen by the Architect and stated openly for this measured prototype.

## Contract strengths accepted

- Explicit reachable size/opacity/in-app colour/sample controls, sensible invisible-ink0% policy, responsive labelled overlays, next-stroke-only controls and hidden/locked-layer refusal directly address user feedback.
- Version2 board/layer/stroke schema, layer-order/selection/delete rules and transaction/history semantics are specified. Layer opacity and brush opacity apply once to separate composition stages; only normal blend is represented.
- Repeatable seeded paper, original Ink/Pencil/Marker/Airbrush algorithms and replayable vector/stamp semantics avoid falsely claiming raster smudge/watercolour or proprietary assets.
- Three eraser modes have defined swept contact, intersection boundaries/tangency policy, style/pressure retention, active-layer isolation and one-operation/cancel behavior, subject to boundedness corrections above.
- Separate workspace DB retains foundation v1 bytes; migration copy is idempotent/non-destructive, lineage and mixed-version fork behavior are disclosed. Validated new-copy v1/v2 JSON import removes the former restore/import gap. Quota/conflict/current/previous corruption cannot become silent blank-save success.
- Safe pending-worker activation, explicit upgrade/rollback preserving both DBs/exports, immutable reviewed deployment and no main promotion are appropriate.
- Tests require actual IndexedDB migration/fault/concurrency, actual browser stroke pixels+metadata+reopen, alpha reference pixels, all eraser/history cases, import and offline/update. Hosted backend N/A is honest; no Drive/AI/server runtime exists.

## Permitted lane once corrected

Named prototype/browser-workspace files and independent tests only, branch-scoped QA workflow reviewed before triggering, bounded factual reports/state/graph appends. No autonomous advanced-feature queue. Emit independent QA handoff before execution; bind exact baseline/source/test/lock/browser identities. QA owns tests and cannot repair application source. Complete all three slices and actual independent executable QA before handing the combined workspace to the user.

Prepared Pages deployment remains a separate review after actual candidate PASS: immutable tested checkout, selected browser-workspace directory only, existing legitimately configured Pages environment, no root/native evidence/skills/boards/credentials published. No automatic first-CI deployment. Old candidate rollback must preserve both storage namespaces; never clear site data to make an update work.

## Closure and stop

Failures return to Builder only within recorded2-cycle cap. Stop/replan on further defect, changed scope, lost/corrupt user data, exhausted work budget or unstable actual runtime. Branch/candidate green is not merged-product regression, device feel or release closure. Surface/Lenovo/Xiaomi hardware input remains an explicit later human observation; synthetic pressure is labelled. One combined three-task human card comes after reviewed hosted WB1, not per-slice supervision.
