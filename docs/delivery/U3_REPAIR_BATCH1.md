# U3 repair batch 1

Builder: root Codex session. Independent QA: fresh u3_qa session. Independent code/security/Gatekeeper: fresh u3_gatekeeper session. Same-model fallback; no separate Claude runtime available.

This candidate integrates the U3 implementation, independently derived browser tests and inherited regression in the quarantined preview branch. Parent integration identity is 0d76cd7ea57277d486a096593029c1937439cd38; accepted rollback U2 is fd15c607d5b9a605b1e8a1164250803832830591. CI evidence will bind the resulting commit, all application/test assets and workflow bytes. No application change after that identity may be accepted on its evidence.

Static defects established against the current U3 interaction contract in PROCREATE_HANDBOOK_UX_BASELINE.md:

- Expected released-contact lost capture cancelled remaining history chord contacts.
- Touch sampling did not rearm after movement or sample final picker release.
- Shape Enter/outside dismissal/new pen stroke commit boundaries were absent.
- Pending drafts admitted interfering strokes, selections and view changes.
- Handle drags lacked a shared owner and lost capture/blur restoration.
- Local history recorded no-ops, silently truncated at 32 and did not share document budgets.
- Edited circles could preview coordinates outside document bounds.

Repairs retain the existing modules and storage schema. Touch history dispatch occurs only after the tracker finishes; active touch navigation/picker suppresses other history/strokes. Draft edits have bounded admission and cancel restoration. Shape Apply failure retains the provisional edit. Offline cache identity changes with the application bytes.

Allowed application paths: app.js, shapes.js, sw.js under prototypes/browser-workspace. QA owns tests/browser-workspace/u3.browser.cjs. CI adds that actual Chromium harness while retaining all inherited suites. No G02 feature, backend, migration schema or production/main authorization changes.

Budget at candidate publication: application repair batches 1/2; CI run 2/3 will be consumed. Local 47 model tests and JavaScript syntax checks passed. Actual browser results pending; physical pen remains NOT_VERIFIED. CI1 inherited-only green run 37565221568 does not establish U3 acceptance.
