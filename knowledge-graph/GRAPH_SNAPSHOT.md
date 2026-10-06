# UNRULY Knowledge Graph — Current Snapshot

This is a human-readable navigation/index for the canonical `UNRULY.kgp.zip`. The ZIP remains canonical; this file exists so coding agents can cheaply recover the current graph state before bounded retrieval.

## Current truth

- **Architecture:** browser-first, offline/local-first; native Windows/Android work is historical/optional enhancement, not the primary app direction.
- **Current accepted implementation:** `checkpoint/u2-v0.5.0` at `fd15c607d5b9a605b1e8a1164250803832830591`.
- **Accepted implementation milestones:** U2 v0.5.0, U1 v0.4.0, P01 v0.3.0, vector selection, WB1. P0a native feasibility is historical/superseded.
- **Graph branch:** `knowledge/unruly-kgp`; build branches and `main` are untouched by graph maintenance.
- **Graph update cadence:** after each human review batch of roughly 2–4 accepted checkpoints.
- **Trust rule:** discussed/planned != implemented != verified. Implementation and verification require deterministic repository/test evidence.

## Product capabilities

- **Offline local-first operation** — Core drawing and board editing work without a hosted SaaS backend; local storage is authoritative while offline. `[current]`
- **Infinite canvas** — Infinite pan/zoom workspace with multiple saved boards and finite export/artboard frames when needed. `[current]`
- **Drawing engine** — Pen-first vector and raster drawing with pressure-aware strokes and responsive live ink. `[current]`
- **Brush system** — U2 verified: 12 original immutable presets across Pencil, Pen, Marker and Airbrush; per-preset size/opacity memory/reset; optional v3 preset identity with legacy no-preset rendering compatibility. Watercolour/texture/import remain later. `[verified]`
- **Layer system** — Top-first layers with add-above-active behavior, visibility, opacity, blending, locks, masks and transforms. `[current]`
- **Selection and transform** — Prominent lasso selection with move, copy, cut, paste, delete and explicit transform workflows. `[current]`
- **Gesture system** — Procreate-inspired browser-safe gestures for undo/redo, pan/zoom, eyedropper and held-shape workflows. `[current]`
- **Color system** — U2 verified: hue ring + inner saturation/value disc, precise Hex/H/S/V controls, 12 generated shades, recent colours, saved palette and toolbar current-colour indicator. `[verified]`
- **Effects and fill** — Gaussian blur, HSL-style adjustments and gap-aware raster fill planned with preview/apply/cancel boundaries. `[current]`
- **Whiteboarding objects** — Editable text boxes, sticky notes, connectors and reference images in addition to drawing. `[current]`
- **Timelapse** — Local deterministic process replay and video export; retention/framing details remain unresolved. `[current]`
- **Motion Trace** — Move selected content along paths and audience-view pan/zoom with manual-first playback and optional commit-to-board. `[current]`
- **Import/export and exchange** — Image/PDF-page import, PNG/JPG/PDF export and investigated layered PSD exchange for Procreate/Clip Studio interoperability. `[current]`
- **BYOK AI assistance** — Optional user-controlled AI to summarize/diagram selected ideas and export documents/images after base validation. `[current]`
- **Governed delivery and QA** — Checkpoint-based delivery with independent QA, Gatekeeper review, regression and resumable evidence. `[current]`
- **Performance foundation** — Cached rendering, bounded canvas memory and regression benchmarks to preserve drawing responsiveness. `[current]`
- **Google Drive sync** — Optional authenticated synchronization with conflict preservation; both conflicting revisions are retained for user choice. `[current]`

## UX / product decisions

- **Browser-first architecture** — The browser application is the primary implementation direction. Native Windows/Android enhancements or wrappers may follow later; native-only is historical. `[current]`
- **No required hosted SaaS backend** — Backend test scope refers to document engine, storage, history and adapters rather than inventing a server/database. `[current]`
- **Open-source release** — UNRULY is intended to be open source. License choice remains unresolved. `[current]`
- **Procreate-inspired UX baseline** — Selected Procreate Fundamentals layout and current handbook behavior are the UX reference family, without copying proprietary assets/algorithms. `[current]`
- **Hue disc color picker** — Hue ring plus inner saturation/value disc, with generated shade suggestions and secondary HSL/hex views. `[current]`
- **Pen-first interaction** — Pen draws by default; fingers navigate or invoke gestures. Finger paint is reserved for a future functional Smudge tool. `[current]`
- **Compact icon toolbar** — Dark compact toolbars with original icons; document/actions/selection/transform left and brush/smudge/eraser/layers/color roles right. `[current]`
- **Independent left size/opacity rail** — Narrow size/opacity/undo-redo rail that collapses independently from Layers. `[current]`
- **Compact layers popover** — Topmost-first compact layers UI with add above active, drag reorder, swipe actions and independent collapse. `[current]`
- **Brush library popover** — Implemented and QA-verified two-column category/preset browser with renderer-backed previews, per-preset size/opacity memory and reset defaults. `[verified]`
- **Two-finger single tap Undo** — Confirmed default; supersedes earlier double-tap wording. `[current]`
- **Three-finger single tap Redo** — Confirmed default; separate from two-finger admission. `[current]`
- **Finger stationary hold eyedropper** — Long hold samples the visible composite and commits color on release. `[current]`
- **Pen draw then hold shape recognition** — Line/circle first; held shape can be edited before one document-history commit. `[current]`
- **Two-finger pan/zoom** — Current basic navigation with gesture arbitration. `[current]`
- **Two-finger twist rotate view** — Planned G02 capability; not yet verified. `[planned]`
- **Quick pinch fit artwork** — Planned G02 fit/return-view behavior. `[planned]`
- **Three-finger downward swipe clipboard menu** — Planned G02 geometry clipboard gesture. `[planned]`
- **Four-finger tap hide/show chrome** — Planned browser-safe UI chrome toggle. `[planned]`
- **Three-finger scrub clear layer** — Planned destructive clear gesture with lock guards and one undo. `[planned]`

## Implementation artifacts

- **prototypes/browser-workspace/app.js** — Browser workspace controller and UI interaction orchestration. `[current]`
- **prototypes/browser-workspace/model.js** — Board/document model, commands, history and validation. `[current]`
- **prototypes/browser-workspace/render.js** — Canvas renderer and performance-sensitive drawing replay/cache behavior. `[current]`
- **prototypes/browser-workspace/selection.js** — Selection/lasso geometry and related operations. `[current]`
- **prototypes/browser-workspace/storage.js** — Offline browser storage, migration and persistence logic. `[current]`
- **prototypes/browser-workspace/sw.js** — Offline service worker for browser-first delivery. `[current]`
- **prototypes/browser-workspace/index.html + style.css** — Browser workspace structure and styling. `[current]`
- **tests/browser-workspace/model.test.mjs** — Model tests for board/history/storage behavior. `[current]`
- **tests/browser-workspace/browser.test.cjs** — Browser journeys for the core workspace. `[current]`
- **tests/browser-workspace/selection.test.mjs + selection.browser.cjs** — Model/browser tests for selection functionality. `[current]`
- **tests/browser-workspace/performance.browser.cjs** — Renderer and allocation regression/performance tests. `[current]`
- **tests/browser-workspace/u1.*** — U1 model/browser/compatibility test suite. `[current]`
- ** .github/workflows/browser-workspace.yml** — CI workflow for browser workspace test execution. `[current]`

## Evidence / branches

- **PROJECT_STATE.md** — Project preparation snapshot with requirements, decisions, execution history and open items. `[current]`
- ** .project-governance/state.yaml** — Machine-readable delivery/governance state. `[current]`
- **PROCREATE_HANDBOOK_UX_BASELINE.md** — Authoritative Procreate handbook research amendment and delivery mapping. `[current]`
- **U1_CANDIDATE_REVIEW.md** — Checkpoint candidate review and evidence summary. `[current]`
- **PERFORMANCE_FINAL_GATEKEEPER.md** — Gatekeeper verdict/evidence for P01 performance checkpoint. `[current]`
- **.knowledge/delta-vector-selection.json** — Incremental knowledge delta for vector selection milestone. `[current]`
- **.knowledge/delta-drawing-ux-plan.json** — Incremental knowledge delta for drawing UX batch planning. `[current]`
- **.knowledge/delta-procreate-handbook.json** — Incremental knowledge delta from handbook review. `[current]`
- **Design Offline Whiteboard conversation** — Human design decisions and product intent recovered from prior ChatGPT conversation. `[current]`
- **main** — Historical default branch; does not contain the latest browser build lineage. `[historical]`
- **preview/vector-selection-2026-10-06** — Selection milestone branch; accepted as an implemented milestone but not latest lineage. `[accepted]`
- **checkpoint/p01-v0.3.0** — Named pointer to exact tested P01 source. `[accepted]`
- **checkpoint/u1-v0.4.0** — Accepted U1 exact tested pointer (`699d6fb...`): 35/35 model and 53/53 browser groups PASS. `[accepted]`
- **checkpoint/u2-v0.5.0** — Current accepted exact tested pointer (`fd15c607...`): 41/41 model and 58/58 browser groups PASS. `[accepted]`
- **preview/drawing-ux-u2-2026-10-06** — Working U2 branch; checkpoint pointer is authoritative for the accepted build. `[current-workline]`
- **knowledge/unruly-kgp** — Dedicated branch for portable knowledge graph package; build branches remain untouched. `[current]`

## Open questions

- **Physical pen feel verification** — Synthetic/browser QA does not prove Surface/Xiaomi handwriting feel, palm rejection or device-specific pen behavior. `[open]`
- **Android packaging/runtime** — Browser-first is current; Android packaging/enhancement approach still needs future evidence. `[open]`
- **Open-source license** — Open-source intent is confirmed but exact license remains unresolved. `[open]`
- **Procreate brush import fidelity** — No lossless proprietary format promise; schema/asset-rights investigation required. `[open]`
- **Layered exchange fidelity** — PSD is the recommended investigation route; round-trip fidelity for vectors/text/masks/blends remains unproven. `[open]`
- **Drive OAuth/release setup** — Scopes, credentials and production release setup remain unresolved. `[open]`
- **BYOK AI provider support** — Provider/capability/CORS/key-handling details remain unresolved. `[open]`
- **Timelapse framing/retention** — Storage growth, framing and retention policy remain unresolved. `[open]`

## Implementation / evidence links

- Browser-first architecture — **SUPERSEDES** → P0a native pen feasibility
- WB1 browser workspace — **DEPENDS_ON** → P0a native pen feasibility
- Vector selection checkpoint — **DEPENDS_ON** → WB1 browser workspace
- P01 v0.3.0 performance checkpoint — **DEPENDS_ON** → Vector selection checkpoint
- U1 compact reference UI and layers — **DEPENDS_ON** → P01 v0.3.0 performance checkpoint
- U2 brush library and color — **DEPENDS_ON** → U1 compact reference UI and layers
- U3 core gestures and geometry — **DEPENDS_ON** → U2 brush library and color
- G02 remaining reference gestures — **DEPENDS_ON** → U3 core gestures and geometry
- WB1 browser workspace — **IMPLEMENTED_BY** → prototypes/browser-workspace/app.js
- WB1 browser workspace — **IMPLEMENTED_BY** → prototypes/browser-workspace/model.js
- WB1 browser workspace — **IMPLEMENTED_BY** → prototypes/browser-workspace/render.js
- WB1 browser workspace — **IMPLEMENTED_BY** → prototypes/browser-workspace/storage.js
- WB1 browser workspace — **IMPLEMENTED_BY** → prototypes/browser-workspace/sw.js
- WB1 browser workspace — **IMPLEMENTED_BY** → prototypes/browser-workspace/index.html + style.css
- Vector selection checkpoint — **IMPLEMENTED_BY** → prototypes/browser-workspace/selection.js
- Vector selection checkpoint — **IMPLEMENTED_BY** → prototypes/browser-workspace/app.js
- Vector selection checkpoint — **IMPLEMENTED_BY** → prototypes/browser-workspace/model.js
- P01 v0.3.0 performance checkpoint — **IMPLEMENTED_BY** → prototypes/browser-workspace/render.js
- P01 v0.3.0 performance checkpoint — **IMPLEMENTED_BY** → tests/browser-workspace/performance.browser.cjs
- P01 v0.3.0 performance checkpoint — **IMPLEMENTED_BY** →  .github/workflows/browser-workspace.yml
- U1 compact reference UI and layers — **IMPLEMENTED_BY** → prototypes/browser-workspace/app.js
- U1 compact reference UI and layers — **IMPLEMENTED_BY** → prototypes/browser-workspace/model.js
- U1 compact reference UI and layers — **IMPLEMENTED_BY** → prototypes/browser-workspace/render.js
- U1 compact reference UI and layers — **IMPLEMENTED_BY** → prototypes/browser-workspace/storage.js
- U1 compact reference UI and layers — **IMPLEMENTED_BY** → prototypes/browser-workspace/index.html + style.css
- U1 compact reference UI and layers — **IMPLEMENTED_BY** → tests/browser-workspace/u1.*
- Infinite canvas — **IMPLEMENTED_BY** → prototypes/browser-workspace/app.js
- Drawing engine — **IMPLEMENTED_BY** → prototypes/browser-workspace/app.js
- Layer system — **IMPLEMENTED_BY** → prototypes/browser-workspace/app.js
- Selection and transform — **IMPLEMENTED_BY** → prototypes/browser-workspace/app.js
- Gesture system — **IMPLEMENTED_BY** → prototypes/browser-workspace/app.js
- Color system — **IMPLEMENTED_BY** → prototypes/browser-workspace/app.js
- Performance foundation — **IMPLEMENTED_BY** → prototypes/browser-workspace/app.js
- Drawing engine — **IMPLEMENTED_BY** → prototypes/browser-workspace/render.js
- Selection and transform — **IMPLEMENTED_BY** → prototypes/browser-workspace/selection.js
- Offline local-first operation — **IMPLEMENTED_BY** → prototypes/browser-workspace/storage.js
- Offline local-first operation — **IMPLEMENTED_BY** → prototypes/browser-workspace/sw.js
- tests/browser-workspace/model.test.mjs — **SUPPORTS** → WB1 browser workspace
- tests/browser-workspace/browser.test.cjs — **SUPPORTS** → WB1 browser workspace
- tests/browser-workspace/selection.test.mjs + selection.browser.cjs — **SUPPORTS** → Vector selection checkpoint
- tests/browser-workspace/performance.browser.cjs — **SUPPORTS** → P01 v0.3.0 performance checkpoint
- tests/browser-workspace/u1.* — **SUPPORTS** → U1 compact reference UI and layers
- UNRULY — **SOURCED_FROM** → PROJECT_STATE.md
- UNRULY — **SOURCED_FROM** →  .project-governance/state.yaml
- UNRULY — **SOURCED_FROM** → PROCREATE_HANDBOOK_UX_BASELINE.md
- UNRULY — **SOURCED_FROM** → U1_CANDIDATE_REVIEW.md
- UNRULY — **SOURCED_FROM** → PERFORMANCE_FINAL_GATEKEEPER.md
- UNRULY — **SOURCED_FROM** → .knowledge/delta-vector-selection.json
- UNRULY — **SOURCED_FROM** → .knowledge/delta-drawing-ux-plan.json
- UNRULY — **SOURCED_FROM** → .knowledge/delta-procreate-handbook.json
- UNRULY — **SOURCED_FROM** → Design Offline Whiteboard conversation
- Procreate-inspired UX baseline — **SOURCED_FROM** → PROCREATE_HANDBOOK_UX_BASELINE.md
- P01 v0.3.0 performance checkpoint — **SOURCED_FROM** → PERFORMANCE_FINAL_GATEKEEPER.md
- Vector selection checkpoint — **SOURCED_FROM** → .knowledge/delta-vector-selection.json
- U1 compact reference UI and layers — **SOURCED_FROM** → U1_CANDIDATE_REVIEW.md
- U2 brush library and color — **IMPLEMENTED_BY** → prototypes/browser-workspace/brushes.js
- U2 brush library and color — **IMPLEMENTED_BY** → prototypes/browser-workspace/u2.js
- U2 brush library and color — **SUPPORTED_BY** → tests/browser-workspace/u2.model.test.mjs
- U2 brush library and color — **SUPPORTED_BY** → tests/browser-workspace/u2.browser.cjs
- U2 brush library and color — **SUPPORTED_BY** → GitHub Actions run 37474125489
- knowledge/unruly-kgp — **DEPENDS_ON** → checkpoint/u2-v0.5.0

## Required continuation behavior

- Before coding, retrieve only the relevant capability/checkpoint/evidence neighborhood rather than rescanning the entire repository.
- Preserve contradictions and superseded decisions; never erase history to make the graph look clean.
- At batch review, merge checkpoint deltas, regenerate both `graph-explorer.html` and `OnAir - unruly.html`, validate, run Scope Guard, update the package, and append changelog.
- A later Graphify/AST pass should enrich implementation detail when deterministic repository materialization is available; it must not replace the concept-first product graph.


## Review batch update — U1 + U2 — 6 October 2026

- U1 accepted at `699d6fb29b2debe1ad3721a2c7a3ee86bd374792`; CI run `37468847640`; 35/35 model + 53/53 browser groups PASS.
- U2 accepted at `fd15c607d5b9a605b1e8a1164250803832830591`; CI run `37474125489`; artifact `11419065857`, SHA-256 `619a805dc99c3acca642e71f3873ec6e005432cc1d0a19cad5e26d563cd75d0c`; 41/41 model + 58/58 browser groups PASS.
- U2 CI2 exposed a genuine missing shared size/opacity state handler. Source repair 1 restored the inherited control contract and per-preset persistence; CI3 proved both U2 and inherited eraser behavior.
- U3 remains planned. Physical pen feel remains NOT_VERIFIED.
