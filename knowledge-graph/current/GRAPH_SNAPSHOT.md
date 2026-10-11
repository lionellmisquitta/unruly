# Batch snapshot

Current cumulative PAINT1 source0ab2ab79f3c5e187e5e7f951a97c7c86814e6379; CI38140820796 SUCCESS:189 models/193 browser scenarios. Pages38141558508 SUCCESS;32 hosted assets verified. Main unchanged; physical device acceptance unverified.

- PERF1: 30/32-layer populated benchmarks and exact pixels; exposed full replay below outlines, expensive cold rendering and whole-snapshot history. Tests/docs only, no application deployment.
- PERF2: Canvas2D facade, explicit reference/fallback, invalidation and immutable diagnostics;64 facade/reference comparisons. Backend mathematics retained; no speedup claimed.
- PERF3A: Version2 omits zero64-pixel tiles when persisted JSON is smaller; exact version1 dense fallback/readers, hidden RGBA and affine geometry preserved. Bounded dense reconstruction remains.
- PERF3B: 8MiB accounted decoded-data LRU and exact inverse/changed-region history; broad geometry uses bounded snapshots.40 small commands retained3132 serialized history bytes versus32034040 full-snapshot-equivalent. Remaining command CPU overhead explicit.
- PERF4: Occupied individual upper-layer images preserve blend order under live ink; lower/active caches plus16MiB upper cache within80MiB backing cap. Warm below-outline replay zero; allocation/readback fallback exact. Cold priming and full-viewport compositing remain.
- PAINT1: Round/soft pixel modes share size/colour/opacity/pressure, preserve vectors/affine raster and merge eligible trailing native patch. Single native-raster smudge decodes/grows directly; mixed/vector layers retain reversible snapshot conversion. Stable live base, atomic gesture undo/cancel, adaptive pressure sampling and visible minimum tip; no wet-media solver.

Roadmap and unknowns: see HANDOVER.md.
