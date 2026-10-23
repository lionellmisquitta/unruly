# MOTIONENTRY1
Base bbe3f624250ce7b747394f278171432a66949da9. Owner reports no visible response in both selection/open orders. Confirmed: open silently returns when blocked; unfinished path selection throws rather than completing; no selection starts camera mode which cannot move artwork.
Bounded change: finish valid pending selection outlines using the existing deformation contract; cancel empty drafts; reject invalid outlines with explanation. Report blocked entry. Explain camera fallback and how to draw/preview an artwork path.
Allowed: app.js Motion beforeOpen, motion-ui.js entry feedback, motion.model.test.mjs controller tests and three continuation docs. No motion engine, renderer, storage/schema, graph, gallery or eraser changes.
Verify: actual UI controller entry with/without target and blocked entry; actual app preflight valid/empty/invalid outlines; existing motion model regression. Physical browser pending. Rollback scoped commit. No release authorization inferred from local tests; draft not published.

## Scope revision: explicit selection exit
Owner reports selected-area painting works but cannot exit after switching to pen; fullscreen appears to affect outside tapping. Keep persistent selection for painting and add visible Deselect using existing clear-selection action; no change to outside-click or fullscreen semantics. Additionally allow index.html, style.css, lasso-region.model.test.mjs and paint-workflow.browser.cjs. Test genuine mask/object clearing and unchanged board/history; browser case verifies outside painting resumes.
