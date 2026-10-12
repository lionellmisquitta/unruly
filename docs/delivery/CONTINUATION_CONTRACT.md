# UNRULY continuation contract
Read this file first, then verify current main HEAD/latest cumulative CI (docs-only heads may not start QA) and read only affected code/tests. Historical delivery reports are evidence on demand; no full chat or graph reload is required.

## Binding delivery rules
- One cumulative browser product: `main`, https://lionellmisquitta.github.io/unruly/ . Bounded CHG branches; verify exact source before merge/publication; pin immutable green source and compare hosted bytes.
- Native former main archived at `archive/native-main-2026-10-11`; browser-main promotion explicitly superseded native-main restriction. No history rewriting.
- Knowledge graph updates/regeneration prohibited without explicit user permission. Current canonical graph head093d8735b427c3d4b5e1c5d892917609f96fa25c; routine builds update this compact contract and scoped QA receipts only.
- Preserve regression assertions, cumulative features and existing document/layer/history/cache limits. Physical tablet/50-layer/process-RAM claims require measured evidence. No unsolicited GPU/Rust/OPFS rewrite.

## Current build contract — WAND1 (verified and published)
Base mainf5f2dfa622d820758954c73c7a126eb4e6fb3d9e; main CI38164946268 SUCCESS verified before changes. Last published IMPORT1 sourceb09e3ff9723e645d650ec527bbcda0ca87ef488e; CI38164051738 SUCCESS240 models/232 structured Chromium scenarios/101 hashes; Pages38164991780 SUCCESS37 hosted assets.
Scope: active original-layer pixel magic wand; tolerance0–100; four-neighbour contiguous/all-matching; replace/add/subtract; mask overlay; copy/cut/delete and existing Transform preview/Apply/Cancel. Pen/mouse selects, touch navigates. Selection view state, no conversion on selection/Cancel; pixel edit rasterizes layer undoably. Transparent regions bounded by source. Paper/reference/layer-mask/clipped output excluded. Paint is not yet constrained by selection.
Affected files: wand.js, app.js, index.html, style.css, sw.js; new model/browser tests and cumulative workflow. Reuse selection.js/model.js/storage.js/renderer unchanged.1024side/1MP source; document8MiB/layers32/history16MiB/renderer80MiB unchanged. Read `.delivery/CHG-UNRULY-WAND1-1012/` only for detailed scope/tests/evidence.
Acceptance: selections leave document untouched; exact connectivity/alpha/add/subtract; stale/lock/cap refusal atomic; copy crop; one Undo restores original objects after delete/transform; Cancel/identity Apply exact; save/offline after edits; original allocation/pixel/cache regressions pass. Verified source`15bab9bf876fae52b2695d437c2ff41966cb3b23`; CI38211778020 SUCCESS251 models/241 structured Chromium scenarios/104 hashes. PR5 merge`825b0975d8511357c289a10b03c8e47f44242078`; Pages38213175632 SUCCESS38 hosted assets matched. Main repeat CI38213066712 in_progress; check current provider before next code changes. See WAND1 QA_REPORT.md/PUBLICATION_RECEIPT.json only when evidence is needed.

## Remaining core roadmap after WAND1
1. Magnetic selection + editable pen/path precision selection (split if needed).
2. Paint bucket + gap-aware fill.
3. Lasso fill + enclose-and-fill.
4. Hue/saturation + levels, including group adjustments.
5. Curves + Gaussian blur.
6. Textured brushes: image tips/grain/splatter/sprinkle.
7. Larger-document performance/recovery: real30–50-layer folders/masks/images stress and measured capacity decisions.
Estimate7 further grouped builds, potentially7–9 if selection/performance splits; no fixed deadline or speed guarantee. Selection precedes all fill checkpoints.
Later: whole-canvas rotation (deferred), canvas size/DPI/export, proprietary brush-import feasibility, advanced wet media, sync/recovery, timelapse/native feasibility.

## Pending decisions — resolve only when their checkpoint begins
- Precision tool: magnetic edge cost/snap UX, editable path handles, raster versus object selection interoperability.
- Fill: target active/visible composite; gap tolerance semantics, clip/mask interaction and traversal budget; paint-to-selection behaviour.
- Group effects/masks: pass-through versus isolated composition, folder masks, effects order and clipping semantics.
- Capacity: measured real-device latency/RAM/undo budgets before raising32 layers or1024 pixel-region cap; GPU/Rust/OPFS only after bottleneck evidence.
- Texture/proprietary brushes: supported formats/settings and representative files before fidelity claims; deformation later.
- Text: custom fonts/wrapping/portable fidelity later; current generic device fonts vary.

## Continuation status
Completed cumulative: brushes/pressure/0–100 size/comparison/recipes; shapes/picker/pen mapping; lasso/layer transforms; performance foundation; raster painting+smudge; folders; leaf masks; clipping+alpha lock; text; images/patterns/reference imports; magic wand pixel regions.
Graph unchanged.6 completed feature builds since last approved refresh. Next action: scope magnetic selection + editable pen/path precision selection, resolve its pending interaction decisions, implement bounded changes, verify and publish same URL; update only this contract/compact receipts. Never infer graph permission from build count.
