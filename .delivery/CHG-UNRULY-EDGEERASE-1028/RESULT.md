# Motion edge drawing and retained erasure — candidate receipt

Base7022ce5b27917e87c1123aa2e2c94916c386fa26 (live PR61). Original eraser PR53 is still unmerged: this candidate ports only its bounded input repair and six model regressions, preserving all current main behavior/docs. No roadmap, graph, existing QA records or unrelated pending changes removed.

Implemented: pen/mouse path drawing pans at screen edges, including corners, at a gradual maximum520CSSpx/s. A held stationary pointer continues across document space.50ms maximum per-frame integration prevents resume jumps. Release captures exact endpoint, stops animation and restores original view; pointercancel/lost capture/blur/hidden stop and restore prior path. Existing camera framing, saved cues, crosshair endpoint, preview/commit/native schema retained. Only collinear forward segments coalesce; turns and backtracking remain,128point cap unchanged. Path-cap feedback freezes further pan rather than losing geometry.

Eraser: at2000sweeps/work/partial-precision capacity retain last valid preview, freeze further work and ask owner to lift/continue. Normal release commits one existing Undo command; cancellation and noncapacity failures retain atomic rollback. Original model limits unchanged. This repair does not claim unlimited erase work or physical Surface certification.

Local models95PASS: model, motion, pen, CI guards/mutation tests and text/cache. Browser24motion casesPASS (existing18+6edge/cancel cases),20pen casesPASS (existing18+2held-2100-event release/cancel). New edge tests select actual text, cross all4viewport edges, include390px/DPR2, save/reload and exact view/artwork restoration. The top-edge scenario additionally uses browser CDP pen input; focused final run is recorded in PR. Eraser tests admit a real CDP barrel gesture then send2100reported movement events, assert preview stays erased, no pre-release persistence, single Undo/Redo/reload and explicit cancellation.

Development corrections: canonicalize zero edge delta to avoid negative-zero model mismatch; ensure the new barrel fixture starts with Brush after choosing Whole erase mode, so tool-restoration assertion tests intended input state. Assertions retained. Offline fixtures change only matching worker literals (v10-20261028-edgeerase-1).

Full exact-source cumulative CI, merge and hosted-byte publication remain pending at this immutable candidate receipt. The final PR/release receipt records source/run/artifact identities and outcomes. Same-session tests only. Surface/palm/pen feel remains owner acceptance.
