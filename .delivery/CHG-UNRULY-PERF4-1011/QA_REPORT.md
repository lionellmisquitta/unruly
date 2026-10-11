# PERF4 verified QA

Tested source `293b605817adab5328ccc8717c4431a90367593a`. [GitHub Actions38136342498](https://github.com/lionellmisquitta/unruly/actions/runs/38136342498): SUCCESS. Same-session self-verification with real CI evidence; independent human/physical-tablet approval is not claimed.

Artifact11701845436 SHA256 `1959f31a0bd088ebc262fa11464abbaa18edc4f1e62d3e6242df491da20e1072` independently recomputed. All82 source/test/config hashes match reviewed local files and tested commit. 176 models, zero failures; all182 structured browser scenarios PASS across20 result files. Local176 models also PASS. Previous168/177 coverage retained with explicit contract adaptations below.

New compositor:96 distinct DPR1/2 cases,192 cold/warm exact-pixel comparisons, every8 blend mode, fractional pan/zoom, multiple upper layers, lower prefix, alpha1 raster edges, changing live ink and raster as last upper stroke. Warm frames replay zero completed strokes. Forced allocation/readback errors recover through exact full replay; explicit canvas2d fallback, six input changes, four helpers, reference/reset release PASS. Additional retained rectangles plus five stable stores stay within80MiB:189 native dimensional-setter snapshots, peak83,886,080 bytes. Zero-budget partial replay PASS. Offline module cached and warm mode layer-retained-hit. Existing sparse/dense and decoded-cache tests also PASS.

Populated comparison against verified PERF3B (CI38131565755), Linux Chromium151 headless runner; descriptive samples, not tablet latency:

| Fixture | Prior warm p50 ms | PERF4 warm p50 ms | Prior cold ms | PERF4 cold ms | Retained upper bytes |
| --- | ---: | ---: | ---: | ---: | ---: |
| 30 layers / 240 strokes, below | 512.2 | 53.9 | 515.0 | 614.9 | 75,168 |
| 32 layers / 800 strokes / 96,000 points, below | 1,754.6 | 63.6 | 1,707.3 | 1,816.5 | 910,656 |
| 30 mixed layers, DPR2, below | 965.8 | 109.1 | 966.2 | 1,239.1 | 555,004 |

All three below cases change from full replay (240/800/250 completed strokes each warm frame) to zero. Exact reference pixels remain PASS. Top-layer warm p50 remains about0.8ms atDPR1 and3.3ms for mixedDPR2. Cold admission costs more, especially DPR2; no60fps claim, physical device speed acceptance or whole-engine performance completion is established. Command CPU is outside this change; cache rebuild on board/view changes and full-viewport blending remain costs. No dedicated WebGPU/WebGL backend introduced.

Visual evidence: PERF1-layered-ui.png (populated art) and perf4-offline-cumulative.png inspected. Cumulative pen/touch/lasso/save/undo/redo/recovery/size/brush/migration tests remain green. UI/model/storage/native code unchanged. No saved schema migration. Layer cap32 stays.

Test adaptations: P01 middle case now requires zero warm replay and exact pixels while explicitly preserving the positive full-replay assertion and exact pixels on canvas2d fallback. Populated below cases require new retained mode and zero replay. Metadata-only upper tests retain old fallback classification; actual applied cache uses retained-upper-layers. Decoded-cache test selects canvas2d to preserve direct decode-hit coverage while compositor tests cover integrated skipped decoding. Offline tests track worker suffix. Accepted renderer oracle removes only a literal adapter block, constructor option and invalidate hook; original drawing/paper/blending/helpers retain accepted hash2d18d52d86589bac65e3ab9ab6fb1d0a296165b683c3d3aca256a66cd1d9e506. No correctness oracle or regression assertion removed.

Pre-publication refinements: legacy middle-replay expectation was adapted before final QA; scratch viewport restored after raster-on-top replay to prevent cache invalidation every frame, covered by exact matrix and native allocation checks. Superseded candidates were cancelled and not published. Artifact verification script tuple-key typo corrected and final checks rerun PASS; product CI was unaffected.

Retained upper images capped16MiB within80MiB backing pixels. Cold getImageData buffers, raster cache8MiB, undo/document data and browser/GPU overhead are separate; total RAM and sustained sessions NOT_VERIFIED. This is bounded Canvas2D retained compositing, with dedicated GPU feasibility still open. Rollback to PERF3B preserves saves/history schema. Knowledge graph/native main unchanged. User decision2026-10-11: magic wand and precision selection now precede all bucket/fill checkpoints. Compact repo records only.

See PUBLICATION_RECEIPT.json for actual deployment and30 hosted hashes. Later closeout commit changes documentation only, not separately tested app code. Next: raster painting/scalable smudge with bounded workloads and device measurements; do not infer50-layer support from these tests.
