# P0a independent Claude QA ? 3 October 2026

Overall: **BLOCKED**. Codex Builder/local executor; Claude Code independent adversary using supplied Quality Engineering Adversary skill/protocol with all tools disabled. User explicitly approved the enumerated P0/protocol payload and sanitized evidence transfer. No unrelated repository/organizational material, credentials or private boards were sent. No hooks, security settings, subscriptions or infrastructure were changed.

## Actual results

| Phase | Actual result |
| --- | --- |
| Initial source | Existing10 and Claude adversarial9 passed: both compile/test exits0. |
| Defect reproduction | Claude-authored capacity2 cases failed: exit1, four failed assertions. |
| Codex repair cycle1 | Capture marks full/inactive immediately on accepting sample8000; original final sample still returns true. |
| Repaired source | Existing10 and capacity2 passed: compile/test exits0. |
| Repaired adversarial9 | Compile exit0; executable launch blocked by Windows Application Control, WinError4551. Tests did not run. |
| Native/UI/device/Android | BLOCKED; no new native compilation/device test claimed. |
| Merge/merged regression | No merge or push; merged regression NOT_VERIFIED. |

Current repaired model coverage: **12 passed, 9 blocked, 0 executed failures** across21 planned cases. An observation line is not an extra passing test. Historical initial19 passes do not verify the repaired source. One application repair/retest cycle was used; further cycles stop at the environment blocker rather than weakening tests or bypassing App Control.

## Findings and ownership

QA-F01: exact-capacity status/capture transition defect reproduced and repaired by Codex, independently assessed by Claude as FIXED_MODEL_SCOPE. Native final-sample rendering and limit display remain blocked. QA-F02: raw model preserves all finite coordinates; this contract is now explicit in the README. Extreme-coordinate renderer safety remains unverified. Lost-release/contact identity, focus/lifecycle, eraser identity, mouse/finger exclusion and physical pen feel remain native risks.

Claude owns adversarial_tests.cpp (9 cases) and capacity_regression.cpp (2 cases); Codex did not change their assertions. Codex changed only the prototype capacity transition and coordinate/capacity documentation. The generated adversarial diagnostic still says 'proposed' and 'full lags'; these are stale literal labels, not execution statuses. Actual process exits/stdout and phase identities govern the result.

## Invocation and failed-attempt evidence

The bundled active extension executable is Claude2.1.288; CLI model usage reports claude-opus-5-5. Active extension registry/path is resolved and version verified for each model call; extension updates may change the path. All calls use --tools empty, disabled slash commands/MCP, no session persistence and existing authentication; no --bare. Fresh independent calls exchanged explicit packets rather than Builder reasoning. Exact argv, response JSON, sessions, elapsed times, exits, payload/output hashes and provider-reported costs are in *-invocation.json.

First authorized review timed out at301.179seconds with no response; preserved as review-invocation.json. A Windows command-length guard subsequently prevented one launch locally (no process started). One compact review retry succeeded at54.346seconds, exit0; evidence assessment35.482seconds, final assessment29.416seconds and evidence addendum20.921seconds each exited0 with parsed JSON. The addendum supplied actual initial-phase artifacts omitted from the first final packet; it supersedes that packet's artifact-availability objections without changing BLOCKED.

A local command-wrapper quoting failure occurred before compilation and was preserved. The wrapper was corrected without modifying QA tests. During the red phase, separate existing/adversarial binaries were blocked by App Control; the distinct capacity regression executed and failed. During the repaired phase, existing/capacity executed and passed, adversarial remained blocked. Blocked files were not retried or relocated to evade the policy. Compiler output from the first interrupted App Control launch was not persisted; the exception and its stage are recorded without invented stdout.

## Exact identities and resume

Starting Git HEAD cb1d52089c5cdd159050dc375b92750eb84d8271; dirty source is identified by current-source-identity.json and repair-cycle-1.patch, not commit alone. main.cpp changed from ea017f7065a43917bfc457cd342ad7f12d998193fa7765ecef8bfdcd0b02427c to a0cfc97d441abccf721527471d6bde86090194d7bad9f4316e3ef30a0254d48a. Test and executable hashes are preserved in each execution record; current binary/source hashes were rechecked. Normalized case JSON is deterministically derived from actual stdout/exits, not falsely labeled runner-native output.

Evidence directory: ../evidence/claude-2026-10-03/. Canonical controller summary: QA_CHECKPOINT_RESULT.json. Immutable independent final verdict: evidence-addendum-response.json. Historical ../QA_REPORT.md is unchanged and refers to pre-repair source identities.

Next: obtain legitimate Windows policy clearance for the saved repaired adversarial executable at build/claude-qa/repair-cycle-1/suite-1.exe, verify its saved hash, then run it once and return sanitized results to Claude. Do not change organizational policy or bypass App Control. Qt desktop/Android kits and real devices are still required for native coverage. No checkpoint closure or production authorization is implied.
