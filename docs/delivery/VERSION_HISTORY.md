# Reviewed preview versions

Git commit identities are authoritative. Release labels describe preview batches; they do not imply a complete product release or a Git tag. Existing evidence is retained in place.

| Preview | Exact application source | Evidence and state |
|---|---|---|
| Browser foundation | 66152b32e9544bd383587adbbacbd495e0be3a2f | Original reviewed browser foundation; superseded by workspace |
| Workspace WB1 | 80c5bbe86cde4c41a81e354f296ff5d203019888 | 16 model/15 browser passes; backgrounds, brushes, layers, erasers; superseded by selection |
| Vector selection C06-S1 | e30e861745c48c5029c7f9f0d23a974ae8190c54 | 24 model/21 browser passes; hosted baseline; SELECTION_PUBLIC_STATE.md |
| Performance P01 / preview v0.3.0 | 5bfe786d8018200b89049d1a8073a0eb78ab6077 | 24model/37browser PASS; cached p95 1.7ms vs reference83.1ms; independent QA/Gatekeeper accepted; hosted via Pages37397255190; 11/11 files matched; checkpoint/p01-v0.3.0 version branch |

Next publication must record source SHA, branch, QA run/artifact, immutable Pages deployment and hosted hashes. Separate version branch may be retained if annotated-tag tooling is unavailable; never describe a branch as a tag. Main remains unchanged. Rollback current known-good app source: e30e861745c48c5029c7f9f0d23a974ae8190c54; v2 documents need no migration.

## DUX1-U1 / candidate v0.4.0 — 6 October 2026

User-authorized compact controls/layers implementation after independent U1 readiness. New schema/storage v3, read-only migration, eight browser blend modes, protected layer actions, top-first compact rows and independent popovers. Initial local35pure groups including model tests/unsupportedblendoracle pass; full Chromium CI pending. Repairbatch1/2 closes four source-review findings;CI1/3 prepared. This is an unpublished candidate, not checkpoint closure or production release. U2/U3 and combined publication remain.

| U1 / preview v0.4.0 | 699d6fb29b2debe1ad3721a2c7a3ee86bd374792 | 35/35 model and 53/53 browser groups PASS; stabilization checkpoint accepted; checkpoint/u1-v0.4.0 exact tested pointer; Pages publication authorized |
