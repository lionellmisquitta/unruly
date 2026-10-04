# WB1 independent adversarial QA plan

Fresh isolated same-model QA fallback separate from Builder. Contract WORKSPACE_BATCH_CONTRACT.md read before source. No paid subprocess/models, no application repair by QA. Runtime-backed tests only after independent Gatekeeper code permission. Existing WEB-F1 failures/repair count preserved; WB1 budget2 diagnosed source repair cycles, <=3 branch CI attempts10min.

## Fixtures and expected observations

Synthetic unique IDs, original copied documents and known coordinates/pressure. Geometry fixture horizontal stroke x0..100,y0 pressure0..1 crossed by visible strokes atx25/x75, with hidden/zero-alpha/inactive/collinear/tangent/self-crossing variants. Partial radius5 capsule sweeps and point/stroke bounds. Dots and widely separated sparse movement. Positive/zero alpha: strokeopacity0.5 on layeropacity0.5 should composite once to0.25 on uniformwhite; crossing segment does not multiply strokeopacity. Original brush pixels compared in identical size/path/colour/opacity boxes; deterministic pencil/airbrush replay. Pattern seed/spacing/grid anchored document coordinates. Exported schema and actual storage queried independently.

V1 fixture in actual unruly-foundation IDB includes known pen pressure/null, two boards/current/previous/metadata; retain canonical complete record/meta bytes before and after migration. Fresh workspace DB copy must preserve source and idempotence. Version2 import duplicate IDs yields new identities, never overwrite. Malformed/unknown version/oversize import remains harmless. Inject QuotaExceededError at actual IDB write boundary, clearly simulated fault; conflicts use real same-origin pages/stale dbRevision. No hosted server database/API/Drive/AI runtime exists, so those tests N/A; actual IDB obligatory.

## Coverage groups

1. Model schema limits/IDs/metadata/version/pressure/finite coordinates; rejected commands preserve originals.
2. Immutable layer lifecycle, final-layer-delete refusal, active selection, reorder/name/visibility/lock/opacity undo/redo;100 history limit/new edit clears redo.
3. Whole eraser swept segment catches sparse-hit multiple strokes on active layer only; gesturecancel restores baseline.
4. Partial capsule cuts preserve parameter/pressure interpolation, freshfragmentIDs, no gapjoin; radius/documentzoom invariance, dots and limitcancel.
5. Intersection delimiters at25/75; missingbefore/after fallback, nonadjacentself; hidden/zeroalpha/inactive/collinear/tangent exclusions; repeatedgesturebaseline, boundary epsilon, exact undo/cancel.
6. UI desktop/tablet360 controls reachable; brush/opacity/size/colour actual subsequent stroke metadata + pixels;0opacity refusescommit; pointercancel/hover/touch/pressure and previous history retained.
7. Actual renderer brush signatures, deterministic replay, isolatedstroke/layer alpha, hidden/order pixel results; visible paper uniform/dots/grid/ruled/texture stability and seed variation.
8. Actual layer controls -> save/reopen metadata/ink; hidden/locked refuses ink/eraser visibly; layerdeleteundo restores precise strokeIDs/pressure.
9. Actual eraser gesture eachmode -> savedgeometry/reopen, oneundo transaction, cancelrestores, expandedradius/sparsity pressure cuts; test input synthetic CDP nothardware.
10. Actual v1 migration unchangedsourcebytes/idempotentcopy, quota/partialfailure notice and retainedsource; rollback data boundary explicit.
11. Actual v1/v2 JSON import newidentities + completevalidation +100board/8MiB limits; exportv2; invalid/quota conflict preserves prior board/in-memory exportrecovery.
12. Actual IDB concurrenttabs, last-good/bothcorrupt recovery, worker cachedoffline/update refusesactive/unsavedfailure and durablecommitbeforeactivation.
13. Synthetic renderer benchmark8layers/10000points desktop/tablet: p50/p95/max andscratchsurface count bound<=3; no physicalfeel claim. Captureconsole/source/browser/workflow/lock identity/screenshots. Severe stalls/memoryboundviolations block; measurementsreportedwithoutinvented devicebenchmarktarget.

Coverage may be grouped but no valid assertion skipped to obtain green. Source/platform unavailable is NOT_VERIFIED, never syntheticPASS. QA returns actual verdict/evidence to Gatekeeper; no production closure or publishing authorization from this plan.
