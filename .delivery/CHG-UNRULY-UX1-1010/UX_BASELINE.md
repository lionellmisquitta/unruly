# Tablet gesture baseline

User outcome: predictable pen holds for geometry; exact finger colour sampling; discoverable selected-stroke transforms on the same cumulative canvas. User feedback is sufficient for reversible implementation. UX baseline locked for this checkpoint; no separate human merge approval claimed.

Canvas remains the primary workspace. Hold stationary for 650 ms to snap; tolerate 14 CSS px of hold jitter. Two samples suffice for lines; line deviation up to max(8 CSS px, 7.5% chord) with backtracking rejection. Unsupported short/scribbled traces remain freehand. Recognize smooth open cubic curves, circles/ellipses and right-angle rectangles, including rotated geometry. Hold preview is provisional. Pen drag scales from the actual recognition endpoint; first point anchors open curves and centre anchors closed shapes. One finger while pen stays down constrains line angles to 15 degrees, ellipse to circle, rectangle to square and open curve to circular arc. Constraint appears immediately; removing the finger returns to unconstrained geometry. Pen release preserves the current constraint into the existing Apply/Cancel draft. Escape/cancel discards the held gesture; Apply is one document undo step.

Default finger hold gives an offset pixel magnifier with crosshair, exact source marker, sampled hex and swatch. Drag moves the picker; release uses the final visible composite colour. Cancellation or a second finger hides it and does not change the colour. No history/document changes or canvas zoom from picking. A stationary finger in Smudge yields to the picker; moving first still smudges.

A visible Transform / rotate action appears after lasso selection. Gold scale and blue rotation handles have 44 CSS px hit areas. Handle changes are relative to the drag start, avoiding jumps after prior scale/rotation. Numeric controls remain available. Apply/Cancel and existing draft-local undo ownership are preserved. Whole-canvas rotation remains deferred.

Physical pen/palm rejection, screen feel and device-specific interruptions remain acceptance gaps until tested on the user's tablet.
