# UNRULY — October 10 chat handover pointer

**Status recorded:** 2026-10-09T22:33:59Z / 2026-10-10T04:03:59+05:30. **This handover is fresher than the repository's October 8 full KGP archive.**

The authoritative updated **local handover archive** is titled `UNRULY-NEW-CHAT-HANDOVER-2026-10-10.zip`. It contains the validated `UNRULY-2026-10-10-Updated.kgp.zip` (revision `unruly-kgp-20261009T223359Z`, canonical content SHA256 `09d13234a015e39d58479f7a89bf1778637d42f14fab3459293679ccfafb883f`), newly regenerated/checked 2D and OnAir HTML, and a full `CONTINUE_IN_NEW_CHAT.md` prompt. This archive is a **conversation download**, not a file automatically committed to GitHub. Supply it to the next chat.

See `knowledge-graph/deltas/2026-10-10-delivery-and-size-percent.json` for the GitHub-stored evidence-backed delta.

## Current source truth

- Public preview: https://lionellmisquitta.github.io/unruly/
- Pages workflow on `preview/browser-foundation-2026-10-04` pins **`81af47ee43c5f97f4ddfc217f1d4a2bdd8c34775`**, successful Pages run [37943349529](https://github.com/lionellmisquitta/unruly/actions/runs/37943349529). Published cumulative fixes: ERASE1, PRESS2, G02 beta gestures, graphite, fullscreen, 160-document-unit airbrush and invisible scrollbar chrome.
- **Next checkpoint:** `work/brush-size-percent-2026-10-09`, latest observed source `4c5f9e41f26c14fa239cac5548268cd1a5f4edec`, [run 37947624527](https://github.com/lionellmisquitta/unruly/actions/runs/37947624527) **FAILED, NOT DEPLOYED**.
- **Failure:** `tests/browser-workspace/pen.browser.cjs`, `PENB02-mouse-full-width-pressure-off`. Existing helper sets size slider `40`, which now means **40%**, but old oracle still expects **40 document units**. Surgical candidate: set **100%** specifically in PENB02 before its width assertion; preserve the real ~40-pixel and mouse/pen equivalence assertions. Require re-run and full CI.
- CI is slow because setup installs npm + Chromium and then runs many sequential real browser journeys; last observed failure spent ~25 seconds setting up and ~248 seconds in model+browser checks (97 model passes, one browser oracle failure).
- Whole-canvas rotation deferred to final polish; selected object rotation retained. Continue C04 advanced brush controls/grain/density/spacing after percent UI is verified; smudge separate next slice.
- Real device pressure/palm/finger/fullscreen still requires tablet acceptance. Do not merge native `main` or release failing CI.
- GitHub `knowledge-graph/releases/UNRULY-Current.kgp.zip` and `.knowledge/CURRENT_GRAPH.json` still represent **October 8**, not this new local KGP, until a separately verified archive/visual mirror upload.

## Next chat starter

> Continue UNRULY using my attached updated October 10 KGP. Read HANDOVER.md first; verify live repo refs and CI. Fix the failing percent-size branch PENB02 test contract without weakening tests; run exact-SHA cumulative QA and publish to the one Pages preview only when green. Then continue C04-B02 brush grain/density/spacing and C04-B03 smudge in bounded QA-reviewed slices. Defer whole-canvas rotation; keep native main isolated. Update the graph every 2-3 checkpoints.
