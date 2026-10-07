# PEN1 independent Gatekeeper closure

**PEN1 quarantined preview checkpoint accepted; exact tested preview publication authorized.** This independent Gatekeeper consumed `PEN1_QA_CHECKPOINT_RESULT.json`, `PEN1_QA_REPORT.md`, the handoff and readiness/source/security reviews, application repair batch 1, and actual CI1/CI2 raw evidence. Broad product `BUILD_AUTHORIZED`, main merge and production release remain false. Physical pen pressure/button compatibility and feel remain **NOT_VERIFIED**.

Accepted integrated preview source: `93af0a256b57932288f57239612bd4cc5516b7fc`, branch `preview/pen-input-p1-2026-10-07`. [CI2 run 37633247724](https://github.com/lionellmisquitta/unruly/actions/runs/37633247724) passed **57 model tests and 108 actual Chromium journeys**, including **18 PEN1** and **90 inherited** journeys, with zero failing or skipped model tests and zero failing browser journeys. The 48 original-preset RGBA comparisons are assertions within one journey, not 48 additional journeys. This verifies the cumulative preview integration; no main merge is claimed.

The Gatekeeper independently checked the raw commit receipt and all **36 source/test/workflow SHA256 identities against final local bytes**, with zero mismatch. Persisted CI2 text/JSON receipts were independently byte-compared with downloaded raw evidence and matched. Source-manifest SHA256: `a872e6f4b4585589bdcff225960022ca881dc63b512f1ec07c5d97b39119587d`. Evidence lives under `docs/delivery/evidence/pen1/ci2/`; artifact `11487592535` has received/reported digest `cb434239bd2cbc6d1a86ca0af5d79e56bc923aa9ce2b198b833f910473b68074`.

Verified behavior includes pressure width and optional opacity, full-width mouse input, release-zero protection and legitimate contact-zero telemetry, strict atomic dynamics validation, cloned stroke appearance snapshots, save/reload and history replay, twenty reachable original presets, scoped context-menu suppression, browser-reported barrel mapping, automatic lasso-to-Move admission, frozen per-gesture ownership and cancellation, offline precache/update handling, and cumulative U1/U2/U3, selection, migration, locking and performance regression. Low/high CDP pressure produced 6/36-pixel widths, while mouse width was 40 pixels. All twelve original absent-dynamics presets retained exact accepted-U3 RGBA pixels at pressure null/0/.5/1. Cached renderer CPU p95 was approximately 1.7 ms versus reference 79.9 ms; five canvas surfaces peaked at the 80 MiB nominal backing budget. These are CI renderer CPU measurements, not physical input latency.

The runtime-proven CI1 PENB13 product defect is resolved and retested: Chromium normally emits zero-valued lostpointercapture before terminal hover for pointermove-admitted mapped contact. The repair defers that ambiguous event for one task, commits only on matching terminal hover, and cancels on contact continuation, pointerup while awaiting confirmation, blur/cancel or absent confirmation. CI2 preserves the original valid normal-release assertion and adds actual unexpected-capture-loss cancellation. Prior tool state returns on completion/error/cancel; active strokes do not change tool midgesture. No open application/code/security finding blocks this bounded preview. Existing validation, atomic local persistence, work/history/render limits and protective layer locks remain covered; no new dependency, authentication, external request or device-identifier transfer was introduced.

**Verification limit:** Chromium 151 CDP does not deliver attempted eraser mask 32; actual observed events contain buttons 0 and pressure 0. Trusted CDP mask-32 delivery remains **NOT_VERIFIED**. Mask-32 DOM integration passed using explicitly synthetic PointerEvents, proving the reported-event contract only. Actual CDP barrel mapping and mapped Eraser cancellation were independently executed. Do not infer physical Surface/Lenovo/Xiaomi button support, Bluetooth shortcut support or hardware pressure capability. Constant pressure 0.5 remains explicitly inconclusive. CI1 raw failure-event sequences and trace provenance are durably preserved in `evidence/pen1/ci1/pen-input-event-order.json`; the earlier failure evidence and assertion history remain intact.

Builder, independent QA and this Gatekeeper were separate sessions; QA used the documented fresh-session same-model fallback because another runtime was unavailable. QA owned tests and returned application defects to the Builder. **Repair batches 1/2; QA CI runs 2/3.** The separate consumed U3 budget remains unchanged. Any further application change invalidates this exact-source acceptance and requires bounded independent verification.

Publication scope is the static `prototypes/browser-workspace` tree from the accepted SHA only, through the existing owner-authorized Pages preview workflow/environment. Pin and assert the accepted checkout SHA. A deployment-only workflow pin update does not require rerunning application QA against unchanged tested bytes. Before claiming hosted verification, consume successful deployment evidence, compare every hosted asset against accepted local bytes, and run browser root/save/reload and offline/update smoke. **Hosted deployment has not been verified by this closure.** Preserve accepted U3 source `41019aa0b7991bbe5bd56b71b9516da9bb454cd0` and ledger `dc0e6ad445999d76de5de94a4d6b3fe6e5dd6a80` as immutable rollback/history. Export boards containing new preset IDs/dynamics before reverting because older preview versions may reject added IDs or ignore dynamics and alter appearance. A checkpoint branch ref may record the accepted SHA using the established mechanism; do not describe it as a Git tag or overwrite earlier accepted refs.

```yaml
checkpoint_id: PEN1
status: passed
verified_at: 2026-10-07
integration_commit: 93af0a256b57932288f57239612bd4cc5516b7fc
qa_status: PASSED
model_passed: 57
browser_passed: 108
checks_passed: 165
checks_failed: 0
open_blocking_findings: []
application_repair_batches_used: 1
qa_ci_runs_used: 2
preview_publication_authorized: true
hosted_verification: pending
trusted_cdp_eraser_mask32: NOT_VERIFIED
mask32_dom_contract: PASSED_SYNTHETIC_ONLY
physical_pen: NOT_VERIFIED
main_merge_authorized: false
production_authorized: false
```
