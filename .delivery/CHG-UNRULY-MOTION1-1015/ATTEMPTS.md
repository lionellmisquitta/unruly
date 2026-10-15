# Attempts

1. Plan/impact/UX/visual baseline recorded before runtime edits. No implementation, QA or publication claimed.

2. Implementation complete,372local model tests passed (11new). Static production-directory UI validator has0errors; warnings inherited heuristic labels/tiny legacy styles and mathematical glyphs are not new interface icons. Initial single-HTML validation missed linked CSS and was rerun in correct directory mode. Actual Chromium/visual/cumulative verification pending; no publication.

3. Preflight38766631599at e52850c540341f1000966be3ed1cb5fb752bad68 FAILED:9/10browser scenarios passed; selected-region playback received a pre-start RAFtimestamp and rejected negativeprogress, then restored safely. Fix clamps progress monotonically; region test now deliberately offsets RAFtimestamps while retaining exact metadata/complement/Undo assertions. Mobile screenshot review removes empty-list dead space,disables unavailable cue actions,and keeps close heading visible. No existing assertion weakened.

4. Preflight38767247208at907197e8433af20e9f8a23b409f20a842bb97312PASSED all10browser scenarios, including offset RAFclock. Visual inspection found native SVGhidden property did not remove hidden attribute, leaving authoring overlay invisible. Correct SVGattribute handling; strengthen existing browser cases with visible path assertions and actual Playwright mouse drag. No renderer changes or assertion removals. Final verification pending.

5. Preflight38767903689atfd784b8d9df02ae8e2bd9d84e96703fd55e82052FAILED only new horizontal-SVG isVisible assertion (zero-height geometric bounding box). Actual mobile mouse path and all other9scenarios passed; downloaded screenshots show the neon path. Replace inappropriate box-visibility query with visible endpoint,computed visible stroke andnonzero SVGpath-length checks; preserve all behavioral assertions. No runtime change.

6. Preflight38768437038PASSED all10browser scenarios including visible SVGstroke andreal mouse path. Final status-only correction displays100%when the sequence is complete (the internal next-cue counter resets localprogress). Timed UI assertion strengthened to Complete100%. No geometry/schema changes; final cumulative/source identity pending. Known same-layer mixed-region/object cue compatibility retained OPEN in KNOWN_LIMITS and full roadmap closeout.

7. Final exact-source cumulative 38768769402SUCCESS; downloaded artifact hashes/test results verified. PR17merged exact tested tree; Pages38771750451SUCCESS,58hosted SHA256matches. Roadmap/current/continuation/code map and scoped receipts updated. Mixed region/object compatibility and owner/device/full product acceptance remain OPEN. KG unchanged.
