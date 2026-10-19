# Seven painting feedback items

|Item|Implementation|Observed verification / remaining|
|---|---|---|
|1 Invalid/oversized clipboard|Empty native clipboard no longer blindly submitted; system PNG/JPEG paste/new layer; actual size admission retained|Real system image paste PASS; legacy internal copy/paste and mask→paste transition PASS|
|2 Timelapse full32MiB|Already JSON, now structural forward operations, stable pixel IDs, legacy lossless compaction/CAS; no frame trimming|Large-reference48edit model >20x smaller and exact replay PASS; lossless migration/CAS and existing video/browser PASS|
|3 Node points not movable|Baseline simple actual pen drag PASS; focus nearby nodes; bounded512point section of long stroke; preserve outside points|Model long-stroke preservation PASS; actual dense pen drag/release/Undo PASS; pixels have no vector nodes, use Deform|
|4 Selection disappears switching layer|Persistent document-space mask; target captured lazily|Source→empty target→repeat paint/Undo/Redo/reload browser PASS|
|5 Bucket ineffective|Explicit visible/active reference; fills current layer under selected mask or enclosed sampled boundary|Cross-layer outline bucket PASS; original gap/alpha/readonly regressions PASS|
|6 Whole-object wand active layer empty|Shared object mode samples actual objects across visible unlocked layers|Actual click with empty active layer PASS|
|7 Select layerA, paint layerB|Vector brush replay clipped into target pixels; source/siblings/outside retained; Fill selection targetsB|Actual pen paint and fill tests PASS; round/soft/watercolour, selected eraser and existing regressions PASS|

No physical-device or independent review claim. No limits silently removed; artwork/native storage remains authoritative. Cumulative39273215607 PASS:678models/524browser/2legacy checks/214source hashes; publication pending.

Canonical source 4e20b9e8da76e958d371e42874c8cc9169b534b1; all six shards/aggregate and every included browser case PASS. Artifact12197246313 digest 406e42a58de4aab9cb5a17482b1063f3be56c15515ebc5494cb8fe16ac7d6e69. Hosted verification pending; physical tablet painting remains owner acceptance. Existing per-recording32MiB/global128MiB limits retained.
