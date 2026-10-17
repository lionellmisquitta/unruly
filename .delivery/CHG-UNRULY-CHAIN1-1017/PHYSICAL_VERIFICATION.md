# CHAIN1 — physical verification

Status: NOT EXECUTED by owner. Engineering tests do not establish physical pen feel or long-session performance.

Use the existing live page only after its publication receipt identifies the verified CHAIN1 candidate: https://lionellmisquitta.github.io/unruly/ . If the footer offers Reload to update, finish any stroke and use that button. Keep a native backup of important work before testing. Do not clear browser storage.

## First usable journey

1. Open an existing/simple test board. Draw a recognizable sketch. Export a native backup if needed.
2. Open Layers → Create Virtual Groups. This creates a project copy. The original board remains in Gallery.
3. Add virtual group. Draw another element. Open Layers again after drawing; the existing canvas interaction dismisses an open panel before beginning a stroke.
4. Activate the lower group. Its layers expand; the upper group collapses but its artwork remains visible in the correct order.
5. Edit the lower artwork. The upper source must not move, deform or acquire edits. Blending may legitimately change the composed appearance when its backdrop changes.
6. Zoom/pan, then activate another group. The canvas view must stay in place, without changing document tabs.

## Record outcomes

| Check | Expected | Owner result |
| --- | --- | --- |
| One editable group | Only the active group's native layers appear for editing; exactly one heading is expanded | Pending |
| Original preserved | Gallery still opens the original standalone board | Pending |
| Correct composition order | Upper and lower groups remain visible while either is edited | Pending |
| Per-group Undo/Redo | Return to a group and undo its own latest source edit; other sources remain unchanged | Pending |
| View preservation | Switching keeps zoom and pan | Pending |
| Masks/blends/effects | Existing folder/leaf masks, clips, opacity and effects retain expected composition | Pending |
| Reload | Project reopens with its saved active group and artwork | Pending |
| Offline | After footer says Ready for offline use, reload offline and switch groups; reconnect afterwards | Pending |
| Full backup | Project backup downloads all source groups; Import project backup creates an independent copy | Pending |
| Native export | Existing native Export backs up only the active group; UI helper distinguishes it from full project backup | Pending |
| Recovery access | Gallery → Native source backups · recovery exposes original native sources for deliberate export/recovery | Pending |
| Pen behavior | Check light/heavy pressure, eraser button, lasso button and palm behavior on Surface/Xiaomi | Pending |
| Longer session | Draw/edit/switch for 20–30 minutes and record stalls, lost strokes or save warnings | Pending |

## Current boundaries

- The project uses authoritative native-source replay as its safe composition fallback; flattened proxies and larger-project performance are not claimed.
- Existing aggregate 32-layer, native-size and renderer budgets remain. Do not treat Virtual Groups as a verified unlimited-layer feature.
- Group histories share the existing history byte budget. A visible notice reports older group Undo history eviction; source artwork remains saved. Reload starts ordinary native history, as before.
- Paper is shared/fixed while a project is active; reference companions are explicitly unsupported for project creation/import. Standalone boards keep their existing functionality.
- Cross-group selection/clipping, group reorder/removal and group lock/visibility controls are outside this engineering checkpoint. Imported hidden/locked group state is enforced read-only.
- If a source is missing, damaged, recovered or externally revised, the app refuses unsafe switching/saving rather than replacing artwork silently. Preserve the warning and backups; do not delete storage to resolve it.

For a failure, record device/browser, active group, action sequence, expected/actual result, footer warning and whether the same project survives reload. Use a copy of the project for reproduction. Physical acceptance remains open until results are recorded.
