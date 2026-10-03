# UNRULY — Preparation Snapshot

Status: discovery in progress; not a coding authorization or complete blueprint.
Updated: 3 October 2026, Asia/Kolkata.

## Objective
Open-source personal drawing and whiteboarding application for Windows and Android. Offline editing and local storage are core. Google Drive sync is included in the first release. No app account is required for local use; Google authorization is required only for Drive access.

## Confirmed decisions
GDEC-001: Windows distribution is a portable folder containing an executable and bundled dependencies; no installer. This supersedes the tentative single-HTML-file direction.
GDEC-002: Android APK distribution is acceptable.
GDEC-003: Painting and whiteboarding are equally important in release one.
GDEC-004: Personal use across devices; collaborative editing is outside release one.
GDEC-005: Open-source release; license remains undecided.
GDEC-006: Smooth, responsive pen interaction is a primary release criterion.
GDEC-007: Prepare requirements, architecture, UX, tests and automation before production coding.
GDEC-008: Independent cross-model QA is desired: Codex builder with Claude Code QA, or the reverse. Gatekeeper reviews before merge; merged build receives regression tests.

## Hardware supplied by user
Windows Surface and Surface Pen; Lenovo MT14 with pen attached as a second screen (main whiteboarding surface); Xiaomi Pad with Xiaomi Pen. Screenshot now confirms Surface Pro 9, Intel Core i7-1265U, 32 GB RAM at 5200 MT/s and Intel Iris Xe Graphics. User confirms 64-bit Windows OS. Android target is Xiaomi Pad 7 Pro; manufacturer specifications confirm Snapdragon 8s Gen 3, 8/12 GB LPDDR5X variants, 11.2-inch 3200 x 2136 display, up to 144 Hz refresh and listed 240 Hz pen sampling. User RAM variant, current Android version, exact pen model, display mode and Lenovo connection details remain unverified. Manufacturer URL: https://www.mi.com/global/product/xiaomi-pad-7-pro/specs/

## Required capabilities
REQ-001 Infinite canvas, zoom, pan, multiple saved boards, cut/copy/paste, lasso, ruler, eraser.
REQ-002 Vector and raster drawing on one board; editable curve control points and dedicated curve pen tool.
REQ-003 Pen, pencil, marker, airbrush, watercolour, imported texture brushes.
REQ-004 Layers, clipping masks, transparency/opacity and blending modes; brush size and opacity controls, layer transforms.
REQ-005 Pressure-sensitive drawing and adjustable stabilization for handwriting.
REQ-006 Two-finger double tap undo, three-finger double tap redo, stationary hold colour picker and held-stroke endpoint shape/line recognition (GDEC-016).
REQ-007 Gaussian blur and gap-aware paint bucket inspired by Clip Studio Paint.
REQ-008 Colour wheel, hue/saturation controls and different paper options; review Concepts colour/workspace UX alongside Procreate and HiPaint.
REQ-009 Local timelapse recording and video export; framing and retention remain unresolved.
REQ-010 Google Drive synchronization with local offline work.
REQ-011 Optional BYOK AI to summarize/diagram selected ideas and export DOCX, PDF, JPG. Included in first release after base validation (GDEC-010); provider support remains unresolved.
REQ-012 Automated checkpoint coding, adversarial frontend and backend/engine tests, Gatekeeper review, merge and merged regression, with resumable state.

## Proposed architecture, not yet locked
Shared drawing/document engine with platform-specific Windows and Android input, filesystem, credentials, rendering and packaging adapters. Evaluate mature graphics libraries before writing a paint engine. Maintain separate vector and raster layers, document-space coordinates, spatial indexes and tiled rendering. Keep live ink independent of autosave, sync, AI, fill/blur and timelapse export. Browser packaging is no longer the preferred deployment direction. Native input behaviour must be measured before choosing the runtime.

Local document storage is authoritative while offline. Drive is a synchronization adapter. Preserve conflicting revisions instead of silent overwrites. Include local recovery and portable board export. Paper appearance, drawing grid, export background and brush grain are separate concepts. Painting simulation must define whether paper affects pigment or is only visual.

No hosted SaaS backend is required by the product concept. Backend tests refer to the document engine, storage, history, synchronization and integration adapters; do not invent a server/database merely to create backend tests.

## Proposed unattended orchestration
A local controller invokes authenticated CLI tools; VS Code extensions alone are insufficient. Controller validates checkpoint state and exact commit identity. Builder works in a checkpoint worktree. QA runs independently, owns tests/fixtures/evidence, and cannot repair production source. Builder receives reproducible defects; at most three repair/retest cycles. Gatekeeper checks code, security, UX, traceability and evidence. Accepted checkpoints merge locally to the integration branch, then merged-build regression runs. Failure stops further checkpoints and preserves evidence and rollback identity. A protected reviewed result is required before main advances.

Timeouts, token/cost budgets, retry limits, process supervision, structured JSON validation and stop/resume rules are required. Agent claims cannot substitute for command exit status and artifact verification. Public publication, release uploads and credential management are separate actions from local checkpoint merges.

## QA plan
Frontend: tools/panels, pressure settings, gesture arbitration, selection/transforms, layer controls, colour and paper controls, accessibility and display scaling. Native-app test adapters must fit the chosen stack; use Playwright only where there is a web UI.
Engine: vector intersections and cutting, point deletion, pressure interpolation, curve smoothing, tile seams, blend/mask reference images, fill gaps and boundaries, undo/redo and replay determinism.
Storage/integration: malformed board files, crash recovery, atomic saves, version compatibility, offline queue, OAuth expiration, Drive failures/conflicts and interrupted transfers. External APIs use sanitized samples and simulated adapters.
Timelapse: deterministic replay, framing, interrupted export, storage growth and drawing latency while recording.
Performance: frame-time percentiles, input-to-visible latency, dropped samples, fast strokes, long sessions, large boards and concurrent background activity. Thresholds are not yet locked.
Physical-device tests: pen hover/pressure/tilt when supported, palm rejection, display changes, Lenovo input connection, DPI scaling and actual handwriting feel. Synthetic tests do not verify these.

## Historical checkpoint sketch — superseded by docs/review/CHECKPOINT_PLAN.md
P0 Quarantined hardware/ink feasibility experiment before runtime selection.
C0 Reproducible development environment, platform builds and controller authentication preflight.
C1 Portable Windows/APK shell, local board create/save/reopen and recovery.
C2 Vector/raster input, pressure, navigation and undo/redo with performance tests.
C3 Layers, masks, colour, paper, textured brushes and composition.
C4 Selection, curve/node editing, vector eraser, shape recognition, gap-aware fill and blur.
C5 Drive authorization, offline queue, sync conflicts and recovery.
C6 Timelapse and exports; AI is included after base validation.
C7 Packaging, real-device evidence, merged regression and release readiness.
All checkpoints are proposed; no production build has been authorized.

## Open preparation items
Exact target hardware and minimum supported devices; runtime/library feasibility; UX baseline; board/history format and timelapse retention; fill/blur bounds; brush fidelity targets; AI providers/scope; Drive scopes and OAuth release setup; license; performance thresholds; automation permissions/budgets; local CLI authentication; native UI test harness and physical-device evidence.

## Evidence
Relevant official documentation reviewed:
https://help.procreate.com/procreate/handbook/interface-gestures/gestures
https://help.procreate.com/procreate/handbook/5.4/brushes/brush-studio-settings
https://help.clip-studio.com/en-us/manual_en/240_brushes/Eraser_tools.htm
https://help.clip-studio.com/en-us/manual_en/420_fill/Advanced_Fill.htm
https://www.aige-hipaint.com/support/manual (detailed manual body unavailable to retrieval)
https://concepts.app/en/manual/colors
https://concepts.app/en/manual/settings
https://code.claude.com/docs/en/headless
https://developers.openai.com/codex/noninteractive

Current execution environment contains neither codex nor claude on PATH. This does not establish availability on the user's Windows laptop. No external coding model, production build, hardware test or automated merge has been run.

## Continuation
Read this file and .project-governance/state.yaml first. Preserve confirmed product scope. Continue one-question discovery only for material choices. Do not treat this snapshot as an approved UX baseline or BUILD_AUTHORIZED evidence. Next: complete runtime feasibility and pre-build decisions.

## Incremental knowledge graph — newly confirmed requirement
REQ-013: Maintain the project knowledge graph during design and coding, not retrospectively at release. Graph Generator capture mode is active. This snapshot includes an initial capture delta and update protocol, not a validated full KGP export or viewer package.

Requirements and confirmed decisions are sourced from conversation. Implementation relationships are created only when code exists; verification relationships reference actual test evidence and exact commit/build. Proposed, implemented, verified, failed and superseded remain distinct. Knowledge graph is an index over authoritative requirements, governance, source and evidence, not a replacement authorization ledger.


## Subsequent confirmed decisions — 3 October 2026
GDEC-009: Human review occurs in batches of approximately 2–4 checkpoints, not after every checkpoint. Each checkpoint still receives independent automated tests, documentation, Gatekeeper review, integration and merged regression. Human reviews judge pen feel and task usability. Dependent batches wait for required human feedback.
GDEC-010: AI summarization/diagramming is included in release one, after validation of base features.
GDEC-011: Default pen draws; fingers navigate and invoke gestures. User rarely uses fingers except for smudging.
GDEC-012: Include smudge/blending brush using documented Procreate interactions: shared Paint/Smudge/Erase brush library; size and strength controls; hold tool icon to transfer brush settings. Exact rendering parity remains unverified. Active-raster-layer operation is the proposed implementation boundary, not a newly confirmed vendor specification.
GDEC-013: Experimental Procreate brush import is accepted after native brush validation. Flag unsupported settings and preview results; no universal fidelity promise.
GDEC-014: Both image and selected PDF-page import are included.
GDEC-015: Editable text boxes, sticky notes and attached connectors are included. Text supports font and size changes.
REQ-014: Reference image box, colour picker, good inking pens, long-touch colour sampling, Concepts-inspired colour shades/palettes and transient pop-out controls.
REQ-015: Canvas/artboard dimensions and DPI controls.
REQ-016: Exchange artwork with Clip Studio Paint and Procreate. Native-format or PSD route is not yet approved.

## Researched exchange recommendation — proposed, not approved
Use finite artboards/selected areas for layered PSD import/export, preserving the app-native board as the editable master. PSD is documented by Adobe and supported by both target applications. Round-trip raster layers and appearance must be tested; do not promise preservation of vector nodes, native brushes, timelapse, editable text, all masks or blend effects. Procreate documents rasterizing vector/text layers on PSD import. Native .clip/.procreate support is a separate feasibility task: community reverse-engineered documentation/parsers exist, but vendor-supported write specifications were not found in this research.

## Gesture rationale — confirmed by GDEC-016
A stationary finger hold invokes the eyedropper; drawing a stroke and holding at its endpoint invokes shape recognition. These distinguish colour sampling from the user's earlier generic long-press shape request. Finger-smudge mode must arbitrate a stationary hold versus moving smudge input; colour-picking delay is configurable. A shape tool remains explicitly accessible.

## Proposed additional UX defaults
Reference panel is movable, resizable and optionally docked; independently zoom/pan and sample colours. Paper appearance, grid and export background are separate. Infinite board remains unbounded; finite named artboards define pixels, physical dimensions and DPI. Altering DPI metadata alone does not resample raster content. Original inking presets proposed: technical fineliner, pressure-sensitive studio ink, textured dry ink, brush pen and monoline.

## Additional official research
https://concepts.app/en/manual/colors
https://concepts.app/en/manual/workspace
https://help.procreate.com/procreate/handbook/colors/colors-interface
https://help.procreate.com/procreate/handbook/actions/actions-canvas
https://help.procreate.com/procreate/handbook/gallery/gallery-file-types
https://help.procreate.com/procreate/handbook/actions/actions-share
https://help.clip-studio.com/en-us/manual_en/210_file/Open_file.htm
https://help.clip-studio.com/en-us/manual_en/210_file/Exporting_files.htm
https://www.adobe.com/devnet-apps/photoshop/fileformatashtml/
Community format research:
https://github.com/Inochi2D/clip-d/blob/main/SPEC.md
https://github.com/al3ks1s/clip-tools
https://github.com/cuibonobo/procreate-rs


## Confirmed 3 October 2026, 13:15 IST
GDEC-016: Stationary hold colour picker; draw then hold endpoint for straightening/shape recognition.
GDEC-017: Drive sync preserves both conflicting board revisions; user chooses which to continue. No silent overwrite.

Consolidated proposed UX review and checkpoint batches: docs/review/UX_REVIEW.md and docs/review/CHECKPOINT_PLAN.md. These are review proposals, not locked UX or authorized production checkpoints. Batch organization adds a dedicated whiteboarding/exchange review before sync/AI. No scope removed.

## Repository verified
Product name: UNRULY. Personal GitHub repository: https://github.com/lionellmisquitta/unruly
Visibility: private. Connector confirms push/admin permission. Initial repository was empty with default branch main. This project must not push to organizational GitLab. Preparation documents are being committed; this is not production implementation authorization.
Next action: complete architecture/runtime feasibility and remaining pre-build decisions; maintain proposed UX separately from locked UX.
