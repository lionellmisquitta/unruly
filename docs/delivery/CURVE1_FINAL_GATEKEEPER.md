# CURVE1 independent Gatekeeper closure

**CURVE1 quarantined preview checkpoint accepted; exact tested preview publication authorized.** The independent Gatekeeper consumed `CURVE1_QA_CHECKPOINT_RESULT.json`, `CURVE1_QA_REPORT.md`, the locked handoff, prebuild/source/security reviews, prior CI diagnoses and actual CI3 raw evidence. Broad product BUILD_AUTHORIZED, main merge and production release remain false. Physical pen capability and feel remain **NOT_VERIFIED**.

Accepted integrated preview source: `d522e76417a91b8d1a4636010ae10a2c7d53f9b7`, branch `preview/pressure-curve-c1-2026-10-07`. [CI3 run 37721411537](https://github.com/lionellmisquitta/unruly/actions/runs/37721411537) passed **66 model tests and 118 Chromium browser journeys**, including 10 CURVE1 and 108 inherited journeys: **184 checks passed**, zero failures, zero skipped model tests. Original 12 preset 48 RGBA comparisons are assertions within a journey, not 48 additional journeys. This is exact integrated preview verification, not a main merge.

The Gatekeeper independently verified raw commit identity, all **39 source/test/workflow SHA256 manifest rows against final local bytes**, and the downloaded artifact ZIP SHA256 `a757560ecaad82d6cd47a9589edff940dff11d23f4069f902df7313310f18a8d`. Artifact ID 11525897197. Manifest SHA256 `ec342f29e89f7fc2865b019e617ed03441ec6feda277f58bc189ec0e946f4b7c`. All 25 matching durable text/JSON/log receipt files were byte-compared with raw `/tmp/curve-ci3` and matched. All 17 application assets are unchanged from CI1 and CI2; only independently reviewed QA fixtures/oracles changed after initial implementation. Durable evidence is under `docs/delivery/evidence/curve1/ci3/`, with earlier failures and diagnoses retained.

Verified scope: three fixed-input25/50/75 percent graph controls with monotonic bounded outputs and fixed endpoints; piecewise-linear response with no overshoot; mouse/pen/touch drag, keyboard/numeric equivalents; detached draft release/cancellation; presets/Reset and local offline persistence; strict atomic optional metadata admission; isolated nested-array stroke snapshots and unchanged old strokes; save/reload/history and vector operations; graph/pad ownership blocking controls and board actions; bounded disposable pressure test pad; cumulative PEN1/U1/U2/U3, selection, layers/locking, migration, offline/update and performance regression. The pre-CI history-arbitration finding was corrected by adding curve editor ownership to historyAction, and actual regression proves Ctrl/Meta Undo/Redo and programmatic history activation cannot mutate the board during a graph draft.

The pad reports actual CDP raw 0.75 mapped to response 0.80 and clearly labels constant/mouse limitations. It retains 256 samples in exactly one fixed 360x140 backing canvas: 201600 nominal RGBA bytes, separate from the unchanged five board-renderer surfaces and 80 MiB backing ceiling. No second boardrenderer or board/history/save mutation occurs. Original 12 absent-dynamics preset pixels remain exact. Renderer CPU cached p95 was approximately 1.7 ms and reference p95 approximately 83.7 ms; five tracked board surfaces peaked at 80 MiB. These are CI CPU/resource measurements, not physical stylus latency or feel.

CI1/CI2 failures are resolved with trace-grounded QA corrections: inherited whole-app canvas count now explicitly separates authorized pad 1 from board renderer 5 and preserves pad/no-growth/budget assertions; CDP driver scrolls and verifies actual pad hit target while retaining ownership/raw-response/isolated-board oracles; PEN1 reload raster read waits for expected backing geometry and opaque paint rather than treating Saved storage status as paint readiness. The final fixture does **not** poll for expected pixel hash, and exact save/reload pixel equality remains unchanged. No application defect was proven after initial implementation; no application repair batch was consumed. No open material code/security finding blocks this bounded preview. Local validation, transactional persistence, work/history/renderer budgets remain authoritative; no new dependency, network/API/account, device identifier transfer, database schema or document version is introduced.

Verification limits remain explicit: physical Surface/Lenovo/Xiaomi pressure/button compatibility is NOT_VERIFIED; trusted Chromium CDP eraser mask 32 is not exposed; its browser handler contract is proven only by explicitly synthetic PointerEvents. Constant pressure cannot certify hardware support. This acceptance does not claim hosted deployment verification or the broader product gates closed. Export custom-curve boards before reverting because accepted PEN1 rejects unknown curve metadata.

Builder, QA and Gatekeeper are separate sessions. Independent QA used the documented same-model fresh-session fallback; it owned test correction and evidence, not application repairs. **Application repairs 0/2; QA CI runs 3/3 consumed.** Prior PEN1/U3 budgets and immutable accepted refs remain unchanged. There is no fourth automatic CI allowance; any new failure or source change requires bounded replan and fresh independent evidence rather than weakening assertions.

Publication scope is only the accepted static `prototypes/browser-workspace` tree from the immutable SHA above, through the existing user-authorized Pages preview environment. Pin and assert exact checkout identity. A deployment-only workflow pin update does not require duplicate application QA against unchanged tested bytes. Before claiming hosted verification, consume successful deployment evidence, compare every hosted application asset with accepted bytes, and observe root UI/profile/pressure pad, prior artwork, new ink save/reload and safe offline/update smoke. **Hosted verification remains pending at this closure.** Preserve PEN1 source `93af0a256b57932288f57239612bd4cc5516b7fc`, ledger `f96057d511080414f5ad1d3ed42e5c0274463323` and `checkpoint/pen1-v0.7.0` as immutable rollback/history; do not rewrite prior refs or describe checkpoint branch refs as Git tags.

```yaml
checkpoint_id: CURVE1
status: passed
verified_at: 2026-10-08
integration_commit: d522e76417a91b8d1a4636010ae10a2c7d53f9b7
qa_status: PASSED
model_passed: 66
browser_passed: 118
checks_passed: 184
checks_failed: 0
source_manifest_rows_verified: 39
open_blocking_findings: []
application_repair_batches_used: 0
qa_ci_runs_used: 3
preview_publication_authorized: true
hosted_verification: pending
physical_pen: NOT_VERIFIED
trusted_cdp_eraser_mask32: NOT_VERIFIED
mask32_dom_contract: PASSED_SYNTHETIC_ONLY
main_merge_authorized: false
production_authorized: false
```


## Hosted closure addendum — 8 October 2026

**Hosted preview closure confirmed.** Independently consumed `CURVE1_HOSTED_CLOSURE.md`, actual Pages deployment log and `evidence/curve1/hosted-sha256.json`. Run `37722268828`, workflow commit `25bb1b28bd9f6442806bf257506b568e6ada4ac7`, checked out and asserted accepted source `d522e76417a91b8d1a4636010ae10a2c7d53f9b7`; the actual log reports deployment success. All **17 emitted hosted asset hashes** agree with the receipt, accepted CI3 manifest and local bytes, with zero mismatch. No application source changed and no new QA run was needed.

The root's recorded live Chrome smoke observed safe Update retaining prior artwork, native graph drag and numeric input with persisted profile 25/54/71, honest mouse-pad pressure-unavailable reporting, and both old/new lines retained after Apply, Saved and reload. This reviewer consumed that interaction receipt; it did not independently repeat the native browser actions. Hosted Ready for offline use was observed; actual network-disabled offline behavior was verified by CI and was not repeated on the hosted browser. No physical pen test occurred. Governance closure preserves exact source, rollback, repair/CI counters and main/production false.

Current hosted status is **VERIFIED** for the accepted cumulative preview at https://lionellmisquitta.github.io/unruly/. Physical hardware and trusted eraser mask32 remain NOT_VERIFIED; broader product/main/production authorization remains false. The earlier pending status above describes the pre-deployment review and is superseded only for hosted verification by this dated addendum. No further automatic build or CI allowance is opened.
