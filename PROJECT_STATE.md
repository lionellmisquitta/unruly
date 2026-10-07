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

## Motion Trace — confirmed scope
REQ-017: Support moving selected/lassoed content along a path and audience-view pan/zoom. Both manual and timed playback are included; manual advance is default. Offer presentation-only motion with original layout restored (default) and an explicit commit-to-board option. Add a dedicated checkpoint after selection/transforms are validated. Individual cue parameters and recording semantics remain proposed.

## Coding start boundary — 3 October 2026
User requested coding to begin. Quarantined P0a raw-pen input source created in prototypes/p0-pen-input; Qt remains an evaluation candidate. Production build authorization remains false. Native build/device tests and full P0 closure are not verified. Independent capture-model QA is recorded beside the probe. See docs/review/BUILD_START.md for readiness gaps, execution constraints and the production start sequence.

## Windows continuation — 3 October 2026
Actual personal Windows checkout verified at HEAD cb1d52089c5cdd159050dc375b92750eb84d8271; effective origin fetch/push match the personal GitHub repository. MSVC/CMake are installed outside ordinary PATH; Codex CLI version execution succeeds. Qt, Android SDK/NDK/JDK and Claude CLI were not found in bounded checks. Requested Gatekeeper/Adversary skills were not found; independent review has not run.
One quarantined fixture portability repair passed the 10 existing Capture-model cases on MSVC with /W4 /WX. Native CMake configuration exited 1 on missing Qt. No UI/device/Android test ran. Exact commands, dirty-source/base identities, executable hash and logs: prototypes/p0-pen-input/evidence/windows-2026-10-03/. See docs/review/WINDOWS_CONTINUATION.md and the proposed ENGINEERING_BASELINES.md review packet. Production authorization remains false; no checkpoint merge/push occurred.


## Installed delivery skills and authenticated Claude ? 3 October 2026
Both complete delivery skills are now installed project-locally for Codex (.agents/skills) and Claude (.claude/skills); no hooks registered. Active bundled Claude 2.1.288 authenticated smoke returned exactly UNRULY_QA_READY, exit 0, 5.157 seconds. Fresh independent QA launch was rejected by automatic approval review for source egress and broad shell tools before execution. No independent QA ran. A no-tools enumerated-payload proposal is saved for explicit source-transfer approval; native Qt/Android/device coverage remains blocked. Evidence: prototypes/p0-pen-input/evidence/claude-2026-10-03/. Extension updates may change executable path. Production authorization remains false.


## Approved tools-disabled Claude QA cycle ? 3 October 2026
User explicitly approved the enumerated source/protocol and sanitized-evidence transfer. Claude independently authored tests/findings and assessed local execution; Codex executed tests and repaired application code separately. Initial19 model cases passed. Claude capacity2 regression cases failed before one Codex repair and passed afterward. On repaired source, existing10+capacity2 passed; adversarial9 compiled but Windows App Control blocked launch (WinError4551). Independent final QA status BLOCKED. Native/device/Android remain blocked; merged regression not run. Production authorization remains false. See prototypes/p0-pen-input/qa-claude/QA_REPORT.md, QA_CHECKPOINT_RESULT.json and evidence/claude-2026-10-03/. No merge/push, hook registration or policy bypass occurred. Extension updates may change executable path.


## Separate WSL/Linux continuation - 3 October 2026
Ubuntu 26.04 x86_64 WSL2; g++15.2 and Python3.14 available. Linux Claude2.1.288 is available and actual tools-disabled authenticated smoke succeeded (UNRULY_QA_READY, exit0). Current dirty probe hashes match saved repaired Windows source. With no source or test changes, all21 Capture-model cases (existing10, Claude adversarial9, capacity2) compiled with strict warnings and passed on Linux. Fresh independent Claude accepted PASSED_LINUX_MODEL_ONLY and kept overall P0 BLOCKED. One prior repair cycle remains used; no new application repair. Linux evidence is supplemental and does not close Windows App Control regression, native pen or Android verification. CMake/Qt/JDK/Android dependencies were absent in bounded inspection; no native build/device test ran. Evidence: prototypes/p0-pen-input/evidence/linux-2026-10-03/; report: docs/review/LINUX_CONTINUATION.md. Windows work/evidence preserved; no employer policy change, hook, merge, push or production code. Independent Gatekeeper review remains pending and production authorization remains false.


## Runnable native P0 milestone - WSLg, 3 October 2026
Official Ubuntu Qt6.10.2/CMake4.2.3/Ninja1.13.2 packages verified against index hashes and extracted into the Linux user-owned tool prefix, with no system install/policy change. Existing quarantined source built and launched as an exact-PID visible1000x700 WSLg/xcb window. Claude authored8 native adapter tests; initial6 passed/2 failed on hover routing. Separate hidden/shown diagnostic confirmed default tabletTracking prevented the lost-release guard from seeing hover. Codex repair cycle2 adds setTabletTracking(true), preserving prior repairs and QA assertions. Rebuilt/relaunched source passed21 model+8 synthetic native cases. Independent Claude accepts these scoped29 passes, keeps overall QA BLOCKED, and accepts the one three-task human card with platform caveats. All Windows/native physical/Android and merged-regression blockers remain. Closed delivery checkpoints0; production authorization false. Source SHA25656e2e448855a55f205dc85a8f160e59e562fb2f6102193c6ebcd94e45baa3f90. See docs/review/NATIVE_P0_MILESTONE.md, P0_HUMAN_TEST_CARD.md, CHECKPOINT_CONTRACTS.json, ENGINEERING_DECISIONS.md and READY_BLOCKED_QUEUE.md. Separate independent Gatekeeper readiness/publication-scope review is pending; a curated personal preparation branch is requested, without merging main or preview/offline-canvas.

Independent readiness review completed: GK-UNRULY-P0A-NATIVE-WSLG-2026-10-03-R1, BUILD_AUTHORIZED=false, closed checkpoints0. Gatekeeper accepts curated personal preparation-branch publication under explicit exclusions and scoped evidence; locked UX, target devices/runtime, domain/data/security/test/ops baselines and merged regression remain blocked. Saved Windows12+9blocked, Linux21 and WSLg29 refer to distinct source/platform runs and are never combined. QA fixture literal labels are logged as non-blocking GCON-001; assertions/historical outputs remain preserved. Local Git CLI has no GitHub credentials in WSL; authenticated personal GitHub connector can publish the curated branch without credential changes. Current next action is the single WSLg human card plus target-kit/P0b preparation.

Curated preparation/prototype snapshot published via authenticated GitHub connector on prep/p0-native-wslg-2026-10-03: source commit 02772d4b6c672b389cc5f634f330905437d06907, tree a711d208eb77b424daf39df4139d765c6e8e91c3. Exact commit imported to a separate local branch; main/index/checkout remain in place. Published source bytes match tested SHA25656e2e448855a55f205dc85a8f160e59e562fb2f6102193c6ebcd94e45baa3f90; committed curated-manifest bytes were verified. Publication-only path aliases were applied to Git objects without overwriting Windows files. No generated executable, credential, raw log, device recording or skill archive was published. This is preservation of preparation/P0 evidence, not checkpoint closure, merge, binary release or production authorization.


## Approved native Windows input candidate — 4 October 2026

Latest user approval lifts the hold only for P0a-WIN-D1; see docs/delivery/EXECUTION_APPROVAL.json and GATEKEEPER_EXECUTION_SCOPE.md. Independent host nine cases passed; actual Windows MSVC compile, the same nine model cases, and visible-window/startup/title/close smoke passed against fb7ab408c8dabb48e31415e51e0201ba7bce1ab7 (CI run 37149560536).

Candidate is on personal prep/native-windows-input-2026-10-04. Physical Surface/Lenovo input and painted status remain NOT_VERIFIED. Original blocked Windows nine-case regression and Android are distinct and remain open. No repair, employer security change, laptop agent launch, main merge or release. Production authorization false; product checkpoints closed 0/14. Final independent candidate review is recorded separately under docs/delivery.


## Browser foundation continuation — 4 October 2026

User selected browser-first delivery at a GitHub Pages URL; native enhancements deferred. WEB-F1 is a quarantined foundation preview under UNRULY-WEB-2026-10-04-R2, independently reviewed before implementation. Drawing/navigation/history/local-board storage and offline-update candidate is now under independent QA; no executed browser PASS or live deployment is claimed here. Native source/evidence preserved. Product checkpoints closed: 0/14. Production authorization false; no main merge. External paid model CLI/API calls: 0. One recovery repair maximum is reserved; historical P0a cycles remain preserved. Repository Pages setup remains blocked (has_pages=false); no administrative workaround or repo visibility change.


### Browser foundation executable result

Reviewed source/test identity: 66152b32e9544bd383587adbbacbd495e0be3a2f. CI 37180183813 passed all nine model cases and twelve actual Chromium journeys. Independent QA validated fourteen hashes, recovery/quota/concurrent-tabs/offline/update safety and desktop/tablet/360px screenshots. Earlier CI 37179952664 retained eleven browser passes and one test synchronization failure; bounded fixture-only wait preserved the assertion and app bytes. Chromium 151.0.7922.34, Node 22.23.3. Automated candidate passes; hosted URL, physical pens/feel and merged product regression remain unverified. One source repair consumed; no automatic continuation. Pages still not enabled; prepared deployment uses only the immutable tested static directory and requires legitimate owner setup. No main merge, production authorization or product checkpoint closure.


## Pages setup and deployment attempt — 4 October 2026 evening IST

Owner enabled GitHub Actions Pages and explicitly accepted public repository visibility. API confirms Pages enabled/public repo. Reviewed deployment run37218275559 on d6db892c37641dff0648e09df9f899d8e50dfd19 was rejected before execution: github-pages environment branch protections exclude preview/browser-foundation-2026-10-04. No application change, no live URL, no security-policy bypass or main merge. Owner must add only that exact branch under Settings/Environments/github-pages/Deployment branches and tags. Successful9model/12Chromium candidate unchanged; production false,0/14 checkpoints closed. Details docs/delivery/BROWSER_HOSTING_STATUS.md.


## Hosted preview verified — 4 October 2026, 22:34–22:40 IST

GitHub Pages run37218275559 attempt3 succeeded after owner corrected permitted branch to preview/browser-foundation-2026-10-04. Exact URL https://lionellmisquitta.github.io/unruly/ opened in remote Chrome. Mouse drawing, Undo/Redo, durable save and retained drawing after reload observed; “Ready for offline use” displayed. All8 deployed prototype files HTTP200 and byte-identical to reviewed candidate66152b32e9544bd383587adbbacbd495e0be3a2f. Root state/governance/QA paths return404 on site (repository itself public by owner decision). Captured logs contained browser-extension metadata errors; no app-origin error in returned entries. Hosted offline network-disable not rerun; prior CI verified offline. Surface/Lenovo/Xiaomi pressure/feel still NOT_VERIFIED. Human test card handed over; no advanced-feature continuation, main merge or product closure; productionfalse0/14.


## Human drawing-workspace feedback — 4 October 2026 22:53 IST

User confirms basic drawing worked and states foundation is below expected feature set. Requests selectable paper, three erasers (intersection/partial-path/whole-line), usable thickness/transparency/colour, layers and brushstyles. These belong to original requirements; no feature completeness inferred from21foundation checks. Opacity/layers/papers/brushlibrary absent; onlywhole-strokeeraser exists. Colour/size usability reportedfailed remainsopen; remote desktop keyboard changes size5->40, colour-wellclick showsno picker here; device-specific causeunknown. Physicalpressure/latency notverified. Next proposed combinedworkspacebatch in docs/delivery/BROWSER_WORKSPACE_FEEDBACK_PLAN.md; independent readinessreviewpending. No appsource/deploy changed fromfeedback and no productclosure or productionauthorization.


## WB1 drawing workspace batch — 4 October 2026

User authorised next batch: controls/paper/layers, four original vector brushes, three erasers. Independent Gatekeeper accepted quarantined implementation after exact precision/work/history/render limits were recorded. Isolated source written under prototypes/browser-workspace;16 independent model cases pass after repair1/2. Actual browser QA pending; initial live foundation remains unchanged. One combined human review follows actual QA and separately reviewed immutable deployment. Zero paid external model calls; product checkpoints closed0/14, production/main/G14 false. See docs/delivery/WORKSPACE_EXECUTION_STATE.md.


## WB1 initial browser QA and final bounded repair

Initial actual CI37222940471:16modelPASS/12of14ChromiumPASS. Endpoint and selected-board persistence failures repaired in cycle2/2; queued preview/mode/export issues fixed. Retest pending with15 browser journeys including partialmigrationquota. No remaining source repair budget; current live app unchanged. Source/test identities and initial receipts retained; productionfalse0/14.


## WB1 independent candidate acceptance

Exact80c5bbe86cde4c41a81e354f296ff5d203019888 CI37223520128 passed16model/15Chromiumjourneys; artifact11310983072 SHA25601f381c6457c3f58204b9578cef58b8176ebe841aa9a13a4d41fe932b8ee65ce. Independent QA reproduced16sourceidentities and accepted candidate. Independent Gatekeeper authorised exacttestedworkspace preview via existing ownerallowedPagesbranch, no main/release grant. Renderer syntheticp95/max62.7ms notpenfeel/60Hzcertification. Repairs2/2,CI2/3,paidmodelcalls0. Deployment/live verificationpending; see WORKSPACE_FINAL_GATEKEEPER.md and WORKSPACE_QA_REPORT.md. Formal product0/14, productionfalse.


## WB1 hosted workspace verified

Pages37224013072 succeeded;9hostedappassetsHTTP200 andexactmatchtested80c5bbe86cde4c41a81e354f296ff5d203019888. RemoteChrome savedupdatecopied1oldboard, retainedexistingdrawing, nativekeyboardcontrols/color/paper/layer/newink/save/reloadobserved. Hostedofflinereadyindicatorobserved,networkdisableCIonly; physicalpenfeelNOTVERIFIED. Onecombinedhumantestcard delivered. CurrentpreviewcompleteWB1threeinternalslices; fullproduct0/14closure,productionfalse. No native/history/security/defaultmainchanges; no paidexternalmodelcalls. See WORKSPACE_HOSTED_STATUS.md.



## U3 closed — cumulative browser preview, 7 October 2026

U3 Core Gestures + Geometry is accepted and hosted at https://lionellmisquitta.github.io/unruly/. Immutable-by-governance checkpoint branch `checkpoint/u3-v0.6.0` points to tested cumulative integration `41019aa0b7991bbe5bd56b71b9516da9bb454cd0`; accepted U2 rollback `fd15c607d5b9a605b1e8a1164250803832830591` remains preserved. This closes the drawing-UX preview checkpoint; broad product/main/production authorization remains false.

Independent QA and independent Gatekeeper accepted CI3 run37605503902:48 model and90 actual Chromium checks passed, including32 U3. Exact32 source/test/workflow identities verified. CI2 native-input Undo defect retained and repaired; no unresolved blocking finding. Repair batches2/2 and QA CI runs3/3 consumed. Evidence and receipts are durable under docs/delivery/evidence/u3; QA and Gatekeeper reports accompany them. Same-model independent-session fallback used; no alternate runtime or paid external model call.

Reviewed Pages deployment37606536465 succeeded on workflow commitcb1dc0a27713f59f1fbea526a3a285d7068ea764, pinned to accepted source. All15 hosted app assets byte-matched. Remote Chrome observed safe Update preserving prior ink, held-line recognition, native numeric edit700, Apply, Saved on this device, and retained prior ink + edited line after reload. Offline-ready indicator observed; actual network-disabled offline regression passed in CI. Returned extension metadata errors were extension-origin, with no app-origin error observed. Physical pen pressure/latency/feel remains NOT_VERIFIED. One cumulative U1–U3 app and handheld review card delivered.

Knowledge capture delta .knowledge/delta-u3-closure.json records acceptance, evidence, defect disposition and smaller-increment delivery decision. It extends existing capture records; no complete KGP export is claimed. Next: human tablet review of U3, then one bounded next interaction at a time with a fresh handoff/budget. No automatic G02 implementation.
