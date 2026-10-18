# DRAW1A reference startup repair

Base: 8a47ceb5271cba78d86fd627b3470db2ab33e642. Requirement: issue #39 reference entry reliability; user authorized fix/build and verified main/Pages publication.

The enabled Add reference action can dereference history before asynchronous storage startup completes. Disable it in initial HTML and guard the handler until history exists; syncReference enables it after startup. Preserve normal reference/image import and all previous assertions.

Allowed: prototypes/browser-workspace/{app.js,index.html,sw.js}; tests/browser-workspace/{browser.test.cjs,image-import.browser.cjs} plus the 18 existing files asserting the service-worker marker; docs/delivery/{PRODUCT_ROADMAP.md,CURRENT_CHECKPOINT.md,CONTINUATION_CONTRACT.md,CODE_STRUCTURE.md}; .github/workflows/browser-workspace-pages.yml for exact tested release pin; this delivery folder. Prohibited: drawing/model/storage/export/pose/gesture changes, graph/skills, unrelated UI.

Plan: commit scope first; add delayed-startup and complete reference-entry/cancel/error/default-mode regressions; guard startup; bump cache before cumulative QA; run syntax and extracted-handler regression locally; one stable cumulative candidate; verify exact source/artifact; update release metadata without runtime changes; merge with expected head and verify hosted bytes. Local Chromium is unavailable; CI provides browser execution. Same-session verification only.

Corrects prior DRAW1A impact omission: app.js does own reference entry behavior. The old disabled-empty-reference behavior was replaced intentionally. DRAW1A is already published via Pages39146522140 with cumulative39145627322 and postmerge39146307114 green; older pending doc headings are superseded. This repair does not close gesture/device acceptance or the other issue39 requirements.
