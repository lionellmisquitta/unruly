# Incremental graph update contract

Status: proposed controller contract; capture delta exists; automation not yet implemented.

1. After each material design decision, add a bounded delta with stable IDs, source locators, status and timestamp.
2. Before coding, attach checkpoint requirements, acceptance criteria and proposed component boundaries.
3. After coding, extract changed-file structure deterministically where available. Bind implementation edges to exact commits; do not infer business rules solely from names.
4. After independent QA, attach tests, fixtures, results, defects and evidence hashes. Distinguish implemented from verified.
5. Gatekeeper assesses governance and executable evidence directly. A model claim or graph edge cannot authorize a merge.
6. After merge and merged regression, apply the final checkpoint delta atomically. Validation failure blocks checkpoint closure. Preserve superseded decisions, prior defects and history.
7. Resume from PROJECT_STATE.md, state.yaml and bounded graph neighborhoods. Never rescan unchanged source to reconstruct knowledge.
8. Regenerate 2D and OnAir viewers at validated graph export/checkpoint milestones, not on every pen event or every chat turn.
9. Keep this project knowledge graph distinct from any future feature that graphs users' private boards. Raw boards, credentials and API keys must never enter the public project graph.
10. Final KGP exports must follow Graph Generator package validation and visual completion requirements. Initial capture deltas alone are not final KGPs.
