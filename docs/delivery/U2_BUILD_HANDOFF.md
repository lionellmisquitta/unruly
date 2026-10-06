# U2 build handoff — Brush Library and Colour

Parent checkpoint: `checkpoint/u1-v0.4.0` / exact source `699d6fb29b2debe1ad3721a2c7a3ee86bd374792`.

Scope is intentionally limited to U2:
- 12 immutable original presets in Pencil/Pen/Marker/Airbrush.
- Two-column category/preset Brush Library with renderer-backed previews.
- Per-preset size/opacity memory in bounded device-local UI settings plus reset-to-default.
- Optional v3 stroke `preset` identity with family compatibility and deterministic replay budgets.
- Legacy strokes with no preset stay on the exact historical renderer path.
- CSS/SVG colour disc: outer hue ring + inner saturation/value disc.
- Hex/H/S/V accessible controls, generated 12-shade row, recent 8 colours, saved palette, toolbar current-colour dot.
- No U3 gestures, shapes or transform expansion.

External interaction reference rechecked 6 October 2026 against current official Procreate Handbook: Brush Library remains brush sets left / brush previews right; Color Disc remains outer hue ring with inner saturation picker and color history/palette are separate UI concepts.

Known non-claims:
- No copied Procreate brushes/assets/algorithms.
- No physical pen feel validation.
- No color-profile parity beyond browser sRGB.
- No Smudge/watercolour/raster engine in U2.

QA must independently test preset schema/category rejection, legacy pixels, deterministic distinct presets, replay/particle budgets, UI settings not consuming board history, colour synchronization/grey hue retention, recent/palette bounds, desktop/tablet/phone accessibility, offline/service-worker assets, and inherited U1/P01 regressions.
