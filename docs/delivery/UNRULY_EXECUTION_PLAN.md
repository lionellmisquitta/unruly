> Current scope: latest user approval lifts the implementation hold only for P0a-WIN-D1. See EXECUTION_APPROVAL.json and GATEKEEPER_EXECUTION_SCOPE.md. Production/main/release remain blocked; historical hold statements below are retained.

# UNRULY — complete execution plan for user confirmation

**Plan ID: UNRULY-PLAN-2026-10-04-R1. Status: awaiting user confirmation and independent plan review. IMPLEMENTATION HOLD: true.**

This is the authoritative planning document for this recovery. No implementation, test-code authoring, build, executable QA, CI activation, code push or merge may resume until Lionell explicitly approves this plan. Gatekeeper permission alone does not replace that approval. After approval, production additionally requires the independent pre-build gate. Source already drafted before the hold is unbuilt/unpublished and excluded from this plan package.

## 1. Outcome, scope and actual starting position

Deliver a personally useful native offline painting/whiteboard app: portable Windows x64 folder and Android arm64 APK, both supported from release one. Local editing, saved boards and export require no app account. Google Drive sync is optional to use but included in release one. BYOK summaries/diagrams are included after base drawing validation. No hosted SaaS backend, live collaboration, iOS app, public launch or paid subscription purchase is in this release boundary. Future open-source publication is intended; repository remains private until separately authorized.

Observed starting state: 14 product checkpoints (C01–C13 plus C09M) exist, zero is closed. P0a has model/synthetic29 passes in WSLg but not real pen ink; Windows9-case regression remains blocked by App Control. Native Android is not verified. Two P0a repair cycles have already been consumed. HTML UX preview is exploratory, not product implementation. The previous roadmap and 17 draft contracts are inputs, not accepted readiness.

Evidence authority: saved preparation commit c7801f968279f25b8c9612197add1cc41466ed96 plus the user's later physical observations. The user's dirty Windows/WSL checkout is newer and must be reconciled read-only before any implementation. All effective fetch/push URLs must be lionellmisquitta/unruly; organizational GitLab is prohibited. No reset, clean, blind pull or main merge is permitted.

## 2. Two approvals and exact lifecycle

1. Complete this plan and independent Gatekeeper **plan review**. Plan review assesses completeness/consistency; it is not production build authorization.
2. Lionell confirms plan ID and permits the first named preparation/feasibility task. Without this, all code stays paused.
3. Perform the permitted pre-build evidence tasks P0a/P0b/P0c and simulation/dependency preparation only; bind actual target evidence. P0 is not a shipped-product checkpoint.
4. Complete G00–G13 evidence and independent G14. If blocked, report the specific missing evidence and stop dependent tasks. Do not continue unrelated work to consume the allowance.
5. With user approval AND Gatekeeper authorization, implement one bounded C task -> independent QA -> at most three repair/retest cycles -> independent code/security/Gatekeeper review -> reviewed integration merge -> actual merged-identity regression -> docs/knowledge delta -> push reviewed result -> next READY task.
6. Human review occurs at four batch boundaries. Only material decisions, real device checks, security clearance or exhausted bounded repairs interrupt the queue.

Pre-build phases in order: G00 intake/classification, G01 outcomes, G02 users, G03 workflows, G04 requirements, G05 nonfunctional budgets, G06 interaction, G07 domain, G08 data, G09 integrations/simulation, G10 architecture, G11 security/licenses, G12 verification, G13 deployment, G14 independent authorization, G15 recorded build mode. No stage is passed by file existence. Standard tier proposed because parsing, local data loss, cross-device sync and third-party transmission require disciplined evidence. A native hardware workflow is not replaced by Docker; Compose is proposed only for repeatable integration simulators/host tests. Native-equivalence handling must be accepted at readiness, never silently waived.

## 3. Product decisions recommended for approval

These recommendations are explicit, not retrospectively recorded user decisions. Approval adopts product policies; exact toolkit pins still require compatibility/license evidence.

| Area | Recommended decision | Validation/stop condition |
|---|---|---|
| Native stack | Shared C++17 engine with thin native input/files/credentials adapters; evaluate Qt6 native UI and GPU tiled rendering. WSL is developer tooling, never Windows pen acceptance. | P0c must prove both target packages and frame/input behavior before runtime lock; failed candidate reopens architecture rather than silently rewriting. |
| Windows delivery | Executable, matching DLL/plugins, notices and README in a folder. Default data in a user-selected local folder; writable portable mode explicit. | Standard-user clean-machine offline launch; no development-kit dependency; employer clearance respected. |
| Android | arm64 APK, private app storage by default, document-picker import/export and explicit permission errors. | Actual Xiaomi pen/background/storage tests; exact installed Android/pen variant recorded. |
| Project license | MIT for original UNRULY code, with separately recorded dependency/asset notices and obligations. | User plan approval needed; no license inserted during hold. Distribution blocked on module-by-module audit. |
| Document | Versioned .unruly ZIP64 container, JSON manifest/entities, PNG raster tiles and original referenced assets; checksums. No embedded scripts. | Validated bounds, roundtrip and platform fault-injection before saved-board release. |
| Colour | sRGB RGBA8 working space; premultiplied composition; explicit straight-alpha PNG boundary. | Reference blend/alpha tests; no wide-gamut claim. |
| Raster | Initial 256×256 tiles, lazy allocation, bounded cache; masks and raster work independent of vector objects. | Measured cache/working-set behavior on actual devices before budgets lock. |
| Exchange | Native editable master plus layered PSD supported subset; PNG/PDF as reliable flattened fallback. | Real Procreate/Clip Studio roundtrips; report losses. Native .clip/.procreate writing has no parity guarantee and is experimental only. |
| Brush import | Original brushes first; texture tip/grain import; experimental .brush/.brushset/ABR subset when safely understood. | Unsupported settings visibly reported; do not claim identical Procreate watercolour/rendering. |
| Timelapse | Off until user enables recording per board; chronological operation replay including undo; finite chosen artboard/frame; 1GiB initial recording cap pauses with warning, never silently deletes. | Storage, cancellation and replay determinism; user may change policy before C10. |
| Drive | OAuth system browser, app-created UNRULY folder, least-privilege app-file access, local source of truth, preserve both conflicts. No app login needed otherwise. | Reviewed OAuth clients/scopes and simulations; no embedded client secret or automatic real-board upload. |
| AI | OpenAI and Anthropic adapters behind selected-content contract; user chooses model and key. Preview payload before send and output before insertion. No default automatic request. | Provider samples, explicit permission and caps; no-key/outage leaves drawing usable. |
| Touch | Pen inks; finger navigation default; finger smudge only in smudge mode. Double-tap 2 fingers undo/3 redo; stationary hold picker; endpoint-hold shape preview. | Native pointer ID and movement arbitration, configurable timing, visible alternatives and actual-device testing. |
| Motion | Manual Next default, optional timed cues, object/group and camera paths; presentation restores state; explicit commit is one undoable operation. | Replay/cancel exact-state checks and no drift. |

Reference boundary: official Qt platform and licensing pages establish candidate support/obligations, not that this application has passed them. Official Procreate documentation supports PSD exchange and brush imports into Procreate; it does not establish an open native-file specification or brush-engine equivalence. Keep vendor names as interaction references; original icons/brush assets only.

## 4. Requirements and traceability

| Requirement | Included release capability | Owner checkpoints |
|---|---|---|
| REQ-001 | Infinite practical canvas, boards, pan/zoom, clipboard/lasso/ruler/eraser | C02,C03,C06 |
| REQ-002 | Raster/vector coexistence, curve pen and node/point/intersection editing | C02,C06 |
| REQ-003 | Pen/pencil/marker/airbrush/watercolour, inking presets and textures | C04,C07 |
| REQ-004 | Layers/groups/opacity/clipping/masks/blends and transforms | C05,C06 |
| REQ-005 | Genuine pressure, brush controls, stabilized handwriting, responsive ink | P0,C02,C03,C04 |
| REQ-006 | Gesture undo/redo, colour hold and endpoint recognition | C03,C06 |
| REQ-007 | Finite gap-aware bucket and Gaussian blur | C07 |
| REQ-008 | Wheel/HSL/shade palettes, paper/grid | C05 |
| REQ-009 | Local timelapse and video export | C10 |
| REQ-010 | Drive authorization, offline queue and conflicts | C11 |
| REQ-011 | BYOK summaries/diagrams and DOCX/PDF/JPG | C12,C13 |
| REQ-012 | Bounded builder/QA/Gatekeeper/merge/regression controller | C01 and all tasks |
| REQ-013 | Incremental evidence-backed graph deltas | All tasks |
| REQ-014 | Reference companion, picker, original ink and transient controls | C04,C05,C09 |
| REQ-015 | Finite artboards, physical units and DPI | C05,C10 |
| REQ-016 | Actual external-artwork interchange with disclosed losses | C10 |
| REQ-017 | Audience Motion Trace and camera cues | C09M |
| REQ-SUP-001 (supplements inherited GDEC-014/015; no renumbering) | Editable text with font/size, sticky notes and attached connectors | C08 |

Each criterion receives a stable checkpoint AC ID; each test receives a fixture/case ID. Final closure maps requirement -> criterion -> module -> test -> exact-source evidence. Unknown results stay NOT_VERIFIED/BLOCKED. No feature is silently removed because a toolkit cannot implement it.

## 5. UX/state solution

Canvas dominates. Restrained dark chrome/warm paper, narrow tool rail, collapsible inspector, transient colour/size controls and an independently navigable reference companion. An offline UX preview informs layout but does not lock interaction or prove native feel. Native wireframes/state review occurs at G06 before production UI.

| View | Primary user goal/action | Required states and recovery |
|---|---|---|
| Gallery | Create/open/rename/duplicate/archive board | Empty, recent, corrupted/recoverable, missing asset, unwritable folder; original retained on failure |
| Canvas | Draw and navigate with selected tool | Ready, live preview, commit, cancel, unavailable pen identity, resource limit, saving/saved/save failed; ink loop independent of workers |
| Brushes | Select Paint/Smudge/Erase brush and adjust size/opacity/strength/stabilization | Compatible preset, unavailable imported feature, preview, apply/cancel; no destructive preset overwrite |
| Layers | Choose/reorder/group/lock/show/mask/clip/blend | Active/hidden/locked, mixed selection, missing clip base; cancel restores exact state |
| Colour/paper | Wheel, HSL, shades, saved palettes, picker, paper/grid | Selected colour, sampled colour preview, missing texture, unavailable gamut; palette imports bounded |
| Selection/curve | Lasso/clipboard, transforms, nodes and erase modes | Preview handles, commit/cancel, locked target, empty/mixed selection, no valid intersection |
| Text/connectors | Editable font/size, note and attached connector | Editing/committed, fallback font disclosed, deleted attachment, keyboard focus recovery |
| Reference/import | Load image or selected PDF pages; dock/pop out companion | Permission/missing/corrupt/oversized, page selection, decoding progress/cancel; existing board unchanged on failure |
| Motion/timelapse | Define path/cues, preview/replay, explicit commit; choose recording/frame/export | Paused/running/end/cancel/missing target/storage cap/export interrupted; restore original presentation state |
| Export | Choose finite frame/artboard, format, background/DPI and output location | Estimate/preview, progress/cancel, write denied, partial output; no misleading successful label |
| Sync/conflicts | Connect Drive, see queue, choose continuation from preserved versions | Offline/connected/expired/retry/conflict/disconnected; drawing remains usable |
| AI review | Select content, review payload/provider, generate, edit/insert or discard | No key, canceled, cap hit, timeout/refusal/malformed output; received content inert until approved |
| Settings | Input, gesture timings, storage, integrations and diagnostics | Defaults, unsupported option, permission denied, reset confirmation; no credentials in board exports |

Recommended timing candidates: hold 500ms, movement tolerance 8 logical pixels, double-tap interval 300ms. These are adjustable and tested for scale/pointer identity; no shape recognition while stationary picker is eligible. Endpoint-hold requires a completed drawn segment with pen still held; show proposed line/curve/shape before committing. Gesture cancel/focus change cannot add a history entry. Visible undo/redo, picker and shape alternatives remain. Windows keyboard shortcuts include undo/redo, temporary pan and cancel; touch controls remain discoverable. Do not claim exact vendor gesture parity without behavior comparison.

## 6. Engine, domain and persistence contracts

Stable opaque IDs: Board, Revision, Layer, Object, Tile, Asset, Artboard and Cue. Objects include vector stroke/path/text/note/connector/image; raster layers own sparse tiles. Groups preserve membership/order. Coordinates are double-precision document units independent of view/DPI; view transforms are ephemeral. A hit-tested edit uses layer/object IDs, never position as identity. Locked targets cannot mutate; hidden layers cannot receive new ink without explicit visibility action.

One committed operation is one undo transaction. Live stroke and selection/motion previews are ephemeral. Failed/canceled work has no committed side effect and preserves both undo/redo branches. Background fill/blur/save/export works against immutable revision snapshots; stale results are discarded or require explicit review. Stroke start/end/hover/cancel uses native pointer ID/kind, not inferred pressure. Pen pressure unknown is explicitly unavailable; mouse fallback cannot masquerade as pen.

Board manifest fields: magic/version, board_id, revision_id, parent_revision_ids, timestamps (metadata only), coordinate/color conventions, layers/order, objects, artboards, asset/tile checksum references, cue/timelapse references. Relational/reference integrity is validated before mutation. Unknown major version rejected; migrations copy the original. Logical schema/fixtures locked at G08 before storage implementation. Proposed initial limits: manifest4MiB, entries65536, imported dimension16384 each axis, decoded item256MiB, aggregate decode512MiB, decompression ratio100:1. Arithmetic is checked before allocation; memory availability can impose a lower limit with a clear error. Bound all fill/blur/export by a finite region.

Save: committed revision -> sibling temporary -> flush -> validate -> platform-supported replace -> retain previous validated revision. Saved label appears only after the durability contract completes. Windows folder and Android document-provider/private storage have separately tested replacement semantics. Autosave after2s idle/committed work with nonblocking batching; a long live stroke is not mislabeled durably saved. Recovery detects prior validated revision and incomplete temp; never overwrites original without successful validation. User controls archive/delete; remote delete propagation needs explicit conflict handling, not automatic purge of the last copy.

Layer composition starts with normal/multiply/screen/overlay/add; extend supported blend set with defined math/reference tests. Clipping derives from a valid base layer; masks separate from pigment. Text stays editable; missing fonts are disclosed. PSD interchange rasterizes unsupported vectors/text/effects only after explicit export warning; native master remains editable. Timelapse operation log is separate from history compaction so undo-memory limits do not erase recording assets. C10 readiness must select a video container/codec, encoder dependency, frame rate (30fps recommended), interrupted/partial-output naming and cleanup policy, and redistribution obligations on both targets; MP4/H.264 is a recommendation requiring that review, not a silently selected or licensed implementation. Write video to a separate .part output, never overwrite an existing export before successful finalization; cancel/failure preserves the board and identifies/removes the incomplete output according to the selected policy. If unavailable, the export decision must be resolved before C10 coding; video export cannot silently disappear.

## 7. Integration/security solution

Interfaces: InputAdapter -> normalized raw events; Renderer -> revision/view tile output; BoardStore -> validated load/commit/recover; CredentialStore -> opaque key/token handles; DriveAdapter -> scoped upload/download/revision conflict operations; AIAdapter -> selected payload/request/result; ExportAdapter -> finite snapshot artifact. Business rules cannot depend on vendor HTTP response classes or UI widgets.

Versioned simulated Drive fixtures: token success/expired/denied, offline/429/5xx, interrupted upload, duplicate retry, missing remote asset, two competing revision parents, revoked permission and disconnect. Versioned AI fixtures: valid summary/diagram, refusal, timeout, 429, invalid schema, oversized result, unsafe embedded links/script/code and partial response. Every fixture records request/response metadata, source version and sanitized synthetic data. Simulation is default and no real network request is a test setup shortcut. G09 requires working simulation evidence after user permission for that preparation; it cannot be closed during this no-code hold.

Secrets: Windows OS credential facilities and Android Keystore-backed storage via explicit adapters; no plaintext keys in portable boards, diagnostics, screenshots, graphs or commits. Local boards may contain sensitive meeting content. OAuth and AI payload transmission require deliberate user actions. AI results are data, never commands. Treat files/fonts/PDF/brush archives as untrusted: reject traversal/absolute paths/duplicate members, oversized decoding, malformed references and unsupported executable entries. Add fuzz/corruption/resource fixtures. Limit outbound hosts and request timeouts; no telemetry upload by default.

Supply chain: pin actual module/compiler/SDK versions after compatibility checks; store lock/manifest/license receipts. Dynamic Qt packaging obligations and individual PDF/codec module licenses need review, not a generic assertion of LGPL compatibility. Original assets only. Native signing/release ownership remains separate from private prototype distribution. App Control failure is a legitimate execution blocker; admin rights do not authorize policy circumvention.

## 8. Measurable quality/operations targets (proposed acceptance budgets)

| Area | Target to lock at readiness | Verification |
|---|---|---|
| Ink frame work | p95 <=16.7ms at60Hz; <=one refresh interval at higher effective refresh | Instrument delivered events, CPU/GPU submission and actual display rate; report p50/p95/p99 |
| Delivered-input-to-render | p95 <=one effective frame interval; input-to-visible target <=50ms with declared external/instrumented measurement method | Do not equate synthetic dispatch time with physical latency; human feel review remains required |
| Responsiveness | Draw/navigation stay responsive while save/fill/blur/timelapse export runs | 30min deterministic session + real-device ink checks |
| Resource safety | Bounded sparse tile cache512MiB candidate; no monotonic growth after cleanup; import/fill limits explicit | Low-memory fault injection and cache eviction on both devices |
| Recovery | Every injected save interruption reopens old/new validated revision or explicit recovery; never silent corrupt success | Kill/fail after every stage on both actual storage adapters |
| Offline | Create/draw/save/reopen/export without login or network | Network disconnected clean-package tests |
| Portable/Android | Standard-user Windows folder and actual Xiaomi APK launch without development kits | Clean target/device receipts, permission/background tests |
| Compatibility | Native schema migration preserves original; interchange reports losses | Version/corruption/roundtrip fixtures and actual external applications |
| Evidence | Exact source/build identity for every pass; no secret/raw real-board capture by default | Source/fixture hashes, exits, test cases and separate target statuses |

Initial workload fixture: 10000 vector strokes,100 raster tiles,8 layers,one imported image,undo/redo and concurrent save. Larger workload must be derived from device evidence; the practical-infinite canvas does not promise infinite memory. These numbers are proposed and require independent assessment before being treated as passed thresholds.

## 9. Executable checkpoint/task contracts

The 17 detailed inherited contracts remain in CHECKPOINT_CONTRACTS.json for traceability; this plan governs ordering/hold. Each product checkpoint is split below so a session cannot expand into the whole roadmap. Branch pattern cp/<task-id>, allowed paths listed below. Before execution bind actual baseline/commit and exact expanded file manifest; do not use an unbound future hash as execution authority. Planned commands are not currently run.

| Checkpoint/task order | Allowed module roots | Acceptance and deterministic tests | Visible result/stop boundary |
|---|---|---|---|
| P0a-WIN-D1 native Windows input (first packet); P0a-ANDROID-D1 is a separate subsequent packet | prototypes/p0-pen-input; proposed prototypes/windows-input-slice; docs/review | Existing capture limits + real target event identity/pressure; SDK diagnostic may contribute but not substitute Qt kit criterion | Pen strokes/status on native Windows and Xiaomi; stop on missing kit/clearance/input |
| P0b IDs/lifecycle -> P0c rendering/package comparison | prototypes/input-lifecycle; prototypes/render-feasibility | Two pointers, hover/eraser/touch/palm, focus/display/rotation; identical bounded render workload and measured budgets | Architecture/renderer evidence on both targets, not production app |
| C01a packages -> C01b bounded controller/CI -> C01c clean-device smoke | src/platform, src/app, scripts/delivery, tests/controller, packaging, .github/workflows | Reproducible pinned build; offline clean launch; wrong repo/timeout/malformed QA/failed merge stops; no uncontrolled CLI loop | Runnable shell and controller; no ink/boards claim yet |
| C02a document/store -> C02b initial ink/stabilization -> C02c gallery/recovery | src/document, src/storage, src/ink, src/ui/gallery, tests/storage, tests/ink | Two boards, vector+raster ink, genuine pressure, size/opacity, raw vs filtered samples; load/save identical state; interrupted writes/corrupt versions | Saveable drawing boards; stop on any silent data-loss result |
| C03a viewport/history -> C03b native arbitration -> C03c UI integration | src/view, src/history, src/input, src/ui/canvas, tests/input, tests/history | Transform invariance; undo/redo including canceled redo branch; pinch/rotation and requested taps; focus/palm/device changes | First human batch: write/sketch, navigate, undo, save/reopen both targets |
| C04a ink/textures -> C04b paint variants -> C04c smudge/erase | src/brushes, src/raster, src/ui/brushes, tests/brushes | Bounded tip/grain fixtures; declared reference outputs/settings for6 brush families; shared Paint/Smudge/Erase; finger smudge vs stationary picker | Original brush set and smudge; no imported-engine parity claim |
| C05a composition -> C05b colours/paper -> C05c artboard/DPI | src/layers, src/compositor, src/colour, src/artboards, src/ui/inspectors, tests/composition | Blend/mask/clipping reference pixels; group/lock/visibility/opacity/history; HSL/palettes; DPI metadata vs resample | Layered colour/paper workflow with finite artboards |
| C06a selection/clipboard -> C06b curves/erasers -> C06c held recognition | src/selection, src/geometry, src/shapes, src/ui/selection, tests/geometry | Mixed vector/raster selection; transformed clipboard; ruler; node/point/whole/segment/intersection erase; shape preview/cancel | Editable drawing with held-line/curve shapes; locked objects protected |
| C07a bucket -> C07b blur -> C07c experimental import | src/fill, src/filters, src/brush_import, src/ui/effects, tests/effects | Gap0/1/n, open boundary, tile seam, overflow/low-memory/cancel; finite blur math; malformed archives and every unsupported-setting warning | Second human batch: ink/colour/smudge/layers/vector/fill |
| C08a text/fonts/notes -> C08b attached connectors | src/objects, src/text, src/connectors, src/ui/text, tests/objects | Unicode/missing font/long text, edit/transform/reopen; move/delete target updates or explicit orphan; clipboard/history | Editable annotated diagrams |
| C09a image/PDF -> C09b reference companion | src/import, src/reference, src/ui/reference, tests/import | Selected PDF pages; damaged/oversized decode; floating/docked independent pan/zoom/picker; cancel preserves board | Reference-led sketching/whiteboarding |
| C09M a object paths -> b camera/manual/timed -> c explicit commit | src/motion, src/ui/presentation, tests/motion | Mixed group/locked/missing IDs; pause/end/cancel; repeated replay no drift; exact restore; one undoable commit; save/sync isolation | Audience movement aid without changing original by default |
| C10a image/PDF -> C10b recording/replay and finite-frame video export -> C10c PSD exchange | src/export, src/timelapse, src/interchange, src/ui/export, tests/export | Finite frame/DPI/background; cap/interruption/replay; native master preserved; real Procreate/Clip Studio losses disclosed | Third human batch: annotated diagram, motion, exported artwork and replay |
| C11a OAuth/simulator -> b queue/retry -> c conflict UI | src/sync, src/credentials, src/ui/sync, tests/sync, tests/api-samples/drive | Every offline/expiry/429/partial/duplicate/revocation fixture; restart queue; preserve both competing lineages; disconnect retainslocal | Optional cross-device sync without local-use login |
| C12a providers/simulators -> b selection/review -> c reviewed insertion | src/ai, src/credentials, src/ui/ai, tests/ai, tests/api-samples/ai | No key/outage/cap; exact selected payload preview; malformed/unsafe output inert; human edit/insert/undo | BYOK summary/diagram only after base human validation |
| C13a DOCX/PDF/JPG -> b full regression -> c release rehearsal | src/export, packaging, docs/support, tests/release | Rendered/parsed artifacts; both clean target packages, core workflows, security/licenses, recover/rollback; actual merged identity | Fourth human batch then separately authorized private release |

For every row QA covers applicable unit/contract/native UI/integration/security/performance/recovery, labels N/A with reason and runs impacted regression. No browser test is substituted for native pen/UI. Fixtures are synthetic and resettable; reset consumes a single versioned scenario contract, not duplicate handwritten seeds. Expected commands are standardized at C01: configure/build preset, host model test runner, native UI runner, adapter simulator runner, evidence pack and validator. Exact preset names/SDK paths must be established at C01a before those commands are supplied; pretending they already exist would be dishonest.

## 10. Automation, spend and ownership

Gatekeeper defines scope/criteria/evidence. Architect expands exactly one READY task manifest. Builder edits only permitted source. Opposite-model QA independently owns tests/fixtures and cannot repair source. Code/security reviewers inspect affected boundaries; Gatekeeper closes only from evidence. If alternate model unavailable, fresh same-model fallback is recorded; no claim of cross-model QA.

First execution must be supervised/bounded until controller stop behavior is proved. Model subprocesses are OFF by default. User approval must specify a budget before unattended CLI work. Proposed initial controller ceiling: one task/session,15min wall time,three model calls total (one Builder,one QA,one Gatekeeper). Any failed result stops that three-call run; no automatic repair or extra model call. A repair/retest pair and subsequent review may run only when explicitly budgeted inside a separately approved cap, never as an uncounted extension. Absolute skill repair maximum3 including retained history remains; existing P0a used2, so only1 remains. The first P0a-WIN-D1 packet uses no local model subprocesses. No automated re-auth smoke when valid identity is unchanged; no repeatedly reading all skills/repo; only linked delta packet. Provider/API usage caps can be enforced only with actual returned usage; subscription remaining allowance is not a reliable token meter. If usage cannot be measured, do not claim a hard credit cap; require supervised run or deterministic tests without model calls. Never buy credits/subscriptions or silently switch to a billable provider.

Stop on wrong remote, user hold, missing Gatekeeper authorization, changed baseline, unbound source/build, failed/blocked acceptance, timeout, missing artifact, malformed review result, budget exhaustion, unauthorized scope or failed post-merge regression. Save state/evidence and identify one next action; no unrelated-document busywork. CI, when later approved, has limited branch/path triggers, least-privilege token, no secrets on untrusted contexts, <=10min jobs/cancellation and no main/release promotion. GitHub compute and model usage are separate budgets.

Incremental graph: append evidence-backed requirement/decision/module/test/status relations at each material change; proposed decisions cannot create implemented/passed edges. Validate IDs/references before closure; preserve all earlier evidence. A delta is not a validated full knowledge-graph package/viewer.

## 11. Definition of Ready/Done and human review

READY requires approved scope/UX/domain/data/contracts, required samples/simulator, numeric budgets, test-data plan, exact allowed file manifest, compatible toolchain, no blocking contradictions, rollback, budgets and both approval controls. During this hold no implementation task is READY. Plan review can be complete while build readiness remains blocked.

DONE requires independent test results bound to actual source/build, all relevant target criteria, disposed defects, code/security/Gatekeeper review, reviewed integration merge and merged regression, updated docs/graph and publication receipt. Branch green, generated test code, a screenshot or model narrative cannot close a checkpoint. Blocked Windows9 regressions remain blocked until legitimate clearance and exact-source rerun; new input sidecar success cannot erase that obligation.

Batch1 C01–C03: 10–15min handwriting/sketch/pressure/navigation/history/save-reopen on both devices. Batch2 C04–C07: inking, colouring, smudge, clipped layers, vector editing/fill. Batch3 C08/C09/C09M/C10: diagram/reference/motion/replay/exchange. Batch4 C11–C13: offline edits/conflict preservation/selected-content AI/export. Every card provides tested build/version, launch instructions,3 high-level tasks and known issues. User feedback on feel is authoritative; no AI simulation marks it accepted.

## 12. Deployment, rollback and gate-closure ledger

Pre-release packages are private candidates, never public launches. Windows/Android data directories remain separate from app binaries; rollback app version does not silently reverse document migration. Preserve original/native master and prior validated revision. Controller integration merges into a dedicated reviewed integration branch; main stays unchanged until protected verified promotion is authorized. No dependency/control hook can replace independent review.

| Gate group | Required concrete evidence before closure | Current disposition |
|---|---|---|
| G00–G04 | Reconciled confirmed decisions/roles/workflows/scope/criterion map and fresh source identity | Planning evidence available; independent scores not assigned |
| G05 | Adopted numeric targets plus real device workload/capacity/latency method | Proposed targets; measurements missing |
| G06 | Native screen/state/gesture baseline and fixture references reviewed | State solution specified; native baseline not locked |
| G07–G08 | Reviewed invariants/logical schema/version/recovery/migration/limits | Contracts specified; deterministic recovery evidence not yet present |
| G09 | Sanitized Drive/AI sample registry and working versioned simulation | Planned; cannot build/serve during no-code hold |
| G10 | Native input/render/toolchain/package evidence and licensed architecture | Candidate; WSL physical input failed; Windows/Android target evidence missing |
| G11 | Threat/control/dependency/module/license/credential review | Design specified; dependency/licensing evidence missing |
| G12–G13 | Resettable native/engine/integration verification strategy, reproducible packages/controller/rollback | Strategy specified; executable environment not established |
| G14 | Independent assessment of all above with resolved contradictions/accepted named risks | BLOCKED; plan review does not alter it |
| G15 | User chooses approved plan/build scope after G14 | User explicitly requires confirmation; not granted |

## 13. What approval means

Approve UNRULY-PLAN-2026-10-04-R1 only after reviewing the above scope/policies. Approval permits the named first pre-build task packet and evidence preparation; it does NOT authorize a whole-app unlimited run, production code before G14, paid subscriptions, employer policy changes, public release or main merge. First packet is exactly P0a-WIN-D1: Windows-native input evidence only, allowed paths prototypes/windows-input-slice and docs/delivery, plus separately reviewed prototype CI only if its compute allowance is approved. Deliver one Windows diagnostic candidate, visible zero/event/sample/pressure status, source/build identities and independent test report. Native Windows compile/launch/real pen are separately reported; Windows SDK or clearance absence stops this packet. Android cannot be added to this run: P0a-ANDROID-D1 is its own later packet after separate readiness. All packets remain HELD until explicit user approval; at most one bounded packet runs and reports back. Existing diagnostic source cannot be reused or built without explicit permission and independent plan/contract review.

No deadline or total token estimate is asserted. Large scope and real-device dependencies make a complete tested release in one unattended night unsupported. Success of the next run is a reviewed native-target artifact/evidence or one concrete bounded blocker, not another broad status dump.

## References used for planning

- Saved PROJECT_STATE.md and .project-governance/state.yaml; ENGINEERING_BASELINES.md; ENGINEERING_DECISIONS.md; CHECKPOINT_PLAN.md; CHECKPOINT_CONTRACTS.json; independent GATEKEEPER_READINESS.md on personal preparation branch.
- Software Delivery Gatekeeper skill, lifecycle, native runtime, vertical slices, adversarial review and QA handoff references.
- https://doc.qt.io/qt-6.10/supported-platforms.html — candidate platform/toolchain support, not application verification.
- https://doc.qt.io/qt-6.10/licensing.html and https://www.qt.io/development/open-source-lgpl-obligations — dependency/module distribution evidence required before packaging.
- https://help.procreate.com/procreate/handbook/gallery/gallery-file-types — PSD/interchange direction.
- https://help.procreate.com/procreate/handbook/brushes/brush-library — brush interaction/import reference; no native-engine equivalence claim.
