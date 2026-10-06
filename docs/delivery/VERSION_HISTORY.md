# Reviewed preview versions

Git commit identities are authoritative. Release labels describe preview batches; they do not imply a complete product release or a Git tag. Existing evidence is retained in place.

| Preview | Exact application source | Evidence and state |
|---|---|---|
| Browser foundation | 66152b32e9544bd383587adbbacbd495e0be3a2f | Original reviewed browser foundation; superseded by workspace |
| Workspace WB1 | 80c5bbe86cde4c41a81e354f296ff5d203019888 | 16 model/15 browser passes; backgrounds, brushes, layers, erasers; superseded by selection |
| Vector selection C06-S1 | e30e861745c48c5029c7f9f0d23a974ae8190c54 | 24 model/21 browser passes; hosted baseline; SELECTION_PUBLIC_STATE.md |
| Performance P01 / preview v0.3.0 | Pending tested candidate | Contract/readiness committed before source; no deployment yet |

Next publication must record source SHA, branch, QA run/artifact, immutable Pages deployment and hosted hashes. Separate version branch may be retained if annotated-tag tooling is unavailable; never describe a branch as a tag. Main remains unchanged. Rollback current known-good app source: e30e861745c48c5029c7f9f0d23a974ae8190c54; v2 documents need no migration.
