# UNRULY drawing workspace WB1
MIT. No install, server account, runtime packages or CDN. Serve these files under /unruly/ on HTTPS (localhost also works). Modules and offline caching require a web origin; opening index.html as file:// is not the delivery route.

Combined batch: size/opacity/hex/HSL/swatches/preview, plain/dotted/grid/ruled/textured paper, vector layers, original Ink/Pencil/Marker/Airbrush, whole/partial/intersection erasers, JSON import/export. Normal blending only. Stored in unruly-workspace; copies legacy unruly-foundation without modifying it. Old versions keep separate copies. Quota/conflicts require export/reopen; never clear site data to update. Undo session-only,100 states and16MiB serialized history cap. No Drive/AI/smudge/watercolour/clipping/raster/proprietary brushes yet.

3 reusable drawing surfaces +3 small preview surfaces (not allocated per stroke/layer). Main backing dimension4096/DPR2 caps. Brush resampling20000 dabs, geometry20000 partial samples/200000 comparisons, errors cancel/retain board. Real device handwriting/pressure is not certified by synthetic tests. Candidate-only until independent QA and Gatekeeper review.
