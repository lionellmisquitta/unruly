# WB1 preliminary candidate / QA workflow review

Independent focused Gatekeeper review2026-10-04. Read actual workspace contract, QA-only workflow and model/render/storage/app/worker source. No tests/builds, source edits, deployment or external paid model calls performed. This is a pre-push evidence-collection disposition, not final candidate acceptance.

## Current disposition

The three prior readiness corrections are recorded: partial-step precision reject rather than adaptive coarsening;200000 eraser comparison bound with rollback;16MiB retained history plus measured render threshold. **Quarantined implementation lane remains permitted. Actual `.github/workflows/browser-workspace.yml` is acceptable for bounded QA source/fixture publication to `preview/drawing-workspace-2026-10-04`.**

Named branch/path triggers, contents-read only, pinned checkout/upload actions, no credential persistence, npm-ci lock,10-minute timeout, concurrency cancellation, explicit test-server trap, commit/source/lock receipts, evidence-only7-day upload and no deployment are present. No main, production, credentials/provider or root public publication. Branch base reported826f3de8257ba0ddd2e91529692137d5fa096afc must bind the eventual exact source receipt.

**Candidate acceptance/deployment is BLOCKED pending actual independent browser, migration/storage, pixel/geometry, offline/update and benchmark evidence.** Reported QA unit14/16 initially failed; tangent/finite-zoom repair1 and reported local16/16 need their exact receipts. This report does not substitute those receipts or mark browser outcomes passed.

## Repair aggregation / static findings

Builder repair1/2 consumed. Pending second repair must aggregate the diagnosed application findings, preserve independent assertions and remain within2-cycle allowance; no automatic third repair. The current inspected source confirms:

- Final pointerup does not append its final contact location or final erase sweep before commit; QA/builder already identified this.
- Opening a saved board does not persist selected-board metadata; loaded saved revision can skip a save. Builder identified this.
- Main and sample renderers allocate two sets of3 canvases, violating contracted global3-surface policy. Builder's proposed shared-preview reuse is appropriate, but must be verified by actual surface/alpha evidence rather than a comment.
- Pretty JSON export can exceed the8MiB import byte cap even for a valid compact8MiB document. Builder's compact export keeps the current cap coherent; independently test export/import boundary.
- **Additional current finding:** eraser sweep reads current `settings.size` and erase-mode on every move. UI controls can change during a captured gesture, so geometry/meaning changes mid-operation. Capture radius/mode at pointerdown and retain them for the entire gesture; control changes apply next gesture. Test mid-contact control changes, cancel, undo and export/reopen geometry. This is inside the already contracted gesture/control behavior, not a new capability.

Model validation already bounds non-ink replay dab counts; do not invent a separate missing replay-validation repair. Future static suggestions are not licenses to add features while repairing. If actual runtime uncovers additional app instability after repair2, stop/replan rather than reset cap, suppress coverage or extend CI attempts.

## Prospective deployment route

It is acceptable in principle to use the already legitimately approved `preview/browser-foundation-2026-10-04` Pages environment route for **a separate reviewed workflow** that checks out the eventual immutable tested workspace commit and uploads only `prototypes/browser-workspace`. This avoids administratively widening environment branch policy; it does not bypass evidence. Review the actual prospective workflow before activation; exact checkout assertion, pinned official actions, configure-pages enablementfalse, scoped Pages/OIDC permissions,10-minute timeout, selected artifact root and no main writes remain mandatory.

No Pages deployment is authorized by this preliminary report. Actual final independent QA PASS and Gatekeeper candidate disposition must precede activation. URL/source assets must then be independently verified. Preserve prior foundation rollback and both storage namespaces; no clearing site data. WB1 is an expanded quarantine workspace, not product release/G14 approval.

## State and evidence return

Retain original WEB-F1 consumed1/1 and P0a2 histories. Record WB1 repair1 now and eventual repair2 separately, actualCI attempts<=3, fixture fixes versus application defects, tested identities and truthful target results. Existing0/14 product checkpoint closures, G14open and production/mainfalse remain unchanged. After exact evidence, Gatekeeper assesses the combined candidate for one human batch handover. No unrelated feature queue or paid CLI/API calls.

## Repair2 static follow-up — actual initial CI preserved

Read WORKSPACE_REPAIR_2.md and repaired app/storage/render source. Initial CI37222940471 on652c239ad8ccbd282af2a1c4e99c94ca696b69e5 remains16modelPASS,12/14browserPASS with W03 final endpoint and W11 selected-board failures. Artifact11310344074 / SHA2564eed4224dccee5f88d8810a38b052dbfeb3890b6e1a6e3d0cb7c3d6cbf008059 is the reported initial evidence receipt, not a final candidate pass.

Static inspection confirms repair2 changes are present: pointerup location/final eraser sweep precede commit; eraser mode/radius captured once at contact; preview now reuses the existing two scratch surfaces with image output rather than allocating a second renderer; compact JSON export aligns with import byte limit; storage selection transaction exists. Actual tests must prove selection completion/reload, global3-surface behavior, endpoint/cancel and migration/quota/frozen-control paths. Source presence alone is not PASS.

All WB1 Builder source repair budget is now consumed2/2. The bounded actual retest may proceed with independent assertions and exact identities; no more application repairs are authorized from this report. QA-owned fixture/tooling defects, if demonstrated from actual evidence, are classified separately and cannot weaken application expectations or reset the source cap. Actual runtime failure requiring more app changes stops/replans.

Prospective immutable Pages workflow must use the **eventual passing retest source SHA**, which is not supplied yet and must not be guessed. It may be introduced on the existing owner-approved preview/browser-foundation branch while checking out that exact reviewed workspace commit and uploading only prototypes/browser-workspace. QA workflow remains non-deploying. No activation until independent actual QA + Gatekeeper final candidate disposition and actual workflow inspection. Preserve original rollback and bothDB namespaces.
