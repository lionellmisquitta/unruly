# TIME1 remaining limits
- Operation-level replay (completed strokes, fills, transforms etc.), not continuous pen-point interpolation. No clean video export yet; codecs/framing/retention controls remain C10work.
- Recording is opt-in, local, reload-paused. Paused/reload/switch gaps contain current state on Resume, not lost historical edits. Capture failures preserve saved prefix but cannot recover unrecorded edits. Pending capture on tab kill is not guaranteed; unload guard covers ordinary navigation only.
- Fixed2,000state/32MiB per-board and128MiB global payload budgets; no automatic truncation or eviction. IDB overhead/runtime memory are additional. Bounded queue still needs target-device latency/large log/long-session acceptance. Text deltas are compact for typical appends, not universal compression.
- Views recorded at edits/resume. No continuous navigation capture; replay at a different viewport is not export framing. No Motion Trace video coupling.
- Logs remain separate from native artwork JSON and Undo. Back up recordings explicitly. Valid backup can attach to an empty recording slot after confirmation; it does not restore/change the live board itself. Cloud sync is not implemented.
- Damaged persisted logs reject replay; original bytes remain. There is no automatic repair UI for arbitrary corrupt metadata. A valid last in-memory log can be backed up while the page remains open.
- 32layer cap,30–50interactive target, physical Surface/Xiaomi/Lenovo stylus/palm/performance acceptance and MOTION1mixed-target compatibility remain OPEN.
- All other PRODUCT_ROADMAP rows including Drive and BYOK AI remain. No early-access scope cut; no knowledge graph/skill modification.
