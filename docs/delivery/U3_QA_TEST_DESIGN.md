# U3 bounded adversarial test design

7 October 2026. Candidate inspected: `preview/drawing-ux-u3-2026-10-07`, original materialized commit `0d76cd7ea57277d486a096593029c1937439cd38`. Authority: `U3_CHECKPOINT_TEST_HANDOFF.json` and the current U3 interaction contract / draft-history ownership in `PROCREATE_HANDBOOK_UX_BASELINE.md`. No G02 features are tested.

Adversary: fresh isolated same-model QA session, because neither Claude Code nor Codex CLI is available. QA changes tests and this design only; application repairs remain the Builder's responsibility. Source inspection preceded the Builder's repair explanation.

| Executable IDs | Contract / failure risk | Oracle |
|---|---|---|
| U3B01, U3B02 variants | Two-/three-contact single history chord; staggered capture release; movement, cancellation, duration and fourth-contact rejection | Real CDP touch events, observed capture lifecycle, exact persisted stroke count and unchanged rejected document |
| U3B03, 03a, 04 | Visible composite sampling at DPR2; preview/cancel/release; picker drag; hold timer rearm | Canvas pixel oracle, selected colour, unchanged full persisted board and no document Undo |
| U3B05, 05a, 06 | Held line/circle recognition, second-finger line constraint, continued drag, provisional Apply/Cancel | Actual pen events/650ms hold, numeric geometry, pressure, point count, unchanged saved baseline, one-entry document Undo/Redo |
| U3B07, 08, 08a | Enter Apply, consumed outside dismissal, pen next-stroke boundary | Draft visibility, number of marks and separate Undo transactions |
| U3B09 | Lasso translation + uniform scale + rotation | Analytic endpoint coordinates; exact style/pressure preservation; Cancel and single document Undo/Redo |
| U3B10, 10a–10d | Local history ownership; no-op/rejection; redo invalidation; bounded combined history | Touch/button/keyboard routes; 40-edit retention; document1 + local99 capacity; rejection cannot evict document history |
| U3B11, 11a–11c, 12 | Pending transition guards; handle ownership/cancellation; pen/lasso interference | Wheel/touch view unchanged; New blocked; real handle capture, pointercancel/lostcapture/blur restoring baseline; selection retained |
| U3B13, 13a, 13b | Palm/history arbitration while pen owns input; live touch navigation/picker owns history, pen and toolbar/property admission | Actual simultaneous touch/pen sequence, unchanged document/view and frozen drawing origin |
| U3B14 | Offline U3 assets and shape interaction | Controlled service-worker reload offline; successful gesture/shape/selection module fetches; held shape Cancel |
| U3M01–07 | Exact threshold and recognition boundaries; immutable affine/style; invalid circle extents | Existing six tests retained; new circle coordinate extent/invalid-number case |

Fixtures are recreated per isolated browser context. `fixture()` uses the inspected public model/storage modules to save a named deterministic board, active layer and single styled pressure stroke; UI tests create history through actual pen input. No production data or network integrations are involved. Reload instrumentation uses document capture listeners so app propagation suppression cannot conceal capture evidence.

Browser evidence follows the existing CJS suite: `tests/browser-workspace/evidence/u3-browser-results.json`, per-case screenshots, failure trace ZIPs, uncaught errors and external request checks. Test execution must bind results to the actual published repair/integration identity; original commit alone does not identify subsequently changed source.

## Current evidence and handoff

- Local browser syntax: `node --check tests/browser-workspace/u3.browser.cjs` passed.
- Local U3 unit suite: `node --test tests/browser-workspace/u3.model.test.mjs` passed 7/7 after Builder geometry repairs.
- Browser execution: **NOT_VERIFIED** locally. CI2 executed 30 U3 cases, 29 passed and one material native-input Undo ownership defect failed (U3-D01); see `U3_CI2_DEFECT.json`. Playwright resolves, but its Chromium headless-shell executable is absent. No browser pass is claimed. CI3 subsequently executed32 U3 cases and all inherited regression successfully on41019aa0b7991bbe5bd56b71b9516da9bb454cd0; see U3_QA_REPORT.md. QA did not publish or launch CI.
- Physical pen/device feel: **NOT_VERIFIED**; synthetic browser pen events prove controller contracts only.

Static defect handoff to Builder identified missing pending input/navigation guards, shape Enter/outside/new-stroke commit boundaries, hold rearming/final-release sampling, no-op history recording, silent 32-step draft truncation, handle ownership/termination and circle coordinate extent bounds. These findings were source-based; browser product-failure proof requires CI. Corresponding tests retain contractual expectations through repair. Combined history capacity covers entry admission; a deterministic browser byte-ceiling stress fixture is not claimed here. The inherited model history budget tests remain required.

Repair/CI accounting belongs to Gatekeeper: inherited CI1 consumed; application repair batch1 and CI2 consumed; batch2 resolved U3-D01 plus touch toolbar ownership; final CI3 passed, consuming2/2 repair batches and3/3 CI runs. Gatekeeper owns closure, including exact merged/integrated verification.
