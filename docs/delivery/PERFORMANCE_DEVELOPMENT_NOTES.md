# P01 development notes

6 October 2026: user approved the proposed browser performance checkpoint and asked to retain versions/development notes in Git. Read baseline app, workflows and current scoped selection state; independently reviewed written P01 contract before implementation. Gatekeeper permits quarantined build only. Local directory is a connector-backed extracted checkout, not a local Git worktree; remote Git objects/commits are the source authority.

Scope chosen from measured rendering bottleneck: retained topmost-visible-layer live preview, correctness-preserving middle-layer fallback, fixed five-surface/80MiB nominal backing budget and shared DPR cap. Pixel equality is exact. No data, storage or history migration. Whole-board validation on each pen move identified for bounded scheduling correction. Worker/GPU/tile/OPFS/history redesign is planned separately, not included here.

Preliminary local24 model tests passed on current source. Browser QA not yet executed. No paid external model calls. No release, deployment, main merge or physical feel claim. Repair allowance starts0/2, QA CI allowance0/3; previous checkpoint histories unchanged.
