# TIP1 impact and implementation plan
Base: 4d0657e0578a598997f42a68656dea4902c87353. User authorizes TIP1 and named brush sections; existing verified owner publication authorization retained. No graph writes.

Acceptance: PNG/JPEG upload using existing bounded decoder (12MiB,2048px source), downsample to <=128px mask; explicit alpha or dark-on-light grayscale/invert preview. All previously accepted TIP1 spacing/spacing jitter, lateral/linear jitter, fixed/follow/random rotation, count/count jitter, size/opacity jitter, flips and pressure. Named brush sections/create/rename/move, saved named presets, portable library JSON backup/import. Library bounded16sections/32brushes/1MiB; writes report quota failure atomically. Existing strokes embed immutable mask/options/seed; v12 native documents preserve replay without library. Stroke work bound4096stamps and4million sampled mask pixels; reject whole gesture if exceeded. Existing8MiBboard/16MiBhistory/32layers/80MiBrender backing retained; one <=128px temporary tip canvas outside base surfaces, release after replay. No format parity claim.

Design: custom-tips.js pure schema/mask/seeded traversal/library operations plus isolated DOM drawing helper. custom-tips-ui.js owns disposable editor, local library and section controls. Existing ink-brush preset remains base compatibility; tip identity selects existing per-brush pressure override key. renderer optional drawTip hook, default path byte oracle retained through exact normalization. model admits v12 and validates every tip/work count, addStroke promotes version. selection clipboard promotes v12, rotated/scaled tip artwork must preserve stamp transform; bounds include scatter. image-import mutateReference must preserve higher version to prevent v12 downgrade. Existing storage automatically validates model. Offline assets include modules.

QA: pure malformed masks/options/limits/seed invariance/jitter/pressure/history/portability/selection/reference regressions; real Chromium import/editor/cancel/sections/persistence/per-brush pressure/paint/undo/reload/library independence/offline/reference parity/budgets. All legacy tests and fixed renderer/pixel hashes retained. Same-session verification, no independent approval claim.

Allowed runtime/test paths (cache-only edits to six legacy browser scripts):
- prototypes/browser-workspace/custom-tips.js
- prototypes/browser-workspace/custom-tips-ui.js
- prototypes/browser-workspace/app.js
- prototypes/browser-workspace/u2.js
- prototypes/browser-workspace/model.js
- prototypes/browser-workspace/render.js
- prototypes/browser-workspace/canvas2d-renderer.js
- prototypes/browser-workspace/selection.js
- prototypes/browser-workspace/image-import.js
- prototypes/browser-workspace/index.html
- prototypes/browser-workspace/style.css
- prototypes/browser-workspace/sw.js
- tests/browser-workspace/custom-tips.model.test.mjs
- tests/browser-workspace/custom-tips.browser.cjs
- tests/browser-workspace/render-contract.model.test.mjs
- .github/workflows/browser-workspace.yml
- tests/browser-workspace/history-cache.browser.cjs
- tests/browser-workspace/layer-compositor.browser.cjs
- tests/browser-workspace/pixel-paint.browser.cjs
- tests/browser-workspace/raster-tiles.browser.cjs
- tests/browser-workspace/render-boundary.browser.cjs
- tests/browser-workspace/adjustments.browser.cjs

Allowed docs: this scoped delivery directory and docs/delivery/{PRODUCT_ROADMAP,CURRENT_CHECKPOINT,CONTINUATION_CONTRACT,CODE_STRUCTURE}.md. Publication workflow changes only after green candidate.
Prohibited: graph/.knowledge/knowledge, skills, storage internals, unrelated UI/tool/refactor/dependency rewrites, old fixtures/hash/assertion weakening. Manual diff scope check, not CI enforced.
Execution: commit plan; implement isolated feature/hooks; local model checks; candidate CI all browser/model coverage; review bound artifact/source identities; merge exact tree; pin Pages tested source and compare hosted bytes; update all roadmap/status/structure and receipts retaining every pending row.
