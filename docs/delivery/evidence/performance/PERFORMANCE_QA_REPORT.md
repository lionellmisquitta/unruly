# P01 independent QA report

**PASSED for the bounded browser preview slice** on exact tested source `5bfe786d8018200b89049d1a8073a0eb78ab6077`, branch `preview/performance-foundation-2026-10-06`. This report does not close a production, main, merged, or physical-device checkpoint. Gatekeeper owns the publication decision.

Fresh isolated same-model Codex adversary fallback was used because Claude on the local laptop was unavailable. No paid external-model calls were made. Application source was not edited by QA.

## Actual execution and identity

GitHub Actions run 37396458278, job 112053501071, artifact 11383418553. Root separately verified artifact ZIP SHA256 `a926a703f52a583d4ca85947ce75f1a716a47c9b1678fd1ca68c645987260302`. Adversary independently read the extracted artifact, verified exact `commit.txt`, and recomputed all 21 source/test hashes against the repaired candidate. Chromium 151.0.7922.34; Node v22.23.3. Commands and actual output remain in `ci-2` and the test plan. No extra reruns after the passing run.

| Coverage | Passed | Failed |
|---|---:|---:|
| Inherited model |24|0|
| Inherited foundation browser |15|0|
| Inherited selection browser |6|0|
| Independent performance/browser groups |16|0|
| Total |61|0|

The suite proves 1,440 exact new-reference/frozen-baseline RGBA comparisons at DPR1/2 plus 1,620 exact cached/reference comparisons across brushes, papers, pressure, opacity, overlap and transformed views. Topmost eligibility and middle-layer fallback, board/revision/view/DPR/resize/full-render/sample/history invalidation, exception recovery, cancel/commit/save/reload, and existing persistence/selection/update safety passed. No pixel tolerance was introduced. Only four inherited fixed-surface assertions changed 3 → 5 under the amended contract.

## Measured results

Locked paired fixture: 8 layers, 10,000 completed points, four-brush mix, activeTOP L7, 128-point live ink,1440 × 950 CSS DPR1. Five warmup pairs then 20 measured pairs, alternating order, separate reference renderer. Adversary recomputed nearest-rank p95 from raw samples.

| Renderer CPU measure | Result | Limit |
|---|---:|---:|
| Cached live p95 |1.7ms|≤16.7ms|
| Reference p95 |83.1ms|paired comparison|
| Cached/reference p95 |2.05%|≤50%|
| Maximum five cold rebuilds |67.8ms|≤250ms inherited envelope|

Native width/height descriptor instrumentation tracked exactly five renderer-owned surfaces through 1024 × 4096 → 4096 × 1024 → 1024 × 4096. All 60 assignments and 64 snapshots stayed within 83,886,080 bytes (80 MiB); peak 80 MiB. Six desktop/tablet DPR 1/2/3 profiles, resize, 5000-square stress, fixed surface identity and final dimension caps also passed. These are nominal RGBA backing-pixel measurements, not full browser/GPU memory measurements.

Live penmove produced zero full-refresh and zero selection-bounds calls while scheduling paint. Start/end/cancel refreshed correctly, empty selections did not call bounds, pressure reporting remained, and synthetic coalesced pressures .31/.72 persisted.

## Retained defect history and repair

CI1 (run 37396036080, source `a3cda6ca13ce711b77a2eed24233aa3ae6958406`) passed its original 60 checks, but P01-D01 remained a proven PRODUCT_DEFECT: width-first portrait/landscape reallocation temporarily reached 134,217,728 bytes (128 MiB) against 80 MiB. Initial QA was FAILED and publication BLOCKED despite the green earlier suite.

Independent Node geometry probe on the immutable original renderer reproduced 128 MiB/FAIL; the repaired renderer probe returned 80 MiB/PASS. These probes run actual geometry with minimal canvas dimension setters and make no native pixel claim. Source repair releases all five old backing stores to 1 × 1 before reallocating. The added native Chromium setter regression now passes on the exact repaired source. Finding and CI1 evidence were retained; no test was deleted or weakened to obtain green.

Repair cycle 1; one source repair batch consumed; two of three allowed QA CI runs consumed. No unresolved defects or contradictions in this bounded slice.

## Remaining boundary

Renderer CPU timing is not physical pen-to-display latency. Physical Surface/Xiaomi feel remains NOT_VERIFIED. Main and production authorization remain false. No merged regression was performed or claimed; formal product checkpoint closure requires that separate work and physical feedback. Full exact result/source hashes are in `PERFORMANCE_QA_CHECKPOINT_RESULT.json`; deterministic data and traceability are in `QA_TEST_PLAN.md`.
