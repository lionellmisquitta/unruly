# G02 held-history vertical slice — 2026-10-09

Baseline: cumulative public preview exact source `4aae3a7730f71dd6028571c96666773ef1eb1524`.
Branch: `work/g02-held-history-2026-10-09`.

## In scope
Long press Undo and Redo controls to step through history, with the existing short-click behavior preserved. Hold begins after 550ms and repeats with 160ms scheduling while undo/redo entries exist. Pointer release/cancel/leave stops scheduling. Browser gesture ownership and pending local edit history remain respected through the existing `historyAction` function.

## Not in this slice
View rotation and fit, clipboard gestures, chrome and scrub gestures, expanded shape coverage, native hardware pen certification. Do not mark the full G02 milestone completed.

## Evidence and acceptance
G02M01..03 exercise tap isolation, repeat cessation and cancellation. Existing cumulative model/Chromium suites must pass on exact branch SHA. Independent browser tests must specifically confirm held pointer events, click suppression, restoration of history, cancellation, disabled boundary, and touch/pen interaction before Gatekeeper permits publication. Hardware tablet behavior remains NOT_VERIFIED.

## Release gate
Only after exact-source CI, independent QA, and Gatekeeper review may this slice be repinned to the single cumulative GitHub Pages preview. Do not modify native `main`. Prior preview rollback SHA above.
