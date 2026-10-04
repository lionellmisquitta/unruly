# UNRULY browser-first execution baseline

Plan UNRULY-WEB-2026-10-04-R2. Supersedes native-first delivery decisions in R1, not its feature requirements or historical evidence. Lionell explicitly chose GitHub Pages browser delivery on 4 October 2026 and authorized starting here at 10:33 IST. Review before code remains mandatory. Production/main/release authorization remains false until an independent current verdict.

## Confirmed direction and preservation
Primary experience: open https://lionellmisquitta.github.io/unruly/ -> draw with no app account/install -> local autosave -> reopen boards. Chrome on Windows Surface/Lenovo pen and Xiaomi Android is the initial browser target. Offline editing becomes available only after successful app caching; Drive and AI require connectivity. Native Windows/APK enhancements deferred, not parallel replacement apps. MIT original code; third-party notices retained. No proprietary assets copied.

Existing private personal repository lionellmisquitta/unruly only. Immutable source baseline e7a408d0348ca436771fee41330436dc73d1d48f; no edits to main, organizational GitLab or user checkout. User created a linked Windows worktree and launched a locally compiled native diagnostic; pressure/ink fidelity and exact local binary identity remain unverified. CI native evidence remains separate. Original P0a two repair cycles used, Windows nine-case blocked regression and Android native obligations preserved as historical native-lane results, not browser acceptance.

## Complete release map
The R1 requirement register REQ-001..017 and REQ-SUP-001 remains authoritative for capabilities. Browser-specific data/integration/packaging changes replace native mechanics through this decision delta.

| Batch | Checkpoints and result | Browser adaptation |
|---|---|---|
| 1 | C01 reproducible build/QA/publication, C02 boards/drawing/save recovery, C03 view/history/gestures | Static app, browser pen adapter, bounded document store, offline worker; Surface/Xiaomi feel review |
| 2 | C04 brushes/smudge, C05 layers/masks/colour/paper/artboards, C06 selection/vector/held shapes/ruler, C07 gap-fill/blur/textures | Measured tiled GPU/worker renderer; original assets; no unlimited-memory claims |
| 3 | C08 text/notes/connectors, C09 images/PDF/reference, C09M Motion Trace, C10 finite export/interchange/timelapse | Browser decoding/export with explicit limits; native formats/brush fidelity experimental, real roundtrips required |
| 4 | C11 Drive/conflicts, C12 selected-content BYOK, C13 DOCX/PDF/JPG and full regression | Optional browser OAuth, network queue/revision conflicts; provider CORS verified per adapter; no cloud promise for offline mode |

Fourteen product checkpoints remain planned, zero closed. First packet below is a usable quarantined browser foundation preview, not silent production promotion or full checkpoint closure. It supplies actual evidence to unblock browser architecture and storage readiness. No internal checkpoint requires continuous user monitoring; only four batch cards and necessary hardware/permission decisions.

## First packet WEB-F1: scope/ready contract
Classification: bounded pre-build /prototypes browser foundation feasibility. Standard product risk maintained; this packet excludes external data transmission/imports/credentials. Request independent permission for named paths before any source/test implementation.

Allowed paths: prototypes/browser-foundation/{index.html,style.css,model.js,app.js,sw.js,manifest.webmanifest,icon.svg,README.md}; QA owns tests/browser-foundation/*; bounded .github/workflows/browser-foundation.yml; docs/delivery/*, append-only PROJECT_STATE.md/.project-governance/state.yaml and .knowledge/delta-browser-foundation.json. No production src writes or merges. Branch preview/browser-foundation-2026-10-04 from e7a408d. Browser preview contains no board data in its published files.

### Locked bounded UX proposal for independent review
First visit opens an empty canvas immediately. Header: board title, save state, New, Boards, Undo, Redo, Export. Narrow rail: Pen, Eraser (whole-stroke in this preview), Pan, colour and size. Main canvas occupies remaining screen; fit layout supports 360px width and tablets. Boards drawer lists local boards with Open and Rename; no deletion in this packet. No unrequested login/dialog or advertising. Clearly mark Foundation preview; supported tools and limits visible in About/help, not scattered implementation jargon.

Pen draws, mouse may draw as explicit mouse input; mouse pressure is unavailable, never claimed pen pressure. Finger navigates, never inks in initial preview. Two-finger pan/pinch with pointer identity; visible undo/redo and keyboard Ctrl/Cmd+Z/Shift+Z, temporary Space-pan, wheel zoom anchored at cursor. Pen cancellation/focus loss drops unfinished stroke; touches arriving during pen contact do not mutate pen samples. Pencil/watercolor/layers/hold-recognition/gesture double-taps are later checkpoints, not implied by icons. Colour and size controls apply to the next stroke.

Drawing field uses document coordinates and view transform; fixed desktop canvas screenshot is not infinite-board proof. Two separated pen contacts remain separate history transactions. Pressure width when pointerType=pen uses browser-reported values; browser may supply constant/default pressure, so device acceptance requires a measured changing value. Initial pointerup-coordinate handling must preserve final point without assuming pressure exists.

### Domain/data contract
One original pen brush, vector stroke records with stable IDs, per-point x/y/pressure availability. Board version1, stable board ID/title/revision, strokes and colour/size; viewport ephemeral. Limit100 boards, 2000 strokes/board, 100000 points/board, serialized board <=8MiB; numeric coordinates finite and abs<=1e7, size1..40, bounded title128 characters. No user file import in this packet. Rendering bounded visible strokes; no production GPU/smudge claim. New board commits only after storage success so prior board persists.

Undo/redo whole stroke/whole-stroke eraser as immutable operations; canceled stroke adds no history. A new edit after undo clears redo. Save committed snapshots only; IndexedDB transaction completes before Saved locally. Last good revision retained in same transaction. Display Saving, Saved locally, Save failed; never say saved merely after enqueue. Save errors leave editable in-memory board and explicit Export recovery. Export validated JSON board file; local storage is not a guaranteed backup and clearing site data can remove it. Request persistence where supported, never claim grant without result. Board load validates before render, falls back to last validated revision and informs user; corrupt current data never silently becomes blank saved board. Concurrent-tab edits require explicit conflict detection or a single-writer ownership guard; never blind last-writer overwrite. No storage/schema migration of prior native files.

### Offline/update contract
Service worker scope relative to /unruly/, cache only exact app assets; no secrets/private boards cached in app assets. First install remains unavailable offline until complete. No automatic skipWaiting/clients.claim during editing. New worker waits; provide Reload to update after current commit durably saved. Test actual same-origin reload offline and board retention; no CDN/runtime network dependencies. Static-cache version pins files; storage version compatibility explicit. HTTPS/localhost required; loose file:// is not this target.

### Architecture/security/integrations
ES modules, no app runtime packages initially. Drawing/history/validation pure model separated from pointer/render and IndexedDB persistence; Canvas2D for measured foundation only, GPU/WASM candidates remain benchmark-gated before painting stage. No server database or Docker requirement for static runtime; local HTTP test server plus isolated browser fixtures is equivalent boundary, pending Gatekeeper disposition. Synthetic stores/adapters in QA; no Drive/API/AI network calls. Full G09 integration sims readiness required before C11/C12, not invented as first-packet passes. DOM textContent for user titles, no innerHTML injection, no analytics/remote fonts. Page publication reveals app source and synthetic assets, never native evidence, private skills, credentials or boards. Public preview hosting explicitly follows user URL choice; repository visibility stays private.

### Tests and acceptance
WEB-AC01 loads canvas with visible reachable controls and no login. AC02 pen samples/pressure and real changing device pressure distinguished. AC03 separate stroke/hover/cancel/history invariants. AC04 pointer identity and touch navigation, finite transforms and anchored zoom. AC05 board save completion/reopen/recovery/quota error; no lost committed data. AC06 undo/redo/erase/current tool isolation. AC07 New/gallery/rename/export and malformed stored data. AC08 cached offline reload and pending-update safety. AC09 desktop/mobile pointer, keyboard/layout accessibility. AC10 exact source/build/browser identities, independent QA/code/security review and reviewed publication; no production closure from branch-only green.

QA independently authors Node unit tests plus Playwright Chrome journeys, synthetic pressure events labeled synthetic, storage fault/corruption/concurrency tests, offline reload, screenshot/console evidence at desktop and tablet sizes. No backend/API/database-server tests are applicable because this packet has no such runtime; IndexedDB integration is mandatory. No AI browser model repeated calls. Live device pen and feel remain NOT_VERIFIED until Lionell uses URL.

### Deployment, budget and rollback
Actual repository has_pages=false on inspection. Connector exposes no Pages setup operation; workflow GITHUB_TOKEN does not provide automatic site-enablement administration. Do not turn repository public, buy Pro, invent a deployed URL or bypass connector limits. Build/review entire candidate and pipeline before asking user for one concrete settings step if needed. GitHub Pages private-repo availability depends on owner plan, not inferred from repo.permissions.admin. Use known reviewed pinned official actions, read-only token for QA; separate deploy job pages:write/id-token:write only after independent QA and reviewed candidate. No admin enablement token/secrets. One branch scoped CI run <=10min; no public deployment of repository root.

External paid model subprocess/API calls0; deterministic tests preferred. Initial implementation plus one independently bounded repair if needed; original cumulative P0a repair budget not reset by naming WEB-F1. If attributed to same P0a only one remains; Gatekeeper must explicitly classify. Stop after reviewed preview/hosting blocker; never automatically start advanced batch. Preserve saved native evidence.

Rollback: published app asset version rolled back only after storage compatibility check; retain board snapshots and exports. Source remains isolated branch. No forced refs/reset/clean. Actual QA result then Gatekeeper disposition then evidence/decision graph delta. Product G00-G14 remains open until scope-specific real evidence/accepted risks; none closed by this document. User start authorizes preparation and reviewed quarantine lane, not production-before-review.

## Immediate order
1 Independent review of R2 direction, bounded UX/data/security/deployment and WEB-F1 readiness.
2 Only if permitted: implement one foundation candidate, independent QA tests, bounded CI if local Chrome unavailable.
3 Actual evidence back to Gatekeeper; fix only diagnosed defects within allowance.
4 Curated candidate publication/URL verification if Pages available; otherwise concrete one-time setup handoff after tested candidate exists.
5 Human Surface/Xiaomi three-task card before architecture lock and subsequent product batch.
