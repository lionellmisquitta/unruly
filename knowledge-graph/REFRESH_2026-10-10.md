# UNRULY current browser checkpoint

C04-B03 smudge is hosted and verified at https://lionellmisquitta.github.io/unruly/.

Source: 9942d7f57376d2f59929d74018aa7138ce4fd322 on CHG-UNRULY-B03-1010/smudge.
Cumulative QA: 38071117695 passed; 126 model tests and full Chromium suite.
Pages deployment: 38071676820 passed, including every hosted application asset byte comparison.
Native main remains cb1d52089c5cdd159050dc375b92750eb84d8271.

Smudge shares the paint catalog, has separate 0–100 size/strength and soft/round controls, pressure-aware strength, hold-to-transfer and cancellable finger gestures. It converts only the active layer to pixels; Undo restores vectors. Current raster limit: 1024 per dimension / 1 MP. Other layers retain their data. V4 smudged boards cannot open in older versions; export backups before rollback. Physical tablet acceptance remains unverified.

Proposed next checkpoint: raster capacity and layer masks. Exact scope remains to be locked. Planning estimate: 6–9 additional focused checkpoints for everyday personal drawing; approximately 12–20 for the full browser vision. Native packaging and proprietary compatibility feasibility are outside these estimates.

The full graph/archive on this repository is older and is not the current canonical baseline. This public update records the verified release only; the current full knowledge graph remains private.
