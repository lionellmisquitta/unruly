# UNRULY KGP handover

## Current baseline
- Primary accepted implementation: `checkpoint/u2-v0.5.0` at `fd15c607d5b9a605b1e8a1164250803832830591`.
- U1 accepted: `checkpoint/u1-v0.4.0` at `699d6fb29b2debe1ad3721a2c7a3ee86bd374792`.
- Browser-first, offline/local-first remains authoritative. `main` is not the implementation baseline.

## Accepted U2 behavior
- 12 original immutable presets: Pencil HB/2B/6B; Pen Fineliner/Technical/Brush pen; Marker Chisel/Round/Highlighter; Airbrush Soft/Firm/Mist.
- Two-column Brush Library, renderer-backed previews, per-preset size/opacity memory + reset.
- Optional v3 preset identity with family validation and bounded deterministic replay; no-preset strokes retain legacy rendering.
- Hue-ring + inner saturation/value colour disc, Hex/H/S/V, 12 generated shades, recent colours, saved palette and toolbar current-colour dot.
- U3/G02 gestures/shapes, Smudge and watercolour remain later scope.

## Verification
- U1: run 37468847640 — 35/35 model + 53/53 browser groups PASS.
- U2: run 37474125489 — 41/41 model + 58/58 browser groups PASS; artifact 11419065857; SHA-256 619a805dc99c3acca642e71f3873ec6e005432cc1d0a19cad5e26d563cd75d0c.
- Physical Surface/Xiaomi pen feel remains NOT_VERIFIED.

## Next continuation
Retrieve the `U3 core gestures and geometry` neighborhood plus U2 dependency evidence before coding. U3 is planned, not implemented.
