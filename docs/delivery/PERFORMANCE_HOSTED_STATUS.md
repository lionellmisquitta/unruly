# P01 live preview handover

Preview version: v0.3.0. Application source: 5bfe786d8018200b89049d1a8073a0eb78ab6077. Publication metadata: 334f65768f37f4faa41ae47d2a865918b53b97eb. Pages run 37397255190 / job 112056053920 succeeded. Live URL: https://lionellmisquitta.github.io/unruly/.

All 11 published files returned HTTP 200 and matched reviewed source bytes, including the 10 runtime assets and prototype README. The explicit Reload to update flow retained a pre-existing test-board title and two ink strokes. Actual hosted mouse drawing, undo, redo, save and reload retained a third stroke. Screenshot live-preview.jpg shows the retained ink and Saved on this device. Offline-ready indicator observed; full offline network-disable was covered by CI, not repeated on the host. Physical Surface/Xiaomi pen feel remains unverified.

Independent QA: 24 model and 37 browser groups pass on the exact source; 21 source hashes verified. Paired dense-board renderer p95 is 1.7 ms cached versus 83.1 ms reference. These are processing durations, not pen-to-display latency. Topmost visible layer is accelerated; first cache miss and lower-layer full-replay fallback remain future optimization targets. Five-surface nominal backing allocation remains bounded to 80 MiB, including intermediate assignment checks.

Version branch checkpoint/p01-v0.3.0 was created and read back at the exact tested source. It is a branch, not an annotated tag; the commit SHA is immutable. Version history, development notes, repair history, independent QA/Gatekeeper and scoped knowledge delta are retained in Git. Existing historical root states remain untouched remotely. Main and production authorization unchanged; no full product/merged-regression/physical-feel closure claim.

Next user check: PERFORMANCE_TABLET_TEST_CARD.md. Next technical slice: first-contact warmup and viewport/spatial caching after that batched feedback. Original v2 board/storage/selection modules unchanged; rollback source e30e861745c48c5029c7f9f0d23a974ae8190c54 needs no document migration.
