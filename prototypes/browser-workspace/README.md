# UNRULY drawing workspace WB1
MIT. No install, server account, runtime packages or CDN. Serve these files under /unruly/ on HTTPS (localhost also works). Modules and offline caching require a web origin; opening index.html as file:// is not the delivery route.

Combined batch: size/opacity/hex/HSL/swatches/preview, plain/dotted/grid/ruled/textured paper, vector layers, original Ink/Pencil/Marker/Airbrush, whole/partial/intersection erasers, JSON import/export. Normal blending only. Stored in unruly-workspace; copies legacy unruly-foundation without modifying it. Old versions keep separate copies. Quota/conflicts require export/reopen; never clear site data to update. Undo session-only,100 states and16MiB serialized history cap. No Drive/AI/smudge/watercolour/clipping/raster/proprietary brushes yet.

3 reusable drawing surfaces total; preview image reuses the same two scratch surfaces (none allocated per stroke/layer). Main backing dimension4096/DPR2 caps. Brush resampling20000 dabs, geometry20000 partial samples/200000 comparisons, errors cancel/retain board. Real device handwriting/pressure is not certified by synthetic tests. Candidate-only until independent QA and Gatekeeper review.

## Vector selection checkpoint C06-S1
Lasso with a pen or mouse on the active visible, unlocked layer. Select whole strokes, then choose Move and drag inside the dashed box. Copy, Cut, Paste and Delete selection each use the in-app clipboard; paste centres the copied strokes in the current view. Ctrl/Cmd+C, X, V and Delete work outside text fields. Every move, cut, paste or delete is one undo step. Escape cancels an active gesture. Clipboard and selection are page-session only; exports retain the unchanged v2 board format. Selection is cleared after board/layer changes or undo. Fingers continue to navigate. Rotation, scaling and individual vector-point editing remain later C06 work.

## Performance checkpoint P01 / preview v0.3.0

Retained live-stroke preview on the topmost visible nonzero-opacity active layer. Other layer-order cases use the full renderer. Completed ink is cached only while the immutable board/view/backing size is stable; commits, cancellation/full render, view/resize and brush samples invalidate it. Five fixed canvases have an80MiB nominal RGBA backing cap and<=4096 dimensions, with DPR reduced as required. This is not a total browser-memory or device-latency guarantee. Document, selection, saving and history formats are unchanged.

Run existing model/browser regression and independent performance.browser.cjs through the scoped GitHub Actions workflow. Reviewed publication requires exact pixel equivalence and paired performance evidence. Contract, development notes and version ledger live under docs/delivery. Browser preview remains quarantined until QA/Gatekeeper publication review.
