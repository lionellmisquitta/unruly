# C06-S1 independent adversarial test plan

Plan derived from SELECTION_CONTRACT.md before implementation. Adversary: isolated same-model Codex QA session, separate from Builder; no paid Claude/CLI/API calls. QA owns tests and evidence only. Implementation/testing starts after Gatekeeper readiness. Existing WB1 16 model cases and 15 browser journeys remain unchanged and execute as mandatory regression. WB1's exhausted repair allowance stays separate: selection max2 diagnosed application repair batches and3 CI attempts, each≤10min.

## Deterministic data and risks

Use original version2 boards with unique fixed QA IDs, two layers, pressure0/null/1 and all four brush styles. Active-layer test strokes: crossing segment endpoints outside a polygon; inside dot; on-edge dot; outside dot; concave-notch stroke; bounding-box-overlapping line that never intersects the loop. Include identical coordinates in inactive/hidden/locked layers. Exact coordinates give independent expected geometry; compare serialized originals before/after rejected operations. Each browser journey has an isolated context/DB; no production data changes. Clipboard fixtures are deep clones of valid selected strokes, with hostile bounds and malformed metadata mutations tested independently.

## Model tests (added selection.test.mjs)

| ID | Contract/risk | Evidence expectation |
|---|---|---|
| S01 | Lasso geometric truth | Concave/even-odd containment, crossed-centreline endpoints outside, endpoint/edge contact, dot inside/on/outside; bbox overlap alone never selects. |
| S02 | Polygon validation/work budget | 2/3/512/513 points, distinct points, area just below/at1, finite/coordinate bounds, symmetric signed-area-zero self-cross, comparison cap exhaustion; board/history unchanged. |
| S03 | Selection ownership | Active visible unlocked layer only; stale/missing/nonactive/duplicate IDs rejected atomically for bounds/copy/move/delete; hidden/locked refuse. |
| S04 | Clipboard clone/validation | Copy preserves precise style/pressure/path and deep-clones; mutated clipboard cannot alter source; supplied bounds recomputed; malformed style/pressure/IDs/coordinates/version/size rejected. |
| S05 | Move geometry/immutability | Finite delta, zero-delta no command, final bounds overflow, IDs/style/pressure retained, one revision/undo, original object unchanged; complete rejection without partial mutation. |
| S06 | Delete/cut history semantics | Delete one command with exact undo/redo, new edit clears redo, rejected deletes keep board and prior clipboard; cut integration verified through UI. |
| S07 | Paste identity/translation | Fresh ID for every pasted stroke, bbox centre translated to target, all pressure/styles preserved, correct active layer, across-board paste and repeatedpaste collision-free; clipboard immutable. |
| S08 | Combined capacity/history limits | Board at stroke/point/8MiB/coordinate limits rejects all-or-nothing paste; retained max100 and16MiB cumulative history; no persistence/schema change. |

## Browser journeys (added selection.browser.cjs)

| ID | Actual journey | Required result |
|---|---|---|
| U01 | Real pen/mouse lasso → overlay → Move drag with final release coordinate → save/reload → undo/redo | Entire intended vector strokes selected, overlay visible, original style/pressure retained, one history operation, final release location included; durable IDB record translated exactly. |
| U02 | Real Copy/Cut/Paste/Delete controls, keyboard activation, New/Open acrossboard | Session clipboard survives successful cut/new/open, pasted IDs fresh, visiblecentre conversion correct under pan/zoom, delete/undo exact; clipboard clears on reload. |
| U03 | Cancelled move/lasso, Escape, blur, zero delta/outsidebbox, touch/pen arbitration | Original board/revision/IDB/history retained, no accidental ink or touch selection; frozen gesture view/IDs; hint for outside click. |
| U04 | Selection invalidation and failure recovery | Layer/visibility/lock/undo/redo/erase/drawing and successful transitions clear; failed quota/conflict save retains work/export/selection; paper/settings may retain; cut failure preserves clipboard. |
| U05 | 360px/mobile and tablet reachable controls + overlay rendering | Actual role/label controls reachable with keyboard/mouse, no added canvas, dashed overlay tracks pan/zoom/preview, session-only note visible; screenshots/console evidence. |
| U06 | Offline reload and pending update during active lasso/move | Existing storedv2 remains readable; selection not persisted; waitingworker activation refused for active gesture/unsavedfailure, explicit saved update later succeeds. |

Browser input uses trusted Playwright mouse/keyboard and browser-level CDP pen/touch dispatch where needed; injected quota faults clearly labelled, at actual IDB boundary. Direct pure-module fixtures may seed exact geometry, but controls must execute actual interactions, not merely direct change-event injection. Existing backend/API/Drive tests N/A because no server/integration exists; actual IndexedDB save/conflict/recovery mandatory. Fresh worker update fixture preserves old runner assumptions; no modification of inherited regression assertions.

## Evidence and status

Bind exact premerge commit, source/test/lock/workflow hashes, actual Chromium/Node versions, screenshots/console, CI run and artifact digest. Every failure classified product/test/data/environment/contradiction/unknown with repro; QA never repairs application. Retest valid failures unchanged plus complete inherited regression after Builder repair. Local browser unavailable means NOT_VERIFIED until actual CI, never assumed pass. Synthetic tests do not certify physical pen, latency, device feel or native Windows/Android. Branch green is candidate evidence only: Gatekeeper owns preview promotion/closure; full product/main/production authorization remain false. Report residual gaps explicitly and preserve initial failed receipts.
