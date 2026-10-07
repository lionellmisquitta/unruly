# CURVE1 independent adversarial design

Accepted parent source: PEN1 `93af0a256b57932288f57239612bd4cc5516b7fc`. Governing scope: `CURVE1_CHECKPOINT_TEST_HANDOFF.json`. Builder root Codex; independent QA fresh Codex session. No application edits or publishing by QA. Physical hardware remains NOT_VERIFIED.

| Cases | Risk and oracle |
|---|---|
| CURVEM01–02 | Strict optional curve array shape, type, length, order, finite bounds; validation/import/history reject atomically |
| CURVEM03–04,07 | Piecewise linear fixed knots, bounded interpolation, endpoints, old exponent formula exact, null mouse full-width |
| CURVEM05–06 | Snapshot preservation through import, duplicate, clipboard, transform, eraser, history; parent inputs unchanged |
| CURVEM08 | Invalid locally stored profile defaults; older no-curve settings preserved |
| CURVEB01 | Accessible three fixed-input sliders, labels, numeric bounded monotonic values |
| CURVEB02–04 | Real mouse/pen/touch graph drag; preview vs release; Escape/blur/real lostcapture cancellation restores persisted baseline |
| CURVEB05 | Editor vs board gesture ownership; graph editing cannot activate document mutation, including Ctrl/Meta Undo/Redo and programmatic history actions with both histories seeded |
| CURVEB06 | Preset/reset removes custom array, exact exponent values, settings persist without board history |
| CURVEB07 | New strokes snapshot curve; later settings affect future strokes only; exact replay after reload |
| CURVEB08–09 | Pad receives actual CDP pressure, raw/mapped status; constant/mouse truth; bounded256samples/360x140pixels; clear isolated |
| CURVEB10 | Offline profile/module, mobile width and keyboard operation |

Data uses one disposable context per case, deterministic blank board and original Fineliner. Custom profile [.2,.5,.8] provides exact knot oracle; real CDP pen forces .25/.5/.75 distinguish raw pressure and response. The pad must never alter board revision, history or artwork. No new physical pen support claim follows synthetic browser automation. Original PEN1/U1/U2/U3/performance cases remain untouched and mandatory. At most3 CI runs and2 application repair batches.
