# Current checkpoint — PERF1 closed; PERF2 next

Base: a216d616f057a2ab1f3fb883e3788979291eda23, CHG-UNRULY-UX2-1010/layer-transforms-performance. GitHub QA 38077138430 and Pages 38077742013 verified successful before changes. Native main cb1d52089c5cdd159050dc375b92750eb84d8271. See DECISIONS.md D-P01–D-P11; do not reread the entire graph for this bounded checkpoint.

Goal: reproducible measurements and correctness checks for populated small-detail layers, dense ink, mixed raster/vector content, top-layer drawing and drawing below outlines. Distinguish CPU render duration, dispatched-input-to-next-frame scheduling, document/history bytes and pixel backing buffers; none is physical pen-to-display latency or total process RAM.

Acceptance: exercise 30 and 32 valid layers; reject 50 atomically without raising caps; compare renderer output against current reference for representative live frames; retain pressure data, blending, shared transforms and undo/save/reload; measure lasso without replaying unchanged artwork; record environment and workload counts; run existing cumulative QA plus new baseline. Report timings without flaky universal speed thresholds. Physical Surface/Xiaomi tablet measurements remain NOT_VERIFIED.

Out of scope: renderer optimisation, increased layer cap, schema migration, tiles, GPU/WASM, new painting tools, folders/masks, graph updates and new preview URLs. This checkpoint changes tests/docs/QA configuration only. Existing public preview app assets stay identical; no deployment is needed for identical app assets.

Next: use benchmark findings to design PERF2 renderer boundary. Keep masks/group fixtures as explicitly unsupported future workloads, not simulated current features. Later engine acceptance must include actual tablet feel and 50-layer workflows.

## Verified closeout

PERF1 engineering baseline PASSED at implementation 53f8628ba157954d0e5408516125198f4e1b7442; CI 38095617764 successful, 140 models + 154 existing structured browser journeys + 8 new baseline scenarios. Read .delivery/CHG-UNRULY-PERF1-1011/QA_REPORT.md for findings and baseline-results.json only for needed workload metrics. No app deployment or graph refresh. Physical tablet acceptance remains NOT_VERIFIED.

Next implementation scope: PERF2 renderer boundary/invalidation and work-region contracts, keeping the reference renderer and document compatibility. Main bottlenecks: full replay beneath outlines, viewport-sized per-stroke copies, whole-board history snapshots. Do not claim those bottlenecks are fixed by PERF1. Verify current GitHub heads/CI before the next mutation; the closeout documentation commit follows the tested implementation without changing its app/test/config identities.
