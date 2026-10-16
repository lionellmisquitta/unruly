# Current checkpoint — STAB1 implementation, verification pending

STAB1 (REQ-005/C02) is the active authorized build on `CHG-UNRULY-STAB1-1016/stabilization`, base `6aa05f0b3767fcc45466240c5d6778d9e9d5dc93`. Device-local0–100 smoothing for ink/image tips,pixel paint and masks; Off default. Local14model tests PASS; focused Chromium/cumulative CI and publication pending. Retain TIME1 as latest published source until verified publication. Knowledge graph and skills unchanged; .knowledge remains at TIME1 by explicit instruction. Resume from scoped .delivery/CHG-UNRULY-STAB1-1016 records.

## Historical TIME1 closeout


Source 0bab964ad5722c5dc3fd6dbe67c5705125635447; cumulative CI38781105113 SUCCESS:386model tests,348Chromium JSON scenarios plus2legacy console checks. Publication runner verified the downloaded artifact ZIP digest, commit identity and155source hashes against this pinned checkout. PR18 merge 486b114c50b98de0effe3806e69306ea43619991 has exactly the tested tree8211680c308c9100eca3591bfd414b19abe698f9. Publication 5eead4c6265c6b9d181dd2255246df8ddfb400f6; Pages 38786233048 SUCCESS; 61 hosted application files match tested bytes.

TIME1 delivers opt-in local recording of completed board edits, Undo and Redo. Actions→Timelapse→Start recording closes the inspector for drawing; the recording badge reopens it. Pause/Resume capture, reload-paused recovery and board-switch isolation preserve the saved prefix. Resume marks an unrecorded gap/current state; it does not fabricate intermediate edits. Selection/revision-only changes and cancelled strokes are excluded.

Replay saved changes offers scrub,Next state,0.5×–4× speed,idle skipping,Pause/Resume and Stop/restore. Blur/hidden/resize pauses playback. Temporary preview never changes h.board,autosave,native export or Undo. Stop/Close restores current artwork and view. Tested composition pixels match source at DPR1/2 with group blur,masks,clipping,text and raster. Replay displays completed operations; continuous pen-point animation and clean video export/framing remain OPEN.

Separate IndexedDB unruly-timelapse-v1 stores a baseline and owned text deltas, leaving native board schema/model/history/artwork storage/renderers unchanged. Limits:2000states/32MiB UTF-8 event payload per board,128MiB global payload;4queued snapshots/32MiB conservative UTF-16 queue. Atomic revision-guarded appends and discard tombstones preserve conflicts. Limit/quota/backpressure/error visibly pauses capture; artwork editing/autosave continue. Browser storage overhead,total process memory and target-device/long-session performance remain unmeasured.

Native artwork JSON excludes recording. Back up recording downloads separate JSON. Import validates every reconstructed board; attaching a different-board backup to an empty recording slot requires confirmation and remaps only recorded root board IDs. Artwork/Undo remain unchanged. Discard requires separate confirmation. Browser eviction/site clearing/abrupt tab termination still require backups; no cloud sync claimed.

14new model tests and16new browser journeys;54existing application files byte-identical to base. Seven legacy offline tests changed only exact SWcache identity literals. Static UI validation0errors; same-session visual review83/100 and warning dispositions in UI_REVIEW.json. No independent human/protected approval claim. Local execution disconnected after initial checks; final exact-source execution and downloaded-artifact/host verification ran in GitHub.

Next proposed checkpoint: adjustable stroke stabilization/smoothing. Owner reprioritization on16-Oct-2026 puts all remaining drawing/painting tools and compatibility work before clean timelapse video export, then artboards/dimensions/DPI/PNG-JPG-PDF export. See PRODUCT_ROADMAP Current build priority. These are work groups,not fixed build counts; all other retained scope remains. No automatic next build. All PRODUCT_ROADMAP rows remain, including Drive sync and BYOK AI first-release intent. Motion Trace same-layer mixed region/original-object compatibility,32layer/30–50interactive capacity and physical Surface/Xiaomi/Lenovo/palm/pen/audience/long-session acceptance remain OPEN. No early-access scope cut approved. Knowledge graph refreshed through TIME1 on16-Oct-2026: seven published batches/eight checkpoints captured; zero application builds since refresh. Exact revision/commit/hashes in .knowledge/CURRENT_GRAPH.json. Skills unchanged.

Scoped records: .delivery/CHG-UNRULY-TIME1-1015/ includes impact/plan,UX/visual boundaries,known limits,all failed/superseded attempts,manual scope/schema checks,change-impact map and QA/publication receipts. Earlier active-attempt entries are historical.

## Cost-conscious continuation — owner instruction, 16 October 2026

- Read current checkpoint and the relevant roadmap section once; retrieve only affected code/tests. Re-read only when source changed or needed evidence is missing.
- Run targeted model/browser checks during development. Run cumulative QA once the candidate is stable; repeat only after a relevant change, failure or unresolved regression risk. Preserve every assertion.
- Keep source identity and concise machine-readable test summaries. Read failure excerpts first; fetch full logs only to diagnose a specific unresolved failure. Account for legacy result formats instead of guessing totals.
- Avoid rapid CI polling and repeated status commentary. Use a bounded wait/status check; when a long job is still running, save exact source/run/next-action state so continuation never rebuilds completed work. Report honestly if pending.
- Render/encode video deterministically with browser/CLI tools. Validate dimensions, duration, frame counts and cancellation automatically; inspect a few representative frames and failure samples rather than asking the model to review every frame or full video.
- Keep screenshots/logs bounded; rerender only changed/uncertain states. No default subagents or automatic knowledge-graph refresh.
- Documentation-only roadmap/status changes do not require browser tests, full CI or redeployment. Validate preserved requirements and changed paths directly.