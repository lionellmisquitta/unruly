# Current checkpoint — PERF3A candidate

Base 2e0a945764dd5348d9ac85397f36b7b7965a2f79; prior verified source 64024f9fd277de02dc57155b50e5c7c64c2a13f7, CI 38096935252 successful. Main cb1d52089c5cdd159050dc375b92750eb84d8271 unchanged. Read DECISIONS.md and .delivery/CHG-UNRULY-PERF3A-1011/IMPACT_ANALYSIS.md.

First PERF3 increment: lossless sparse persisted raster payloads. Omit all-zero 64px tiles, preserve invisible RGB, use dense legacy data when smaller, keep dimensions/affine geometry and board v4. Existing dense boards stay readable; no automatic conversion on open. Smudge and partial erase write the best-sized payload. The renderer is unchanged and receives reconstructed dense pixels, avoiding tile-edge interpolation seams.

Acceptance: full prior 147 model/167 structured browser scenarios plus 9 new models and 5 sparse browser scenarios (96 dense-reference comparisons), storage conflicts/quota/recovery, transform/erase/history, UI import/reload/offline codec. Publication pending verified CI, artifact identity and hosted bytes. Same existing cumulative URL. Graph unchanged.

Limits remain 32 layers, 1024px/1MP per raster, 8MiB document, 100/16MiB history, five surfaces/80MiB pixel backing. No rendering speedup, resident cache, changed-region undo, GPU, disk spill or larger painting extent is claimed. Target tablets remain NOT_VERIFIED.

Next PERF3B: bounded tile residency/cache and changed-region undo. Old reader rollback is unsafe for new sparse saved data: retain decoder while disabling sparse writes, or validated dense conversion; never clear storage. Read the closeout after publication for exact identities.
