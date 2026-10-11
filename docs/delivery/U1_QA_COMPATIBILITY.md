# U1 inherited QA compatibility changes

QA owns these changes. Existing test groups remain; no valid failure removed or skipped.

- M04 protective-lock rule supersedes legacy locked-delete success. Added explicit locked-delete rejection, unlock before legitimate delete, undo restores unlocked state; UM06 additionally requires locked opacity/blend/content rejection.
- S03 lock policy permits copy. Locked selection copy now must match exact stroke data; hidden-copy rejection retained. Content lasso/delete restrictions retained. Independent UM05 tests locked layer duplication with fresh IDs.
- Existing browser storage queries/fault injection now target `unruly-workspace-v3`, the new current store. Historical `unruly-workspace` is explicitly seeded/read-only-compared by UB04–07, including current/previous fallback, selected source, collision, mapping atomicity, quota/retry.
- Hand-built normal-layer renderer fixtures now explicitly carry `blend:'normal'`. Frozen renderer fixture remains byte-identical; exact normal-render equality retained.
- Future UI locator adaptation must preserve substantive behavior and be appended here after candidate markup inspection.
- Compact UI changes legacy labels (New→New board, Boards→Gallery, Pen→Brush, Pan→Pan canvas, Lasso→Lasso selection, Move→Move selected strokes; Size/Brush/Erase labels now explicit). `u1.compat.cjs` routes inherited locator requests to those real controls, opens actual toolbar/menu buttons before operations, and closes actual popovers before inherited drawing journeys. No app handlers or hidden-property mutation used. Selected opacity replaces per-row slider; synthetic input/change sequence preserves one commit. New UB01/02 independently test overlay geometry/dismissal/ownership without adapter; UB10 tests actual keyboard and grip reorder plus one opacity Undo.
- W07 export and W08 foundation-copy schema expectations now require v3. UM03 explicitly covers v2 upgrade plus unchanged original geometry/pressure, and UB04 verifies actual source stores remain unchanged. Paper details are opened through their real summary before inherited Background controls.

## CI1 evidence-backed fixture repairs (72094fc, run37423089580)

- W01-mobile/W06: actual paper label is Pattern. Trace shows real summary click succeeded, but obsolete Background locator remained absent. Alias corrected to Pattern; all paper mutation assertions retained.
- U01–04: actual screenshot/trace shows mouse polygon starting inside newly opened Selection popover, selecting Copy label text instead of contacting canvas. Lasso helper now dismisses through actual Escape before polygon, as pen helper already did. All geometry/history/cancel/clipboard assertions retained.
- UB01 desktop/tablet/phone, UB10, UB12: trace/source shows prior Saved text read before500ms autosave; live rows ahead of durable DB and undefined middle ID. `saved()` now waits550ms and requires exact durable Saved message. Initial migration readiness separated so explicit recovery warnings are accepted only for initial setup, not successful saves.
- W12/U06: QA server literal-CACHE regex obsolete for NORMAL_PREFIX expression. Worker update now rewrites complete CACHE expression within the same normal namespace. Registration readiness polls resolved Boolean state from Node; async browser wait predicate can resolve immediately on a Promise. Original assertions that waiting worker survives active gesture and failed save remain.
- New UB15 proves protective lock keeps an existing lasso selection usable for Copy while Cut/Delete/Paste remain blocked. This covers the separate source-proven lock-selection gap; test is not a relaxation of lasso write guards.

CI1 remains retained with its original failing evidence and full matching SHA256 manifest. No CI1 failures were deleted, skipped or weakened.
