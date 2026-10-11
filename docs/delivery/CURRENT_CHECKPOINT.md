# Current checkpoint — PERF2 renderer boundary

Base 489a1a6b6f9cc58e534604fec72d608c78451789 (PERF1 closeout); verified implementation 53f8628ba157954d0e5408516125198f4e1b7442, cumulative CI 38095617764 successful. Native main cb1d52089c5cdd159050dc375b92750eb84d8271 unchanged. Read DECISIONS.md and the bounded PERF1 QA_REPORT; use raw metrics only for needed workloads.

Goal: extract the accepted Canvas2D backend behind render.js without changing pixels or document/UI contracts. Expose bounded, immutable frame diagnostics and explicit helper/caller invalidation. Current work region remains the full backing viewport; no tile or dirty-region acceleration is claimed. Frame metadata reads only layer state, never points.

Scope: renderer facade, extracted backend, frame contract, worker module precache, targeted unit/browser tests, existing QA workflow inclusion and compact records. Acceptance: byte-exact accepted backend extraction; original API/surface/budget preserved; direct-backend/facade pixels at DPR1/2 for all blends and raster/vector content; preview/thumbnail/magnifier/snapshot/failure invalidation; reference/cache recovery; unsupported backend rejection; offline module graph; full cumulative 147 models + existing 162 structured browser checks + 5 new boundary scenarios.

Exclusions: speedup claims, raised caps, schema/history migration, tiles, GPU/WASM, UI changes, masks, fills and new selection tools. Magnetic selection, magic wand and editable pen/path tool deferred (D-P12). Knowledge graph unchanged; confirm before a future refresh.

Next after verification: PERF3 sparse storage/bounded cache and changed-region undo design, using the renderer boundary. Whole-board replay beneath outlines and viewport-sized per-stroke copies remain present until their own measured implementation checkpoints. Physical tablet performance remains NOT_VERIFIED. Publish only the verified source to the existing cumulative preview; no new URL.
