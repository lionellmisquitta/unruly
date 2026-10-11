# UNRULY engineering decisions

Recorded 2026-10-11 (Asia/Kolkata). Approved direction; implementation status is separate.

| ID | Decision and rationale | Status |
| --- | --- | --- |
| D-P01 | Keep one cumulative application and the existing preview. Preserve native main and existing saved artwork. Incremental engine changes avoid discarding accepted behaviour. | Binding |
| D-P02 | Benchmark populated 30–50-layer artist workflows before expanding capacity. Current application cap is 32; 50 is a target, not supported today. | Binding; baseline completed (PERF1) |
| D-P03 | Separate document operations from rendering before replacing rendering internals. Keep a pixel reference path and compatibility tests. | Renderer boundary implemented (PERF2); backend replacement pending |
| D-P04 | Use sparse raster tiles, bounded residency/cache and changed-region undo. Small detail layers should store occupied areas and extend while painting. Neighbouring pixels are required for brush/filter boundaries; fills may travel offscreen. | Sparse persisted raster codec verified/published in PERF3A; resident cache and changed-region undo pending |
| D-P05 | Investigate GPU compositing with fallback. Rust/WASM is an option for measured CPU bottlenecks, not a wholesale rewrite or automatic GPU acceleration. | Approved direction; unimplemented |
| D-P06 | Preserve editable layers, folders, masks and clipping sources. Cached display composites may accelerate unchanged groups; permanent flattening is not the default. | Binding; folders/masks/clipping pending |
| D-P07 | Bring image references and clothing patterns alongside image import/clipping. Support repetition, scale/rotation, opacity and blending; deformation can follow. | Roadmap |
| D-P08 | Introduce cached image tips/grain and bounded splatter/sprinkle before sophisticated wet-media simulation. Watercolour appearance and pigment simulation are distinct capabilities. | Roadmap |
| D-P09 | Investigate proprietary brush import using representative files and an explicit supported-setting subset. Do not promise Procreate fidelity; image extraction alone does not reproduce brush behaviour. | Feasibility pending |
| D-P10 | Core artist workflow: sketch → outline → flats → shadows clipped to folders → group levels/HSL/curves → text. Painting, masks and fill require the performance foundation. | Product target |
| D-P12 | Magnetic selection, magic wand selection and an editable pen/path tool belong to later feature checkpoints; detailed selection/curve UX remains to be designed. | Roadmap; deferred |
| D-P11 | Keep a short current checkpoint brief and append consequential decisions. Read affected code/tests and relevant decisions only. Batch graph refreshes at meaningful milestones/handovers; explicitly confirm before each refresh. | Binding |

Roadmap groups, not fixed build counts: performance baseline; renderer boundary; sparse storage/undo; accelerated compositing; raster painting/smudge; folders; masks; clipping/alpha lock; text; image/pattern import; bucket fill; gap-aware fill; lasso/enclosure fill; HSL/levels; curves/blur. Later: textured brushes, import feasibility, wet media, precision tools/whole-canvas rotation, exchange/DPI, sync/recovery, timelapse, teaching and native feasibility. No target-device speed guarantee is established.
