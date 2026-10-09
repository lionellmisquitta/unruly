# PRESS2 checkpoint — pressure hierarchy and light graphite

Status: BOUNDED DESIGN + IMPLEMENTATION IN PROGRESS; NOT RELEASED.
Base: LSET1 accepted browser application `5d45ee6ecf43efef6466450abb207b89d7e3eac0`.
Separate from ERASE1; no merge until ERASE1 acceptance and integration regression.

## Approved behavior
- One validated global pressure profile is the default for every brush.
- An optional individual brush override takes precedence *only* when explicitly configured.
- Removing override restores current global behavior; invalid or malformed overrides fail safe and do not corrupt existing settings or documents.
- Each committed stroke snapshots resolved pressure response so history, export, reload and future preference changes do not change existing artwork.
- A deliberately faint construction pencil setup must be reachable without owning a specific stylus. A constant-pressure stylus cannot be claimed physically pressure-sensitive.
- Preserve all original 12 brush preset pixel baselines and existing pen/gesture mappings.

## Independent acceptance
- Validate precedence, override removal, malformed configurations, local persistence, future-stroke isolation, current-stroke locks, Undo/Redo and offline reload.
- Evaluate genuinely faint pencil lines on real tablet as a separate physical acceptance; mouse/synthetic tests are not hardware proof.
- No changes to erase geometry, G02, native main, or production deployment.
- Gatekeeper requires independent QA, reviewed source, and a separate controlled preview deployment. Reserve up to two repairs and three full CI attempts for PRESS2 unless formally amended.

## Batching
Do not rewrite KGP now. Accumulate ERASE1/PRESS2/G02 deltas and update canonical KGP after 2-3 fully gated checkpoints.
