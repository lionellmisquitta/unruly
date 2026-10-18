# POSE1A active build — continuation

18 October 2026. Owner authorized starting this build. **Implemented, not merged or published.** EXPORT1 remains live.

- PR: https://github.com/lionellmisquitta/unruly/pull/38 (draft)
- Branch: CHG-UNRULY-POSE1A-1018
- Base: c708d177044c547d13671d7fce1d50f3f05855e8
- Latest candidate: 9ac9dbaa5c9a4a14c052a4dd061ce60dcb4bfc66
- Exact tree: f69effaafa376c7f7d5b998e11a6bf6845b296b1
- Latest cumulative CI: https://github.com/lionellmisquitta/unruly/actions/runs/39132721085 — queued/pending at this record; inspect actual result before claiming success.
- Local worktree: /workspace/scratch/da4e481aed8b/unruly-pose1, local HEAD235a83e has the same application tree as latest remote candidate. Remote connector commits differ from local commit IDs; compare tree, do not overwrite/reforce remote.
- Previous CI39132400524/source638b17d:20pose models and5/6pose browser journeys passed. POSEB03 exposed duplicate no-op change notifications adding redundant local Undo states. Validated semantic no-op suppression fixes this; original assertion unchanged. Intermediate source a6f625a / CI39132587306 superseded by latest candidate; do not interpret cancellation as a new defect.
- Full local model suite650 PASS before UI-only repairs; focused20pose models rechecked PASS afterward; additive12CI-contract checks PASS. Latest-source cumulative browser results remain required.
- First artifact12138541224 SHA256525529c2873adb7c560ea688e9ca087d8bad7f02a51fffff77967327fdf50f5d downloaded/verified; desktop1280x900/phone375x850 screenshots reviewed. Starter chooser's stale Neutral label corrected in latest source. Local Chromium download failed, so browser execution uses GitHub.

Scope implemented: human quaternion 3D rig,18original action starters covering carrying/pulling/pushing/lifting/object/sword/hammer swinging/crouching/exaggeration, fixed-length editing and hand/foot IK/pins, symmetric adult/child/chibi/custom proportions, full horizontal/vertical camera orbit/pan/zoom/perspective, props, mirror, local pose Undo, independent pose/proportion and combined presets, bounded JSON backup/import/CAS and per-board pointer-transparent reference overlays. Native artwork/history/store/renderer/export/recording modules unchanged. Native artwork backup excludes separate pose data; UI explains separate backup. No downloaded pose dataset, dependency, graph or skill change.

Next: inspect latest CI and exact-source pose results first; preserve all assertions, repair only confirmed defects. If green, inspect latest browser/visual artifact, verify all cumulative shards/source manifest and prepare release review. Do not restart implementation, rebuild EXPORT1, publish unverified code or claim physical-device acceptance. Update branch roadmap/current/continuation and this active record with the observed outcome. Animals/external data conversion remain POSE1B/C; coordinated two-hand grip/asymmetric proportions and physical acceptance remain open. All other original roadmap requirements/explicit deferrals retained.
