# DRAW1A service-worker cache bump

Date: 18 October 2026
Base: `452efc528ec670b3f207f53fa892a349bf9467a3` (`main`)
Purpose: ensure installed PWAs fetch the merged DRAW1A interface instead of serving the prior cached HTML, styles, and app script.

## Scope
- Bump the versioned normal-workspace service-worker cache from `v3-20261018-pose1a-hair-1` to `v4-20261018-draw1a-ui-1`.
- Update existing offline/cache regression checks to expect the new cache identity while preserving their assertions and behavior.

## Allowed files
- `prototypes/browser-workspace/sw.js`
- `tests/browser-workspace/*.cjs` and `tests/browser-workspace/*.mjs` that assert the current cache identity
- `.delivery/CHG-UNRULY-DRAW1A-CACHE-1018/IMPACT.md`

No runtime assets other than the service-worker cache identity change. No model, storage, drawing, pose, export, gesture, or feature behavior changes. Validate JavaScript syntax, complete cumulative browser QA, and exact-source release artifact before publication.
