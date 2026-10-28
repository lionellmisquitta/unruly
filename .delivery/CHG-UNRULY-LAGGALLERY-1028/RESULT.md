# Existing-board lag and saved-board gallery — candidate receipt

Basee15c12b83ff6815ba7d6e605f97c6b72d132fc6f. Owner confirms delay is confined to existing board; new blank board draws promptly. New-board transition saves the old board before switching; no board deletion. Main fixes target measured foreground recording and repeated virtual projection, not a claimed reproduction of Surface/screen-sharing hardware.

Measured baseline Node native timelapse pipeline on5.333992MiB board:284.407ms synchronous capture/validation/delta/byte accounting/reconstruction. Browser same-workload comparison:old capture309.9ms versus actual input dispatch35.2ms after background capture, with exact recorded final artwork. This is an input-handler metric on this host, not end-to-end Surface pen latency or a screen-sharing benchmark.

Implemented local module worker owns ordinary recording storage read/validation/compaction/capture/delta/byte accounting/append. UI only queues immutable native snapshots, applies small metadata/results and retains ordered flush/CAS/gap/4-pending/32MiB semantics. No schema migration or data discard; background failure visibly pauses recording and preserves saved log/artwork. Automatic recording remains enabled by default. A30s background timeout prevents a failed worker from blocking transitions indefinitely. Worker is precached for offline use.

Virtual projections cache identical immutable active boards, normalized project metadata and identical other source references, including reuse across autosave; edits/source/activation changes invalidate. Strict external deep validation remains default; only trusted UI projection uses structural validation.

Gallery: top-left entry plus Actions → Open boards, responsive searchable cards, counts/current marker, visible source backups and in-gallery New board. New closes Actions; save-before-transition and data retention remain. Newly created UI boards title Untitled Board; existing titles/default model contracts retained. Deliberately avoids eager full-artwork thumbnail replay that would introduce a gallery pause.

Local verification:75 model checks PASS;26 timelapse browser cases PASS (legacy replay/backup/offline/video/CAS/capacity plus actual worker performance and worker failure);12 retained virtual-project scenarios passed, then final focused desktop/390px gallery + scene cache3PASS;2 virtual-scene pixel oracle cases PASS. Worker result reconstructs exact native artwork. Gallery restores actual existing ink after New/switch/reload; no data reset. Screenshots desktop/390px visually inspected.

Fixture corrections/replanning documented in UX.md: new cases precede browser teardown; persisted recording predicates explicitly await authoritative reads; board transitions wait for modal/new-board identity rather than stale Saved status; phone gallery setup names the source at desktop width because existing toolbar hides title on phones. Assertions retained/strengthened. No failed candidate sent to CI.

Exact-source cumulative QA, merge and publication pending at this immutable receipt. Final PR/release records carry source/run/artifact/outcome. No roadmap/graph/old QA-record deletion, renderer engine changes, budgets or unrelated pending PRs. Physical Surface/screen-share acceptance remains open.
