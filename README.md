# UNRULY

Ideas don’t stay in lines.

UNRULY is a browser-first drawing and infinite whiteboard application. **`main` is the authoritative cumulative browser product branch.** Use the existing [UNRULY page](https://lionellmisquitta.github.io/unruly/); drawing and local board storage need no account, and offline use is available after caching finishes.

## Current product

Pressure-aware vector brushes, global/per-brush pressure curves,0–100 size controls, brush comparison/recipes, raster round/soft painting and smudge, lasso and layer transforms, layer folders/blending, leaf masks, clipping to lower layers/folders, alpha lock, editable text with device font controls, PNG/JPEG image layers, repeated patterns and saved reference images are implemented. See [CURRENT_CHECKPOINT.md](docs/delivery/CURRENT_CHECKPOINT.md) for the exact tested source, limits and publication evidence. Physical tablet feel and50-layer workflows remain unverified; the current drawing-layer cap is32.

## Continue development

Read [CURRENT_CHECKPOINT.md](docs/delivery/CURRENT_CHECKPOINT.md) and [DECISIONS.md](docs/delivery/DECISIONS.md), then affected code/tests. Create bounded feature branches from current `main`, retain cumulative regression coverage, verify before merging, and publish only exact green candidate commits through `.github/workflows/browser-workspace-pages.yml` on `main`. Deployment remains pinned to a reviewed source SHA; a main push does not publish arbitrary untested application code. The same public page remains the only cumulative preview.

Next magic wand selection, then magnetic/pen-path precision selection. Magic wand and precision selection precede bucket/gap-aware/lasso/enclosure fills. Whole-canvas rotation remains deferred. Native history is preserved at `archive/native-main-2026-10-11`; native files retained for history are not the current product. Main promotion was explicitly authorized2026-10-11 and supersedes the earlier instruction to keep native main unchanged.

**Do not update/regenerate the knowledge graph without explicit user permission.** Routine builds update compact checkpoint/decision notes. Wait4–5 builds before proposing a refresh; permission is still required. Branch promotion is not another feature checkpoint.
