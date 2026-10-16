# UNRULY knowledge graph — TIME1 current

Updated 2026-10-16T00:55:26Z; revision unruly-kgp-20261016T005526Z.

Seven published batches/eight checkpoints captured: HSL1, FX2, TIP1, TIP2+CAP1, CAP2, MOTION1, TIME1. Current app source `0bab964ad5722c5dc3fd6dbe67c5705125635447`; current main documentation baseline `a4f569ab9a0823bdb6b3a5eb18adcb30350a443b`. Read current main documentation first; application files on the knowledge branch are historical.

Next proposed: adjustable stroke stabilization/smoothing. Then precision drawing (ruler/symmetry/snapping, artwork vector nodes/curve pen/intersections); remaining painting/brush/colour/group effects and compatibility; canvas rotation/gestures, sticky notes/connectors/richer text, Motion mixed-target gap and device/performance acceptance; clean timelapse video export; artboards/dimensions/DPI/PNG/JPG/PDF; release-candidate validation. These are work groups, not fixed build counts. PDF references, artwork interchange, Drive sync and BYOK AI remain first-release scope; no early-access scope cut approved.

## Published baselines and limits

- **HSL1**: Layer/folder HSL and levels; non-destructive baseline. Folder masks, group opacity/blends and effect-order compatibility remain open.
- **FX2**: Layer/folder curves and blur baseline; no broad closure of all group effects.
- **TIP1**: Named brush sections and custom image tips, jitter/rotation/count/pressure, portable v12. Custom-tip alpha lock unsupported; proprietary brush import remains open.
- **TIP2/CAP1**: Portable v13 grain and Splatter/Sprinkle brushes plus measured capacity/recovery. 32-layer document cap retained; renderer-only 50-layer measurements do not establish interactive capacity.
- **CAP2**: Processed-group retention <=16MiB within 80MiB backing cap; exact reference pixels and conservative fallback. Warm renderer-only 50-layer ~231ms DPR1/~527ms DPR2; device/interactive acceptance remains open.
- **MOTION1**: Portable v14 Motion Trace path/camera cues and manual/timed playback, Pause/Stop/restore and one-Undo Commit. Same-layer mixed region/original-object cue invalidation remains open; region commit rasterizes undoably.
- **TIME1**: Opt-in completed-operation timelapse recording and read-only replay/scrub/step, 0.5–4x playback and idle skip; paused reload/resume gap, per-board isolation and backup/import/confirmed attachment/discard. Separate IndexedDB schema1; 2000 states/32MiB per board/128MiB global payload, four snapshots/32MiB queue, atomic CAS/tombstones. Native board JSON excludes recording. Continuous pen animation, video export/framing and device/long-session acceptance remain open.

## Evidence and maintenance

Selected exact source receipts and current roadmap/code-structure docs: `evidence/batch/post-fill2-20261016/`. Stable prior IDs/history preserved; replaced values retained in `history/pre-refresh-20261016.json` and append-only changelog. Historical records are not current operational instructions. No whole-checkpoint acceptance inferred from partial feature baselines.

Same-session repository evidence is not independent human/device sign-off. No live hosted-byte recheck or app tests/deployment was performed for this graph-only refresh. Literal ES imports are bounded source linkage, not Graphify/AST or a call graph.

Viewers: `exports/graph-explorer.html`, `exports/OnAir - unruly.html`; package: `../releases/UNRULY-Current.kgp.zip`. External `.knowledge/CURRENT_GRAPH.json` binds actual graph commit and hashes after upload.
