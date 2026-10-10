# Bounded impact

Source app/test/config files verified against GitHub base tree 9c53ec1af4558a3d16a8bff4604eac77e192e503: 68 blobs, no mismatch. Renderer callers: app live draw/replay, thumbnails, brush previews, magnifier and smudge snapshots. Model owns validation/history; storage validates saves; selection owns scoped transforms. All are observed dependencies but remain unchanged.

Targets: new layered benchmark and QA workflow inclusion; compact project decisions/current brief. No UI, persistence, native or rendering behaviour changes. Existing benchmark suites and cumulative workflow remain mandatory. Unknowns: physical pen-to-display latency, total browser/GPU RAM, supported GPU backend on each tablet. 50 layers, groups/masks/patterns are target workloads, not current capabilities.

Risk: instrumentation and headless timings can distort conclusions. Time rendering without pixel readback/instrumentation; separately count operations; report runner/device details and distributions. Assert correctness and work budgets, not universal FPS. Rollback: remove new benchmark/docs and workflow inclusion; documents and assets are untouched. Self-verification only; no independent human approval claimed. No main merge or deployment requested by this tests-only checkpoint.
