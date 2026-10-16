# U3 repair batch 2 — final allowed repair

CI2 run 37604552212 tested integrated commit e835e57f8ca10d43e29727e6220f558a187586c0. Evidence artifact11474024053 SHA2562e7b2cbae08ea8e0bf3a7682c5b138a90102f7347c57144b8d75fc199e644ecf retained.

Executed results:48/48 model;15/15 workspace browser;6/6 selection;16/16 U1;5/5 U2;16/16 performance;29/30 U3. Chromium151.0.7922.34, Node22.23.3. No U3 page errors or external assets. Not accepted.

Only failure U3B11b: a real captured scale-handle drag changed Scale to159.52324936200165; Ctrl+Z preserved scale but changed the still-focused Move X field30→0 through native browser input Undo. Window shortcuts skipped inputs and document capture did not guard editDrag. Independent QA inspected trace/screenshot and classified a product defect, retaining the assertion.

The final bounded repair adds editDrag and touch ownership to document keyboard/pointer control suppression, and touch ownership to the existing blocked control guard. This also closes the reviewed path where toolbar/board/layer controls could mutate state during touch navigation/picker ownership. No new feature or module. Service-worker cache identity changes with the repaired app.

Builder root; fresh independent same-model QA u3_qa and Gatekeeper u3_gatekeeper. App repair batches2/2; final CI3/3 next. Failure of final run requires bounded replan, not additional automatic repairs or weakened tests. Physical pen NOT_VERIFIED; main/production authorization false.
