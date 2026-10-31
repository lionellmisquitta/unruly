# UX baseline: tap areas for flats

User evidence: lion line art; tapping an enclosed area should select it for flats and later paint, without tracing. SUFFICIENT: canvas selection workflow; no new screen or redesign. Directly authorized repair.

UXD-WF01: Wand defaults to Enclosed area and All visible layers. Its own explicit modes are Enclosed area / Matching colour pixels / Whole objects; remembered lasso mode never changes wand meaning. Existing object and colour workflows remain available explicitly.
UXD-WF02: First toolbar tap activates Wand with the canvas clear; tap Wand again for settings. First pen/mouse canvas tap while wand settings are open closes settings and selects at that point. Finger remains navigation; pointer cancellation retains prior selection. Other popover admission remains unchanged.
UXD-WF03: Enclosed-area mode uses existing bounded gap-aware flood at tap, tolerance and gap0–8. Open or too-large outlines report failure and retain prior selection. Bounds remain1024x1024 document pixels; no unbounded scan or false full-canvas success.
UXD-WF04: Layers action Use as line-art reference marks one source without changing active target or artwork, and chooses enclosed-area mode. Wand and bucket can sample that source, including a visible locked source. Hidden/missing reference fails explicitly without fallback. Marker remembered per board on this device as a tool preference, not part of exported board JSON. Clear reference action recovers to visible sampling; other named sample choices remain.
UXD-WF05: Selected coverage persists across layer switch, brush strokes and flats fill. Add/subtract combines document-space regions across shifted tap windows within existing pixel bounds; overflow fails atomically. Existing Fill selection, Clear selection, brush, Undo and redo remain.

Rejected: forcing users to redraw a lasso; implicit object mode from another tool; silently sampling a different layer when reference is missing; new native schema solely for a device tool preference. Current layout/components retained. Proportional lock of this bounded workflow; owner real-device trial remains acceptance.
