# TRANSFORM real-artwork history repair
Base main: 66e4ca9067357fd769b2a89ab6fad17c94542628. Owner reports pinch/twist preview reverting at release, immediate edit-capacity warning and pen scale handle failure. Screenshot confirms unchanged input fields and capacity status. Prior DRAW2 postmerge39192881633 SUCCESS.

Root cause: app.js localCapacity counts all document past/future entries against the same100-slot edit budget. A saturated document therefore rejects the first local edit: touch rolls back at completion and pen handle rejects before movement. The model already safely bounds/evicts document history on committed commands.

Contract revision: active transform/shape drafts get a separate bounded100-entry/16MiB local budget. Document history remains untouched during drafts; Apply uses existing bounded document command, Cancel preserves original artwork/history. Local undo/redo remain draft-only, invalid/no-op inputs add no entries, real draft exhaustion still rejects without mutation. This intentionally supersedes U3B10d's combined-slot expectation while retaining its capacity and document-history assertions. Pen capture/cancel and touch ownership unchanged.

Allowed implementation: prototypes/browser-workspace/app.js, sw.js. Test: tests/browser-workspace/u3.browser.cjs. Evidence: this scoped folder, docs/delivery/{PRODUCT_ROADMAP,CURRENT_CHECKPOINT,CONTINUATION_CONTRACT,CODE_STRUCTURE}. Publication pin in .github/workflows/browser-workspace-pages.yml only after full CI green. No model/schema/render/pose changes, graph, skills, unrelated UI or workflow rewrites.

Regression: reproduce100-document-entry failure with real CDP pinch+rotation and real pen-handle drag; preview persists after staggered releases, fields reflect it, Apply/reload retains it, Undo/Redo restores; Cancel preserves full document undo. Actual100-local-step exhaustion atomic. Existing U3, region/lasso and cumulative suites retained. Cache bumped before CI. Same-session verification; physical tablet still owner trial. Rollback: restore prior publication pin/source.

## Revision1: cache identity regression obligation
CI39205699292 fails offline checks because18 tests hard-code prior cache identity. Allowed test paths additionally include exactly the following files, only cache-name literal updates (no assertion removal):
- tests/browser-workspace/motion.browser.cjs
- tests/browser-workspace/drawing-tools.browser.cjs
- tests/browser-workspace/adjustments.browser.cjs
- tests/browser-workspace/image-tip-paint.browser.cjs
- tests/browser-workspace/layer-compositor.browser.cjs
- tests/browser-workspace/connectors.browser.cjs
- tests/browser-workspace/render-boundary.browser.cjs
- tests/browser-workspace/pattern-warp.browser.cjs
- tests/browser-workspace/pose.browser.cjs
- tests/browser-workspace/text.model.test.mjs
- tests/browser-workspace/pixel-paint.browser.cjs
- tests/browser-workspace/palettes.browser.cjs
- tests/browser-workspace/stabilization.browser.cjs
- tests/browser-workspace/timelapse.browser.cjs
- tests/browser-workspace/tip-guides.browser.cjs
- tests/browser-workspace/history-cache.browser.cjs
- tests/browser-workspace/raster-tiles.browser.cjs
- tests/browser-workspace/composition.browser.cjs
Runtime transform tests and existing lasso suite remain PASS. Update cache expectations to actual new release identity and repeat cumulative; no workflow changes.
