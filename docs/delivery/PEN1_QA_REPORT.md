# PEN1 independent QA result

**PASSED for automated browser contracts** on exact source `93af0a256b57932288f57239612bd4cc5516b7fc`, CI run `37633247724`. Physical pen pressure/buttons remain **NOT_VERIFIED**.

Independent QA read CI2 receipts, counted every case, checked all36 source-manifest hashes against current local files, and byte-compared the persisted receipts with the downloaded raw receipt files. All matched. The run reports **57 model tests and108 browser journeys passed**, with zero failures or skips. Browser coverage includes18 PEN cases and90 inherited application/performance cases. Source ownership and release closure remain with Gatekeeper.

Pressure .1/.9 produced measured widths6/36 pixels; mouse width40 pixels stayed full. Save/reload and Undo/Redo retained exact canvas hashes. All20 brushes were reachable;48 exact RGBA comparisons preserved original12 absent-dynamics preset pixels. Metadata admission, snapshots, selection, context-menu scope, telemetry, offline use and temporary mapping ownership passed.

One application repair batch fixed normal release ordering for a gesture admitted through pointermove. The passing retest distinguishes normal captureloss followed by terminal hover from unexpected loss followed by pointerup, while preserving blur/lostcapture cancellation. Budgets consumed: **1/2 application repair batches;2/3 CI runs**.

Chromium151 CDP drops requested eraser mask32 into hover events with buttons0/pressure0. That trusted signal is **NOT_VERIFIED**, and its raw capability evidence is retained in PENB08. Eraser mask32 DOM integration passed through explicitly synthetic PointerEvents; this proves the reported-event contract, not hardware compatibility. Actual CDP barrel mapping and mapped Eraser cancellation were separately exercised. A human device test is still required for physical pressure and button compatibility.

No unresolved product defect remains in the tested browser scope. Hosted deployment and any separate merged source require Gatekeeper identity verification. Evidence: `evidence/pen1/ci2`, `PEN1_QA_CHECKPOINT_RESULT.json`, and `PEN1_CI1_QA_FINDINGS.json`. Artifact ID11487592535, received digest`cb434239bd2cbc6d1a86ca0af5d79e56bc923aa9ce2b198b833f910473b68074`.
