# Current checkpoint — CLIP1 completed

Verified app source `809602e23b1f575b7e3ebc33d8c6deac85c756f5`; [CI38154948945](https://github.com/lionellmisquitta/unruly/actions/runs/38154948945) SUCCESS: **220 models /216 Chromium scenarios /95 source-test-config hashes**. Read `.delivery/CHG-UNRULY-CLIP1-1011/QA_REPORT.md` and `PUBLICATION_RECEIPT.json`. Documentation closeout is not a newly tested app build.

Published to the same [UNRULY page](https://lionellmisquitta.github.io/unruly/): Pages38155923420 SUCCESS; all35 hosted assets match reviewed bytes. Preview pin `ba22c4191541969fbba4a61a3ba90888adee1f76`. Native main `cb1d52089c5cdd159050dc375b92750eb84d8271` unchanged.

Layers → row menu → Alpha lock or Clip to. Clipping references a lower leaf or nonempty folder and multiplies displayed destination alpha by source alpha (including source masks, clipping, visibility and opacity), before destination opacity/blend. Artwork stays editable; None unclips. Delete/reorder/ungroup that would invalidate a reference rejects atomically; unclip first. Import remaps references; Undo/Redo, reload and offline persistence verified. Thumbnails, selection/clipboard and painting read original artwork.

Alpha lock protects existing pixel coverage during paint and smudge. Vector/mixed artwork converts undoably to raster on its first locked paint gesture; Escape discards, one Undo restores prior artwork. Empty layer does nothing; native working region does not grow. This is coverage protection, not structural lock: erase/clear/transforms and mask editing retain their existing semantics. Mask edit remains separately labelled. Model tests preserve alpha byte-for-byte including partial coverage and transparent holes.

These flags introduce v7; v1-v6 readers remain and mask addition preserves7. Export/retain v7 before rolling back to an older reader.32 drawing layers/16 folders/eight ancestors and prior document/history/paint limits unchanged. Clipping uses cropped source alpha with8MiB limit, combined upper+clip caches16MiB within80MiB backing limit; visible cache exhaustion asks to zoom out. Original reference fixtures untouched; source oracle strips only explicit new optional hooks/reserve.30-layer DPR1/2 tests passed16 exact cached/full-replay comparisons, zero warm completed replay, plus independent alpha oracle. Physical tablet feel, total RAM and50-layer capacity remain unverified.

Next **text and fonts**, then image/reference/pattern imports, magic wand and precision selection before bucket/gap-aware/lasso/enclose fills, then adjustments. Whole-canvas rotation, GPU/Rust/OPFS and proprietary brush import remain deferred/investigation.

Knowledge graph **unchanged**, revision `unruly-kgp-20261011T133431Z`. **Build3 since refresh**. Wait4–5 builds, then ask and receive explicit permission before any graph update/regeneration. Routine continuation uses this brief, DECISIONS.md and relevant code/tests.
