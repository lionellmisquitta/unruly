# STAB1 — adjustable stroke stabilization
Base:6aa05f0b3767fcc45466240c5d6778d9e9d5dc93. Requirement REQ-005/C02. Explicit next-build authorization,16-Oct-2026. User prohibits knowledge-graph changes.

Target: pure constant-state input filter, local setting/control and existing vector/pixel/mask gesture admission. Contracts: coalesced sample order, unmodified pressure, first/release endpoints, existing stroke limits/cancellation, one Undo, native board geometry and offline cache. Smudge, eraser, lasso, held-shape recognition and navigation remain raw. Recognized held shapes bypass subsequent smoothing. No renderer, native schema, history or artwork storage changes.

Shared app.js coordinator is inspected, not suppressed; targeted pointer/cancel/zoom/mode tests plus existing cumulative coverage compensate. Image tips consume filtered points through the existing path. Pixel/mask sessions consume filtered points through pixelMove; smudge bypasses. Frozen zoom converts screen-space smoothing radius into document units. No timers, growing filter buffers or post-release animation. Release joins exact endpoint with last contact pressure through existing segment replay.

Unknown: real-device subjective feel and latency. Synthetic CI cannot close physical tablet acceptance. Excluded: guides/vector editing, Motion mixed-target debt, video/export, cloud/AI and all other retained roadmap rows. Rollback: prior application source; boards contain only ordinary resulting points/pixels and require no stabilization schema migration.

Plan revision1: eight legacy browser files require only exact cache suffix update (TIME1 included); declared explicitly. Focused browser gate runs before cumulative suites to stop early on a new-feature failure.
