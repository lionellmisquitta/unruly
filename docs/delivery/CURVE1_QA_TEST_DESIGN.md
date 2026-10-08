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

CI1 produced66 model passes and113/118 browser passes. Five failures classified as fixture/oracle defects: the CDP calibration target had not been scrolled into the clipped popover viewport (B08/B09), and approved separate fixed pad made three prior whole-app canvas counts stale. Corrections preserve exact5 renderer canvases plus exactlyone360x140 calibration canvas, repeated under layer/stroke stress; driver now scrolls and asserts real hit target before sending pen input. No application repair was required; application bytes still exactly match all CI1 application hashes. Test fixtures changed after CI1, so current test hashes are intentionally different. See `CURVE1_CI1_QA_FINDINGS.json`.

CI2:66 model and117/118 browser passes; all10 CURVE cases passed. Sole inherited PENB01 failure was an immediate pixel read before first requestAnimationFrame paint after Saved status. Trace observed default300x150 backing; next screenshot displayed correctly rendered ink. Final fixture waits for prior backing dimensions and opaque paint on RAF polling before retaining the exact hash/dimensions assertion, without waiting for a matching expected hash. No application repair or source change. See `CURVE1_CI2_QA_FINDINGS.json`.
