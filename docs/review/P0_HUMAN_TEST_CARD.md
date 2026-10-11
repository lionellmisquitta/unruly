# UNRULY P0 — one short pen review

Run from the UNRULY repository in your WSL terminal:

```bash
bash prototypes/p0-pen-input/launch-linux.sh
```

This opens the **Linux Qt probe through WSLg**, using the user-owned Qt kit prepared for this checkout. It is not a native Windows executable or an Android build. If rebuilding is needed, run the same command with `--build` first. Windows App Control clearance remains a separate prerequisite for Windows testing; do not change policy to run it.

The probe draws raw pen samples on one bounded white pad. Pressure changes line width; the label shows sample count, pressure and tilt. **Clear probe** empties it. At 8,000 samples it stops until cleared. Mouse/fingers do not ink. An eraser end currently inks too. It has no smoothing, pan/zoom, undo, layers, saving, sync or AI; closing loses the marks.

Do these three tasks, clearing between them:

1. **Slow handwriting and curves:** write a short invented sentence, then small circles and S-curves. Note wobble, gaps and whether each lifted-pen stroke stays separate.
2. **Fast strokes with pressure:** draw quick loops and long strokes, varying light to firm pressure. Note missed sections, visible lag, line-width changes and the pressure readout. Clear if the sample limit appears.
3. **Interrupted input on Lenovo:** move the window onto the Lenovo display, draw there, switch focus away during input, then return and start a stroke elsewhere. Note the display receiving ink and any unwanted connecting line or continued hover ink. Use only a connection/display mode already permitted on your machine.

If pen strokes do not arrive or pressure stays fixed, record **WSLg pen routing unavailable/unverified**; mouse drawing is not a substitute. Stop the physical portion and retain the observation for native Windows follow-up. WSLg behavior cannot establish native Windows or Android pen feel.

Return one short note: `WSLg/Linux | display/pen and connection | pressure changes yes/no/unavailable | task 1 observation | task 2 observation | task 3 observation`. A short recording of the probe alone is optional; use invented content and keep it local. These observations are human evidence, not measured latency or palm-rejection results.
