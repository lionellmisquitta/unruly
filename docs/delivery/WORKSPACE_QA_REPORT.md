# WB1 independent QA result

**AUTOMATED_CANDIDATE_PASS** for the quarantined browser workspace. Full product release remains blocked and production authorization remains false. This is isolated same-model QA, with tests authored separately from the Builder; no paid model calls or application repairs by QA.

Actual CI run **37223520128**, commit **80c5bbe86cde4c41a81e354f296ff5d203019888**, passed **16/16 model cases and 15/15 browser journeys**, without skipped model cases or uncaught browser errors. Chromium151.0.7922.34, Node22.23.3. All16 source/test/workflow SHA256 entries were independently reproduced; downloaded artifact11310983072 SHA256 independently matches `01f381c6457c3f58204b9578cef58b8176ebe841aa9a13a4d41fe932b8ee65ce`.

Coverage includes real controls changing subsequent ink, four distinct brush pixels, isolated stroke/layer transparency, paper patterns, layer persistence and undo, pressure/cancel/release endpoint, whole/partial/intersection erasers with frozen midgesture settings, three-canvas app bound, export/import validation and limits, actual IndexedDB conflicts/quota/recovery, unchanged v1 originals and interrupted migration restart, selected-board reload, offline reload and explicit update refusal during active/failed save. Pen input is browser CDP synthetic; quota faults are explicitly injected at actual IDB boundaries. Product server/API/Drive/AI tests are N/A because none exists in this batch.

The initial genuine failures remain in `evidence/workspace/initial-model-output.txt` and `evidence/workspace/ci-1/`: tangent intersection and finite zoom model failures, followed by omitted release endpoint and board selection persistence failures. Two application repair batches are consumed; two of three bounded CI attempts were used. Passing rerun retained original regression assertions and added global canvas, frozen gesture and partial-migration cases. No assertions were weakened to obtain green.

Renderer measurement on 8layers/10000points,1440×950,DPR1: p50 **54ms**, p95/max **62.7ms**, within agreed p95≤250/max≤1000ms bounds; three surfaces. This measures synthetic desktop replay. Tablet-device performance, pen latency, handwriting feel and physical pressure remain **NOT_VERIFIED**.

Screenshots independently reviewed: desktop brush results, 360px mobile controls, grid paper/two-layer opacity. They show the expected workspace and retained strokes; this is bounded visual review, not full accessibility certification. Hosted updated candidate and merged product regression remain NOT_VERIFIED. Gatekeeper owns preview promotion and closure. One combined human test card can cover controls/ink, paper/layers and all three erasers after verified preview publication.

Machine result: `QA_CHECKPOINT_RESULT.json`. Exact evidence: `evidence/workspace/ci-2/{browser-results.json,model-output.txt,renderer-benchmark.json,qa-source-hash-verification.json}`. Earlier failing receipts remain preserved.
