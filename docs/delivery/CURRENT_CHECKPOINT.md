# Current checkpoint — PERF3B candidate

Base bb4914e8360eebdb7d988be12ce5b1224d0b5826; previous tested app b81478be0c8affa06254bc61b58b693c0cbb4553, CI 38110423180 SUCCESS. Read DECISIONS.md and .delivery/CHG-UNRULY-PERF3B-1011/IMPACT_ANALYSIS.md.

Scope: compact inverse history, stable-ID layer/stroke ordering, vector/text/tile changes with exact full-value fallback; owned retained string fragments. Per-renderer decoded raster LRU with 8MiB accounted residency/512 entries, owned ASCII keys and collision byte checks, immutable diagnostics, reference bypass and release on reset/failure. Render math and UI unchanged. No persisted schema migration.

Acceptance: all previous 156 models/172 structured browser scenarios and layered benchmarks, plus 12 models and 5 browser scenarios; 168/177 totals. New cases cover independent full-snapshot history oracle, true byte/count eviction, sparse tile adds/removals/format transitions, exact cold/warm pixels at DPR1/2, fixed-budget cache pressure and oversized bypass, undo/redo/save/reload and offline modules. CI, artifact identity and publication pending. Existing cumulative URL only; main/graph untouched.

Limits remain 32 layers, 1024/1MP raster, 8MiB board, 100/16MiB history, five surfaces/80MiB backing. Raster cache adds at most 8MiB accounted retained data; temporary dense buffers and total browser/GPU RAM are separate. Commands still clone/validate/scan boards; full replay beneath outlines remains. No device speed claim, GPU, disk paging or viewport-only tile drawing. Physical tablet acceptance NOT_VERIFIED.

Next after verification: accelerated compositing/fallback investigation, bounded by populated benchmarks and the uncached reference. General paint, folders/masks/clipping, text/patterns/fills and later magnetic/wand/editable pen remain pending. Rollback to PERF3A keeps saved-board compatibility; older rollback must retain sparse reader. Graph unchanged; confirm before refresh.
