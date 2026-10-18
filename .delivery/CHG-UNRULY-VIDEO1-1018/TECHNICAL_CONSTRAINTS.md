# VIDEO1 technical constraints

- 12fps;640x360/1280x720;60seconds/720frames;32MiB encoded/40MiB file
- at least one frame per saved state; reject overflow without truncation
- runtime-supported AVC/MP4 orVP8/WebM; no cloud
- other Virtual Groups are current context, not historical cross-source recording
- cancel closes encoder/frames/canvases; no partial download

See CONTRACT.md for source contracts/budgets/cancellation/release/rollback. Device/process RAM parity is not claimed.
