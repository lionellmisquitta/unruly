# MOTION2 local candidate verification

Complete local model suite:609PASS,0failed/skipped across56files. Motion subset24PASS, including13new compatibility cases. Tested both orders, overlapping/repeated regions, camera/folder sequencing, remapped native commit/import/Undo/Redo, untouched far ink, stale/empty/locked/hidden/malformed source refusal, fragment/pixel budgets and attached-connector safety. One newly authored camera assertion was corrected to the documented scale2; no runtime change or previous assertion weakening.

Five additive browser scenarios are in existing motion.browser.cjs (already invoked by cumulative CI): manual Stop/Commit/Undo/Redo; independent per-source pixel oracle for vector+raster+text in both orders at DPR1/2; phone timed/native-import/offline; attached-connector refusal. Local browser remains unavailable because pinned Chromium download failed in the preceding checkpoint; browser results are NOT_EXECUTED locally and require GitHub runner evidence.

Manual scope review PASS. model.js/storage.js/render.js/canvas2d-renderer.js and cumulative workflow byte-identical to base. Fifteen other browser suites change cache identity only, to motion2-1. Original model/browser assertions retained. No merge/publication/physical acceptance claimed. All retained product scope and deferrals unchanged.
