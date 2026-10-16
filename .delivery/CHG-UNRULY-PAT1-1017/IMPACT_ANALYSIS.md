# PAT1 bounded impact
Base: `f6810d25e4c86a01bb777d40840f66057eada19d`. Requirement: retained C05 pattern deformation. User authorized next build and graph refresh17-Oct-2026.

Observed: image-import.js repeatPixels yields ordinary <=1024 raster strokes. Selection preserves raster transforms; model.command clones, validates and stores inverse history. Renderer already replays raster payloads, folders/masks/clipping/effects; no engine/schema changes required. folders.layerState guards ancestry.

Target: one selected raster on active visible unlocked layer; four-corner perspective deformation inside its existing local rectangle. Existing imported patterns/images auto-select on import. Source, affine transform, ID and other strokes preserved until Apply; one existing command replaces pixels only. No new version, no new source asset format, no persistent editable mesh. Repeated Apply resamples current pixels; Undo restores source. Existing masks/clipping/effects remain document-space composition. Alpha-lock enabled target refused: deformation changes alpha. Reference excluded. Native JSON and clipboard use existing raster payloads.

Contract/regression: raster validation/codec,32layers/8MiB board/16MiB history/80MiB renderer, layer ancestry, cached/reference renderer parity, persistence/offline assets. No capacity increase. Hidden/locked layers and stale board revisions refuse atomically. Full-board result preview uses existing renderer via injected callback, not new renderer logic.

Excluded: freeform mesh/liquify, garment auto-fit/segmentation, proprietary formats, wet media, export/video, graph engine/skill changes. Graph catch-up is explicitly authorized separate maintenance following verified build. Logical dependency map only; no AST extraction claim. Rollback: revert PAT1 source/assets; resulting raster boards readable by previous app.
