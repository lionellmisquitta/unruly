# C04-B03: smudge — revision 1

Base 8185ebf7e38d870c244c0be0ae9bcd01f179f3d1; current cumulative QA and Pages verified on October 10. Graph references GDEC-012, urn:unruly:checkpoint:c04-next, urn:unruly:release:browser-current.

Target: bounded raster smudge on active layer. Contracts: v1/v2 migration and v3 original pixel rendering remain; new v4 documents allow strictly validated RGBA raster strokes with affine matrices, explicit legacy-version incompatibility warning and JSON backup. IndexedDB store identity remains unchanged; conflict and recovery logic uses validateBoard and needs no migration. Sampling is document-space one pixel per unit, excludes paper and layer blend/opacity, which stay on the layer. Full active layer converts to raster only on a pigment-changing gesture; unchanged or cancelled strokes leave vectors intact. Undo restores all originals.

Callers: renderer replay, thumbnails and retained surfaces; model admission/history/import; lasso/clipboard/move/transform; whole/partial eraser; touch tracker, pen input and service worker. New raster operations must remain bounded by 1024 dimensions, 1 MP, 2048 dabs, 12 million pixel visits and existing board/history budgets. Existing 5-surface/80 MiB renderer contract remains. Intersection eraser remains vector-only and explicitly rejects raster; Partial/Whole support raster. Responsive toolbar wrapping threshold expands to 460px for the extra Smudge button. No masks/effects/sync/rotation/native paths.

Risks: raster conversion is a visible product tradeoff; physical stylus feel not verified. Fine vector editing on the smudged layer is replaced by raster editing, while other layers retain their model. Broad raster/large infinite-layer tiling is a later checkpoint. Alpha compositing and transforms require browser evidence. Rollback: pin preview back to base, export v4 backups before opening an older release; v3 originals remain accessible, no native changes.

## Evidence and revision 2

Candidate c18368674653f809dc167dac2cfc91dd54081896: smudge and all other browser suites passed, except UB01 across three layouts, whose undelivered-tool oracle forbids the newly implemented Smudge. Preserve its contextual Transform, target-size and overflow assertions; replace the Smudge prohibition with explicit enabled tool/popover/catalog checks. Smudge browser journeys exercise pigment/history/persistence/gestures independently. Tablet screenshots inspected. Bilinear premultiplied transport and a one-pixel edge feather remove nearest-neighbor hard-tip banding. Shared preset kind mapping, density/grain/spacing and narrower toolbar wrapping refined before release.

## Visual regression correction

The final hard-tip screenshot exposed repeated transparency notches at full strength despite behavioral QA passing. Use premultiplied source-over pigment transfer so smudging does not lift alpha from already opaque pixels; partial erase remains the explicit alpha-removal tool. Add opaque-pigment retention regression SM13 and rerun cumulative Chromium on the revised source.

Minimum-size boundary: document-space radius 0.5 must select the containing pixel on integer paths rather than leaving all pixel centers outside the circle. SM14 and real 0%-size browser movement/undo prove a functioning one-pixel sampler.
