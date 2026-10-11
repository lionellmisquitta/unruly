# U3 independent QA result

**PASSED** on final cumulative preview integration `41019aa0b7991bbe5bd56b71b9516da9bb454cd0`, [CI3 run 37605503902](https://github.com/lionellmisquitta/unruly/actions/runs/37605503902). Independently inspected actual raw results: **138 checks passed, zero failed or blocked**. This verifies the bounded U1–U3 browser/controller contract; physical pen and tablet feel remain **NOT_VERIFIED**. Main merge and production release remain unauthorized.

| Suite | Passed / total |
|---|---:|
| Model / selection / U1 / U2 / U3 unit | 48 / 48 |
| Workspace browser core | 15 / 15 |
| Selection browser | 6 / 6 |
| U1 browser | 16 / 16 |
| U2 browser | 5 / 5 |
| U3 browser | 32 / 32 |
| Performance browser | 16 / 16 |

Execution used Chromium **151.0.7922.34** and Node **v22.23.3**. U3 proves staggered captured Undo/Redo contacts and rejection/cancellation; composite sampling/release/hold rearm; provisional line/circle editing and modifier; affine transform style/pressure; local history/capacity; navigation, handle and toolbar ownership; and offline assets. Full inherited regression ran on the same exact integration identity.

CI2 exposed **U3-D01**, native input Undo changing Move X during an active captured scale handle. Trace confirmed real handle admission and unchanged scale while X changed 30→0. Builder batch2 repaired capture keyboard ownership. The original failing assertions were retained; U3B11b passed in CI3. Both new live-touch toolbar tests also passed. No unresolved material defects or contradictory requirements remain within the tested scope. See [defect record](U3_CI2_DEFECT.json).

The independent QA session used the same-model fallback because neither preferred alternate CLI was available. QA authored tests, inspected evidence and returned defects; it did not repair application source or launch CI. Budgets consumed: **2/2 application repair batches and 3/3 CI runs**, with one runtime-proven defect/repair/retest cycle.

Performance evidence retained the inherited limits: cached renderer p95 **1.70 ms**, reference p95 **83.60 ms**, maximum cache rebuild **67.70 ms**, five canvases and peak nominal RGBA **83,886,080 bytes** (80 MiB). These are fixture-based Chromium CPU/allocation measurements, not hardware drawing-latency promises.

All **32** source/test manifest SHA256 rows independently match final local bytes. Initial scratch materialization had appended one final LF to 26 inherited files; root restored those exact CI bytes without changing repository source, after which QA rechecked all32. CI artifact ID is `11474472876`; reported digest is `75ae7b044a50a2830b129725e2d79a6e26ce311b794e3dd599793e7c536c5443`.

Durable raw JSON reports, model output, exact commit, runtime and source hashes are in [evidence/u3](evidence/u3/). The machine-readable [QA checkpoint result](U3_QA_CHECKPOINT_RESULT.json) contains identities, suite counts, defect disposition, hashes and limitations. Gatekeeper owns checkpoint closure and delivery sequencing.
