# CAP1 engineering measurements — physical acceptance open
Source3af2a6bdf84dd251c83a7770f26d5cd5fd7f9eba; preflight38671904711SUCCESS; artifact11943703032SHA256b735e89e51d3a377953b2aadbf00c7c545ddd49dab3a6199f23339e8d27bc278verified. Source-bound exact values in CAPACITY_REPORT.json. CI runner Chromium,800×600CSS viewport,DPR1/2,4frames per fixture. Descriptive timings and10s hang guard, not an interactiveFPS target.

Fixture:30/32/50layers;6vector strokes×20points per layer,1seeded grain/splatter tip per layer,32×32pixel image every5layers,text every10layers,5contiguous folders, leaf masks,clipping,multiply opacity, one group HSL and one group sigma1blur. ~293/316/487KBnativeJSON. This is a defined realistic mixed fixture, not arbitrary worst-case artwork or device equivalence.

50layer mixed warm replay515–522msDPR1and1240–1245msDPR2; initial independent run450–476/1058–1080ms.50vs32ratio1.55/1.53. Exact auto/reference output and80MiB backing bound passed.50layers are renderer-only probe data; model/import/save still reject >32.

Paired50layer fixture without group HSL/blur, same strokes/masks/images/clip: warm64.5–72.9msDPR1and162.4–181.5msDPR2. This points to full replay with processed groups as a major cost. It does not prove the only bottleneck, nor authorize a GPU/Rust/OPFS rewrite. CAP2should evaluate retained processed-group surfaces, explicit source/ancestor/effect/mask/clip invalidation and same80MiB allowance, with exact reference comparisons before any cap increase. This architecture work is explicitly split, not silently removed.

32layer actual document gate passed: native import, one-stepUndo/Redo,IDBsave/reload/UIleaf rows; invalid-current fallback to previous valid snapshot and subsequent save; stale-tab write rejected; injected quota transaction abort leaves persisted revision unchanged; invalid-capacity save leaves data unchanged. Existing storage engine byte-unchanged. This does not simulate OS power loss, disk exhaustion or tablet long-session RAM.

Remaining: real Surface/Xiaomi/Lenovo pen/palm/latency and long-session recovery;30–50interactive-performance target; CAP2optimization and rerun before cap increase. TIP2can publish within existing supported capacity; CAP1measurement gate is complete, whole capacity requirement remains open.
