# U1 independent adversarial design

Designed 2026-10-06 before builder candidate verification, from DUX1-U1 handoff and accepted handbook baseline. QA session is separate same-model Codex; no different-model runtime exposed. No production application edits by QA. Snapshot has no .git: root must provide candidate commit, plus SHA256 manifest binds executed files. Parent budget overrides generic skill allowance: two source repairs, three CI runs total; zero consumed at design.

## Coverage / attacks

| IDs | Contract | Attack / independent oracle |
| --- | --- | --- |
| UM01–03 | U1-05 | New v3, all eight modes; reject unknown blends, malformed numeric values, preset/recipe fields; legacy v2 upgrade normal without mutating source, imports fresh every identity and preserve geometry/pressure. |
| UM04–07 | U1-02/04 | Insert above active while middle selected, display-independent disk order; duplicate locked layer new IDs/unlocked/preserved style; reject last/locked delete and locked opacity/blend/paint/erase; allow reorder/visibility/name/copy. |
| UM08–10 | U1-02/04 | No-op creates zero history; successful commands one undo; invalid reorder/capacity leave input unchanged; 32-layer/2000-stroke/100000-point boundaries. |
| UB01 | U1-01/02/07 | Desktop1440x950, tablet1024x768, phone390x844: independent collapses, no canvas bounds shift, reachable controls, no enabled fake tools, top-first ID rows, >=56px rows and >=44px targets. Screenshots per size. |
| UB02 | U1-01/02/04 | Keyboard layer actions, locked guards, active ID/order/history, outside dismissal consumes pen click, controls during captured pen cannot mutate layer or toggle overlays. |
| UB03 | U1-03/06 | Independent numeric sRGB eight-mode formula at opaque interiors, opacity once on completed layer; full/reference and retained/live exact equality. Compare legacy fixture separately through inherited P01 frozen oracle. |
| UB04–07 | U1-05 | Seed actual v2/foundation IDB current/previous plus malformed fixtures; originals and meta byte-identical; only v3 target exists; selected source maps; retry never overwrites edits; colliding source IDs get distinct durable mappings; quota interruption commits target+mapping together; retry resumes; damaged source reports warning. |
| UB08 | U1-06 | Count created canvases in real app (five); every setter P01 allocation bound retained; 32 thumbnails80x48 <=512KiB, no penmove regeneration; inherited P01 controller/cache/frame budgets. |
| UB09 | U1-05/07 | Malicious titles render as text, malformed imports reject before replacing current board; inherited CAS/backup/quota/100-board/offline/update evidence. |

## Data and execution

Fixtures deterministic QA IDs, colors #4080c0 / #c08040, centre points away from antialiasing; pressure values null/0/.4/1. Browser contexts isolated per scenario, fresh origin databases, closed after run. Failure screenshots and traces, result JSON, console/request errors, commit and source/test manifests collected. No external application requests permitted. QA fixture writes occur only on isolated localhost/CI origin.

Inherited 24 model/37 browser groups retained. Only explicit obsolete v2/current database or compact UI expectations may change; each replacement documented in U1_QA_COMPATIBILITY.md. Inherited locked-delete expectation is invalid under accepted protective lock: replace with rejection while locked, explicit unlock then deletion; new UM guards preserve stronger protection. Frozen renderer untouched. Existing P01 fixtures lacking blend use normal compatibility; version2 import now tests real v2→v3.

Local environment: Node24.19.0; Playwright1.62.1 available via NODE_PATH; chromium headless executable absent (actual launch probe failed). No packages installed. Model tests can execute locally after candidate identity; browser suites use existing GitHub Actions Chromium fallback. First full CI is held until root/builder source identity. Designed tests are NOT_VERIFIED until actual execution. Physical pen feel remains NOT_VERIFIED.

## Builder interface assumptions

Model retains createBoard/createHistory/layerCommand/command/addStroke/eraseGesture/undo/redo/importDocument/validateBoard. New layers use `blend` with eight named modes; layerCommand adds `duplicate`, `blend`, and `reorder` numeric bottom-first target index. Legacy v2 accepted only via import/migration; validateBoard v3 strictly rejects preset fields. UI stable selectors: #canvas,#save,#layer-list; row `[data-layer-id]`; #layers-toggle and #modifiers-toggle; #layer-opacity,#layer-blend for selected properties. Accessible per-row action menu and reorder controls; #add-layer remains. Storage openStore exposes db/list/load/save/select/last/migrateLegacy; target `unruly-workspace-v3` boards/meta/migrations, key lastBoard retained. Confirm deviations to QA before build completion so tests measure contract without guessed internals.

Additional designed attacks: UB10 real keyboard/grip reorder and opacity multi-input→one change→one Undo; UB11 malformed blend/preset import cannot replace board; UB12 legitimate quote/bracket ID keyboard reorder restores focus safely and doubled root font size rows grow without clipping. UM11 simulates Canvas2D ignoring unsupported composite assignment to require explicit failure/reset. UB01 checks visible toolbar/layer action dimensions >=44px. Existing CI now gathers all independent suites even if an earlier suite fails, preserving bounded three-run diagnostic value; final aggregate exit still fails on any suite failure.
