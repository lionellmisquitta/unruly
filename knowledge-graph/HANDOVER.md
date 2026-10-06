# UNRULY KGP handover

## Current baseline
- Primary implementation lineage: `preview/drawing-ux-u1-2026-10-06`.
- Historical milestones: `preview/vector-selection-2026-10-06`, `checkpoint/p01-v0.3.0`, earlier P0a native feasibility.
- Current architecture: browser-first, offline/local-first; native wrappers/enhancements later if useful.
- Default `main` is not the current implementation baseline.

## Graph update rule
Update this KGP after each human review batch of roughly 2-4 accepted checkpoints. Preserve individual checkpoint evidence, stable IDs, contradictions and supersession history. Do not promote a discussed/planned feature to implemented or verified without deterministic repository/test evidence.

## Continuation order
1. Read `README-FIRST.md`.
2. Read `manifest.json` and `knowledge/decisions.jsonl`.
3. Inspect relevant capability/checkpoint subgraph before coding.
4. Read current branch evidence and only then modify code.
5. After the review batch, merge deltas, regenerate viewers, validate and append changelog.

## Important open verification
Physical Surface/Xiaomi pen feel and device-specific input behavior remain unverified. Google Drive OAuth/release setup, layered exchange fidelity, Procreate brush import fidelity, AI provider details, license and timelapse retention remain open.

## Technical enrichment
A bounded Graphify pass is recommended once the repository can be deterministically materialized. It should enrich file/class/function relationships without replacing the concept-first product graph.
