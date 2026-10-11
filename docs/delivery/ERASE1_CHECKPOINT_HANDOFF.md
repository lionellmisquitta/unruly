# ERASE1 — Intersection eraser work-limit repair

Status: SCOPE_LOCKED_PREBUILD; application repair not started; CI not run.
Date: 2026-10-08 (Asia/Kolkata).
Parent tested/browser-published application commit: `5d45ee6ecf43efef6466450abb207b89d7e3eac0`.
Branch: `work/erase1-intersection-limit-2026-10-08`.
Reported issue: https://github.com/lionellmisquitta/unruly/issues/1

## Objective
Fix the user-reported failure where Erase up to intersection displays an eraser/gesture work-limit error rather than cutting the desired section. Do not merely raise `limits.comparisons`.

## Scope
Allowed application files: `prototypes/browser-workspace/model.js`, and `app.js` only if a directly related UI correctness problem is proven.
Allowed QA files: `tests/browser-workspace/*` for isolated deterministic fixtures, model tests, Chromium journeys, and evidence.
No unrelated brushes, pressure, gestures, service worker, persistence schema or main-branch changes.

## Independently verifiable acceptance
1. Characterization fixture first reproduces work-limit failure at a bounded realistic drawing/sweep; retain fixture.
2. Intersection erasure cuts the intended segment bounded by true intersections; strokes outside the target and other layers unchanged.
3. Repeated sweep samples do not trigger unnecessary full-board quadratic rescans or freeze a tablet; keep bounded work/memory/time and an explicit safe failure for pathological cases.
4. Tangency, shared endpoints, close/overlapping intersections, zero-length strokes, self-crossings, hidden and locked layers, and selected-layer routing have defined assertions.
5. Undo/redo restores exactly; save/reload and offline update retain geometry. Original pencil/brush pixel baselines, LSET1, and broader regression remain passing.
6. Independent QA owns adversarial fixtures/tests; Builder owns application repair. Gatekeeper accepts exact tested source and authorizes preview publication only after CI and evidence checks.

## Budgets and guards
Proposed ERASE1 budget: at most 2 application repair batches and 3 complete CI runs, recorded separately from LSET1; do not automatically consume LSET1 budget. Full/main production remains unauthorized. Preserve existing Windows-native source history and last fully accepted rollback.

## Outstanding
Physical reproduction artifacts (drawing and device) not yet collected. Exact root cause remains a hypothesis until characterization test proves it.
