# PERF1 verified closeout

Completed 2026-10-11 (Asia/Kolkata). Tested implementation commit: 53f8628ba157954d0e5408516125198f4e1b7442. [Cumulative CI 38095617764](https://github.com/lionellmisquitta/unruly/actions/runs/38095617764) SUCCESS. 140 model tests, all 154 existing structured Chromium journeys and all 8 new PERF1 scenarios passed. All 68 artifact source/test/config hashes matched local files. Artifact 11685618968 ZIP SHA256: f89a53ffd5ed3d50a998a4ec5edf5a617160487003f4c27131460e22c76d0c9b.

Environment: headless Chromium 151.0.7922.34, Node v22.23.3, Linux x64, AMD EPYC 9V74, 4 runner CPUs, approximately 15.6 GiB runner RAM. Descriptive render-call timings, 8 warm samples per fixture; not physical pen-to-display latency, GPU-completion time or total application RAM. Pixel readback excluded from timed rendering. Full raw metrics: baseline-results.json.

| Fixture | Layers | Strokes / points | Warm p50 / p95 ms | Completed strokes replayed/frame | Renderer backing MiB |
| --- | --- | --- | --- | --- | --- |
| PERF1-small-top | 30 | 240 / 2880 | 0.6 / 0.9 | 0 | 15 |
| PERF1-small-below | 30 | 240 / 2880 | 384.2 / 385.6 | 240 | 15 |
| PERF1-dense-top | 32 | 800 / 96000 | 0.6 / 0.7 | 0 | 15 |
| PERF1-dense-below | 32 | 800 / 96000 | 1331.0 / 1349.4 | 800 | 15 |
| PERF1-mixed-portrait | 30 | 250 / 2930 | 2.5 / 2.9 | 0 | 60 |
| PERF1-mixed-below | 30 | 250 / 2930 | 708.0 / 712.0 | 250 | 60 |

## Findings and next action

- Every renderer fixture matched current reference pixels exactly. Top-layer cache hits replayed zero completed strokes; painting below visible upper layers replayed the whole board. Cold top-layer renders were still expensive (427 ms for small details, 1335 ms for dense ink).
- Source inspection: strokeToLayer clears/copies a viewport-sized intermediate for each vector stroke, even when marks occupy small areas. This and complete replay are confirmed work costs, not proof of a particular GPU/CPU backend on a tablet.
- Dense 96,000-point operations remain expensive: add approximately 134–157 ms, undo 91–95 ms, redo 99–132 ms, transform 162–177 ms in this run. Current history stores whole board snapshots; one snapshot is about 4.8 MB. Sparse changed-region history remains planned.
- 30-layer mixed-content actual UI: pen/Apply/save/undo/redo/reload passed; lasso drag caused zero artwork replays. Slow drawing activated the existing hold-to-shape draft. The test explicitly verified that the draft did not alter saved layers, then Applied it. First run 38095034391 failed because the test assumed pen release always commits; only that test assumption was repaired. No assertion or application behaviour was weakened.
- Current 32-layer cap and atomic rejection of 50/33rd-layer writes verified. Groups/masks/patterns remain unimplemented future workloads.

Next checkpoint PERF2: establish the renderer boundary and explicit invalidation/work-region contracts while preserving the current reference backend, accepted pixels, blend order, pressure and documents. Use this baseline as comparison evidence before introducing sparse tiles or acceleration. Do not raise document limits or rewrite in Rust to hide these costs.

Physical Surface/Xiaomi pen-to-display latency, long-session memory growth, total browser/GPU RAM and future 50-layer grouped/masked workflows remain NOT_VERIFIED. Ordinary inking targets 60 fps on chosen devices; this benchmark does not establish that target. Same-session self-verification; no independent human approval or configured branch protection claimed.

No application assets, schema or native main changes. Existing preview stays at source a216d616f057a2ab1f3fb883e3788979291eda23; no deployment for this tests/docs checkpoint. Knowledge graph unchanged. Subsequent closeout-only documentation commit contains no new app/test/config changes; CI evidence binds the implementation SHA above.
