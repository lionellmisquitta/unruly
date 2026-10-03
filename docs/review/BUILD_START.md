# UNRULY — start-of-build boundary

3 October 2026. Product scope is substantial; engineering readiness is incomplete. Proceed with quarantined feasibility work, then independent pre-build review. Production authorization remains false.

## Work started
P0a contains a small Qt/C++ raw-pen probe under `prototypes/p0-pen-input/`. It exercises pressure routing and bounded sample capture without network, accounts or document writes. Qt is a candidate; this does not choose the final stack. The simple CPU renderer isolates input and cannot certify the requested drawing feel.

## Work required before production implementation
1. Consolidate confirmed scope into stable acceptance criteria and resolve remaining material product choices. Preserve every first-release requirement; give each feature a testable boundary. Lock interaction states, recovery/error paths and batch review cards.
2. Evaluate native input and GPU/tiled rendering on both platforms. Record runtime/dependency licenses, portable deployment and APK requirements. Prefer one shared engine with platform adapters if evidence supports it.
3. Specify board serialization, atomic save/crash recovery, history and timelapse limits, vector/raster composition, finite fill/blur/export bounds, and compatibility/versioning. Define performance budgets measured on the supplied hardware; do not invent measured results.
4. Define Drive OAuth/scopes and simulated sync failure/conflict contracts, BYOK credential storage and content consent, import/archive limits and privacy boundaries. Product local operation must not require these credentials.
5. Define deterministic engine tests, native UI automation, image tolerances, packaging/rollback and CI. Docker can host integration simulators; actual Windows/Android builds require appropriate native SDKs. Do not fabricate a server or database.
6. Build the controller contract: exact checkpoint/build identity, isolated worktrees, protected remote allowlist, budget/timeouts, three repair attempts maximum, independent QA/review, merged regression, documented evidence and graph updates. The loop stops on failures or scheduled human review; it must not call missing judgment a pass.
7. Independent Gatekeeper reviews the evidence and records production authorization. Gate scores currently remain unassessed; existing templates are not evidence of gate completion.

## Local execution reality
The chat workspace has g++ and Python, but no Qt, CMake, Windows toolchain, Android SDK, Codex CLI or Claude Code CLI. Model-level capture tests can execute here. Native compilation, UI interaction, device testing and cross-model CLI orchestration cannot currently execute here. VS Code extensions on the user's laptop do not establish command-line availability in this workspace.

The intended operator setup is a separate personal clone of `https://github.com/lionellmisquitta/unruly`, preserving the organizational GitLab checkout. No organizational remote, credentials or Git configuration should be changed. Before unattended execution, the controller must verify its actual executables/authentication and every fetch/push destination. Never fall back to an organizational remote.

## Human involvement
User reviews remain at the agreed batch boundaries. P0 additionally needs short device-input evidence before runtime selection because pressure routing and pen feel are hardware facts. Passing model tests cannot remove that dependency. No further confirmation is needed for ordinary engineering choices or already authorized preparation/prototype repository writes.

## First batch after authorization
C01 platform packages and verified controller preflight; C02 local boards/recovery and initial ink; C03 navigation/input arbitration/history. Finish independent tests and merged regression at every checkpoint, then deliver both platform builds and one short review card after the batch. Do not start dependent painting features before required foundation feedback.

## Current evidence
See the probe's `QA_REPORT.md` for exact source hashes, executable capture tests and unverified native areas. P0a, P0 and the product are distinct milestones. No APK or portable Windows binary has been produced at this boundary.

## Updated execution environment — Windows continuation
The earlier chat-workspace inventory above is historical. In the actual personal Windows clone, MSVC 19.50 and CMake 4.2.3-msvc3 are installed in Visual Studio Build Tools; Codex CLI 0.160.0 executes. The 10 Capture-only tests passed after one explicit-conversion fixture repair. Native configuration failed on missing Qt; no device or Android execution occurred. Required Gatekeeper/Adversary skills and Claude CLI were not found. See WINDOWS_CONTINUATION.md, ENGINEERING_BASELINES.md and prototype evidence/windows-2026-10-03/identity.json. Independent pre-build review and production remain blocked.


## Installed delivery skills and authenticated Claude ? 3 October 2026
Both complete delivery skills are now installed project-locally for Codex (.agents/skills) and Claude (.claude/skills); no hooks registered. Active bundled Claude 2.1.288 authenticated smoke returned exactly UNRULY_QA_READY, exit 0, 5.157 seconds. Fresh independent QA launch was rejected by automatic approval review for source egress and broad shell tools before execution. No independent QA ran. A no-tools enumerated-payload proposal is saved for explicit source-transfer approval; native Qt/Android/device coverage remains blocked. Evidence: prototypes/p0-pen-input/evidence/claude-2026-10-03/. Extension updates may change executable path. Production authorization remains false.


## Approved tools-disabled Claude QA cycle ? 3 October 2026
User explicitly approved the enumerated source/protocol and sanitized-evidence transfer. Claude independently authored tests/findings and assessed local execution; Codex executed tests and repaired application code separately. Initial19 model cases passed. Claude capacity2 regression cases failed before one Codex repair and passed afterward. On repaired source, existing10+capacity2 passed; adversarial9 compiled but Windows App Control blocked launch (WinError4551). Independent final QA status BLOCKED. Native/device/Android remain blocked; merged regression not run. Production authorization remains false. See prototypes/p0-pen-input/qa-claude/QA_REPORT.md, QA_CHECKPOINT_RESULT.json and evidence/claude-2026-10-03/. No merge/push, hook registration or policy bypass occurred. Extension updates may change executable path.
