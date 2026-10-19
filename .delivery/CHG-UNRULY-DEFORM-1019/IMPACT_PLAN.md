# DEFORM selection-independent entry
Base main588b734692a9f8c5027f0c46f511b0464a54c595. Owner19-Oct: deform selected area irrespective of region/path/object selection; no selection defaults to entire active layer.

Observed restriction: app passes empty selection for wandRegion; warp/mesh controllers require one raster ID via warpTarget. Editable paths/magnetic ultimately feed the same pixel-region selection, so mode must not change behavior. Prior transform postmerge39206849104 SUCCESS.

Bounded implementation: shared app preparation returns original board plus disposable raster working board/source. Region/path/wand selections reuse prepareRegionTransform and tiled complement; whole objects rasterize only selected active-layer strokes when needed; no selection targets all active-layer strokes. Single selected native raster keeps exact source/guide metadata and existing operation. Both projective Deform and Pattern mesh use this adapter. Apply commits once against original board identity; Cancel/identity preserve originals/history. Selection preparation never autosaves or changes live board. Snapshot bounds, locked/hidden/alpha-lock/stale/no-pigment protection remain. Pixelizing vector selections occurs only on Apply, consistent with raster deformation; independent original objects recover through Undo.

Allowed: prototypes/browser-workspace/{app.js,pattern-warp-ui.js,pattern-mesh-ui.js,sw.js,index.html}; tests/browser-workspace/pattern-warp.browser.cjs and existing files containing exact current offline-cache identifiers (literal updates only); .delivery/CHG-UNRULY-DEFORM-1019/*; docs/delivery/{PRODUCT_ROADMAP,CURRENT_CHECKPOINT,CONTINUATION_CONTRACT,CODE_STRUCTURE}. After green only: .github/workflows/browser-workspace-pages.yml publication pin. Prohibited: model/schema/renderer/warp kernel rewrites, graph/skills, unrelated UI or CI changes.

Regression: region partial pixels preserves complement/other layers; closed editable path and wand same route; direct empty selection all active artwork; vector/multiple object selection preserves unselected objects; native image compatibility; mesh shares preparation; Cancel/no-op exact; Apply single Undo/Redo/reload; stale/locked/hidden/empty/alpha-lock guards and offline source retained. Existing PATB04 empty-layer text expectation and PATB07 no-selection refusal intentionally superseded by explicit fallback requirement; keep negative empty-layer and offline assertions. Full targeted local then cumulative CI and hosted byte verification. Same-session checking, physical-device acceptance remains owner trial. Rollback prior publication pin.

Exact cache-identity test paths (literal-only except focused pattern-warp suite):
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
