# LSET1 independent adversarial design

Accepted source: CURVE1 `d522e76417a91b8d1a4636010ae10a2c7d53f9b7`. Scope: `LSET1_CHECKPOINT_TEST_HANDOFF.json`. Root Codex builds; independent QA designs from requirements and owns tests only. Physical device and main/production remain unverified/out of scope.

| Tests | Contract / evidence oracle |
|---|---|
| LSETM01–02 | Clear only strokes; preserve metadata, other layers, active layer, paper and origin; one-command Undo/Redo restores pressure curve snapshots |
| LSETM03–04 | Empty idempotent/no history/redo invalidation; locked empty/nonempty reject atomically |
| LSETM05–06 | Hidden unlocked deliberate clear, last layer retained, stale ID atomic rejection |
| LSETB01–03 | Actual selection clear, one Undo/Redo, save/reload, metadata/other-layer equality; locked/empty/last/hidden UI states and safe handlers |
| LSETB04–05 | Global mappings synchronize both entrypoints, all options persist per-device across brush/board/reload/offline, no history |
| LSETB06 | Keyboard/mobile/touch discovery, Close/Escape/outside dismissal; dismissal cannot paint |
| LSETB07–08 | Live pen, pending shape and curve editor own controls; settings/clear cannot mutate document or profile |

Fixtures: disposable contexts, two deterministic layers with nondefault metadata and pressure/custom-curve strokes; active layer editable, second hidden/locked. Browser cases assert persisted board/revision and local pen-config equality. Seeded selections and document history provide meaningful cancellation/Undo boundaries. Existing184 regression tests remain untouched. Budgets: maximum2 application repairs and3 complete CI runs.
