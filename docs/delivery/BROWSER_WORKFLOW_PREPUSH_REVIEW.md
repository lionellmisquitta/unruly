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
