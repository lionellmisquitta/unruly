# UNRULY offline canvas preview

Quarantined UX exploration; not the native product or a closed production checkpoint.
Download `unruly-preview.html`, then double-click it to open in a browser. No installation, login or server is needed. Draw with a mouse or a browser-supported pen; choose ink presets, marker, colours, layers and paper; pan/zoom, undo/redo and export the visible canvas as PNG.

**Session-only:** refreshing or closing loses the board. Export a PNG before closing if you want a picture. Native pressure fidelity, latency, persistence, Windows packaging, Android packaging and production brush behaviour are not established by this preview.

JavaScript syntax check passed. Independent browser QA is blocked because no browser executable is available and its download failed. No runtime scenarios or visual screenshots passed. See QA_PREVIEW.md and qa-preview.cjs. Small type was increased to 12px. Source inspection identified redo loss on canceled strokes; builder now restores both history branches on cancellation. That repair still needs runtime verification. Rendering quality is unscored until browser inspection can run.

## Delivery state from the user's local continuation reports

- Production checkpoints closed: 0.
- P0 capture model: 21 Linux cases passed; independent Claude accepted that evidence.
- Actual capacity defects: repaired by Codex and passing in Linux.
- Windows nine-case regression: blocked by Application Control, not closed by Linux results.
- Native Qt pen probe and Android device verification: not completed.
- Optional integrations, full brush engine, board persistence and automated end-to-end delivery controller: not delivered.

This branch adds only preview artifacts and preserves existing Windows/WSL work. The user’s local checkout has newer uncommitted evidence than remote main; this preview does not replace that state.
