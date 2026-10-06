# UNRULY graph protocol

- Canonical truth is JSONL under `graph/`, `knowledge/`, and `evidence/`.
- Preserve stable IDs; supersede rather than delete.
- Human decisions may confirm intent; implementation/verification require repository/runtime/test evidence.
- Before coding, retrieve the relevant bounded capability/checkpoint/code subgraph and linked evidence.
- During a 2-4 checkpoint batch, accumulate deltas. At human review, merge deltas, re-evaluate contradictions, append changelog, regenerate 2D + OnAir exports, run Scope Guard and validation, and commit to `knowledge/unruly-kgp`.
- Keep `main` and build/preview branches untouched by graph maintenance.
- Do not copy the full chat transcript into Git; retain distilled durable decisions and provenance references.
