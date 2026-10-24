# CLEAN1 — unused named imports only
Owner authorized cleanup on23 October2026 and explicitly prohibited touching the roadmap or losing its detail. All roadmap/status documentation is unchanged in this cleanup.
Base: bbe3f624250ce7b747394f278171432a66949da9.
Allowed source edits: remove syncConnectors from selection.js, maxBrushWidth from u2.js, getPreset from canvas2d-renderer.js, hasAdjustment from effect-compositor.js, sampleTransform from model.js, textContains from app.js. Each binding has no reference outside its import; each import statement still loads its original module, preserving module side effects.
Also allowed: this new scoped delivery folder. Prohibited: docs/, tests/, .github/, storage, runtime behaviour, .knowledge and prototype deletion.
Retain all QA records and executable QA tests. Existing CI path trigger and every invocation remain unchanged; CI-contract tests verify complete test registration and unchanged invocation lines. Keeping/removing a report never substitutes for executing tests.
Checks: syntax/import references; affected native/controller/renderer/group tests; actual CI registration and mutation guard; diff path review and exact base comparison. No publication/cache change prepared; CI and release evidence must be reported honestly.

Validation revision: PERF2M01 locks renderer source bytes, so restore canvas2d-renderer.js exactly and retain its getPreset import. Do not change any test/fixture hash merely for cosmetic cleanup. Remaining five unused imports are the final scope. First run:69 pass/1 exact-byte guard failure; replacement required after restoring renderer.
