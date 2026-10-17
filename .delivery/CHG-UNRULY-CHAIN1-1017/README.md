# CHAIN1 — Virtual Group contract slice

Base: main 15a48206d824b4f4afa3683a5a07b40b2fd59304. Current branch: CHG-UNRULY-CHAIN1-1017/virtual-groups.

Target: pure Virtual Group project manifest validation, switching, source revisions, snapshot identity/freshness and visible compositing order. Owner wants a single canvas and unified Layers hierarchy, not file navigation.

Allowed: prototypes/browser-workspace/virtual-groups.js, tests/browser-workspace/virtual-groups.model.test.mjs, .github/workflows/browser-workspace.yml (explicit test invocation), roadmap, continuation documentation, this scoped record. Prohibited: existing renderer, app.js, model.js, storage.js, history, native schema, production release, graph and skills. No protected path enforcement is claimed.

Regressions: CHAINM01 view/source-free active swap and ordering; CHAINM02 changed source stale proxy with unrelated upper unchanged; CHAINM03 stale snapshot refusal; CHAINM04 current refresh; CHAINM05 identity reject; CHAINM06 capacity guards; CHAINM07 explicit missing proxy. Cumulative QA must remain untouched except adding invocation.

Risk: metadata contract alone is insufficient for group UI, pixel-correct clipping/blend, safe local storage/recovery and per-group Undo. Do not mark feature complete or publish. Follow with bounded integration after testing.
