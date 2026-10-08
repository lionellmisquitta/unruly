# LSET1 final independent Gatekeeper

Date: 2026-10-08. Verdict: **ACCEPTED_FOR_EXACT_SOURCE_PREVIEW_PUBLICATION**. This closes the bounded LSET1 source/QA gate and permits publication of tested source `d7d31b0d630a045055ef569e6a04517788aa14f9` only. Hosted identity and deployment completion remain pending; this is not main or full-production acceptance.

Reviewed the five allowed application paths and consumed independent `LSET1_QA_CHECKPOINT_RESULT.json` and `LSET1_QA_REPORT.md`. No unresolved source/security or QA product finding remains. Clear active layer preserves metadata/other layers and the last layer, clears selection, commits one Undo/Redo command, persists on reload, and safely rejects locked/empty cases. Global settings reuse one validated per-device config across both entrypoints; ownership, pressure profile, keyboard/mobile dismissal and offline behavior remain covered.

Independently consumed actual CI run `37738555167`, artifact `11533051078`, source tree `a97940f9d8fd647dd89c3000fa606f107d5db650`. Verified extracted commit identity, all 41 source hashes against current local source, archive SHA-256 `dfd5ceef74a7c0802236063f6643a7a0d92ec16fe52afbe324c4a2224d4e5ede`, and all 27 persisted raw reports against the extracted archive. Actual receipts show 72 model tests and 126 browser journeys PASS: 198 total, zero failures; model skips/cancellations are zero and browser rows are all PASS. This includes all 184 inherited checks and 14 new LSET1 cases. Original 12-brush/48 exact pixel comparisons and renderer resource regressions passed. Raw evidence is retained in `docs/delivery/evidence/lset1/ci1`.

Publication must pin the tested source and verify hosted asset identity before recording hosted closure. Existing user preview-publication authorization applies; acceptance does not authorize additional application changes. Accepted CURVE1 parent/rollback remains `d522e76417a91b8d1a4636010ae10a2c7d53f9b7`, ledger `ae5abcc443c3f69d109df43772217938d1496c2f`; earlier evidence and consumed budgets remain immutable.

LSET1 budget consumed: application repairs 0/2, CI runs 1/3. Main/full-production authorization remains false. Physical pen remains NOT_VERIFIED; trusted CDP eraser mask32 remains unavailable, with synthetic PointerEvent integration proving only the reported-signal contract. No hardware certification is inferred.

## Reopened hosted compatibility gate — 2026-10-08

Builder reports old-session Update/reload retaining prior HTML despite matching newly hosted assets. Hosted closure is not accepted. The initial source/automated acceptance above remains scoped to its exact tested source; renewed acceptance requires repaired-source independent QA and actual update closure. See `LSET1_REPAIR_BATCH1.md`.
