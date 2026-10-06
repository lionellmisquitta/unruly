# U1 independent candidate code/security review — core pass

6 October 2026. Isolated same-model Codex Gatekeeper review of current `model.js`, `render.js`, and the narrowly permitted `selection.js` locked-copy compatibility change. UI/storage/worker construction is still in progress; this is a core source review, not an actual-browser pass or checkpoint closure. No application or tests were edited by this reviewer.

**Disposition: one bounded Medium application defect requires repair or explicit scoped disposition before U1 closure. Browser/CI and completed UI/storage review remain pending.** Bounded U1 build authorization continues; no publication, main or production authorization is granted.

## Actionable defect

**U1-CR-001 — Medium — unsupported blend silently falls back.** `render.js`'s `composite()` assigns `ctx.globalCompositeOperation` and calls `drawImage()` without reading back the accepted value. Canvas ignores unsupported operations, leaving the prior operation in place; after reset that is Normal/source-over. The batch explicitly requires operation availability verification and prohibits silently rendering unsupported modes as Normal. Chromium pixel tests can prove its supported modes, but do not repair this missing runtime guard.

Minimal repair: derive the requested operation (`normal` → `source-over`), assign it, verify `ctx.globalCompositeOperation === requested`, and fail with an actionable unsupported-blend error before drawing otherwise. Keep assignment/check/draw within a `try/finally` that resets alpha and source-over on both success and failure. Independent QA should exercise a rejecting context setter or another deterministic unsupported-operation case, without replacing the real-browser blend pixel oracle. Attribute any repair to U1's existing allowance; no extra cycle is created by this report.

## Core findings without application defects

The v3 layer blend whitelist and U1 preset rejection are explicit. `migrateV2` validates the v2 document, clones it, adds Normal, and validates v3; imports refresh board/layer/stroke identities and clear lineage. Legacy v1 conversion preserves the established ink path. Coordinates, pressure, counts, serialized bytes and replay work remain bounded. Duplicate preflights a full candidate before allocating persistent identities, preserves style/pressure, unlocks the clone and uses one command transaction. Protective lock guards delete/opacity/blend and existing content operations while permitted metadata/reorder/duplication remain available. Invalid/no-op command paths preserve original history.

The selection change is justified by the handoff's proven compatibility-blocker exception: copy reads selected strokes on the visible active layer even when locked; delete/move/paste retain write guards. No selection algorithms, cross-layer scope or editing capability have been expanded. QA must retain locked-copy and locked-write rejection evidence.

Renderer inspection preserves all five surfaces and releases old stores before growing them. Both geometry and scratch sizing bound their final nominal total, and the resize ordering avoids transient old-height/new-width allocation. Thumbnails reuse layer/scratch, invalidate retained state and produce bounded 80×48 data images. Legacy stroke rendering bodies remain intact; footprint expansion is not introduced by this slice. Full/retained lower-composite layering and single layer-opacity application are structurally coherent, but actual pixel equality, every-setter allocation instrumentation and P01 frame/cache performance still require executed QA.

For inspected pure-core boundaries, no new network, dependency, executable-input, secret or privileged API path appears. Imported values reach enumerated numeric/color/brush/blend contracts; the compatibility copy change does not permit writes to locked content. Remaining DOM encoding, storage transaction/migration/CAS, worker cache scope and input ownership trust boundaries require the completed candidate review and QA evidence.

## Evidence limits and closure obligations

Reviewed SHA-256 identities: `model.js` = `d313c3ad44b338c8bf641cf7b87aacee62fca827f7ab38275342649b154a762c`; `render.js` = `a05e88b6d0b1e9fcad368209791c7d3f4e8c1acbbdd070d57971f31ac4ebf294`; `selection.js` = `0c9d4041dd5646eadb8a9c2d422027a27e0710d6e8a9013937c70ad2c05bd536`. A subsequent source repair requires rechecking the affected identity.

The snapshot has no Git metadata; do not claim a newly verified commit from this read. Bind the final combined U1 source/file manifest to independent model/browser/CI results and retained failures. Model/schema/selection verification alone cannot certify migration, UI, blend pixels, offline/update or physical pen feel. Do not close U1 or begin publication on this report alone.

## Completed UI/storage source pass — before first CI

Independently read the completed storage, app, HTML/CSS and current worker, plus QA's U1 design/compatibility scope. **U1-CR-001 is closed by source inspection**: the repaired composite checks the operation readback before drawing and resets alpha/source-over in `finally`. Independent executed regression is still required.

Three material bounded UI findings are returned to the Builder for the already reserved U1 repair batch 1:

| ID / severity | Evidence and failure | Minimal repair and QA proof |
|---|---|---|
| U1-CR-002 / High | `.layer-grip` is 20px wide; visibility/blend/menu are 26px; panel heading icon buttons are 36px. These violate the accepted >=44px action targets. Menu actions/rename are 36px high. `.layer-top` is fixed at56px, preventing required growth for enlarged text. | Give interactive targets >=44px, retaining compact rows by consolidating controls into the existing menu if needed. Use minimum rather than fixed row height and allow enlarged-text growth. Browser bounding-box checks at desktop/tablet/phone plus 200% text. |
| U1-CR-003 / Medium | Keyboard row reorder restores focus using `querySelector('[data-layer-id="'+l.id+'"] ...')`. Valid migrated layer IDs may contain quotes/brackets; these cause a selector exception after reorder. This is a DOM/input failure, not demonstrated executable injection. | Match `dataset.layerId` by row iteration, or correctly escape the attribute value. QA seed a valid legacy ID with selector metacharacters and verify keyboard reorder/focus. |
| U1-CR-004 / High, source-derived | `setupLayerGesture` captures an initial child-button press on the parent row, while the selection click handler is attached to `.layer-select`. Captured pointerup/click targeting can route the click to the row and bypass the child handler, breaking ordinary layer selection. No browser execution is claimed for this finding. | Capture on the pressed select/grip control so row listeners receive bubbled events, or defer parent capture until actual drag. QA must perform a real pointer click and inspect activeID; a dispatched click is insufficient. Retest swipe consumed-click and grip/no-op behavior. |

Storage source inspection identifies no material transaction or data-loss defect: actual `unruly-workspace`/foundation stores are opened without upgrading and read in readonly transactions; failed source probing is explicit; recovered current/previous identity is validated; new target+completion map writes share a transaction; collisions receive durable target mappings; completed copies skip later overwrite; damaged workspace/foundation fallback preserves sources and warnings; selection is saved only when target exists. CAS, backup and 100-board guards remain. Startup with all source copies failed exposes an unsaved recovery workspace and warnings rather than marking a durable empty board successful. Actual interruption/quota/concurrency proof remains QA-owned.

The DOM constructs imported titles/names using `textContent`/input values. The sole reviewed `innerHTML` is a fixed original SVG plus a boolean-controlled fixed path. No remote lookup, new dependency or executable imported asset is introduced. Normal worker cache cleanup is restricted to its new normal prefix, preserving recovery caches and all document stores. Overlay absolute positioning preserves stage geometry by inspection; captured-input blocking and outside dismissal still require browser evidence. These source observations do not substitute for actual UI/storage/offline/P01 results.

Reviewed full-pass SHA-256 identities: app `cd90cd2d3d88077aec51163d0be8878df6a217a3f8c466700f05d7de9b8d32c8`; storage `87ca0271ede09256301a14350b79808dd0de53f939ccffc3d489826d62245791`; CSS `466bc5eb13794350c3201041d9a79e0c21bedbd79230920f502bab0c987aeb96`; HTML `12aa3ef011b7de3b092fb286be1b03e24714f5a327b0f5151144b4e31a9f4e8e`; repaired renderer `b0c39b17e3b4fe56f4bd76245e6ff0908774609d8df045cc7fc047efa38224ba`. Source construction continues; final QA/review must bind subsequent changes. No allowance reset or new repair batch is created by this pass. U1 closure remains pending.


## Repair batch 1 targeted source recheck

Re-read the Builder's latest changed snippets. U1-CR-002 now has final CSS overrides giving the cited row/panel/menu targets 44px, minimum rather than fixed row heights, wrapped names, and a bounded wider overlay. U1-CR-003 now restores focus by matching row dataset IDs rather than interpolating source IDs into selectors. U1-CR-004 now explicitly invokes layer selection on a normal non-grip/non-swipe/non-drag pointer release, avoiding reliance on a child click retargeted by row capture. These three findings are **closed by source inspection**, with their independent real-browser regression obligations still pending. This is the same existing repair batch 1, not another allowance. No material inspected application defect remains open at this point; completed actual candidate/browser/CI closure is not yet granted.


## CI1 failure review and bounded pre-CI2 repair review

CI1 is **FAILED**, source `72094fc741b16277b37e950afc83cb57cec1054d`, run `37423089580`. Independently read retained machine-readable browser results and QA diagnosis: foundation12/15, selection1/6, P01 16/16, U1 10/15, total39/52 browser groups passed and13 failed. QA reports35/35 model cases passed. None of the browser failures is converted to a pass here. Actual CI1 pixel, allocation, P01 and migration passes remain bound to that old candidate; changed test/source verification is still pending.

Reviewed QA's specific fixture corrections and compatibility ledger. Pattern locator matches the actual accessible control; Escape dismisses the real overlay before lasso input; the 550ms wait exceeds the documented500ms debounce and is followed by a saved-state predicate and durable-record assertions; worker fixture now replaces the complete CACHE expression within the normal prefix and polls resolved registration state rather than treating an unresolved Promise as readiness. These are proportionate, evidence-consistent fixture adaptations. They retain substantive geometry/history/content/quota/update assertions and add UB15; no failed group is deleted or bypassed. Retest remains necessary and may uncover an application defect hidden by the former fixtures.

Source finding U1-D01 is repaired narrowly: `act()` forwards the existing `keepSelection` flag and `editLayer()` enables it **only** for lock/unlock of the currently active layer. All other mutations retain existing invalidation. Selection IDs refer to unchanged strokes; hidden/content-write guards in UI and pure selection/model remain. The new actual UI UB15 test checks lasso selection, Lock, retained count, allowed Copy, disabled Cut/Delete/Paste, unchanged saved content and Unlock. **U1-D01 is closed by source inspection, runtime proof pending.**

**Pre-CI2 disposition: bounded retest permitted; U1 closure and U2 source remain unauthorized.** This application repair consumes the already reserved final U1 batch2/2; there is no remaining application-repair allowance and no reset. CI1 consumed1/3; CI2 will consume the next existing run. Further material application defects require stopping/replanning under the recorded budget, not another source repair or weakened test. No executed new browser success, hosted validation or production readiness is claimed.

Pre-CI2 identity check: independently recomputed all23 app/QA file digests plus the existing workflow digest from `U1_CANDIDATE_SOURCE_SHA256.json`: **24 match, zero mismatch**. This binds the reviewed retest candidate files, not a new executed CI result.
