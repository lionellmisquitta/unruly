> Historical recovery draft, superseded by UNRULY_EXECUTION_PLAN.md and USER_APPROVAL_HOLD.md. Its conditional implementation language is not current permission. All coding is paused pending explicit user confirmation.

# UNRULY executable delivery plan — recovery baseline 2026-10-04

## Authority and current state

This plan replaces the broad continuation instruction, not the user's confirmed requirements or existing source. Read with CHECKPOINT_CONTRACTS.json (17 inherited contracts) and WINDOWS_INPUT_CONTRACT.json (one bounded supplementary P0a task). Base: c7801f968279f25b8c9612197add1cc41466ed96 on personal lionellmisquitta/unruly. No reset/pull/main merge is part of this task.

Production build authorization remains false until independent G14 approval. Fourteen product checkpoints C01–C13 plus C09M exist; zero is closed. P0a/b/c are explicitly pre-build feasibility gates, NOT completed product features. A prototype permission does not imply production readiness. Current physical result: WSLg window eventually opened after Windows restart, but user pen produced no ink or sample/pressure readout. Cause remains unproven. Synthetic29 does not satisfy real-device acceptance.

## Mandatory order

G00 intake -> G01 outcomes -> G02 users -> G03 workflows -> G04 requirements -> G05 quality targets -> G06 interaction baseline -> G07 domain -> G08 data -> G09 integration simulations -> G10 architecture -> G11 security/license -> G12 tests -> G13 deployment -> independent G14 -> recorded Build mode -> C01 onward. Later discoveries reopen affected gates.

The architecture and UX placeholders in the earlier preparation snapshot are not accepted baselines. No score is assigned merely because files exist. ENGINEERING_DECISIONS.md remains candidate architecture. P0 resolves input/rendering dependencies BEFORE technology is locked; it is a permitted quarantined feasibility task in the original Gatekeeper lifecycle. Do not present it as implementation progress toward a closed C checkpoint.

## Product checkpoint order and human batches

| ID | Observable delivery | Depends on | First mandatory closure evidence |
|---|---|---|---|
| C01 | Offline native launch from Windows folder and Android APK; reproducible build and bounded local controller | P0c, G14 | Clean-machine launch both targets, dependency/license receipt, deterministic controller stop tests |
| C02 | Create two boards, draw vector/raster ink, save, quit, reopen and recover interrupted save | C01 | Exact-state roundtrip, corrupt/partial-write fixtures, pressure/size/opacity/stabilization scenarios |
| C03 | Pan/zoom/rotate, layered ink, transaction undo/redo and touch arbitration | C02 | Pointer identity/lifecycle replay and actual pen/palm/gesture review |
| C04 | Original ink/pencil/marker/airbrush/watercolour presets, textures and smudge | C03 | Declared brush reference images, smudge isolation, malformed texture tests |
| C05 | Layers/groups/masks/clipping/blends, wheel/shades/paper and dimensions/DPI | C04 | Blend/alpha fixtures, mask/history roundtrip, metadata vs explicit resample tests |
| C06 | Lasso, clipboard, transforms, curve nodes, point/intersection erase, held shapes | C05 | Geometry/property tests, locked objects, preview/cancel, persistence/history |
| C07 | Gap-aware finite fill, blur and experimental brush import with disclosed losses | C06 | Gap/tile/boundary/resource/cancellation fixtures and unsupported-setting report |
| C08 | Editable text/fonts/sizes, notes and attached connectors | C06 | Font fallback, Unicode, endpoint/missing-target fixtures and undo/reopen |
| C09 | Images, selected PDF pages, floating reference and colour sampling | C08 | Bounded decode, malformed files, independent reference view, cancel/recovery |
| C09M | Object/camera Motion Trace, manual/timed cues, restore default and explicit commit | C06,C09 | Repeated replay no drift; restore exact original; commit one transaction |
| C10 | PNG/JPG/PDF, timelapse and approved artwork exchange route | C07,C09M | Valid artifacts, replay/storage/cancel; actual external-app roundtrips |
| C11 | Drive OAuth, offline queue and conflict-preserving sync | C10 | Versioned simulated fixtures before live calls; expiry/retry/partial/conflict tests |
| C12 | BYOK selected-content summaries/diagrams, explicit send and insertion review | C11, human base validation | Sanitized provider simulator, malformed result/no-key/offline tests; explicit payload review |
| C13 | Summary DOCX/PDF/JPG, regression and reviewed release packages | C12 | Rendered artifact validation, clean target launch, release/security/license review |

Human batch reviews: C01–C03; C04–C07; C08/C09/C09M/C10; C11–C13. AI features remain in first release after base validation. No per-checkpoint demand for human feel feedback. Native feasibility requires targeted pen evidence before the first batch because choosing an input stack without it has already failed.

## Split each checkpoint into one-session tasks

The C IDs remain stable review boundaries. Each task changes at most one capability and a bounded file set. In particular, C01 is executed as C01a native packages; C01b deterministic controller/CI guard; C01c clean-device smoke. Never run all C01 or all readiness gates in one unrestricted continuation. C02 is C02a document/revision storage; C02b initial ink/stabilization; C02c board UI/recovery. Future task packets are derived only when their dependency closes; no task is executable simply because a contract exists.

Before each task: bind exact source/branch/build; check prerequisite statuses; list allowed paths; identify one visible result; emit CHECKPOINT_TEST_HANDOFF. After task: independent QA creates/runs tests; Builder repairs only source; independent Gatekeeper reviews evidence; merge reviewed branch; QA reruns against merged identity; update docs/graph; push; then select next READY task. Every required category is run or reported BLOCKED with reason; no invented hosted backend. Native UI tests use platform adapters, not Playwright against an unrelated browser page.

## Execution and spending controls

For this recovery task, no Claude/Codex subprocess or paid API call is launched from ChatGPT. Isolated local reviewer fallback is recorded; it does not claim cross-model QA. Exactly one implementation task may run. Windows CI build, if enabled, has a 10-minute job timeout, concurrency cancellation, read-only repo token and no secrets/live integrations. No recursive agent calls, no repeated whole-repo scans, no installing large alternate stacks. Unattended external CLI work stays disabled until a deterministic controller can enforce explicit spend/time caps and model usage accounting. Subscription allowance cannot be enforced by a guessed dollar ceiling.

One focused QA repair is preferred; maximum three per checkpoint as the skill requires, with existing P0a cycles preserved. If scope changes, stop and replan. Reuse unchanged valid evidence rather than rerunning/auth-smoke/re-reviewing it. Approval cannot be self-authored. Time budgets are ceilings, not permission to claim unrun tests passed.

## Next bounded feasibility execution

P0a-WIN-D1: native Windows input sidecar using only Windows SDK/MSVC, isolated in prototypes/windows-input-slice. Purpose: determine whether Windows supplies PT_PEN and genuine pressure and provide visible drawing/status from first launch, avoiding the failed WSL route and unavailable Qt Windows kit. This sidecar DOES NOT select the production UI/renderer, promote prototype code or replace the Android feasibility requirement. Its model has bounded retained samples; no board files, sync, network, credentials or employer policy modification.

Independent Gatekeeper reviews WINDOWS_INPUT_CONTRACT.json BEFORE implementation. If approved for quarantine, build source and package via existing native tools/CI; independent QA tests host model and Windows compile/smoke where available; return exact evidence to Gatekeeper. Missing Windows SDK, blocked executable or physical test prevents closure. Stop queue there; do not spend another agent session generating unrelated documents.

## Recovery/rollback

Create a new personal branch from the recorded snapshot. Add files; do not modify the user’s dirty checkout. No main merge while production is blocked. Remove only the new diagnostic build directory to undo local output; a source rollback uses an explicit revert commit. Existing boards and prior Windows/WSL evidence are untouched. Never use git reset --hard, git clean or silently clear App Control.

## Current ready/blocked queue

READY: independent review of this plan and P0a-WIN-D1 contract. CONDITIONAL: its quarantined source/build/tests if that review permits. BLOCKED: production C01–C13, runtime/UX locks, Android/device evidence, Windows App Control regression. NOT CLOSED: the full P0a checkpoint and every product checkpoint. Unresolved materially human-owned decisions (license, live OAuth/provider setup, export/timelapse policy) remain listed in original EDRs; none is silently confirmed here.

The original P0a Qt/native-kit criterion remains unclosed. The SDK sidecar contributes Windows input evidence only; it does not satisfy Qt deployment/runtime selection. Two P0a repair cycles were already used; this sidecar permits at most one remaining repair, for a total maximum of three. A prototype-only CI workflow outside prototypes may be published only if the independent review explicitly grants that scoped execution-support permission; otherwise retain it as a candidate inside prototypes.
