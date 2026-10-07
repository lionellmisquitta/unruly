# U3 tablet review — one cumulative app

Open https://lionellmisquitta.github.io/unruly/ and use Update when offered after finishing your current edit. Export a JSON backup of valuable boards first.

1. Draw two marks. Two-finger single tap Undo; three-finger single tap Redo. Each should act once. Finger dragging navigates and should never trigger history.
2. Hold one finger still for 650ms. Drag the colour picker and release over a different area. The released colour should match visible ink/paper; sampling should add no document Undo.
3. Draw a roughly straight line or circle with your pen, then hold the endpoint still for650ms. Release to Edit Shape. Change geometry, try local Undo/Redo, then Apply. One document Undo should remove the entire edited shape. Cancel should leave no shape.
4. Lasso strokes in the active editable layer. Press Transform or T/V. Move, scale and rotate with handles or numeric controls; Cancel restores originals. Apply is one Undo, with brush width and pressure retained.

Automated Chromium synthetic pen/touch tests verify controller behaviour. Your actual stylus pressure, latency and drawing feel remain a separate human check. Report one concrete failing interaction at a time; the next increment should stay small.
