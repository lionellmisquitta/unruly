# MOTION1 — impact revision1
Base 2c8c615a5ebd2bbf2cadf82b5b31d13b6637c1f4; authorized15-Oct-2026 next Motion Trace checkpoint. Existing owner-authorized verified main/Pages publication persists; same-session verification only.

REQ-017/C09M acceptance confirmed in original records: object/group paths, audience camera, manual default/timed playback, stop restores original layout and explicit single-Undo geometry commit. Native saved cues required.

Model is the document authority and imports the new pure schema (no model import back from motion.js). v14 optional motion field; old documents stay at existing versions. Missing targets remain structurally admissible so ordinary delete/Undo and recovery still work; resolution rejects unavailable/locked/hidden targets before playback. Native import remaps cue/stroke/layer/folder identities. Generic inverse history already supports optional nested metadata; no history/storage changes.

Pure geometry translates vector points, affine raster/text and whole-folder leaf masks. Object selection keeps masks/clip sources stationary unless selected; group moves source and clipped leaves together. Pixel regions use the exact current original-layer source and complete occupied-tile complement in a transient session; save cue retains mask/rect/layer reference and source IDs, not a destructive conversion. Commit may rasterize affected region layers, exactly one undoable command; document limits preflight whole result.

App supplies captured target, current board/view and disposable preview callbacks. Autosave/export read only h.board. UI blocks editing/board transitions while open, pauses on hidden/blur, rejects stale source identities and clears preview on close/error. Renderer unchanged, preserving effect/mask/clipping semantics and all legacy pixel/source oracles.

Unknown/excluded: physical-device latency/long-session, timelapse/motion-video coupling, total process RAM and full product release acceptance. All roadmap rows retained.
