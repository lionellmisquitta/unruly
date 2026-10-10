# UNRULY current cumulative preview

Live: https://lionellmisquitta.github.io/unruly/
Source: a216d616f057a2ab1f3fb883e3788979291eda23 on CHG-UNRULY-UX2-1010/layer-transforms-performance.
Cumulative QA: 38077138430 SUCCESS; 140 model tests and 154 structured Chromium journeys. Pages: 38077742013 SUCCESS, including every hosted asset byte comparison. Native main remains cb1d52089c5cdd159050dc375b92750eb84d8271.

Tablet UX2 adds exact indexed lasso, overlay-only lasso refresh, Ctrl/Cmd and 44px checkbox layer scope, shared layer-preserving transforms and two-finger selection pinch/twist/translation. Apply is one document undo; local Undo/Redo and Cancel remain. Partial-release cancel, third finger and blur restore the preview. Hidden/locked scoped layers reject the whole write. Copy flattens the page clipboard; Paste targets active drawing layer. Whole-canvas rotation remains deferred.

Dense fixture: 100,000 points, 512 polygon edges, 4650 exact comparisons, 71.3 ms on the Chromium runner, zero artwork replays while drawing the lasso. This is runner/fixture evidence, not physical tablet latency or proof of all maximum-size documents. Original 200,000 comparison cap and document/history/renderer limits remain. App assets are about 228 KB; no canvas surface was added.

Cumulative features retained through C04-B03 smudge and UX1: 0–100 size, pressure profiles, comparison, advanced recipes, active-layer smudge, held geometry with finger constraints, magnified touch picker and tablet transform handles. Persisted schema unchanged by UX2; v4 smudge still requires a compatible app. Physical tablet acceptance remains NOT_VERIFIED.

Read CONTINUE_IN_NEW_CHAT.md and HANDOVER.md, then the current canonical graph. Verify actual branch heads and CI before changes. Keep native main untouched; deploy only verified exact-source updates to this existing preview. Next proposed scope is raster capacity/layer masks before effects/fill; exact scope not locked. Planning estimate remains 6–9 focused checkpoints for everyday drawing, 12–20 for full browser vision; native packaging/proprietary exchange excluded pending feasibility.

Repository contains safe project release deltas and this current handover. The full current canonical graph is maintained privately; the older full repository archive is not current. No separate human merge approval or physical tablet validation is claimed.
