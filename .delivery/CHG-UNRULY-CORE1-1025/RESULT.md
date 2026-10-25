# Core repairs — bounded implementation in progress
Base main: 2806fe13b10c3883f05a2dec7d52db23de65f870. Owner authorizes the findings agreed in the review, excluding disputed prescriptions. Existing roadmap and QA records preserved; no graph edits.

Scope: model/history/raster validation and history accounting; native and virtual-project save callers; pixel extent/patch rollover; hold-to-shape preference; lifecycle save request; affected tests and explicit CI registrations. No immutable snapshot rewrite, persisted history/schema change, release-workflow repin, or cache budget increase.

Decisions: deep validation stays the default for all external callers. Trusted edits/save request structural validation without repeated raster decoding. Board limit rises consistently to64MiB for edit/save/import/reload. Stroke count20,000; keep100,000 points per stroke to admit all formerly valid long strokes, remove aggregate point limit; preserve32 layers and100 boards. History remains16MiB until memory evidence supports a larger budget. Raster dimensions4096 but retain1,048,576 live pixels per patch; sparse wide patches fit, large-area patches roll over. Dense existing payloads <=1M pixels retained; do not permit16M live buffers. Raster and layer cache budgets unchanged. No promise of25ms or proportional edit cost with retained whole-board cloning/traversal. Background save is best effort, tested for durable completion, not guaranteed across browser process termination.

Before measurements (Node v24.22.1, shared host; exact supplied scripts on unchanged core sources):
```
board 1.33 MiB after 1 512x512 rasters: ink stroke commit = 31 ms, undo = 18 ms
board 2.68 MiB after 2 512x512 rasters: ink stroke commit = 31 ms, undo = 49 ms
board 4.03 MiB after 3 512x512 rasters: ink stroke commit = 75 ms, undo = 53 ms
board 5.38 MiB after 4 512x512 rasters: ink stroke commit = 66 ms, undo = 63 ms
board 6.72 MiB after 5 512x512 rasters: ink stroke commit = 137 ms, undo = 54 ms
raster 6 REJECTED: Document limit or invalid active layer
stroke at 1200 FAILS: Pixel region exceeds 1024 × 1024 · gesture cancelled
stroke at 3500 FAILS: Pixel region exceeds 1024 × 1024 · gesture cancelled
stroke at 4200 FAILS: Pixel region exceeds 1024 × 1024 · gesture cancelled
```

Regression obligations: unchanged history/no-op/Undo/Redo, malformed raster rejection under deep admission, same board64MiB guard everywhere, retained long strokes, sparse distant strokes, rollover source preservation, opt-in recognition and persistence, lifecycle flush and recovery/conflicts. Existing assertions retained except agreed numeric-cap expectations and explicit opt-in fixtures. Independent review not claimed. Rollback by reverting isolated branch. Status: local development; not merged/published.

## After measurements and local verification
Exact original benchmark scripts, unchanged, Node v24.22.1:
```
board 1.33 MiB after 1 512x512 rasters: ink stroke commit = 8 ms, undo = 5 ms
board 2.68 MiB after 2 512x512 rasters: ink stroke commit = 8 ms, undo = 9 ms
board 4.03 MiB after 3 512x512 rasters: ink stroke commit = 18 ms, undo = 17 ms
board 5.38 MiB after 4 512x512 rasters: ink stroke commit = 17 ms, undo = 14 ms
board 6.72 MiB after 5 512x512 rasters: ink stroke commit = 17 ms, undo = 17 ms
board 8.07 MiB after 6 512x512 rasters: ink stroke commit = 21 ms, undo = 22 ms
board 9.42 MiB after 7 512x512 rasters: ink stroke commit = 24 ms, undo = 26 ms
board 10.77 MiB after 8 512x512 rasters: ink stroke commit = 53 ms, undo = 42 ms
board 12.11 MiB after 9 512x512 rasters: ink stroke commit = 32 ms, undo = 46 ms
board 13.46 MiB after 10 512x512 rasters: ink stroke commit = 34 ms, undo = 43 ms
board 14.81 MiB after 11 512x512 rasters: ink stroke commit = 44 ms, undo = 39 ms
board 16.16 MiB after 12 512x512 rasters: ink stroke commit = 42 ms, undo = 40 ms
stroke at 1200 OK, payload chars: 262354
stroke at 3500 OK, payload chars: 262354
stroke at 4200 FAILS: Pixel region exceeds4096 px or1,048,576 pixels · gesture cancelled — start a new layer
```
The25ms target is NOT met at12patches; meaningful improvement at5patches, no claim of constant edit cost. Original blueprint is not adopted unchanged: the owner explicitly authorized only the recommendations agreed during review. Surface/input/render latency is not measured here.

Full local model invocation (all *.model.test.mjs and *.test.mjs):689 PASS,0 FAIL. All existing negative assertions are preserved or updated to actual new boundaries; aggregate-point rejection is replaced with per-stroke capacity admission while over-limit per-stroke rejection remains. Extra capacity paths include image import, clipboard and virtual-project backup. Exactly three new test files; each has explicit CI invocation. CI-contract's expected invocation list is extended; no original invocation removed. The renderer fingerprint normalizer accounts for the changed bounded snapshot guard while preserving its original baseline fingerprint and all pixel oracles.

Deep admission remains the default in model/raster/storage; only trusted command, Undo/Redo and native UI save opt into structural validation. Raw disk previous records still deep-validate. History byte sizes live in a WeakMap, not persisted board/history fields. Native save passes the immutable board reference to one store clone; revision conflict and previous recovery retained. Virtual-group history accounting reuses cached entry sizes; project disk validation remains deep.

Cache v10-20261025-core1 and exact offline test literals aligned; release pin unchanged. Browser test execution requires CI because local Chromium downloads were truncated. Cumulative CI pending exact candidate, one initial run intended. Existing roadmap/docs and QA evidence not deleted or rewritten.

## Cumulative regression repair before merge
CI40125856267 failed. Browser artifact inspection found a shared region-selection integration defect: snapshotLayer now accepts wide sparse paint extents, but polygon selection still requires1024px windows. Explicitly crop wide full-layer snapshots before polygon admission, preserving cropped complement/Undo. Keep snapshotRegion's original1024px selection-work boundary and renderer recovery assertion; it is a different contract from paint-patch dimensions. Existing deformation/large-region/path/Motion tests remain unchanged to exercise this repair. Foundation W11 test also hit Playwright's50MB inline-file transport cap; write its64MiB+1 oversized fixture to a temporary file, upload by path, and retain the exact size/error assertions. No runtime import threshold weakened.63 targeted checks pass before renderer guard correction; replacement cumulative verification required. No failed candidate merged.
