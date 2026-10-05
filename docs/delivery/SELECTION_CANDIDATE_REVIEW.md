# C06-S1 preliminary source / QA workflow review

Independent focused review2026-10-06 IST of actual selection.js, app integration, HTML/SVG/CSS/worker and QA workflow. No executable tests, source edits, deployments or paid model calls performed. Pure selection8-pass claim is independent QA's reported result, not browser evidence or this reviewer's execution.

## Current verdict

**Candidate evidence collection remains conditionally permitted; do not push/trigger the currently inspected workflow until its selection scope correction below. No final candidate/deployment acceptance yet.** Two targeted source/workflow findings must be included in the bounded initial correction packet. No broad design/native/storage rewrite required.

## Material findings

1. **SVG visibility is not reliably reflected.** selectionUI assigns `box.hidden` and `line.hidden` on SVGElement, while source rect/polyline contain initial `hidden` attributes. That property is not the reflected HTMLElement.hidden API for SVG; the attribute can remain stuck while code reads a false expando. Use explicit attribute toggling with a scoped CSS `[hidden]{display:none}` rule for overlay children. Actual browser evidence must assert visible bounding box/lasso stroke and hidden-after-clear/cancel state, with screenshot/pixels or computed visibility; reading the same JS expando cannot prove visual success.
2. **Current workflow is still the old batch.** Actual `.github/workflows/browser-workspace.yml` triggers only preview/drawing-workspace-2026-10-04 and runs only the preexisting model/browser commands. Add the exact current preview/vector-selection-2026-10-06 branch and independently authored selection.test.mjs/selection.browser.cjs commands. Preserve all original16model/15browser assertions. If the suites require different fixture server state, explicit bounded stop/restart must retain a cleanup trap for the actual PID and readiness checks; don't let suite startup race or background servers leak. Hash receipts must bind new files and lock. Existing readonly token/pinned actions/npm-ci lock/10-minute timeout/no-deploy/evidence-only scope is acceptable.

Parent reports QA static inherited W12 update-status text mismatch. Preserve the inherited actual active-gesture/update safety expectations; a message compatibility correction may be included in this source batch, but changing tests to a weaker safety assertion is not permitted. QA must classify exact discrepancy and preserve evidence. This report does not invent a runtime failure from a static message concern.

## Focused source assessment

Pure lasso geometry validates polygon IDs/numeric bounds/area, includes centreline edge crossing and collinear boundary checks, and has an atomic200000 comparison ceiling. Clipboard deep-copy validation recomputes bounds; delete/move/paste use full board validation and one model command; capacity/coordinate failures do not partially commit. Cut constructs new clipboard before delete and publishes it only after successful command. Pointer move uses frozen document/view/selected IDs; release endpoint calculation exists; canceled/blurred previews leave underlying history unchanged. SVG avoids adding canvases. Worker caches new selection.js and has a new version; safe update refuses active gestures/contacts. No new system clipboard/network/credential/import attack surface is introduced.

No additional proved material blocker was found in this bounded static inspection. This does not prove real browser rendering, copy across boards, saved reopening, stale-layer protection or performance. Model/render/storage remain outside allowed changes; verify their baseline bytes unchanged before first CI. SelectionBounds/preview validates potentially large boards frequently; actual selected-workload timing must be reported under existing prototype bounds, not assumed buttery.

## Required next evidence

After correction and independent QA final fixture files, a curated branch push for QA-only execution is permitted once actual corrected workflow is inspected. Independent browser must execute visible lasso/Move/Copy/Cut/Paste/Delete/Clear, release endpoint/cancel/blur, touch exclusion/frozen view, across-board session clipboard, save/reopen/history, active-gesture worker refusal and phone/tablet controls plus all workspace/storage/offline regressions. Actual source/browser/lock/fixture identities bind results. No same-expando-only SVG proof, no direct-model-only replacement for UI journeys.

New C06-S1 cap remains2repair/<=3CI attempts; old WB1/WEB-F1/P0 history unchanged. Record exact initial correction batch consumption when Builder applies it; no relabeling a repair as untouched construction. No deployment until independent actual QA result and Gatekeeper final candidate acceptance with immutable source workflow. G14/production/mainfalse;0/14 full checkpoint closures.

## Fresh pre-CI recheck after repair1

Actual source now reflects SVG visibility via toggleAttribute, with existing global[hidden] CSS ensuring hidden display. Update safety message compatibility is corrected. This is recorded as C06-S1 Builder repair1/2, not a reset of WB1.

Fresh actual workflow now includes exact selection branch, both model/selection unit files, unchanged workspace browser suite, explicit kill/wait plus restarted fixture server, separate selection-browser suite and cleanup trap referring to the current PID. Pinned actions/npm lock/read-only token/10min/evidence-only/no-deploy controls remain intact. **Corrected QA-only workflow and curated initial source/QA push are permitted once independent QA finalizes its files.** Local model/render/storage bytes independently match the prior workspace candidate copies; no unauthorized change to these frozen modules found.

QA-only fixture precision issues observed while files were being finalized: SVG assertion still briefly read `e.hidden` instead of actual reflected attribute/computed visibility, and an exact Hide role locator omitted the layer-name aria-label. Independent QA must correct these locators/visibility observations while retaining the visual/hidden-layer expectation; application source is not changed for a stale fixture. Do not interpret those unrun fixture issues as application failures or consume another Builder cycle. Actual browser result and exact final hashes remain pending; no final acceptance/deployment.
