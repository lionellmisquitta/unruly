# Engineering baseline candidate: UNRULY

Prepared 3 October 2026 (Asia/Calcutta). Status: proposed for independent pre-build review. This records concrete contracts and acceptance coverage; it does not lock UX, select a proven runtime, complete governance gates, or authorize production. Confirmed product decisions remain in PROJECT_STATE.md and state.yaml. No scope is removed.

## Requirements and acceptance coverage

Each criterion below requires both Windows and Android coverage unless it names an integration or an external app. A future checkpoint contract must specify fixtures, measurable bounds and evidence identity before execution.

| Requirement | Acceptance contract | Checkpoint |
| --- | --- | --- |
| REQ-001 | Infinite board navigates without changing document coordinates; multiple boards save/reopen independently; cut/copy/paste, lasso, ruler and eraser preserve history and selection semantics. | C02,C03,C06 |
| REQ-002 | Raster and vector coexist; curve pen and editable control points preserve geometry after save/reopen; vector eraser modes preserve unaffected segments and intersection topology. | C02,C06 |
| REQ-003 | Pen, pencil, marker, airbrush, watercolour and imported textures have documented settings and reference fixtures; unsupported experimental Procreate settings are reported with preview. | C04,C07 |
| REQ-004 | Layers/groups, locks, visibility, opacity, masks, clipping, blends and transforms pass reference rendering and undo/save round trips. | C05,C06 |
| REQ-005 | Pressure and configurable stabilization are tested with raw samples and actual pens; ink remains responsive with background work. Synthetic success cannot establish pen feel. | P0,C02,C03 |
| REQ-006 | Two-finger double-tap undo, three-finger redo, stationary picker and endpoint hold recognition cancel safely and do not create unintended ink. Visible controls remain available. | C03,C06 |
| REQ-007 | Gap-aware bucket and Gaussian blur operate inside finite selected bounds, are cancellable and commit as one history transaction; failure preserves the original board. | C07 |
| REQ-008 | Wheel, hue/saturation, shades/palettes and paper are available; paper appearance, grid, export background and brush grain are independent. | C05 |
| REQ-009 | Timelapse replay/export has a specified framing, undo policy and retention contract; interruption preserves the board and incomplete output is identifiable. | C10 |
| REQ-010 | Drive is optional for local use; offline edits queue safely; conflicts retain both revisions; disconnect leaves local boards intact. | C11 |
| REQ-011 | BYOK summary/diagram request previews selected content before send; output is reviewed before insert; DOCX/PDF/JPG exports work without AI credentials. | C12,C13 |
| REQ-012 | Each authorized checkpoint has isolated Builder, independent QA and Gatekeeper, exact identities, at most three repair/retest cycles, merge, merged regression, documentation/graph and explicit allowlisted push. | C01 and every checkpoint |
| REQ-013 | Every material decision/change has a bounded graph delta; only actual source/test evidence creates implementation/verification edges; validation precedes closure. | Every checkpoint |
| REQ-014 | Reference companion floats/docks and resizes, zooms/pans independently and samples colours; original inking presets and transient controls are usable. | C04,C05,C09 |
| REQ-015 | Named finite artboards accept pixels or physical units/DPI; metadata-only DPI changes do not resample; resampling previews and undoes. | C05,C10 |
| REQ-016 | Real Procreate and Clip Studio exchange uses documented tested fixtures and reports losses; layered PSD is a candidate, not approved native-format support. | C10 |
| REQ-017 | Motion Trace moves selected groups and audience camera in manual/default or timed playback; presentation restores layout; explicit commit is one undoable action; replay does not drift. | C09M |
| GDEC-012 | Shared Paint/Smudge/Erase brush settings, size/strength and held-icon transfer; finger smudge arbitrates movement versus stationary picker. | C04 |
| GDEC-014/015 | Image and selected PDF pages import safely; editable text/font/size, sticky notes and attached connectors retain relationships through edits and recovery. | C08,C09 |
| GDEC-001/002 | Windows launches from a portable folder on a clean machine without installing development tools; Android APK installs and launches offline. | C01,C13 |

Both painting and whiteboarding have equal release priority. AI remains in release one after base validation. Live collaboration is outside the recorded release scope. Human task/pen review remains at the existing 3/4/4/3 checkpoint batches, including C09M in batch 3.

## Interaction and visual contract candidate

Use the existing UX_REVIEW.md view inventory and gestures. Keep gallery, canvas, tool/layer/colour inspectors, reference companion, export/replay, settings, conflict review and AI review. Define each operation as idle -> preview/active -> commit or cancel; cancellation restores the previous document. Tool changes, focus loss, rotation, display disconnect and app background terminate active ink safely. Pen/finger routing uses native evidence; unavailable identity is surfaced rather than assumed. Locked/hidden objects cannot be silently altered. Long operations expose progress/cancel and leave ink handling available.

Undo/redo, picker and shape operations have visible alternatives and keyboard access on Windows. Touch targets, font scaling, keyboard focus, contrast and panel placement need native UX fixtures; no visual baseline has been approved. Original artwork/brush assets only; reference-app interaction research does not authorize copying vendor assets.

## Architecture and runtime evidence boundary

Candidate: shared C++ document/drawing engine, platform adapters for input, rendering, files, credentials and packaging, and a native cross-platform UI candidate. Qt remains under evaluation. P0a is bounded input isolation; its QPainter loop must not become the production renderer. P0b evaluates tool/eraser identity, touch/palm arbitration, coordinates and lifecycle. P0c compares tiled GPU rendering under autosave, fill/blur and recording loads on both platforms. Preserve raw and filtered samples separately when measuring stabilization. No runtime can be locked from the passing capture-model suite.

Do not add a hosted backend. Local document operations, storage/history and simulated integration adapters provide engine/backend coverage. Rendering candidates must demonstrate Windows portable deployment and Android APK viability, dependency/license compatibility, and measurable device results before selection. Missing dependencies block evidence; they do not justify dropping a platform.

## Domain, serialization, history and recovery candidate

Document coordinates are independent of screen DPI and view transforms. Stable IDs identify layers, vector objects, raster tiles, artboards, imported assets and motion targets. Camera/presentation transforms are ephemeral and do not mutate saved geometry. Commit motion updates geometry once; missing/deleted/locked targets produce explicit diagnostics and cannot redirect to another ID.

Propose a versioned board container with manifest, referenced content blobs and checksums. Validate magic/schema, counts, sizes and references before loading. Reject unsupported major versions without modifying the input; migrate a copy and retain the original. Exact format, tile size, compression and maximum import/container sizes remain a checkpoint contract dependency, not implemented facts.

Commit local save through a temporary sibling file, flush, validate, then replace atomically where the platform supports it. Verify platform durability and replacement semantics with fault injection; never label an unconfirmed write saved. Retain a recoverable prior revision and quarantine incomplete writes. Autosave/history share committed operation IDs; background work receives immutable snapshots and publishes only if its source revision still matches. Undo/redo are document transactions; failed/cancelled operations do not enter history. History compaction and timelapse retention are separately defined to prevent deleting replay evidence inadvertently.

Bound fill/blur/export by an artboard or explicit finite region. Reject unbounded work. Validate arithmetic before memory allocation; tile work and cap resources in the slice contract. Colour space, alpha convention, blend set and reference-image tolerances must be fixed together before C04/C05. Do not claim watercolour or smudge fidelity from names alone.

## Security and privacy candidate

Treat board files, brush archives, PDFs, images, fonts and AI output as untrusted. Enforce bounded parsing, decompression and dimensions; reject traversal, absolute paths, duplicate entries and unsupported types; preserve original imported inputs. Never execute imported scripts or model-produced code. Document parsing should have fuzz/corruption fixtures before release.

Local drawing is independent of OAuth/BYOK. Tokens and keys stay outside boards, logs and graph deltas. Use platform credential facilities through explicit adapters; portable distribution does not imply portable plaintext credentials. Drive scope and consent setup require a narrowly scoped design review before C11. Preserve both conflict revisions and lineage, never infer convergence from wall clocks alone. Live credentials and public release setup are separate from simulated tests.

AI sends only explicitly selected content after disclosure and user action, and previews output before inserting it. Offline exports do not require the provider. Provider choice and supported capabilities remain a material user choice before C12, not a dependency of P0. Do not log real meeting content or upload device recordings automatically.

## Test, performance and packaging evidence contract

Unit/engine tests: malformed/nonfinite samples, pressure bounds, stroke separation, history/replay determinism, vector topology, tile seams, masks/blends, fill bounds, cancellation and corrupt containers. Adapter tests: focus/lifecycle, touch/palm, DPI/multi-display, storage faults, OAuth expiration, interrupted transfers and conflicts. Native UI tests must fit the selected stack; a web-only runner does not establish native coverage.

Every test records command, working directory, exit status, fixture identity, source commit plus dirty patch when applicable, executable hash, SDK/compiler/runtime and target. Preserve failed attempts. A source-only review is not execution; a Builder rerun is not independent QA. Historical LF and current CRLF hashes are separately identified.

For P0c collect frame-time p50/p95/p99, input-to-visible latency with declared instrumentation, sample counts/drop reasons, working-set and long-session growth, and ink responsiveness under background workloads. Record display refresh/DPI and device/driver versions. Numerical budgets and minimum hardware are still pending device measurement and independent assessment; no invented thresholds or scores close a gate.

Windows package: executable, matching runtime/plugins, dependency notices and required writable-data paths; launch offline as a standard user from a copied folder on a clean machine. Android: matching Qt/runtime candidate, SDK/NDK/JDK, ABI and lifecycle checks, APK install/offline launch and input tests on Xiaomi. A desktop build cannot stand in for Android. SDK licensing and compiler/kit compatibility must be checked when actual kits are selected.

## Controller and checkpoint contract candidate

Before unattended runs, validate CLI availability/authentication without exposing secrets, exact repo root, all effective fetch/push URLs including rewrites, hooks, clean permitted worktrees, baseline refs and authorization. Allowlist only https://github.com/lionellmisquitta/unruly.git. Unexpected routing stops the controller. Never change global Git configuration or organizational GitLab workspaces.

Builder owns permitted source; QA owns adversarial fixtures/evidence and cannot repair product source; Gatekeeper evaluates source/security/UX/traceability and verified outputs independently. Capture commits after each repair; QA reruns on the new identity. At most three repair/retest cycles, then stop and preserve evidence. A timeout, malformed structured result, missing artifact or missing human judgment is a failure/block, never a pass. Resource/time/token budgets must be explicit before unattended execution; no paid subscription or infrastructure is authorized.

An independently accepted checkpoint merges only into its named integration branch. Test the merged identity; failure stops promotion and dependent work. After successful regression update docs and graph, validate them, then push only an explicitly authorized destination/ref. Main advances only from protected reviewed results. Human review cards include both platform builds, task steps, known defects and measured evidence at existing batch boundaries.

## Pre-build review packet and remaining prerequisites

Review inputs: PROJECT_STATE.md, state.yaml, UX_REVIEW.md, CHECKPOINT_PLAN.md, this candidate, P0 QA_REPORT.md, and evidence/windows-2026-10-03/identity.json plus command logs.

Independent pre-build review is NOT RUN: the requested Software Delivery Gatekeeper and Quality Engineering Adversary skills are not available in the searched repository/user skill roots. Do not emulate their authorization or substitute the Builder's opinion. Their exact SKILL.md resources are required before applying those workflows.

Runtime feasibility additionally needs Qt desktop/Android kits and SDK/NDK/JDK, actual device evidence and P0b/P0c measurements. Before production: approve reviewable baseline contracts, establish numeric acceptance/resource budgets, record dependency/license selection and verify controller identity/authentication. Remaining material choices include project license, exchange route, AI providers and timelapse semantics. Resolve them at their dependency boundary without repeating confirmed choices. Production authorization remains false and all gates remain unassessed.


## Current preparation addendum - 3 October 2026, WSLg
The historical missing-skill/missing-CLI statements above are superseded by installed project-local Gatekeeper/QA skills and authenticated tools-disabled Claude execution. Native WSLg Qt startup and synthetic adapter testing now have separate evidence; neither closes Windows App Control regression, native pen or Android verification. See NATIVE_P0_MILESTONE.md, CHECKPOINT_CONTRACTS.json, ENGINEERING_DECISIONS.md, READY_BLOCKED_QUEUE.md and ../architecture/engineering-principles-review.md. Those contracts/decisions remain proposed for independent readiness review; production authorization remains false.
