# WEB-F1 independent adversarial test plan

Fresh isolated same-model QA fallback (`windows_slice_qa`) independent from Builder; no external model/CLI requests. Governing contract BROWSER_EXECUTION_PLAN.md and BROWSER_GATEKEEPER_READINESS.md reviewed before source. Product authorizations and native test history remain unchanged. No server/API/Drive/backend integration is applicable to this static foundation: actual IndexedDB, browser pointer events, worker cache and frontend are mandatory.

## Deterministic fixtures

Use separate fresh browser contexts except explicit offline reload and concurrent-tab journeys. All content synthetic: board title `QA — local ink`, inert injection string `<img src=x onerror=window.__injected=1>`, pen IDs11/12, touch IDs21/22, known coordinates/pressure0.1/0.8, mouse unavailable pressure, NaN/Infinity/out-of-range limits in unit fixtures. Seed malformed current board with valid last-good snapshot via actual IndexedDB store; tests record fixture layout after discovering source schema. Quota fault injected at browser storage write boundary, never alter application source or claim realistic quota exhaustion. Conflict fixture two same-origin pages loads same revision, then each makes distinct stroke. Update fixture candidate worker installed without active replacement during dirty edit. Clean fixture context disposal, except persist/reopen evidence.

## Coverage groups

| ID | Acceptance/risk | Required evidence |
|---|---|---|
| F01 | AC01/09 | Canvas and named controls visible/reachable at desktop,360px and tablet; no login; screenshot and console evidence. |
| F02 | AC02/03 | Synthetic pen contact draws, pressure availability preserved, pointerup final point and distinct contacts; hover/cancel/focus loss no committed stroke. Real device pressure remains NOT_VERIFIED. |
| F03 | AC04 | Finger never inks; wrong pointer/touch during pen cannot corrupt ink; two-touch navigation finite; anchored wheel zoom and space-pan work. |
| F04 | AC06 | Undo/redo whole stroke and whole-stroke erase; new edit clears redo; brush controls affect next stroke only. |
| F05 | AC05/07 | Actual IDB completion precedes Saved locally; reload retains committed points/title; New only switches after write completes; gallery open/rename/export validated JSON. |
| F06 | AC05/07 | Corrupt current recovers last-good visibly; unrecoverable corruption never silently blank-saved; version/identity/limits reject malformed persisted data. |
| F07 | AC05 | Injected quota/write failure displays failure while in-memory edit and export recovery remain available; prior committed board retained. |
| F08 | AC05 | Concurrent page edits protected by genuine ownership or revision conflict; second tab cannot overwrite first silently. |
| F09 | AC08 | Wait actual worker install/cache; offline same-origin reload loads app and retained board without CDN; uncached first-visit is not declared offline-ready. |
| F10 | AC08 | Candidate worker waits during active editing; explicit update reload gated by durable save, no skipWaiting/clients.claim automatic replacement. Actual worker test; static-only findings labeled NOT_VERIFIED. |
| F11 | AC05/07 | Pure model invalid boundaries:finite/coordinate/size/title/board-stroke-point-count/serialized size, pressure metadata and stroke identity. No duplicated structural tests. |
| F12 | AC10/security | User titles inert, no unexpected external network; test/browser/source hashes and command exits recorded; workflow reviewed before enabling; no root bundle publication. |

QA owns tests and diagnosis, never Builder source repair. Initial implementation plus at most one diagnosed recovery repair/retest; preserve valid failed tests. Source absent at plan time; all executable categories NOT_VERIFIED until actual runs. Host unit evidence and actual Chromium browser CI are distinct categories. Branch evidence does not close product checkpoints or prove physical feel.
