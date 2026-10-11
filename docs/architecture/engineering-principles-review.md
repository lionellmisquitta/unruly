# Engineering principles review candidate

Status: proposed; independent Gatekeeper acceptance pending. Scope is the architecture described by ENGINEERING_DECISIONS.md and the quarantined P0 probe.

The current prototype intentionally co-locates a small Capture model and Qt widget in one file. `P0_MODEL_ONLY` isolates the model for deterministic tests. This keeps feasibility cheap; it is not the production dependency boundary. The public Capture state and one-loop repaint are acceptable only inside this bounded diagnostic. Revisit when pointer identity, rendering workload or saved documents are introduced; do not promote the probe unchanged.

The proposed production boundaries place document invariants, transactions and drawing policies below native input/storage/credential adapters. UI and vendor calls cannot determine document identity, undo semantics or conflict policy. A replacement adapter must pass shared offline, failure/cancel and committed-revision contracts. Narrow input/storage/credential interfaces should be introduced when actual platform variants exist, without speculative services or a server.

Stable IDs, immutable background snapshots and revision checks address invalid-state and concurrency risk. Tiled rendering and finite work regions address bounded memory and cancellation. Versioned manifests and migrations on retained copies address compatibility. Exact import bounds, blend math and platform durability remain unresolved until fixtures and measured target evidence exist; proposed values are not proof.

Review outcome: **blocked for production readiness**, pending native feasibility, locked UX, approved domain/data/security contracts and independent evidence. Checkpoint rollback and package provenance are designed in; the native WSLg startup milestone tests only the diagnostic runtime. No architecture score or gate pass is assigned by the Builder.
