# Current checkpoint — PERF4 candidate

Base a973988ce0941542c2e60fcf4200b43f631ce40e; previous app dd233ee679077a1dbbb2fe631d4ba006dfa7cd85, CI38131565755 and Pages38132211243 verified SUCCESS. Read DECISIONS.md and .delivery/CHG-UNRULY-PERF4-1011/IMPACT_ANALYSIS.md.

Candidate: occupied upper-layer retained compositing beneath live ink; lower prefix/completed active layer retained in existing surfaces, individual upper rectangles composited in exact original blend order. Additional canvas pixels capped16MiB within combined80MiB, including transient dimensional setters. Readback/allocation failure reruns accepted replay. Explicit canvas2d backend and renderReference keep the fallback. Raw draw math, UI/model/saves/native main unchanged. Graph unchanged.

Verification pending:176 model tests /182 structured browser scenarios; new96 cases /192 cold-warm exact comparisons; transient allocations, errors, helpers/revisions/geometry, offline, existing30/32-layer benchmarks and all prior tests. Publish same existing URL only after verification and every-file byte checks. Physical tablet/sustained sessions remain NOT_VERIFIED.

Next after verification: raster painting/scalable smudge, then folders, masks, clipping/alpha lock, text/fonts, image/pattern import. User reordered magic wand and precision selection (magnetic selection, editable pen/path) before bucket, gap-aware and lasso/enclosure fill. HSL/levels and curves/blur follow. Later textured brushes/import feasibility/wet media, whole-canvas rotation, DPI/exchange/recording/sync/native optional. Layer cap32 remains; no standalone GPU backend or Rust rewrite introduced. Confirm explicitly before graph refresh.
