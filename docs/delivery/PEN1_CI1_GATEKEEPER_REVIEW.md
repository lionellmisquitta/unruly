# PEN1 CI1 independent Gatekeeper review

Verdict: **BLOCKED_FOR_CHECKPOINT_ACCEPTANCE**. Initial quarantined implementation remains within scope; repair batch 1 may address the runtime-proven release-order defect. Broad product/main/production authorization remains false. Physical stylus remains NOT_VERIFIED.

Independently consumed `/tmp/pen-ci1` raw evidence for CI run `37631776750`, source `9bf176a589f9a45580c07bf19dd7475c20c91d54`. All 36 rows of the actual source SHA256 manifest matched current local source/test/workflow bytes at review. Actual model report passed 57/57. Inherited browser suites passed 90/90 (workspace 15, selection 6, performance 16, U1 16, U2 5, U3 32). PEN browser report passed 15/17, with two failures. Frozen accepted-U3 original preset rendering comparison passed all 48 exact RGBA cases. No successful overall checkpoint claim is made.

## PENB13 — product defect, release ordering

Raw Playwright trace contains actual browser pen pointermove events with buttons 3 and pressure approximately 0.4, followed by gotpointercapture and additional pen contact moves. At contact lift Chromium emits lostpointercapture with buttons 0 and pressure 0 before the final pointermove with buttons 0 and pressure 0. The app unconditionally calls `finish(e, true)` on lostpointercapture, cancelling the completed lasso and restoring prior empty selection before the final release signal arrives. The assertion correctly reports 0 selected instead of 1 selected. This is an application defect affecting the explicitly promised pointermove-admitted pen mapping path, not a test harness failure.

Required repair: distinguish the expected no-contact release of a move-admitted gesture from genuine unexpected capture loss, or implement an equivalent safe input ownership scheme. Keep unexpected capture-loss, blur, pointercancel and active-gesture arbitration cancellation intact. Preserve this valid failing assertion and verify both release and cancellation paths on the repaired integrated source.

## PENB08 — CDP capability limit, no eraser signal delivered

Raw trace evaluation of captured events shows only three actual pen pointermove events, all buttons 0 and pressure 0, despite attempted CDP buttons 32 requests. The browser never delivered the eraser signal to the app. Failure is the explicit test capability assertion, not evidence of an application eraser mapping defect. Do not label this as a passing trusted CDP eraser test, weaken the observation, or infer physical-device support. Preserve the limitation in QA evidence. Add explicit synthetic DOM-contract coverage for mapping and gesture behavior if this runtime cannot produce the signal; label synthetic coverage honestly. Real barrel eraser mapping and cancellation have separate executed cases.

Budget at this review: CI runs 1/3; application repair batches 0/2. QA owns test/tool corrections and defect classification; Builder owns application repair. Final acceptance still requires successful same-source regression, independent QA result, complete source identity and updated source/security review.
