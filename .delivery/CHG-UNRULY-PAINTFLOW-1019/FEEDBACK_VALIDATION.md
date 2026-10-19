# Seven painting feedback items

|Item|Implementation|Observed verification / remaining|
|---|---|---|
|1 Invalid/oversized clipboard|Empty native clipboard no longer blindly submitted; system PNG/JPEG paste/new layer; actual size admission retained|Real system image paste PASS; legacy internal copy/paste pending|
|2 Timelapse full32MiB|Already JSON, now structural forward operations, stable pixel IDs, legacy lossless compaction/CAS; no frame trimming|Large-reference48edit model >20x smaller and exact replay PASS; migration/video/browser pending|
|3 Node points not movable|Baseline simple actual pen drag PASS; focus nearby nodes; bounded512point section of long stroke; preserve outside points|Model long-stroke preservation PASS; actual dense pen drag pending; pixels have no vector nodes, use Deform|
|4 Selection disappears switching layer|Persistent document-space mask; target captured lazily|Source→empty target→repeat paint/Undo/Redo/reload browser PASS|
|5 Bucket ineffective|Explicit visible/active reference; fills current layer under selected mask or enclosed sampled boundary|Cross-layer outline bucket PASS; original gap/alpha/readonly regressions pending|
|6 Whole-object wand active layer empty|Shared object mode samples actual objects across visible unlocked layers|Actual click with empty active layer PASS|
|7 Select layerA, paint layerB|Vector brush replay clipped into target pixels; source/siblings/outside retained; Fill selection targetsB|Actual pen paint and fill tests PASS; other paint modes and existing regressions pending|

No physical-device or independent review claim. No limits silently removed; artwork/native storage remains authoritative. Current implementation is WIP, not published.
