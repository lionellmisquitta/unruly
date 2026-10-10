# UNRULY current browser checkpoint

Tablet UX1 is hosted and verified at https://lionellmisquitta.github.io/unruly/.

Source: 22d43ffe2011870feffbbdfd4ccbeb9b1e7902e0 on CHG-UNRULY-UX1-1010/tablet-gestures.
Cumulative QA: 38073524003 passed; 133 model tests, 12 new actual Chromium tablet journeys, and all older browser suites. All 32 existing U3 gesture tests passed, including two-finger Undo whose first contact hits a transform handle.
Pages deployment: 38074115756 passed, including every hosted application asset byte comparison.
Native main remains cb1d52089c5cdd159050dc375b92750eb84d8271. Verification is self-review with real Chromium artifacts, not separate human merge approval. Physical tablet acceptance remains unverified.

Hold stationary 650 ms to snap a line, smooth curve, circle, ellipse or rectangle. Hold jitter tolerance is 14 CSS px; line recognition allows max(8 CSS px, 7.5% chord) with reversal rejection. Keep the pen down and drag to scale from the actual hold endpoint. One finger constrains line angles, ellipse to circle, rectangle to square, or curve to circular arc. Removing that finger before releasing the pen restores unconstrained geometry. Release enters the existing Apply/Cancel draft; Apply is one undo step. Geometry stays ordinary pressure-bearing points with unchanged persisted schema.

Stationary finger hold opens a magnifier, exact source marker, crosshair, hex and swatch. Drag updates the sample; release uses the final colour. Cancel or a second finger dismisses without changing colour. Empty Smudge layers still support the picker; moving fingers retain smudge behaviour. Magnifier reuses renderer scratch; five backing surfaces / 80 MiB remain bounded.

Lasso selection exposes Transform / rotate. Gold scale and blue rotation handles have 44 CSS px hit areas and use relative drag baselines. Numeric controls, Apply/Cancel and local/document undo remain. A second finger cancels a handle preview and routes the contacts into the multi-finger history gesture. Whole-canvas rotation remains deferred.

C04-B03 smudge remains cumulative: only the active layer is converted to pixels; Undo restores vectors. Current raster limit: 1024 per dimension / 1 MP. Other layers retain their data. V4 smudged boards cannot open in older versions; export backups before rollback.

Proposed next checkpoint: raster capacity and layer masks. Exact scope remains to be locked. Planning estimate: 6–9 additional focused checkpoints for everyday personal drawing; approximately 12–20 for the full browser vision. Native packaging and proprietary compatibility feasibility are outside these estimates.

The full graph/archive on this repository is older and is not the current canonical baseline. This public update records the verified release only; the current full knowledge graph remains private.
