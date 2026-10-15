# Motion Trace future-change map

| Future change | Authority/code surface | Reopen trigger and tests |
| --- | --- | --- |
| Cue limits, timing, path interpolation | motion.js + model.js optional v14 validation | Revisit native/schema/history byte bounds; motion.model.test.mjs and native/offline browser checks |
| Rotation/scaling or curve editing | New requirement + UX revision before motion.js/motion-ui.js | Transform ordering, raster/text/tip/mask and clipped-group tests; not implied by translation paths |
| Mixed same-layer pixel and original-object cues | motion-region.js and compileMotion in motion.js | Existing whole-layer raster split changes source identities; preserve outside pixels, per-object identity, order and bounded backing. Keep gap OPEN until implemented/tested. Do not weaken missing-target guards. |
| Presentation controls, path inputs, mobile layout | motion-ui.js / existing HTML/CSS tokens | Preserve separate saved-cue/preview/commit actions, manual default, exact Stop/view restore and keyboard/pointer capture |
| Save/export/sync/timelapse integration | Existing model command/storage boundary; future checkpoint contract | Persist only h.board, never motionPreview. Add concurrent save/conflict and persistent-history tests before capturing presentation states |
| Rendering/GPU performance | Separate scoped performance change | This checkpoint does not change render.js/raw renderer. Retain existing frozen source/pixel oracles and80MiBbacking; physical-device latency remains unverified |

Existing app.js hooks are orchestration only. New schema/math is model-independent; region adapter alone reuses existing model/wand/lasso primitives. This is a logical dependency boundary, not a generated knowledge graph or proof of acyclicity.
