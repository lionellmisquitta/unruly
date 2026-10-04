# WEB-F1 QA-only workflow pre-push review

Independent focused Gatekeeper inspection of actual `.github/workflows/browser-foundation.yml`, QA package manifest and BROWSER_REPAIR_BATCH.md on2026-10-04. No production gate re-review, source edits, tests, build or external paid call performed.

## Scope disposition

**QA-only workflow scope ACCEPTABLE. Curated WEB-F1 source/QA/evidence push to `preview/browser-foundation-2026-10-04` is permitted after the reproducibility correction below.** This publication may trigger bounded QA only. It may not deploy a Pages site, merge main or promote source. Candidate executable-browser disposition remains pending actual CI and independent QA evidence.

Observed safeguards: exact preview branch/path triggers; `contents: read`; pinned checkout/upload actions; checkout credentials not persisted; ubuntu24.04 runner; <=10-minute timeout; per-ref concurrent-run cancellation; isolated QA tools; no app runtime dependency install; shell error handling and explicit server cleanup trap; commit/source hashes; evidence-only7-day upload even on failure. No deployment job, Pages/admin token, secret reference, model/provider call or root static publication. GitHub/npm/browser dependency fetches are test-tool/control-plane traffic, not zero-egress app runtime or proved browser-offline behavior.

## Reproducibility correction

The QA package pins Playwright1.62.1, but its current workflow uses `npm install` without a committed package-lock.json. A pinned top-level version is not the complete resolved dependency identity. Independent QA should add the exact generated lockfile, use `npm ci --ignore-scripts --no-audit --no-fund --prefix tests/browser-foundation`, and include the lockfile SHA256 in the tested identity receipt. This is a QA tooling/workflow correction, not another Builder application repair and not permission to modify application source or QA expectations.

Do not invent lock data if resolution is unavailable. In that case stop reproducibility closure and explicitly replan the test environment; no ordinary 'pinned reproducible' claim. A documented exceptional first-run resolution with captured generated lock would be quarantined diagnostic evidence only and requires explicit acknowledgement, not implied approval from this review.

The Playwright browser executable/version and actual Node version must be captured by QA results. A missing/unavailable pinned npm package or browser installation is BLOCKED, not permission to silently switch versions, launch paid agents or mark browser tests passed.

## Repair and next evidence boundary

One consolidated Builder repair batch is recorded as consumed1/1. Historical P0a two cycles remain preserved. No more application edits are permitted merely to continue this packet after a new failing CI result; stop/replan if another source repair is needed. QA owns independent fixtures/harness and truthful evidence; test-tool defects must be classified and corrected separately without weakening assertions or inventing passes.

After lock correction and independent QA source/test finalization, push curated files to the named personal branch, run this QA-only workflow, inspect actual unit/browser/storage/offline/concurrency/layout outcomes, then return exact identity/results to Gatekeeper. No deployment until separate actual-candidate verdict and legitimate Pages enablement/owner-plan evidence. G14/production/main/release remain false/open;0/14 product checkpoints closed.

## Bounded QA synchronization rerun disposition

Reviewed actual independent diagnosis BROWSER_QA_FIXTURE_DIAGNOSIS.md for CI37179952664 on commit41cd77ffbe2dc1b3a935faa25058b26d84464636. Initial result remains model9/9 PASS, browser11/12 PASS with F05 FAILED. Trace timestamps show immediate visibility checked approximately2ms after click; subsequent captured DOM shows gallery modal open with rows approximately40ms later. This supports a QA synchronization defect, not a proved application defect. Downstream F05 rename/open/inert-title checks are not yet executed and cannot be marked passed from that trace.

**Permit one bounded harness-only diagnostic rerun**: add `waitFor({state:'visible',timeout:5000})` before preserving the existing visibility assertion; leave every application source byte unchanged and retain all subsequent assertions. Bind prior/new harness hashes, unchanged application hashes and actual new CI commit/run. Run the same complete suite within10-minute job ceiling and report actual results. This is QA-owned timing correction, not application repair, no reset of consumed1/1 Builder allowance. No deployment permitted until actual successful evidence and independent candidate review. A genuine app failure still stops and replans.
